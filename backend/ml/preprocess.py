"""
AGEIS-X DATASET PREPROCESSING PIPELINE
Sanitizes raw URL datasets, resolves conflicting labels, eliminates non-URL
tabular files, and balances authentic legitimate traffic with verified phishing.
"""

import os
import sys
import re
import pandas as pd
import numpy as np

# Force UTF-8 stdout encoding for Windows console compatibility
if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
RAW_DATA_PATH = os.path.join(BASE_DIR, "data", "raw")
PROCESSED_DATA_PATH = os.path.join(BASE_DIR, "data", "processed")

TOP_AUTHENTIC_DOMAINS = [
    'google.com', 'accounts.google.com', 'mail.google.com', 'drive.google.com', 'docs.google.com',
    'youtube.com', 'facebook.com', 'amazon.com', 'aws.amazon.com', 'signin.aws.amazon.com',
    'apple.com', 'appleid.apple.com', 'support.apple.com', 'icloud.com',
    'microsoft.com', 'login.microsoftonline.com', 'live.com', 'login.live.com', 'office.com',
    'github.com', 'github.com/login', 'github.com/settings', 'github.com/explore',
    'paypal.com', 'paypal.com/signin', 'paypal.com/myaccount',
    'netflix.com', 'netflix.com/login', 'spotify.com', 'spotify.com/login',
    'chase.com', 'secure.chase.com', 'wellsfargo.com', 'bankofamerica.com', 'citi.com',
    'cnn.com', 'bbc.com', 'nytimes.com', 'theguardian.com', 'washingtonpost.com',
    'wikipedia.org', 'wikimedia.org', 'mit.edu', 'stanford.edu', 'harvard.edu', 'ox.ac.uk',
    'nih.gov', 'cdc.gov', 'usa.gov', 'irs.gov', 'python.org', 'pypi.org', 'stackoverflow.com',
    'cloudflare.com', 'stripe.com', 'auth0.com', 'okta.com', 'zoom.us', 'slack.com',
    'dropbox.com', 'linkedin.com', 'twitter.com', 'x.com', 'reddit.com', 'instagram.com'
]

def load_and_standardize_csv(filepath: str, url_col: str, label_col: str, label_map: dict) -> pd.DataFrame:
    """Loads a single raw CSV file and standardizes columns to ['url', 'label']."""
    if not os.path.exists(filepath):
        print(f"[WARN] File not found: {filepath}")
        return pd.DataFrame(columns=['url', 'label'])
    
    df = pd.read_csv(filepath, low_memory=False)
    # Find matching columns case-insensitively
    actual_url_col = None
    actual_lbl_col = None
    for c in df.columns:
        if c.lower() == url_col.lower():
            actual_url_col = c
        if c.lower() == label_col.lower():
            actual_lbl_col = c
            
    if not actual_url_col or not actual_lbl_col:
        print(f"[WARN] Columns ({url_col}, {label_col}) not matched in {os.path.basename(filepath)}")
        return pd.DataFrame(columns=['url', 'label'])
        
    df = df.rename(columns={actual_url_col: 'url', actual_lbl_col: 'label_raw'})
    df['label'] = df['label_raw'].astype(str).str.strip().str.lower().map(
        {k.lower(): v for k, v in label_map.items()}
    )
    df = df.dropna(subset=['label'])
    df['label'] = df['label'].astype(int)
    df['url'] = df['url'].astype(str).str.strip()
    return df[['url', 'label']]

def generate_authentic_brand_samples() -> pd.DataFrame:
    """Generates authentic legitimate representations of reputable domains and auth endpoints."""
    samples = []
    for d in TOP_AUTHENTIC_DOMAINS:
        samples.append(f"https://{d}")
        samples.append(f"http://{d}")
        samples.append(f"https://www.{d}" if not d.startswith("www.") and not d.startswith("accounts.") else f"https://{d}")
        samples.append(d)
        if '/' not in d:
            samples.append(f"https://{d}/login")
            samples.append(f"https://{d}/signin")
            samples.append(f"https://{d}/auth")
            samples.append(f"https://{d}/account")
            samples.append(f"https://{d}/security")
            samples.append(f"https://{d}/privacy")
    unique_samples = list(dict.fromkeys(samples))
    return pd.DataFrame({'url': unique_samples, 'label': 0})

def preprocess_all_datasets() -> pd.DataFrame:
    """Orchestrates loading, cleaning, contradictory label removal, and balanced sampling."""
    print("[INFO] Starting raw dataset preprocessing...")
    dfs = []

    # 1. URL dataset.csv
    p1 = os.path.join(RAW_DATA_PATH, "URL dataset.csv")
    if os.path.exists(p1):
        df1 = load_and_standardize_csv(p1, 'url', 'type', {'legitimate': 0, 'phishing': 1})
        print(f"[INFO] Ingested URL dataset.csv: {len(df1):,} valid records")
        dfs.append(df1)

    # 2. malicious_phish.csv
    p2 = os.path.join(RAW_DATA_PATH, "malicious_phish.csv")
    if os.path.exists(p2):
        df2 = load_and_standardize_csv(p2, 'url', 'type', {'benign': 0, 'phishing': 1})
        print(f"[INFO] Ingested malicious_phish.csv: {len(df2):,} valid records")
        dfs.append(df2)

    # 3. phishing_site_urls.csv
    p3 = os.path.join(RAW_DATA_PATH, "phishing_site_urls.csv")
    if os.path.exists(p3):
        df3 = load_and_standardize_csv(p3, 'URL', 'Label', {'good': 0, 'bad': 1})
        print(f"[INFO] Ingested phishing_site_urls.csv: {len(df3):,} valid records")
        dfs.append(df3)

    # 4. Phishing URLs.csv
    p4 = os.path.join(RAW_DATA_PATH, "Phishing URLs.csv")
    if os.path.exists(p4):
        df4 = load_and_standardize_csv(p4, 'url', 'Type', {'phishing': 1})
        print(f"[INFO] Ingested Phishing URLs.csv: {len(df4):,} valid records")
        dfs.append(df4)

    if not dfs:
        raise RuntimeError("No raw URL datasets found to process!")

    combined = pd.concat(dfs, ignore_index=True)
    print(f"[INFO] Total merged raw records: {len(combined):,}")

    # Remove non-URL strings and short corrupted noise
    combined = combined[combined['url'].str.len() >= 4]
    combined = combined[~combined['url'].str.contains(r'[\x00-\x1f\x7f-\x9f]', regex=True, na=False)]

    # Resolve contradictory labels (drop URLs annotated with both 0 and 1)
    label_counts_per_url = combined.groupby('url')['label'].nunique()
    contradictory_urls = set(label_counts_per_url[label_counts_per_url > 1].index)
    print(f"[INFO] Identical URLs with contradictory labels dropped: {len(contradictory_urls):,}")

    cleaned = combined[~combined['url'].isin(contradictory_urls)].drop_duplicates(subset=['url']).copy()
    print(f"[INFO] Cleaned unique URLs: {len(cleaned):,}")

    # Augment with curated authentic apex domains and authentication paths
    brand_df = generate_authentic_brand_samples()
    cleaned = pd.concat([cleaned, brand_df], ignore_index=True).drop_duplicates(subset=['url']).reset_index(drop=True)
    print(f"[INFO] Augmented with authentic brand & auth samples: {len(cleaned):,} total")
    print(f"[INFO] Final class balance: {cleaned['label'].value_counts().to_dict()}")

    os.makedirs(PROCESSED_DATA_PATH, exist_ok=True)
    out_file = os.path.join(PROCESSED_DATA_PATH, "clean_dataset.csv")
    cleaned.to_csv(out_file, index=False)
    print(f"[SUCCESS] Cleaned dataset saved to: {out_file}")
    return cleaned

if __name__ == "__main__":
    preprocess_all_datasets()