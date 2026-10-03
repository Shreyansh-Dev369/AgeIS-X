import time
import socket
import json
import urllib.request
import urllib.error
from typing import Tuple, List, Dict, Any, Optional

from .models import DNSIntelligence, EvidenceItem
from .safety import validate_host_safety, is_ip_address, is_prohibited_ip

DNS_TIMEOUT_SECONDS = 2.5
DOH_ENDPOINT = "https://cloudflare-dns.com/dns-query"

def query_doh_record(hostname: str, record_type: str) -> List[str]:
    """Queries Cloudflare DNS-over-HTTPS JSON API with strict timeout."""
    url = f"{DOH_ENDPOINT}?name={urllib.request.quote(hostname)}&type={record_type}"
    req = urllib.request.Request(
        url,
        headers={
            "Accept": "application/dns-json",
            "User-Agent": "AgeIS-X-DNS-Engine/1.0"
        }
    )
    records: List[str] = []
    try:
        with urllib.request.urlopen(req, timeout=DNS_TIMEOUT_SECONDS) as resp:
            if resp.status == 200:
                data = json.loads(resp.read().decode("utf-8"))
                for ans in data.get("Answer", []):
                    data_val = ans.get("data")
                    if data_val:
                        # Clean up quotes around TXT records
                        clean_data = str(data_val).strip('"').strip()
                        records.append(clean_data)
    except Exception:
        pass
    return records

def fetch_dns_intelligence(hostname: str) -> Tuple[DNSIntelligence, List[EvidenceItem]]:
    """
    Performs live DNS resolution and DNS-over-HTTPS inspection for a hostname.
    Guarantees SSRF safety and detects private IP DNS rebinding.
    """
    obs_time = time.time()
    evidence: List[EvidenceItem] = []
    clean_host = hostname.strip("[]").strip(".").lower()

    # 1. SSRF Safety Check
    is_safe, safety_reason = validate_host_safety(clean_host)
    if not is_safe:
        res = DNSIntelligence(
            status="blocked",
            hostname=clean_host,
            error=safety_reason,
            observed_at=obs_time
        )
        evidence.append(EvidenceItem(
            signal="dns_blocked_ssrf",
            value=clean_host,
            severity="critical",
            source="dns",
            description=f"DNS resolution blocked by SSRF safety filter: {safety_reason}"
        ))
        return res, evidence

    # If already an IP address
    if is_ip_address(clean_host):
        is_blocked, ip_reason = is_prohibited_ip(clean_host)
        if is_blocked:
            res = DNSIntelligence(
                status="blocked",
                hostname=clean_host,
                error=ip_reason,
                observed_at=obs_time
            )
            evidence.append(EvidenceItem(
                signal="dns_private_ip_literal",
                value=clean_host,
                severity="critical",
                source="dns",
                description=f"Direct private/internal IP literal target blocked: {ip_reason}"
            ))
            return res, evidence

        res = DNSIntelligence(
            status="available",
            hostname=clean_host,
            a=[clean_host] if ":" not in clean_host else [],
            aaaa=[clean_host] if ":" in clean_host else [],
            resolver="ip_literal",
            observed_at=obs_time
        )
        evidence.append(EvidenceItem(
            signal="dns_public_ip_literal",
            value=clean_host,
            severity="info",
            source="dns",
            description=f"Target is a public IP address literal: {clean_host}"
        ))
        return res, evidence

    # 2. Query System DNS & DoH Records
    a_records: List[str] = []
    aaaa_records: List[str] = []
    cname_records: List[str] = []
    mx_records: List[str] = []
    ns_records: List[str] = []
    txt_records: List[str] = []
    resolver_used = "system_dns"
    is_doh = False

    # First attempt native socket getaddrinfo for fast local resolution
    has_system_dns = False
    try:
        addr_info = socket.getaddrinfo(clean_host, None, socket.AF_UNSPEC, socket.SOCK_STREAM)
        for item in addr_info:
            ip = item[4][0]
            if ":" in ip and ip not in aaaa_records:
                aaaa_records.append(ip)
            elif ":" not in ip and ip not in a_records:
                a_records.append(ip)
        has_system_dns = len(a_records) > 0 or len(aaaa_records) > 0
    except socket.gaierror:
        has_system_dns = False
    except Exception:
        has_system_dns = False

    # Complement with DoH queries for CNAME, MX, NS, TXT and backup A/AAAA
    doh_a = query_doh_record(clean_host, "A")
    doh_aaaa = query_doh_record(clean_host, "AAAA")
    cname_records = query_doh_record(clean_host, "CNAME")
    mx_records = query_doh_record(clean_host, "MX")
    ns_records = query_doh_record(clean_host, "NS")
    txt_records = query_doh_record(clean_host, "TXT")

    if doh_a:
        for ip in doh_a:
            if ip not in a_records:
                a_records.append(ip)
        is_doh = True
        resolver_used = "system_and_doh"

    if doh_aaaa:
        for ip in doh_aaaa:
            if ip not in aaaa_records:
                aaaa_records.append(ip)
        is_doh = True
        resolver_used = "system_and_doh"

    all_ips = a_records + aaaa_records

    # 3. Security Inspection on Resolved IPs (DNS Rebinding Check)
    has_private_resolution = False
    for ip in all_ips:
        is_priv, priv_reason = is_prohibited_ip(ip)
        if is_priv:
            has_private_resolution = True
            evidence.append(EvidenceItem(
                signal="dns_rebinding_prohibited_ip",
                value=ip,
                severity="critical",
                source="dns",
                description=f"CRITICAL: Hostname '{clean_host}' resolved to private/prohibited IP {ip} ({priv_reason})"
            ))

    if has_private_resolution:
        return DNSIntelligence(
            status="blocked",
            hostname=clean_host,
            a=a_records,
            aaaa=aaaa_records,
            error="Prohibited internal IP detected in DNS resolution",
            observed_at=obs_time
        ), evidence

    # Non-resolving domain check
    if not all_ips and not cname_records:
        evidence.append(EvidenceItem(
            signal="dns_non_resolving",
            value=clean_host,
            severity="medium",
            source="dns",
            description=f"Hostname '{clean_host}' could not be resolved (NXDOMAIN or no A/AAAA records)"
        ))
        return DNSIntelligence(
            status="unavailable",
            hostname=clean_host,
            error="No public IP addresses resolved for hostname",
            observed_at=obs_time
        ), evidence

    # Valid Public Resolution Evidence
    if a_records:
        evidence.append(EvidenceItem(
            signal="dns_a_records",
            value=a_records[:3],
            severity="info",
            source="dns",
            description=f"Resolved IPv4: {', '.join(a_records[:3])}{' (+' + str(len(a_records)-3) + ' more)' if len(a_records)>3 else ''}"
        ))

    if aaaa_records:
        evidence.append(EvidenceItem(
            signal="dns_aaaa_records",
            value=aaaa_records[:2],
            severity="info",
            source="dns",
            description=f"Resolved IPv6: {', '.join(aaaa_records[:2])}"
        ))

    if mx_records:
        evidence.append(EvidenceItem(
            signal="dns_mx_records",
            value=mx_records[:2],
            severity="info",
            source="dns",
            description=f"Mail exchange (MX) active: {', '.join(mx_records[:2])}"
        ))

    return DNSIntelligence(
        status="available",
        hostname=clean_host,
        a=a_records[:8],
        aaaa=aaaa_records[:4],
        cname=cname_records[:4],
        mx=mx_records[:4],
        ns=ns_records[:4],
        txt=txt_records[:4],
        is_doh=is_doh,
        resolver=resolver_used,
        observed_at=obs_time
    ), evidence
