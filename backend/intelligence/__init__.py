import concurrent.futures
from typing import Tuple, List, Dict, Any

from .models import RDAPIntelligence, DNSIntelligence, TLSIntelligence, EvidenceItem
from .safety import validate_host_safety
from .rdap import fetch_rdap_intelligence
from .dns import fetch_dns_intelligence
from .tls import inspect_tls_certificate

TOTAL_GATHER_TIMEOUT_SECONDS = 4.0

def gather_domain_intelligence(
    hostname: str,
    port: int = 443,
    is_https: bool = True
) -> Tuple[RDAPIntelligence, DNSIntelligence, TLSIntelligence, List[EvidenceItem]]:
    """
    Concurrently executes authoritative RDAP lookup, DNS resolution, and TLS
    certificate inspection for a target host. Guarantees independent provider
    failures and SSRF protection.
    """
    evidence: List[EvidenceItem] = []
    clean_host = hostname.strip("[]").strip(".").lower()

    # Pre-validate host safety
    is_safe, reason = validate_host_safety(clean_host)
    if not is_safe:
        rdap_res = RDAPIntelligence(status="blocked", domain=clean_host, error=reason)
        dns_res = DNSIntelligence(status="blocked", hostname=clean_host, error=reason)
        tls_res = TLSIntelligence(status="blocked", target_host=clean_host, error=reason)
        evidence.append(EvidenceItem(
            signal="host_blocked_ssrf",
            value=clean_host,
            severity="critical",
            source="safety",
            description=f"Network intelligence query blocked: {reason}"
        ))
        return rdap_res, dns_res, tls_res, evidence

    # Execute providers concurrently with bounded timeout
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
        future_rdap = executor.submit(fetch_rdap_intelligence, clean_host)
        future_dns = executor.submit(fetch_dns_intelligence, clean_host)
        
        # Only probe TLS if HTTPS scheme or non-standard port specified
        if is_https or port not in (80, 8080):
            future_tls = executor.submit(inspect_tls_certificate, clean_host, port)
        else:
            future_tls = None

        # Gather RDAP
        try:
            rdap_res, rdap_ev = future_rdap.result(timeout=TOTAL_GATHER_TIMEOUT_SECONDS)
            evidence.extend(rdap_ev)
        except Exception as e:
            rdap_res = RDAPIntelligence(status="error", domain=clean_host, error=f"RDAP execution error: {str(e)}")

        # Gather DNS
        try:
            dns_res, dns_ev = future_dns.result(timeout=TOTAL_GATHER_TIMEOUT_SECONDS)
            evidence.extend(dns_ev)
        except Exception as e:
            dns_res = DNSIntelligence(status="error", hostname=clean_host, error=f"DNS execution error: {str(e)}")

        # Gather TLS
        if future_tls is not None:
            try:
                tls_res, tls_ev = future_tls.result(timeout=TOTAL_GATHER_TIMEOUT_SECONDS)
                evidence.extend(tls_ev)
            except Exception as e:
                tls_res = TLSIntelligence(status="error", target_host=clean_host, target_port=port, error=f"TLS execution error: {str(e)}")
        else:
            tls_res = TLSIntelligence(
                status="unavailable",
                target_host=clean_host,
                target_port=port,
                connected=False,
                error="Target URL scheme is plain HTTP (no TLS configured)"
            )

    return rdap_res, dns_res, tls_res, evidence
