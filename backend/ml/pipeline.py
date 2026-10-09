"""
AGEIS-X ML INFERENCE PIPELINE (V2)
Unified, thread-safe feature extraction and probabilistic classification for phishing detection.
Integrates URL canonicalization, structural feature extraction, character n-gram TF-IDF,
authentic brand domain verification, and probability calibration.
"""

import os
import re
import math
import pickle
import threading
from typing import Dict, Any, Tuple, Optional
import numpy as np
from urllib.parse import urlparse
import tldextract
from scipy.sparse import hstack, csr_matrix

CYRILLIC_LOOKALIKES = {
    '\u0430': 'a', '\u0441': 'c', '\u0435': 'e', '\u043e': 'o',
    '\u0440': 'p', '\u0455': 's', '\u0445': 'x', '\u0443': 'y',
    '\u0456': 'i', '\u0458': 'j', '\u044c': 'b', '\u04a1': 'k',
    '\u04bb': 'h', '\u0410': 'A', '\u0412': 'B', '\u0421': 'C',
    '\u0415': 'E', '\u041d': 'H', '\u0406': 'I', '\u0408': 'J',
    '\u041a': 'K', '\u041c': 'M', '\u041e': 'O', '\u0420': 'P',
    '\u0422': 'T', '\u0425': 'X'
}

BRAND_DOMAINS = {
    'google': {'google.com', 'youtube.com'},
    'paypal': {'paypal.com'},
    'microsoft': {'microsoft.com', 'live.com', 'microsoftonline.com', 'office.com'},
    'apple': {'apple.com', 'icloud.com'},
    'amazon': {'amazon.com'},
    'netflix': {'netflix.com'},
    'chase': {'chase.com'},
    'wellsfargo': {'wellsfargo.com'},
    'bankofamerica': {'bankofamerica.com'},
    'citi': {'citi.com', 'citigroup.com'},
    'facebook': {'facebook.com', 'fb.com'},
    'instagram': {'instagram.com'},
    'binance': {'binance.com'},
    'coinbase': {'coinbase.com'},
    'metamask': {'metamask.io'},
    'telegram': {'telegram.org', 't.me'},
    'whatsapp': {'whatsapp.com'},
    'discord': {'discord.com', 'discord.gg'},
    'github': {'github.com'},
    'stripe': {'stripe.com'},
    'cloudflare': {'cloudflare.com'},
    'yahoo': {'yahoo.com'},
    'auth0': {'auth0.com'},
    'mozilla': {'mozilla.org'},
    'wikipedia': {'wikipedia.org'},
    'linkedin': {'linkedin.com'},
    'twitter': {'twitter.com', 'x.com'},
    'reddit': {'reddit.com'}
}

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
    """Calculates Shannon entropy of a string."""
    if not text:
        return 0.0
    prob = [float(text.count(c)) / len(text) for c in dict.fromkeys(list(text))]
    entropy = -sum([p * math.log2(p) for p in prob if p > 0])
    return round(entropy, 3)

def canonicalize_for_ml(raw_url: str) -> str:
    """
    Strips protocol scheme and www prefix so n-gram features evaluate true domain/path semantics
    without spurious scheme artifacts.
    """
    u = str(raw_url).strip().lower()
    u = re.sub(r'^[a-z0-9+.-]+://', '', u)
    u = re.sub(r'^//', '', u)
    if u.startswith('www.'):
        u = u[4:]
    return u.rstrip('/')

def extract_features_vector(raw_url: str) -> np.ndarray:
    """Extracts 23 deterministic domain-aware and structural numerical features."""
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
    reg_domain = f'{ext.domain}.{ext.suffix}'.lower() if (ext.domain and ext.suffix) else ext.domain.lower()
    tld = ext.suffix.lower() if ext.suffix else ''
    is_suspicious_tld = 1.0 if tld in SUSPICIOUS_TLDS else 0.0

    # Authentic Brand vs Impersonation
    is_authentic_brand = 0.0
    brand_impersonation = 0.0
    for brand, auth_doms in BRAND_DOMAINS.items():
        if brand in hostname_clean or brand in path.lower():
            if reg_domain in auth_doms:
                is_authentic_brand = 1.0
            else:
                brand_impersonation = 1.0
            break

    subdomain_parts = [p for p in ext.subdomain.split('.') if p]
    subdomain_depth = float(len(subdomain_parts))

    kw_count = float(sum(1 for kw in SUSPICIOUS_KEYWORDS if kw in raw_url.lower()))
    kw_on_untrusted = kw_count if is_authentic_brand == 0.0 else 0.0
    kw_on_trusted = kw_count if is_authentic_brand == 1.0 else 0.0

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
        is_suspicious_tld, brand_impersonation, is_authentic_brand,
        subdomain_depth, kw_on_untrusted, kw_on_trusted,
        entropy, has_https, has_percent_encoding
    ], dtype=np.float32)

class AgeisPhishingClassifier:
    """Thread-safe classifier pipeline for AgeIS-X phishing detection."""
    
    def __init__(self, artifact_dir: Optional[str] = None):
        self._lock = threading.Lock()
        self.is_loaded = False
        self.model = None
        self.tfidf = None
        self.scaler = None
        self.version = "2.0.0"
        self.architecture = "Hybrid TF-IDF (char_wb 3-5) + 23 Domain-Aware Structural Features + Calibrated Logistic Regression"
        
        if artifact_dir is None:
            base_dir = os.path.dirname(os.path.abspath(__file__))
            artifact_dir = os.path.join(base_dir, "artifacts_v2")
            
        self.artifact_dir = artifact_dir
        self.load_artifacts()

    def load_artifacts(self) -> bool:
        """Loads versioned model, TF-IDF vectorizer, and feature scaler."""
        with self._lock:
            m_path = os.path.join(self.artifact_dir, "model_v2.pkl")
            t_path = os.path.join(self.artifact_dir, "tfidf_v2.pkl")
            s_path = os.path.join(self.artifact_dir, "scaler_v2.pkl")

            if not (os.path.exists(m_path) and os.path.exists(t_path) and os.path.exists(s_path)):
                # Fallback check in parent directory
                parent_dir = os.path.dirname(self.artifact_dir)
                m_path = os.path.join(parent_dir, "model_v2.pkl")
                t_path = os.path.join(parent_dir, "tfidf_v2.pkl")
                s_path = os.path.join(parent_dir, "scaler_v2.pkl")

            if os.path.exists(m_path) and os.path.exists(t_path) and os.path.exists(s_path):
                try:
                    with open(m_path, "rb") as f:
                        self.model = pickle.load(f)
                    with open(t_path, "rb") as f:
                        self.tfidf = pickle.load(f)
                    with open(s_path, "rb") as f:
                        self.scaler = pickle.load(f)
                    self.is_loaded = True
                    print(f"[INFO] AgeIS-X ML Pipeline V2 loaded successfully from {self.artifact_dir}")
                    return True
                except Exception as e:
                    print(f"[ERROR] Failed loading ML artifacts: {e}")
                    self.is_loaded = False
                    return False
            else:
                print(f"[WARN] V2 ML artifacts not found in {self.artifact_dir}")
                self.is_loaded = False
                return False

    def predict(self, raw_url: str) -> Tuple[float, int, Dict[str, Any]]:
        """
        Predicts phishing probability and binary label for a raw URL.
        Returns (probability, label, metadata).
        """
        if not self.is_loaded or self.model is None:
            return 0.5, 0, {"status": "uninitialized"}

        try:
            canon_text = canonicalize_for_ml(raw_url)
            X_text = self.tfidf.transform([canon_text])
            
            raw_feat = extract_features_vector(raw_url).reshape(1, -1)
            X_feat = self.scaler.transform(raw_feat)
            
            # Combine text and scaled structural features (weighting structural features)
            X_comb = hstack([X_text, csr_matrix(X_feat * 3.0)]).tocsr()
            
            prob = float(self.model.predict_proba(X_comb)[0][1])
            label = 1 if prob >= 0.5 else 0
            
            return prob, label, {
                "status": "ok",
                "canonical_url": canon_text,
                "version": self.version
            }
        except Exception as e:
            print(f"[WARN] Inference exception: {e}")
            return 0.5, 0, {"status": "error", "message": str(e)}

# Module-level singleton
_classifier_instance: Optional[AgeisPhishingClassifier] = None

def get_classifier() -> AgeisPhishingClassifier:
    global _classifier_instance
    if _classifier_instance is None:
        _classifier_instance = AgeisPhishingClassifier()
    return _classifier_instance
