# AgeIS-X M-02 Security Hardening Audit

## 1. Existing Implementation Audited

- `backend/content/fetcher.py` — Bounded HTTP client, redirect handler, userinfo sanitization, SSRF protection.
- `backend/content/headers.py` — Defensive HTTP security headers analyzer (HSTS, CSP, XFO, XCTO).
- `backend/content/html_parser.py` — Static HTML/DOM parser, form extraction, cross-origin apex logic, JS obfuscation heuristics, brand impersonation.
- `backend/content/models.py` — Pydantic models for HTTP response, security headers, DOM, and JavaScript intelligence.
- `backend/content/__init__.py` — Package export definitions.
- `backend/main.py` — Integrated FastAPI engine with risk aggregation matrices and non-bypassable floors.
- `tests/test_backend.py` — 43-case adversarial and security regression test suite.

---

## 2. Findings

### Finding 1: Redirect Hop DNS Rebinding Bypass
- **ID:** SEC-M02-001
- **Severity:** P0 (Critical)
- **Affected Component:** `backend/content/fetcher.py` (`SSRFProtectedRedirectHandler`)
- **Exact Issue:** Initial redirect validation only performed static hostname syntax checks (`validate_host_safety`) on redirect targets, omitting destination IP verification. An attacker-controlled redirecting domain could point to an IP resolving to `127.0.0.1` or `169.254.169.254`.
- **Exploit Scenario:** `http://public.com/redir` $\rightarrow$ `302 Found: http://rebind-to-internal.attacker.com/admin`.
- **Remediation:** Added `resolve_and_verify_public_ips(target_host, port=port, timeout=1.5)` inside `redirect_request()` to verify that every redirect hop resolves strictly to public routable IP addresses.
- **Test Added:** `test_redirect_handler_blocks_private_ip()`, `test_redirect_handler_blocks_metadata()`.

### Finding 2: Unchecked Non-Web System Ports on HTTP Probe
- **ID:** SEC-M02-002
- **Severity:** P1 (High)
- **Affected Component:** `backend/content/fetcher.py`
- **Exact Issue:** Scanner did not restrict destination ports on HTTP fetch, allowing attackers to trigger connections to internal service ports (e.g. SMTP 25, SSH 22, SMB 445).
- **Remediation:** Enforced `PROHIBITED_PORTS` set blocking non-web system/service ports from both initial acquisition and redirect hops.
- **Test Added:** `test_redirect_handler_blocks_prohibited_ports()`.

### Finding 3: Plaintext Credential (Userinfo) Exposure in Final URL & Evidence
- **ID:** SEC-M02-003
- **Severity:** P2 (Medium)
- **Affected Component:** `backend/content/fetcher.py`
- **Exact Issue:** URLs containing basic authentication credentials (e.g. `https://admin:secret123@host.com/`) preserved raw passwords in `final_url` and `redirect_chain`.
- **Remediation:** Created `sanitize_url_for_display()` masking plaintext passwords as `admin:***@host.com`.

### Finding 4: False-Positive Cross-Origin Flagging for Same-Apex Enterprise SSO
- **ID:** SEC-M02-004
- **Severity:** P2 (Medium)
- **Affected Component:** `backend/content/html_parser.py`
- **Exact Issue:** Form action comparisons previously compared raw hostname strings (`auth.example.com` != `example.com`), incorrectly classifying same-organization SSO authentication forms as malicious cross-origin credential harvesting.
- **Remediation:** Integrated `extract_apex_domain()` to compare registerable apex domains (`example.com` == `example.com`), accurately preserving cross-site detection while eliminating SSO false positives.
- **Test Added:** `test_same_apex_subdomain_is_not_off_domain()`.

### Finding 5: False-Positive Brand Impersonation on Benign Media/Reviews
- **ID:** SEC-M02-005
- **Severity:** P2 (Medium)
- **Affected Component:** `backend/content/html_parser.py`
- **Exact Issue:** Merely mentioning a brand name in a `<title>` (e.g. "Amazon Q3 Earnings Review") on a non-Amazon domain triggered a malicious brand impersonation flag.
- **Remediation:** Constrained brand impersonation heuristic to require authentication/login keywords (e.g. "login", "verify", "banking") OR an active login form on an untrusted host. Casual brand mentions are now cleanly categorized as informational `dom_brand_mention`.
- **Test Added:** `test_brand_mention_without_login_is_informational()`.

### Finding 6: Unbounded DOM Element Flooding
- **ID:** SEC-M02-006
- **Severity:** P2 (Medium)
- **Affected Component:** `backend/content/html_parser.py`
- **Exact Issue:** Attacker-controlled HTML with thousands of `<form>`, `<iframe>`, or `<script>` tags could create unbounded memory accumulation in the scanner.
- **Remediation:** Established strict parser extraction ceilings (`MAX_FORMS_TO_PARSE = 25`, `MAX_IFRAMES_TO_PARSE = 25`, `MAX_SCRIPTS_TO_PARSE = 50`, `MAX_TITLE_CHARS = 256`, `MAX_META_CHARS = 512`).
- **Test Added:** `test_resource_extraction_is_strictly_bounded()`.

---

## 3. SSRF Assessment

- **Initial Target Validation:** Enforced against RFC 1918, CGNAT, Loopback, Link-Local, ULA, documentation IPs, obfuscated integer/hex/octal forms, and internal domain suffixes.
- **Redirect Validation:** Enforced on every redirect hop with DNS resolution verification.
- **DNS Rebinding:** TLS probe connects directly to pre-verified public IP; HTTP client resolves and verifies all candidate IPs prior to request dispatch and redirect hops.
- **IPv4 / IPv6:** Full dual-stack support with bracket normalization and ULA / link-local filtering.
- **Unsafe Schemes:** Non-HTTP schemes (`file://`, `gopher://`, `ftp://`, `javascript:`, `data:`) are strictly blocked.

---

## 4. Resource Exhaustion Assessment

- **Network Body Limit:** Strict 512 KB (`MAX_RESPONSE_BYTES = 512 * 1024`), read in bounded 32 KB chunks with premature abort.
- **Decompressed Limit:** Bounded by 512 KB network buffer.
- **Parser Limit:** Parser processes at most 512 KB input string.
- **JavaScript Analysis Limit:** Inline scripts bounded to max 50 entries and 4 KB per script block.
- **Extraction Limit:** Max 25 forms, 25 iframes, 30 fields per form.
- **Timeout Semantics:** 3.5-second hard ceiling per HTTP acquisition operation.

---

## 5. HTML/DOM Assessment

- **Parser Engine:** Python standard library `html.parser.HTMLParser` (zero regex parsing of DOM tree structure).
- **Extracted Attributes:** Title, Meta OpenGraph, forms, input types, iframes, and script tags.
- **Resilience:** Survives malformed markup, unclosed tags, and character anomalies without throwing unhandled exceptions.

---

## 6. JavaScript Assessment

- **Execution Guarantee:** **JavaScript is NEVER executed** (100% static AST/lexical pattern inspection).
- **Pattern Signatures:** Dynamic evaluation (`eval()`, `new Function()`), DOM injection (`document.write()`), high-density hex/Unicode/CharCode obfuscation, and contextmenu / right-click blockers.

---

## 7. Form/Phishing Assessment

- **Sensitive Inputs:** Detects passwords, OTPs, CVV, credit cards, and SSNs via input types and autocomplete attributes.
- **Off-Domain Harvester:** Flags forms where the action URL destination apex differs from the host apex.
- **Insecure Submission:** Flags forms transmitting credentials over unencrypted HTTP from HTTPS pages.

---

## 8. Evidence Integrity

- **Structured Fields:** Every evidence item provides `signal`, `value`, `severity` (`info`, `medium`, `high`, `critical`), `source`, and factual description.
- **Redaction:** Passwords and credentials in URLs are masked before being recorded in evidence or returned to clients.
- **Zero Information Leakage:** No server stack traces, environment variables, or private file paths are exposed.

---

## 9. Risk Aggregation

- **SSRF / Prohibited Target Floor:** Fixed 99, verdict `malicious`.
- **Off-Domain Form Harvesting Floor:** Fixed 90, verdict `malicious`.
- **Brand Impersonation Floor:** Fixed 85, verdict `malicious`.
- **Homoglyphs / Typosquats / Userinfo Floor:** Fixed 85, verdict `malicious`.
- **IP Literal with Non-Standard Port:** Fixed 75, verdict `malicious`.
- **Defensive Mitigations:** Active HSTS and CSP provide modest risk reduction (-10).

---

## 10. Tests

- **Pytest Result:** **43 passed in 30.02s** (`100% PASS`).

---

## 11. TypeScript

- **TypeScript Compiler:** **0 errors** (`pnpm exec tsc --noEmit`).

---

## 12. Production Build

- **Next.js Production Build:** **27/27 static routes generated successfully** (`pnpm run build`).

---

## 13. Dependencies

- **Dependencies Added:** **0**
- **Dependencies Removed:** **0**
- **Dependencies Unchanged:** Standard Python library (`html.parser`, `urllib.request`, `socket`, `ssl`, `ipaddress`, `re`) and pre-existing repository modules.

---

## 14. Remaining Limitations

- Scanner performs static DOM and lexical JavaScript inspection; it does not emulate dynamic client-side single-page applications (SPAs) that require a headless browser runtime.

---

## 15. Deferred Work

- Future ML / vision engines (CNN layout classifier, visual screenshot analysis, browser sandbox execution) remain deferred in accordance with the project roadmap.
