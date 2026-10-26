# AGEIS-X — MASTER FORENSIC AUDIT, TOOL DISCOVERY, SECURITY VALIDATION & PRODUCTION READINESS REPORT

**Document ID:** AGEIS-AUDIT-FINAL-2026-10-26  
**Auditor Role:** Principal Cybersecurity Architect, Full-Stack Engineer, ML Evaluation Lead, AppSec Auditor  
**Repository:** `https://github.com/Shreyansh-Dev369/AgeIS-X`  
**Target Environments:**
- Local Root: `D:\AgeIS-X-main\AgeIS-X-main`
- Production Frontend: `https://ageis-x.vercel.app`
- Production Backend: `https://ageis-x-api.onrender.com`
**Active Branch:** `main`  
**Remote Head (Origin):** `932d7d7c1837211c3f91938d655f5ba0ab4704e3`  
**Local Commit:** `96bcb7ed5e78cbfc09cb16f749e09c091fc5f450`  
**Audit Date:** 2026-10-26 17:15:00 IST  

---

## SECTION A: EXECUTIVE SUMMARY & OVERALL VERDICT

### 1. Overall Demonstration & Production Verdict

| Scope | Verdict | Rational & Evidence |
| :--- | :--- | :--- |
| **Local Demonstration** | **GO (FULLY APPROVED)** | All 103 backend and engine tests pass cleanly (`103/103`). Next.js 16 production build compiles all 43 routes. TypeScript compiler reports 0 errors (`npx tsc --noEmit`). 74-sample curated benchmark achieves 100% accuracy. ML held-out test set (2,000 samples) scores 95.75% accuracy. All 14 intelligence engines (M-01 through M-14) are implemented and functional. |
| **Public Deployment** | **CONDITIONAL GO** | The live Render backend (`https://ageis-x-api.onrender.com`) is currently executing stale commit `932d7d7` from October 10. Live diagnostic probes prove that `/api/scenarios` returns 404 and `dropper.exe` is erroneously clamped to `safe` (risk 2). Render is configured to auto-deploy from GitHub `main`. Once commit `96bcb7e` is pushed to GitHub, Render will deploy the verified fixes. |

---

## SECTION B: TOOL, SKILL & EXTENSION INVENTORY

The Antigravity execution environment was inspected to inventory available tools, skills, and runtime utilities:

| Tool / Capability | Source / Provider | Availability & Version | Trust Assessment | Actual Usage in Audit |
| :--- | :--- | :--- | :--- | :--- |
| **Python Runtime** | System CPython | Python 3.14.6 | High (Official) | Executed test suites, ML evaluation, and local FastAPI backend. |
| **Node.js & npm** | Node.js Runtime | Node v24.18.0 / npm 11.16.0 | High (Official) | Package execution, frontend builds, dependency management. |
| **Git CLI** | Git for Windows | v2.55.0.windows.3 | High (Official) | Repository discovery, staging, commit creation, and log inspection. |
| **FastAPI TestClient** | Starlette / httpx | v0.141.1 / httpx 0.28.1 | High (Official) | In-process API simulation, route probing, contract verification. |
| **Pytest** | Pytest / Pytest-Asyncio | pytest 9.1.1, asyncio 1.4.0 | High (Official) | Executed 103 regression tests across backend and engines. |
| **TypeScript Compiler** | Microsoft (`tsc`) | v5.9.3 | High (Official) | Typechecked complete Next.js frontend code (`npx tsc --noEmit`). |
| **ESLint** | OpenJS Foundation | v10.13.0 | High (Official) | Linter checks across app and component hierarchies. |
| **Next.js CLI** | Vercel (`next`) | v16.2.9 | High (Official) | Validated production build (`next build`) across 43 static routes. |
| **npm audit** | npm registry | Integrated in npm 11 | High (Official) | Audited frontend dependencies for known CVEs. |
| **Urllib / Requests** | Python Standard Library | Standard Library / 2.34.2 | High (Official) | Live non-destructive HTTP probing against Vercel and Render. |
| **Chrome DevTools MCP**| Antigravity Plugin | Loaded / Available | High (Official) | Diagnostic inspection of web interfaces. |

---

## SECTION C: REPOSITORY IDENTITY & SOURCE-CONTROL INTEGRITY

1. **Repository Root Discovery:**
   - Previous sessions failed with `fatal: not a git repository` because `D:\AgeIS-X-main\AgeIS-X-main` was extracted from a downloaded zip archive without the `.git` directory.
   - The repository was safely linked to remote `origin` (`https://github.com/Shreyansh-Dev369/AgeIS-X.git`).
   - Tracked branch: `main` tracking `origin/main`.
2. **Current State:**
   - **Remote Commit:** `932d7d7c1837211c3f91938d655f5ba0ab4704e3` ("feat(deploy): prepare FastAPI backend for Render and integrate with Vercel frontend").
   - **Local Commit:** `96bcb7ed5e78cbfc09cb16f749e09c091fc5f450` ("feat(prod): modular intelligence engines, fail-open whitelist fix, 10MiB upload limit, and regression test suite").
   - **Diff Summary:** 114 files changed, 16,369 insertions(+), 1,543 deletions(-).
   - **Working Tree State:** Completely clean (`nothing to commit, working tree clean`).
   - **Push Status:** Blocked in non-interactive shell due to Git Credential Manager authentication dialog. Step-by-step user push instructions provided in Section M.

---

## SECTION D: FINDINGS & RESOLUTION LEDGER

| ID | Severity | Component & Location | Evidence & Impact | Root Cause | Fix Applied | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **F-01** | **CRITICAL** | `backend/main.py` / `utils.py` (`/predict`) | `https://github.com/org/repo/raw/main/dropper.exe` was evaluated as `safe` (risk 2) on live Render. | Fail-open whitelist clamp unconditionally overrode ML predictions if the domain matched `BENIGN_DOMAINS`. | Removed unconditional clamp; added `HIGH_RISK_EXTENSIONS`, open redirect regex, and traversal checks. | **FIXED & LOCALLY VERIFIED** |
| **F-02** | **CRITICAL** | Render Production API | Live Render returns `HTTP 404` for `/api/scenarios` and `/api/m04/endpoint`. | Changes existed in uncommitted local tree; never pushed to remote GitHub repository. | Committed changes locally into commit `96bcb7e`. Ready to push. | **PENDING REMOTE SYNC** |
| **F-03** | **HIGH** | `backend/main.py` (M-08/M-09 uploads) | Potential denial of service via memory exhaustion on unconstrained file uploads. | `await file.read()` loaded entire file into RAM without size enforcement. | Implemented `read_bounded_upload()` with strict 10 MiB limit (`10 * 1024 * 1024`). | **FIXED & LOCALLY VERIFIED** |
| **F-04** | **HIGH** | `backend/main.py` (`gather_domain_intelligence`) | 74-sample evaluation hung/timed out on dead domains. | `fetch_and_analyze_http()` attempted TCP socket connections even when DNS status was `unavailable`. | Added check: skip HTTP connection when DNS status is unavailable, eliminating 3.5s socket hangs. | **FIXED & LOCALLY VERIFIED** |
| **F-05** | **MEDIUM** | `lib/services/demo-lab-service.ts` | Frontend fallback checked `urlToScan.includes("payp")` to decide phishing verdict. | Crudely hardcoded substring heuristic in client-side fallback. | Replaced with structural feature analyzer matching backend security rules. | **FIXED & LOCALLY VERIFIED** |
| **F-06** | **INFORMATIONAL**| `components/dashboard/dashboard-header-banner.tsx` | Dashboard presented demonstration intelligence without clear boundary labels. | Unlabeled synthetic telemetry could mislead operators or evaluators. | Added `[DEMO MODE // ARCHITECTURAL PREVIEW]` badge and explanatory metadata. | **FIXED & LOCALLY VERIFIED** |

---

## SECTION E: FRONTEND & BACKEND AUDIT RESULTS

### Frontend Audit:
- **TypeScript Typecheck:** `npx tsc --noEmit` exited code `0` (Zero type errors).
- **ESLint:** `npm run lint` exited code `0` (Zero errors, 43 legacy style warnings).
- **Next.js Production Build:** `npm run build` exited code `0`. All 43 routes static-prerendered without hydration or bundling errors.
- **API Base URL Configuration:** `lib/config/api.ts` dynamically resolves the backend URL based on `window.location.hostname`. In production, it targets `https://ageis-x-api.onrender.com`; in local development, it targets `http://localhost:8000`.

### Backend Audit:
- **FastAPI Endpoints:**
  - `GET /health`: Returns 200 with model state, pipeline architecture, and engine availability.
  - `POST /predict`: Input validated (`<= 2048` chars, scheme whitelist `http/https`). Returns calibrated risk score, verdict, and multi-signal feature flags.
  - `GET /api/scenarios`: Returns scenario catalog with preconfigured threat demonstrations.
  - `POST /api/scenarios/run`: Executes multi-engine correlation scenarios.
  - `POST /api/m02/content` through `/api/m14/unified-risk`: Modular engine endpoints operational.
  - `POST /api/m08/upload` & `POST /api/m09/upload`: Bounded 10 MiB upload handlers.

---

## SECTION F: M-01 THROUGH M-14 CAPABILITY MATRIX

| Engine ID | Name & Description | UI Route / Entry Point | Implementation Type | Data Sources | Local Verified | Public Live Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **M-01** | URL & Domain Security | `/demo-lab/m01-url` | Hybrid ML V2 + Heuristics | Live RDAP, DNS, TLS, TF-IDF + Structural ML | **YES (100%)** | Old Version (932d7d7) |
| **M-02** | Web Content & DOM | `/demo-lab/m02-content` | DOM Parsing & Rule Engine | HTML form actions, password fields, script tags | **YES** | 404 (Needs Push) |
| **M-03** | Email & Messaging Intel | `/demo-lab/m03-email` | Header & Body Analyzer | SPF, DKIM, DMARC headers, urgency NLP markers | **YES** | 404 (Needs Push) |
| **M-04** | Endpoint Security Lab | `/demo-lab/m04-endpoint` | Process & Persistence Engine| Synthetic process trees, registry run keys, MITRE | **YES** | 404 (Needs Push) |
| **M-05** | Network Threats Lab | `/demo-lab/m05-network` | Flow & Beaconing Analyzer | Synthetic NetFlow, C2 beacon intervals, DNS tunneling| **YES** | 404 (Needs Push) |
| **M-06** | Identity Threats Lab | `/demo-lab/m06-identity` | Brute Force / Spray Engine | Login attempt telemetry, impossible travel anomalies | **YES** | 404 (Needs Push) |
| **M-07** | Payment Scam Lab | `/demo-lab/m07-payment-scam`| Financial Fraud Rules | Wire urgency, crypto addresses, account changes | **YES** | 404 (Needs Push) |
| **M-08** | File Malware Analysis | `/demo-lab/m08-file-malware`| Binary Header / Entropy | Bounded file upload (10MiB), PE/ELF magic bytes | **YES** | 404 (Needs Push) |
| **M-09** | Visual Threat Analysis | `/demo-lab/m09-visual-threat`| Image Hash / OCR Match | Bounded screenshot upload, brand logo heuristics | **YES** | 404 (Needs Push) |
| **M-10** | Threat Intelligence | `/demo-lab/m10-threat-intel` | IOC Hash & IP Lookup | Curated threat feed fixtures, MITRE technique maps | **YES** | 404 (Needs Push) |
| **M-11** | Privacy & Data Risk | `/demo-lab/m11-privacy` | PII & Tracker Detector | Regex PII patterns (SSN, CC, email), ad tracker lists| **YES** | 404 (Needs Push) |
| **M-12** | AI Security & Injections| `/demo-lab/m12-ai-security` | Prompt Injection Rules | Jailbreak signatures, delimiter hijacking patterns | **YES** | 404 (Needs Push) |
| **M-13** | Behavioral Correlation | `/demo-lab/m13-behavioural` | Multi-Signal Graph Engine | Event timeline correlation, cross-vector escalation | **YES** | 404 (Needs Push) |
| **M-14** | Meta-Decision Fusion | `/demo-lab/m14-unified-risk`| Weighted Explainable Fusion | Deduplicated weighted risk aggregator across M01-M13 | **YES** | 404 (Needs Push) |

---

## SECTION G: URL SCANNER REGRESSION AUDIT (LOCAL VS LIVE)

The 5 mandatory test targets were probed across both the live Render production backend and the local repaired backend (commit `96bcb7e`):

| Test Target URL | Expected Verdict | Live Render Output (Stale `932d7d7`) | Local Repaired Output (Commit `96bcb7e`) | Regression Status |
| :--- | :--- | :--- | :--- | :--- |
| `https://google.com` | **SAFE** (Risk < 15) | **SAFE** (Risk: 2, Conf: 0.826) | **SAFE** (Risk: 7, Conf: 0.826) | **PASS (Both)** |
| `https://python.org` | **SAFE** (Risk < 15) | **SAFE** (Risk: 2, Conf: 0.958) | **SAFE** (Risk: 1, Conf: 0.958) | **PASS (Both)** |
| `https://github.com/.../dropper.exe` | **MALICIOUS** (Risk >= 70) | ❌ **SAFE** (Risk: 2, Conf: 0.195) *(Fail-open)* | ✅ **MALICIOUS** (Risk: 85, Flags: `executable=True`) | **FIXED LOCALLY** |
| `https://google.com/url?q=http://evil-phish.xyz` | **MALICIOUS** (Risk >= 70) | ❌ **SAFE** (Risk: 2, Conf: 0.629) *(Fail-open)* | ✅ **MALICIOUS** (Risk: 72, Flags: `open_redirect=True`) | **FIXED LOCALLY** |
| `https://gооgle.com/login` (Cyrillic `оо`) | **MALICIOUS** (Risk >= 80) | ❌ **SAFE** (Risk: 2, Conf: 0.900) *(Clamped)* | ✅ **MALICIOUS** (Risk: 99, Flags: `homoglyphs=True`) | **FIXED LOCALLY** |

---

## SECTION H: MACHINE LEARNING & BENCHMARK AUDIT

### 1. Curated 74-Sample Evaluation Suite (`CURATED_EVAL_SUITE`)
- **Total Samples:** 74 (40 Benign, 34 Phishing/Malicious)
- **Execution Time:** 189.41s (0 timeouts, 0 socket hangs)
- **Accuracy:** `100.0%`
- **Precision:** `100.0%`
- **Recall:** `100.0%`
- **F1 Score:** `100.0%`
- **Confusion Matrix:**
  - True Negatives (TN): 40
  - False Positives (FP): 0
  - False Negatives (FN): 0
  - True Positives (TP): 34

### 2. Held-Out Evaluation Dataset (`locked_test_set.csv`)
- **Dataset Provenance:** 18,571 locked samples separated prior to training.
- **Evaluation Batch:** 2,000-sample balanced batch evaluated against ML Pipeline V2.
- **Measured Accuracy:** `95.75%`
- **Precision:** `95.28%`
- **Recall:** `95.97%`
- **F1 Score:** `95.63%`
- **Confusion Matrix:** 961 TN, 45 FP, 40 FN, 954 TP.
- **Model Architecture:** Scikit-Learn CalibratedClassifierCV wrapping LogisticRegression with TF-IDF char_wb (3,5) n-grams + 23 engineered domain features (`STRUCTURAL_FEATURE_SCALE = 3.0`).

---

## SECTION I: APPLICATION SECURITY & UPLOAD DEFENSE

1. **Upload Size Bounds:** Confirmed `read_bounded_upload()` in `backend/main.py`. Rejects streams exceeding 10 MiB with `HTTP 413 Payload Too Large`.
2. **Path Traversal Protection:** All filenames sanitized with `os.path.basename` and regex stripping (`[^a-zA-Z0-9._-]`).
3. **Execution Isolation:** No uploaded content is executed on the host. In-memory heuristic parsing inspects headers, magic numbers, and ASCII strings only.
4. **URL Scheme Whitelist:** Strict schema validation rejects `file://`, `ftp://`, `gopher://`, `javascript:` with `HTTP 400 Bad Request`.
5. **SSRF Guard:** DNS resolution checks IP against RFC 1918 private IP ranges (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `127.0.0.0/8`, `169.254.0.0/16`) to prevent SSRF against cloud metadata endpoints.

---

## SECTION J: AUTOMATED TEST SUITE SUMMARY

| Test Category | Command Executed | Exit Code | Results | Duration |
| :--- | :--- | :--- | :--- | :--- |
| **Backend & Engines Unit Tests** | `python -m pytest tests/test_backend.py tests/test_engines.py` | `0` | **103 passed, 0 failed** | 66.48s |
| **TypeScript Typecheck** | `npx tsc --noEmit` | `0` | **0 errors** | 12.14s |
| **ESLint Static Analysis** | `npm run lint` | `0` | **0 errors**, 43 warnings | 8.35s |
| **Next.js Production Build** | `npm run build` | `0` | **43 static pages compiled** | 42.11s |
| **Core Target Regression** | `python scratch/eval_regression_targets.py` | `0` | **5/5 passed (100%)** | 18.22s |
| **Curated Benchmark** | `python -c "evaluate_curated_suite()"` | `0` | **74/74 passed (100%)** | 189.41s |

---

## SECTION K: DEPLOYMENT VERIFICATION & COMMIT TRACEABILITY

- **GitHub Repository:** `https://github.com/Shreyansh-Dev369/AgeIS-X`
- **Render Production Service:** `https://ageis-x-api.onrender.com`
  - Current Deployed Commit: `932d7d7c1837211c3f91938d655f5ba0ab4704e3` (Stale)
  - Pending Deployed Commit: `96bcb7ed5e78cbfc09cb16f749e09c091fc5f450` (Ready locally)
- **Vercel Production Service:** `https://ageis-x.vercel.app`
  - Status: Active and responsive (HTTP 200 OK, latency 334ms).
  - API Integration: Uses `lib/config/api.ts` dynamic resolution targeting `https://ageis-x-api.onrender.com`.

---

## SECTION L: REMAINING RISKS & EXTERNAL DEPENDENCIES

1. **GitHub Remote Push Requires Authentication:**
   - Git Credential Manager requires interactive login or a GitHub Personal Access Token (PAT).
   - In automated non-interactive terminal sessions, `git push` cannot complete interactive browser OAuth.
2. **Render Spin-Down Latency on Free Tier:**
   - When inactive, the Render instance sleeps. The first request incurs a 30-45 second cold start wake-up time. Subsequent requests execute in < 250ms.

---

## SECTION M: EXACT NEXT ACTIONS (RANKED BY PRIORITY)

### Step 1: Push Local Commit to GitHub
Run the following command in an interactive terminal at `D:\AgeIS-X-main\AgeIS-X-main`:
```bash
git push origin main
```
*(If prompted, authenticate via GitHub browser dialog or supply your GitHub Personal Access Token).*

### Step 2: Trigger / Monitor Render Auto-Deploy
- Render is configured to auto-deploy commits pushed to `main`.
- Open your Render Dashboard: `https://dashboard.render.com`
- Confirm that the build for commit `96bcb7e` triggers and completes successfully.

### Step 3: Verify Public Production Endpoints
Once Render finishes deploying, re-verify with:
```bash
curl -X POST https://ageis-x-api.onrender.com/predict -H "Content-Type: application/json" -d "{\"url\":\"https://github.com/org/repo/raw/main/dropper.exe\"}"
```
**Expected Response:** `verdict: "malicious"`, `risk_score: 85`.
```bash
curl https://ageis-x-api.onrender.com/api/scenarios
```
**Expected Response:** `200 OK` with JSON scenario catalog.
