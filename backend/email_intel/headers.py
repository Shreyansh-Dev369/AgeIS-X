import re
from typing import List, Dict, Any, Tuple
from email.message import Message
from .models import EmailHeaderAnalysis

def parse_header_metadata(msg: Message) -> EmailHeaderAnalysis:
    """
    Parses standard email headers, validates RFC 5322 conformity,
    and detects header anomalies.
    """
    anomalies: List[str] = []
    missing_required: List[str] = []

    # Check required RFC 5322 headers
    from_header = msg.get("From")
    if not from_header:
        missing_required.append("From")
        anomalies.append("Missing mandatory 'From' header per RFC 5322")

    date_header = msg.get("Date")
    if not date_header:
        missing_required.append("Date")
        anomalies.append("Missing mandatory 'Date' header per RFC 5322")

    subject_header = msg.get("Subject", "")

    # Multiplicity checks (multiple From or Subject headers are suspicious)
    from_headers = msg.get_all("From", [])
    if len(from_headers) > 1:
        anomalies.append(f"Multiple 'From' headers detected ({len(from_headers)}), indicating header injection or smuggling")

    subject_headers = msg.get_all("Subject", [])
    if len(subject_headers) > 1:
        anomalies.append(f"Multiple 'Subject' headers detected ({len(subject_headers)})")

    # Message-ID analysis
    message_id = msg.get("Message-ID")
    has_valid_msg_id = True
    if not message_id:
        has_valid_msg_id = False
        anomalies.append("Missing 'Message-ID' header, commonly seen in spam/phishing toolkits")
    else:
        clean_id = message_id.strip("<> \t\r\n")
        if "@" not in clean_id or len(clean_id) < 5:
            has_valid_msg_id = False
            anomalies.append(f"Malformed or non-standard 'Message-ID' header: '{message_id[:40]}'")

    # Received hops extraction
    received_headers = msg.get_all("Received", [])
    hops_count = len(received_headers)
    relays: List[str] = []

    for r in received_headers:
        # Extract relay names / IPs from 'from <host>' or 'by <host>'
        from_match = re.search(r'from\s+([^\s;]+)', r, re.IGNORECASE)
        by_match = re.search(r'by\s+([^\s;]+)', r, re.IGNORECASE)
        
        relay_info = ""
        if from_match:
            relay_info += f"from {from_match.group(1)}"
        if by_match:
            relay_info += f" by {by_match.group(1)}"
        if relay_info:
            relays.append(relay_info)

    if hops_count > 15:
        anomalies.append(f"Excessive routing hop count ({hops_count} Received headers), potential routing loop or obfuscation")

    return EmailHeaderAnalysis(
        subject=str(subject_header or ""),
        message_id=str(message_id) if message_id else None,
        date=str(date_header) if date_header else None,
        received_hops_count=hops_count,
        received_from_relays=relays[:10], # bound to top 10 relays
        has_valid_message_id=has_valid_msg_id,
        missing_required_headers=missing_required,
        anomalies=anomalies
    )
