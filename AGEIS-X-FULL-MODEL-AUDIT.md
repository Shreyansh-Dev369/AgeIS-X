# AGEIS-X — FULL AI/ML & SECURITY ENGINE FORENSIC AUDIT REPORT

```text
================================================================================
AUDIT & REMEDIATION METADATA
================================================================================
Target Repository    : AgeIS-X (AgeIS-X-main)
Target Root Path     : c:\Users\LENOVO\Downloads\AgeIS-X-main\AgeIS-X-main
Audit Date           : 2026-10-02
Audit Scope          : Forensic Model Audit, Data Provenance, Failure Modes & Safe Remediation
TypeScript Validation: PASS (pnpm exec tsc --noEmit)
Next.js Production   : PASS (pnpm run build - 27/27 static routes generated)
Backend Test Suite   : PASS (python -m pytest tests/test_backend.py - 8/8 passed)
================================================================================
```

---

## 1. EXECUTIVE SUMMARY

An end-to-end technical audit of the **AgeIS-X** cybersecurity intelligence repository was performed to distinguish between actual executable code, partial implementations, mock data, and unsupported claims.

### Key Audit Findings:
1. **Machine Learning Classifier (M-01):** The repository contained a functioning offline training pipeline (`backend/ml/train.py`) and a binary linear classifier (`SGDClassifier` with log loss, $N=732,882$) combined with a `HashingVectorizer` ($2^{20}$ buckets, char n-grams 2–5). This model was verified on a hold-out test split of 146,577 samples with **88.51% Test Accuracy** and **0.9556 ROC-AUC**.
2. **Missing Intelligence Services (M-02, WHOIS, DNS, TLS):** Zero executable code was found in the repository for WHOIS/RDAP queries, active TLS certificate inspection, or live DNS resolution.
3. **P0 Failure Mode (Silent Fail-Open):** When the backend was offline, the frontend previously evaluated 8 arbitrary substrings; if none matched, it returned `VERIFIED SAFE` with a fabricated SSL grade of `"A+"` and domain age of `"12.1 years"`.
4. **Remediation Completed:** 
   - Eliminating the fail-open fallback: offline or unverified domains are now properly marked as `UNKNOWN / UNVERIFIED` with explicit error boundaries.
   - Built a comprehensive deterministic URL structural, syntactic, and Unicode homoglyph analyzer in both Python (`backend/utils.py`) and TypeScript (`lib/utils/url-analyzer.ts`).
   - Integrated deterministic signals (homoglyph lookalikes, typosquatting patterns, userinfo overrides, IP literals, and high-entropy strings) with the ML model probability.
   - Accurately labeled mock and simulation UI components across the frontend.

---

## 2. COMPLETE MODEL / ENGINE REGISTER

| Model / Engine ID | Name | Domain | Claimed Status | Actual Status | Source File | Framework & Algorithm |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **M-01** | Lexical & Syntactic Model | URL & Domain Analysis | PRODUCTION INGESTION ACTIVE | **REAL / EXECUTABLE** | `backend/main.py`, `backend/ml/train.py`, `backend/utils.py` | Scikit-Learn `SGDClassifier` (log loss) + `HashingVectorizer` ($2^{20}$ features) + Unicode Homoglyph Analyzer |
| **M-01-FE** | Client Structural Analyzer | Frontend Link Scanner | ACTIVE FALLBACK | **REAL / EXECUTABLE** | `lib/utils/url-analyzer.ts`, `components/url-scanner.tsx` | Deterministic TypeScript regex, Unicode confusable tables, Shannon entropy |
| **M-02** | TLS & Lineage Classifier | Certificate & Domain Age | PRODUCTION INGESTION ACTIVE | **ARCHITECTURE ONLY** | `components/marketing/ai-engine-breakdown.tsx` | None (No active TLS socket/X.509 chain inspection code) |
| **M-03 (Web)** | Header & DMARC Telemetry | Email & Communication | BETA INGESTION | **PLANNED SPECIFICATION** | `components/marketing/ai-engine-breakdown.tsx` | None (No IMAP/SMTP/DMARC parser implementation) |
| **M-03 (OS)** | eBPF Kernel Syscall Probe | Endpoint Memory & Daemons | SANDBOX PREVIEW / ACTIVE | **NOT IMPLEMENTED** | `components/cyber/attack-simulator.tsx` | None (No C, Rust, libbpf, or BCC programs) |
| **M-04 (Web)** | Behavioral Syscall Heuristic | Endpoint Memory & Daemons | SANDBOX PREVIEW | **RESEARCH SPECIFICATION** | `components/marketing/ai-engine-breakdown.tsx` | None |
| **M-04 (HW)** | Hardware Enclave Vault (TPM) | Hardware Root-of-Trust | READY / ENFORCED | **NOT IMPLEMENTED** | `app/security/page.tsx` | None (No WebAuthn, TPM, or Secure Enclave bindings) |
| **ENG-WHOIS** | Domain Age & RDAP Resolver | Domain Registration | REAL-TIME RESOLUTION | **NOT IMPLEMENTED** | `components/url-scanner.tsx` | None (Labeled as Unverified in UI) |
| **ENG-DNS** | Encrypted DNS / DoH Sinkhole | Network & C2 Defense | CONFIGURED / ACTIVE | **MOCK / DEMO** | `lib/mock/security-data.ts` | Static mock items in JSON |
| **ENG-HOMO** | Unicode Homoglyph Engine | Brand Mimicry Defense | REAL-TIME RESOLUTION | **REAL / EXECUTABLE** | `backend/utils.py`, `lib/utils/url-analyzer.ts` | Cyrillic/Greek confusable map + IDNA punycode decoder |
| **ENG-PUNY** | Punycode IDN De-obfuscator | Obfuscation Analysis | REAL-TIME RESOLUTION | **REAL / EXECUTABLE** | `backend/utils.py`, `lib/utils/url-analyzer.ts` | IDNA encoding / decoding checks |
| **ENG-ENS** | Multi-Signal Decision Layer | Calibrated Risk Scoring | AVAILABLE / ONLINE | **REAL / EXECUTABLE** | `backend/main.py`, `backend/utils.py` | Calibrated linear combination of ML probability + structural risk points |
| **ENG-MESH** | Global Threat Mesh (14.8k) | P2P Threat Consensus | ACTIVE DECENTRALIZED MESH | **SIMULATION / DEMO** | `components/cyber/global-threat-radar.tsx` | HTML5 Canvas animation + React state |

---

## 3. M-01 AUDIT & RE-TRAINING BENCHMARK

### 3.1 Model Architecture
* **Python Class:** `sklearn.linear_model.SGDClassifier`
* **Loss Function:** `log_loss` (Logistic Regression objective)
* **Optimization:** Mini-batch Stochastic Gradient Descent with balanced sample weights
* **Feature Extractor:** `sklearn.feature_extraction.text.HashingVectorizer`
* **Feature Dimension:** $2^{20} = 1,048,576$ hash buckets
* **N-Gram Range:** Sliding character n-grams $(2, 5)$
* **Artifact Files:** `backend/ml/model.pkl` (8.38 MB), `backend/ml/vectorizer.pkl` (393 B)

### 3.2 Hold-Out Benchmark Results ($N = 146,577$ Test Samples)

$$\text{Accuracy} = 88.51\% \quad | \quad \text{ROC-AUC} = 0.9556$$

#### Confusion Matrix:
$$\begin{pmatrix} 64,323 & 8,966 \\ 7,878 & 65,410 \end{pmatrix}$$

#### Classification Report:
| Class | Precision | Recall | F1-Score | Support |
| :--- | :--- | :--- | :--- | :--- |
| **0 (Benign)** | 0.89 | 0.88 | 0.88 | 73,289 |
| **1 (Malicious)** | 0.88 | 0.89 | 0.89 | 73,288 |
| **Macro Average** | 0.89 | 0.89 | 0.89 | 146,577 |
| **Weighted Average** | 0.89 | 0.89 | 0.89 | 146,577 |

---

## 4. DOMAIN INTELLIGENCE, TLS & DNS AUDIT

* **RDAP / WHOIS:** **NOT CONNECTED.** Displayed values in the scanner now truthfully reflect: `"Not verified (Live RDAP unlinked)"`.
* **TLS Certificate Inspection:** **NOT CONNECTED.** The scanner now reports: `"HTTPS present (Cert unverified)"` or `"Plain HTTP (No Encryption)"`.
* **DNS Resolution:** **NOT CONNECTED.** No live DNS lookups or DoH attestation are executed.

---

## 5. HOMOGLYPH, PUNYCODE & STRUCTURAL ANALYZER

Deterministic detection engines were implemented in both Python (`backend/utils.py`) and TypeScript (`lib/utils/url-analyzer.ts`) supporting:
* Cyrillic lookalike characters (e.g. `а` U+0430, `с` U+0441, `е` U+0435, `о` U+043E, `р` U+0440).
* Missing-dot typosquatting patterns (e.g. `wwwgoogle.com`).
* Userinfo credential tricks (e.g. `https://google.com@attacker.com`).
* IP address literals (e.g. `185.220.101.9:8888`).
* Shannon entropy calculations to identify obfuscated strings.
* Suspicious high-risk TLDs (`.xyz`, `.top`, `.tk`, etc.).
* Verified apex domain matching for established roots (`google.com`, `github.com`, `paypal.com`).

---

## 6. FAIL-OPEN SECURITY AUDIT & REMEDIATION

### 6.1 Previous Flaw
When the backend was offline, the scanner checked 8 keywords; if unmatched, it returned `VERIFIED SAFE` with an `A+` SSL grade and `12.1 years` domain age.

### 6.2 Remediated Execution Path
1. The frontend attempts `POST http://127.0.0.1:8000/predict`.
2. If backend is offline, the client-side structural analyzer runs locally:
   - Known verified apex $\to$ `SAFE` (Risk 2%)
   - Homoglyphs / Typosquats / Userinfo / IP literals $\to$ `MALICIOUS` (Risk 75–100%)
   - Suspicious keywords / TLDs $\to$ `SUSPICIOUS` (Risk 45–65%)
   - Unfamiliar random domain $\to$ **`UNKNOWN / UNVERIFIED` (Risk 35%, Backend Offline Alert)**

---

## 7. AUTOMATED TEST SUITE & VALIDATION

### 7.1 Backend Test Results (`tests/test_backend.py`)
```text
tests/test_backend.py::test_health_check PASSED                          [ 12%]
tests/test_backend.py::test_known_benign_domain PASSED                   [ 25%]
tests/test_backend.py::test_homoglyph_detection PASSED                   [ 37%]
tests/test_backend.py::test_typosquatting_missing_dot PASSED             [ 50%]
tests/test_backend.py::test_userinfo_credential_trick PASSED             [ 62%]
tests/test_backend.py::test_ip_literal_host PASSED                       [ 75%]
tests/test_backend.py::test_invalid_short_url PASSED                     [ 87%]
tests/test_backend.py::test_unverified_random_domain PASSED              [100%]
======================== 8 passed in 1.85s ========================
```

### 7.2 Frontend Build & Typecheck
* `pnpm exec tsc --noEmit` $\to$ **0 type errors**
* `pnpm run build` $\to$ **Compiled successfully, 27/27 static pages generated**

---

## 8. FINAL STATUS TABLE

| Component | Claimed Status | Actual Status | Remediation Action |
| :--- | :--- | :--- | :--- |
| **M-01 ML Model** | Production Ingestion Active | **Real / Executable** | Re-trained, evaluated ($88.5\%$ acc, $0.9556$ AUC), and wired into `/predict` |
| **M-02 TLS Classifier** | Production Ingestion Active | **Architecture Only** | Labeled as architecture prototype; removed fake "A+" display |
| **M-03 eBPF Syscall** | Sandbox Preview | **Not Implemented** | Removed unsupported claims; labeled as research specification |
| **M-04 TPM Enclave** | Ready / Enforced | **Not Implemented** | Labeled as planned architecture; removed hardware-backed claim |
| **Domain Age Engine** | Real-Time Calculation | **Not Connected** | Removed fake "12.1 years"; now reports unverified status |
| **Homoglyph Engine** | Real-Time Resolution | **Real / Executable** | Implemented deterministic confusable table & IDNA decoder |
| **URL Scanner Fallback**| Fail-Open "Safe" | **Safe & Truthful** | Fixed silent fail-open; unknown domains return `UNKNOWN` |
| **Threat Mesh (14.8k)**| Active Decentralized | **Simulation / Demo** | Labeled as interactive demo simulation in radar & console |
