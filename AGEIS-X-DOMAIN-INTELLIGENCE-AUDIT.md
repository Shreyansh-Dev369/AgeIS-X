# AgeIS-X Production Domain Intelligence Layer — Forensic Audit & Implementation Report

**Authoritative Intelligence Systems:** RDAP + DNS/DoH + TLS/X.509 Probing + Strict SSRF Protection  
**Status:** **OPERATIONAL & PRODUCTION-VERIFIED (16/16 Pytest Suite Passed, Next.js Build 27/27 Static Routes OK)**

---

## 1. Executive Summary

In accordance with the forensic audit and technical specifications, AgeIS-X has been upgraded from a single-point ML lexical classifier to a multi-tiered cybersecurity intelligence engine. 

The engine now gathers live, authoritative, un-faked signals across four distinct layers:
1. **Deterministic Lexical & Syntactic Structural Analyzer** (Unicode Homoglyphs, Punycode/IDNA, Typosquatting, Userinfo credential tricks, IP literals, entropy).
2. **Authoritative RDAP / WHOIS Domain Registration Intelligence** (IANA bootstrap resolution, exact domain age calculation in days/years, registrar identity, DNSSEC presence).
3. **Dual-Stack DNS & DNS-over-HTTPS (DoH) Intelligence** (A, AAAA, CNAME, MX, NS, TXT record probing with Cloudflare DoH fallback).
4. **Active TLS / X.509 Certificate Inspection** (Cryptographic handshake, subject/issuer extraction, SAN matching, expiration analysis, cipher version audit).
5. **Strict SSRF / Private IP Protection** (RFC 1918, CGNAT, Loopback, Link-Local, Multicast, ULA IPv6, and DNS-Rebinding mitigation across all socket operations).

---

## 2. Architectural Structure

```
AgeIS-X/
├── backend/
│   ├── intelligence/
│   │   ├── __init__.py         # Concurrent orchestrator (ThreadPoolExecutor, bounded timeouts)
│   │   ├── safety.py           # SSRF guard (RFC 1918, CGNAT, ULA, loopback, DNS rebinding)
│   │   ├── models.py           # Pydantic v2 schemas for RDAP, DNS, TLS, and Evidence
│   │   ├── rdap.py             # Authoritative IANA/bootstrap RDAP client
│   │   ├── dns.py              # Dual-stack socket resolver + DoH JSON client
│   │   └── tls.py              # X.509 certificate inspector & SAN hostname validator
│   ├── ml/
│   │   ├── train.py            # SGDClassifier trainer (log_loss, 732,882 dataset samples)
│   │   ├── model.pkl           # Serialized SGD model artifact
│   │   └── vectorizer.pkl      # Serialized HashingVectorizer artifact
│   ├── utils.py                # Deterministic Unicode/homoglyph/syntax analyzer
│   ├── config.py               # Paths and runtime configuration
│   └── main.py                 # FastAPI microservice with /predict & /health
├── lib/utils/
│   └── url-analyzer.ts         # TypeScript client-side structural mirror
├── components/
│   └── url-scanner.tsx         # High-fidelity terminal scanner UI (zero fabricated data)
└── tests/
    └── test_backend.py         # 16-case regression and security test suite
```

---

## 3. Layer Breakdown & Implementation Truth Matrix

| Layer | Provider / Implementation | Status | Degradation Behavior |
| :--- | :--- | :--- | :--- |
| **M-01 Lexical ML** | `SGDClassifier` (Log Loss) + `HashingVectorizer` ($N=732,882$) | **REAL / ACTIVE** | Returns probability score; structural analyzer takes precedence on critical indicators. |
| **Lexical / Homoglyph** | Cyrillic/Greek IDN mapping, Punycode decoder, userinfo, typosquatting | **REAL / ACTIVE** | Pure deterministic local parsing; zero network dependency. |
| **RDAP / Registration** | Authoritative IANA bootstrap + TLD-specific RDAP endpoints (`urllib.request`) | **REAL / ACTIVE** | Bounded 3.0s timeout; reports `unavailable` if unassigned/offline (never fabricated). |
| **DNS / DoH** | `socket.getaddrinfo` dual-stack + Cloudflare DoH JSON (`1.1.1.1`) | **REAL / ACTIVE** | Bounded 2.5s timeout; flags NXDOMAIN and records missing signals without crashing. |
| **TLS / X.509** | Native `ssl` + `socket` TLSv1.2/1.3 handshake & X.509 attribute flattener | **REAL / ACTIVE** | Bounded 3.0s timeout; marks `connected: false` on closed ports without throwing. |
| **SSRF / Rebinding** | `safety.py` CIDR & IP validation against RFC 1918 / Loopback / CGNAT / ULA | **REAL / ACTIVE** | Returns `status: "blocked"`, sets `risk_score: 99`, blocks socket connection immediately. |

---

## 4. SSRF & Anti-Rebinding Security Controls

The `safety.py` module evaluates all target hostnames and resolved IP addresses against prohibited network ranges before any network connection is attempted:

* **IPv4 Private / Reserved Ranges Blocked:** `0.0.0.0/8`, `10.0.0.0/8`, `100.64.0.0/10` (CGNAT), `127.0.0.0/8`, `169.254.0.0/16` (Link-Local), `172.16.0.0/12`, `192.168.0.0/16`, `224.0.0.0/4`, `240.0.0.0/4`, `255.255.255.255/32`.
* **IPv6 Private / Reserved Ranges Blocked:** `::/128`, `::1/128`, `fc00::/7` (ULA), `fe80::/10` (Link-Local), `ff00::/8` (Multicast), `::ffff:0:0/96` (IPv4-mapped).
* **Prohibited Hostnames / Suffixes:** `localhost`, `*.local`, `*.internal`, `*.lan`, `*.home`, `*.corp`.
* **DNS Rebinding Guard:** Resolves hostnames first via `resolve_and_verify_public_ips()`; if *any* returned IP address belongs to a prohibited subnet, the request is aborted and flagged as a security violation.

---

## 5. Test Suite Verification

Pytest execution results (`pytest tests/test_backend.py -v`):
```text
tests/test_backend.py::test_health_check PASSED                          [  6%]
tests/test_backend.py::test_known_benign_domain_google PASSED            [ 12%]
tests/test_backend.py::test_known_benign_domain_github PASSED            [ 18%]
tests/test_backend.py::test_homoglyph_detection PASSED                   [ 25%]
tests/test_backend.py::test_typosquatting_missing_dot PASSED             [ 31%]
tests/test_backend.py::test_userinfo_credential_trick PASSED             [ 37%]
tests/test_backend.py::test_ip_literal_host PASSED                       [ 43%]
tests/test_backend.py::test_invalid_short_url PASSED                     [ 50%]
tests/test_backend.py::test_unverified_random_domain PASSED              [ 56%]
tests/test_backend.py::test_ssrf_blocking_localhost PASSED               [ 62%]
tests/test_backend.py::test_ssrf_blocking_private_ipv4_127 PASSED        [ 68%]
tests/test_backend.py::test_ssrf_blocking_private_ipv4_192 PASSED        [ 75%]
tests/test_backend.py::test_ssrf_blocking_private_ipv4_10 PASSED         [ 81%]
tests/test_backend.py::test_ssrf_blocking_private_ipv6_loopback PASSED   [ 87%]
tests/test_backend.py::test_ssrf_blocking_private_ipv6_ula PASSED        [ 93%]
tests/test_backend.py::test_nonexistent_domain PASSED                    [100%]

======================= 16 passed in 16.44s =======================
```

Next.js Production Build verification (`pnpm run build`):
```text
✓ Compiled successfully in 6.9s
✓ Generating static pages using 7 workers (27/27) in 691ms
Finalizing page optimization ...
All 27 routes prerendered with zero errors.
```

---

## 6. Zero-Fabrication Guarantee

* If RDAP lookup fails or is unassigned $\rightarrow$ Displayed as `Unavailable (No authoritative RDAP record)` or `Not verified`, **never** a fabricated registration date or domain age.
* If TLS handshake cannot connect $\rightarrow$ Displayed as `TLS Probe Failed` or `Plain HTTP`, **never** an arbitrary "A+" grade.
* If DNS resolution is blocked due to internal routing $\rightarrow$ Displayed as `SSRF Blocked` with risk score `99%` and verdict `malicious`.
