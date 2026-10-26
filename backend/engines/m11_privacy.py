from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
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

class ThirdPartyTracker(BaseModel):
    domain: str
    category: str  # advertising, analytics, fingerprinting, social_widget, data_broker
    is_canvas_fingerprinter: bool = False
    is_cross_site_tracking_cookie: bool = False
    data_leaked_in_url: bool = False

class WebsitePrivacyReport(BaseModel):
    target_site: str
    total_network_requests: int
    third_party_domains: List[str] = Field(default_factory=list)
    trackers: List[ThirdPartyTracker] = Field(default_factory=list)
    requested_browser_permissions: List[str] = Field(default_factory=list)
    has_zero_knowledge_guarantee: bool = False
    shares_data_with_brokers: bool = False

class PrivacyAnalysisRequest(BaseModel):
    report: Optional[WebsitePrivacyReport] = None
    scenario_preset: Optional[str] = "high_tracker_adtech"

def generate_preset_privacy_report(preset: str) -> WebsitePrivacyReport:
    if preset == "privacy_respecting_site":
        return WebsitePrivacyReport(
            target_site="https://ageis-x-docs.internal",
            total_network_requests=12,
            third_party_domains=["cdnjs.cloudflare.com"],
            trackers=[],
            requested_browser_permissions=[],
            has_zero_knowledge_guarantee=True,
            shares_data_with_brokers=False
        )
    elif preset == "data_broker_pixel_leak":
        return WebsitePrivacyReport(
            target_site="https://shop-megastore-deals.xyz/checkout",
            total_network_requests=84,
            third_party_domains=["ad-exchange.broker.net", "telemetry-sync.biz", "meta-pixel.facebook.com"],
            trackers=[
                ThirdPartyTracker(
                    domain="ad-exchange.broker.net",
                    category="data_broker",
                    is_canvas_fingerprinter=False,
                    is_cross_site_tracking_cookie=True,
                    data_leaked_in_url=True  # ?email_hash=... leaked in query string
                ),
                ThirdPartyTracker(
                    domain="telemetry-sync.biz",
                    category="advertising",
                    is_canvas_fingerprinter=False,
                    is_cross_site_tracking_cookie=True,
                    data_leaked_in_url=True
                )
            ],
            requested_browser_permissions=["geolocation", "notifications"],
            has_zero_knowledge_guarantee=False,
            shares_data_with_brokers=True
        )
    else:  # default: high_tracker_adtech
        return WebsitePrivacyReport(
            target_site="https://daily-global-news-feed.click",
            total_network_requests=142,
            third_party_domains=[
                "track-fingerprint.cdn-profiler.io",
                "criteo.net",
                "doubleclick.net",
                "outbrain.com",
                "taboola.com",
                "adroll.com"
            ],
            trackers=[
                ThirdPartyTracker(
                    domain="track-fingerprint.cdn-profiler.io",
                    category="fingerprinting",
                    is_canvas_fingerprinter=True,
                    is_cross_site_tracking_cookie=True
                ),
                ThirdPartyTracker(
                    domain="criteo.net",
                    category="advertising",
                    is_cross_site_tracking_cookie=True
                ),
                ThirdPartyTracker(
                    domain="doubleclick.net",
                    category="advertising",
                    is_cross_site_tracking_cookie=True
                )
            ],
            requested_browser_permissions=["geolocation", "notifications", "clipboard-read"],
            has_zero_knowledge_guarantee=False,
            shares_data_with_brokers=True
        )

def analyze_privacy_report(request: PrivacyAnalysisRequest) -> StandardEngineResponse:
    report = request.report or generate_preset_privacy_report(request.scenario_preset or "high_tracker_adtech")
    
    findings: List[Finding] = []
    evidence_items: List[EvidenceItem] = []
    triggered_rules: List[TriggeredRule] = []
    recommendations: List[str] = []
    risk_score = 5

    # 1. Canvas Fingerprinting Heuristic
    fingerprinters = [t for t in report.trackers if t.is_canvas_fingerprinter or t.category == "fingerprinting"]
    if fingerprinters:
        risk_score += 45
        findings.append(Finding(
            id="F-M11-CANVAS-FINGERPRINT",
            title="Active Browser Canvas / Audio Fingerprinting Detected",
            severity=Severity.HIGH,
            description=f"Site embeds scripts from {fingerprinters[0].domain} that compute unique hardware/GPU canvas hashes to track users across private browsing modes without cookies.",
            evidence=f"Domains: {', '.join(f.domain for f in fingerprinters)}"
        ))
        triggered_rules.append(TriggeredRule(
            rule_id="RULE-PRIV-CANVAS-FP",
            name="Persistent Canvas / WebGL Hardware Fingerprinting",
            severity=Severity.HIGH,
            points=45,
            description="Script bypasses standard cookie controls via GPU canvas rendering noise calculation."
        ))

    # 2. PII Data Leakage to Third-Party Brokers
    leakers = [t for t in report.trackers if t.data_leaked_in_url]
    if leakers or report.shares_data_with_brokers:
        risk_score += 40
        findings.append(Finding(
            id="F-M11-DATA-BROKER-LEAK",
            title="Third-Party Data Broker Exposure & URL Leakage",
            severity=Severity.HIGH,
            description="Page shares user identifiers or transmits checkout query parameters to external data broker domains.",
            evidence=f"Brokers: {', '.join(t.domain for t in leakers or report.trackers[:2])}"
        ))
        triggered_rules.append(TriggeredRule(
            rule_id="RULE-PRIV-DATA-BROKER",
            name="Unconsented Data Broker Transmission",
            severity=Severity.HIGH,
            points=40,
            description="Exfiltration of user telemetry or query strings to marketing aggregators."
        ))

    # 3. Excessive Browser Permissions Requested
    invasive_perms = [p for p in report.requested_browser_permissions if p in ["geolocation", "clipboard-read", "camera", "microphone"]]
    if invasive_perms:
        risk_score += 25
        evidence_items.append(EvidenceItem(
            source="PermissionAuditor",
            type="browser_permissions",
            description=f"Site requests intrusive permissions: {', '.join(invasive_perms)}.",
            raw_data={"permissions": report.requested_browser_permissions}
        ))
        triggered_rules.append(TriggeredRule(
            rule_id="RULE-PRIV-INVASIVE-PERMS",
            name="Invasive Hardware/Data Permissions Requested",
            severity=Severity.MEDIUM,
            points=25,
            description="Page requests non-essential device sensors or clipboard read access."
        ))

    # 4. Third-Party Tracker Density
    tracker_count = len(report.third_party_domains)
    evidence_items.append(EvidenceItem(
        source="TrackerAuditor",
        type="domain_density",
        description=f"Target: {report.target_site}. Contacted {tracker_count} third-party endpoints ({len(report.trackers)} categorized trackers) across {report.total_network_requests} total HTTP requests.",
        raw_data={"third_parties": report.third_party_domains}
    ))

    if tracker_count > 10:
        risk_score += 20
        triggered_rules.append(TriggeredRule(
            rule_id="RULE-PRIV-HIGH-TRACKER-DENSITY",
            name="High Third-Party Egress Density (>10 domains)",
            severity=Severity.MEDIUM,
            points=20,
            description="Page fans out network traffic to an extensive collection of third parties."
        ))

    risk_score = min(100, max(0, risk_score))
    if risk_score >= 65:
        verdict = Verdict.MALICIOUS
        summary = "HIGH PRIVACY INTRUSION RISK: Page employs persistent canvas fingerprinters, data broker relays, or invasive hardware permissions."
        recommendations = [
            "Enable Canvas & WebGL fingerprint noise injection in AgeIS-X Privacy Shield",
            "Block third-party cookie sync for listed tracker domains",
            "Reject clipboard and sensor permission requests"
        ]
    elif risk_score >= 25:
        verdict = Verdict.SUSPICIOUS
        summary = "MODERATE PRIVACY EXPOSURE: Commercial ad-tech trackers and cross-site cookies detected."
        recommendations = [
            "Enable tracking protection or content blocker",
            "Review site consent options"
        ]
    else:
        verdict = Verdict.SAFE
        summary = "PRIVACY-PRESERVING ARCHITECTURE: Minimal third-party egress, zero persistent fingerprinters, and no invasive permissions."
        recommendations = [
            "Site aligns with privacy-by-design standards"
        ]

    return StandardEngineResponse(
        engine_id="M-11",
        engine_name="Privacy Intelligence",
        analysis_mode=AnalysisMode.SIMULATED,
        verdict=verdict,
        risk_score=risk_score,
        confidence=0.92,
        summary=summary,
        findings=findings,
        evidence=evidence_items,
        triggered_rules=triggered_rules,
        recommendations=recommendations,
        limitations=[
            "Deterministic analysis of structured website network/permission telemetry. Evaluates provided site report; does not inspect private local user files or arbitrary browser history."
        ],
        metadata={
            "target_site": report.target_site,
            "total_requests": report.total_network_requests,
            "third_party_count": len(report.third_party_domains),
            "fingerprinter_detected": len(fingerprinters) > 0,
            "preset_applied": request.scenario_preset or "custom"
        }
    )
