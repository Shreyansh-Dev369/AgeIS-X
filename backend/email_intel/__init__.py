import time
import re
from typing import Optional, List, Dict, Any

from .models import (
    EmailIntelligence,
    EmailSenderInfo,
    EmailAuthStatus,
    EmailHeaderAnalysis,
    AttachmentMetadata,
    ExtractedLinkAnalysis,
    SocialEngineeringSignals,
    MessageIntelligence
)
from .parser import parse_raw_email
from .headers import parse_header_metadata
from .authentication import parse_supplied_authentication
from .sender import analyze_sender_identity
from .body import (
    extract_body_content_and_links,
    analyze_body_intelligence,
    sanitize_and_redact
)

def analyze_email_raw(raw_email: str) -> EmailIntelligence:
    """
    End-to-end security analysis for raw MIME / RFC 5322 email payloads.
    Evaluates headers, authentication status, sender anomalies, body text,
    extracted links, and attachment metadata.
    """
    start_time = time.time()
    all_evidence: List[str] = []
    limitations: List[str] = [
        "Passive header analysis: Authentication headers reflect supplied MTA records and are not cryptographically re-evaluated against DNS."
    ]

    # 1. Bounded RFC 5322 MIME parsing
    msg, body_text, body_html, attachments, parse_ev, parse_lim = parse_raw_email(raw_email)
    all_evidence.extend(parse_ev)
    limitations.extend(parse_lim)

    if not msg:
        return EmailIntelligence(
            status="error",
            subject="",
            risk_score=50,
            verdict="suspicious",
            evidence=all_evidence if all_evidence else ["Could not parse RFC 5322 email structure"],
            limitations=limitations,
            observed_at=start_time
        )

    # 2. Header analysis & anomalies
    headers = parse_header_metadata(msg)
    for anom in headers.anomalies:
        if anom not in all_evidence:
            all_evidence.append(anom)

    # 3. Supplied Authentication analysis
    auth = parse_supplied_authentication(msg)
    if auth.has_auth_failure:
        if auth.spf_status in ("fail", "permerror", "softfail"):
            all_evidence.append(f"Supplied SPF verification failure: {auth.spf_status}")
        if auth.dkim_status in ("fail", "permerror"):
            all_evidence.append(f"Supplied DKIM verification failure: {auth.dkim_status}")
        if auth.dmarc_status in ("fail", "reject", "quarantine"):
            all_evidence.append(f"Supplied DMARC policy failure: {auth.dmarc_status}")

    # 4. Sender identity & display-name spoofing
    sender_info, sender_ev = analyze_sender_identity(msg)
    for ev in sender_ev:
        if ev not in all_evidence:
            all_evidence.append(ev)

    # 5. Body extraction & linguistic social engineering
    raw_combined_text, extracted_links = extract_body_content_and_links(body_text, body_html)
    social_eng, link_analyses, body_ev = analyze_body_intelligence(
        raw_combined_text,
        extracted_links,
        sender_domain=sender_info.domain
    )
    for ev in body_ev:
        if ev not in all_evidence:
            all_evidence.append(ev)

    # 6. Comprehensive Risk Scoring & Deterministic Floors
    risk_score = 0

    # Sender weightings
    if sender_info.is_display_name_spoofing:
        risk_score += 40
    if sender_info.is_reply_to_mismatch:
        risk_score += 30
    if sender_info.is_return_path_mismatch:
        risk_score += 15

    # Auth weightings
    if auth.has_auth_failure:
        if auth.dmarc_status in ("fail", "reject"):
            risk_score += 35
        elif auth.spf_status in ("fail", "permerror"):
            risk_score += 25
        elif auth.dkim_status in ("fail", "permerror"):
            risk_score += 20

    # Social engineering weightings
    if social_eng.has_credential_request:
        risk_score += 30
    if social_eng.has_payment_or_wire_request:
        risk_score += 25
    if social_eng.has_gift_card_request or social_eng.has_crypto_request:
        risk_score += 30
    if social_eng.has_urgency_language:
        risk_score += 15
    if social_eng.has_account_suspension_threat:
        risk_score += 20

    # Header anomalies weightings
    if not headers.has_valid_message_id:
        risk_score += 15
    if headers.missing_required_headers:
        risk_score += 20

    # Attachments weightings
    has_dangerous_attachment = False
    has_double_ext_attachment = False
    for att in attachments:
        if att.is_dangerous_extension:
            has_dangerous_attachment = True
            risk_score += 50
        elif att.is_double_extension:
            has_double_ext_attachment = True
            risk_score += 50
        elif att.is_macro_enabled:
            risk_score += 25
        elif att.is_archive:
            risk_score += 15

    # Links weightings
    has_mismatched_anchor = False
    has_malicious_link = False
    for link in link_analyses:
        if link.is_mismatched_anchor:
            has_mismatched_anchor = True
            risk_score += 40
        if link.risk_score >= 70:
            has_malicious_link = True
            risk_score += 35

    # Enforce Deterministic Floors for Critical Attack Signatures
    if has_dangerous_attachment or has_double_ext_attachment:
        risk_score = max(risk_score, 90)
    if sender_info.is_display_name_spoofing and social_eng.has_credential_request:
        risk_score = max(risk_score, 85)
    if sender_info.is_display_name_spoofing and (social_eng.has_urgency_language or social_eng.has_payment_or_wire_request):
        risk_score = max(risk_score, 80)
    if has_mismatched_anchor:
        risk_score = max(risk_score, 85)
    if has_malicious_link and (social_eng.has_urgency_language or social_eng.has_credential_request):
        risk_score = max(risk_score, 85)
    if auth.dmarc_status in ("fail", "reject") and (social_eng.has_urgency_language or social_eng.has_credential_request):
        risk_score = max(risk_score, 80)

    # Normalize final score
    final_score = min(100, max(0, risk_score))

    if final_score >= 70:
        verdict = "malicious"
    elif final_score >= 30:
        verdict = "suspicious"
    else:
        verdict = "safe"

    if not all_evidence:
        all_evidence.append("No obvious social engineering patterns, authentication failures, or deceptive headers detected.")

    return EmailIntelligence(
        status="analyzed",
        subject=headers.subject,
        sender=sender_info,
        auth=auth,
        headers=headers,
        social_engineering=social_eng,
        attachments=attachments,
        links=link_analyses,
        risk_score=final_score,
        verdict=verdict,
        evidence=all_evidence,
        limitations=limitations,
        observed_at=start_time
    )

def analyze_message_text(message: str, sender: Optional[str] = None) -> MessageIntelligence:
    """
    Analyzes standalone text communications (SMS, Chat, Social Engineering messages).
    Extracts URLs, detects urgency/credential cues, and flags scam indicators.
    """
    start_time = time.time()
    evidence: List[str] = []
    limitations: List[str] = [
        "Unstructured message analysis: Evaluates plain text and embedded URLs without transport envelope headers."
    ]

    clean_message = message[:100_000]
    
    # Extract links from message
    raw_combined_text, extracted_links = extract_body_content_and_links(clean_message, "")
    
    # Analyze linguistic patterns and links
    social_eng, link_analyses, body_ev = analyze_body_intelligence(
        clean_message,
        extracted_links,
        sender_domain=""
    )
    evidence.extend(body_ev)

    # Sender analysis if provided
    sender_lower = (sender or "").lower()
    sender_brand_flagged = False
    if sender:
        # Check if sender is a shortcode or impersonation name
        if re.search(r'\b(security|support|bank|apple|google|paypal|irs|dhl|fedex|ups|usps)\b', sender_lower):
            sender_brand_flagged = True
            evidence.append(f"Sender identifier '{sender}' references high-value brand or institutional keyword")

    # Score calculation
    risk_score = social_eng.urgency_score

    if sender_brand_flagged:
        risk_score += 25
    if social_eng.has_credential_request:
        risk_score += 35
    if social_eng.has_payment_or_wire_request:
        risk_score += 30
    if social_eng.has_gift_card_request or social_eng.has_crypto_request:
        risk_score += 35
    if social_eng.has_account_suspension_threat:
        risk_score += 25

    has_malicious_link = False
    has_suspicious_link = False
    for link in link_analyses:
        if link.risk_score >= 70:
            has_malicious_link = True
            risk_score += 40
        elif link.risk_score >= 30:
            has_suspicious_link = True
            risk_score += 25

    # Deterministic floors
    if has_malicious_link and (social_eng.has_credential_request or social_eng.has_urgency_language):
        risk_score = max(risk_score, 85)
    elif has_suspicious_link and (social_eng.has_payment_or_wire_request or social_eng.has_urgency_language):
        risk_score = max(risk_score, 80)
    elif social_eng.has_credential_request and social_eng.has_urgency_language:
        risk_score = max(risk_score, 75)

    final_score = min(100, max(0, risk_score))

    if final_score >= 70:
        verdict = "malicious"
    elif final_score >= 30:
        verdict = "suspicious"
    else:
        verdict = "safe"

    if not evidence:
        evidence.append("No immediate social engineering or deceptive message indicators detected.")

    return MessageIntelligence(
        status="analyzed",
        sender=sender,
        social_engineering=social_eng,
        links=link_analyses,
        risk_score=final_score,
        verdict=verdict,
        evidence=evidence,
        limitations=limitations,
        observed_at=start_time
    )
