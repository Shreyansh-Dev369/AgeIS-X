import pytest
from fastapi.testclient import TestClient
import os
import sys

# Ensure backend directory is in sys.path
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend"))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from main import app

client = TestClient(app)

def test_health_check_engines_discovery():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["features"]["demo_lab_m01_m14"] is True
    engines = data["features"]["engines_available"]
    assert len(engines) == 14
    for i in range(1, 15):
        assert f"M-{i:02d}" in engines

def test_m02_web_content_simulated_phish():
    html_sample = """
    <html><head><title>Verify Corporate Account</title></head>
    <body>
    <form action="http://198.51.100.22/collect" method="POST">
        <input type="password" name="pwd" />
    </form>
    <iframe src="http://hidden.biz" style="display:none;"></iframe>
    </body></html>
    """
    response = client.post("/api/m02/content", json={"raw_html": html_sample})
    assert response.status_code == 200
    data = response.json()
    assert data["engine_id"] == "M-02"
    assert data["risk_score"] >= 60
    assert any("Off-Domain" in f["title"] for f in data["findings"])
    assert any("Iframe" in f["title"] for f in data["findings"])

def test_m04_endpoint_powershell_macro():
    response = client.post("/api/m04/endpoint", json={"scenario_preset": "macro_powershell"})
    assert response.status_code == 200
    data = response.json()
    assert data["engine_id"] == "M-04"
    assert data["analysis_mode"] == "simulated"
    assert data["risk_score"] >= 70
    assert data["verdict"] == "malicious"
    assert any("RULE-EDR-001" == r["rule_id"] for r in data["triggered_rules"])

def test_m04_endpoint_ransomware():
    response = client.post("/api/m04/endpoint", json={"scenario_preset": "ransomware_activity"})
    assert response.status_code == 200
    data = response.json()
    assert data["risk_score"] >= 80
    assert any("VSSADMIN" in f["id"] for f in data["findings"])

def test_m05_network_beaconing():
    response = client.post("/api/m05/network", json={"scenario_preset": "c2_beaconing"})
    assert response.status_code == 200
    data = response.json()
    assert data["engine_id"] == "M-05"
    assert data["analysis_mode"] == "simulated"
    assert data["risk_score"] >= 50
    assert any("Beaconing" in f["title"] for f in data["findings"])

def test_m05_network_dga():
    response = client.post("/api/m05/network", json={"scenario_preset": "dga_dns_tunneling"})
    assert response.status_code == 200
    data = response.json()
    assert data["risk_score"] >= 45
    assert any("DGA" in f["id"] for f in data["findings"])

def test_m06_identity_impossible_travel():
    response = client.post("/api/m06/identity", json={"scenario_preset": "impossible_travel"})
    assert response.status_code == 200
    data = response.json()
    assert data["engine_id"] == "M-06"
    assert data["risk_score"] >= 65
    assert data["verdict"] == "suspicious" or data["verdict"] == "malicious"
    assert any("IMPOSSIBLE-TRAVEL" in f["id"] for f in data["findings"])

def test_m06_identity_mfa_downgrade():
    response = client.post("/api/m06/identity", json={"scenario_preset": "mfa_downgrade"})
    assert response.status_code == 200
    data = response.json()
    assert any("MFA" in f["title"] for f in data["findings"])

def test_m07_payment_scam_invoice():
    response = client.post("/api/m07/scam", json={"scenario_preset": "invoice_bank_switch"})
    assert response.status_code == 200
    data = response.json()
    assert data["engine_id"] == "M-07"
    assert data["risk_score"] >= 60
    assert any("Bank Account Diversion" in f["title"] for f in data["findings"])

def test_m07_payment_scam_crypto():
    response = client.post("/api/m07/scam", json={"scenario_preset": "crypto_investment_scam"})
    assert response.status_code == 200
    data = response.json()
    assert data["risk_score"] >= 70
    assert any("Cryptocurrency" in f["title"] for f in data["findings"])

def test_m08_file_malware_magic_mismatch():
    response = client.post("/api/m08/file", json={"sample_preset": "masqueraded_pe_executable"})
    assert response.status_code == 200
    data = response.json()
    assert data["engine_id"] == "M-08"
    assert data["risk_score"] >= 65
    assert data["metadata"]["is_mismatch"] is True
    assert any("Masquerading" in f["title"] for f in data["findings"])

def test_m08_file_malware_eicar_hash():
    response = client.post("/api/m08/file", json={"sample_preset": "eicar_standard_test"})
    assert response.status_code == 200
    data = response.json()
    assert data["risk_score"] >= 80
    assert any("EICAR" in ev["description"] for ev in data["evidence"])

def test_m09_visual_threat_scareware():
    response = client.post("/api/m09/visual", json={"scenario_preset": "scareware_ransom_screen"})
    assert response.status_code == 200
    data = response.json()
    assert data["engine_id"] == "M-09"
    assert data["risk_score"] >= 50
    assert any("Scareware" in f["title"] for f in data["findings"])
    assert any("OCR text extraction is honestly disabled" in lim for lim in data["limitations"])

def test_m10_threat_intel_active_apt():
    response = client.post("/api/m10/threat-intel", json={"query": "c2-stealth-relay.biz"})
    assert response.status_code == 200
    data = response.json()
    assert data["engine_id"] == "M-10"
    assert data["verdict"] == "malicious"
    assert data["risk_score"] >= 90
    assert any("APT29" in ev["description"] for ev in data["evidence"])

def test_m10_threat_intel_unmatched_is_inconclusive():
    response = client.post("/api/m10/threat-intel", json={"query": "unknown-test-domain-not-in-db.com"})
    assert response.status_code == 200
    data = response.json()
    # Unmatched indicator must NOT be marked safe!
    assert data["verdict"] == "inconclusive"
    assert data["risk_score"] == 0
    assert "Unmatched status does NOT prove the indicator is safe" in data["summary"]

def test_m11_privacy_trackers():
    response = client.post("/api/m11/privacy", json={"scenario_preset": "high_tracker_adtech"})
    assert response.status_code == 200
    data = response.json()
    assert data["engine_id"] == "M-11"
    assert data["risk_score"] >= 60
    assert any("Fingerprinting" in f["title"] for f in data["findings"])

def test_m12_ai_security_prompt_injection():
    response = client.post("/api/m12/ai-security", json={"scenario_preset": "direct_prompt_injection"})
    assert response.status_code == 200
    data = response.json()
    assert data["engine_id"] == "M-12"
    assert data["risk_score"] >= 70
    assert data["verdict"] == "malicious"
    assert any("Prompt Injection" in f["title"] for f in data["findings"])
    assert any("NEVER executed" in lim for lim in data["limitations"])

def test_m13_behavioural_correlation():
    response = client.post("/api/m13/behavioural", json={"scenario_preset": "multi_stage_compromise"})
    assert response.status_code == 200
    data = response.json()
    assert data["engine_id"] == "M-13"
    assert data["risk_score"] >= 80
    assert any("Kill Chain" in f["title"] for f in data["findings"])
    assert any("Temporal association does not definitively prove causality" in lim for lim in data["limitations"])

def test_m14_unified_risk_aggregation():
    response = client.post("/api/m14/unified-risk", json={"scenario_preset": "multi_stage_incident"})
    assert response.status_code == 200
    data = response.json()
    assert data["engine_id"] == "M-14"
    assert data["risk_score"] >= 85
    assert data["metadata"]["risk_category"] in ["CRITICAL_THREAT", "HIGH_RISK"]
    assert len(data["metadata"]["participating_engines"]) >= 5
    assert data["metadata"]["raw_weighted_score"] > 0

def test_scenarios_listing_and_run():
    # 1. List scenarios
    list_res = client.get("/api/scenarios")
    assert list_res.status_code == 200
    scenarios = list_res.json()
    assert "scenario_a" in scenarios
    assert "scenario_b" in scenarios
    assert "scenario_c" in scenarios
    assert "scenario_d" in scenarios

    # 2. Run Scenario D
    run_res = client.post("/api/scenarios/run", json={"scenario_id": "scenario_d"})
    assert run_res.status_code == 200
    run_data = run_res.json()
    assert run_data["scenario"]["code"] == "D"
    assert len(run_data["engine_results"]) >= 7
    assert run_data["unified_assessment"]["risk_score"] >= 85
