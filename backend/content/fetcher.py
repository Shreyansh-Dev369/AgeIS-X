import time
import urllib.request
import urllib.error
import re
from urllib.parse import urlparse, urlunparse
from typing import Tuple, List, Optional

from .models import HTTPResponseIntelligence, HTMLDOMIntelligence, SecurityHeadersIntelligence
from .headers import analyze_security_headers
from .html_parser import analyze_html_dom
from intelligence.models import EvidenceItem
from intelligence.safety import validate_host_safety, resolve_and_verify_public_ips, is_ip_address

MAX_RESPONSE_BYTES = 512 * 1024  # 512 KB
HTTP_FETCH_TIMEOUT_SECONDS = 3.5
MAX_REDIRECTS = 3

# Dangerous non-web system ports prohibited from scanner acquisition
PROHIBITED_PORTS = {
    21, 22, 23, 25, 53, 69, 110, 111, 135, 137, 138, 139, 143, 445,
    514, 587, 993, 995, 1433, 1521, 2049, 3306, 3389, 5432, 5900, 6379, 11211, 27017
}

def sanitize_url_for_display(raw_url: str) -> str:
    """Removes sensitive plaintext passwords/tokens from userinfo in URLs."""
    try:
        parsed = urlparse(raw_url)
        if parsed.password:
            # Replace password with asterisks
            netloc = f"{parsed.username}:***@{parsed.hostname}"
            if parsed.port:
                netloc += f":{parsed.port}"
            return urlunparse((parsed.scheme, netloc, parsed.path, parsed.params, parsed.query, parsed.fragment))
        return raw_url
    except Exception:
        return raw_url

class SSRFProtectedRedirectHandler(urllib.request.HTTPRedirectHandler):
    """
    Enforces that every redirect destination is validated against SSRF, DNS rebinding,
    and prohibited network ranges before any HTTP connection hop is initiated.
    """
    def __init__(self):
        super().__init__()
        self.redirect_chain: List[str] = []

    def redirect_request(self, req, fp, code, msg, headers, newurl):
        if len(self.redirect_chain) >= MAX_REDIRECTS:
            return None  # Disallow excessive redirect loops

        clean_newurl = sanitize_url_for_display(newurl)
        self.redirect_chain.append(clean_newurl)
        try:
            parsed = urlparse(newurl)
            # Enforce strictly allowed HTTP/HTTPS schemes
            if parsed.scheme.lower() not in ("http", "https"):
                return None

            target_host = (parsed.hostname or "").strip("[]").strip(".").lower()
            port = parsed.port or (443 if parsed.scheme.lower() == "https" else 80)

            # Block prohibited system/management ports
            if port in PROHIBITED_PORTS:
                return None

            # 1. Host syntax & static private IP check
            is_safe, _ = validate_host_safety(target_host)
            if not is_safe:
                return None

            # 2. DNS Resolution verification on redirect destination (prevents DNS rebinding to internal IP)
            is_safe_ip, resolved_ips, _ = resolve_and_verify_public_ips(target_host, port=port, timeout=1.5)
            if not is_safe_ip or not resolved_ips:
                return None

            return super().redirect_request(req, fp, code, msg, headers, newurl)
        except Exception:
            return None

def fetch_and_analyze_http(target_url: str) -> Tuple[HTTPResponseIntelligence, List[EvidenceItem]]:
    """
    Safely acquires HTTP response body and headers, validating SSRF controls,
    bounding network payload, and performing static DOM and security headers analysis.
    """
    obs_time = time.time()
    evidence: List[EvidenceItem] = []

    # 1. Parse and validate URL syntax, scheme, and SSRF safety
    url_to_fetch = target_url.strip()
    if not (url_to_fetch.startswith("http://") or url_to_fetch.startswith("https://")):
        url_to_fetch = "http://" + url_to_fetch

    try:
        parsed = urlparse(url_to_fetch)
    except Exception as e:
        return HTTPResponseIntelligence(
            status="error",
            error=f"Malformed URL syntax: {str(e)}",
            observed_at=obs_time
        ), evidence

    if parsed.scheme.lower() not in ("http", "https"):
        return HTTPResponseIntelligence(
            status="blocked",
            error=f"Unsupported URL scheme '{parsed.scheme}'; only http/https permitted",
            observed_at=obs_time
        ), [EvidenceItem(
            signal="http_unsupported_scheme",
            value=parsed.scheme,
            severity="medium",
            source="http_acquisition",
            description=f"HTTP probe aborted: scheme '{parsed.scheme}' is unsupported"
        )]

    hostname = (parsed.hostname or "").strip("[]").strip(".").lower()
    port = parsed.port or (443 if parsed.scheme.lower() == "https" else 80)

    if port in PROHIBITED_PORTS:
        return HTTPResponseIntelligence(
            status="blocked",
            error=f"Prohibited destination port ({port})",
            observed_at=obs_time
        ), [EvidenceItem(
            signal="http_prohibited_port",
            value=str(port),
            severity="high",
            source="http_acquisition",
            description=f"HTTP probe blocked: port {port} is restricted to prevent service exploitation"
        )]

    # Static hostname SSRF check
    is_safe, safety_reason = validate_host_safety(hostname)
    if not is_safe:
        intel = HTTPResponseIntelligence(
            status="blocked",
            final_url=sanitize_url_for_display(url_to_fetch),
            error=safety_reason,
            observed_at=obs_time
        )
        evidence.append(EvidenceItem(
            signal="http_blocked_ssrf",
            value=hostname,
            severity="critical",
            source="http_acquisition",
            description=f"HTTP acquisition blocked by SSRF filter: {safety_reason}"
        ))
        return intel, evidence

    # Dual-stack DNS Resolution and Anti-Rebinding Check
    is_safe_ip, resolved_ips, ip_reason = resolve_and_verify_public_ips(hostname, port=port, timeout=HTTP_FETCH_TIMEOUT_SECONDS)
    if not is_safe_ip or not resolved_ips:
        intel = HTTPResponseIntelligence(
            status="blocked" if "prohibited" in ip_reason.lower() or "blocked" in ip_reason.lower() else "unavailable",
            final_url=sanitize_url_for_display(url_to_fetch),
            error=ip_reason,
            observed_at=obs_time
        )
        if "prohibited" in ip_reason.lower() or "blocked" in ip_reason.lower():
            evidence.append(EvidenceItem(
                signal="http_blocked_rebinding",
                value=hostname,
                severity="critical",
                source="http_acquisition",
                description=f"HTTP probe blocked: host resolved to prohibited destination ({ip_reason})"
            ))
        return intel, evidence

    # 2. Execute Bounded HTTP GET Request with SSRF-Guarded Redirect Handler
    redirect_handler = SSRFProtectedRedirectHandler()
    opener = urllib.request.build_opener(redirect_handler)
    
    clean_display_url = sanitize_url_for_display(url_to_fetch)
    req = urllib.request.Request(
        url_to_fetch,
        headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 AgeIS-X-Scanner/1.2",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Connection": "close"
        }
    )

    try:
        with opener.open(req, timeout=HTTP_FETCH_TIMEOUT_SECONDS) as response:
            status_code = response.status
            final_url = sanitize_url_for_display(response.geturl())
            raw_headers = dict(response.headers.items())
            content_type = raw_headers.get("content-type", "")
            
            # Read bounded byte payload in chunks up to MAX_RESPONSE_BYTES
            chunks = []
            total_read = 0
            while total_read < MAX_RESPONSE_BYTES:
                chunk = response.read(min(32768, MAX_RESPONSE_BYTES - total_read))
                if not chunk:
                    break
                chunks.append(chunk)
                total_read += len(chunk)

            raw_body = b"".join(chunks)
            body_length = len(raw_body)
            decoded_html = raw_body.decode("utf-8", errors="replace")

    except urllib.error.HTTPError as e:
        status_code = e.code
        final_url = clean_display_url
        raw_headers = dict(e.headers.items()) if e.headers else {}
        content_type = raw_headers.get("content-type", "")
        raw_body = e.read(MAX_RESPONSE_BYTES) if hasattr(e, "read") else b""
        body_length = len(raw_body)
        decoded_html = raw_body.decode("utf-8", errors="replace") if raw_body else ""
        
        evidence.append(EvidenceItem(
            signal="http_error_response",
            value=f"HTTP {e.code}",
            severity="info" if e.code in (401, 403) else "medium",
            source="http_acquisition",
            description=f"Server returned HTTP error {e.code} ({e.reason})"
        ))

    except urllib.error.URLError as e:
        return HTTPResponseIntelligence(
            status="unavailable",
            final_url=clean_display_url,
            error=f"HTTP connection failed: {e.reason}",
            observed_at=obs_time
        ), evidence
    except Exception as e:
        return HTTPResponseIntelligence(
            status="error",
            final_url=clean_display_url,
            error=f"HTTP request exception: {str(e)}",
            observed_at=obs_time
        ), evidence

    # 3. Analyze Security Headers
    sec_headers, header_ev = analyze_security_headers(raw_headers)
    evidence.extend(header_ev)

    # 4. Analyze HTML / DOM / JS Content (if text/html or HTML-like body)
    dom_intel: Optional[HTMLDOMIntelligence] = None
    if "html" in content_type.lower() or "<html" in decoded_html.lower() or "<form" in decoded_html.lower():
        dom_intel, dom_ev = analyze_html_dom(decoded_html, final_url)
        evidence.extend(dom_ev)

    # 5. Evaluate Redirect Chain Evidence
    redirect_chain = redirect_handler.redirect_chain
    if len(redirect_chain) > 0:
        evidence.append(EvidenceItem(
            signal="http_redirect_chain",
            value=f"{len(redirect_chain)} redirects",
            severity="medium" if len(redirect_chain) > 1 else "info",
            source="http_acquisition",
            description=f"URL redirected through {len(redirect_chain)} hop(s) to '{final_url}'"
        ))

    res = HTTPResponseIntelligence(
        status="available",
        http_status_code=status_code,
        final_url=final_url,
        redirect_count=len(redirect_chain),
        redirect_chain=redirect_chain,
        content_type=content_type,
        content_length_bytes=body_length,
        headers=sec_headers,
        dom=dom_intel,
        observed_at=obs_time
    )

    return res, evidence

