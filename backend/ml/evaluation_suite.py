"""
AGEIS-X EVALUATION SUITE
Comprehensive, reproducible benchmark suite for phishing and legitimate URL classification.
Categorized with verifiable ground truth.
"""

from typing import List, Tuple, Dict, Any

# Structure: (url, ground_truth_label [0=legitimate, 1=phishing], category, description)
CURATED_EVAL_SUITE: List[Tuple[str, int, str, str]] = [
    # --- 1. LEGITIMATE APEX DOMAINS (ALEXA / TRANCO TOP DOMAINS) ---
    ('https://google.com', 0, 'Legit Apex', 'Google search apex domain'),
    ('https://www.google.com', 0, 'Legit Apex', 'Google www apex domain'),
    ('https://apple.com', 0, 'Legit Apex', 'Apple root apex domain'),
    ('https://microsoft.com', 0, 'Legit Apex', 'Microsoft corporate apex domain'),
    ('https://amazon.com', 0, 'Legit Apex', 'Amazon retail apex domain'),
    ('https://paypal.com', 0, 'Legit Apex', 'PayPal payment platform root apex domain'),
    ('https://github.com', 0, 'Legit Apex', 'GitHub developer portal apex domain'),
    ('https://netflix.com', 0, 'Legit Apex', 'Netflix streaming service apex domain'),
    ('https://wikipedia.org', 0, 'Legit Apex', 'Wikipedia foundation root apex domain'),
    ('https://cnn.com', 0, 'Legit Apex', 'CNN global news apex domain'),
    ('https://nytimes.com', 0, 'Legit Apex', 'The New York Times apex domain'),
    ('https://bbc.com', 0, 'Legit Apex', 'BBC international broadcast apex domain'),
    ('https://cloudflare.com', 0, 'Legit Apex', 'Cloudflare network security apex domain'),
    ('https://mit.edu', 0, 'Legit Apex', 'MIT university educational apex domain'),
    ('https://nih.gov', 0, 'Legit Apex', 'NIH government agency apex domain'),
    ('https://python.org', 0, 'Legit Apex', 'Python Software Foundation apex domain'),
    ('https://stackoverflow.com', 0, 'Legit Apex', 'Stack Overflow developer community apex domain'),
    ('https://linkedin.com', 0, 'Legit Apex', 'LinkedIn professional network apex domain'),
    ('https://chase.com', 0, 'Legit Apex', 'JPMorgan Chase banking portal apex domain'),
    ('https://wellsfargo.com', 0, 'Legit Apex', 'Wells Fargo banking portal apex domain'),
    ('https://bankofamerica.com', 0, 'Legit Apex', 'Bank of America root apex domain'),
    ('https://stripe.com', 0, 'Legit Apex', 'Stripe payments infrastructure apex domain'),

    # --- 2. LEGITIMATE AUTHENTICATION & LOGIN PORTALS (CONTAINING SENSITIVE KEYWORDS) ---
    ('https://accounts.google.com/signin/v2/identifier', 0, 'Legit Auth', 'Google account SSO authentication endpoint'),
    ('https://github.com/login', 0, 'Legit Auth', 'GitHub user session login page'),
    ('https://www.paypal.com/signin', 0, 'Legit Auth', 'PayPal customer signin verification page'),
    ('https://login.microsoftonline.com/common/oauth2/authorize', 0, 'Legit Auth', 'Microsoft Entra ID OAuth2 login portal'),
    ('https://appleid.apple.com/auth/authorize', 0, 'Legit Auth', 'Apple ID federated authorization portal'),
    ('https://secure.chase.com/auth/login', 0, 'Legit Auth', 'Chase online banking customer login'),
    ('https://login.yahoo.com/account/create', 0, 'Legit Auth', 'Yahoo account registration page'),
    ('https://auth0.com/auth/login', 0, 'Legit Auth', 'Auth0 universal login portal'),
    ('https://checkout.stripe.com/pay/cs_live_12345', 0, 'Legit Auth', 'Stripe hosted payment session'),
    ('https://signin.aws.amazon.com/oauth', 0, 'Legit Auth', 'AWS management console authentication'),

    # --- 3. LEGITIMATE DEEP PATHS & TECHNICAL SITES ---
    ('https://en.wikipedia.org/wiki/Phishing_detection_methods', 0, 'Legit Deep Path', 'Wikipedia educational article on security'),
    ('https://github.com/torvalds/linux/blob/master/MAINTAINERS', 0, 'Legit Deep Path', 'GitHub source code deep file path'),
    ('https://docs.python.org/3/library/urllib.parse.html', 0, 'Legit Deep Path', 'Python official documentation page'),
    ('https://support.apple.com/en-us/HT201232', 0, 'Legit Deep Path', 'Apple customer support knowledge base article'),
    ('https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy', 0, 'Legit Deep Path', 'MDN security documentation'),
    ('https://stackoverflow.com/questions/1234567/how-to-parse-urls-in-python', 0, 'Legit Deep Path', 'Stack Overflow Q&A page'),
    ('https://arxiv.org/abs/2103.01234', 0, 'Legit Deep Path', 'Academic research pre-print repository page'),
    ('https://www.nature.com/articles/s41586-021-03819-2', 0, 'Legit Deep Path', 'Nature journal scientific paper URL'),

    # --- 4. PHISHING: BRAND IMPERSONATION IN SECONDARY DOMAIN ---
    ('http://paypal-verification-portal.com/login', 1, 'Brand Impersonation', 'Fake PayPal verification portal'),
    ('http://appleid-support-alert.com/signin', 1, 'Brand Impersonation', 'Fake Apple ID security alert page'),
    ('http://netflix-billing-update.info/auth', 1, 'Brand Impersonation', 'Fake Netflix billing renewal harvesting site'),
    ('http://chase-bank-verify-account.com/signin.php', 1, 'Brand Impersonation', 'Fake Chase account verification credential harvester'),
    ('http://wellsfargo-security-alert.com/banking/login', 1, 'Brand Impersonation', 'Fake Wells Fargo security warning phish'),
    ('http://microsoft-password-reset.live-security.online/auth', 1, 'Brand Impersonation', 'Fake Microsoft 365 credential phish'),
    ('http://amazon-account-verification.prime-member.site/update', 1, 'Brand Impersonation', 'Fake Amazon Prime membership verification phish'),
    ('http://binance-kyc-verify.crypto-support.info/claim', 1, 'Brand Impersonation', 'Fake Binance cryptocurrency KYC theft page'),
    ('http://dhl-package-tracking.parcel-delivery.top/verify', 1, 'Brand Impersonation', 'Fake DHL delivery notification harvesting page'),
    ('http://fedex-redelivery.invoice-tracking.click/confirm', 1, 'Brand Impersonation', 'Fake FedEx invoice confirmation scam page'),

    # --- 5. PHISHING: SUBDOMAIN DECEPTION ---
    ('http://paypal.com.security-verify.net/account', 1, 'Subdomain Deception', 'Brand PayPal in subdomain of attacker domain security-verify.net'),
    ('http://google.com.user-auth-check.org/login', 1, 'Subdomain Deception', 'Brand Google in subdomain of user-auth-check.org'),
    ('http://chase.com.banking-alert.com/signin', 1, 'Subdomain Deception', 'Brand Chase in subdomain of banking-alert.com'),
    ('http://appleid.apple.com.verify-info.net/login', 1, 'Subdomain Deception', 'Apple ID spoofing via secondary registered root'),
    ('http://login.facebook.com.profile-security-center.com', 1, 'Subdomain Deception', 'Facebook login mimicked on third-party root domain'),
    ('http://sites.google.com.user-auth-verify.com/login', 1, 'Subdomain Deception', 'Google Sites lookalike subdomain deception'),

    # --- 6. PHISHING: TYPOSQUATTING ---
    ('https://wwwgoogle.com/search', 1, 'Typosquatting', 'Missing dot typosquatting google.com'),
    ('http://wwwpaypal.com/auth', 1, 'Typosquatting', 'Missing dot typosquatting paypal.com'),
    ('http://paypa1-security-update.com/login', 1, 'Typosquatting', 'Character substitution: digit 1 instead of l in paypal'),
    ('http://rnicrosoft-online.com/auth', 1, 'Typosquatting', 'Letter combination: rn instead of m in microsoft'),
    ('http://app1e-security-check.com/login', 1, 'Typosquatting', 'Character substitution: digit 1 instead of l in apple'),

    # --- 7. PHISHING: UNICODE CONFUSABLE / HOMOGLYPHS ---
    ('https://paypаl-verify.secure-update.xyz/token', 1, 'Unicode Homoglyph', 'Cyrillic a (U+0430) spoofing PayPal'),
    ('http://gооgle.com/security', 1, 'Unicode Homoglyph', 'Cyrillic o (U+043E) spoofing Google'),
    ('http://applе-login.com/auth', 1, 'Unicode Homoglyph', 'Cyrillic e (U+0435) spoofing Apple'),

    # --- 8. PHISHING: IP LITERAL & NON-STANDARD PORT ---
    ('http://185.220.101.9:8080/payload.elf', 1, 'IP Literal', 'Direct IPv4 literal with high non-standard port'),
    ('http://91.240.118.52:8443/login.php', 1, 'IP Literal', 'Direct IPv4 literal hosting banking login harvester'),
    ('http://194.26.29.112:5000/auth/admin', 1, 'IP Literal', 'Direct IPv4 host with port 5000 admin endpoint'),

    # --- 9. PHISHING: USERINFO TRICKS ---
    ('https://google.com@attacker-portal.com/login', 1, 'Userinfo Trick', 'Destination override using @ userinfo credential prefix'),
    ('https://chase.com@phish-gateway.xyz/banking', 1, 'Userinfo Trick', 'Chase userinfo prefix routing to phish-gateway.xyz'),

    # --- 10. PHISHING: HIGH-RISK TLD & CRYPTO DRAINERS ---
    ('http://update-wallet-metamask.top/airdrop', 1, 'Crypto Phish', 'Metamask crypto seed drainer on .top TLD'),
    ('http://secure-banking-login.xyz/auth', 1, 'High-Risk TLD', 'Generic banking credential phish on .xyz TLD'),
    ('http://phantom-wallet-restore.icu/seed', 1, 'Crypto Phish', 'Solana Phantom wallet restore phishing scam'),
    ('http://telegram-airdrop.bot-claim.cf/start', 1, 'Crypto Phish', 'Telegram airdrop bot credential harvester'),
    ('http://instagram-copyright-infringement.appeal-form.tk/verify', 1, 'Social Media Phish', 'Instagram copyright appeal phishing form on .tk')
]
