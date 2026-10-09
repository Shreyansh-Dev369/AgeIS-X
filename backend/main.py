import time
import pickle
import os
import sys
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

# Ensure backend directory is in sys.path so submodules resolve under any working directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

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
    from .ml.pipeline import get_classifier
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
    from ml.pipeline import get_classifier

# -------------------------------
# FASTAPI INIT
# -------------------------------
app = FastAPI(
    title="AgeIS-X Security Engine API",
    description="Deterministic Lexical, Syntactic, ML, Live Domain Intelligence & DOM Microservice",
    version="2.0.0"
)

# -------------------------------
# CORS CONFIGURATION
# -------------------------------
_env_origins = os.getenv("CORS_ORIGINS", os.getenv("ALLOWED_ORIGINS", ""))
_custom_origins = [o.strip() for o in _env_origins.split(",") if o.strip()]

default_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]
allowed_origins = list(set(default_origins + _custom_origins))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"^https:\/\/.*\.vercel\.app$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------
# LOAD ML CLASSIFIER (PIPELINE V2)
# -------------------------------
ml_classifier = get_classifier()

# Backward compatibility globals
model = ml_classifier.model
vectorizer = ml_classifier.tfidf
model_loaded = ml_classifier.is_loaded

if not model_loaded:
    # Legacy fallback check
    try:
        if os.path.exists(config.MODEL_PATH) and os.path.exists(config.VECTORIZER_PATH):
            with open(config.MODEL_PATH, "rb") as f:
                model = pickle.load(f)
            with open(config.VECTORIZER_PATH, "rb") as f:
                vectorizer = pickle.load(f)
            model_loaded = True
            print("[INFO] Fallback legacy model loaded")
    except Exception as e:
        print("[ERROR] Error loading legacy model:", e)


# -------------------------------
# REQUEST / RESPONSE SCHEMAS
# -------------------------------
class PredictRequest(BaseModel):
    url: str = Field(..., json_schema_extra={"example": "https://example.com"})


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
    verdict_state: Optional[str] = None
    confidence: Optional[float] = None
    analysis_status: Optional[str] = None
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
    is_model_loaded = bool(ml_classifier.is_loaded or model_loaded)
    if not is_model_loaded:
        raise HTTPException(
            status_code=503,
            detail={
                "status": "unhealthy",
                "error": "ML model failed to load or is not initialized",
                "ml_model_loaded": False,
                "version": "2.0.0"
            }
        )
    return {
        "status": "ok",
        "service": "AgeIS-X Security Intelligence Microservice (Domain + Content + DOM + Email Engine)",
        "ml_model_loaded": True,
        "model_architecture": ml_classifier.architecture if ml_classifier.is_loaded else "Legacy SGDClassifier",
        "features": {
            "rdap_intelligence": True,
            "dns_doh_intelligence": True,
            "tls_x509_intelligence": True,
            "http_dom_analysis": True,
            "ssrf_protection": True,
            "email_intelligence": True,
            "messaging_intelligence": True,
            "ml_v2_pipeline": ml_classifier.is_loaded
        },
        "version": "2.0.0"
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

    # 5. ML Inference (V2 Pipeline with legacy fallback)
    ml_probability = 0.0
    label = 0
    confidence = 0.5

    if ml_classifier.is_loaded:
        ml_probability, label, meta = ml_classifier.predict(raw_url)
        confidence = round(abs(ml_probability - 0.5) * 2.0, 3)
    elif model_loaded and model is not None and vectorizer is not None:
        try:
            X_vect = vectorizer.transform([raw_url.lower()])
            ml_probability = float(model.predict_proba(X_vect)[0][1])
            label = int(ml_probability >= 0.5)
            confidence = round(abs(ml_probability - 0.5) * 2.0, 3)
        except Exception as e:
            print("[WARN] ML prediction exception:", e)
            ml_probability = 0.5

    # 6. Production Multi-Signal Risk Aggregation (Evidence-Driven, Non-Diluting)
    analysis_status = "complete"

    # Critical SSRF / Prohibited Target
    if rdap_res.status == "blocked" or dns_res.status == "blocked" or tls_res.status == "blocked":
        combined_risk = 99
        verdict = "malicious"
        verdict_state = "PHISHING"
        analysis_status = "blocked"
    elif structural.get("is_known_benign") and not (http_res and http_res.dom and http_res.dom.brand_impersonation_suspected):
        # Known verified authentic apex or brand
        combined_risk = 2
        verdict = "safe"
        verdict_state = "LIKELY_SAFE"
    else:
        # Base risk from ML model probability (0-100)
        base_ml_risk = round(ml_probability * 100)
        structural_boost = structural.get("structural_risk_points", 0)

        # Authoritative Intelligence Adjustments
        intel_additive = 0

        # Newly registered domain (< 30 days)
        if rdap_res.domain_age_days is not None and rdap_res.domain_age_days < 30:
            intel_additive += 25
            evidence.append("Newly registered domain (< 30 days old) elevates phishing risk.")
        elif rdap_res.domain_age_days is not None and rdap_res.domain_age_days < 90:
            intel_additive += 15
        elif rdap_res.domain_age_days is not None and rdap_res.domain_age_days > 730 and structural_boost == 0:
            # Established registration on clean domain gives modest positive confirmation
            intel_additive -= 5

        # High-risk TLS: Expired, untrusted root, or hostname mismatch
        if tls_res.connected:
            if not tls_res.verified:
                intel_additive += 25
            if tls_res.is_expired:
                intel_additive += 35
            if not tls_res.hostname_match:
                intel_additive += 40
            # Note: Valid TLS certificate is NOT rewarded with score deductions because >80% of phishing uses TLS

        # High-risk DNS: Non-resolving NXDOMAIN on non-standard TLD
        if dns_res.status == "unavailable" and not structural.get("is_ip_literal"):
            intel_additive += 20

        # Content & DOM Risk Adjustments
        if http_res and http_res.dom:
            dom = http_res.dom
            if dom.brand_impersonation_suspected:
                intel_additive += 45
            if dom.has_off_domain_form_submission:
                intel_additive += 50
            if dom.has_hidden_iframes:
                intel_additive += 30
            if dom.js_signals.has_obfuscated_code:
                intel_additive += 25
            if dom.js_signals.has_context_menu_blocker:
                intel_additive += 15

        # Weighted score combination
        weighted_score = int(
            (base_ml_risk * 0.50)
            + (structural_boost * 0.35)
            + (min(100, max(0, intel_additive)) * 0.15)
        )

        # High-confidence ML probability must not be diluted below malicious threshold
        if base_ml_risk >= 85:
            weighted_score = max(weighted_score, base_ml_risk)

        combined_risk = min(100, max(0, weighted_score))

        # Enforce deterministic high-risk floors on critical malicious indicators
        if (
            structural.get("has_homoglyphs")
            or structural.get("has_userinfo")
            or structural.get("is_typosquat_pattern")
            or structural.get("brand_impersonation")
            or (http_res and http_res.dom and http_res.dom.brand_impersonation_suspected)
            or (tls_res.connected and not tls_res.hostname_match)
        ):
            combined_risk = max(combined_risk, 88)
        elif http_res and http_res.dom and http_res.dom.has_off_domain_form_submission:
            combined_risk = max(combined_risk, 90)
        elif structural.get("is_ip_literal") and structural.get("has_non_standard_port"):
            combined_risk = max(combined_risk, 80)
        elif structural.get("is_ip_literal"):
            combined_risk = max(combined_risk, 65)

        # Determine explicit verdict states
        if combined_risk >= 70:
            verdict = "malicious"
            verdict_state = "PHISHING"
        elif combined_risk >= 30:
            verdict = "suspicious"
            verdict_state = "SUSPICIOUS"
        else:
            # Check for insufficient external evidence
            intel_missing = (rdap_res.status == "unavailable" and dns_res.status == "unavailable")
            if intel_missing and not structural.get("is_authentic_brand"):
                verdict = "safe"
                verdict_state = "INCONCLUSIVE"
                analysis_status = "inconclusive"
            else:
                verdict = "safe"
                verdict_state = "LIKELY_SAFE"

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
        "verdict_state": verdict_state,
        "confidence": confidence,
        "analysis_status": analysis_status,
        "model_info": {
            "name": "AgeIS-X Multi-Signal Domain & Content Security Engine (V2)",
            "architecture": ml_classifier.architecture if ml_classifier.is_loaded else "Legacy SGDClassifier",
            "version": "2.0.0",
            "inference_time_ms": elapsed_ms
        },
        "features": {
            "scheme": structural.get("scheme"),
            "hostname": hostname,
            "registered_domain": structural.get("registered_domain"),
            "is_https": structural.get("is_https"),
            "is_ip_literal": structural.get("is_ip_literal"),
            "is_authentic_brand": structural.get("is_authentic_brand"),
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
            "brand_impersonation": structural.get("brand_impersonation"),
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
            "ml_model": ml_classifier.is_loaded or model_loaded,
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