import time
import pickle
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

try:
    from . import config
    from .utils import parse_url_structure
    from .intelligence import gather_domain_intelligence
    from .intelligence.models import RDAPIntelligence, DNSIntelligence, TLSIntelligence
    from .content import fetch_and_analyze_http, HTTPResponseIntelligence
    from .email_intel import analyze_email_raw, analyze_message_text
    from .email_intel.models import (
        EmailAnalysisRequest,
        EmailIntelligence,
        MessageAnalysisRequest,
        MessageIntelligence
    )
except ImportError:
    import config
    from utils import parse_url_structure
    from intelligence import gather_domain_intelligence
    from intelligence.models import RDAPIntelligence, DNSIntelligence, TLSIntelligence
    from content import fetch_and_analyze_http, HTTPResponseIntelligence
    from email_intel import analyze_email_raw, analyze_message_text
    from email_intel.models import (
        EmailAnalysisRequest,
        EmailIntelligence,
        MessageAnalysisRequest,
        MessageIntelligence
    )

# -------------------------------
# FASTAPI INIT
# -------------------------------
app = FastAPI(
    title="AgeIS-X Security Engine API",
    description="Deterministic Lexical, Syntactic, ML, Live Domain Intelligence & DOM Microservice",
    version="1.2.0"
)

# -------------------------------
# CORS
# -------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------
# LOAD MODEL & VECTORIZER
# -------------------------------
model = None
vectorizer = None
model_loaded = False

try:
    if os.path.exists(config.MODEL_PATH) and os.path.exists(config.VECTORIZER_PATH):
        with open(config.MODEL_PATH, "rb") as f:
            model = pickle.load(f)

        with open(config.VECTORIZER_PATH, "rb") as f:
            vectorizer = pickle.load(f)

        model_loaded = True
        print("[INFO] Model and vectorizer loaded successfully")
    else:
        print(f"[WARN] Model files not found at {config.MODEL_PATH} or {config.VECTORIZER_PATH}")

except Exception as e:
    print("[ERROR] Error loading model:", e)


# -------------------------------
# REQUEST / RESPONSE SCHEMAS
# -------------------------------
class PredictRequest(BaseModel):
    url: str = Field(..., example="https://example.com")


class ModelInfo(BaseModel):
    name: str
    architecture: str
    version: str
    inference_time_ms: float


class AvailabilityInfo(BaseModel):
    backend: bool
    ml_model: bool
    domain_intelligence: bool
    tls_inspection: bool
    dns_intelligence: bool
    http_acquisition: bool = True
    dom_analysis: bool = True


class PredictResponse(BaseModel):
    url: str
    label: int
    probability: float
    risk_score: int
    verdict: str
    model_info: ModelInfo
    features: Dict[str, Any]
    rdap: RDAPIntelligence
    dns: DNSIntelligence
    tls: TLSIntelligence
    http: Optional[HTTPResponseIntelligence] = None
    evidence: List[str]
    availability: AvailabilityInfo
    limitations: List[str]
    timestamp: float


# -------------------------------
# HEALTH CHECK
# -------------------------------
@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "AgeIS-X Security Intelligence Microservice (Domain + Content + DOM + Email Engine)",
        "ml_model_loaded": model_loaded,
        "features": {
            "rdap_intelligence": True,
            "dns_doh_intelligence": True,
            "tls_x509_intelligence": True,
            "http_dom_analysis": True,
            "ssrf_protection": True,
            "email_intelligence": True,
            "messaging_intelligence": True
        },
        "version": "1.3.0"
    }


# -------------------------------
# PREDICT API
# -------------------------------
@app.post("/predict", response_model=PredictResponse)
def predict(request: PredictRequest):
    start_time = time.time()
    raw_url = request.url.strip()

    if not raw_url or len(raw_url) < 3:
        raise HTTPException(status_code=400, detail="Invalid URL: String too short")

    # 1. Deterministic Structural & Unicode Analysis
    structural = parse_url_structure(raw_url)
    evidence: List[str] = list(structural.get("evidence", []))
    hostname = structural.get("hostname", "")
    is_https = structural.get("is_https", True)

    # 2. Extract port from structural parser
    port = structural.get("port", 443 if is_https else 80)

    # 3. Live Authoritative Domain Intelligence (RDAP, DNS, TLS) with SSRF Guard
    rdap_res, dns_res, tls_res, intel_evidence = gather_domain_intelligence(
        hostname=hostname,
        port=port,
        is_https=is_https
    )

    for item in intel_evidence:
        if item.description not in evidence:
            evidence.append(item.description)

    # 4. SSRF-Safe HTTP Acquisition & DOM/Headers/JS Analysis
    http_res: Optional[HTTPResponseIntelligence] = None
    if rdap_res.status != "blocked" and dns_res.status != "blocked" and tls_res.status != "blocked":
        try:
            http_res, http_evidence = fetch_and_analyze_http(raw_url)
            for item in http_evidence:
                if item.description not in evidence:
                    evidence.append(item.description)
        except Exception as e:
            http_res = HTTPResponseIntelligence(status="error", error=str(e))
    else:
        http_res = HTTPResponseIntelligence(status="blocked", error="Blocked by SSRF filter")

    # 5. ML Inference (if model loaded)
    normalized_for_ml = raw_url.lower()
    ml_probability = 0.0
    label = 0

    if model_loaded and model is not None and vectorizer is not None:
        try:
            X_vect = vectorizer.transform([normalized_for_ml])
            ml_probability = float(model.predict_proba(X_vect)[0][1])
            label = int(ml_probability >= 0.5)
        except Exception as e:
            print("[WARN] ML prediction exception:", e)
            ml_probability = 0.5

    # 6. Production Risk Aggregation (ML + Structural + RDAP + DNS + TLS + DOM)
    # Check for Critical SSRF / Prohibited Target
    if rdap_res.status == "blocked" or dns_res.status == "blocked" or tls_res.status == "blocked":
        combined_risk = 99
        verdict = "malicious"
    elif structural.get("is_known_benign") and not (http_res and http_res.dom and http_res.dom.brand_impersonation_suspected):
        combined_risk = 2
        verdict = "safe"
    else:
        # Base risk from ML model probability (0-100)
        base_ml_risk = round(ml_probability * 100)
        structural_boost = structural.get("structural_risk_points", 0)

        # Intelligence Risk Adjustments
        intel_adjustment = 0

        # High-risk RDAP: Newly registered domain (< 30 days)
        if rdap_res.domain_age_days is not None and rdap_res.domain_age_days < 30:
            intel_adjustment += 30
        elif rdap_res.domain_age_days is not None and rdap_res.domain_age_days < 90:
            intel_adjustment += 15
        elif rdap_res.domain_age_days is not None and rdap_res.domain_age_days > 730:
            # Established registration gives modest positive signal
            intel_adjustment -= 10

        # High-risk TLS: Expired, untrusted root, or hostname mismatch
        if tls_res.connected:
            if not tls_res.verified:
                intel_adjustment += 25
            if tls_res.is_expired:
                intel_adjustment += 35
            if not tls_res.hostname_match:
                intel_adjustment += 40
            elif tls_res.verified and not tls_res.is_expired:
                # Valid trusted cert gives positive signal
                intel_adjustment -= 10

        # High-risk DNS: Non-resolving NXDOMAIN on non-standard TLD
        if dns_res.status == "unavailable" and not structural.get("is_ip_literal"):
            intel_adjustment += 20

        # Content & DOM Risk Adjustments
        if http_res and http_res.dom:
            dom = http_res.dom
            if dom.brand_impersonation_suspected:
                intel_adjustment += 45
            if dom.has_off_domain_form_submission:
                intel_adjustment += 50
            if dom.has_hidden_iframes:
                intel_adjustment += 30
            if dom.js_signals.has_obfuscated_code:
                intel_adjustment += 25
            if dom.js_signals.has_context_menu_blocker:
                intel_adjustment += 15

        if http_res and http_res.headers:
            if http_res.headers.has_hsts and http_res.headers.has_csp:
                intel_adjustment -= 10

        # Calculate combined score
        calculated_score = int((base_ml_risk * 0.35) + (structural_boost * 0.30) + (intel_adjustment * 0.35))
        combined_risk = min(100, max(0, calculated_score))

        # Enforce high-risk floors on critical deterministic indicators
        if (
            structural.get("has_homoglyphs")
            or structural.get("has_userinfo")
            or structural.get("is_typosquat_pattern")
            or structural.get("brand_impersonation")
            or (http_res and http_res.dom and http_res.dom.brand_impersonation_suspected)
            or (tls_res.connected and not tls_res.hostname_match)
        ):
            combined_risk = max(combined_risk, 85)
        elif http_res and http_res.dom and http_res.dom.has_off_domain_form_submission:
            combined_risk = max(combined_risk, 90)
        elif structural.get("is_ip_literal") and structural.get("has_non_standard_port"):
            combined_risk = max(combined_risk, 75)
        elif structural.get("is_ip_literal"):
            combined_risk = max(combined_risk, 60)

        if combined_risk >= 70:
            verdict = "malicious"
        elif combined_risk >= 30:
            verdict = "suspicious"
        else:
            verdict = "safe"

    if not evidence:
        evidence.append("No suspicious lexical tokens, homoglyphs, or obfuscations detected in URL structure.")

    elapsed_ms = round((time.time() - start_time) * 1000, 2)

    limitations: List[str] = []
    if rdap_res.status != "available":
        limitations.append(f"RDAP domain registration intelligence: {rdap_res.status}")
    if tls_res.status != "available":
        limitations.append(f"TLS certificate inspection: {tls_res.status}")
    if dns_res.status != "available":
        limitations.append(f"DNS public resolution: {dns_res.status}")
    if http_res and http_res.status != "available":
        limitations.append(f"HTTP/DOM acquisition: {http_res.status}")

    return {
        "url": raw_url,
        "label": label,
        "probability": round(ml_probability, 4),
        "risk_score": combined_risk,
        "verdict": verdict,
        "model_info": {
            "name": "AgeIS-X Multi-Signal Domain & Content Security Engine",
            "architecture": "SGDClassifier + Structural Analysis + RDAP/DNS/TLS Probing + Static DOM/Headers/JS Scanner",
            "version": "1.2.0",
            "inference_time_ms": elapsed_ms
        },
        "features": {
            "scheme": structural.get("scheme"),
            "hostname": hostname,
            "is_https": structural.get("is_https"),
            "is_ip_literal": structural.get("is_ip_literal"),
            "has_userinfo": structural.get("has_userinfo"),
            "has_non_standard_port": structural.get("has_non_standard_port"),
            "has_homoglyphs": structural.get("has_homoglyphs"),
            "homoglyph_details": structural.get("homoglyph_details"),
            "is_punycode": structural.get("is_punycode"),
            "punycode_decoded": structural.get("punycode_decoded"),
            "is_typosquat_pattern": structural.get("is_typosquat_pattern"),
            "subdomain_depth": structural.get("subdomain_depth"),
            "tld": structural.get("tld"),
            "is_suspicious_tld": structural.get("is_suspicious_tld"),
            "entropy": structural.get("entropy"),
            "suspicious_keywords": structural.get("suspicious_keywords")
        },
        "rdap": rdap_res,
        "dns": dns_res,
        "tls": tls_res,
        "http": http_res,
        "evidence": evidence,
        "availability": {
            "backend": True,
            "ml_model": model_loaded,
            "domain_intelligence": rdap_res.status == "available",
            "tls_inspection": tls_res.status == "available",
            "dns_intelligence": dns_res.status == "available",
            "http_acquisition": http_res.status == "available" if http_res else False,
            "dom_analysis": (http_res is not None and http_res.dom is not None)
        },
        "limitations": limitations if limitations else ["All domain intelligence and DOM acquisition providers returned authoritative data."],
        "timestamp": time.time()
    }


# -------------------------------
# EMAIL THREAT INTELLIGENCE API (M-03)
# -------------------------------
@app.post("/analyze/email", response_model=EmailIntelligence)
def analyze_email_endpoint(request: EmailAnalysisRequest):
    raw_email = request.raw_email
    if not raw_email or not raw_email.strip():
        raise HTTPException(status_code=400, detail="Empty email content provided")
    return analyze_email_raw(raw_email)


# -------------------------------
# MESSAGING / SOCIAL ENGINEERING API (M-03)
# -------------------------------
@app.post("/analyze/message", response_model=MessageIntelligence)
def analyze_message_endpoint(request: MessageAnalysisRequest):
    message_text = request.message
    if not message_text or not message_text.strip():
        raise HTTPException(status_code=400, detail="Empty message text provided")
    return analyze_message_text(message_text, sender=request.sender)