import email
from email import policy
from email.message import Message
from typing import Tuple, List, Optional
from .models import AttachmentMetadata
from .attachments import analyze_attachment_part

MAX_EMAIL_BYTES = 1024 * 1024       # 1 MB raw email ceiling
MAX_MIME_PARTS = 50                 # Prevent MIME bomb expansion
MAX_MIME_DEPTH = 10                 # Prevent deeply nested recursion
MAX_BODY_CHARS = 100_000            # Bounded memory for text extraction
MAX_ATTACHMENTS = 20                # Bounded attachment list

def parse_raw_email(
    raw_content: str
) -> Tuple[Optional[Message], str, str, List[AttachmentMetadata], List[str], List[str]]:
    """
    Safely parses a raw MIME/RFC 5322 email string with strict bounding.
    Returns: (email_message, text_body, html_body, attachments, evidence, limitations)
    """
    evidence: List[str] = []
    limitations: List[str] = []
    
    if not raw_content:
        return None, "", "", [], ["Empty email content supplied"], []

    # 1. Enforce payload size bounding
    bounded_content = raw_content
    if len(raw_content) > MAX_EMAIL_BYTES:
        bounded_content = raw_content[:MAX_EMAIL_BYTES]
        limitations.append(f"Raw email truncated to 1MB ceiling (original: {len(raw_content)} bytes)")

    # 2. Parse RFC 5322 message structure
    try:
        msg = email.message_from_string(bounded_content, policy=policy.default)
    except Exception as e:
        try:
            # Fallback to compat32 policy if default policy fails on legacy formats
            msg = email.message_from_string(bounded_content, policy=policy.compat32)
        except Exception as e2:
            return None, "", "", [], [f"MIME parser failure: {str(e2)}"], ["Failed to parse RFC 5322 structure"]

    text_parts: List[str] = []
    html_parts: List[str] = []
    attachments: List[AttachmentMetadata] = []
    
    part_count = 0

    # 3. Safe traversal of MIME tree
    for part in msg.walk():
        part_count += 1
        if part_count > MAX_MIME_PARTS:
            limitations.append(f"MIME part traversal truncated at {MAX_MIME_PARTS} parts (potential MIME expansion attack)")
            break

        content_disposition = str(part.get("Content-Disposition", "")).lower()
        content_type = part.get_content_type().lower()
        filename = part.get_filename()

        # Check if this part is an attachment
        if "attachment" in content_disposition or (filename and content_type not in ("text/plain", "text/html")):
            if len(attachments) < MAX_ATTACHMENTS:
                att_meta, att_evidence = analyze_attachment_part(part)
                attachments.append(att_meta)
                evidence.extend(att_evidence)
            else:
                limitations.append(f"Attachment analysis capped at {MAX_ATTACHMENTS} items")
            continue

        # Extract text/plain body
        if content_type == "text/plain" and "attachment" not in content_disposition:
            try:
                payload = part.get_payload(decode=True)
                charset = part.get_content_charset() or "utf-8"
                if payload:
                    decoded = payload.decode(charset, errors="replace")
                    text_parts.append(decoded[:MAX_BODY_CHARS])
            except Exception:
                pass

        # Extract text/html body
        elif content_type == "text/html" and "attachment" not in content_disposition:
            try:
                payload = part.get_payload(decode=True)
                charset = part.get_content_charset() or "utf-8"
                if payload:
                    decoded = payload.decode(charset, errors="replace")
                    html_parts.append(decoded[:MAX_BODY_CHARS])
            except Exception:
                pass

    combined_text = "\n".join(text_parts)[:MAX_BODY_CHARS]
    combined_html = "\n".join(html_parts)[:MAX_BODY_CHARS]

    return msg, combined_text, combined_html, attachments, evidence, limitations
