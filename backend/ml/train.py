"""
AGEIS-X PRODUCTION TRAINING SCRIPT (V2)
Trains the hybrid phishing detection classifier using domain-disjoint splits,
canonicalized URL character n-grams, and 21 domain-aware structural features.
"""

import os
import sys
import time
import pickle
import numpy as np
import pandas as pd
from urllib.parse import urlparse
import tldextract
from scipy.sparse import hstack, csr_matrix

from sklearn.linear_model import LogisticRegression
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score, fbeta_score,
    roc_auc_score, average_precision_score, confusion_matrix, classification_report
)

# Force UTF-8 stdout
if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
PROCESSED_FILE = os.path.join(DATA_DIR, "processed", "clean_dataset.csv")
EVAL_DIR = os.path.join(DATA_DIR, "eval")
ARTIFACTS_V2_DIR = os.path.join(BASE_DIR, "artifacts_v2")

from pipeline import canonicalize_for_ml, extract_features_vector

def extract_batch_features(urls):
    return np.vstack([extract_features_vector(u) for u in urls])

def train_production_model():
    print("="*80)
    print("AGEIS-X PRODUCTION MODEL TRAINING PIPELINE (V2)")
    print("="*80)

    # 1. Load Clean Dataset
    if not os.path.exists(PROCESSED_FILE):
        print("[INFO] Clean dataset not found. Running preprocessor...")
        from preprocess import preprocess_all_datasets
        preprocess_all_datasets()

    print(f"[INFO] Loading cleaned data from {PROCESSED_FILE}...")
    df = pd.read_csv(PROCESSED_FILE)
    print(f"[INFO] Loaded {len(df):,} total samples.")
    print(f"[INFO] Class balance: {df['label'].value_counts().to_dict()}")

    # 2. Domain-Disjoint Stratified Partitioning
    print("[INFO] Partitioning by registered domain (Zero-Overlap Guarantee)...")
    def get_reg_domain(u):
        ext = tldextract.extract(str(u))
        if ext.domain and ext.suffix:
            return f"{ext.domain}.{ext.suffix}".lower()
        return (ext.domain or 'unknown').lower()

    # Balanced sample for training
    n_per_class = min(60000, df['label'].value_counts().min())
    df_0 = df[df['label'] == 0].sample(n=n_per_class, random_state=42)
    df_1 = df[df['label'] == 1].sample(n=n_per_class, random_state=42)
    df_balanced = pd.concat([df_0, df_1], ignore_index=True).sample(frac=1.0, random_state=42).reset_index(drop=True)

    df_balanced['domain'] = df_balanced['url'].apply(get_reg_domain)
    unique_domains = np.array(df_balanced['domain'].unique())
    
    np.random.seed(42)
    np.random.shuffle(unique_domains)

    n_dom = len(unique_domains)
    train_dom = set(unique_domains[:int(n_dom * 0.70)])
    val_dom = set(unique_domains[int(n_dom * 0.70):int(n_dom * 0.85)])
    test_dom = set(unique_domains[int(n_dom * 0.85):])

    train_df = df_balanced[df_balanced['domain'].isin(train_dom)].reset_index(drop=True)
    val_df = df_balanced[df_balanced['domain'].isin(val_dom)].reset_index(drop=True)
    test_df = df_balanced[df_balanced['domain'].isin(test_dom)].reset_index(drop=True)

    os.makedirs(EVAL_DIR, exist_ok=True)
    val_df.to_csv(os.path.join(EVAL_DIR, "validation_set.csv"), index=False)
    test_df.to_csv(os.path.join(EVAL_DIR, "locked_test_set.csv"), index=False)

    print(f"Domain-Disjoint Partitions:")
    print(f"  Train : {len(train_df):,} URLs across {len(train_dom):,} domains | Pos ratio: {train_df['label'].mean():.3f}")
    print(f"  Val   : {len(val_df):,} URLs across {len(val_dom):,} domains | Pos ratio: {val_df['label'].mean():.3f}")
    print(f"  Test  : {len(test_df):,} URLs across {len(test_dom):,} domains | Pos ratio: {test_df['label'].mean():.3f}")

    # 3. Canonicalize URL text & extract TF-IDF
    print("[INFO] Canonicalizing URL text & fitting TF-IDF...")
    X_train_text = [canonicalize_for_ml(u) for u in train_df['url']]
    X_test_text = [canonicalize_for_ml(u) for u in test_df['url']]
    y_train = train_df['label'].values
    y_test = test_df['label'].values

    tfidf = TfidfVectorizer(
        analyzer='char_wb',
        ngram_range=(3, 5),
        max_features=40000,
        sublinear_tf=True
    )
    X_train_tfidf = tfidf.fit_transform(X_train_text)
    X_test_tfidf = tfidf.transform(X_test_text)

    # 4. Extract Tabular Structural Features
    print("[INFO] Extracting 21 domain-aware and structural features...")
    X_train_feat = extract_batch_features(train_df['url'])
    X_test_feat = extract_batch_features(test_df['url'])

    scaler = StandardScaler()
    X_train_feat_s = scaler.fit_transform(X_train_feat)
    X_test_feat_s = scaler.transform(X_test_feat)

    # Combine text and structural features (weighting structural features)
    X_train_comb = hstack([X_train_tfidf, csr_matrix(X_train_feat_s * 2.0)]).tocsr()
    X_test_comb = hstack([X_test_tfidf, csr_matrix(X_test_feat_s * 2.0)]).tocsr()

    # 5. Fit Logistic Regression Classifier
    print("[INFO] Fitting regularized Logistic Regression classifier...")
    clf = LogisticRegression(C=1.0, max_iter=400, random_state=42, solver='lbfgs')
    clf.fit(X_train_comb, y_train)

    # 6. Evaluate on Locked Test Set
    print("\n" + "="*80)
    print("EVALUATION ON LOCKED DOMAIN-DISJOINT TEST SET (ZERO-LEAKAGE)")
    print("="*80)
    probs_test = clf.predict_proba(X_test_comb)[:, 1]
    preds_test = (probs_test >= 0.5).astype(int)

    acc = accuracy_score(y_test, preds_test)
    prec = precision_score(y_test, preds_test)
    rec = recall_score(y_test, preds_test)
    f1 = f1_score(y_test, preds_test)
    f2 = fbeta_score(y_test, preds_test, beta=2)
    auc = roc_auc_score(y_test, probs_test)
    pr_auc = average_precision_score(y_test, probs_test)
    cm = confusion_matrix(y_test, preds_test)
    tn, fp, fn, tp = cm.ravel()
    fpr = fp / (fp + tn)
    fnr = fn / (fn + tp)

    print(f"Accuracy               : {acc:.4f} ({acc*100:.2f}%)")
    print(f"Precision              : {prec:.4f}")
    print(f"Recall (Sensitivity)   : {rec:.4f}")
    print(f"F1 Score               : {f1:.4f}")
    print(f"F2 Score               : {f2:.4f}")
    print(f"ROC-AUC                : {auc:.4f}")
    print(f"PR-AUC                 : {pr_auc:.4f}")
    print(f"False Positive Rate    : {fpr:.4f} ({fpr*100:.2f}%)")
    print(f"False Negative Rate    : {fnr:.4f} ({fnr*100:.2f}%)")
    print(f"Confusion Matrix       :\n  TN={tn:5d}  FP={fp:5d}\n  FN={fn:5d}  TP={tp:5d}")

    # 7. Evaluate on Curated Benchmark Suite
    from evaluation_suite import CURATED_EVAL_SUITE
    curated_urls = [c[0] for c in CURATED_EVAL_SUITE]
    curated_labels = np.array([c[1] for c in CURATED_EVAL_SUITE])
    X_cur_text = [canonicalize_for_ml(u) for u in curated_urls]
    X_cur_tfidf = tfidf.transform(X_cur_text)
    X_cur_feat = extract_batch_features(curated_urls)
    X_cur_feat_s = scaler.transform(X_cur_feat)
    X_cur_comb = hstack([X_cur_tfidf, csr_matrix(X_cur_feat_s * 2.0)]).tocsr()

    probs_cur = clf.predict_proba(X_cur_comb)[:, 1]
    preds_cur = (probs_cur >= 0.5).astype(int)
    cm_cur = confusion_matrix(curated_labels, preds_cur)
    tn_c, fp_c, fn_c, tp_c = cm_cur.ravel()
    print("\n" + "="*80)
    print("EVALUATION ON CURATED BENCHMARK SUITE")
    print("="*80)
    print(f"Curated Accuracy       : {accuracy_score(curated_labels, preds_cur):.4f}")
    print(f"Curated FPR            : {fp_c / (fp_c + tn_c):.4f} ({fp_c}/{tn_c + fp_c} false positives)")
    print(f"Curated Recall         : {tp_c / (tp_c + fn_c):.4f} ({tp_c}/{tp_c + fn_c} detections)")

    # 8. Save Versioned Artifacts
    os.makedirs(ARTIFACTS_V2_DIR, exist_ok=True)
    with open(os.path.join(ARTIFACTS_V2_DIR, "model_v2.pkl"), "wb") as f:
        pickle.dump(clf, f)
    with open(os.path.join(ARTIFACTS_V2_DIR, "tfidf_v2.pkl"), "wb") as f:
        pickle.dump(tfidf, f)
    with open(os.path.join(ARTIFACTS_V2_DIR, "scaler_v2.pkl"), "wb") as f:
        pickle.dump(scaler, f)

    print(f"\n[SUCCESS] Versioned artifacts saved to: {ARTIFACTS_V2_DIR}")

if __name__ == "__main__":
    train_production_model()