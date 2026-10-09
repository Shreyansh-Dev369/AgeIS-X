# AGEIS-X — FORENSIC PHISHING DETECTION AUDIT & MODEL RELIABILITY REPORT

```text
================================================================================
FORENSIC AUDIT METADATA
================================================================================
Target Repository    : AgeIS-X (AgeIS-X-main)
Root Path            : c:\Users\LENOVO\Downloads\AgeIS-X-main\AgeIS-X-main
Audit Timestamp      : 2026-10-09T22:40:00+05:30
Audit Focus          : Machine Learning Model Quality, Data Provenance,
                       Domain Leakage, Failure Modes, and Decision Pipelines
Status               : PHASE 1 FORENSIC AUDIT COMPLETE
================================================================================
```

---

## 1. EXECUTIVE SUMMARY & FORENSIC DISCOVERIES

A deep forensic audit of the **AgeIS-X** phishing detection subsystem was conducted to investigate reliability failures, false-positive vulnerabilities, and structural defects. 

### Critical Forensic Discoveries:

1. **Fatal False Positive Bias on Legitimate Apex & Brand Domains (88.0% FPR):**
   The active ML model (`backend/ml/model.pkl`) misclassifies **88%** of standard, legitimate internet root domains and authentication portals as phishing. Specifically:
   - `https://google.com` $\to$ **98.31% Phishing Probability**
   - `https://paypal.com` $\to$ **97.39% Phishing Probability**
   - `https://apple.com` $\to$ **97.66% Phishing Probability**
   - `https://microsoft.com` $\to$ **96.28% Phishing Probability**
   - `https://cloudflare.com` $\to$ **97.10% Phishing Probability**
   - `https://cnn.com` $\to$ **96.57% Phishing Probability**
   - `https://mit.edu/admissions` $\to$ **84.92% Phishing Probability**
   This failure occurs because the model has a positive bias intercept ($w_0 = +1.2628 \implies \sigma(1.2628) \approx 77.95\%$ base phishing probability) and character n-gram weights for brand tokens (`google`, `paypal`, `apple`, `login`, `signin`) that are strongly positive because the training set contained tens of thousands of phishing URLs containing these keywords and negligible legitimate apex domain samples.

2. **Hardcoded Whitelist Masking Model Failure:**
   The application appeared to function during basic unit tests solely because `backend/main.py` enforced a hardcoded 12-domain bypass list (`KNOWN_BENIGN_APEX = {"google.com", "paypal.com", ...}`). Any legitimate domain outside this 12-domain list (e.g. `cnn.com`, `mit.edu`, `bbc.com`, `stackoverflow.com`, or any regional business/university) receives $>90\%$ ML probability and gets flagged as `suspicious` or `malicious`.

3. **Severe Domain Leakage in Training Splits (71.52% Test Overlap):**
   The training pipeline (`backend/ml/train.py`) performed a naive random URL split (`train_test_split`). Out of 82,976 unique registered domains in the test partition, **43,842 (52.84%)** were already present in the training partition. **104,833 out of 146,577 test URLs (71.52%)** were from memorized domains. The previously claimed 88.51% test accuracy and 0.9556 ROC-AUC in `AGEIS-X-FULL-MODEL-AUDIT.md` were heavily inflated by domain memorization.

4. **Severe Dataset Contamination and Conflicting Labels:**
   - In `backend/ml/data/processed/final_dataset.csv`, **42,921 unique URLs (85,842 rows, ~11.7% of the dataset) have conflicting labels**—the exact same URL is simultaneously labeled as legitimate ($0$) and phishing ($1$). For example, `www.gnu.org/software/grep/grep.html` appears as both benign and phishing.
   - `backend/ml/preprocess.py` performed naive substring column matching (`if 'url' in col:`), mistakenly importing non-URL numerical feature datasets (such as `Dataset Phising Website.csv` where column `URL_Length` was interpreted as URL).
   - In `preprocess.py`, `convert_label` converted `-1` to `None` for UCI datasets, dropping benign classes and retaining only phishing rows.
   - Unsanitized binary garbage strings (e.g. `ãÞ¥}`, `ŒÊ< OîJ#l9...`) were accepted as URLs.

5. **Flawed Multi-Signal Risk Aggregation Formula:**
   In `backend/main.py`, risk was aggregated as `int((base_ml_risk * 0.35) + (structural_boost * 0.30) + (intel_adjustment * 0.35))`. 
   `intel_adjustment` was a delta (e.g. -10 to +40), not a 0-100 normalized score. When external network lookups are neutral or unverified (`intel_adjustment = 0`), a true phishing URL with ML probability 0.99 and structural score 30 scores only $43.65 \approx 44$, falling below the 70-point threshold for `malicious`.
   Furthermore, an active phishing site with a valid TLS certificate (such as Let's Encrypt) received an automatic $-10$ deduction, diluting the risk score.

---

## 2. COMPONENT & MODEL INVENTORY

| Field | Description / Finding |
| :--- | :--- |
| **Model ID** | `M-01-SGD` |
| **Architecture** | `sklearn.linear_model.SGDClassifier(loss='log_loss', max_iter=5, random_state=42)` |
| **Artifact Path** | `backend/ml/model.pkl` (8,389,522 bytes) |
| **Feature Extractor** | `sklearn.feature_extraction.text.HashingVectorizer(n_features=1048576, analyzer='char', ngram_range=(2, 5), alternate_sign=False)` |
| **Vectorizer Path** | `backend/ml/vectorizer.pkl` (393 bytes) |
| **Input Representation** | Lowercased raw URL string (`str.lower()`), transformed to $2^{20}$ character n-gram hash buckets |
| **Training Data** | `backend/ml/data/processed/final_dataset.csv` ($N = 732,882$ rows: 366,441 label 0, 366,441 label 1) |
| **Output Classes** | `classes_ = [0, 1]` ($0 = \text{Benign/Legitimate}$, $1 = \text{Phishing/Malicious}$) |
| **Score Semantics** | `model.predict_proba(X)[0][1]` $\in [0.0, 1.0]$ represents estimated probability of phishing |
| **Decision Threshold** | Deployed at $\ge 0.50$ for ML label, combined with structural & intelligence adjustments in `backend/main.py` |
| **Loaded By** | `backend/main.py` lines 63–78 (`pickle.load` at FastAPI startup) |
| **Used by Scanner** | Confirmed active on `POST /predict` |
| **Known Limitations** | Severe brand bias, positive intercept bias ($w_0 = +1.26$), 71.5% domain leakage in training split, 42.9k conflicting labels, cannot distinguish brand apex from lookalikes without external hardcoded whitelist |

---

## 3. END-TO-END PREDICTION PATH TRACE

```text
+---------------------------------------------------------------------------------------+
| 1. User Input: raw_url submitted to POST /predict                                     |
+---------------------------------------------------------------------------------------+
                                           |
                                           v
+---------------------------------------------------------------------------------------+
| 2. Input Validation (backend/main.py:152):                                            |
|    - Checks len(raw_url) >= 3. If invalid -> HTTPException(400)                       |
+---------------------------------------------------------------------------------------+
                                           |
                                           v
+---------------------------------------------------------------------------------------+
| 3. Deterministic Structural & Unicode Analysis (backend/utils.py:parse_url_structure) |
|    - Normalizes scheme (prepends http:// if missing).                                 |
|    - Checks userinfo (@), IP literals (v4/v6/hex/int), non-standard ports.            |
|    - Checks Cyrillic/Greek homoglyphs and Punycode (xn--).                            |
|    - Checks typosquat missing-dot (wwwgoogle.com).                                    |
|    - Computes Shannon entropy, subdomain depth, high-risk TLDs.                       |
|    - Evaluates hardcoded KNOWN_BENIGN_APEX (12 domains).                              |
+---------------------------------------------------------------------------------------+
                                           |
                                           v
+---------------------------------------------------------------------------------------+
| 4. Live Domain & Content Intelligence with SSRF Guards:                               |
|    - safety.py: validates IP is not private, loopback, metadata, or prohibited.       |
|    - rdap.py: queries ICANN/RDAP for domain age.                                      |
|    - dns.py: authoritative DoH resolution (Cloudflare / Google DNS).                  |
|    - tls.py: active socket connection, X.509 cert validation, SAN verification.       |
|    - content/fetcher.py: HTTP acquisition, HTML form analysis, iframe/JS detection.   |
+---------------------------------------------------------------------------------------+
                                           |
                                           v
+---------------------------------------------------------------------------------------+
| 5. ML Model Inference (backend/main.py:188-201):                                      |
|    - normalized_for_ml = raw_url.lower()                                              |
|    - X_vect = vectorizer.transform([normalized_for_ml])                              |
|    - ml_probability = float(model.predict_proba(X_vect)[0][1])                       |
+---------------------------------------------------------------------------------------+
                                           |
                                           v
+---------------------------------------------------------------------------------------+
| 6. Risk Aggregation (backend/main.py:202-288):                                        |
|    - IF SSRF blocked -> risk = 99, verdict = "malicious"                              |
|    - ELIF known benign apex -> risk = 2, verdict = "safe" [BYPASSES ML COMPLETELY]    |
|    - ELSE: calculated_score = (ml*35 + struct*30 + intel*35)                          |
|      Enforces floor overrides (homoglyphs, userinfo, brand impersonation).            |
|      Thresholds: >=70 malicious, >=30 suspicious, <30 safe.                           |
+---------------------------------------------------------------------------------------+
                                           |
                                           v
+---------------------------------------------------------------------------------------+
| 7. API Response & Frontend Display (components/url-scanner.tsx):                      |
|    - Maps backend verdict to UI badges and risk meter.                                |
|    - Fallback: if backend offline, executes local analyzeUrlStructure().              |
+---------------------------------------------------------------------------------------+
```

---

## 4. VERIFIED DEFECTS & ROOT CAUSES

### Defect 1: Positive Intercept and Severe Brand Token Phishing Bias
* **Source:** `backend/ml/train.py`, `backend/ml/model.pkl`
* **Evidence:** 
  - `model.intercept_ = [1.26278505]` $\implies \sigma(1.2628) = 0.7795$. An empty or zero-feature string has a 78% phishing probability.
  - Linear decision function for `google`: $+2.41$ (prob $0.9174$), `paypal`: $+1.34$ (prob $0.7922$), `apple`: $+1.89$ (prob $0.8686$), `login`: $+2.93$ (prob $0.9492$), `verify`: $+1.83$ (prob $0.8618$).
  - In `final_dataset.csv`, `google.com` appeared in 8,058 rows, of which 7,156 (88.8%) were labeled phishing.
* **Impact:** 88% false positive rate on legitimate websites; model cannot be used without a hardcoded whitelist.

### Defect 2: 71.52% Domain Leakage Across Train/Test Splits
* **Source:** `backend/ml/train.py:38–44`
* **Evidence:**
  - Random URL split: `train_test_split(df['url'], df['label'], test_size=0.2, stratify=df['label'])`.
  - 104,833 out of 146,577 test URLs (71.52%) shared registered domains with the training set.
* **Impact:** Evaluation accuracy was an artifact of domain memorization rather than generalized phishing detection.

### Defect 3: 42,921 Conflicting Label Contaminations in Training Data
* **Source:** `backend/ml/preprocess.py:108–110`
* **Evidence:**
  - `df.drop_duplicates(inplace=True)` deduplicated on all columns `['url', 'label']` rather than `['url']`.
  - Exactly 42,921 unique URLs (85,842 total rows) appear with both label 0 and label 1.
* **Impact:** The SGD optimizer was fed directly contradictory gradient updates for identical feature vectors.

### Defect 4: Malformed Ingestion in `preprocess.py`
* **Source:** `backend/ml/preprocess.py:38–47`
* **Evidence:**
  - `if 'url' in col:` matched non-URL columns like `URL_Length` and `qty_dot_url`, importing integers as URLs.
  - `convert_label` discarded `-1` labels, corrupting class proportions in multi-dataset merges.
  - Non-ASCII prints crash Windows consoles without UTF-8 reconfiguration.
* **Impact:** Corrupted records and unrepeatable data pipelines.

### Defect 5: Flawed Multi-Signal Risk Aggregator
* **Source:** `backend/main.py:262–287`
* **Evidence:**
  - Formula: `calculated_score = int((base_ml_risk * 0.35) + (structural_boost * 0.30) + (intel_adjustment * 0.35))`
  - When `intel_adjustment` is 0 (neutral/unreachable intelligence), max score is $35 + 30 = 65 < 70$. Real phishing attacks like `http://paypa1-security-update.com/login` score 47 $\implies$ `suspicious` instead of `malicious`.
  - Clean TLS cert on a phishing site deducts 10 points, diluting malicious verdicts.
* **Impact:** High false-negative rate on real-world phishing attacks.

### Defect 6: Lack of Honest Uncertainty & Ambiguous Verdict Taxonomy
* **Source:** `backend/main.py:282–287`, `components/url-scanner.tsx:77`
* **Evidence:**
  - The system only outputs `safe`, `suspicious`, or `malicious`.
  - When external lookups fail or websites are unreachable, the system does not output `INCONCLUSIVE` or `LIKELY_SAFE`.
* **Impact:** Violates production security audit standards regarding honest uncertainty.

---

## 5. REPRODUCIBLE EXAMPLES OF DEFECTIVE BEHAVIOR

| Input URL | Expected Behavior | Actual Deployed Behavior | Defect Classification |
| :--- | :--- | :--- | :--- |
| `https://google.com` | Safe / Benign | ML Prob: **0.9831** (Phish), forced to Safe by whitelist | False Positive Model Bias masked by hardcoded bypass |
| `https://cnn.com` | Safe / Benign | ML Prob: **0.9657**, Risk: 35, Verdict: **`suspicious`** | False Positive on non-whitelisted reputable domain |
| `https://mit.edu/admissions` | Safe / Benign | ML Prob: **0.8492**, Risk: 35, Verdict: **`suspicious`** | False Positive on educational domain |
| `http://paypa1-security-update.com/login` | Phishing / Malicious | ML Prob: 0.9909, Risk: **47**, Verdict: **`suspicious`** | False Negative in Risk Aggregation (fails to reach 70) |
| `http://secure-banking-login.xyz/auth` | Phishing / Malicious | ML Prob: 0.9912, Risk: **52**, Verdict: **`suspicious`** | False Negative in Risk Aggregation |
| `https://wwwgoogle.com/search` | Typosquatting / Suspicious | ML Prob: **0.0837** (Safe) | False Negative in ML Model (missed typosquat) |

---

## 6. CURRENT BASELINE EVALUATION

### A. Random Split (with 71.52% Domain Leakage)
* **Sample Count:** $N = 20,000$ (test partition)
* **Accuracy:** 88.44%
* **Precision:** 87.81%
* **Recall:** 89.19%
* **F1-Score:** 88.49%
* **ROC-AUC:** 0.9553
* **Confusion Matrix:** $\begin{pmatrix} 8804 & 1234 \\ 1077 & 8885 \end{pmatrix}$

### B. Realistic Curated Phishing & Legitimate Benchmark ($N = 45$ URLs)
* **Legitimate Tested:** 25 URLs (Alexa top domains, authentication portals, deep paths)
* **Legitimate Flagged as Phishing (False Positives):** **22 / 25 (88.0%)**
* **Average ML Probability for Legitimate:** **0.8113**
* **Phishing Tested:** 20 URLs (Brand impersonation, typosquats, crypto, homoglyphs)
* **Phishing Detected (True Positives):** 19 / 20 (95.0%)
* **Phishing Missed (False Negatives):** 1 / 20 (`wwwgoogle.com` received 0.0837)
* **Average ML Probability for Phishing:** **0.9211**

---

## 7. PRIORITIZED AUDIT FINDINGS

1. **[CRITICAL] P0 Model False Positive Defect:** Model predicts $>90\%$ phishing probability on reputable domains due to unbalanced token associations and high intercept bias.
2. **[CRITICAL] P0 Training Pipeline Domain Leakage:** $71.52\%$ of test URLs share registered domains with training data, invalidating previous offline accuracy benchmarks.
3. **[CRITICAL] P0 Risk Aggregation Weighting Defect:** Phishing URLs with $0.99$ probability score $<70$ risk, under-classifying confirmed phishing as merely `suspicious`.
4. **[HIGH] P1 Dataset Contamination:** $42,921$ contradictory URLs with dual labels; non-URL numerical datasets improperly merged.
5. **[HIGH] P1 Hardcoded 12-Apex Whitelist Bypass:** Masks ML model failure for 12 domains while exposing all other legitimate web traffic to false-positive degradation.
6. **[MEDIUM] P2 Verdict Semantics:** Missing `INCONCLUSIVE` and `LIKELY_SAFE` states for unverified/timeout lookups.
7. **[LOW] P3 Console Encoding:** `preprocess.py` crashes on Windows cp1252 consoles on unhandled emoji strings.

---

## 8. STRATEGIC DECISION & ACTION PLAN

### Recommendation: RETRAIN & UPGRADE ML ARCHITECTURE + REPAIR PIPELINE

1. **Do not merely tweak threshold on the broken model:** A threshold of $0.99$ would destroy recall while still flagging `https://paypa1-security-update.com/login` and `google.com` identically.
2. **Re-engineer Training Dataset:**
   - Filter and sanitize raw datasets: eliminate conflicting labels, discard numeric UCI tables, enforce valid URL structure.
   - Inject verified top-million benign apex domains and clean login paths to teach the model legitimate domain representations.
   - Enforce **Domain-Disjoint Stratified Splitting** (GroupKFold / domain-grouped split) to prevent data leakage.
3. **Feature Engineering & Estimator Benchmark:**
   - Construct robust URL features: structural ratios, token extraction, entropy, brand lookalike distances, combined with character n-grams.
   - Train calibrated classifier (e.g. Logistic Regression with calibrated regularization or XGBoost on tabular+text features) that achieves high recall with $<1\%$ FPR on unseen legitimate domains.
4. **Repair Risk Aggregator:**
   - Calibrate risk aggregation formula so that verified high-confidence ML threat signals ($P > 0.85$) or severe deterministic triggers (homoglyphs, off-domain forms) reliably cross the `PHISHING` threshold ($\ge 70$).
   - Implement explicit 4-state verdicts: `PHISHING`, `SUSPICIOUS`, `LIKELY_SAFE`, `INCONCLUSIVE`.
   - Prevent TLS possession from diluting phishing verdicts.
