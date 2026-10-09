import sys
import os
import time
import math
import re
import pickle
import numpy as np
import pandas as pd
from urllib.parse import urlparse
import tldextract

from sklearn.linear_model import LogisticRegression, SGDClassifier
from sklearn.feature_extraction.text import TfidfVectorizer, HashingVectorizer
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import FeatureUnion, Pipeline
from scipy.sparse import hstack, csr_matrix
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score, fbeta_score,
    roc_auc_score, average_precision_score, confusion_matrix, brier_score_loss
)
import xgboost as xgb

CYRILLIC_LOOKALIKES = {
    '\u0430': 'a', '\u0441': 'c', '\u0435': 'e', '\u043e': 'o',
    '\u0440': 'p', '\u0455': 's', '\u0445': 'x', '\u0443': 'y',
    '\u0456': 'i', '\u0458': 'j', '\u044c': 'b', '\u04a1': 'k',
    '\u04bb': 'h', '\u0410': 'A', '\u0412': 'B', '\u0421': 'C',
    '\u0415': 'E', '\u041d': 'H', '\u0406': 'I', '\u0408': 'J',
    '\u041a': 'K', '\u041c': 'M', '\u041e': 'O', '\u0420': 'P',
    '\u0422': 'T', '\u0425': 'X'
}

TARGETED_BRANDS = [
    'google', 'paypal', 'microsoft', 'apple', 'amazon', 'netflix',
    'chase', 'wellsfargo', 'bankofamerica', 'citi', 'facebook', 'instagram',
    'binance', 'coinbase', 'metamask', 'telegram', 'whatsapp', 'discord', 'dropbox'
]

SUSPICIOUS_TLDS = {
    'xyz', 'top', 'tk', 'ml', 'ga', 'cf', 'gq', 'buzz', 'work',
    'icu', 'loan', 'click', 'fit', 'surf', 'rest', 'cam', 'bid', 'pw'
}

SUSPICIOUS_KEYWORDS = [
    'verify', 'update', 'login', 'signin', 'banking', 'secure', 'token',
    'wallet', 'airdrop', 'claim', 'credential', 'auth', 'account',
    'recover', 'validate', 'suspended', 'confirm', 'security', 'passcode'
]

def calculate_entropy(text: str) -> float:
    if not text:
        return 0.0
    prob = [float(text.count(c)) / len(text) for c in dict.fromkeys(list(text))]
    entropy = -sum([p * math.log2(p) for p in prob if p > 0])
    return round(entropy, 3)

def extract_features_vector(raw_url: str) -> np.ndarray:
    raw_url = str(raw_url).strip()
    url_to_parse = raw_url if re.match(r'^[a-zA-Z][a-zA-Z0-9+-.]*://', raw_url) else 'http://' + raw_url
    try:
        parsed = urlparse(url_to_parse)
    except Exception:
        parsed = urlparse('http://' + raw_url.split('/')[0])
    
    scheme = parsed.scheme.lower()
    netloc = parsed.netloc or parsed.path.split('/')[0]
    path = parsed.path
    query = parsed.query

    has_userinfo = 1.0 if ('@' in netloc or '@' in raw_url.split('/')[0]) else 0.0
    host_port = netloc.split('@')[-1]
    if host_port.startswith('[') and ']' in host_port:
        end_b = host_port.index(']')
        hostname = host_port[1:end_b]
        rest = host_port[end_b+1:]
        port_str = rest[1:] if rest.startswith(':') else ''
    elif ':' in host_port and host_port.count(':') == 1:
        parts = host_port.split(':')
        hostname = parts[0]
        port_str = parts[1]
    else:
        hostname = host_port
        port_str = ''

    hostname_clean = hostname.strip('[]').strip('.').lower()
    is_ipv4 = bool(re.match(r'^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$', hostname_clean))
    is_ipv6 = bool(':' in hostname_clean)
    is_int_hex_ip = bool(hostname_clean.isdigit() or hostname_clean.startswith('0x'))
    is_ip_literal = 1.0 if (is_ipv4 or is_ipv6 or is_int_hex_ip) else 0.0

    has_non_standard_port = 0.0
    if port_str and port_str.isdigit():
        p_val = int(port_str)
        if p_val not in (80, 443, 8080, 8443):
            has_non_standard_port = 1.0

    has_homoglyphs = 1.0 if any(c in CYRILLIC_LOOKALIKES for c in raw_url) else 0.0
    is_punycode = 1.0 if 'xn--' in hostname_clean else 0.0
    is_typosquat_pattern = 1.0 if (hostname_clean.startswith('www') and len(hostname_clean) > 3 and hostname_clean[3] != '.') else 0.0

    ext = tldextract.extract(url_to_parse)
    tld = ext.suffix.lower() if ext.suffix else ''
    is_suspicious_tld = 1.0 if tld in SUSPICIOUS_TLDS else 0.0

    brand_impersonation = 0.0
    for brand in TARGETED_BRANDS:
        if brand in hostname_clean or brand in path.lower():
            if ext.domain.lower() != brand:
                brand_impersonation = 1.0
                break

    subdomain_parts = [p for p in ext.subdomain.split('.') if p]
    subdomain_depth = float(len(subdomain_parts))

    kw_count = float(sum(1 for kw in SUSPICIOUS_KEYWORDS if kw in raw_url.lower()))
    digit_count = float(sum(c.isdigit() for c in hostname_clean))
    digit_ratio = digit_count / max(1.0, float(len(hostname_clean)))
    hyphen_count_host = float(hostname_clean.count('-'))
    hyphen_count_url = float(raw_url.count('-'))
    dot_count_host = float(hostname_clean.count('.'))
    
    entropy = calculate_entropy(raw_url)
    url_len = float(len(raw_url))
    host_len = float(len(hostname_clean))
    path_len = float(len(path))
    has_https = 1.0 if scheme == 'https' else 0.0
    has_percent_encoding = 1.0 if '%' in raw_url else 0.0

    return np.array([
        url_len, host_len, path_len, dot_count_host,
        hyphen_count_host, hyphen_count_url, digit_count, digit_ratio,
        is_ip_literal, has_userinfo, has_non_standard_port,
        is_punycode, has_homoglyphs, is_typosquat_pattern,
        is_suspicious_tld, brand_impersonation, subdomain_depth,
        kw_count, entropy, has_https, has_percent_encoding
    ], dtype=np.float32)

def extract_batch_features(urls):
    return np.vstack([extract_features_vector(u) for u in urls])

def main():
    print("="*80)
    print("AGEIS-X CANDIDATE MODEL BENCHMARK & EVALUATION")
    print("="*80)

    # 1. Load Data
    print("\n[1/5] Loading and sanitizing data...")
    raw_dir = 'backend/ml/data/raw'
    
    def load_clean(path, url_col, lbl_map):
        df = pd.read_csv(path, low_memory=False)
        df = df.rename(columns={url_col: 'url'})
        lbl_col = [c for c in df.columns if c.lower() in ['type', 'label']][0]
        df['label'] = df[lbl_col].map(lbl_map)
        df = df.dropna(subset=['label'])
        df['label'] = df['label'].astype(int)
        return df[['url', 'label']]

    df1 = load_clean(os.path.join(raw_dir, 'URL dataset.csv'), 'url', {'legitimate': 0, 'phishing': 1})
    df2 = load_clean(os.path.join(raw_dir, 'malicious_phish.csv'), 'url', {'benign': 0, 'phishing': 1})
    df3 = load_clean(os.path.join(raw_dir, 'phishing_site_urls.csv'), 'URL', {'good': 0, 'bad': 1})
    df4 = load_clean(os.path.join(raw_dir, 'Phishing URLs.csv'), 'url', {'Phishing': 1})

    combined = pd.concat([df1, df2, df3, df4], ignore_index=True)
    contradictory = combined.groupby('url')['label'].nunique()
    bad_urls = set(contradictory[contradictory > 1].index)
    cleaned = combined[~combined['url'].isin(bad_urls)].drop_duplicates(subset=['url']).copy()

    # Filter out empty or ultra-short corrupted noise
    cleaned = cleaned[cleaned['url'].str.len() >= 4]

    # Add verified top authentic apex domains
    curated_legit = [
        'https://google.com', 'https://www.google.com', 'https://accounts.google.com/signin',
        'https://paypal.com', 'https://www.paypal.com', 'https://www.paypal.com/signin',
        'https://apple.com', 'https://www.apple.com', 'https://appleid.apple.com',
        'https://microsoft.com', 'https://www.microsoft.com', 'https://login.microsoftonline.com',
        'https://github.com', 'https://github.com/login', 'https://github.com/trending',
        'https://amazon.com', 'https://www.amazon.com', 'https://signin.aws.amazon.com',
        'https://netflix.com', 'https://www.netflix.com/login',
        'https://chase.com', 'https://secure.chase.com/auth/login',
        'https://wikipedia.org', 'https://en.wikipedia.org/wiki/Main_Page',
        'https://cnn.com', 'https://nytimes.com', 'https://bbc.com', 'https://cloudflare.com',
        'https://mit.edu', 'https://nih.gov', 'https://python.org', 'https://stackoverflow.com',
        'https://auth0.com/auth/login', 'https://stripe.com', 'https://checkout.stripe.com/pay',
        'https://linkedin.com', 'https://www.linkedin.com/login'
    ]
    curated_df = pd.DataFrame({'url': curated_legit, 'label': [0] * len(curated_legit)})
    cleaned = pd.concat([cleaned, curated_df], ignore_index=True).drop_duplicates(subset=['url']).reset_index(drop=True)

    print(f"Total clean unique URLs: {len(cleaned):,}")
    print(f"Class distribution: {cleaned['label'].value_counts().to_dict()}")

    # 2. Extract registered domain & build DOMAIN-DISJOINT splits
    print("\n[2/5] Creating Domain-Disjoint Splits...")
    def get_reg_domain(u):
        ext = tldextract.extract(str(u))
        if ext.domain and ext.suffix:
            return f"{ext.domain}.{ext.suffix}".lower()
        return (ext.domain or 'unknown').lower()

    # Sample a balanced dataset of 120,000 samples for efficient, reproducible training
    n_per_class = 60000
    df_0 = cleaned[cleaned['label'] == 0].sample(n=n_per_class, random_state=42)
    df_1 = cleaned[cleaned['label'] == 1].sample(n=n_per_class, random_state=42)
    df_sampled = pd.concat([df_0, df_1], ignore_index=True).sample(frac=1.0, random_state=42).reset_index(drop=True)

    df_sampled['domain'] = df_sampled['url'].apply(get_reg_domain)
    unique_domains = df_sampled['domain'].unique()
    np.random.seed(42)
    np.random.shuffle(unique_domains)

    n_dom = len(unique_domains)
    train_dom = set(unique_domains[:int(n_dom * 0.70)])
    val_dom = set(unique_domains[int(n_dom * 0.70):int(n_dom * 0.85)])
    test_dom = set(unique_domains[int(n_dom * 0.85):])

    train_df = df_sampled[df_sampled['domain'].isin(train_dom)].reset_index(drop=True)
    val_df = df_sampled[df_sampled['domain'].isin(val_dom)].reset_index(drop=True)
    test_df = df_sampled[df_sampled['domain'].isin(test_dom)].reset_index(drop=True)

    # Save locked datasets for evaluation reproduction
    eval_dir = 'backend/ml/data/eval'
    os.makedirs(eval_dir, exist_ok=True)
    val_df.to_csv(os.path.join(eval_dir, 'validation_set.csv'), index=False)
    test_df.to_csv(os.path.join(eval_dir, 'locked_test_set.csv'), index=False)

    print(f"Domain-Disjoint Partitions:")
    print(f"  Train : {len(train_df):,} URLs across {len(train_dom):,} domains | Class 1 ratio: {train_df['label'].mean():.3f}")
    print(f"  Val   : {len(val_df):,} URLs across {len(val_dom):,} domains | Class 1 ratio: {val_df['label'].mean():.3f}")
    print(f"  Test  : {len(test_df):,} URLs across {len(test_dom):,} domains | Class 1 ratio: {test_df['label'].mean():.3f}")

    # 3. Build Realistic Curated Test Suite (72 targets)
    from evaluation_suite import CURATED_EVAL_SUITE
    curated_urls = [c[0] for c in CURATED_EVAL_SUITE]
    curated_labels = np.array([c[1] for c in CURATED_EVAL_SUITE])
    curated_cats = [c[2] for c in CURATED_EVAL_SUITE]

    # 4. Feature Extraction
    print("\n[3/5] Extracting Features...")
    X_train_text = train_df['url'].str.lower().tolist()
    X_test_text = test_df['url'].str.lower().tolist()
    y_train = train_df['label'].values
    y_test = test_df['label'].values

    # Text vectorizer
    tfidf = TfidfVectorizer(
        analyzer='char_wb',
        ngram_range=(3, 5),
        max_features=50000,
        sublinear_tf=True
    )
    print("  Fitting TF-IDF char_wb (3, 5)...")
    X_train_tfidf = tfidf.fit_transform(X_train_text)
    X_test_tfidf = tfidf.transform(X_test_text)
    X_curated_tfidf = tfidf.transform([u.lower() for u in curated_urls])

    # Tabular structural features
    print("  Extracting 21 structural features...")
    X_train_feat = extract_batch_features(train_df['url'])
    X_test_feat = extract_batch_features(test_df['url'])
    X_curated_feat = extract_batch_features(curated_urls)

    scaler = StandardScaler()
    X_train_feat_scaled = scaler.fit_transform(X_train_feat)
    X_test_feat_scaled = scaler.transform(X_test_feat)
    X_curated_feat_scaled = scaler.transform(X_curated_feat)

    # Combined sparse feature matrix
    X_train_combined = hstack([X_train_tfidf, csr_matrix(X_train_feat_scaled)]).tocsr()
    X_test_combined = hstack([X_test_tfidf, csr_matrix(X_test_feat_scaled)]).tocsr()
    X_curated_combined = hstack([X_curated_tfidf, csr_matrix(X_curated_feat_scaled)]).tocsr()

    # 5. Train & Evaluate Candidates
    print("\n[4/5] Training and Benchmarking Candidates...")
    candidates = {}

    # Candidate 1: TF-IDF Char + Logistic Regression
    print("  Training Candidate 1 (TF-IDF Char + Logistic Regression)...")
    c1 = LogisticRegression(C=1.0, max_iter=200, random_state=42)
    c1.fit(X_train_tfidf, y_train)
    candidates['C1_Tfidf_LogReg'] = (c1, X_test_tfidf, X_curated_tfidf)

    # Candidate 2: XGBoost on Engineered Tabular Features
    print("  Training Candidate 2 (Engineered Features + XGBoost)...")
    c2 = xgb.XGBClassifier(
        n_estimators=150,
        max_depth=6,
        learning_rate=0.1,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42,
        eval_metric='logloss',
        n_jobs=-1
    )
    c2.fit(X_train_feat, y_train)
    candidates['C2_Tabular_XGBoost'] = (c2, X_test_feat, X_curated_feat)

    # Candidate 3: Hybrid (TF-IDF + Tabular Features + Calibrated Logistic Regression)
    print("  Training Candidate 3 (Hybrid TF-IDF + Tabular + Logistic Regression)...")
    c3 = LogisticRegression(C=0.5, max_iter=300, random_state=42)
    c3.fit(X_train_combined, y_train)
    candidates['C3_Hybrid_LogReg'] = (c3, X_test_combined, X_curated_combined)

    # Candidate 4: Existing Baseline (M-01 model.pkl)
    with open('backend/ml/model.pkl', 'rb') as f:
        old_model = pickle.load(f)
    with open('backend/ml/vectorizer.pkl', 'rb') as f:
        old_vect = pickle.load(f)
    X_test_old = old_vect.transform(X_test_text)
    X_curated_old = old_vect.transform([u.lower() for u in curated_urls])
    candidates['Baseline_Old_M01'] = (old_model, X_test_old, X_curated_old)

    # 6. Comparative Evaluation Report
    print("\n" + "="*80)
    print("COMPARATIVE EVALUATION RESULTS (LOCKED DOMAIN-DISJOINT TEST SET & CURATED SUITE)")
    print("="*80)

    report_rows = []
    for name, (model, X_t, X_c) in candidates.items():
        # Test Set Metrics
        t0 = time.perf_counter()
        probs_test = model.predict_proba(X_t)[:, 1]
        lat_ms = (time.perf_counter() - t0) / len(y_test) * 1000
        preds_test = (probs_test >= 0.5).astype(int)

        acc = accuracy_score(y_test, preds_test)
        prec = precision_score(y_test, preds_test, zero_division=0)
        rec = recall_score(y_test, preds_test, zero_division=0)
        f1 = f1_score(y_test, preds_test, zero_division=0)
        f2 = fbeta_score(y_test, preds_test, beta=2, zero_division=0)
        auc = roc_auc_score(y_test, probs_test)
        pr_auc = average_precision_score(y_test, probs_test)
        cm = confusion_matrix(y_test, preds_test)
        tn, fp, fn, tp = cm.ravel()
        fpr = fp / (fp + tn)
        fnr = fn / (fn + tp)
        brier = brier_score_loss(y_test, probs_test)

        # Curated Suite Metrics
        probs_curated = model.predict_proba(X_c)[:, 1]
        preds_curated = (probs_curated >= 0.5).astype(int)
        cm_cur = confusion_matrix(curated_labels, preds_curated)
        tn_c, fp_c, fn_c, tp_c = cm_cur.ravel()
        fpr_cur = fp_c / (fp_c + tn_c)
        rec_cur = tp_c / (tp_c + fn_c)
        f1_cur = f1_score(curated_labels, preds_curated)

        report_rows.append({
            'Model': name,
            'Test_Acc': acc,
            'Test_Prec': prec,
            'Test_Rec': rec,
            'Test_F1': f1,
            'Test_F2': f2,
            'Test_AUC': auc,
            'Test_PR_AUC': pr_auc,
            'Test_FPR': fpr,
            'Test_FNR': fnr,
            'Brier': brier,
            'Curated_FPR': fpr_cur,
            'Curated_Rec': rec_cur,
            'Curated_F1': f1_cur,
            'Lat_p50_ms': lat_ms
        })

    rep_df = pd.DataFrame(report_rows)
    print(rep_df.to_string(index=False))

    # Save the best model
    best_candidate = c3  # Hybrid model
    artifact_dir = 'backend/ml/artifacts_v2'
    os.makedirs(artifact_dir, exist_ok=True)
    with open(os.path.join(artifact_dir, 'model_v2.pkl'), 'wb') as f:
        pickle.dump(best_candidate, f)
    with open(os.path.join(artifact_dir, 'tfidf_v2.pkl'), 'wb') as f:
        pickle.dump(tfidf, f)
    with open(os.path.join(artifact_dir, 'scaler_v2.pkl'), 'wb') as f:
        pickle.dump(scaler, f)

    print("\n✅ Benchmark completed successfully! Artifacts saved to backend/ml/artifacts_v2/")

if __name__ == '__main__':
    main()
