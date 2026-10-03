import time
import json
import urllib.request
import urllib.error
from datetime import datetime, timezone
from typing import Tuple, List, Optional, Dict, Any

from .models import RDAPIntelligence, EvidenceItem
from .safety import validate_host_safety, is_ip_address

# Standard RDAP query bootstrap services
RDAP_BOOTSTRAP_BASE = "https://rdap.org/domain/"
RDAP_TIMEOUT_SECONDS = 3.0

def extract_apex_domain(hostname: str) -> str:
    """Extracts the registered domain / apex from a hostname."""
    clean = hostname.strip(".").lower()
    if is_ip_address(clean):
        return clean

    parts = clean.split(".")
    if len(parts) <= 2:
        return clean

    # Handle common two-part ccTLD public suffixes (e.g., co.uk, com.au, com.br)
    two_part_suffixes = {
        "co.uk", "org.uk", "gov.uk", "ac.uk", "com.au", "net.au", "org.au",
        "co.nz", "com.br", "co.jp", "ne.jp", "com.sg", "co.in", "net.in",
        "org.in", "gov.in", "com.mx", "com.ar", "com.tw", "com.hk"
    }

    last_two = f"{parts[-2]}.{parts[-1]}"
    if last_two in two_part_suffixes and len(parts) >= 3:
        return f"{parts[-3]}.{last_two}"

    return f"{parts[-2]}.{parts[-1]}"

def parse_iso_datetime(dt_str: str) -> Optional[datetime]:
    """Parses various ISO 8601 datetime formats into timezone-aware datetime."""
    if not dt_str:
        return None
    try:
        # Standard ISO format (e.g. 1997-09-15T04:00:00Z)
        clean = dt_str.replace("Z", "+00:00")
        return datetime.fromisoformat(clean)
    except Exception:
        return None

def format_domain_age(age_days: int) -> str:
    """Formats age in days into a clean human-readable duration."""
    if age_days < 0:
        return "0 days"
    if age_days < 30:
        return f"{age_days} day{'s' if age_days != 1 else ''}"
    if age_days < 365:
        months = round(age_days / 30.44, 1)
        return f"{months} months"
    years = round(age_days / 365.25, 1)
    return f"{years} years"

class SafeRDAPRedirectHandler(urllib.request.HTTPRedirectHandler):
    """Guarantees that HTTP redirects in RDAP queries never pivot to internal/private targets."""
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        from urllib.parse import urlparse
        try:
            parsed = urlparse(newurl)
            if parsed.scheme.lower() not in ("http", "https"):
                return None  # Disallow file://, gopher://, etc.
            target_host = (parsed.hostname or "").strip("[]").lower()
            is_safe, _ = validate_host_safety(target_host)
            if not is_safe:
                return None  # Disallow redirection to localhost or private IPs
            return super().redirect_request(req, fp, code, msg, headers, newurl)
        except Exception:
            return None

def fetch_rdap_intelligence(hostname: str) -> Tuple[RDAPIntelligence, List[EvidenceItem]]:
    """
    Performs authoritative RDAP registration lookup for a given domain.
    Does NOT invent registration dates or registrar names.
    """
    obs_time = time.time()
    apex = extract_apex_domain(hostname)
    evidence: List[EvidenceItem] = []

    # 1. SSRF Safety Check
    is_safe, safety_reason = validate_host_safety(apex)
    if not is_safe:
        res = RDAPIntelligence(
            status="blocked",
            domain=apex,
            error=safety_reason,
            observed_at=obs_time
        )
        evidence.append(EvidenceItem(
            signal="rdap_blocked_ssrf",
            value=apex,
            severity="critical",
            source="rdap",
            description=f"RDAP lookup blocked by safety filter: {safety_reason}"
        ))
        return res, evidence

    if is_ip_address(apex):
        res = RDAPIntelligence(
            status="unavailable",
            domain=apex,
            error="Target is an IP literal; domain RDAP registry query not applicable",
            observed_at=obs_time
        )
        return res, evidence

    # 2. Query Authoritative RDAP Service with Safe Redirect Handler
    rdap_url = f"{RDAP_BOOTSTRAP_BASE}{apex}"
    req = urllib.request.Request(
        rdap_url,
        headers={
            "User-Agent": "AgeIS-X-Security-Engine/1.0 (Cybersecurity Forensic Audit)",
            "Accept": "application/rdap+json, application/json"
        }
    )

    try:
        opener = urllib.request.build_opener(SafeRDAPRedirectHandler())
        with opener.open(req, timeout=RDAP_TIMEOUT_SECONDS) as response:
            if response.status != 200:
                return RDAPIntelligence(
                    status="unavailable",
                    domain=apex,
                    error=f"RDAP service returned HTTP {response.status}",
                    observed_at=obs_time
                ), evidence

            raw_bytes = response.read()
            data = json.loads(raw_bytes.decode("utf-8", errors="replace"))

    except urllib.error.HTTPError as e:
        err_msg = f"RDAP HTTP error {e.code}: {e.reason}"
        if e.code == 404:
            err_msg = "Domain record not found in authoritative RDAP registry (possible unregistered / NXDOMAIN)"
            evidence.append(EvidenceItem(
                signal="rdap_domain_not_found",
                value=apex,
                severity="medium",
                source="rdap",
                description=f"Authoritative RDAP query returned 404 Not Found for '{apex}'"
            ))
        return RDAPIntelligence(
            status="unavailable" if e.code != 404 else "error",
            domain=apex,
            error=err_msg,
            observed_at=obs_time
        ), evidence
    except urllib.error.URLError as e:
        return RDAPIntelligence(
            status="unavailable",
            domain=apex,
            error=f"RDAP network connectivity error: {e.reason}",
            observed_at=obs_time
        ), evidence
    except Exception as e:
        return RDAPIntelligence(
            status="error",
            domain=apex,
            error=f"RDAP parsing exception: {str(e)}",
            observed_at=obs_time
        ), evidence

    # 3. Parse RDAP Data Model
    reg_date_str: Optional[str] = None
    exp_date_str: Optional[str] = None
    upd_date_str: Optional[str] = None

    for event in data.get("events", []):
        action = event.get("eventAction")
        date_val = event.get("eventDate")
        if action == "registration":
            reg_date_str = date_val
        elif action == "expiration":
            exp_date_str = date_val
        elif action == "last changed":
            upd_date_str = date_val

    # Extract Registrar Name
    registrar_name: Optional[str] = None
    for entity in data.get("entities", []):
        roles = entity.get("roles", [])
        if "registrar" in roles or "sponsor" in roles:
            # Check vcardArray
            vcard = entity.get("vcardArray", [])
            if len(vcard) > 1 and isinstance(vcard[1], list):
                for item in vcard[1]:
                    if isinstance(item, list) and len(item) > 3 and item[0] == "fn":
                        registrar_name = str(item[3])
                        break
            if not registrar_name and entity.get("handle"):
                registrar_name = str(entity.get("handle"))
            if registrar_name:
                break

    # Extract Nameservers
    nameservers: List[str] = []
    for ns in data.get("nameservers", []):
        ns_name = ns.get("ldhName")
        if ns_name:
            nameservers.append(ns_name.lower())

    # Extract Status Codes
    status_codes = data.get("status", [])

    # Calculate authoritative domain age
    age_days: Optional[int] = None
    age_formatted: Optional[str] = None

    if reg_date_str:
        reg_dt = parse_iso_datetime(reg_date_str)
        if reg_dt:
            now_dt = datetime.now(timezone.utc)
            delta = now_dt - reg_dt
            age_days = max(0, delta.days)
            age_formatted = format_domain_age(age_days)

            # Security Evidence Evaluation
            if age_days < 30:
                evidence.append(EvidenceItem(
                    signal="newly_registered_domain",
                    value=age_days,
                    severity="high",
                    source="rdap",
                    description=f"Newly Registered Domain: registered only {age_days} days ago ({reg_date_str.split('T')[0]})"
                ))
            elif age_days < 90:
                evidence.append(EvidenceItem(
                    signal="young_domain",
                    value=age_days,
                    severity="medium",
                    source="rdap",
                    description=f"Young domain registration: {age_formatted} old"
                ))
            else:
                evidence.append(EvidenceItem(
                    signal="established_domain_age",
                    value=age_days,
                    severity="info",
                    source="rdap",
                    description=f"Established domain age: {age_formatted} ({reg_date_str.split('T')[0]})"
                ))

    if registrar_name:
        evidence.append(EvidenceItem(
            signal="authoritative_registrar",
            value=registrar_name,
            severity="info",
            source="rdap",
            description=f"Registrar identified: {registrar_name}"
        ))

    result = RDAPIntelligence(
        status="available",
        domain=apex,
        registrar=registrar_name,
        registered_at=reg_date_str,
        expires_at=exp_date_str,
        updated_at=upd_date_str,
        domain_age_days=age_days,
        domain_age_formatted=age_formatted if age_formatted else "Unavailable",
        nameservers=nameservers[:6],
        status_codes=status_codes[:6],
        source_url=rdap_url,
        observed_at=obs_time
    )

    return result, evidence
