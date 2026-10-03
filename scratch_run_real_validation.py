import urllib.request
import urllib.parse
import json
import time
import socket
import ssl
import concurrent.futures
from typing import Dict, Any, List

BACKEND_URL = "http://127.0.0.1:8000"

def post_json(endpoint: str, data: dict) -> dict:
    url = f"{BACKEND_URL}{endpoint}"
    req = urllib.request.Request(
        url,
        data=json.dumps(data).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            return {
                "status_code": response.getcode(),
                "body": json.loads(response.read().decode("utf-8"))
            }
    except urllib.error.HTTPError as e:
        return {
            "status_code": e.code,
            "body": json.loads(e.read().decode("utf-8")) if e.fp else {}
        }
    except Exception as e:
        return {
            "status_code": 0,
            "error": str(e)
        }

def get_health() -> dict:
    req = urllib.request.Request(f"{BACKEND_URL}/health")
    with urllib.request.urlopen(req, timeout=5) as response:
        return json.loads(response.read().decode("utf-8"))

def main():
    print("================================================================")
    print("AGEIS-X REAL-WORLD VALIDATION SUITE EXECUTION")
    print("================================================================")
    
    results = {
        "health": {},
        "real_targets": [],
        "ssrf_tests": [],
        "structural_tests": [],
        "email_tests": [],
        "message_tests": [],
        "failsafe_tests": [],
        "concurrency": {}
    }

    # 1. Health
    print("[1/8] Validating Backend Health...")
    results["health"] = get_health()
    print(f"Health OK: {results['health'].get('status') == 'ok'}")

    # 2. Real Internet Targets
    print("\n[2/8] Testing Real Legitimate Internet Targets...")
    real_targets = [
        "https://google.com",
        "https://microsoft.com",
        "https://github.com",
        "https://cloudflare.com",
        "https://wikipedia.org"
    ]
    for target in real_targets:
        print(f"  Scanning: {target}...")
        res = post_json("/predict", {"url": target})
        results["real_targets"].append({
            "url": target,
            "status_code": res.get("status_code"),
            "data": res.get("body", {})
        })
        body = res.get("body", {})
        print(f"    Verdict: {body.get('verdict')} | Score: {body.get('risk_score')} | DNS: {body.get('dns', {}).get('status')} | RDAP: {body.get('rdap', {}).get('status')} | TLS: {body.get('tls', {}).get('status')} | HTTP: {body.get('http', {}).get('status')}")

    # 3. SSRF & Prohibited Targets
    print("\n[3/8] Testing SSRF & Prohibited IP Targets...")
    ssrf_targets = [
        "http://127.0.0.1",
        "http://localhost",
        "http://10.0.0.1",
        "http://172.16.0.1",
        "http://192.168.1.1",
        "http://169.254.169.254",
        "http://[::1]",
        "http://[::ffff:127.0.0.1]",
        "http://[::ffff:192.168.1.1]",
        "http://2130706433",      # Decimal representation of 127.0.0.1
        "http://0x7f000001",      # Hex representation of 127.0.0.1
        "http://017700000001"     # Octal representation of 127.0.0.1
    ]
    for target in ssrf_targets:
        print(f"  Testing SSRF Target: {target}...")
        res = post_json("/predict", {"url": target})
        body = res.get("body", {})
        results["ssrf_tests"].append({
            "target": target,
            "status_code": res.get("status_code"),
            "risk_score": body.get("risk_score"),
            "verdict": body.get("verdict"),
            "dns_status": body.get("dns", {}).get("status"),
            "rdap_status": body.get("rdap", {}).get("status"),
            "tls_status": body.get("tls", {}).get("status"),
            "http_status": body.get("http", {}).get("status"),
            "evidence": body.get("evidence", [])
        })
        print(f"    Verdict: {body.get('verdict')} | Score: {body.get('risk_score')} | DNS: {body.get('dns', {}).get('status')} | HTTP: {body.get('http', {}).get('status')}")

    # 4. Structural Adversarial & Brand Typosquatting
    print("\n[4/8] Testing Structural Adversarial & Typosquatting Targets...")
    structural_targets = [
        "https://wwwgoogle.com",
        "https://g00gle.com",
        "https://micros0ft.com",
        "https://paypa1.com",
        "https://example.com@evil.example",
        "https://example.com/%2F%2Fevil.example",
        "https://example.com/?redirect=https://evil.example",
        "https://p\u0430ypal.com", # Cyrillic 'а'
        "https://xn--e1afmkfd.xn--p1ai", # Punycode
        "http://192.168.1.50:8888/login"
    ]
    for target in structural_targets:
        print(f"  Testing Structural Target: {target.encode('ascii', 'backslashreplace').decode()}...")
        res = post_json("/predict", {"url": target})
        body = res.get("body", {})
        results["structural_tests"].append({
            "url": target,
            "risk_score": body.get("risk_score"),
            "verdict": body.get("verdict"),
            "features": body.get("features", {}),
            "evidence": body.get("evidence", [])
        })
        print(f"    Verdict: {body.get('verdict')} | Score: {body.get('risk_score')} | Homoglyphs: {body.get('features', {}).get('has_homoglyphs')} | Typosquat: {body.get('features', {}).get('is_typosquat_pattern')}")

    # 5. M-03 Email Threat Intelligence
    print("\n[5/8] Testing M-03 Email Payloads...")
    email_cases = [
        {
            "name": "Benign Newsletter",
            "payload": """From: newsletter@legit-news.com\nTo: user@company.com\nDate: Fri, 02 Oct 2026 10:00:00 +0000\nSubject: Weekly Digest\nMessage-ID: <1@news.com>\nAuthentication-Results: mx.company.com; spf=pass; dkim=pass; dmarc=pass\nContent-Type: text/plain\n\nHere is your weekly roundup of engineering news.\n"""
        },
        {
            "name": "Display-Name Brand Spoofing with Urgency & Credential Prompt",
            "payload": """From: "PayPal Security" <badguy@harvest-creds.cc>\nTo: target@victim.com\nDate: Fri, 02 Oct 2026 10:00:00 +0000\nSubject: URGENT: Account Suspended\nMessage-ID: <scam@bad.cc>\nAuthentication-Results: mx.victim.com; spf=fail; dmarc=fail\nContent-Type: text/plain\n\nImmediate action required! Your account is suspended. Click here to confirm your password and verify your credentials immediately.\n"""
        },
        {
            "name": "Anchor Text Mismatch Deception",
            "payload": """From: service@alerts.com\nTo: user@victim.com\nDate: Fri, 02 Oct 2026 10:00:00 +0000\nSubject: Billing Update\nMessage-ID: <a@b.com>\nContent-Type: text/html\n\n<html><body><a href="http://192.168.1.50/login">https://paypal.com/signin</a></body></html>\n"""
        },
        {
            "name": "Dangerous Double-Extension Executable Attachment",
            "payload": """From: invoice@suppliers.com\nTo: user@victim.com\nDate: Fri, 02 Oct 2026 10:00:00 +0000\nSubject: Overdue Invoice\nMessage-ID: <inv@supp.com>\nMIME-Version: 1.0\nContent-Type: multipart/mixed; boundary="B1"\n\n--B1\nContent-Type: text/plain\n\nSee invoice attached.\n--B1\nContent-Type: application/octet-stream\nContent-Disposition: attachment; filename="Invoice_Oct2026.pdf.exe"\nContent-Transfer-Encoding: base64\n\nTVqQAAMAAAAEAAAA//8AALg=\n--B1--\n"""
        }
    ]
    for case in email_cases:
        print(f"  Testing Email Case: {case['name']}...")
        res = post_json("/analyze/email", {"raw_email": case["payload"]})
        body = res.get("body", {})
        results["email_tests"].append({
            "name": case["name"],
            "risk_score": body.get("risk_score"),
            "verdict": body.get("verdict"),
            "sender": body.get("sender", {}),
            "auth": body.get("auth", {}),
            "attachments": body.get("attachments", []),
            "links": body.get("links", []),
            "evidence": body.get("evidence", [])
        })
        print(f"    Verdict: {body.get('verdict')} | Score: {body.get('risk_score')} | Spoofing: {body.get('sender', {}).get('is_display_name_spoofing')} | Atts: {len(body.get('attachments', []))}")

    # 6. M-03 Message / Smishing Tests
    print("\n[6/8] Testing M-03 Message / Smishing Payloads...")
    message_cases = [
        {
            "name": "Benign SMS",
            "sender": "Mom",
            "message": "Hey honey, see you at dinner at 7pm."
        },
        {
            "name": "USPS Smishing Scam with IP Link",
            "sender": "USPS-Alerts",
            "message": "USPS Alert: Your package is on hold due to unpaid fees. Update immediately at http://192.168.1.50/pay or your package will be returned within 24 hours."
        }
    ]
    for case in message_cases:
        print(f"  Testing Message Case: {case['name']}...")
        res = post_json("/analyze/message", {"message": case["message"], "sender": case["sender"]})
        body = res.get("body", {})
        results["message_tests"].append({
            "name": case["name"],
            "risk_score": body.get("risk_score"),
            "verdict": body.get("verdict"),
            "social_engineering": body.get("social_engineering", {}),
            "links": body.get("links", []),
            "evidence": body.get("evidence", [])
        })
        print(f"    Verdict: {body.get('verdict')} | Score: {body.get('risk_score')} | Urgency: {body.get('social_engineering', {}).get('has_urgency_language')}")

    # 7. Fail-Safe & Boundary Tests
    print("\n[7/8] Testing Fail-Safe & Error Handling...")
    failsafe_cases = [
        {"name": "Empty URL to /predict", "endpoint": "/predict", "data": {"url": ""}},
        {"name": "Empty Email to /analyze/email", "endpoint": "/analyze/email", "data": {"raw_email": ""}},
        {"name": "Empty Message to /analyze/message", "endpoint": "/analyze/message", "data": {"message": ""}},
        {"name": "Malformed JSON structure", "endpoint": "/predict", "data": {"unknown_field": 123}}
    ]
    for case in failsafe_cases:
        res = post_json(case["endpoint"], case["data"])
        results["failsafe_tests"].append({
            "name": case["name"],
            "status_code": res.get("status_code"),
            "body": res.get("body")
        })
        print(f"  Case: {case['name']} -> Status Code: {res.get('status_code')}")

    # 8. Concurrency / Latency Performance Testing
    print("\n[8/8] Testing Concurrency & Latency Performance (1, 5, 10, 25 requests)...")
    def run_single_req():
        t0 = time.time()
        res = post_json("/predict", {"url": "https://google.com"})
        t1 = time.time()
        return (t1 - t0) * 1000, res.get("status_code") == 200

    for c in [1, 5, 10, 25]:
        with concurrent.futures.ThreadPoolExecutor(max_workers=c) as executor:
            start_batch = time.time()
            futures = [executor.submit(run_single_req) for _ in range(c)]
            latencies = []
            successes = 0
            for f in concurrent.futures.as_completed(futures):
                lat, ok = f.result()
                latencies.append(lat)
                if ok:
                    successes += 1
            total_batch_time = (time.time() - start_batch) * 1000
            latencies.sort()
            p50 = latencies[len(latencies)//2]
            p95 = latencies[int(len(latencies)*0.95)]
            p99 = latencies[int(len(latencies)*0.99)] if len(latencies) >= 100 else latencies[-1]
            results["concurrency"][f"c_{c}"] = {
                "concurrency": c,
                "success_rate": f"{successes}/{c}",
                "p50_ms": round(p50, 2),
                "p95_ms": round(p95, 2),
                "p99_ms": round(p99, 2),
                "total_batch_ms": round(total_batch_time, 2)
            }
            print(f"  Concurrency {c:2d} -> Success: {successes}/{c} | P50: {p50:.1f}ms | P95: {p95:.1f}ms | Batch: {total_batch_time:.1f}ms")

    # Save full JSON results
    with open("validation_results.json", "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)
    print("\nValidation complete. Full results written to validation_results.json")

if __name__ == "__main__":
    main()
