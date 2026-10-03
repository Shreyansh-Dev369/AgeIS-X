import re
from typing import Optional, Dict, Any, List
from email.message import Message
from .models import EmailAuthStatus

def parse_supplied_authentication(msg: Message) -> EmailAuthStatus:
    """
    Parses supplied authentication headers (Authentication-Results, Received-SPF, DKIM-Signature).
    NOTE: This performs passive inspection of supplied headers from MTA hops.
    It DOES NOT independently perform DNS crypto-verification (DKIM pubkey lookup or live SPF evaluation).
    The verification_status is explicitly flagged as 'not_independently_verified'.
    """
    spf_status = "none"
    dkim_status = "none"
    dmarc_status = "none"
    spf_details = None
    dkim_details = None
    dmarc_details = None
    has_auth_failure = False

    # 1. Parse Authentication-Results (RFC 7601 / RFC 8601)
    auth_results_headers = msg.get_all("Authentication-Results", [])
    if not auth_results_headers:
        # Fallback to ARC-Authentication-Results
        auth_results_headers = msg.get_all("ARC-Authentication-Results", [])

    for auth_hdr in auth_results_headers:
        # Lowercase and normalize for regex extraction
        normalized = auth_hdr.lower()

        # Parse SPF from Authentication-Results
        spf_match = re.search(r'\bspf=(\w+)(?:\s+\(([^)]+)\))?', normalized)
        if spf_match and spf_status == "none":
            spf_status = spf_match.group(1)
            spf_details = f"MTA reported spf={spf_status}"
            if spf_match.group(2):
                spf_details += f" ({spf_match.group(2)})"

        # Parse DKIM from Authentication-Results
        dkim_match = re.search(r'\bdkim=(\w+)(?:\s+\(([^)]+)\))?', normalized)
        if dkim_match and dkim_status == "none":
            dkim_status = dkim_match.group(1)
            dkim_details = f"MTA reported dkim={dkim_status}"
            if dkim_match.group(2):
                dkim_details += f" ({dkim_match.group(2)})"

        # Parse DMARC from Authentication-Results
        dmarc_match = re.search(r'\bdmarc=(\w+)(?:\s+\(([^)]+)\))?', normalized)
        if dmarc_match and dmarc_status == "none":
            dmarc_status = dmarc_match.group(1)
            dmarc_details = f"MTA reported dmarc={dmarc_status}"
            if dmarc_match.group(2):
                dmarc_details += f" ({dmarc_match.group(2)})"

    # 2. Check Received-SPF if SPF not yet resolved
    if spf_status == "none":
        received_spf = msg.get("Received-SPF")
        if received_spf:
            spf_match = re.match(r'^\s*([a-zA-Z]+)', received_spf)
            if spf_match:
                spf_status = spf_match.group(1).lower()
                spf_details = f"Received-SPF header: {spf_status}"

    # 3. Check DKIM-Signature presence if DKIM not mentioned in Auth-Results
    if dkim_status == "none":
        dkim_sig = msg.get("DKIM-Signature")
        if dkim_sig:
            # Domain and selector presence
            d_match = re.search(r'\bd=([^;]+)', dkim_sig)
            if d_match:
                signing_domain = d_match.group(1).strip()
                dkim_status = "signature_present"
                dkim_details = f"DKIM-Signature present for domain '{signing_domain}' (unverified)"
            else:
                dkim_status = "signature_present"
                dkim_details = "DKIM-Signature header present (unverified)"

    # Determine failure conditions
    if spf_status in ("fail", "permerror", "softfail"):
        has_auth_failure = True
    if dkim_status in ("fail", "permerror"):
        has_auth_failure = True
    if dmarc_status in ("fail", "reject", "quarantine"):
        has_auth_failure = True

    return EmailAuthStatus(
        source="supplied_header",
        verification_status="not_independently_verified",
        spf_status=spf_status,
        dkim_status=dkim_status,
        dmarc_status=dmarc_status,
        spf_details=spf_details,
        dkim_details=dkim_details,
        dmarc_details=dmarc_details,
        has_auth_failure=has_auth_failure
    )
