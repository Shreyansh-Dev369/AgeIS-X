from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
import math
import uuid

from .common import (
    StandardEngineResponse,
    AnalysisMode,
    Verdict,
    Severity,
    Finding,
    EvidenceItem,
    TriggeredRule
)

class NetworkConnectionEvent(BaseModel):
    timestamp_sec: float
    src_ip: str
    src_port: int
    dst_ip: str
    dst_port: int
    protocol: str = "TCP"
    bytes_sent: int = 0
    bytes_received: int = 0
    domain: Optional[str] = None
    dns_query_type: Optional[str] = None

class NetworkAnalysisRequest(BaseModel):
    connections: Optional[List[NetworkConnectionEvent]] = None
    scenario_preset: Optional[str] = "c2_beaconing"

def calculate_shannon_entropy(text: str) -> float:
    if not text:
        return 0.0
    freq = {}
    for char in text:
        freq[char] = freq.get(char, 0) + 1
    entropy = 0.0
    length = len(text)
    for count in freq.values():
        p = count / length
        entropy -= p * math.log2(p)
    return entropy

def generate_preset_network_events(preset: str) -> List[NetworkConnectionEvent]:
    events: List[NetworkConnectionEvent] = []
    if preset == "c2_beaconing":
        # Regular beaconing pattern: Every 60s with ~1s jitter to an untrusted external IP
        base_time = 1729860000.0
        intervals = [60.1, 59.8, 60.3, 60.0, 59.9, 60.2, 60.1, 59.7]
        t = base_time
        for i, dt in enumerate(intervals):
            t += dt
            events.append(NetworkConnectionEvent(
                timestamp_sec=t,
                src_ip="192.168.1.105",
                src_port=49152 + i,
                dst_ip="185.220.101.45",
                dst_port=8443,
                protocol="TCP",
                bytes_sent=320,
                bytes_received=128
            ))
    elif preset == "dga_dns_tunneling":
        base_time = 1729860000.0
        dga_domains = [
            "x94bfq29la0z983ka.biz",
            "q93nf0281ksmcb39a.biz",
            "m91ksla938dnc83la.info",
            "p02kdla8374nc92la.xyz",
            "z918kdncl028475ma.biz"
        ]
        for i, dom in enumerate(dga_domains):
            events.append(NetworkConnectionEvent(
                timestamp_sec=base_time + (i * 4.5),
                src_ip="192.168.1.105",
                src_port=53100 + i,
                dst_ip="1.1.1.1",
                dst_port=53,
                protocol="UDP",
                bytes_sent=180,
                bytes_received=512,
                domain=dom,
                dns_query_type="TXT"
            ))
    elif preset == "lateral_port_scan":
        base_time = 1729860000.0
        target_ips = ["192.168.1.10", "192.168.1.11", "192.168.1.12", "192.168.1.15", "192.168.1.20"]
        ports = [445, 3389, 22]
        idx = 0
        for tip in target_ips:
            for port in ports:
                events.append(NetworkConnectionEvent(
                    timestamp_sec=base_time + (idx * 0.2),
                    src_ip="192.168.1.105",
                    src_port=58000 + idx,
                    dst_ip=tip,
                    dst_port=port,
                    protocol="TCP",
                    bytes_sent=64,
                    bytes_received=0
                ))
                idx += 1
    else:  # normal_baseline
        base_time = 1729860000.0
        events = [
            NetworkConnectionEvent(
                timestamp_sec=base_time + 10.0,
                src_ip="192.168.1.105",
                src_port=51000,
                dst_ip="142.250.190.46",
                dst_port=443,
                protocol="TCP",
                bytes_sent=1450,
                bytes_received=12400,
                domain="www.google.com"
            ),
            NetworkConnectionEvent(
                timestamp_sec=base_time + 45.0,
                src_ip="192.168.1.105",
                src_port=51002,
                dst_ip="104.16.132.229",
                dst_port=443,
                protocol="TCP",
                bytes_sent=820,
                bytes_received=4500,
                domain="cdnjs.cloudflare.com"
            )
        ]
    return events

def analyze_network_events(request: NetworkAnalysisRequest) -> StandardEngineResponse:
    events = request.connections or generate_preset_network_events(request.scenario_preset or "c2_beaconing")
    
    findings: List[Finding] = []
    evidence_items: List[EvidenceItem] = []
    triggered_rules: List[TriggeredRule] = []
    recommendations: List[str] = []
    risk_score = 0

    if not events:
        return StandardEngineResponse(
            engine_id="M-05",
            engine_name="Network Intelligence Lab",
            analysis_mode=AnalysisMode.SIMULATED,
            verdict=Verdict.INCONCLUSIVE,
            risk_score=0,
            summary="No network connection events provided for analysis.",
            limitations=["Empty event batch submitted."]
        )

    # 1. Inspect Beaconing / Periodic Connection Pattern
    # Group connections by (src_ip, dst_ip, dst_port)
    groups: Dict[tuple, List[float]] = {}
    for evt in events:
        key = (evt.src_ip, evt.dst_ip, evt.dst_port)
        groups.setdefault(key, []).append(evt.timestamp_sec)

    beacon_detected = False
    for (src, dst, port), timestamps in groups.items():
        if len(timestamps) >= 4:
            sorted_t = sorted(timestamps)
            deltas = [sorted_t[i] - sorted_t[i-1] for i in range(1, len(sorted_t))]
            avg_delta = sum(deltas) / len(deltas)
            # Standard deviation (jitter)
            variance = sum((d - avg_delta) ** 2 for d in deltas) / len(deltas)
            std_dev = math.sqrt(variance)
            jitter_ratio = std_dev / avg_delta if avg_delta > 0 else 1.0

            evidence_items.append(EvidenceItem(
                source="BeaconDetector",
                type="timing_interval_analysis",
                description=f"Destination {dst}:{port} received {len(timestamps)} connections. Mean interval: {avg_delta:.1f}s, Jitter std-dev: {std_dev:.2f}s (Jitter ratio: {jitter_ratio:.2%}).",
                raw_data={"mean_interval": avg_delta, "jitter_std_dev": std_dev, "count": len(timestamps)}
            ))

            # Beacon heuristic: Jitter ratio < 10% and count >= 4
            if jitter_ratio < 0.10 and avg_delta >= 10.0:
                beacon_detected = True
                risk_score += 55
                findings.append(Finding(
                    id=f"F-M05-BEACON-{dst.replace('.', '-')}",
                    title="Periodic C2 Beaconing Pattern Detected (Low Jitter)",
                    severity=Severity.HIGH,
                    description=f"Repeated outbound connections to {dst}:{port} exhibit strict periodic timing ({avg_delta:.1f}s ± {std_dev:.2f}s), characteristic of automated C2 heartbeat polling.",
                    mitre_id="T1071.001",
                    evidence=f"Target: {dst}:{port} | {len(timestamps)} requests | Jitter: {jitter_ratio:.1%}"
                ))
                triggered_rules.append(TriggeredRule(
                    rule_id="RULE-NET-BEACON-01",
                    name="Low-Jitter Periodic Beaconing Pattern",
                    severity=Severity.HIGH,
                    points=55,
                    description="Outbound TCP/UDP connections demonstrate synchronized intervals indicative of remote beaconing.",
                    mitre_id="T1071.001"
                ))

    # 2. Inspect DNS Query Anomalies & High-Entropy DGAs
    dga_found = 0
    for evt in events:
        if evt.domain:
            entropy = calculate_shannon_entropy(evt.domain.split(".")[0])
            if entropy > 3.6 and len(evt.domain) > 15:
                dga_found += 1
                evidence_items.append(EvidenceItem(
                    source="DNSAnomalyDetector",
                    type="dga_entropy_flag",
                    description=f"High Shannon entropy domain ({entropy:.2f}/8.0): {evt.domain} (Query type: {evt.dns_query_type or 'A'})",
                    raw_data={"domain": evt.domain, "entropy": entropy}
                ))

    if dga_found >= 3:
        risk_score += 45
        findings.append(Finding(
            id="F-M05-DGA-CLUSTER",
            title="Domain Generation Algorithm (DGA) / DNS Tunneling Cluster",
            severity=Severity.CRITICAL,
            description=f"Multiple high-entropy pseudorandom domains queried in rapid succession ({dga_found} queries), consistent with malware DGA fallbacks or DNS data exfiltration.",
            mitre_id="T1568.002",
            evidence=f"Identified {dga_found} high-entropy queries"
        ))
        triggered_rules.append(TriggeredRule(
            rule_id="RULE-NET-DGA-01",
            name="Algorithmic Domain Generation (DGA) Detection",
            severity=Severity.CRITICAL,
            points=45,
            description="Rapid queries to randomized high-entropy domain names.",
            mitre_id="T1568.002"
        ))

    # 3. Inspect Unusual Outbound Ports
    unusual_ports = {8443, 4444, 1337, 6667, 9001}
    for evt in events:
        if evt.dst_port in unusual_ports and not evt.dst_ip.startswith("192.168."):
            risk_score += 20
            findings.append(Finding(
                id=f"F-M05-PORT-{evt.dst_port}",
                title=f"Non-Standard Egress Port Connection (Port {evt.dst_port})",
                severity=Severity.MEDIUM,
                description=f"Outbound connection to public IP {evt.dst_ip} on non-standard port {evt.dst_port}.",
                mitre_id="T1571",
                evidence=f"{evt.src_ip} -> {evt.dst_ip}:{evt.dst_port}"
            ))
            triggered_rules.append(TriggeredRule(
                rule_id="RULE-NET-PORT-ANOMALY",
                name="Anomalous Egress Port Usage",
                severity=Severity.MEDIUM,
                points=20,
                description="Traffic directed to uncommon high-risk service port.",
                mitre_id="T1571"
            ))
            break  # flag once

    # 4. Internal Lateral Scanning Detection
    internal_dsts = set(evt.dst_ip for evt in events if evt.dst_ip.startswith("192.168.") or evt.dst_ip.startswith("10."))
    if len(internal_dsts) >= 4:
        risk_score += 40
        findings.append(Finding(
            id="F-M05-INTERNAL-SWEEP",
            title="Internal Subnet Host / Port Sweeping (Lateral Reconnaissance)",
            severity=Severity.HIGH,
            description=f"Source host connected to {len(internal_dsts)} distinct internal IP addresses within a short timeframe.",
            mitre_id="T1046",
            evidence=f"Targets probed: {', '.join(list(internal_dsts)[:4])}..."
        ))
        triggered_rules.append(TriggeredRule(
            rule_id="RULE-NET-SCAN-01",
            name="Internal Lateral Subnet Sweeping",
            severity=Severity.HIGH,
            points=40,
            description="One host probing multiple private IP ranges across administrative ports.",
            mitre_id="T1046"
        ))

    risk_score = min(100, max(0, risk_score))
    if risk_score >= 70:
        verdict = Verdict.MALICIOUS
        summary = "HIGH-RISK NETWORK ANOMALY: Statistically significant beaconing or DGA tunneling pattern identified."
        recommendations = [
            "Block destination IP / domain at egress proxy or firewall",
            "Perform host-level process-to-socket correlation on source host",
            "Review DNS sinkhole logs for secondary DGA candidate hits"
        ]
    elif risk_score >= 35:
        verdict = Verdict.SUSPICIOUS
        summary = "SUSPICIOUS NETWORK ACTIVITY: Unusual ports or internal connection volume detected; requires contextual triage."
        recommendations = [
            "Verify business purpose of egress connections to non-standard ports",
            "Monitor source endpoint for potential credential harvesting or scanning"
        ]
    else:
        verdict = Verdict.SAFE
        summary = "Network telemetry within expected baseline. No persistent beaconing, DGA domains, or subnet sweeps detected."
        recommendations = [
            "Maintain standard egress filtering policy",
            "Continue periodic netflow interval analysis"
        ]

    return StandardEngineResponse(
        engine_id="M-05",
        engine_name="Network Intelligence Lab",
        analysis_mode=AnalysisMode.SIMULATED,
        verdict=verdict,
        risk_score=risk_score,
        confidence=0.94,
        summary=summary,
        findings=findings,
        evidence=evidence_items,
        triggered_rules=triggered_rules,
        recommendations=recommendations,
        limitations=[
            "Deterministic analysis of synthetic NetFlow/DNS telemetry logs. Note: Periodic timing suggests beaconing behavior but does not conclusively prove C2 without payload inspection."
        ],
        metadata={
            "total_connections": len(events),
            "beacon_detected": beacon_detected,
            "dga_queries_flagged": dga_found,
            "preset_applied": request.scenario_preset or "custom"
        }
    )
