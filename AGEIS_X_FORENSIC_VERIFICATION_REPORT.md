# AGEIS-X — MASTER FORENSIC AUDIT, BLOCKER RESOLUTION & RELEASE VERIFICATION REPORT

**Document ID:** AGEIS-AUDIT-RELEASE-AMENDED-2026-10-26  
**Auditor Role:** Principal Cybersecurity Architect, Full-Stack Engineer, ML Evaluation Lead, AppSec Lead  
**Repository:** `https://github.com/Shreyansh-Dev369/AgeIS-X`  
**Working Directory Root:** `D:\AgeIS-X-main\AgeIS-X-main`  
**Target Environments:**
- Local Environment: `D:\AgeIS-X-main\AgeIS-X-main` (Python 3.14.6, Node v24.18.0)
- Production Frontend: `https://ageis-x.vercel.app`
- Production Backend: `https://ageis-x-api.onrender.com`
**Active Branch:** `main`  
**Remote Head (origin/main):** `932d7d7c1837211c3f91938d655f5ba0ab4704e3` (Stale)  
**Local Commits:**
- `96bcb7ed5e78cbfc09cb16f749e09c091fc5f450` (*feat: modular engines, whitelist fix, 10MiB upload limit, tests*)
- `55808896ec29bdb9902017adff1e68dabb2b45f6` (*docs: master forensic audit and production readiness report*)  
**Verification Date:** 2026-10-26 17:35:00 IST  

---

## SECTION 1: EXECUTIVE VERDICT & FOUR-TIER CLASSIFICATION

| Tier | Status | Exact Evidence & Rationale |
| :--- | :--- | :--- |
| **LOCAL VERIFIED** | **PASS (GO)** | All 103 backend and engine tests pass (`103/103 passed`, pytest exit code `0`). All 5 critical threat regression cases pass (`5/5 passed`, exit code `0`). TypeScript typecheck (`npx tsc --noEmit`) passes with 0 errors (exit code `0`). Production build (`npm run build`) compiles 43 static routes with 0 errors (exit code `0`). Python AST security scan completed with 0 command execution flaws. |
| **GITHUB VERIFIED** | **BLOCKED (UNSYNCED)** | Local branch `main` is ahead of `origin/main` by 2 commits (`96bcb7e` and `5580889`). `git push origin main` failed with exit code `1` due to disabled terminal prompts in non-interactive environment (`fatal: could not read Username for 'https://github.com': terminal prompts disabled`). Commits exist locally ONLY. |
| **PUBLIC DEPLOYMENT VERIFIED** | **FAIL / STALE** | Live Render backend (`https://ageis-x-api.onrender.com`) is running unpatched commit `932d7d7`. Live diagnostic probes prove: `/health` returns 200, but `/api/scenarios` returns `HTTP 404`, and `dropper.exe` is falsely classified as `verdict: "safe"`, `risk_score: 2` due to the unpatched fail-open whitelist clamp. |
| **OVERALL RELEASE VERDICT** | **CONDITIONAL GO** | **APPROVED for local demonstrations and evaluation**. **BLOCKED for public production release** until the user executes an authenticated `git push origin main` to deploy the verified fixes to Render. |

---

## SECTION 2: GITHUB SYNCHRONIZATION AUDIT

### 1. Source Control Inspection Commands & Output
- **Branch:** `main` tracking `origin/main`
- `git rev-parse HEAD`: `55808896ec29bdb9902017adff1e68dabb2b45f6`
- `git rev-parse origin/main`: `932d7d7c1837211c3f91938d655f5ba0ab4704e3`
- `git log -3 --oneline`:
  ```
  5580889 docs: add master forensic audit and production readiness report
  96bcb7e feat(prod): modular intelligence engines, fail-open whitelist fix, 10MiB upload limit, and regression test suite
  932d7d7 feat(deploy): prepare FastAPI backend for Render and integrate with Vercel frontend
  ```
- `git status`:
  ```
  On branch main
  Your branch is ahead of 'origin/main' by 2 commits.
  nothing to commit, working tree clean
  ```

### 2. Push Attempt & Exact Failure Output
Command executed:
```powershell
$env:GIT_TERMINAL_PROMPT="0"; $env:GCM_INTERACTIVE="never"; git push origin main
```
- **Exit Code:** `1`
- **Output:**
  ```
  fatal: Cannot prompt because user interactivity has been disabled.
  fatal: could not read Username for 'https://github.com': terminal prompts disabled
  ```
- **Finding:** Git Credential Manager on Windows cannot launch interactive OAuth popups or prompt for a Personal Access Token (PAT) inside a non-interactive automated subshell. Per absolute safety rules, no destructive operations (`git push --force`) were attempted. User manual authentication is required.

---

## SECTION 3: RESOLUTION OF LOCAL REGRESSION TEST FAILURES

### 1. Root Cause of Previous Script Crash
During the previous run of `eval_regression_targets.py` (`task-950`), the script exited with code `1` due to:
```python
Traceback (most recent call last):
  File "eval_regression_targets.py", line 38, in <module>
    print(f"  Domain:   {feat.get('hostname')} | is_known_benign={feat.get('is_known_benign')}")
  File "C:\Python314\Lib\encodings\cp1252.py", line 19, in encode
    return codecs.charmap_encode(input,self.errors,encoding_table)[0]
UnicodeEncodeError: 'charmap' codec can't encode characters in position 13-14: character maps to <undefined>
```
**Diagnosis:**
- The backend `/predict` endpoint had **already executed successfully**, returning `HTTP 200`, `verdict: "malicious"`, `risk_score: 99`, `has_homoglyphs: True`.
- The failure was a **pure test-harness logging defect**: Python running on Windows with default console encoding `cp1252` crashed when attempting to write the raw Cyrillic characters `\u043e\u043e` to stdout.

### 2. Test Harness Fix Applied
In `scratch/eval_regression_targets.py`:
1. Configured stream encoding: `sys.stdout.reconfigure(encoding="utf-8", errors="backslashreplace")`.
2. Safe-printed all Unicode strings using ASCII backslash-replace representations.
3. Added strict programmatic assertions verifying required verdicts, risk score bounds, and feature flags.

### 3. Complete 5-Target Regression Audit Results (Local Repaired Backend)
- **Command:** `python scratch/eval_regression_targets.py`
- **Exit Code:** `0` (Zero exceptions, all assertions passed)
- **Runtime:** 15.34s

| Vector Category | Test URL | Expected | Actual Verdict | Risk Score | Confidence | Flags Verified | Result |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Benign Domain** | `https://google.com` | `safe` | `SAFE` | `7/100` | `0.8260` | `is_known_benign=True`, `exec=False`, `redirect=False` | **PASS** |
| **Legitimate Org** | `https://python.org` | `safe` | `SAFE` | `1/100` | `0.9580` | `is_known_benign=True`, `exec=False`, `redirect=False` | **PASS** |
| **Executable Path** | `https://github.com/.../dropper.exe` | `malicious` | `MALICIOUS` | `85/100` | `0.1950` | `has_executable_extension=True`, `is_known_benign=False`| **PASS** |
| **Open Redirect** | `https://google.com/url?q=http://...` | `malicious` | `MALICIOUS` | `72/100` | `0.6290` | `has_open_redirect=True`, `is_known_benign=False` | **PASS** |
| **Cyrillic Homoglyph**| `https://g\u043e\u043egle.com/login` | `malicious` | `MALICIOUS` | `99/100` | `0.9000` | `has_homoglyphs=True`, `is_known_benign=False` | **PASS** |

---

## SECTION 4: SECURITY-TOOL AUDIT & STATIC ANALYSIS RESULTS

| Tool | Executed Command | Exit Code | Classification | Detailed Findings & Remediation |
| :--- | :--- | :--- | :--- | :--- |
| **npm audit** | `npm audit --audit-level=moderate` | `1` | **Real Vulnerabilities Found** | **8 vulnerabilities detected (1 Critical, 6 High, 1 Moderate)**:<br>• Critical: `next` (9.3.4 - 16.4.0) SSRF, DoS, cache confusion (GHSA-6gpp-xcg3-4w24, etc.)<br>• High: `postcss` (<=8.5.22), `sharp` (<=0.35.5-rc.1), `source-map-js` (1.0.0-1.2.1), `zod` (<4.6.6), `browserslist` (<=4.28.6), `nanoid` (<=3.3.17)<br>• Moderate: `baseline-browser-mapping`<br>*Remediation:* `npm audit fix` for minor patches; `zod` upgrade to v4 requires schema compatibility check. |
| **pip-audit** | `python -m pip_audit --version` | `1` | **Tool Not Installed** | Output: `No module named pip_audit`. Tool binary is missing from Python 3.14 environment. (Not a clean scan). |
| **Bandit** | `python -m bandit --version` | `1` | **Tool Not Installed** | Output: `No module named bandit`. AST security scanner not installed. |
| **Semgrep** | `semgrep --version` | `1` | **Tool Not Installed** | Output: `The term 'semgrep' is not recognized`. Tool not installed on Windows host. |
| **Python AST Scanner**| Custom AST traversal on `backend/` | `0` | **Executed & Verified** | Analyzed all 18 backend Python modules (`backend/main.py`, `backend/engines/`, `backend/ml/`):<br>• **0 instances** of `eval()`, `exec()`, `os.system()`, `subprocess.popen()`, or `os.spawn()`.<br>• **8 instances** of `pickle.load()` restricted to offline model artifact loading (`model_v2.pkl`, `scaler_v2.pkl`, `tfidf_v2.pkl`). |

---

## SECTION 5: LIVE PRODUCTION DEPLOYMENT PROBES (RENDER & VERCEL)

Non-destructive HTTP requests were sent to the live production services:

| Endpoint | Method | Status Code | Latency | Response Shape / Data Received | Deployed Commit State |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `https://ageis-x-api.onrender.com/health` | GET | `HTTP 200` | ~240ms (warm) | `{"status": "ok", "service": "...", "ml_model_loaded": true}` | Stale (`932d7d7`) |
| `https://ageis-x-api.onrender.com/predict` (`dropper.exe`) | POST | `HTTP 200` | 2,305ms | `{"url": "...", "label": 1, "probability": 0.5974, "risk_score": 2, "verdict": "safe"}` | ❌ **FAIL-OPEN VULNERABILITY ACTIVE** (Old code) |
| `https://ageis-x-api.onrender.com/predict` (open redirect) | POST | `HTTP 200` | 1,895ms | `{"url": "...", "label": 0, "probability": 0.1853, "risk_score": 2, "verdict": "safe"}` | ❌ **FAIL-OPEN VULNERABILITY ACTIVE** (Old code) |
| `https://ageis-x-api.onrender.com/api/scenarios` | GET | `HTTP 404` | 287ms | `{"detail": "Not Found"}` | ❌ **ENGINES NOT DEPLOYED** |
| `https://ageis-x-api.onrender.com/api/scenarios/run` | POST | `HTTP 404` | 312ms | `{"detail": "Not Found"}` | ❌ **ENGINES NOT DEPLOYED** |
| `https://ageis-x.vercel.app` | GET | `HTTP 200` | 334ms | Complete Next.js HTML/JS frontend application | Active (`lib/config/api.ts` targets Render) |

### Frontend API URL Configuration Verification:
- Inspected `lib/config/api.ts`:
  - `PRODUCTION_API_URL = "https://ageis-x-api.onrender.com"`
  - `LOCAL_DEV_API_URL = "http://127.0.0.1:8000"`
  - `getApiBaseUrl()` detects `window.location.hostname`. When loaded on `ageis-x.vercel.app`, it routes 100% of API calls to Render.
  - Search across all `.ts` and `.tsx` files confirms **zero hardcoded localhost/127.0.0.1 API calls** in any interactive component.

---

## SECTION 6: AUTOMATED TEST SUITES & BENCHMARKS EVIDENCE

The following tests were executed and their complete results verified:

1. **Pytest Full Suite (Exit Code `0`):**
   - Command: `python -m pytest tests/test_backend.py tests/test_engines.py`
   - Output: `103 passed, 1 warning in 66.48s` (Starlette deprecation warning only).
   - Coverage: 83 backend regression tests + 20 modular engine tests (`test_engines.py`).
2. **74-Sample Curated Benchmark Suite (`CURATED_EVAL_SUITE`):**
   - Total Samples: 74 (40 benign, 34 malicious).
   - Execution Time: 189.41s. Zero timeouts.
   - Result: **Accuracy: 100.0%, Precision: 100.0%, Recall: 100.0%, F1: 100.0%**.
   - Confusion Matrix: `[[40 TN, 0 FP], [0 FN, 34 TP]]`.
3. **Held-Out Test Set (2,000 balanced samples from `locked_test_set.csv`):**
   - Result: **Accuracy: 95.75%, Precision: 95.28%, Recall: 95.97%, F1: 95.63%**.
   - Confusion Matrix: 961 TN, 45 FP, 40 FN, 954 TP.
4. **TypeScript Verification (Exit Code `0`):**
   - Command: `npx tsc --noEmit`
   - Result: 0 errors across entire Next.js codebase.
5. **Next.js Production Build (Exit Code `0`):**
   - Command: `npm run build`
   - Result: Successfully compiled all 43 static routes (`/`, `/demo-lab`, `/dashboard`, etc.).

---

## SECTION 7: STEP-BY-STEP USER RELEASE ACTIONS

To transition the public deployment from **CONDITIONAL GO** to **FULL GO**:

### Step 1: Push Local Commits to GitHub
Open an interactive PowerShell or Command Prompt terminal and run:
```bash
cd D:\AgeIS-X-main\AgeIS-X-main
git push origin main
```
*When prompted by Git Credential Manager, complete the GitHub sign-in or enter your Personal Access Token (PAT).*

### Step 2: Confirm Render Build
Once pushed, Render will detect commit `5580889` on branch `main` and trigger an automated build:
- Track deployment progress at: `https://dashboard.render.com`
- Render build command: `pip install -r requirements.txt`
- Render start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Step 3: Run Public Post-Deployment Smoke Test
Run these commands to confirm that Render is executing the new code:
```bash
# 1. Verify dropper.exe is no longer safe
curl -X POST https://ageis-x-api.onrender.com/predict -H "Content-Type: application/json" -d "{\"url\":\"https://github.com/org/repo/raw/main/dropper.exe\"}"
# Expected: "verdict": "malicious", "risk_score": 85

# 2. Verify modular engine scenarios endpoint is live
curl https://ageis-x-api.onrender.com/api/scenarios
# Expected: HTTP 200 OK with scenario catalog JSON
```
