import re
from html.parser import HTMLParser
from typing import List, Tuple, Dict, Any, Optional
from urllib.parse import urlparse
from .models import SocialEngineeringSignals, ExtractedLinkAnalysis

try:
    from ..utils import parse_url_structure
except ImportError:
    from utils import parse_url_structure

# Social engineering pattern catalogs
URGENCY_PATTERNS = [
    (r'\b(immediate(ly)?|urgent(ly)?|action required|within 24 hours|within 48 hours|final notice|critical alert)\b', 15),
    (r'\b(account (will be|has been) (suspended|terminated|disabled|locked|closed))\b', 25),
    (r'\b(unauthorized (access|activity|transaction|attempt)|security breach|suspicious activity detected)\b', 20),
    (r'\b(fail(ure)? to respond|permanent deactivation|immediate termination)\b', 20),
    (r'\b(package|parcel|shipment|delivery)\s+(on hold|suspended|delayed|pending|held)\b', 20),
]

CREDENTIAL_PATTERNS = [
    (r'\b(verify|confirm|validate|update)\s+(your\s+)?(account|password|credentials|identity|billing|login|security question)\b', 25),
    (r'\b(click\s+(here|below|the link)\s+to\s+(log\s*in|sign\s*in|verify|reset\s+password|unlock))\b', 30),
    (r'\b(enter|submit|provide)\s+(your\s+)?(username|password|pin|passcode|social security|ssn)\b', 35),
    (r'\b(session expired|login expired|re-authenticate your account)\b', 20),
]

FINANCIAL_PATTERNS = [
    (r'\b(wire transfer|bank transfer|direct deposit|swift code|routing number|iban)\b', 25),
    (r'\b(gift card(s)?|apple gift card|itunes card|steam card|google play card)\b', 35),
    (r'\b(bitcoin|crypto(currency)?|btc|eth|usdt|wallet address)\b', 25),
    (r'\b(outstanding invoice|overdue invoice|payment remittance|urgent payment|unpaid fee|unpaid fees|delivery fee|customs fee|processing fee)\b', 25),
    (r'\b(lottery|inheritance|million dollars|funds release|beneficiary|claim refund|refund pending)\b', 30),
]

# Sensitive PII / Secret masking regexes
SECRET_REDACTION_PATTERNS = [
    (r'(?i)\b(password|passcode|pin|secret)(?:\s+is|\s*[:=])\s+([^\s,;]+)', r'\1: [REDACTED_SECRET]'),
    (r'(?i)\b(otp|one-time code|auth code|verification code)(?:\s+is|\s*[:=])\s+([0-9]{4,8})\b', r'\1: [REDACTED_OTP]'),
    (r'\b(?:\d{4}[ -]?){3}\d{1,4}\b', '[REDACTED_CARD_NUMBER]'),
    (r'\b\d{3}-\d{2}-\d{4}\b', '[REDACTED_SSN]'),
    (r'\b(bearer\s+[A-Za-z0-9_\-\.]{20,})\b', '[REDACTED_BEARER_TOKEN]'),
]

class LinkAndTextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.text_parts: List[str] = []
        self.extracted_links: List[Tuple[str, str]] = [] # (href, anchor_text)
        self._current_href: Optional[str] = None
        self._current_anchor_text: List[str] = []

    def handle_starttag(self, tag: str, attrs: List[Tuple[str, Optional[str]]]):
        if tag.lower() == 'a':
            attr_dict = {k.lower(): (v or "") for k, v in attrs}
            href = attr_dict.get('href', '').strip()
            if href:
                self._current_href = href
                self._current_anchor_text = []

    def handle_endtag(self, tag: str):
        if tag.lower() == 'a':
            if self._current_href:
                anchor_str = " ".join(self._current_anchor_text).strip()
                self.extracted_links.append((self._current_href, anchor_str))
                self._current_href = None
                self._current_anchor_text = []

    def handle_data(self, data: str):
        cleaned = data.strip()
        if cleaned:
            self.text_parts.append(cleaned)
            if self._current_href is not None:
                self._current_anchor_text.append(cleaned)

def sanitize_and_redact(text: str) -> str:
    """Masks high-risk credentials, OTPs, credit cards, and tokens in evidence strings."""
    redacted = text
    for pattern, replacement in SECRET_REDACTION_PATTERNS:
        redacted = re.sub(pattern, replacement, redacted)
    return redacted

def extract_body_content_and_links(
    text_content: str,
    html_content: str,
    max_body_chars: int = 100_000
) -> Tuple[str, List[Tuple[str, str]]]:
    """
    Safely extracts combined plain-text content and hyperlinks from email/message bodies.
    Enforces strict memory / character ceiling.
    """
    combined_text = ""
    links: List[Tuple[str, str]] = []

    # Parse HTML if present
    if html_content:
        parser = LinkAndTextExtractor()
        try:
            parser.feed(html_content[:max_body_chars])
            html_text = " ".join(parser.text_parts)
            links.extend(parser.extracted_links)
            combined_text += html_text + " "
        except Exception:
            # Fallback regex parsing if HTML parser encounters malformed entities
            pass

    # Append plain text content
    if text_content:
        combined_text += " " + text_content[:max_body_chars]

    # Extract plain-text URLs from body not already captured
    raw_url_pattern = r'https?://[^\s<>"\',;]+'
    plain_urls = re.findall(raw_url_pattern, combined_text)
    captured_hrefs = {h for h, _ in links}
    for u in plain_urls:
        if u not in captured_hrefs:
            links.append((u, ""))

    return combined_text[:max_body_chars], links[:50]

def analyze_body_intelligence(
    body_text: str,
    extracted_links: List[Tuple[str, str]],
    sender_domain: str = ""
) -> Tuple[SocialEngineeringSignals, List[ExtractedLinkAnalysis], List[str]]:
    """
    Evaluates body text for social engineering cues, deceptive anchors, and embedded URL threats.
    """
    evidence: List[str] = []
    detected_phrases: List[str] = []
    urgency_score = 0

    has_urgency = False
    has_credential_req = False
    has_payment_req = False
    has_crypto_req = False
    has_gift_card_req = False
    has_executive_imp = False
    has_suspension_threat = False

    body_lower = body_text.lower()

    # 1. Urgency & Account Threat Analysis
    for pattern, score in URGENCY_PATTERNS:
        matches = re.findall(pattern, body_lower)
        if matches:
            has_urgency = True
            urgency_score += score
            sample_phrase = sanitize_and_redact(matches[0][0] if isinstance(matches[0], tuple) else matches[0])
            detected_phrases.append(sample_phrase)
            if "suspend" in sample_phrase or "terminat" in sample_phrase or "locked" in sample_phrase:
                has_suspension_threat = True

    # 2. Credential Harvesting Analysis
    for pattern, score in CREDENTIAL_PATTERNS:
        matches = re.findall(pattern, body_lower)
        if matches:
            has_credential_req = True
            urgency_score += score
            sample_phrase = sanitize_and_redact(matches[0][0] if isinstance(matches[0], tuple) else matches[0])
            detected_phrases.append(sample_phrase)

    # 3. Financial, Wire, Crypto, Gift Card Analysis
    for pattern, score in FINANCIAL_PATTERNS:
        matches = re.findall(pattern, body_lower)
        if matches:
            has_payment_req = True
            urgency_score += score
            sample_phrase = sanitize_and_redact(matches[0][0] if isinstance(matches[0], tuple) else matches[0])
            detected_phrases.append(sample_phrase)
            if "crypto" in sample_phrase or "bitcoin" in sample_phrase or "btc" in sample_phrase:
                has_crypto_req = True
            if "gift card" in sample_phrase:
                has_gift_card_req = True

    # Evidence formulation
    if has_urgency:
        evidence.append(f"High-urgency language detected ({len(detected_phrases)} phrases identified)")
    if has_suspension_threat:
        evidence.append("Account suspension or penalty threat detected in communication body")
    if has_credential_req:
        evidence.append("Explicit credential verification / login harvesting prompt detected")
    if has_gift_card_req:
        evidence.append("Gift card purchase solicitation detected (characteristic of CEO/payroll fraud)")
    if has_crypto_req:
        evidence.append("Cryptocurrency transfer / wallet solicitation detected")

    # 4. Link & Anchor Mismatch Intelligence
    link_analyses: List[ExtractedLinkAnalysis] = []

    for href, anchor_text in extracted_links:
        if not href.startswith("http://") and not href.startswith("https://"):
            continue

        is_mismatched = False
        reasons: List[str] = []
        
        # Check Anchor text deception:
        # e.g., Anchor claims to be 'https://paypal.com' or 'paypal.com' but href is 'http://attacker-site.com'
        anchor_clean = anchor_text.strip().lower()
        if (
            anchor_clean.startswith("http://") or
            anchor_clean.startswith("https://") or
            anchor_clean.startswith("www.") or
            (re.match(r'^[a-z0-9\.-]+\.[a-z]{2,}$', anchor_clean) and " " not in anchor_clean)
        ):
            # Parse anchor target host vs href target host
            if not anchor_clean.startswith("http"):
                anchor_target_url = "http://" + anchor_clean
            else:
                anchor_target_url = anchor_clean

            anchor_host = urlparse(anchor_target_url).hostname or ""
            href_host = urlparse(href).hostname or ""

            if anchor_host and href_host and anchor_host != href_host:
                # Discrepancy
                is_mismatched = True
                reasons.append(f"Anchor text displays '{anchor_host}' but link targets '{href_host}'")
                evidence.append(f"Deceptive Link / Mismatched Anchor: Display text '{anchor_host}' masks destination '{href_host}'")

        # Run M-01 Structural URL Analyzer on link
        try:
            struct_info = parse_url_structure(href)
            link_score = struct_info.get("structural_risk_points", 0)
            if is_mismatched:
                link_score = max(link_score, 85)
            
            if struct_info.get("has_homoglyphs"):
                reasons.append("Homoglyph / Punycode obfuscation in link")
            if struct_info.get("is_ip_literal"):
                reasons.append("IP literal destination in link")
            if struct_info.get("is_typosquat_pattern"):
                reasons.append("Typosquat / Brand impersonation in link")

            verdict = "malicious" if link_score >= 70 else ("suspicious" if link_score >= 30 else "safe")
            
            link_analyses.append(ExtractedLinkAnalysis(
                url=href,
                display_text=anchor_text if anchor_text else None,
                is_mismatched_anchor=is_mismatched,
                is_suspicious=link_score >= 30,
                risk_score=link_score,
                verdict=verdict,
                reasons=reasons
            ))
        except Exception:
            link_analyses.append(ExtractedLinkAnalysis(
                url=href,
                display_text=anchor_text if anchor_text else None,
                is_mismatched_anchor=is_mismatched,
                is_suspicious=is_mismatched,
                risk_score=85 if is_mismatched else 0,
                verdict="malicious" if is_mismatched else "safe",
                reasons=reasons
            ))

    social_signals = SocialEngineeringSignals(
        urgency_score=min(urgency_score, 100),
        has_urgency_language=has_urgency,
        has_credential_request=has_credential_req,
        has_payment_or_wire_request=has_payment_req,
        has_crypto_request=has_crypto_req,
        has_gift_card_request=has_gift_card_req,
        has_executive_impersonation=has_executive_imp,
        has_account_suspension_threat=has_suspension_threat,
        detected_phrases=detected_phrases[:10]
    )

    return social_signals, link_analyses, evidence
