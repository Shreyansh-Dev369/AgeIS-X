from typing import Dict, Tuple, List
from .models import SecurityHeadersIntelligence
try:
    from intelligence.models import EvidenceItem
except ImportError:
    from ..intelligence.models import EvidenceItem

def analyze_security_headers(headers: Dict[str, str]) -> Tuple[SecurityHeadersIntelligence, List[EvidenceItem]]:
    """
    Analyzes HTTP response headers for defensive security posture, missing controls,
    and server software disclosure.
    """
    # Lowercase all header keys for case-insensitive lookup
    norm_headers = {k.lower(): v for k, v in headers.items()}
    evidence: List[EvidenceItem] = []
    missing: List[str] = []

    # 1. HSTS (Strict-Transport-Security)
    hsts = norm_headers.get("strict-transport-security")
    has_hsts = hsts is not None
    if not has_hsts:
        missing.append("Strict-Transport-Security (HSTS)")

    # 2. CSP (Content-Security-Policy)
    csp = norm_headers.get("content-security-policy")
    has_csp = csp is not None
    if not has_csp:
        missing.append("Content-Security-Policy (CSP)")

    # 3. X-Frame-Options
    xfo = norm_headers.get("x-frame-options")
    has_xfo = xfo is not None
    if not has_xfo:
        missing.append("X-Frame-Options (Clickjacking Protection)")

    # 4. X-Content-Type-Options
    xcto = norm_headers.get("x-content-type-options")
    has_xcto = xcto is not None and "nosniff" in xcto.lower()
    if not has_xcto:
        missing.append("X-Content-Type-Options: nosniff")

    # 5. Referrer-Policy
    ref_policy = norm_headers.get("referrer-policy")

    # 6. Server Version Disclosure
    server = norm_headers.get("server")
    if server:
        evidence.append(EvidenceItem(
            signal="http_server_header",
            value=server[:32],
            severity="info",
            source="http_headers",
            description=f"Server header advertised: {server[:48]}"
        ))

    # Evidence Generation
    if has_hsts and has_csp and has_xfo:
        evidence.append(EvidenceItem(
            signal="http_strong_security_headers",
            value="HSTS, CSP, XFO",
            severity="info",
            source="http_headers",
            description="Robust defensive HTTP security headers present (HSTS, CSP, X-Frame-Options)"
        ))
    elif len(missing) >= 3:
        evidence.append(EvidenceItem(
            signal="http_missing_security_headers",
            value=missing,
            severity="medium",
            source="http_headers",
            description=f"Missing key HTTP defensive headers: {', '.join(missing[:3])}"
        ))

    intel = SecurityHeadersIntelligence(
        has_hsts=has_hsts,
        hsts_value=hsts,
        has_csp=has_csp,
        csp_value=csp,
        has_x_frame_options=has_xfo,
        x_frame_options_value=xfo,
        has_x_content_type_options=has_xcto,
        referrer_policy=ref_policy,
        server_header=server,
        missing_headers=missing
    )

    return intel, evidence
