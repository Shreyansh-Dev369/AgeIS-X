# AgeIS-X — Content, DOM, Form Harvesting & JavaScript Engine Audit

**Pipeline Phase:** SSRF-Safe HTTP Acquisition ➔ Security Headers ➔ Static HTML/DOM ➔ JavaScript Static Signals ➔ Form Harvesting ➔ Impersonation Signals ➔ Evidence-Based Verdict  
**Verification:** **35/35 Pytest Passed | TypeScript 0 Errors | Next.js Build 27/27 Routes Prerendered**

---

## 1. Pipeline Execution Flow

```
[Target URL]
     │
     ▼
[URL / DNS / RDAP / TLS Intelligence]
     │
     ▼
[SSRF-Safe HTTP Acquisition (fetcher.py)]
     ├── Bounded 3.5s timeout, 512 KB payload ceiling
     ├── SSRFProtectedRedirectHandler (validates every redirect hop against private/prohibited CIDRs)
     │
     ▼
[HTTP Response + Security Headers (headers.py)]
     ├── Strict-Transport-Security (HSTS)
     ├── Content-Security-Policy (CSP)
     ├── X-Frame-Options (Clickjacking defense)
     ├── X-Content-Type-Options (nosniff)
     ├── Server disclosure audit
     │
     ▼
[HTML / DOM Static Analysis (html_parser.py)]
     ├── Page Title & Meta OpenGraph extraction
     ├── Brand Impersonation cross-check (Title vs. Target Domain Apex)
     ├── Hidden Iframes (0x0px, display:none, visibility:hidden)
     │
     ▼
[JavaScript Static Analysis (html_parser.py)]
     ├── Dynamic code execution: eval()
     ├── DOM injection: document.write()
     ├── Hex / String.fromCharCode / unescape obfuscation
     ├── Anti-inspection: right-click / contextmenu blockers
     │
     ▼
[Forms / Login / Payment Signals (html_parser.py)]
     ├── Credential harvesting detection (<input type="password">)
     ├── Payment & Card data inputs (CVV, CVC, credit card)
     ├── Off-domain form action submission traps
     ├── Insecure HTTP form submission on HTTPS origins
     │
     ▼
[Evidence-Based Risk Aggregation (main.py)]
     ├── Multi-signal risk matrix (ML + Lexical + RDAP + DNS + TLS + DOM + Headers + Forms)
     ├── Deterministic non-bypassable floors (Off-domain harvest: 90, Brand Impersonation: 85, SSRF: 99)
     │
     ▼
[Final Output & Telemetry Dossier (/predict)]
```

---

## 2. Test Suite Status & Quality Gates

* **Pytest Suite (`pytest tests/test_backend.py -v`):**
  * 35 / 35 tests passed in 27.88s (100% PASS).
  * Includes dedicated tests for:
    * `test_dom_brand_impersonation_detection`
    * `test_dom_off_domain_form_harvesting`
    * `test_dom_hidden_iframe_detection`
    * `test_js_obfuscation_and_anti_inspection`
    * `test_security_headers_analysis`
    * All 30 prior SSRF, DNS-rebinding, RDAP, TLS, and Lexical regression tests.
* **TypeScript Compiler (`tsc --noEmit`):**
  * 0 errors.
* **Next.js Production Build (`next build`):**
  * Compiled in 5.5s; all 27 static routes prerendered with zero errors.
* **Dependencies:**
  * 0 new external dependencies added.
