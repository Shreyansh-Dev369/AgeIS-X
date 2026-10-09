// Deterministic URL Structural, Syntactic, and Unicode Homoglyph Analyzer

export interface StructuralAnalysisResult {
  scheme: string
  hostname: string
  isHttps: boolean
  isIpLiteral: boolean
  isKnownBenign: boolean
  hasUserinfo: boolean
  hasHomoglyphs: boolean
  homoglyphDetails: string[]
  isPunycode: boolean
  punycodeDecoded: string | null
  isTyposquatPattern: boolean
  subdomainDepth: number
  tld: string
  isSuspiciousTld: boolean
  brandImpersonation: string | null
  suspiciousKeywords: string[]
  entropy: number
  hasPercentEncoding: boolean
  hasNonStandardPort: boolean
  structuralRiskPoints: number
  evidence: string[]
}

const TARGETED_BRANDS = [
  "google", "paypal", "microsoft", "apple", "amazon", "netflix",
  "chase", "wellsfargo", "bankofamerica", "citi", "facebook", "instagram",
  "binance", "coinbase", "metamask", "telegram", "whatsapp", "discord"
]

const BRAND_DOMAINS: Record<string, string[]> = {
  google: ["google.com", "youtube.com"],
  paypal: ["paypal.com"],
  microsoft: ["microsoft.com", "live.com", "microsoftonline.com", "office.com"],
  apple: ["apple.com", "icloud.com"],
  amazon: ["amazon.com", "aws.amazon.com"],
  netflix: ["netflix.com"],
  chase: ["chase.com"],
  wellsfargo: ["wellsfargo.com"],
  bankofamerica: ["bankofamerica.com"],
  citi: ["citi.com", "citigroup.com"],
  facebook: ["facebook.com", "fb.com"],
  instagram: ["instagram.com"],
  binance: ["binance.com"],
  coinbase: ["coinbase.com"],
  metamask: ["metamask.io"],
  telegram: ["telegram.org", "t.me"],
  whatsapp: ["whatsapp.com"],
  discord: ["discord.com", "discord.gg"],
  github: ["github.com"],
  stripe: ["stripe.com"],
  cloudflare: ["cloudflare.com"],
  yahoo: ["yahoo.com"],
  auth0: ["auth0.com"],
  wikipedia: ["wikipedia.org"],
  linkedin: ["linkedin.com"],
}

const KNOWN_BENIGN_APEX = new Set([
  "google.com", "www.google.com", "accounts.google.com", "github.com",
  "microsoft.com", "apple.com", "paypal.com", "amazon.com",
  "netflix.com", "chase.com", "wikipedia.org", "example.com",
  "cloudflare.com", "stripe.com", "mit.edu", "nih.gov", "python.org",
  "stackoverflow.com", "cnn.com", "nytimes.com", "bbc.com", "yahoo.com"
])

const SUSPICIOUS_TLDS = new Set([
  "xyz", "top", "tk", "ml", "ga", "cf", "gq", "buzz", "work",
  "icu", "loan", "click", "fit", "surf", "rest", "cam", "bid", "pw"
])

const SUSPICIOUS_KEYWORDS = [
  "verify", "update", "login", "signin", "banking", "secure", "token",
  "wallet", "airdrop", "claim", "credential", "auth", "account",
  "recover", "validate", "suspended", "confirm", "security", "passcode"
]

const CYRILLIC_LOOKALIKES: Record<string, string> = {
  "\u0430": "a", "\u0441": "c", "\u0435": "e", "\u043e": "o",
  "\u0440": "p", "\u0455": "s", "\u0445": "x", "\u0443": "y",
  "\u0456": "i", "\u0458": "j", "\u044c": "b", "\u04a1": "k",
  "\u04bb": "h", "\u0410": "A", "\u0412": "B", "\u0421": "C",
  "\u0415": "E", "\u041d": "H", "\u0406": "I", "\u0408": "J",
  "\u041a": "K", "\u041c": "M", "\u041e": "O", "\u0420": "P",
  "\u0422": "T", "\u0425": "X"
}

export function calculateEntropy(text: string): number {
  if (!text) return 0
  const len = text.length
  const freq: Record<string, number> = {}
  for (let i = 0; i < len; i++) {
    const c = text[i]
    freq[c] = (freq[c] || 0) + 1
  }
  let entropy = 0
  for (const c in freq) {
    const p = freq[c] / len
    entropy -= p * Math.log2(p)
  }
  return Math.round(entropy * 1000) / 1000
}

export function analyzeUrlStructure(rawUrl: string): StructuralAnalysisResult {
  const trimmed = (rawUrl || "").trim()
  const evidence: string[] = []
  let structuralRiskPoints = 0

  let urlToParse = trimmed
  if (!/^[a-zA-Z][a-zA-Z0-9+-.]*:\/\//.test(trimmed)) {
    urlToParse = "http://" + trimmed
  }

  let parsed: URL | null = null
  let scheme = "http"
  let hostname = ""
  let port = ""

  try {
    parsed = new URL(urlToParse)
    scheme = parsed.protocol.replace(":", "").toLowerCase()
    hostname = parsed.hostname.toLowerCase().replace(/\.+$/, "")
    port = parsed.port
  } catch {
    hostname = trimmed.split("/")[0].split(":")[0].toLowerCase().replace(/\.+$/, "")
  }

  // Check for userinfo credential injection (@)
  const hasUserinfo = trimmed.includes("@")
  if (hasUserinfo) {
    evidence.push("Userinfo credential trick detected (contains '@' destination override)")
    structuralRiskPoints += 45
  }

  // IP literal detection (IPv4, IPv6, integer/hex)
  const isIpv4 = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(hostname)
  const isIpv6 = hostname.startsWith("[") || (hostname.includes(":") && !hostname.includes("."))
  const isIntHexIp = /^(?:0x[0-9a-f]+|\d+)$/i.test(hostname)
  const isIpLiteral = isIpv4 || isIpv6 || isIntHexIp
  if (isIpLiteral) {
    evidence.push(`Direct IP address host literal used (${hostname}) instead of registered domain`)
    structuralRiskPoints += 30
  }

  // Non-standard port check
  let hasNonStandardPort = false
  if (port) {
    const portNum = parseInt(port, 10)
    if (portNum !== 80 && portNum !== 443 && portNum !== 8080 && portNum !== 8443) {
      evidence.push(`Unusual destination port (${portNum})`)
      structuralRiskPoints += 15
      hasNonStandardPort = true
    }
  }

  // Unicode / Homoglyph / Punycode check
  let hasHomoglyphs = false
  const matchedHomoglyphs: string[] = []
  const isPunycode = hostname.includes("xn--")

  for (let i = 0; i < trimmed.length; i++) {
    const char = trimmed[i]
    if (CYRILLIC_LOOKALIKES[char]) {
      hasHomoglyphs = true
      matchedHomoglyphs.push(`'${char}' (U+${char.charCodeAt(0).toString(16).toUpperCase().padStart(4, "0")} confusable with Latin '${CYRILLIC_LOOKALIKES[char]}')`)
    }
  }

  if (hasHomoglyphs) {
    const unique = Array.from(new Set(matchedHomoglyphs)).slice(0, 3)
    evidence.push(`Cyrillic lookalike homoglyph characters detected: ${unique.join(", ")}`)
    structuralRiskPoints += 50
  }

  if (isPunycode) {
    evidence.push(`Internationalized Domain Name (Punycode): ${hostname}`)
    structuralRiskPoints += 20
  }

  // Typosquatting missing delimiter (wwwgoogle.com)
  let isTyposquatPattern = false
  if (hostname.startsWith("www") && hostname.length > 3 && hostname[3] !== ".") {
    isTyposquatPattern = true
    evidence.push(`Typosquatting pattern: missing dot delimiter after 'www' (${hostname})`)
    structuralRiskPoints += 40
  }

  // Subdomain nesting analysis
  const parts = hostname.split(".").filter(Boolean)
  const subdomainDepth = Math.max(0, parts.length - 2)
  if (subdomainDepth >= 3) {
    evidence.push(`Excessive subdomain nesting depth (${subdomainDepth} levels)`)
    structuralRiskPoints += 15
  }

  // TLD Analysis
  const tld = parts.length > 1 ? parts[parts.length - 1] : ""
  const isSuspiciousTld = SUSPICIOUS_TLDS.has(tld)
  if (isSuspiciousTld) {
    evidence.push(`High-risk top-level domain (.${tld})`)
    structuralRiskPoints += 15
  }

  // Brand Impersonation vs Authentic Brand
  let brandImpersonationFound: string | null = null
  let isAuthenticBrand = false

  for (const brand of TARGETED_BRANDS) {
    if (hostname.includes(brand) || trimmed.toLowerCase().includes(brand)) {
      const authDoms = BRAND_DOMAINS[brand] || []
      const isAuth = authDoms.some((d) => hostname === d || hostname.endsWith("." + d))
      if (isAuth) {
        isAuthenticBrand = true
      } else {
        brandImpersonationFound = brand
        evidence.push(`Brand keyword '${brand}' embedded in domain or path of untrusted root (${hostname})`)
        structuralRiskPoints += 45
      }
      break
    }
  }

  // Keyword Matching
  const lower = trimmed.toLowerCase()
  const foundKeywords = SUSPICIOUS_KEYWORDS.filter((kw) => lower.includes(kw))
  if (foundKeywords.length > 0) {
    evidence.push(`Suspicious security/phishing keywords present: ${foundKeywords.slice(0, 3).join(", ")}`)
    structuralRiskPoints += Math.min(20, foundKeywords.length * 8)
  }

  // Entropy Calculation
  const entropy = calculateEntropy(trimmed)
  if (entropy > 4.5) {
    evidence.push(`High character entropy (${entropy}), suggesting obfuscated/random tokens`)
    structuralRiskPoints += 10
  }

  // Percent-encoding check
  const hasPercentEncoding = trimmed.includes("%")
  if (hasPercentEncoding) {
    try {
      if (decodeURIComponent(trimmed) !== trimmed) {
        evidence.push("URL contains percent-encoded character sequences")
        structuralRiskPoints += 5
      }
    } catch {
      evidence.push("URL contains malformed percent-encoding")
      structuralRiskPoints += 10
    }
  }

  // Known Benign Apex Match
  let isKnownBenign = false
  if ((KNOWN_BENIGN_APEX.has(hostname) || isAuthenticBrand) && !hasHomoglyphs && !isTyposquatPattern && !hasUserinfo && !brandImpersonationFound) {
    isKnownBenign = true
    evidence.length = 0
    evidence.push("Domain matches known verified authentic organization repository.")
    structuralRiskPoints = 0
  }

  return {
    scheme,
    hostname,
    isHttps: scheme === "https",
    isIpLiteral,
    isKnownBenign,
    hasUserinfo,
    hasHomoglyphs,
    homoglyphDetails: matchedHomoglyphs.slice(0, 5),
    isPunycode,
    punycodeDecoded: null,
    isTyposquatPattern,
    subdomainDepth,
    tld,
    isSuspiciousTld,
    brandImpersonation: brandImpersonationFound,
    suspiciousKeywords: foundKeywords,
    entropy,
    hasPercentEncoding,
    hasNonStandardPort,
    structuralRiskPoints,
    evidence
  }
}
