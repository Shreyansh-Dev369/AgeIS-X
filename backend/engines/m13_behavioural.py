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

class CorrelatedEvent(BaseModel):
    event_id: str
    source_engine: str  # M-01, M-02, M-03, M-04, M-05, M-06, etc.
    timestamp_epoch: float
    stage_name: str     # initial_access, execution, credential_access, lateral_movement, c2
    title: str
    details: Dict[str, Any]
    entity: str         # user email, IP, hostname, hash

class BehaviouralAnalysisRequest(BaseModel):
    events: Optional[List[CorrelatedEvent]] = None
    scenario_preset: Optional[str] = "multi_stage_compromise"

def generate_preset_behavioural_chain(preset: str) -> List[CorrelatedEvent]:
    base_t = 1729860000.0
    if preset == "lateral_movement_spill":
        return [
            CorrelatedEvent(
                event_id="EVT-01",
                source_engine="M-06",
                timestamp_epoch=base_t,
                stage_name="credential_access",
                title="Service Account Password Spray Failure (8 attempts)",
                details={"src_ip": "192.168.1.50", "target": "svc_backup@internal"},
                entity="svc_backup@internal"
            ),
            CorrelatedEvent(
                event_id="EVT-02",
                source_engine="M-06",
                timestamp_epoch=base_t + 180.0,
                stage_name="credential_access",
                title="Successful NTLM Authentication from Non-Standard Node",
                details={"src_ip": "192.168.1.50", "target": "svc_backup@internal"},
                entity="svc_backup@internal"
            ),
            CorrelatedEvent(
                event_id="EVT-03",
                source_engine="M-05",
                timestamp_epoch=base_t + 420.0,
                stage_name="lateral_movement",
                title="Port 445 SMB Sweeps Across 12 Domain Controllers",
                details={"src_ip": "192.168.1.50", "ports": [445, 139]},
                entity="192.168.1.50"
            )
        ]
    else:  # default: multi_stage_compromise
        return [
            CorrelatedEvent(
                event_id="EVT-B01",
                source_engine="M-03",
                timestamp_epoch=base_t,
                stage_name="initial_access",
                title="Spearphishing Email Delivered with Urgency Lure",
                details={
                    "sender": "payroll-notification@login-update-corp.xyz",
                    "subject": "Mandatory 2026 Compensation Review",
                    "link": "https://login-update-corp.xyz/auth/verify"
                },
                entity="operator@corp.internal"
            ),
            CorrelatedEvent(
                event_id="EVT-B02",
                source_engine="M-01",
                timestamp_epoch=base_t + 140.0,  # 2m 20s later
                stage_name="execution",
                title="User Clicked Phishing Link (Newly Registered Domain)",
                details={
                    "url": "https://login-update-corp.xyz/auth/verify",
                    "rdap_age_days": 2,
                    "tls_untrusted": True
                },
                entity="login-update-corp.xyz"
            ),
            CorrelatedEvent(
                event_id="EVT-B03",
                source_engine="M-06",
                timestamp_epoch=base_t + 320.0,  # 3m later
                stage_name="credential_access",
                title="Failed Authentication Attempts Followed by Anomalous Login",
                details={
                    "user": "operator@corp.internal",
                    "failures": 3,
                    "unusual_login_ip": "185.220.101.45 (Sofia, BG)"
                },
                entity="operator@corp.internal"
            ),
            CorrelatedEvent(
                event_id="EVT-B04",
                source_engine="M-04",
                timestamp_epoch=base_t + 650.0,  # 5m later
                stage_name="execution",
                title="Office Process Spawning Encoded PowerShell Shell",
                details={
                    "parent": "winword.exe",
                    "child": "powershell.exe -w hidden -enc JABzAD0..."
                },
                entity="Workstation-ALEX-04"
            ),
            CorrelatedEvent(
                event_id="EVT-B05",
                source_engine="M-05",
                timestamp_epoch=base_t + 900.0,  # 4m later
                stage_name="c2",
                title="Low-Jitter Outbound Beaconing to External Untrusted ASN",
                details={
                    "dst_ip": "185.220.101.45",
                    "port": 8443,
                    "interval_sec": 60.1
                },
                entity="185.220.101.45"
            )
        ]

def analyze_behavioural_correlation(request: BehaviouralAnalysisRequest) -> StandardEngineResponse:
    events = request.events or generate_preset_behavioural_chain(request.scenario_preset or "multi_stage_compromise")
    
    findings: List[Finding] = []
    evidence_items: List[EvidenceItem] = []
    triggered_rules: List[TriggeredRule] = []
    recommendations: List[str] = []
    limitations: List[str] = []

    if not events:
        return StandardEngineResponse(
            engine_id="M-13",
            engine_name="Behavioural Analysis",
            analysis_mode=AnalysisMode.SIMULATED,
            verdict=Verdict.INCONCLUSIVE,
            risk_score=0,
            summary="No multi-engine events supplied for behavioural correlation.",
            limitations=["Empty correlation event stream."]
        )

    # Sort events chronologically
    sorted_evts = sorted(events, key=lambda e: e.timestamp_epoch)
    total_span_sec = sorted_evts[-1].timestamp_epoch - sorted_evts[0].timestamp_epoch

    # Map stages
    stages_present = [e.stage_name for e in sorted_evts]
    engines_participating = list(set(e.source_engine for e in sorted_evts))

    for idx, e in enumerate(sorted_evts):
        offset = e.timestamp_epoch - sorted_evts[0].timestamp_epoch
        evidence_items.append(EvidenceItem(
            source=f"Correlator:{e.source_engine}",
            type="timeline_stage",
            description=f"[T+{offset:.0f}s] [{e.stage_name.upper()}] {e.title} (Entity: {e.entity})",
            raw_data=e.details
        ))

    # Correlation Heuristic: Complete End-to-End Cyber Kill Chain
    has_initial_access = "initial_access" in stages_present
    has_execution = "execution" in stages_present
    has_credential_access = "credential_access" in stages_present
    has_c2 = "c2" in stages_present

    risk_score = 15
    if has_initial_access and has_execution and has_credential_access and has_c2:
        risk_score = 94
        findings.append(Finding(
            id="F-M13-FULL-KILLCHAIN",
            title="Complete Multi-Stage Attack Kill Chain Correlated (Confidence: 89%)",
            severity=Severity.CRITICAL,
            description="Chronological correlation identifies coordinated attack progression spanning Initial Delivery (M-03) -> Link Execution (M-01) -> Credential Compromise (M-06) -> Process Injection (M-04) -> C2 Beaconing (M-05) within a 15-minute timeframe.",
            mitre_id="T1566 -> T1204 -> T1078 -> T1059 -> T1071",
            evidence=f"Correlated {len(sorted_evts)} events across {len(engines_participating)} engines in {total_span_sec:.0f}s"
        ))
        triggered_rules.append(TriggeredRule(
            rule_id="RULE-BEH-KILLCHAIN-CORRELATION",
            name="End-to-End Cyber Kill Chain Sequence",
            severity=Severity.CRITICAL,
            points=60,
            description="Temporal progression from delivery through payload execution and external egress.",
            mitre_id="TA0001 -> TA0002 -> TA0006 -> TA0011"
        ))
    elif len(engines_participating) >= 2 and total_span_sec < 1800:
        risk_score = 75
        findings.append(Finding(
            id="F-M13-CROSS-ENGINE-LINK",
            title="Cross-Engine Threat Association (Multi-Vector Link)",
            severity=Severity.HIGH,
            description=f"Correlated alerts across {', '.join(engines_participating)} targeting common entities within {total_span_sec/60:.1f} minutes.",
            evidence=f"Entities: {', '.join(set(e.entity for e in sorted_evts))}"
        ))
        triggered_rules.append(TriggeredRule(
            rule_id="RULE-BEH-CROSS-ENGINE-LINK",
            name="Multi-Vector Temporal Association",
            severity=Severity.HIGH,
            points=45,
            description="Signals across different defensive telemetry planes converge on related targets."
        ))

    # Entity Correlation (IP overlap between M-06 and M-05)
    ip_entities = [e.details.get("unusual_login_ip", "").split()[0] for e in sorted_evts if "unusual_login_ip" in e.details]
    c2_entities = [e.details.get("dst_ip", "") for e in sorted_evts if "dst_ip" in e.details]

    common_ips = set(ip_entities).intersection(set(c2_entities))
    if common_ips:
        risk_score = min(100, risk_score + 10)
        matched_ip = list(common_ips)[0]
        evidence_items.append(EvidenceItem(
            source="EntityGraphLinker",
            type="ip_convergence",
            description=f"Direct entity convergence: Foreign authentication origin IP ({matched_ip}) matches destination of subsequent C2 beaconing socket."
        ))

    # CRITICAL SCIENTIFIC/CYBER DISCLOSURE
    limitations.append(
        "Temporal association does not definitively prove causality. An attacker and coincident benign user activity occurring concurrently may appear temporally linked; validation requires memory/process forensic confirmation."
    )
    limitations.append(
        "Analysis based on synthetic multi-engine event sequence; timestamps are synchronized relative offsets."
    )

    verdict = Verdict.MALICIOUS if risk_score >= 70 else (Verdict.SUSPICIOUS if risk_score >= 35 else Verdict.SAFE)
    summary = f"BEHAVIOURAL INCIDENT RECONSTRUCTION: {len(sorted_evts)} events across {len(engines_participating)} engines indicate coordinated multi-stage cyber attack progression."

    recommendations = [
        "Sever all network sockets to destination IP identified in C2 stage",
        "Revoke session tokens and force password reset for user identity targeted in Stage 1 & 3",
        "Isolate workstation node flagged in Stage 4 from enterprise subnet",
        "Archive correlated timeline artifact for regulatory and breach reporting"
    ]

    return StandardEngineResponse(
        engine_id="M-13",
        engine_name="Behavioural Analysis",
        analysis_mode=AnalysisMode.SIMULATED,
        verdict=verdict,
        risk_score=risk_score,
        confidence=0.89,
        summary=summary,
        findings=findings,
        evidence=evidence_items,
        triggered_rules=triggered_rules,
        recommendations=recommendations,
        limitations=limitations,
        metadata={
            "total_events": len(sorted_evts),
            "stages_present": stages_present,
            "engines_participating": engines_participating,
            "total_time_span_seconds": total_span_sec,
            "preset_applied": request.scenario_preset or "custom"
        }
    )
