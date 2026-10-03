import pytest
from fastapi.testclient import TestClient
import sys
import os
import concurrent.futures

# Add backend directory to sys.path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BASE_DIR)
sys.path.insert(0, os.path.join(PROJECT_ROOT, "backend"))

from main import app
from intelligence.safety import is_prohibited_ip, validate_host_safety, parse_to_ip_object
from intelligence.tls import verify_hostname_in_san

client = TestClient(app)

# ---------------------------------------------------------
# HEALTH & BASELINE TESTS
# ---------------------------------------------------------

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["features"]["rdap_intelligence"] is True
    assert data["features"]["ssrf_protection"] is True

def test_known_benign_domain_google():
    response = client.post("/predict", json={"url": "https://google.com"})
    assert response.status_code == 200
    data = response.json()
    assert data["verdict"] == "safe"
    assert data["risk_score"] <= 15
    assert data["features"]["has_homoglyphs"] is False
    assert data["rdap"]["status"] in ("available", "unavailable")
    assert data["dns"]["status"] == "available"
    assert len(data["dns"]["a"]) > 0

def test_known_benign_domain_github():
    response = client.post("/predict", json={"url": "https://github.com"})
    assert response.status_code == 200
    data = response.json()
    assert data["verdict"] == "safe"
    assert data["risk_score"] <= 15

# ---------------------------------------------------------
# ADVERSARIAL SSRF & PRIVATE IP TESTS
# ---------------------------------------------------------

def test_ssrf_blocking_localhost():
    response = client.post("/predict", json={"url": "http://localhost:8000/internal"})
    assert response.status_code == 200
    data = response.json()
    assert data["rdap"]["status"] == "blocked"
    assert data["dns"]["status"] == "blocked"
    assert data["tls"]["status"] == "blocked"
    assert data["risk_score"] == 99
    assert data["verdict"] == "malicious"

def test_ssrf_blocking_private_ipv4_127():
    response = client.post("/predict", json={"url": "http://127.0.0.1:3000"})
    assert response.status_code == 200
    data = response.json()
    assert data["dns"]["status"] == "blocked"
    assert data["risk_score"] == 99

def test_ssrf_blocking_private_ipv4_127_0_0_2():
    response = client.post("/predict", json={"url": "http://127.0.0.2:80"})
    assert response.status_code == 200
    data = response.json()
    assert data["dns"]["status"] == "blocked"
    assert data["risk_score"] == 99

def test_ssrf_blocking_private_ipv4_192():
    response = client.post("/predict", json={"url": "http://192.168.1.1/router"})
    assert response.status_code == 200
    data = response.json()
    assert data["dns"]["status"] == "blocked"
    assert data["risk_score"] == 99

def test_ssrf_blocking_private_ipv4_10():
    response = client.post("/predict", json={"url": "http://10.0.0.1:8080/admin"})
    assert response.status_code == 200
    data = response.json()
    assert data["dns"]["status"] == "blocked"
    assert data["risk_score"] == 99

def test_ssrf_blocking_private_ipv4_172():
    response = client.post("/predict", json={"url": "http://172.16.0.1/dashboard"})
    assert response.status_code == 200
    data = response.json()
    assert data["dns"]["status"] == "blocked"
    assert data["risk_score"] == 99

def test_ssrf_blocking_link_local_metadata():
    # AWS/GCP/Azure Cloud Metadata IP
    response = client.post("/predict", json={"url": "http://169.254.169.254/latest/meta-data/"})
    assert response.status_code == 200
    data = response.json()
    assert data["dns"]["status"] == "blocked"
    assert data["risk_score"] == 99

def test_ssrf_blocking_cgnat():
    response = client.post("/predict", json={"url": "http://100.64.0.1/cgnat"})
    assert response.status_code == 200
    data = response.json()
    assert data["dns"]["status"] == "blocked"
    assert data["risk_score"] == 99

def test_ssrf_blocking_private_ipv6_loopback():
    response = client.post("/predict", json={"url": "http://[::1]:8080"})
    assert response.status_code == 200
    data = response.json()
    assert data["dns"]["status"] == "blocked"
    assert data["risk_score"] == 99

def test_ssrf_blocking_private_ipv6_ula():
    response = client.post("/predict", json={"url": "http://[fc00::1]:80"})
    assert response.status_code == 200
    data = response.json()
    assert data["dns"]["status"] == "blocked"
    assert data["risk_score"] == 99

def test_ssrf_blocking_private_ipv6_fd_ula():
    response = client.post("/predict", json={"url": "http://[fd00::1]:80"})
    assert response.status_code == 200
    data = response.json()
    assert data["dns"]["status"] == "blocked"
    assert data["risk_score"] == 99

def test_ssrf_blocking_ipv4_mapped_ipv6():
    response = client.post("/predict", json={"url": "http://[::ffff:127.0.0.1]:8080"})
    assert response.status_code == 200
    data = response.json()
    assert data["dns"]["status"] == "blocked"
    assert data["risk_score"] == 99

def test_ssrf_blocking_decimal_integer_ip():
    # 2130706433 is decimal for 127.0.0.1
    response = client.post("/predict", json={"url": "http://2130706433:8080/admin"})
    assert response.status_code == 200
    data = response.json()
    assert data["dns"]["status"] == "blocked"
    assert data["risk_score"] == 99

def test_ssrf_blocking_hex_ip():
    # 0x7f000001 is hex for 127.0.0.1
    response = client.post("/predict", json={"url": "http://0x7f000001:8080/admin"})
    assert response.status_code == 200
    data = response.json()
    assert data["dns"]["status"] == "blocked"
    assert data["risk_score"] == 99

def test_ssrf_blocking_dotted_octal_ip():
    # 0177.0.0.1 is octal notation for 127.0.0.1
    response = client.post("/predict", json={"url": "http://0177.0.0.1/admin"})
    assert response.status_code == 200
    data = response.json()
    assert data["dns"]["status"] == "blocked"
    assert data["risk_score"] == 99

def test_ssrf_blocking_undotted_octal_ip():
    # 017700000001 is undotted octal notation for 127.0.0.1
    response = client.post("/predict", json={"url": "http://017700000001/admin"})
    assert response.status_code == 200
    data = response.json()
    assert data["dns"]["status"] == "blocked"
    assert data["risk_score"] == 99


def test_ssrf_blocking_trailing_dot_ip():
    response = client.post("/predict", json={"url": "http://127.0.0.1.:80/"})
    assert response.status_code == 200
    data = response.json()
    assert data["dns"]["status"] == "blocked"
    assert data["risk_score"] == 99

def test_ssrf_blocking_internal_domain_suffixes():
    for internal_url in ["http://database.local", "http://k8s.internal", "http://router.lan"]:
        response = client.post("/predict", json={"url": internal_url})
        assert response.status_code == 200
        data = response.json()
        assert data["dns"]["status"] == "blocked"
        assert data["risk_score"] == 99

# ---------------------------------------------------------
# LEXICAL, HOMOGLYPH & SYNTACTIC ATTACKS
# ---------------------------------------------------------

def test_homoglyph_detection():
    # Cyrillic 'а' (U+0430) embedded in paypal
    homoglyph_url = "https://payp\u0430l-verify.com"
    response = client.post("/predict", json={"url": homoglyph_url})
    assert response.status_code == 200
    data = response.json()
    assert data["verdict"] == "malicious"
    assert data["risk_score"] >= 75
    assert data["features"]["has_homoglyphs"] is True
    assert len(data["features"]["homoglyph_details"]) > 0

def test_typosquatting_missing_dot():
    response = client.post("/predict", json={"url": "https://wwwgoogle.com/search"})
    assert response.status_code == 200
    data = response.json()
    assert data["features"]["is_typosquat_pattern"] is True
    assert data["risk_score"] >= 70

def test_userinfo_credential_trick():
    response = client.post("/predict", json={"url": "https://google.com@attacker-site.com/auth"})
    assert response.status_code == 200
    data = response.json()
    assert data["features"]["has_userinfo"] is True
    assert data["risk_score"] >= 75

def test_ip_literal_host():
    response = client.post("/predict", json={"url": "http://185.220.101.9:8888/payload.elf"})
    assert response.status_code == 200
    data = response.json()
    assert data["features"]["is_ip_literal"] is True
    assert data["features"]["has_non_standard_port"] is True
    assert data["risk_score"] >= 70

def test_trailing_dot_public_domain():
    response = client.post("/predict", json={"url": "https://google.com."})
    assert response.status_code == 200
    data = response.json()
    assert data["verdict"] == "safe"
    assert data["risk_score"] <= 15

def test_invalid_short_url():
    response = client.post("/predict", json={"url": "a"})
    assert response.status_code == 400

def test_unverified_random_domain():
    response = client.post("/predict", json={"url": "flbkagus.com"})
    assert response.status_code == 200
    data = response.json()
    assert data["risk_score"] > 15

def test_nonexistent_domain():
    response = client.post("/predict", json={"url": "https://nonexistent-domain-ageisx-audit-test-2026.xyz"})
    assert response.status_code == 200
    data = response.json()
    assert data["dns"]["status"] in ("unavailable", "error")
    assert data["verdict"] in ("suspicious", "malicious")

# ---------------------------------------------------------
# RFC 6125 WILDCARD & SAN TESTS
# ---------------------------------------------------------

def test_rfc6125_wildcard_matching():
    # Valid wildcard match: sub.example.com against *.example.com
    assert verify_hostname_in_san("sub.example.com", ["*.example.com"], None) is True
    # Invalid: multiple labels sub.sub2.example.com against *.example.com
    assert verify_hostname_in_san("sub.sub2.example.com", ["*.example.com"], None) is False
    # Invalid: bare apex example.com against *.example.com
    assert verify_hostname_in_san("example.com", ["*.example.com"], None) is False
    # Invalid: malicious lookalike evil-example.com against *.example.com
    assert verify_hostname_in_san("evil-example.com", ["*.example.com"], None) is False
    # Invalid: wildcard on top level *.com
    assert verify_hostname_in_san("example.com", ["*.com"], None) is False

# ---------------------------------------------------------
# CONCURRENT SCANNER LOAD TEST
# ---------------------------------------------------------

def test_concurrent_scanner_requests():
    urls = [
        "https://google.com",
        "https://github.com",
        "http://127.0.0.1:8000",
        "https://payp\u0430l.com",
        "http://169.254.169.254"
    ]
    def send_req(u):
        return client.post("/predict", json={"url": u})

    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
        futures = [executor.submit(send_req, u) for u in urls]
        results = [f.result() for f in futures]

    assert len(results) == 5
    assert all(r.status_code == 200 for r in results)

# ---------------------------------------------------------
# HTML DOM, FORM HARVESTING & JS SIGNALS TESTS
# ---------------------------------------------------------

def test_dom_brand_impersonation_detection():
    from content.html_parser import analyze_html_dom
    fake_paypal_html = """
    <!DOCTYPE html>
    <html>
      <head>
        <title>PayPal - Secure Account Login</title>
      </head>
      <body>
        <h1>Please log in to continue</h1>
        <form action="/login" method="POST">
          <input type="text" name="username">
          <input type="password" name="password">
          <button type="submit">Log In</button>
        </form>
      </body>
    </html>
    """
    dom_intel, evidence = analyze_html_dom(fake_paypal_html, "https://secure-update-verify.xyz/auth")
    assert dom_intel.detected_brand_in_title == "paypal"
    assert dom_intel.brand_impersonation_suspected is True
    assert any(e.signal == "dom_brand_impersonation" for e in evidence)

def test_dom_off_domain_form_harvesting():
    from content.html_parser import analyze_html_dom
    harvesting_html = """
    <html>
      <body>
        <form action="http://malicious-collector.com/steal" method="POST">
          <input type="text" name="email">
          <input type="password" name="pass">
        </form>
      </body>
    </html>
    """
    dom_intel, evidence = analyze_html_dom(harvesting_html, "https://legit-looking-portal.net/login")
    assert dom_intel.has_off_domain_form_submission is True
    assert any(e.signal == "dom_off_domain_credential_harvest" for e in evidence)

def test_dom_hidden_iframe_detection():
    from content.html_parser import analyze_html_dom
    iframe_html = """
    <html>
      <body>
        <iframe src="https://silent-drop.com/payload" style="display:none" width="0" height="0"></iframe>
      </body>
    </html>
    """
    dom_intel, evidence = analyze_html_dom(iframe_html, "https://suspicious-site.com")
    assert dom_intel.has_hidden_iframes is True
    assert any(e.signal == "dom_hidden_iframe" for e in evidence)

def test_js_obfuscation_and_anti_inspection():
    from content.html_parser import analyze_javascript_signals
    obfuscated_js = [
        "eval(String.fromCharCode(97,108,101,114,116))",
        "document.oncontextmenu = function() { return false; };"
    ]
    signals, evidence = analyze_javascript_signals(obfuscated_js, "")
    assert signals.has_eval is True
    assert signals.has_obfuscated_code is True
    assert signals.has_context_menu_blocker is True

def test_security_headers_analysis():
    from content.headers import analyze_security_headers
    headers = {
        "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
        "Content-Security-Policy": "default-src 'self'",
        "X-Frame-Options": "DENY",
        "X-Content-Type-Options": "nosniff"
    }
    intel, evidence = analyze_security_headers(headers)
    assert intel.has_hsts is True
    assert intel.has_csp is True
    assert intel.has_x_frame_options is True
    assert intel.has_x_content_type_options is True
    assert len(intel.missing_headers) == 0

# ---------------------------------------------------------
# M-02 ADVERSARIAL HARDENING & EDGE CASE TESTS
# ---------------------------------------------------------

def test_redirect_handler_blocks_private_ip():
    from content.fetcher import SSRFProtectedRedirectHandler
    handler = SSRFProtectedRedirectHandler()
    # Attempt redirect to loopback
    result = handler.redirect_request(None, None, 302, "Found", {}, "http://127.0.0.1:8000/internal")
    assert result is None  # Blocked

def test_redirect_handler_blocks_metadata():
    from content.fetcher import SSRFProtectedRedirectHandler
    handler = SSRFProtectedRedirectHandler()
    result = handler.redirect_request(None, None, 302, "Found", {}, "http://169.254.169.254/latest/meta-data")
    assert result is None  # Blocked

def test_redirect_handler_blocks_prohibited_ports():
    from content.fetcher import SSRFProtectedRedirectHandler
    handler = SSRFProtectedRedirectHandler()
    # Attempt redirect to SSH port 22 or SMTP 25
    result_ssh = handler.redirect_request(None, None, 302, "Found", {}, "http://google.com:22/admin")
    result_smtp = handler.redirect_request(None, None, 302, "Found", {}, "http://google.com:25/mail")
    assert result_ssh is None
    assert result_smtp is None

def test_redirect_handler_blocks_unsupported_schemes():
    from content.fetcher import SSRFProtectedRedirectHandler
    handler = SSRFProtectedRedirectHandler()
    for bad_scheme in ["file:///etc/passwd", "gopher://127.0.0.1:70", "ftp://ftp.example.com", "javascript:alert(1)"]:
        assert handler.redirect_request(None, None, 302, "Found", {}, bad_scheme) is None

def test_same_apex_subdomain_is_not_off_domain():
    from content.html_parser import analyze_html_dom
    sso_html = """
    <html>
      <body>
        <form action="https://auth.chase.com/login" method="POST">
          <input type="password" name="pwd">
        </form>
      </body>
    </html>
    """
    dom_intel, evidence = analyze_html_dom(sso_html, "https://secure.chase.com/portal")
    # Same apex 'chase.com' -> should NOT be flagged as off-domain credential harvesting
    assert dom_intel.has_off_domain_form_submission is False
    assert not any(e.signal == "dom_off_domain_credential_harvest" for e in evidence)

def test_brand_mention_without_login_is_informational():
    from content.html_parser import analyze_html_dom
    blog_html = """
    <html>
      <head>
        <title>Amazon Q3 2026 Earnings and Stock Analysis - TechNews</title>
      </head>
      <body>
        <p>An in-depth review of Amazon cloud services.</p>
      </body>
    </html>
    """
    dom_intel, evidence = analyze_html_dom(blog_html, "https://technews-daily-updates.com/article/123")
    assert dom_intel.detected_brand_in_title == "amazon"
    assert dom_intel.brand_impersonation_suspected is False
    assert any(e.signal == "dom_brand_mention" for e in evidence)

def test_resource_extraction_is_strictly_bounded():
    from content.html_parser import analyze_html_dom, MAX_FORMS_TO_PARSE, MAX_IFRAMES_TO_PARSE
    # Generate an HTML string containing 500 forms and 500 iframes
    flooded_html = "<html><body>"
    for i in range(200):
        flooded_html += f'<form action="/f{i}"><input type="text" name="t{i}"></form>'
        flooded_html += f'<iframe src="/frame{i}"></iframe>'
    flooded_html += "</body></html>"

    dom_intel, _ = analyze_html_dom(flooded_html, "https://example.com")
    assert dom_intel.total_forms <= MAX_FORMS_TO_PARSE
    assert dom_intel.total_iframes <= MAX_IFRAMES_TO_PARSE

def test_malformed_html_survives_gracefully():
    from content.html_parser import analyze_html_dom
    malformed = "<<<form action='///broken' <input <<iframe unclosed >>><<<///"
    dom_intel, evidence = analyze_html_dom(malformed, "https://example.com")
    assert dom_intel is not None


# ---------------------------------------------------------
# M-03 EMAIL & MESSAGING THREAT INTELLIGENCE TESTS
# ---------------------------------------------------------

def test_health_check_email_features():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["features"]["email_intelligence"] is True
    assert data["features"]["messaging_intelligence"] is True

def test_benign_plain_text_email():
    raw_email = """From: newsletter@acme-corp.com
To: user@example.com
Date: Fri, 02 Oct 2026 10:00:00 +0000
Subject: Acme Corp Monthly Engineering Update
Message-ID: <12345.newsletter@acme-corp.com>
Authentication-Results: mx.example.com; spf=pass (client-ip=198.51.100.1); dkim=pass header.d=acme-corp.com; dmarc=pass
Content-Type: text/plain; charset="utf-8"

Hello team,
Here is our regular monthly update on engineering projects and milestones.
Best regards,
Acme Team
"""
    response = client.post("/analyze/email", json={"raw_email": raw_email})
    assert response.status_code == 200
    data = response.json()
    assert data["verdict"] == "safe"
    assert data["risk_score"] <= 20
    assert data["sender"]["domain"] == "acme-corp.com"
    assert data["auth"]["source"] == "supplied_header"
    assert data["auth"]["verification_status"] == "not_independently_verified"
    assert data["auth"]["spf_status"] == "pass"
    assert data["auth"]["dkim_status"] == "pass"
    assert data["auth"]["dmarc_status"] == "pass"
    assert data["social_engineering"]["has_urgency_language"] is False
    assert len(data["attachments"]) == 0

def test_email_display_name_spoofing_brand():
    raw_email = """From: "PayPal Security Support" <phisher@malicious-harvest.xyz>
To: target@victim.com
Date: Fri, 02 Oct 2026 12:00:00 +0000
Subject: URGENT: Your PayPal Account is Suspended
Message-ID: <scam999@malicious-harvest.xyz>
Authentication-Results: mx.victim.com; spf=fail; dmarc=fail (action=none)
Content-Type: text/plain; charset="utf-8"

Immediate action required! Your account has been suspended due to unauthorized login attempts.
Click here to confirm your password and verify your credentials immediately within 24 hours.
"""
    response = client.post("/analyze/email", json={"raw_email": raw_email})
    assert response.status_code == 200
    data = response.json()
    assert data["verdict"] == "malicious"
    assert data["risk_score"] >= 80
    assert data["sender"]["is_display_name_spoofing"] is True
    assert data["sender"]["impersonation_target"] == "Paypal"
    assert data["auth"]["has_auth_failure"] is True
    assert data["social_engineering"]["has_urgency_language"] is True
    assert data["social_engineering"]["has_credential_request"] is True
    assert data["social_engineering"]["has_account_suspension_threat"] is True

def test_email_display_name_spoofing_embedded_email():
    raw_email = """From: "security@microsoft.com" <untrusted-user@random-host.net>
To: target@victim.com
Date: Fri, 02 Oct 2026 12:00:00 +0000
Subject: Security Notification
Message-ID: <ms-sec-888@random-host.net>
Content-Type: text/plain

Please verify your credentials immediately.
"""
    response = client.post("/analyze/email", json={"raw_email": raw_email})
    assert response.status_code == 200
    data = response.json()
    assert data["sender"]["is_display_name_spoofing"] is True
    assert data["sender"]["impersonation_target"] == "security@microsoft.com"
    assert data["verdict"] == "malicious"

def test_email_reply_to_mismatch():
    raw_email = """From: alerts@chase.com
Reply-To: credential-collector@offshore-drop.com
To: user@victim.com
Date: Fri, 02 Oct 2026 14:00:00 +0000
Subject: Wire transfer verification
Message-ID: <chase-alert-101@chase.com>
Content-Type: text/plain

Please confirm your wire transfer request immediately.
"""
    response = client.post("/analyze/email", json={"raw_email": raw_email})
    assert response.status_code == 200
    data = response.json()
    assert data["sender"]["is_reply_to_mismatch"] is True
    assert data["sender"]["reply_to_domain"] == "offshore-drop.com"
    assert data["social_engineering"]["has_payment_or_wire_request"] is True

def test_email_dangerous_attachment_executable():
    raw_email = """From: HR <hr@company.com>
To: emp@company.com
Date: Fri, 02 Oct 2026 10:00:00 +0000
Subject: New Compensation Plan
Message-ID: <msg12345@company.com>
MIME-Version: 1.0
Content-Type: multipart/mixed; boundary="BOUNDARY123"

--BOUNDARY123
Content-Type: text/plain

Please see attached bonus breakdown.

--BOUNDARY123
Content-Type: application/octet-stream; name="BonusCalculator.exe"
Content-Disposition: attachment; filename="BonusCalculator.exe"
Content-Transfer-Encoding: base64

TVqQAAMAAAAEAAAA//8AALgAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
--BOUNDARY123--
"""
    response = client.post("/analyze/email", json={"raw_email": raw_email})
    assert response.status_code == 200
    data = response.json()
    assert data["verdict"] == "malicious"
    assert data["risk_score"] >= 90
    assert len(data["attachments"]) == 1
    assert data["attachments"][0]["filename"] == "BonusCalculator.exe"
    assert data["attachments"][0]["is_dangerous_extension"] is True
    assert data["attachments"][0]["risk_level"] == "high_risk"
    assert len(data["attachments"][0]["sha256"]) == 64

def test_email_double_extension_attachment():
    raw_email = """From: Billing <billing@suppliers.com>
To: accounts@victim.com
Date: Fri, 02 Oct 2026 11:00:00 +0000
Subject: Overdue Invoice
Message-ID: <inv77@suppliers.com>
MIME-Version: 1.0
Content-Type: multipart/mixed; boundary="BOUNDARY456"

--BOUNDARY456
Content-Type: text/plain

Attached is your overdue invoice.

--BOUNDARY456
Content-Type: application/octet-stream
Content-Disposition: attachment; filename="Invoice_Oct2026.pdf.exe"
Content-Transfer-Encoding: base64

VGVzdFBheWxvYWQ=
--BOUNDARY456--
"""
    response = client.post("/analyze/email", json={"raw_email": raw_email})
    assert response.status_code == 200
    data = response.json()
    assert data["verdict"] == "malicious"
    assert data["risk_score"] >= 90
    assert len(data["attachments"]) == 1
    assert data["attachments"][0]["is_double_extension"] is True
    assert data["attachments"][0]["is_dangerous_extension"] is True

def test_email_macro_attachment():
    raw_email = """From: Financial Planning <fp@corp.com>
To: analyst@corp.com
Date: Fri, 02 Oct 2026 11:00:00 +0000
Subject: FY27 Budget Model
Message-ID: <fp999@corp.com>
MIME-Version: 1.0
Content-Type: multipart/mixed; boundary="BOUNDARY789"

--BOUNDARY789
Content-Type: text/plain

Here is the budget sheet with macros.

--BOUNDARY789
Content-Type: application/vnd.ms-excel.sheet.macroEnabled.12
Content-Disposition: attachment; filename="Budget_Model_v3.xlsm"
Content-Transfer-Encoding: base64

TWFjcm9EYXRh
--BOUNDARY789--
"""
    response = client.post("/analyze/email", json={"raw_email": raw_email})
    assert response.status_code == 200
    data = response.json()
    assert len(data["attachments"]) == 1
    assert data["attachments"][0]["is_macro_enabled"] is True
    assert data["attachments"][0]["risk_level"] == "suspicious"

def test_email_anchor_text_mismatch():
    raw_email = """From: service@alerts.com
To: user@target.com
Date: Fri, 02 Oct 2026 15:00:00 +0000
Subject: Account Update
Message-ID: <alert01@alerts.com>
MIME-Version: 1.0
Content-Type: text/html; charset="utf-8"

<html>
<body>
<p>Please update your billing credentials by logging in below:</p>
<a href="http://192.168.1.100/harvest">https://paypal.com/signin</a>
</body>
</html>
"""
    response = client.post("/analyze/email", json={"raw_email": raw_email})
    assert response.status_code == 200
    data = response.json()
    assert data["verdict"] == "malicious"
    assert data["risk_score"] >= 85
    assert len(data["links"]) >= 1
    assert data["links"][0]["is_mismatched_anchor"] is True
    assert any("Deceptive Link / Mismatched Anchor" in ev for ev in data["evidence"])

def test_email_pii_and_secret_redaction():
    from email_intel.body import sanitize_and_redact
    sensitive_text = "Your password is SecretPassword123! and your OTP is 492819. Card: 4532 1122 3344 5566"
    sanitized = sanitize_and_redact(sensitive_text)
    assert "492819" not in sanitized
    assert "4532 1122 3344 5566" not in sanitized
    assert "[REDACTED_OTP]" in sanitized
    assert "[REDACTED_CARD_NUMBER]" in sanitized

def test_email_empty_and_oversized_handling():
    # Empty content -> 400 Bad Request
    resp_empty = client.post("/analyze/email", json={"raw_email": ""})
    assert resp_empty.status_code == 400

    # Oversized content -> parsed with truncation limitation
    oversized = "From: a@b.com\nSubject: Huge\n\n" + ("A" * (1024 * 1024 + 500))
    resp_over = client.post("/analyze/email", json={"raw_email": oversized})
    assert resp_over.status_code == 200
    assert any("truncated" in lim for lim in resp_over.json()["limitations"])

def test_message_analysis_smishing():
    smish_msg = "USPS Alert: Your package is on hold due to unpaid fees. Update immediately at http://192.168.1.50/pay or your package will be returned within 24 hours."
    response = client.post("/analyze/message", json={"message": smish_msg, "sender": "USPS-Alerts"})
    assert response.status_code == 200
    data = response.json()
    assert data["verdict"] == "malicious"
    assert data["risk_score"] >= 80
    assert data["social_engineering"]["has_urgency_language"] is True
    assert data["social_engineering"]["has_payment_or_wire_request"] is True
    assert len(data["links"]) == 1

def test_message_analysis_benign():
    benign_msg = "Hey Alice, let's grab coffee at 4:30pm today."
    response = client.post("/analyze/message", json={"message": benign_msg})
    assert response.status_code == 200
    data = response.json()
    assert data["verdict"] == "safe"
    assert data["risk_score"] <= 10

def test_email_url_flooding_bounded():
    # Email with 10,000 URLs
    url_flood = "\n".join([f"https://example.com/path/{i}" for i in range(5000)])
    raw_email = f"""From: sender@example.com
To: user@example.com
Date: Fri, 02 Oct 2026 10:00:00 +0000
Subject: URL Flood Test
Message-ID: <flood@example.com>
Content-Type: text/plain

{url_flood}
"""
    response = client.post("/analyze/email", json={"raw_email": raw_email})
    assert response.status_code == 200
    data = response.json()
    assert len(data["links"]) <= 50

def test_email_mime_part_flooding_bounded():
    # Build multipart with 100 parts
    parts = []
    for i in range(100):
        parts.append(f"--FLOOD\nContent-Type: text/plain\n\nPart {i}")
    multipart_body = "\n".join(parts) + "\n--FLOOD--"
    raw_email = f"""From: sender@example.com
To: user@example.com
Date: Fri, 02 Oct 2026 10:00:00 +0000
Subject: MIME Flood
Message-ID: <flood-mime@example.com>
MIME-Version: 1.0
Content-Type: multipart/mixed; boundary="FLOOD"

{multipart_body}
"""
    response = client.post("/analyze/email", json={"raw_email": raw_email})
    assert response.status_code == 200
    data = response.json()
    assert any("truncated at 50 parts" in lim for lim in data["limitations"])

def test_email_casual_brand_mention_in_body_not_spoofed():
    raw_email = """From: Alice Smith <alice@internal-analytics.org>
To: bob@internal-analytics.org
Date: Fri, 02 Oct 2026 10:00:00 +0000
Subject: Tech Stack Evaluation
Message-ID: <tech-eval-123@internal-analytics.org>
Authentication-Results: mx.internal-analytics.org; spf=pass; dkim=pass header.d=internal-analytics.org; dmarc=pass
Content-Type: text/plain

Hi Bob,
We are currently evaluating Microsoft Azure and Google Cloud for our new data pipeline.
Let's discuss on Monday.
Best,
Alice
"""
    response = client.post("/analyze/email", json={"raw_email": raw_email})
    assert response.status_code == 200
    data = response.json()
    assert data["sender"]["is_display_name_spoofing"] is False
    assert data["verdict"] == "safe"
    assert data["risk_score"] <= 20


