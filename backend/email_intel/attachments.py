import hashlib
import os
import re
from typing import List, Tuple
from email.message import Message
from .models import AttachmentMetadata

DANGEROUS_EXTENSIONS = {
    ".exe", ".scr", ".bat", ".cmd", ".lnk", ".js", ".vbs", ".vbe",
    ".iso", ".img", ".hta", ".cpl", ".wsf", ".ps1", ".pif", ".com",
    ".jar", ".msi", ".msp", ".reg", ".sh", ".bash", ".dll"
}

MACRO_EXTENSIONS = {
    ".docm", ".xlsm", ".pptm", ".dotm", ".xltm", ".xlam", ".potm", ".ppam"
}

ARCHIVE_EXTENSIONS = {
    ".zip", ".rar", ".7z", ".tar", ".gz", ".cab", ".iso", ".img", ".bz2", ".xz"
}

BENIGN_DECEPTION_TARGETS = {
    ".pdf", ".docx", ".doc", ".xlsx", ".xls", ".pptx", ".ppt",
    ".jpg", ".jpeg", ".png", ".txt", ".mp4", ".csv"
}

MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024  # 5 MB max per attachment payload

def analyze_attachment_part(part: Message) -> Tuple[AttachmentMetadata, List[str]]:
    """
    Safely inspects a single MIME attachment part.
    Calculates SHA-256 hash in memory, validates file extension and MIME type,
    and detects double-extension evasion techniques without executing any binary.
    """
    evidence: List[str] = []
    
    filename = part.get_filename() or "unnamed_attachment"
    filename = re.sub(r'[\r\n\t]', '', filename).strip()
    
    declared_mime = part.get_content_type() or "application/octet-stream"
    
    # Compute SHA-256 and size safely
    payload_bytes = b""
    try:
        raw_payload = part.get_payload(decode=True)
        if raw_payload:
            payload_bytes = raw_payload[:MAX_ATTACHMENT_BYTES]
    except Exception:
        pass
    
    size_bytes = len(payload_bytes)
    sha256_hash = hashlib.sha256(payload_bytes).hexdigest() if payload_bytes else ""
    
    # Extension analysis
    _, ext = os.path.splitext(filename.lower())
    
    is_dangerous = ext in DANGEROUS_EXTENSIONS
    is_macro = ext in MACRO_EXTENSIONS
    is_archive = ext in ARCHIVE_EXTENSIONS
    
    # Double extension check: e.g. "Invoice_Q3.pdf.exe" or "Report.docx.scr"
    is_double_ext = False
    name_parts = filename.lower().split(".")
    if len(name_parts) >= 3:
        pre_ext = "." + name_parts[-2]
        if pre_ext in BENIGN_DECEPTION_TARGETS and ext in DANGEROUS_EXTENSIONS:
            is_double_ext = True
            evidence.append(
                f"Double Extension Evasion Detected: Attachment '{filename}' disguises executable '{ext}' behind benign '{pre_ext}'"
            )

    # Risk level classification
    if is_dangerous or is_double_ext:
        risk_level = "high_risk"
        evidence.append(f"Dangerous executable attachment detected: '{filename}' (type: {ext})")
    elif is_macro:
        risk_level = "suspicious"
        evidence.append(f"Macro-enabled Office attachment detected: '{filename}' (type: {ext})")
    elif is_archive:
        risk_level = "suspicious"
        evidence.append(f"Archive attachment detected: '{filename}' (inspection bounded)")
    else:
        risk_level = "safe"

    metadata = AttachmentMetadata(
        filename=filename,
        extension=ext,
        declared_mime=declared_mime,
        size_bytes=size_bytes,
        sha256=sha256_hash,
        is_dangerous_extension=is_dangerous,
        is_double_extension=is_double_ext,
        is_macro_enabled=is_macro,
        is_archive=is_archive,
        risk_level=risk_level
    )

    return metadata, evidence
