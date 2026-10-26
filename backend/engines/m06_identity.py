from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
import time
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

class AuthEvent(BaseModel):
    event_id: str = Field(default_factory=lambda: f"AUTH-{uuid.uuid4().hex[:6].upper()}")
    timestamp_epoch: float
    user_principal: str
    event_type: str  # login_failed, login_success, mfa_prompt, mfa_disabled, password_reset, device_enrolled
    ip_address: str
    country: str
    city: str
    user_agent: str
    mfa_method: Optional[str] = None  # fido2, totp, sms, none
    device_id: Optional[str] = None

class IdentityAnalysisRequest(BaseModel):
    events: Optional[List[AuthEvent]] = None
    scenario_preset: Optional[str] = "impossible_travel"

def generate_preset_identity_events(preset: str) -> List[AuthEvent]:
    base_t = 1729862400.0
    if preset == "impossible_travel":
        return [
            AuthEvent(
                timestamp_epoch=base_t,
                user_principal="sarah.chen@enterprise.internal",
                event_type="login_success",
                ip_address="198.51.100.15",
                country="United States",
                city="New York",
                user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/129.0.0.0",
                mfa_method="fido2",
                device_id="DEV-MAC-NY-01"
            ),
            AuthEvent(
                timestamp_epoch=base_t + 1080.0,  # 18 minutes later
                user_principal="sarah.chen@enterprise.internal",
                event_type="login_success",
                ip_address="185.220.101.5",
                country="Bulgaria",
                city="Sofia",
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) Firefox/131.0",
                mfa_method="none",
                device_id="DEV-UNKNOWN-WIN-99"
            )
        ]
    elif preset == "brute_force_spray":
        events = []
        users = ["admin@enterprise.internal", "ceo@enterprise.internal", "billing@enterprise.internal", "devops@enterprise.internal"]
        for i in range(12):
            events.append(AuthEvent(
                timestamp_epoch=base_t + (i * 8.0),
                user_principal=users[i % len(users)],
                event_type="login_failed",
                ip_address="203.0.113.88",
                country="Russia",
                city="Moscow",
                user_agent="Python-requests/2.31.0",
                device_id=None
            ))
        return events
    elif preset == "mfa_downgrade":
        return [
            AuthEvent(
                timestamp_epoch=base_t,
                user_principal="admin.ops@enterprise.internal",
                event_type="login_success",
                ip_address="198.51.100.50",
                country="United States",
                city="Chicago",
                user_agent="Mozilla/5.0 Chrome/129.0",
                mfa_method="fido2"
            ),
            AuthEvent(
                timestamp_epoch=base_t + 120.0,
                user_principal="admin.ops@enterprise.internal",
                event_type="password_reset",
                ip_address="198.51.100.50",
                country="United States",
                city="Chicago",
                user_agent="Mozilla/5.0 Chrome/129.0"
            ),
            AuthEvent(
                timestamp_epoch=base_t + 240.0,
                user_principal="admin.ops@enterprise.internal",
                event_type="mfa_disabled",
                ip_address="198.51.100.50",
                country="United States",
                city="Chicago",
                user_agent="Mozilla/5.0 Chrome/129.0",
                mfa_method="fido2"
            ),
            AuthEvent(
                timestamp_epoch=base_t + 300.0,
                user_principal="admin.ops@enterprise.internal",
                event_type="device_enrolled",
                ip_address="203.0.113.140",
                country="United Kingdom",
                city="London",
                user_agent="Unknown Android Client 14",
                device_id="DEV-ROGUE-ANDR-01"
            )
        ]
    else:  # normal_mfa_login
        return [
            AuthEvent(
                timestamp_epoch=base_t,
                user_principal="alex.morgan@enterprise.internal",
                event_type="login_success",
                ip_address="198.51.100.12",
                country="United States",
                city="Seattle",
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/129.0",
                mfa_method="fido2",
                device_id="CORP-LT-SEATTLE-04"
            )
        ]

def analyze_identity_events(request: IdentityAnalysisRequest) -> StandardEngineResponse:
    events = request.events or generate_preset_identity_events(request.scenario_preset or "impossible_travel")
    
    findings: List[Finding] = []
    evidence_items: List[EvidenceItem] = []
    triggered_rules: List[TriggeredRule] = []
    recommendations: List[str] = []
    risk_score = 0

    if not events:
        return StandardEngineResponse(
            engine_id="M-06",
            engine_name="Identity Security Lab",
            analysis_mode=AnalysisMode.SIMULATED,
            verdict=Verdict.INCONCLUSIVE,
            risk_score=0,
            summary="No identity authentication events supplied for analysis.",
            limitations=["Empty authentication log sequence."]
        )

    # Sort chronologically
    sorted_events = sorted(events, key=lambda e: e.timestamp_epoch)

    # 1. Rule: Impossible Travel Speed Detection
    # Rough geographic coordinate estimations for demo
    geo_coords = {
        "New York": (40.7128, -74.0060),
        "Sofia": (42.6977, 23.3219),
        "Moscow": (55.7558, 37.6173),
        "Chicago": (41.8781, -87.6298),
        "London": (51.5074, -0.1278),
        "Seattle": (47.6062, -122.3321)
    }

    def haversine_km(c1, c2):
        lat1, lon1 = math.radians(c1[0]), math.radians(c1[1])
        lat2, lon2 = math.radians(c2[0]), math.radians(c2[1])
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        a = math.sin(dlat/2)**2 + math.cos(lat1)*math.cos(lat2)*math.sin(dlon/2)**2
        return 6371.0 * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    for i in range(1, len(sorted_events)):
        prev = sorted_events[i-1]
        curr = sorted_events[i]
        if prev.user_principal == curr.user_principal and prev.event_type == "login_success" and curr.event_type == "login_success":
            time_diff_hours = (curr.timestamp_epoch - prev.timestamp_epoch) / 3600.0
            p1 = geo_coords.get(prev.city)
            p2 = geo_coords.get(curr.city)
            if p1 and p2 and prev.city != curr.city and time_diff_hours > 0:
                dist_km = haversine_km(p1, p2)
                speed_kmh = dist_km / time_diff_hours
                evidence_items.append(EvidenceItem(
                    source="GeoVelocityTracker",
                    type="travel_speed_calculation",
                    description=f"User '{curr.user_principal}' logged in from {prev.city}, {prev.country} then {curr.city}, {curr.country} within {time_diff_hours*60:.1f} minutes. Calculated velocity: {speed_kmh:,.0f} km/h (Distance: {dist_km:,.0f} km).",
                    raw_data={"dist_km": dist_km, "time_diff_hours": time_diff_hours, "speed_kmh": speed_kmh}
                ))
                if speed_kmh > 1000.0:  # Faster than standard commercial airliner
                    risk_score += 65
                    findings.append(Finding(
                        id=f"F-M06-IMPOSSIBLE-TRAVEL-{curr.event_id}",
                        title="Impossible Travel Velocity Anomaly",
                        severity=Severity.CRITICAL,
                        description=f"Consecutive logins from {prev.city} and {curr.city} ({dist_km:,.0f} km apart) occurred within {time_diff_hours*60:.0f} mins, implying credential theft or unauthorized proxy relay.",
                        mitre_id="T1078.004",
                        evidence=f"Required flight speed: {speed_kmh:,.0f} km/h (Commercial limit: 900 km/h)"
                    ))
                    triggered_rules.append(TriggeredRule(
                        rule_id="RULE-ID-IMPOSSIBLE-TRAVEL",
                        name="Impossible Travel Anomaly (Excessive Velocity)",
                        severity=Severity.CRITICAL,
                        points=65,
                        description="Account authentication from two geographically distant locations within impossible flight time.",
                        mitre_id="T1078.004"
                    ))

    # 2. Rule: High-Frequency Failed Logins (Password Spray / Brute Force)
    failed_attempts = [e for e in sorted_events if e.event_type == "login_failed"]
    if len(failed_attempts) >= 5:
        # Check source IP concentration
        ip_counts = {}
        for f in failed_attempts:
            ip_counts[f.ip_address] = ip_counts.get(f.ip_address, 0) + 1
        top_ip, count = max(ip_counts.items(), key=lambda x: x[1])

        risk_score += 50
        findings.append(Finding(
            id="F-M06-BRUTE-FORCE",
            title=f"Authentication Brute-Force / Password Spray ({count} failures)",
            severity=Severity.HIGH,
            description=f"Source IP {top_ip} generated {count} failed authentication attempts across multiple corporate identities.",
            mitre_id="T1110.003",
            evidence=f"Source: {top_ip} targeting {len(set(e.user_principal for e in failed_attempts))} user accounts"
        ))
        triggered_rules.append(TriggeredRule(
            rule_id="RULE-ID-BRUTE-SPRAY",
            name="Password Spray / Distributed Brute Force",
            severity=Severity.HIGH,
            points=50,
            description="Repeated failed authentications against multiple user principals from common source.",
            mitre_id="T1110.003"
        ))

    # 3. Rule: MFA Security Downgrade or Tampering
    for evt in sorted_events:
        if evt.event_type == "mfa_disabled":
            risk_score += 55
            findings.append(Finding(
                id=f"F-M06-MFA-DOWNGRADE-{evt.event_id}",
                title="Critical Account Security Modification: MFA Disabled",
                severity=Severity.CRITICAL,
                description=f"Multi-Factor Authentication (method: {evt.mfa_method or 'FIDO2'}) disabled for principal '{evt.user_principal}'.",
                mitre_id="T1556",
                evidence=f"User: {evt.user_principal} | IP: {evt.ip_address}"
            ))
            triggered_rules.append(TriggeredRule(
                rule_id="RULE-ID-MFA-REMOVAL",
                name="Multi-Factor Authentication Revocation",
                severity=Severity.CRITICAL,
                points=55,
                description="Account MFA enrollment disabled or downgraded.",
                mitre_id="T1556"
            ))

    # 4. Rule: New Device Enrolled on High-Privilege Account
    for evt in sorted_events:
        if evt.event_type == "device_enrolled" and "admin" in evt.user_principal.lower():
            risk_score += 25
            findings.append(Finding(
                id=f"F-M06-DEVICE-ENROLL-{evt.event_id}",
                title="Unrecognized Device Enrolled on Administrative Account",
                severity=Severity.HIGH,
                description=f"New device '{evt.device_id}' registered from untrusted location ({evt.city}, {evt.country}).",
                mitre_id="T1098.005",
                evidence=f"Device: {evt.device_id} | Client: {evt.user_agent}"
            ))
            triggered_rules.append(TriggeredRule(
                rule_id="RULE-ID-NEW-DEVICE-ADMIN",
                name="New Device Registration on Privileged Account",
                severity=Severity.HIGH,
                points=25,
                description="New endpoint enrolled for identity with administrative attributes.",
                mitre_id="T1098.005"
            ))

    risk_score = min(100, max(0, risk_score))
    if risk_score >= 70:
        verdict = Verdict.MALICIOUS
        summary = "CRITICAL IDENTITY THREAT: Evidence of credential compromise, impossible travel velocity, or unauthorized MFA tampering."
        recommendations = [
            "Revoke all active OAuth/SAML session tokens for compromised identity",
            "Force immediate cryptographic password reset with mandatory WebAuthn passkey re-registration",
            "Place source IP address on temporary identity-provider deny-list",
            "Review administrative audit logs for unauthorized post-authentication actions"
        ]
    elif risk_score >= 35:
        verdict = Verdict.SUSPICIOUS
        summary = "SUSPICIOUS IDENTITY ACTIVITY: Password spray attempts or new device enrollments detected."
        recommendations = [
            "Prompt user for out-of-band identity verification",
            "Enforce conditional access policy requiring corporate-managed device"
        ]
    else:
        verdict = Verdict.SAFE
        summary = "Identity authentications verified. Expected geographic location, trusted device tokens, and healthy MFA."
        recommendations = [
            "Maintain FIDO2/WebAuthn passwordless enforcement"
        ]

    return StandardEngineResponse(
        engine_id="M-06",
        engine_name="Identity Security Lab",
        analysis_mode=AnalysisMode.SIMULATED,
        verdict=verdict,
        risk_score=risk_score,
        confidence=0.95,
        summary=summary,
        findings=findings,
        evidence=evidence_items,
        triggered_rules=triggered_rules,
        recommendations=recommendations,
        limitations=[
            "Deterministic analysis of synthetic authentication event logs. Realistic simulated identities used; no real passwords or sensitive credentials transmitted."
        ],
        metadata={
            "total_auth_events": len(events),
            "principals_evaluated": list(set(e.user_principal for e in events)),
            "preset_applied": request.scenario_preset or "custom"
        }
    )
