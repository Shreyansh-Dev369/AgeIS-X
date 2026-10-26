from typing import Dict, Any, List
from pydantic import BaseModel, Field
import time

from .common import StandardEngineResponse, AnalysisMode, Verdict, Severity, Finding, EvidenceItem
from .m02_content import analyze_web_content, ContentAnalysisRequest
from .m04_endpoint import analyze_endpoint_events, EndpointAnalysisRequest
from .m05_network import analyze_network_events, NetworkAnalysisRequest
from .m06_identity import analyze_identity_events, IdentityAnalysisRequest
from .m07_payment_scam import analyze_payment_scam, PaymentScamRequest
from .m08_file_malware import analyze_file_request, FileAnalysisRequest
from .m09_visual_threat import analyze_visual_threat, VisualAnalysisRequest
from .m10_threat_intel import analyze_threat_intelligence, ThreatIntelLookupRequest
from .m11_privacy import analyze_privacy_report, PrivacyAnalysisRequest
from .m12_ai_security import analyze_ai_security, AISecurityRequest
from .m13_behavioural import analyze_behavioural_correlation, BehaviouralAnalysisRequest
from .m14_unified_risk import analyze_unified_risk, UnifiedRiskRequest

class ScenarioMetadata(BaseModel):
    scenario_id: str
    code: str
    title: str
    category: str
    target_engines: List[str]
    description: str
    expected_verdict: str
    key_learning_objective: str

SCENARIO_CATALOG: Dict[str, ScenarioMetadata] = {
    "scenario_a": ScenarioMetadata(
        scenario_id="scenario_a",
        code="A",
        title="Suspicious Link & Phishing Investigation",
        category="Link & Domain Security",
        target_engines=["M-01", "M-02", "M-09"],
        description="Contrasts a verified authentic corporate destination with an adversarial typosquat / newly registered domain harvesting credentials.",
        expected_verdict="MALICIOUS (High Risk Phishing)",
        key_learning_objective="Demonstrates ML lexical inference, Cyrillic homoglyph detection, RDAP domain age scoring, and off-domain form action detection."
    ),
    "scenario_b": ScenarioMetadata(
        scenario_id="scenario_b",
        code="B",
        title="Endpoint Intrusion & C2 Beaconing Investigation",
        category="Host & Network Telemetry",
        target_engines=["M-04", "M-05", "M-10"],
        description="Analyzes synthetic telemetry showing an Office productivity app spawning an obfuscated PowerShell dropper, followed by periodic low-jitter C2 beaconing.",
        expected_verdict="MALICIOUS (Active Intrusion)",
        key_learning_objective="Demonstrates process tree telemetry correlation, registry run-key persistence detection, beacon interval jitter calculation, and threat feed IoC matching."
    ),
    "scenario_c": ScenarioMetadata(
        scenario_id="scenario_c",
        code="C",
        title="Account Takeover & Financial Invoice Fraud",
        category="Identity & Payment Defense",
        target_engines=["M-06", "M-07", "M-03"],
        description="Correlates a sudden impossible-travel login anomaly with an urgent vendor invoice diversion lure requesting an offshore wire transfer.",
        expected_verdict="MALICIOUS (BEC & Credential Theft)",
        key_learning_objective="Demonstrates geographic velocity calculation (haversine formula), MFA tampering alerts, psychological urgency NLP scoring, and bank account diversion heuristics."
    ),
    "scenario_d": ScenarioMetadata(
        scenario_id="scenario_d",
        code="D",
        title="Full Multi-Stage Enterprise Cyber Incident",
        category="Unified Incident Workspace",
        target_engines=["M-01", "M-02", "M-03", "M-04", "M-05", "M-06", "M-10", "M-13", "M-14"],
        description="Reconstructs an end-to-end cyber kill chain: Spearphishing email -> Link click -> Credential compromise -> Process execution -> Network egress -> Unified risk meta-decision.",
        expected_verdict="CRITICAL_THREAT (Composite Score: 94/100)",
        key_learning_objective="Demonstrates cross-engine timeline synchronization, signal deduplication, evidence provenance tracking, and transparent category-weighted risk aggregation."
    )
}

class ScenarioExecutionResult(BaseModel):
    scenario: ScenarioMetadata
    execution_time_ms: float
    engine_results: List[StandardEngineResponse]
    unified_assessment: StandardEngineResponse

def execute_scenario(scenario_id: str) -> ScenarioExecutionResult:
    start_t = time.time()
    sid = scenario_id.lower().strip()
    meta = SCENARIO_CATALOG.get(sid, SCENARIO_CATALOG["scenario_d"])

    engine_results: List[StandardEngineResponse] = []

    if sid == "scenario_a":
        # Scenario A: Link Investigation
        res_m02 = analyze_web_content(ContentAnalysisRequest(sample_scenario="default_phish"))
        res_m09 = analyze_visual_threat(VisualAnalysisRequest(scenario_preset="microsoft_login_clone"))
        res_m10 = analyze_threat_intelligence(ThreatIntelLookupRequest(query="login-update-corp.xyz"))
        engine_results = [res_m02, res_m09, res_m10]

    elif sid == "scenario_b":
        # Scenario B: Endpoint & Network
        res_m04 = analyze_endpoint_events(EndpointAnalysisRequest(scenario_preset="macro_powershell"))
        res_m05 = analyze_network_events(NetworkAnalysisRequest(scenario_preset="c2_beaconing"))
        res_m10 = analyze_threat_intelligence(ThreatIntelLookupRequest(query="185.220.101.5"))
        engine_results = [res_m04, res_m05, res_m10]

    elif sid == "scenario_c":
        # Scenario C: Account & Payment
        res_m06 = analyze_identity_events(IdentityAnalysisRequest(scenario_preset="impossible_travel"))
        res_m07 = analyze_payment_scam(PaymentScamRequest(scenario_preset="invoice_bank_switch"))
        res_m08 = analyze_file_request(FileAnalysisRequest(sample_preset="masqueraded_pe_executable"))
        engine_results = [res_m06, res_m07, res_m08]

    else:
        # Scenario D: Full Multi-Stage Incident
        res_m02 = analyze_web_content(ContentAnalysisRequest())
        res_m04 = analyze_endpoint_events(EndpointAnalysisRequest(scenario_preset="macro_powershell"))
        res_m05 = analyze_network_events(NetworkAnalysisRequest(scenario_preset="c2_beaconing"))
        res_m06 = analyze_identity_events(IdentityAnalysisRequest(scenario_preset="impossible_travel"))
        res_m07 = analyze_payment_scam(PaymentScamRequest(scenario_preset="invoice_bank_switch"))
        res_m08 = analyze_file_request(FileAnalysisRequest(sample_preset="masqueraded_pe_executable"))
        res_m10 = analyze_threat_intelligence(ThreatIntelLookupRequest(scenario_preset="c2_domain_apt"))
        res_m13 = analyze_behavioural_correlation(BehaviouralAnalysisRequest(scenario_preset="multi_stage_compromise"))
        engine_results = [res_m02, res_m04, res_m05, res_m06, res_m07, res_m08, res_m10, res_m13]

    # Run through Unified Risk Engine M-14
    unified = analyze_unified_risk(UnifiedRiskRequest(engine_results=engine_results))

    elapsed_ms = round((time.time() - start_t) * 1000, 2)
    return ScenarioExecutionResult(
        scenario=meta,
        execution_time_ms=elapsed_ms,
        engine_results=engine_results,
        unified_assessment=unified
    )
