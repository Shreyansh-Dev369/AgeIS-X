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

# Engine Category Weights for Meta-Decision
# Total weights sum to 1.0; reflect defense-in-depth prioritization
CATEGORY_WEIGHTS: Dict[str, float] = {
    "M-01": 0.15,  # URL & Domain Intelligence
    "M-02": 0.10,  # Web Content Intelligence
    "M-03": 0.10,  # Email & Messaging Intelligence
    "M-04": 0.15,  # Endpoint Security Lab
    "M-05": 0.15,  # Network Intelligence Lab
    "M-06": 0.10,  # Identity Security Lab
    "M-07": 0.05,  # Payment & Scam Intelligence
    "M-08": 0.10,  # File & Malware Analysis
    "M-09": 0.02,  # Visual Threat Intelligence
    "M-10": 0.05,  # Threat Intelligence
    "M-11": 0.01,  # Privacy Intelligence
    "M-12": 0.02   # AI Security Lab
}

class UnifiedRiskRequest(BaseModel):
    engine_results: Optional[List[StandardEngineResponse]] = None
    scenario_preset: Optional[str] = "multi_stage_incident"

def analyze_unified_risk(request: UnifiedRiskRequest) -> StandardEngineResponse:
    results = request.engine_results or []
    
    # If no results supplied, generate a synthetic set based on scenario preset
    if not results:
        # Import lazily to prevent circular dependencies
        from .m02_content import analyze_web_content, ContentAnalysisRequest
        from .m04_endpoint import analyze_endpoint_events, EndpointAnalysisRequest
        from .m05_network import analyze_network_events, NetworkAnalysisRequest
        from .m06_identity import analyze_identity_events, IdentityAnalysisRequest
        from .m07_payment_scam import analyze_payment_scam, PaymentScamRequest
        from .m08_file_malware import analyze_file_request, FileAnalysisRequest
        from .m10_threat_intel import analyze_threat_intelligence, ThreatIntelLookupRequest

        if request.scenario_preset == "benign_audit":
            res_m04 = analyze_endpoint_events(EndpointAnalysisRequest(scenario_preset="normal_baseline"))
            res_m05 = analyze_network_events(NetworkAnalysisRequest(scenario_preset="normal_baseline"))
            res_m06 = analyze_identity_events(IdentityAnalysisRequest(scenario_preset="normal_mfa_login"))
            results = [res_m04, res_m05, res_m06]
        else:  # default: multi_stage_incident
            res_m02 = analyze_web_content(ContentAnalysisRequest())
            res_m04 = analyze_endpoint_events(EndpointAnalysisRequest(scenario_preset="macro_powershell"))
            res_m05 = analyze_network_events(NetworkAnalysisRequest(scenario_preset="c2_beaconing"))
            res_m06 = analyze_identity_events(IdentityAnalysisRequest(scenario_preset="impossible_travel"))
            res_m07 = analyze_payment_scam(PaymentScamRequest(scenario_preset="invoice_bank_switch"))
            res_m08 = analyze_file_request(FileAnalysisRequest(sample_preset="masqueraded_pe_executable"))
            res_m10 = analyze_threat_intelligence(ThreatIntelLookupRequest(scenario_preset="c2_domain_apt"))
            results = [res_m02, res_m04, res_m05, res_m06, res_m07, res_m08, res_m10]

    all_findings: List[Finding] = []
    all_evidence: List[EvidenceItem] = []
    all_rules: List[TriggeredRule] = []
    aggregated_recommendations: List[str] = []

    engine_scores: Dict[str, int] = {}
    engine_weights_used: Dict[str, float] = {}
    is_any_live = False

    # 1. Collect and preserve evidence provenance
    for r in results:
        engine_scores[r.engine_id] = r.risk_score
        if r.analysis_mode == AnalysisMode.LIVE:
            is_any_live = True

        for f in r.findings:
            # Tag finding title with engine ID provenance
            prov_finding = Finding(
                id=f.id,
                title=f"[{r.engine_id}] {f.title}",
                severity=f.severity,
                description=f.description,
                mitre_id=f.mitre_id,
                evidence=f.evidence
            )
            all_findings.append(prov_finding)

        for ev in r.evidence:
            all_evidence.append(EvidenceItem(
                source=f"{r.engine_id}:{ev.source}",
                type=ev.type,
                description=ev.description,
                raw_data=ev.raw_data
            ))

        for rule in r.triggered_rules:
            all_rules.append(rule)

        for rec in r.recommendations:
            if rec not in aggregated_recommendations:
                aggregated_recommendations.append(rec)

    # 2. Deduplication of Findings (avoid double counting duplicate indicators)
    seen_mitre = set()
    deduplicated_findings: List[Finding] = []
    for f in all_findings:
        key = (f.mitre_id, f.title.split("] ", 1)[-1])
        if key not in seen_mitre or f.mitre_id is None:
            seen_mitre.add(key)
            deduplicated_findings.append(f)

    # 3. Transparent Weighted Risk Aggregation
    # Formula: Sum(engine_score * category_weight) / Sum(active_category_weights)
    total_weighted_points = 0.0
    total_weight_norm = 0.0

    for eng_id, score in engine_scores.items():
        w = CATEGORY_WEIGHTS.get(eng_id, 0.05)
        engine_weights_used[eng_id] = w
        total_weighted_points += score * w
        total_weight_norm += w

    if total_weight_norm > 0:
        base_aggregated_score = int(total_weighted_points / total_weight_norm)
    else:
        base_aggregated_score = 0

    # Max-severity override: If any individual engine identified confirmed CRITICAL threat (score >= 90),
    # the composite score must not be diluted below HIGH_RISK threshold (floor of 85)
    max_engine_score = max(engine_scores.values()) if engine_scores else 0
    if max_engine_score >= 90:
        final_risk_score = max(base_aggregated_score, 88)
    elif max_engine_score >= 70:
        final_risk_score = max(base_aggregated_score, 70)
    else:
        final_risk_score = min(100, max(0, base_aggregated_score))

    # Category determination
    if final_risk_score >= 90:
        verdict = Verdict.MALICIOUS
        risk_category = "CRITICAL_THREAT"
        summary = "CRITICAL MULTI-VECTOR THREAT CONFIRMED: High-confidence compromises detected across multiple independent security planes."
    elif final_risk_score >= 70:
        verdict = Verdict.MALICIOUS
        risk_category = "HIGH_RISK"
        summary = "HIGH ENTERPRISE RISK: Host, identity, or network anomalies exceed containment threshold."
    elif final_risk_score >= 30:
        verdict = Verdict.SUSPICIOUS
        summary = "ELEVATED POSTURE RISK: Suspicious signals detected across endpoints or communication channels."
        risk_category = "ELEVATED"
    else:
        verdict = Verdict.SAFE
        risk_category = "BENIGN"
        summary = "AGGREGATE SECURITY AUDIT NOMINAL: All participating security modules report standard baseline activity."

    # Top contributing engines
    top_contributors = sorted(engine_scores.items(), key=lambda x: x[1], reverse=True)[:4]

    return StandardEngineResponse(
        engine_id="M-14",
        engine_name="Unified Risk & Meta Decision",
        analysis_mode=AnalysisMode.LIVE if is_any_live else AnalysisMode.SIMULATED,
        verdict=verdict,
        risk_score=final_risk_score,
        confidence=0.94,
        summary=summary,
        findings=deduplicated_findings[:15],
        evidence=all_evidence[:20],
        triggered_rules=all_rules[:15],
        recommendations=aggregated_recommendations[:6],
        limitations=[
            "Deterministic Rule-Based Meta Aggregator v1.0. This is an explainable weighted integration engine with signal deduplication, NOT an uncalibrated neural meta-model."
        ],
        metadata={
            "risk_category": risk_category,
            "participating_engines": list(engine_scores.keys()),
            "engine_scores": engine_scores,
            "engine_weights": engine_weights_used,
            "raw_weighted_score": round(base_aggregated_score, 2),
            "max_contributing_engine_score": max_engine_score,
            "top_contributors": top_contributors,
            "total_raw_findings": len(all_findings),
            "total_deduplicated_findings": len(deduplicated_findings)
        }
    )
