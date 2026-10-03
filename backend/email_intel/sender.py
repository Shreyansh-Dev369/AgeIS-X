import re
from email.utils import parseaddr
from typing import Tuple, Optional, List
from email.message import Message
from .models import EmailSenderInfo

# Major recognizable brands commonly targeted for display-name spoofing
HIGH_PROFILE_BRANDS = {
    "paypal": ["paypal.com", "paypal.co.uk"],
    "microsoft": ["microsoft.com", "office.com", "live.com", "outlook.com", "office365.com", "azure.com"],
    "office 365": ["microsoft.com", "office.com", "office365.com"],
    "google": ["google.com", "googlemail.com", "gmail.com"],
    "apple": ["apple.com", "icloud.com"],
    "amazon": ["amazon.com", "amazon.co.uk", "amazon.de"],
    "netflix": ["netflix.com"],
    "docusign": ["docusign.com", "docusign.net"],
    "meta": ["meta.com", "facebookmail.com", "instagram.com"],
    "facebook": ["facebook.com", "facebookmail.com"],
    "instagram": ["instagram.com"],
    "whatsapp": ["whatsapp.com"],
    "chase": ["chase.com"],
    "bank of america": ["bankofamerica.com"],
    "wells fargo": ["wellsfargo.com"],
    "citi": ["citi.com", "citigroup.com"],
    "irs": ["irs.gov"],
    "internal revenue": ["irs.gov"],
    "usps": ["usps.com", "usps.gov"],
    "fedex": ["fedex.com"],
    "ups": ["ups.com"],
    "dhl": ["dhl.com"]
}

FREE_WEBMAILS = {
    "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "live.com",
    "aol.com", "proton.me", "protonmail.com", "mail.com", "yandex.com",
    "zoho.com", "gmx.com", "mail.ru", "icloud.com"
}

EXECUTIVE_PATTERNS = [
    r'\bceo\b', r'\bcfo\b', r'\bcoo\b', r'\bpresident\b', r'\bexecutive\b',
    r'\bmanaging director\b', r'\bhuman resources\b', r'\bpayroll\b',
    r'\bfinance director\b', r'\baccounting\b', r'\bit helpdesk\b', r'\bhelpdesk admin\b'
]

def extract_domain(address: str) -> str:
    if "@" in address:
        return address.split("@")[-1].lower().strip()
    return ""

def analyze_sender_identity(msg: Message) -> Tuple[EmailSenderInfo, List[str]]:
    """
    Parses and cross-examines From, Reply-To, and Return-Path headers.
    Detects Display-Name spoofing, brand impersonation, and domain discrepancies.
    """
    evidence: List[str] = []

    # 1. Parse From
    raw_from = msg.get("From", "")
    from_name, from_addr = parseaddr(raw_from)
    from_name = from_name.strip()
    from_addr = from_addr.strip().lower()
    from_domain = extract_domain(from_addr)

    # 2. Parse Reply-To
    raw_reply_to = msg.get("Reply-To", "")
    reply_to_name, reply_to_addr = parseaddr(raw_reply_to)
    reply_to_addr = reply_to_addr.strip().lower() if reply_to_addr else None
    reply_to_domain = extract_domain(reply_to_addr) if reply_to_addr else None

    # 3. Parse Return-Path
    raw_return_path = msg.get("Return-Path", "")
    _, return_path_addr = parseaddr(raw_return_path)
    return_path_addr = return_path_addr.strip().lower() if return_path_addr else None
    return_path_domain = extract_domain(return_path_addr) if return_path_addr else None

    is_reply_to_mismatch = False
    if reply_to_domain and from_domain and reply_to_domain != from_domain:
        is_reply_to_mismatch = True
        evidence.append(f"Reply-To mismatch: Sender is '{from_domain}' but replies redirect to '{reply_to_domain}'")

    is_return_path_mismatch = False
    if return_path_domain and from_domain and return_path_domain != from_domain:
        # Some legitimate services use mail delivery subdomains, so check parent domain match
        from_parts = from_domain.split(".")
        return_parts = return_path_domain.split(".")
        if len(from_parts) >= 2 and len(return_parts) >= 2:
            if ".".join(from_parts[-2:]) != ".".join(return_parts[-2:]):
                is_return_path_mismatch = True
                evidence.append(f"Return-Path envelope domain '{return_path_domain}' differs from From domain '{from_domain}'")

    # 4. Display Name Spoofing Checks
    is_display_name_spoofing = False
    impersonated_brand = None

    # Check 4a: Display name contains an embedded email address (e.g. "support@paypal.com" <scam@bad.com>)
    embedded_email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', from_name)
    if embedded_email_match:
        embedded_email = embedded_email_match.group(0).lower()
        if embedded_email != from_addr:
            is_display_name_spoofing = True
            impersonated_brand = embedded_email
            evidence.append(f"Display Name Spoofing: Display name embeds '{embedded_email}' to disguise true sender address '{from_addr}'")

    # Check 4b: Display name contains brand name but sender domain is unauthorized or free webmail
    if not is_display_name_spoofing:
        from_name_lower = from_name.lower()
        for brand, legit_domains in HIGH_PROFILE_BRANDS.items():
            if brand in from_name_lower:
                # Check if actual from_domain is in legit_domains
                is_legit = False
                for ld in legit_domains:
                    if from_domain == ld or from_domain.endswith("." + ld):
                        is_legit = True
                        break
                if not is_legit:
                    is_display_name_spoofing = True
                    impersonated_brand = brand.capitalize()
                    evidence.append(f"Brand Impersonation in Sender Display Name: Display name claims '{from_name}' ({brand.title()}) but originating domain is '{from_domain}'")
                    break

    # Check 4c: Executive / VIP Impersonation on public webmail
    if not is_display_name_spoofing and from_domain in FREE_WEBMAILS:
        for pat in EXECUTIVE_PATTERNS:
            if re.search(pat, from_name_lower):
                is_display_name_spoofing = True
                impersonated_brand = "Executive / Organization Authority"
                evidence.append(f"Executive / Authority Impersonation: Display name '{from_name}' uses organizational title from public webmail '{from_domain}'")
                break

    sender_info = EmailSenderInfo(
        display_name=from_name,
        address=from_addr,
        domain=from_domain,
        reply_to_address=reply_to_addr,
        reply_to_domain=reply_to_domain,
        return_path_address=return_path_addr,
        return_path_domain=return_path_domain,
        is_reply_to_mismatch=is_reply_to_mismatch,
        is_return_path_mismatch=is_return_path_mismatch,
        is_display_name_spoofing=is_display_name_spoofing,
        impersonation_target=impersonated_brand
    )

    return sender_info, evidence
