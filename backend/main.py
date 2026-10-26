import time
import pickle
import os
import sys
from urllib.parse import urlparse
from fastapi import FastAPI, HTTPException, UploadFile, File
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
    from .engines.common import StandardEngineResponse
    from .engines.m02_content import analyze_web_content, ContentAnalysisRequest
    from .engines.m04_endpoint import analyze_endpoint_events, EndpointAnalysisRequest
    from .engines.m05_network import analyze_network_events, NetworkAnalysisRequest
    from .engines.m06_identity import analyze_identity_events, IdentityAnalysisRequest
    from .engines.m07_payment_scam import analyze_payment_scam, PaymentScamRequest
    from .engines.m08_file_malware import analyze_file_request, analyze_file_content, FileAnalysisRequest
    from .engines.m09_visual_threat import analyze_visual_threat, analyze_image_bytes, VisualAnalysisRequest
    from .engines.m10_threat_intel import analyze_threat_intelligence, ThreatIntelLookupRequest
    from .engines.m11_privacy import analyze_privacy_report, PrivacyAnalysisRequest
    from .engines.m12_ai_security import analyze_ai_security, AISecurityRequest
    from .engines.m13_behavioural import analyze_behavioural_correlation, BehaviouralAnalysisRequest
    from .engines.m14_unified_risk import analyze_unified_risk, UnifiedRiskRequest
    from .engines.scenarios import execute_scenario, SCENARIO_CATALOG, ScenarioMetadata, ScenarioExecutionResult
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
    from engines.common import StandardEngineResponse
    from engines.m02_content import analyze_web_content, ContentAnalysisRequest
    from engines.m04_endpoint import analyze_endpoint_events, EndpointAnalysisRequest
    from engines.m05_network import analyze_network_events, NetworkAnalysisRequest
    from engines.m06_identity import analyze_identity_events, IdentityAnalysisRequest
    from engines.m07_payment_scam import analyze_payment_scam, PaymentScamRequest
    from engines.m08_file_malware import analyze_file_request, analyze_file_content, FileAnalysisRequest
    from engines.m09_visual_threat import analyze_visual_threat, analyze_image_bytes, VisualAnalysisRequest
    from engines.m10_threat_intel import analyze_threat_intelligence, ThreatIntelLookupRequest
    from engines.m11_privacy import analyze_privacy_report, PrivacyAnalysisRequest
    from engines.m12_ai_security import analyze_ai_security, AISecurityRequest
    from engines.m13_behavioural import analyze_behavioural_correlation, BehaviouralAnalysisRequest
    from engines.m14_unified_risk import analyze_unified_risk, UnifiedRiskRequest
    from engines.scenarios import execute_scenario, SCENARIO_CATALOG, ScenarioMetadata, ScenarioExecutionResult

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
            "ml_v2_pipeline": ml_classifier.is_loaded,
            "demo_lab_m01_m14": True,
            "engines_available": [
                "M-01", "M-02", "M-03", "M-04", "M-05", "M-06",
                "M-07", "M-08", "M-09", "M-10", "M-11", "M-12",
                "M-13", "M-14"
            ]
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

    if len(raw_url) > 2048:
        raise HTTPException(status_code=400, detail="Invalid URL: String exceeds maximum length of 2048 characters")

    parsed_check = urlparse(raw_url if "://" in raw_url else "http://" + raw_url)
    if parsed_check.scheme and parsed_check.scheme.lower() not in ("http", "https"):
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported URL scheme '{parsed_check.scheme}'. Only HTTP and HTTPS schemes are supported for security analysis."
        )

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
    # Only initiate HTTP socket connections if DNS resolved successfully and host is safe
    http_res: Optional[HTTPResponseIntelligence] = None
    if dns_res.status == "available" and rdap_res.status != "blocked" and tls_res.status != "blocked":
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
    else:
        # Base risk from ML model probability (0-100)
        base_ml_risk = round(ml_probability * 100)

        # Calibrate authentic brand portals / known benign:
        # Discount spurious login/signin n-gram risk on verified authentic roots when structure is clean
        has_critical_structural_threats = bool(
            structural.get("has_executable_extension")
            or structural.get("has_open_redirect")
            or structural.get("has_path_traversal")
            or structural.get("has_homoglyphs")
            or structural.get("has_userinfo")
            or structural.get("is_typosquat_pattern")
            or structural.get("brand_impersonation")
            or structural.get("has_non_standard_port")
        )
        if (structural.get("is_authentic_brand") or structural.get("is_known_benign")) and not has_critical_structural_threats:
            base_ml_risk = min(base_ml_risk, 10)

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
        if base_ml_risk >= 85 and not (structural.get("is_authentic_brand") or structural.get("is_known_benign")):
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
        elif structural.get("has_executable_extension"):
            combined_risk = max(combined_risk, 85)
        elif structural.get("has_open_redirect"):
            combined_risk = max(combined_risk, 72)
        elif structural.get("has_path_traversal"):
            combined_risk = max(combined_risk, 70)
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
            if intel_missing and not (structural.get("is_authentic_brand") or structural.get("is_known_benign")):
                verdict = "inconclusive"
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
            "suspicious_keywords": structural.get("suspicious_keywords"),
            "is_known_benign": structural.get("is_known_benign"),
            "has_executable_extension": structural.get("has_executable_extension"),
            "has_open_redirect": structural.get("has_open_redirect"),
            "has_path_traversal": structural.get("has_path_traversal")
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


# ------------------------------------------------------------------------------
# DEMO LAB: MODULAR INTELLIGENCE ENGINES (M-02 THROUGH M-14)
# ------------------------------------------------------------------------------

@app.post("/api/m02/content", response_model=StandardEngineResponse)
def api_m02_content(request: ContentAnalysisRequest):
    """M-02: Web Content Intelligence Engine."""
    return analyze_web_content(request)


@app.post("/api/m04/endpoint", response_model=StandardEngineResponse)
def api_m04_endpoint(request: EndpointAnalysisRequest):
    """M-04: Endpoint Security Lab (Synthetic Telemetry Analyzer)."""
    return analyze_endpoint_events(request)


@app.post("/api/m05/network", response_model=StandardEngineResponse)
def api_m05_network(request: NetworkAnalysisRequest):
    """M-05: Network Intelligence Lab (Beaconing & DNS DGA Analyzer)."""
    return analyze_network_events(request)


@app.post("/api/m06/identity", response_model=StandardEngineResponse)
def api_m06_identity(request: IdentityAnalysisRequest):
    """M-06: Identity Security Lab (Impossible Travel & Auth Tampering)."""
    return analyze_identity_events(request)


@app.post("/api/m07/scam", response_model=StandardEngineResponse)
def api_m07_scam(request: PaymentScamRequest):
    """M-07: Payment & Scam Intelligence (BEC, Crypto & Urgency Heuristics)."""
    return analyze_payment_scam(request)


@app.post("/api/m08/file", response_model=StandardEngineResponse)
def api_m08_file(request: FileAnalysisRequest):
    """M-08: File & Malware Analysis (Signature & Static String Inspection)."""
    return analyze_file_request(request)


MAX_UPLOAD_SIZE = 10 * 1024 * 1024  # 10 MiB limit
UPLOAD_CHUNK_SIZE = 64 * 1024  # 64 KiB buffer

async def read_bounded_upload(file: UploadFile, max_bytes: int = MAX_UPLOAD_SIZE) -> bytes:
    """Reads uploaded file stream in bounded chunks enforcing a strict maximum size limit."""
    total_bytes = 0
    chunks = []
    while True:
        chunk = await file.read(UPLOAD_CHUNK_SIZE)
        if not chunk:
            break
        total_bytes += len(chunk)
        if total_bytes > max_bytes:
            raise HTTPException(
                status_code=413,
                detail=f"Uploaded file exceeds maximum permitted size of {max_bytes // (1024 * 1024)} MiB"
            )
        chunks.append(chunk)
    return b"".join(chunks)


@app.post("/api/m08/upload", response_model=StandardEngineResponse)
async def api_m08_upload(file: UploadFile = File(...)):
    """M-08: Safe Live File Upload for SHA-256 and Extension-Magic Verification."""
    contents = await read_bounded_upload(file)
    return analyze_file_content(file.filename or "uploaded_sample.bin", contents, is_live_upload=True)


@app.post("/api/m09/visual", response_model=StandardEngineResponse)
def api_m09_visual(request: VisualAnalysisRequest):
    """M-09: Visual Threat Intelligence (Geometry & Color Distribution Analyzer)."""
    return analyze_visual_threat(request)


@app.post("/api/m09/upload", response_model=StandardEngineResponse)
async def api_m09_upload(file: UploadFile = File(...)):
    """M-09: Safe Live Screenshot Upload for Visual Phishing/Scareware Inspection."""
    contents = await read_bounded_upload(file)
    return analyze_image_bytes(file.filename or "uploaded_screenshot.png", contents, is_live_upload=True)


@app.post("/api/m10/threat-intel", response_model=StandardEngineResponse)
def api_m10_threat_intel(request: ThreatIntelLookupRequest):
    """M-10: Threat Intelligence IoC Lookup (Domains, IPs & Hashes)."""
    return analyze_threat_intelligence(request)


@app.post("/api/m11/privacy", response_model=StandardEngineResponse)
def api_m11_privacy(request: PrivacyAnalysisRequest):
    """M-11: Privacy Intelligence (Canvas Fingerprinting & Data Broker Audits)."""
    return analyze_privacy_report(request)


@app.post("/api/m12/ai-security", response_model=StandardEngineResponse)
def api_m12_ai_security(request: AISecurityRequest):
    """M-12: AI Security Lab (Prompt Injection & Jailbreak Defense Guardrails)."""
    return analyze_ai_security(request)


@app.post("/api/m13/behavioural", response_model=StandardEngineResponse)
def api_m13_behavioural(request: BehaviouralAnalysisRequest):
    """M-13: Behavioural Analysis (Multi-Stage Chronological Correlation)."""
    return analyze_behavioural_correlation(request)


@app.post("/api/m14/unified-risk", response_model=StandardEngineResponse)
def api_m14_unified_risk(request: UnifiedRiskRequest):
    """M-14: Unified Risk & Meta Decision (Explainable Category-Weighted Aggregation)."""
    return analyze_unified_risk(request)


# ------------------------------------------------------------------------------
# DEMO LAB: PRESENTATION SCENARIOS (A, B, C, D)
# ------------------------------------------------------------------------------

@app.get("/api/scenarios", response_model=Dict[str, ScenarioMetadata])
def api_list_scenarios():
    """Lists the 4 presentation-ready academic demonstration scenarios."""
    return SCENARIO_CATALOG


class RunScenarioRequest(BaseModel):
    scenario_id: str = "scenario_d"


@app.post("/api/scenarios/run", response_model=ScenarioExecutionResult)
def api_run_scenario(request: RunScenarioRequest):
    """Executes a complete demonstration scenario through the real backend logic."""
    return execute_scenario(request.scenario_id)
