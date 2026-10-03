import time
import socket
import ssl
from datetime import datetime, timezone
from typing import Tuple, List, Dict, Any, Optional

from .models import TLSIntelligence, EvidenceItem
from .safety import validate_host_safety, resolve_and_verify_public_ips, is_ip_address

TLS_TIMEOUT_SECONDS = 3.0

def parse_cert_datetime(date_str: Optional[str]) -> Optional[datetime]:
    """Parses standard ASN.1 / RFC 5280 certificate datetime format (e.g. 'Sep 15 04:00:00 2026 GMT')."""
    if not date_str:
        return None
    try:
        # Format: 'Month Day HH:MM:SS Year GMT'
        dt = datetime.strptime(date_str, "%b %d %H:%M:%S %Y %Z")
        return dt.replace(tzinfo=timezone.utc)
    except Exception:
        try:
            return datetime.fromisoformat(date_str.replace("Z", "+00:00"))
        except Exception:
            return None

def parse_rdn_tuple(rdn_list: Any) -> Dict[str, str]:
    """Flattens OpenSSL RDN attribute tuple into a key-value dictionary."""
    result: Dict[str, str] = {}
    if not rdn_list or not isinstance(rdn_list, (list, tuple)):
        return result

    for item in rdn_list:
        if isinstance(item, (list, tuple)):
            for sub in item:
                if isinstance(sub, (list, tuple)) and len(sub) == 2:
                    key = str(sub[0])
                    val = str(sub[1])
                    result[key] = val
    return result

def extract_san_names(cert_dict: Dict[str, Any]) -> List[str]:
    """Extracts Subject Alternative Names (SANs) from certificate dictionary."""
    san_list: List[str] = []
    san_tuple = cert_dict.get("subjectAltName", ())
    for entry in san_tuple:
        if isinstance(entry, (list, tuple)) and len(entry) == 2:
            if entry[0].lower() in ("dns", "ip address"):
                san_list.append(str(entry[1]).lower())
    return san_list

def verify_hostname_in_san(hostname: str, san_list: List[str], common_name: Optional[str]) -> bool:
    """Checks if target hostname matches certificate SANs or Common Name adhering to RFC 6125."""
    clean_host = hostname.strip(".").lower()
    all_names = [s.strip(".").lower() for s in san_list]
    if common_name:
        all_names.append(common_name.strip(".").lower())

    if clean_host in all_names:
        return True

    # Check wildcard certificates (e.g. *.example.com)
    # Wildcard '*' only matches a single domain label and cannot span apex/TLD
    host_parts = clean_host.split(".")
    if len(host_parts) >= 3:
        wildcard_candidate = f"*.{'.'.join(host_parts[1:])}"
        if wildcard_candidate in all_names:
            return True

    return False

def inspect_tls_certificate(hostname: str, port: int = 443) -> Tuple[TLSIntelligence, List[EvidenceItem]]:
    """
    Performs live TLS handshake and X.509 certificate inspection for a host.
    Guarantees SSRF & DNS rebinding protection by connecting only to pre-verified public IPs.
    """
    obs_time = time.time()
    evidence: List[EvidenceItem] = []
    clean_host = hostname.strip("[]").strip(".").lower()

    # 1. SSRF Safety Verification
    is_safe, resolved_ips, safety_reason = resolve_and_verify_public_ips(clean_host, port=port, timeout=TLS_TIMEOUT_SECONDS)
    if not is_safe or not resolved_ips:
        res = TLSIntelligence(
            status="blocked" if not is_safe else "unavailable",
            target_host=clean_host,
            target_port=port,
            connected=False,
            verified=False,
            error=safety_reason,
            observed_at=obs_time
        )
        if not is_safe:
            evidence.append(EvidenceItem(
                signal="tls_blocked_ssrf",
                value=clean_host,
                severity="critical",
                source="tls",
                description=f"TLS probe blocked by SSRF filter: {safety_reason}"
            ))
        return res, evidence

    # 2. Attempt Verified TLS Handshake against verified destination IP (anti-rebinding)
    connected = False
    verified = False
    cert_dict: Dict[str, Any] = {}
    tls_version: Optional[str] = None
    cipher_name: Optional[str] = None
    handshake_err: Optional[str] = None

    # Server hostname for SNI (omit for raw IP literal)
    sni_hostname = None if is_ip_address(clean_host) else clean_host
    target_ip = resolved_ips[0]

    # Try verified context first
    ctx = ssl.create_default_context()
    try:
        with socket.create_connection((target_ip, port), timeout=TLS_TIMEOUT_SECONDS) as raw_sock:
            with ctx.wrap_socket(raw_sock, server_hostname=sni_hostname) as ssock:
                connected = True
                verified = True
                cert_dict = ssock.getpeercert() or {}
                tls_version = ssock.version()
                cipher_tuple = ssock.cipher()
                if cipher_tuple:
                    cipher_name = cipher_tuple[0]
    except ssl.SSLCertVerificationError as e:
        connected = True
        verified = False
        handshake_err = f"Certificate verification failed: {e.verify_message}"
    except ssl.SSLError as e:
        handshake_err = f"TLS SSL error: {e}"
    except (socket.timeout, TimeoutError):
        handshake_err = f"Connection timed out after {TLS_TIMEOUT_SECONDS}s"
    except ConnectionRefusedError:
        handshake_err = f"Connection refused on port {port}"
    except Exception as e:
        handshake_err = f"TLS handshake failed: {str(e)}"

    # If verification failed (e.g. self-signed / expired / mismatch), retry with unverified context to extract cert metadata
    if connected and not verified:
        try:
            unverified_ctx = ssl._create_unverified_context()
            with socket.create_connection((target_ip, port), timeout=TLS_TIMEOUT_SECONDS) as raw_sock:
                with unverified_ctx.wrap_socket(raw_sock, server_hostname=sni_hostname) as ssock:
                    cert_dict = ssock.getpeercert() or {}
                    tls_version = ssock.version()
                    cipher_tuple = ssock.cipher()
                    if cipher_tuple:
                        cipher_name = cipher_tuple[0]
        except Exception:
            pass

    # If could not connect at all
    if not connected:
        evidence.append(EvidenceItem(
            signal="tls_connection_failed",
            value=clean_host,
            severity="medium" if port == 443 else "low",
            source="tls",
            description=f"Could not establish TLS connection on port {port}: {handshake_err}"
        ))
        return TLSIntelligence(
            status="unavailable",
            target_host=clean_host,
            target_port=port,
            connected=False,
            verified=False,
            error=handshake_err,
            observed_at=obs_time
        ), evidence

    # 3. Parse Certificate Details
    subject_rdn = parse_rdn_tuple(cert_dict.get("subject", ()))
    issuer_rdn = parse_rdn_tuple(cert_dict.get("issuer", ()))
    san_list = extract_san_names(cert_dict)

    not_before_str = cert_dict.get("notBefore")
    not_after_str = cert_dict.get("notAfter")
    nb_dt = parse_cert_datetime(not_before_str)
    na_dt = parse_cert_datetime(not_after_str)

    now_dt = datetime.now(timezone.utc)
    is_expired = False
    is_not_yet_valid = False
    days_until_exp: Optional[int] = None

    if na_dt:
        is_expired = now_dt > na_dt
        days_until_exp = (na_dt - now_dt).days

    if nb_dt:
        is_not_yet_valid = now_dt < nb_dt

    common_name = subject_rdn.get("commonName")
    issuer_name = issuer_rdn.get("commonName") or issuer_rdn.get("organizationName") or "Unknown Issuer"
    hostname_match = verify_hostname_in_san(clean_host, san_list, common_name)

    # 4. Generate Security Evidence
    if verified and hostname_match and not is_expired and not is_not_yet_valid:
        evidence.append(EvidenceItem(
            signal="tls_valid_certificate",
            value=issuer_name,
            severity="info",
            source="tls",
            description=f"Valid trusted TLS certificate issued by '{issuer_name}' ({tls_version or 'TLS'}, expires in {days_until_exp} days)"
        ))
    else:
        if not verified:
            evidence.append(EvidenceItem(
                signal="tls_untrusted_certificate",
                value=handshake_err or "Untrusted Root / Self-Signed",
                severity="high",
                source="tls",
                description=f"TLS Certificate is NOT trusted: {handshake_err or 'Self-signed or invalid CA root'}"
            ))

        if not hostname_match and (san_list or common_name):
            evidence.append(EvidenceItem(
                signal="tls_hostname_mismatch",
                value=san_list[:3],
                severity="high",
                source="tls",
                description=f"Certificate hostname mismatch: valid for {', '.join(san_list[:3]) or common_name}, does not match '{clean_host}'"
            ))

        if is_expired:
            evidence.append(EvidenceItem(
                signal="tls_certificate_expired",
                value=not_after_str,
                severity="high",
                source="tls",
                description=f"TLS Certificate EXPIRED on {not_after_str}"
            ))

        if is_not_yet_valid:
            evidence.append(EvidenceItem(
                signal="tls_certificate_not_yet_valid",
                value=not_before_str,
                severity="high",
                source="tls",
                description=f"TLS Certificate is NOT YET VALID (starts {not_before_str})"
            ))

    res = TLSIntelligence(
        status="available",
        target_host=clean_host,
        target_port=port,
        connected=True,
        verified=verified,
        hostname_match=hostname_match,
        subject=subject_rdn,
        issuer=issuer_rdn,
        san=san_list[:8],
        not_before=nb_dt.isoformat() if nb_dt else not_before_str,
        not_after=na_dt.isoformat() if na_dt else not_after_str,
        is_expired=is_expired,
        is_not_yet_valid=is_not_yet_valid,
        days_until_expiration=days_until_exp,
        tls_version=tls_version,
        cipher=cipher_name,
        error=handshake_err,
        observed_at=obs_time
    )

    return res, evidence
