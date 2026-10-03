import re
from html.parser import HTMLParser
from urllib.parse import urlparse, urljoin
from typing import Tuple, List, Dict, Any, Optional

from .models import HTMLDOMIntelligence, FormAnalysis, FormField, IframeAnalysis, JSSecuritySignals
from intelligence.models import EvidenceItem
from intelligence.rdap import extract_apex_domain
from utils import TARGETED_BRANDS, KNOWN_BENIGN_APEX

MAX_FORMS_TO_PARSE = 25
MAX_IFRAMES_TO_PARSE = 25
MAX_SCRIPTS_TO_PARSE = 50
MAX_TITLE_CHARS = 256
MAX_META_CHARS = 512

SENSITIVE_FIELD_NAMES = {
    "password", "pass", "pwd", "secret", "cvv", "cvc", "card_number",
    "cc_number", "ssn", "creditcard", "pin", "auth_token", "otp", "token"
}

PAYMENT_FIELD_NAMES = {
    "cvv", "cvc", "card_number", "cc_number", "creditcard", "cardnumber", "exp_date"
}

AUTH_KEYWORDS = {
    "login", "signin", "sign in", "verify", "verification", "auth",
    "account", "banking", "secure", "password", "credential", "portal"
}

class DOMSecurityScanner(HTMLParser):
    def __init__(self, base_url: str):
        super().__init__()
        self.base_url = base_url
        self.base_hostname = (urlparse(base_url).hostname or "").strip("[]").strip(".").lower()
        self.base_apex = extract_apex_domain(self.base_hostname)
        self.title_text: List[str] = []
        self.in_title = False
        self.meta_description: Optional[str] = None
        
        self.forms: List[FormAnalysis] = []
        self.current_form: Optional[FormAnalysis] = None
        
        self.iframes: List[IframeAnalysis] = []
        self.total_scripts = 0
        self.external_scripts = 0
        self.inline_scripts: List[str] = []
        self.in_script = False

    def handle_starttag(self, tag: str, attrs: List[Tuple[str, Optional[str]]]):
        attr_dict = {k.lower(): (v or "") for k, v in attrs}
        
        # 1. Page Title
        if tag == "title":
            self.in_title = True

        # 2. Meta Tags
        elif tag == "meta":
            name = attr_dict.get("name", "").lower()
            prop = attr_dict.get("property", "").lower()
            if name == "description" or prop == "og:description":
                content = attr_dict.get("content", "")
                self.meta_description = content[:MAX_META_CHARS]

        # 3. Form Tags
        elif tag == "form":
            if len(self.forms) >= MAX_FORMS_TO_PARSE:
                return

            action = attr_dict.get("action", "")
            method = attr_dict.get("method", "get").lower()
            
            # Resolve relative action URLs
            resolved_action = urljoin(self.base_url, action) if action else self.base_url
            action_parsed = urlparse(resolved_action)
            action_host = (action_parsed.hostname or self.base_hostname).strip("[]").strip(".").lower()
            action_apex = extract_apex_domain(action_host)
            
            # True cross-site / off-domain action checks if apex domains differ
            is_off_domain = bool(action_host) and (action_apex != self.base_apex)
            is_http_on_https = self.base_url.startswith("https://") and resolved_action.startswith("http://")

            self.current_form = FormAnalysis(
                action=resolved_action[:256],
                method=method,
                is_off_domain_action=is_off_domain,
                is_http_action_on_https=is_http_on_https,
                fields=[]
            )

        # 4. Form Inputs
        elif tag == "input" and self.current_form is not None:
            input_type = attr_dict.get("type", "text").lower()
            name = attr_dict.get("name", "").lower()
            autocomplete = attr_dict.get("autocomplete", "").lower()
            
            is_password = input_type == "password" or "pass" in name or "password" in autocomplete
            is_payment = name in PAYMENT_FIELD_NAMES or "cc-" in autocomplete or "card" in name
            is_sensitive = is_password or is_payment or name in SENSITIVE_FIELD_NAMES or "one-time-code" in autocomplete
            
            if is_password:
                self.current_form.has_password_field = True
            if is_payment:
                self.current_form.has_payment_field = True

            if len(self.current_form.fields) < 30:
                self.current_form.fields.append(FormField(
                    name=name[:64] if name else None,
                    type=input_type[:32],
                    is_password=is_password,
                    is_sensitive=is_sensitive
                ))

        # 5. Iframe Tags
        elif tag == "iframe":
            if len(self.iframes) >= MAX_IFRAMES_TO_PARSE:
                return

            src = attr_dict.get("src", "")
            resolved_src = urljoin(self.base_url, src) if src else ""
            src_parsed = urlparse(resolved_src)
            src_host = (src_parsed.hostname or "").strip("[]").strip(".").lower()
            src_apex = extract_apex_domain(src_host)
            is_off_domain = bool(src_host) and (src_apex != self.base_apex)
            
            style = attr_dict.get("style", "").lower()
            width = attr_dict.get("width", "")
            height = attr_dict.get("height", "")
            is_hidden = (
                "display:none" in style.replace(" ", "")
                or "visibility:hidden" in style.replace(" ", "")
                or width in ("0", "0px")
                or height in ("0", "0px")
                or "hidden" in attr_dict
            )

            self.iframes.append(IframeAnalysis(
                src=resolved_src[:256] if resolved_src else None,
                is_hidden=is_hidden,
                is_off_domain=is_off_domain
            ))

        # 6. Script Tags
        elif tag == "script":
            self.total_scripts += 1
            src = attr_dict.get("src", "")
            if src:
                self.external_scripts += 1
            elif len(self.inline_scripts) < MAX_SCRIPTS_TO_PARSE:
                self.in_script = True

    def handle_endtag(self, tag: str):
        if tag == "title":
            self.in_title = False
        elif tag == "form":
            if self.current_form is not None:
                self.forms.append(self.current_form)
                self.current_form = None
        elif tag == "script":
            self.in_script = False

    def handle_data(self, data: str):
        if self.in_title and len("".join(self.title_text)) < MAX_TITLE_CHARS:
            self.title_text.append(data)
        elif self.in_script:
            # Bound inline script accumulation
            if len(self.inline_scripts) < MAX_SCRIPTS_TO_PARSE:
                self.inline_scripts.append(data[:4096])

def analyze_javascript_signals(inline_scripts: List[str], raw_html: str) -> Tuple[JSSecuritySignals, List[EvidenceItem]]:
    """Analyzes inline scripts and event handlers for obfuscation and hostile patterns."""
    combined_js = "\n".join(inline_scripts) + "\n" + raw_html
    patterns: List[str] = []
    evidence: List[EvidenceItem] = []

    # 1. Dynamic Code Execution (eval, Function constructor)
    has_eval = bool(re.search(r'\beval\s*\(', combined_js) or re.search(r'\bnew\s+Function\s*\(', combined_js))
    if has_eval:
        patterns.append("Dynamic code execution: eval() / Function()")
        evidence.append(EvidenceItem(
            signal="js_eval_detected",
            value="eval() / Function()",
            severity="medium",
            source="javascript",
            description="Dynamic JavaScript code execution primitive detected (eval / new Function)"
        ))

    # 2. DOM Injection (document.write)
    has_doc_write = bool(re.search(r'\bdocument\.write\s*\(', combined_js))
    if has_doc_write:
        patterns.append("DOM Injection: document.write()")

    # 3. Deliberate Obfuscation (Repeated hex sequences, char code construction, or unescape)
    has_obfuscation = bool(
        re.search(r'(?:\\x[0-9a-fA-F]{2}){4,}', combined_js)
        or re.search(r'(?:\\u[0-9a-fA-F]{4}){4,}', combined_js)
        or re.search(r'String\.fromCharCode\s*\(', combined_js)
        or re.search(r'\bunescape\s*\(', combined_js)
    )
    if has_obfuscation:
        patterns.append("High-density Hex/CharCode string obfuscation")
        evidence.append(EvidenceItem(
            signal="js_obfuscation",
            value="Hex/CharCode Obfuscation",
            severity="high",
            source="javascript",
            description="Obfuscated JavaScript payload detected (repeated hex escapes / fromCharCode / unescape)"
        ))

    # 4. Anti-Inspection (Context menu and right click blockers)
    has_context_blocker = bool(
        re.search(r'oncontextmenu\s*=\s*["\']?return\s+false', combined_js, re.IGNORECASE)
        or ("oncontextmenu" in combined_js.lower() and "return false" in combined_js.lower())
        or ("contextmenu" in combined_js.lower() and "preventdefault" in combined_js.lower())
    )
    if has_context_blocker:
        patterns.append("Anti-inspection: Right-click / Context Menu Blocker")
        evidence.append(EvidenceItem(
            signal="js_anti_inspection",
            value="ContextMenu Disabled",
            severity="medium",
            source="javascript",
            description="Page disables right-click context menu to prevent user inspection of source code"
        ))

    has_clipboard_manipulation = bool(
        "navigator.clipboard.writeText" in combined_js
        or "execCommand('copy')" in combined_js
    )

    signals = JSSecuritySignals(
        has_eval=has_eval,
        has_document_write=has_doc_write,
        has_obfuscated_code=has_obfuscation,
        has_context_menu_blocker=has_context_blocker,
        has_clipboard_manipulation=has_clipboard_manipulation,
        suspicious_patterns=patterns
    )

    return signals, evidence

def analyze_html_dom(html_content: str, base_url: str) -> Tuple[HTMLDOMIntelligence, List[EvidenceItem]]:
    """
    Parses HTML content and extracts comprehensive DOM, form, iframe, script, and brand signals.
    """
    evidence: List[EvidenceItem] = []
    parser = DOMSecurityScanner(base_url)
    try:
        parser.feed(html_content)
    except Exception:
        pass

    full_title = "".join(parser.title_text).strip()[:MAX_TITLE_CHARS]
    title_lower = full_title.lower()
    base_host = parser.base_hostname.lower()
    base_apex = parser.base_apex.lower()

    # Form analysis
    has_credential_form = any(f.has_password_field for f in parser.forms)
    has_off_domain_submission = any(f.is_off_domain_action for f in parser.forms if f.has_password_field or f.has_payment_field)

    # 1. Brand Impersonation Heuristic
    detected_brand: Optional[str] = None
    brand_impersonation = False

    for brand in TARGETED_BRANDS:
        if brand in title_lower:
            detected_brand = brand
            # Check if domain is authentic brand apex
            is_authentic_brand_domain = (
                base_apex.startswith(f"{brand}.")
                or base_host in KNOWN_BENIGN_APEX
            )
            # Require authentication/login keywords OR an active login form to flag high-risk impersonation
            has_login_intent = any(kw in title_lower for kw in AUTH_KEYWORDS) or has_credential_form
            
            if not is_authentic_brand_domain and has_login_intent:
                brand_impersonation = True
                evidence.append(EvidenceItem(
                    signal="dom_brand_impersonation",
                    value=f"Title mentions '{brand}', hosted on '{base_host}'",
                    severity="high",
                    source="html_dom",
                    description=f"Brand Impersonation: Page title references '{brand.upper()}' with authentication context on unverified host '{base_host}'"
                ))
                break
            elif not is_authentic_brand_domain:
                # Informational brand mention without explicit credential harvesting context
                evidence.append(EvidenceItem(
                    signal="dom_brand_mention",
                    value=brand,
                    severity="info",
                    source="html_dom",
                    description=f"Page title references known brand name '{brand}'"
                ))

    # 2. Form & Credential Harvesting Analysis
    for form in parser.forms:
        if form.has_password_field:
            evidence.append(EvidenceItem(
                signal="dom_login_form_present",
                value=form.action or "Self",
                severity="info" if not brand_impersonation else "high",
                source="html_dom",
                description=f"Login credential input form identified (submits to '{form.action}')"
            ))

        if form.is_off_domain_action and (form.has_password_field or form.has_payment_field):
            evidence.append(EvidenceItem(
                signal="dom_off_domain_credential_harvest",
                value=form.action or "",
                severity="critical",
                source="html_dom",
                description=f"CRITICAL: Form collects credentials/payment and transmits to different domain apex ('{form.action}')"
            ))

        if form.is_http_action_on_https:
            evidence.append(EvidenceItem(
                signal="dom_insecure_form_action",
                value=form.action or "",
                severity="high",
                source="html_dom",
                description=f"Insecure Form Action: HTTPS page transmits form data over unencrypted HTTP ('{form.action}')"
            ))

    # 3. Iframe Analysis
    has_hidden_iframes = any(i.is_hidden for i in parser.iframes)
    if has_hidden_iframes:
        evidence.append(EvidenceItem(
            signal="dom_hidden_iframe",
            value="Hidden Iframe",
            severity="high",
            source="html_dom",
            description="Invisible/hidden iframe (0x0px or display:none) detected, commonly used for clickjacking or silent drive-by drops"
        ))

    # 4. JavaScript Signals
    js_signals, js_evidence = analyze_javascript_signals(parser.inline_scripts, html_content)
    evidence.extend(js_evidence)

    dom_intel = HTMLDOMIntelligence(
        title=full_title if full_title else None,
        meta_description=parser.meta_description,
        total_forms=len(parser.forms),
        forms=parser.forms,
        has_credential_form=has_credential_form,
        has_off_domain_form_submission=has_off_domain_submission,
        total_iframes=len(parser.iframes),
        iframes=parser.iframes,
        has_hidden_iframes=has_hidden_iframes,
        total_scripts=parser.total_scripts,
        external_scripts_count=parser.external_scripts,
        js_signals=js_signals,
        detected_brand_in_title=detected_brand,
        brand_impersonation_suspected=brand_impersonation
    )

    return dom_intel, evidence
