from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
import time
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

class ThreatIndicatorRecord(BaseModel):
    indicator: str
    indicator_type: str  # domain, ip, sha256
    source: str
    first_seen: float
    last_seen: float
    confidence: float
    expiry: Optional[float] = None
    provenance: str
    threat_actor: Optional[str] = None
    malware_family: Optional[str] = None
    mitre_tactics: List[str] = Field(default_factory=list)
    tags: List[str] = Field(default_factory=list)
    status: str = "active"  # active, stale, expired

# Curated Offline Threat Intelligence Feed Fixture
OFFLINE_IOC_FIXTURES: Dict[str, ThreatIndicatorRecord] = {
    "c2-stealth-relay.biz": ThreatIndicatorRecord(
        indicator="c2-stealth-relay.biz",
        indicator_type="domain",
        source="CISA Automated Indicator Sharing (AIS)",
        first_seen=1728000000.0,
        last_seen=1729800000.0,
        confidence=0.95,
        expiry=1900000000.0,
        provenance="Authoritative Government Cyber Advisory #AA26-280A",
        threat_actor="APT29 / Cozy Bear",
        malware_family="WellMess Stager",
        mitre_tactics=["Command and Control", "Initial Access"],
        tags=["apt", "russia", "stealth-c2", "high-priority"],
        status="active"
    ),
    "185.220.101.5": ThreatIndicatorRecord(
        indicator="185.220.101.5",
        indicator_type="ip",
        source="Spamhaus DROP / Shadowserver C2 Tracker",
        first_seen=1727000000.0,
        last_seen=1729750000.0,
        confidence=0.91,
        expiry=1900000000.0,
        provenance="Active HoneyPot Sensor Telemetry",
        threat_actor="FIN7 / Carbanak",
        malware_family="Cobalt Strike Team Server",
        mitre_tactics=["Command and Control"],
        tags=["bulletproof-host", "tor-exit", "fin7", "cobalt-strike"],
        status="active"
    ),
    "ed01ebf83334a19373630c745e1f7e35a019319f34aa06524f7f5087dc06c5e2": ThreatIndicatorRecord(
        indicator="ed01ebf83334a19373630c745e1f7e35a019319f34aa06524f7f5087dc06c5e2",
        indicator_type="sha256",
        source="MalwareBazaar / MISP Community Feed",
        first_seen=1500000000.0,
        last_seen=1729000000.0,
        confidence=0.99,
        expiry=1760000000.0,
        provenance="Verified Binary Detonation Sandbox",
        threat_actor="Lazarus Group",
        malware_family="WannaCryptor.Gen",
        mitre_tactics=["Impact", "Lateral Movement"],
        tags=["ransomware", "ms17-010", "eternalblue", "critical"],
        status="active"
    ),
    "legacy-phish-2022.com": ThreatIndicatorRecord(
        indicator="legacy-phish-2022.com",
        indicator_type="domain",
        source="PhishTank Historical Archive",
        first_seen=1640995200.0,
        last_seen=1643673600.0,
        confidence=0.70,
        expiry=1672531199.0,  # Expired in 2022
        provenance="Community Crowdsourced Submission",
        threat_actor=None,
        malware_family="Generic Microsoft Phish",
        mitre_tactics=["Credential Access"],
        tags=["phishing", "archive", "stale"],
        status="expired"
    )
}

class ThreatIntelLookupRequest(BaseModel):
    query: Optional[str] = None
    indicator_type: Optional[str] = None
    scenario_preset: Optional[str] = "c2_domain_apt"

def analyze_threat_intelligence(request: ThreatIntelLookupRequest) -> StandardEngineResponse:
    preset_map = {
        "c2_domain_apt": "c2-stealth-relay.biz",
        "bulletproof_ip": "185.220.101.5",
        "lockbit_hash": "ed01ebf83334a19373630c745e1f7e35a019319f34aa06524f7f5087dc06c5e2",
        "stale_indicator": "legacy-phish-2022.com",
        "unmatched_query": "unseen-internal-service.local"
    }

    query = request.query.strip().lower() if request.query and request.query.strip() else preset_map.get(request.scenario_preset or "c2_domain_apt", "c2-stealth-relay.biz")
    
    findings: List[Finding] = []
    evidence_items: List[EvidenceItem] = []
    triggered_rules: List[TriggeredRule] = []
    recommendations: List[str] = []
    limitations: List[str] = []

    record = OFFLINE_IOC_FIXTURES.get(query)

    if record:
        now = time.time()
        is_expired = record.expiry is not None and now > record.expiry
        status = "expired" if is_expired else record.status

        evidence_items.append(EvidenceItem(
            source=record.source,
            type="indicator_match",
            description=f"Matched Indicator: {record.indicator} ({record.indicator_type.upper()}). Provenance: {record.provenance}. Actor: {record.threat_actor or 'Unassigned'}. Family: {record.malware_family or 'Unclassified'}.",
            raw_data=record.model_dump()
        ))

        if status == "expired":
            risk_score = 40
            verdict = Verdict.SUSPICIOUS
            findings.append(Finding(
                id="F-M10-STALE-IOC",
                title=f"Historical / Expired Threat Indicator ({record.indicator})",
                severity=Severity.LOW,
                description=f"Indicator matched historical record from {record.source}, but telemetry expired on {time.ctime(record.expiry)}. Domain or IP may have been sinkholed or re-registered by a benign party.",
                evidence=f"Last Seen: {time.ctime(record.last_seen)} | Status: EXPIRED"
            ))
            triggered_rules.append(TriggeredRule(
                rule_id="RULE-TI-STALE-INDICATOR",
                name="Stale / Expired Threat Intelligence Record",
                severity=Severity.LOW,
                points=40,
                description="Indicator record is aged past its designated validity TTL."
            ))
            summary = f"HISTORICAL / STALE THREAT INTEL: Indicator '{query}' was previously flagged as malicious but record has expired. Exercise cautious review."
            recommendations = [
                "Verify whether the IP or domain has transferred ownership since expiry",
                "Review recent endpoint logs for communication within the last 30 days"
            ]
        else:
            # Active Indicator
            risk_score = int(record.confidence * 100)
            verdict = Verdict.MALICIOUS
            findings.append(Finding(
                id="F-M10-ACTIVE-THREAT",
                title=f"Verified Active Threat Indicator ({record.malware_family or record.threat_actor})",
                severity=Severity.CRITICAL,
                description=f"Confirmed active IoC linked to {record.threat_actor or 'threat campaign'} distributing {record.malware_family}. Source: {record.source} (Confidence: {record.confidence:.0%}).",
                mitre_id=record.mitre_tactics[0] if record.mitre_tactics else "T1071",
                evidence=f"Tags: {', '.join(record.tags)}"
            ))
            triggered_rules.append(TriggeredRule(
                rule_id="RULE-TI-ACTIVE-MATCH",
                name="Authoritative Threat Feed Correlation",
                severity=Severity.CRITICAL,
                points=risk_score,
                description=f"Match in {record.source} with confidence {record.confidence:.0%}.",
                mitre_id=record.mitre_tactics[0] if record.mitre_tactics else None
            ))
            summary = f"CONFIRMED ACTIVE THREAT INDICATOR: '{query}' identified as high-confidence threat infrastructure ({record.malware_family})."
            recommendations = [
                "Implement immediate block on firewall, perimeter DNS, and proxy egress",
                f"Triage all endpoints communicating with {query} for {record.malware_family} infection",
                "Initiate threat hunt across historical SIEM archives using the indicator hash/IP"
            ]
    else:
        # Crucial Requirement: Do NOT label unmatched indicators as safe!
        risk_score = 0
        verdict = Verdict.INCONCLUSIVE
        summary = f"NO THREAT INTELLIGENCE MATCH FOUND: Indicator '{query}' was not found in the local verified threat database. Unmatched status does NOT prove the indicator is safe."
        limitations.append(
            f"Indicator '{query}' is unseen in the current offline threat database fixture. Live commercial MISP/OpenCTI integration required for exhaustive real-time threat feed coverage."
        )
        recommendations = [
            "Perform secondary dynamic behavioral analysis (M-01, M-04, M-05)",
            "Do not assume the destination is safe merely because no active IoC match exists"
        ]

    limitations.append("Threat intelligence database is currently running against the offline curated demo fixture.")

    return StandardEngineResponse(
        engine_id="M-10",
        engine_name="Threat Intelligence",
        analysis_mode=AnalysisMode.SIMULATED,
        verdict=verdict,
        risk_score=risk_score,
        confidence=record.confidence if record else None,
        summary=summary,
        findings=findings,
        evidence=evidence_items,
        triggered_rules=triggered_rules,
        recommendations=recommendations,
        limitations=limitations,
        metadata={
            "query": query,
            "matched": record is not None,
            "feed_status": record.status if record else "unmatched"
        }
    )
