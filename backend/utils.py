import math
import re
import unicodedata
from urllib.parse import urlparse, unquote

# High-profile brand names frequently targeted by phishing
TARGETED_BRANDS = [
    "google", "paypal", "microsoft", "apple", "amazon", "netflix",
    "chase", "wellsfargo", "bankofamerica", "citi", "facebook", "instagram",
    "binance", "coinbase", "metamask", "telegram", "whatsapp", "discord"
]

# Established authentic apex domains for reputable platforms
KNOWN_BENIGN_APEX = {
    "google.com", "www.google.com", "accounts.google.com", "github.com",
    "microsoft.com", "apple.com", "paypal.com", "amazon.com",
    "netflix.com", "chase.com", "wikipedia.org", "example.com"
}

# TLDs with disproportionately high malicious registration ratios
SUSPICIOUS_TLDS = {
    "xyz", "top", "tk", "ml", "ga", "cf", "gq", "buzz", "work",
    "icu", "loan", "click", "fit", "surf", "rest", "cam", "bid", "pw"
}

# Suspicious keywords in domain or path
SUSPICIOUS_KEYWORDS = [
    "verify", "update", "login", "signin", "banking", "secure", "token",
    "wallet", "airdrop", "claim", "credential", "auth", "account",
    "recover", "validate", "suspended", "confirm", "security", "passcode"
]

# Confusable / Homoglyph Cyrillic and Greek characters commonly used in IDN spoofing
CYRILLIC_LOOKALIKES = {
    '\u0430': 'a', '\u0441': 'c', '\u0435': 'e', '\u043e': 'o',
    '\u0440': 'p', '\u0455': 's', '\u0445': 'x', '\u0443': 'y',
    '\u0456': 'i', '\u0458': 'j', '\u044c': 'b', '\u04a1': 'k',
    '\u04bb': 'h', '\u0410': 'A', '\u0412': 'B', '\u0421': 'C',
    '\u0415': 'E', '\u041d': 'H', '\u0406': 'I', '\u0408': 'J',
    '\u041a': 'K', '\u041c': 'M', '\u041e': 'O', '\u0420': 'P',
    '\u0422': 'T', '\u0425': 'X'
}

def calculate_entropy(text: str) -> float:
    """Calculates Shannon entropy of a string."""
    if not text:
        return 0.0
    prob = [float(text.count(c)) / len(text) for c in dict.fromkeys(list(text))]
    entropy = -sum([p * math.log(p) / math.log(2.0) for p in prob if p > 0])
    return round(entropy, 3)

def parse_url_structure(raw_url: str) -> dict:
    """
    Performs deterministic lexical, syntactic, and Unicode structural analysis on a URL.
    Does NOT fabricate external telemetry.
    """
    raw_url = raw_url.strip()
    evidence = []
    structural_risk_points = 0

    # Ensure URL has scheme for accurate urlparse
    url_to_parse = raw_url
    if not re.match(r'^[a-zA-Z][a-zA-Z0-9+-.]*://', raw_url):
        url_to_parse = 'http://' + raw_url

    parsed = urlparse(url_to_parse)
    scheme = parsed.scheme.lower()
    netloc = parsed.netloc or parsed.path.split('/')[0]
    path = parsed.path
    query = parsed.query
    
    # Check for @ userinfo tricks (e.g., https://google.com@attacker.com)
    has_userinfo = '@' in netloc or '@' in raw_url.split('/')[0]
    if has_userinfo:
        evidence.append("Userinfo credential trick detected (contains '@' symbol redirecting destination)")
        structural_risk_points += 40

    # Extract hostname & port
    host_port = netloc.split('@')[-1]
    if host_port.startswith('[') and ']' in host_port:
        end_bracket = host_port.index(']')
        hostname = host_port[1:end_bracket]
        rest = host_port[end_bracket+1:]
        port_str = rest[1:] if rest.startswith(':') else ""
    elif ':' in host_port and host_port.count(':') == 1:
        parts = host_port.split(':')
        hostname = parts[0]
        port_str = parts[1]
    else:
        hostname = host_port
        port_str = ""

    hostname_clean = hostname.strip("[]").strip(".").lower()
    
    # Check for IP address literals (standard, decimal integer, hex, IPv6)
    is_ipv4 = bool(re.match(r'^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$', hostname_clean))
    is_ipv6 = bool(':' in hostname_clean)
    is_int_hex_ip = bool(hostname_clean.isdigit() or hostname_clean.startswith("0x"))
    is_ip_literal = is_ipv4 or is_ipv6 or is_int_hex_ip
    if is_ip_literal:
        evidence.append(f"Direct IP address host literal used ({hostname_clean}) instead of domain name")
        structural_risk_points += 30

    # Check for non-standard ports
    has_non_standard_port = False
    if port_str:
        try:
            port_num = int(port_str)
            if port_num not in (80, 443, 8080, 8443):
                evidence.append(f"Unusual destination port ({port_num})")
                structural_risk_points += 15
                has_non_standard_port = True
        except ValueError:
            pass

    # Unicode / Homoglyph / Punycode Analysis
    has_homoglyphs = False
    matched_homoglyphs = []
    punycode_decoded = ""
    is_punycode = "xn--" in hostname_clean

    # Detect Cyrillic/Greek lookalikes
    for char in raw_url:
        if char in CYRILLIC_LOOKALIKES:
            has_homoglyphs = True
            matched_homoglyphs.append(f"'{char}' (U+{ord(char):04X} confusable with Latin '{CYRILLIC_LOOKALIKES[char]}')")

    if is_punycode:
        try:
            punycode_decoded = hostname_clean.encode('ascii').decode('idna')
            evidence.append(f"Internationalized Domain Name (Punycode): decodes to '{punycode_decoded}'")
            structural_risk_points += 20
        except Exception:
            punycode_decoded = "Invalid IDNA"

    if has_homoglyphs:
        unique_matches = list(dict.fromkeys(matched_homoglyphs))[:3]
        evidence.append(f"Cyrillic lookalike homoglyph characters detected: {', '.join(unique_matches)}")
        structural_risk_points += 50

    # Missing delimiter / typosquatting (e.g. wwwgoogle.com)
    is_typosquat_pattern = False
    if hostname_clean.startswith("www") and len(hostname_clean) > 3 and hostname_clean[3] != '.':
        is_typosquat_pattern = True
        evidence.append(f"Typosquatting pattern: missing dot delimiter after 'www' ({hostname_clean})")
        structural_risk_points += 40

    # Subdomain depth & TLD analysis
    subdomain_parts = [p for p in hostname_clean.split('.') if p]
    subdomain_depth = max(0, len(subdomain_parts) - 2)
    if subdomain_depth >= 3:
        evidence.append(f"Excessive subdomain nesting depth ({subdomain_depth} levels)")
        structural_risk_points += 15

    # TLD Analysis
    tld = subdomain_parts[-1] if len(subdomain_parts) > 1 else ""
    is_suspicious_tld = tld in SUSPICIOUS_TLDS
    if is_suspicious_tld:
        evidence.append(f"High-risk top-level domain (.{tld})")
        structural_risk_points += 15

    # Brand Impersonation in subdomain/path
    brand_impersonation_found = None
    if len(subdomain_parts) > 2:
        for brand in TARGETED_BRANDS:
            if brand in hostname_clean and not hostname_clean.endswith(f"{brand}.{tld}") and not hostname_clean.endswith(f"{brand}.co.{tld}"):
                brand_impersonation_found = brand
                evidence.append(f"Brand keyword '{brand}' present in secondary domain/subdomain of untrusted root")
                structural_risk_points += 35
                break

    # Keyword Density
    found_keywords = [kw for kw in SUSPICIOUS_KEYWORDS if kw in raw_url.lower()]
    if found_keywords:
        evidence.append(f"Suspicious security/phishing keywords present: {', '.join(found_keywords[:3])}")
        structural_risk_points += min(20, len(found_keywords) * 8)

    # Shannon Entropy
    entropy = calculate_entropy(raw_url)
    if entropy > 4.5:
        evidence.append(f"High character entropy ({entropy}), suggesting obfuscated/random tokens")
        structural_risk_points += 10

    # URL Percent-Encoding Check
    has_percent_encoding = "%" in raw_url
    if has_percent_encoding:
        unquoted = unquote(raw_url)
        if unquoted != raw_url:
            evidence.append("URL contains percent-encoded characters")
            structural_risk_points += 5

    # Check for authentic known apex
    is_known_benign = False
    if hostname_clean in KNOWN_BENIGN_APEX and not has_homoglyphs and not is_typosquat_pattern and not has_userinfo:
        is_known_benign = True
        evidence = ["Domain matches known verified apex organization repository."]
        structural_risk_points = 0

    return {
        "scheme": scheme,
        "hostname": hostname_clean,
        "port": int(port_str) if port_str.isdigit() else (443 if scheme == "https" else 80),
        "is_https": scheme == "https",
        "is_ip_literal": is_ip_literal,
        "is_known_benign": is_known_benign,
        "has_userinfo": has_userinfo,
        "has_homoglyphs": has_homoglyphs,
        "homoglyph_details": matched_homoglyphs[:5],
        "is_punycode": is_punycode,
        "punycode_decoded": punycode_decoded if is_punycode else None,
        "is_typosquat_pattern": is_typosquat_pattern,
        "subdomain_depth": subdomain_depth,
        "tld": tld,
        "is_suspicious_tld": is_suspicious_tld,
        "brand_impersonation": brand_impersonation_found,
        "suspicious_keywords": found_keywords,
        "entropy": entropy,
        "has_percent_encoding": has_percent_encoding,
        "has_non_standard_port": has_non_standard_port,
        "structural_risk_points": structural_risk_points,
        "evidence": evidence
    }
