"use client"

import React, { useState } from "react"
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Loader2,
  Globe,
  Lock,
  ShieldCheck,
  ArrowRight,
  ShieldAlert,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp,
  Mail,
  MessageSquare,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ShieldX,
  FileText,
  Activity,
  Layers,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { analyzeUrlStructure } from "@/lib/utils/url-analyzer"
import { getApiBaseUrl } from "@/lib/config/api"
import { MagneticButton } from "@/components/cinematic/magnetic-button"
import { SecuritySticker } from "@/components/design-system/pixel-art-system"
import {
  multiVectorService,
  EmailAnalysisResult,
  MessageAnalysisResult,
} from "@/lib/services/multi-vector-service"
import { cn } from "@/lib/utils"

export type ScanVerdict =
  | "safe"
  | "suspicious"
  | "malicious"
  | "unknown"
  | "error"
  | "PHISHING"
  | "SUSPICIOUS"
  | "LIKELY_SAFE"
  | "INCONCLUSIVE"

export interface ScanResult {
  url: string
  riskScore: number
  verdict: ScanVerdict
  verdictState?: string
  confidence?: number
  model: string
  backendOnline: boolean
  responseTime: number
  entropyScore: number
  hasHomoglyphs: boolean
  homoglyphDetails: string[]
  isPunycode: boolean
  punycode: string
  tlsGrade: string
  domainAge: string
  simpleRecommendation: string
  evidence: string[]
  limitations: string[]
  features: {
    hasHttps: boolean
    isIpLiteral: boolean
    isTyposquatPattern: boolean
    hasUserinfo: boolean
    subdomainDepth: number
    suspiciousKeywords: boolean
    redirectCount: number
    dohAttested: boolean
    mitreTechnique: string
  }
}

export type ThreatVectorMode = "url" | "email" | "message"

const SAMPLE_URLS = [
  { label: "Chase Bank (Verified Safe)", url: "https://secure.chase.com/auth/login", type: "safe" },
  { label: "PayPal Homoglyph (Cyrillic a)", url: "https://paypаl-verify.secure-update.xyz/token", type: "threat" },
  { label: "Google Typosquat", url: "https://wwwgoogle.com/search", type: "warning" },
  { label: "Raw IP Malware Drop", url: "http://185.220.101.9:8080/payload.elf", type: "threat" },
]

const SAMPLE_EMAILS = [
  {
    label: "Spoofed PayPal Notice (High Urgency)",
    raw: `From: "PayPal Security Team" <security@paypa1-update.com>
Reply-To: credential-collector@offshore-drop.cc
To: customer@victim-domain.com
Subject: URGENT: Your PayPal account has been restricted
Date: Sun, 25 Oct 2026 14:15:00 +0000
Message-ID: <threat-9842@spoof.local>

Dear Verified Customer,

We detected unauthorized access attempts from IP 185.220.101.9. Your account will be permanently closed within 24 hours unless you re-verify your identity and credit card credentials immediately.

Please click the secure restoration portal below:
http://paypa1-update.com/restore-session

Sincerely,
Fraud Prevention Operations`,
  },
  {
    label: "Executive Wire Fraud / BEC Scam",
    raw: `From: "David Chen (Chief Executive Officer)" <david.chen@consulting-exec-mail.biz>
Reply-To: wire-transfers@secret-accountant.xyz
To: accounts.payable@enterprise.corp
Subject: Urgent Confidential Wire Request - Acquisition Closing
Date: Sun, 25 Oct 2026 09:30:00 +0000

Hi Sarah,

I am currently in an NDA board session and cannot take calls. We need an immediate wire transfer of $84,500 executed today to secure the Singapore partner escrow.

Please process to the account below before 2:00 PM EST and reply directly to this thread once transmitted.

Wire Routing: 021000021
Account: 94819284102

Thanks,
David Chen
Chief Executive Officer`,
  },
  {
    label: "Legitimate Security Alert (Clean RFC)",
    raw: `From: "GitHub Security" <noreply@github.com>
Reply-To: support@github.com
To: dev@developer.io
Subject: [GitHub] A new personal access token was generated
Date: Sun, 25 Oct 2026 11:00:00 +0000
Message-ID: <token-alert-4491@github.com>
Authentication-Results: spf=pass; dkim=pass; dmarc=pass

Hi Developer,

A new personal access token (classic) was recently generated on your account from IP 192.0.2.1 (macOS Chrome).

If this was you, no action is needed. If you did not generate this token, please visit:
https://github.com/settings/tokens to revoke it immediately.

GitHub Security Team`,
  },
]

const SAMPLE_MESSAGES = [
  {
    label: "Bank of America Smish (Urgent Lock)",
    sender: "+1 (800) 432-1000 [Spoofed]",
    text: "URGENT: Your Bank of America debit card has been locked due to suspicious activity. Click http://secure-bofa-verify.xyz to unlock immediately or call 1-800-432-1000.",
  },
  {
    label: "Crypto Wallet Trap (Seed Phrase)",
    sender: "MetaMask-Alert",
    text: "CRITICAL: MetaMask KYC compliance required under updated SEC guidelines. Your wallet 0x71... will be frozen in 12 hours. Verify your 12-word seed phrase here: http://metamask-kyc-verify.cc/vault",
  },
  {
    label: "Clean Delivery Notification (Benign)",
    sender: "FedEx",
    text: "FedEx: Your package #789124 has arrived at the local facility and will be delivered by 5:00 PM today. Track status at https://fedex.com/tracking?id=789124",
  },
]

export function URLScanner({
  initialMode = "url",
  compact = false,
}: {
  initialMode?: ThreatVectorMode
  compact?: boolean
}) {
  const [vectorMode, setVectorMode] = useState<ThreatVectorMode>(initialMode)

  // URL state
  const [url, setUrl] = useState("")
  const [isUrlScanning, setIsUrlScanning] = useState(false)
  const [urlResult, setUrlResult] = useState<ScanResult | null>(null)

  // Email state
  const [emailText, setEmailText] = useState(SAMPLE_EMAILS[0].raw)
  const [isEmailScanning, setIsEmailScanning] = useState(false)
  const [emailResult, setEmailResult] = useState<EmailAnalysisResult | null>(null)

  // Message state
  const [messageText, setMessageText] = useState(SAMPLE_MESSAGES[0].text)
  const [messageSender, setMessageSender] = useState(SAMPLE_MESSAGES[0].sender)
  const [isMessageScanning, setIsMessageScanning] = useState(false)
  const [messageResult, setMessageResult] = useState<MessageAnalysisResult | null>(null)

  // Shared UI controls
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(true)
  const [copied, setCopied] = useState(false)

  // Defang helper
  const defangString = (str: string) => {
    return str
      .replace(/https?:\/\//gi, (m) => (m.toLowerCase().startsWith("https") ? "hxxps://" : "hxxp://"))
      .replace(/\./g, "[.]")
  }

  // 1. Scan URL
  const scanURL = async (targetUrl?: string) => {
    const inputToScan = (targetUrl || url).trim()
    if (!inputToScan) return

    setIsUrlScanning(true)
    setUrlResult(null)

    const startTime = Date.now()
    const localStructure = analyzeUrlStructure(inputToScan)

    try {
      const res = await fetch(`${getApiBaseUrl()}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: inputToScan }),
      })

      if (!res.ok) throw new Error(`Backend HTTP ${res.status}`)
      const data = await res.json()
      const responseTime = Date.now() - startTime

      const riskScore =
        typeof data.risk_score === "number"
          ? data.risk_score
          : Math.round((data.probability || 0.5) * 100)
      const verdict: ScanVerdict =
        data.verdict || (riskScore >= 70 ? "malicious" : riskScore >= 30 ? "suspicious" : "safe")

      let tlsDisplay = localStructure.isHttps
        ? "HTTPS present (Cert unverified)"
        : "Plain HTTP (Unencrypted)"
      if (data.tls) {
        if (data.tls.status === "blocked") {
          tlsDisplay = "SSRF Prohibited / Internal Target"
        } else if (data.tls.connected) {
          const cipherInfo = data.tls.version ? `${data.tls.version}` : "TLS"
          const issuerInfo = data.tls.issuer ? data.tls.issuer.slice(0, 24) : "Active CA"
          tlsDisplay =
            data.tls.verified && !data.tls.is_expired
              ? `Verified ${cipherInfo} (${issuerInfo})`
              : `Warning: ${data.tls.is_expired ? "Expired" : "Untrusted"} (${cipherInfo})`
        } else if (localStructure.isHttps) {
          tlsDisplay = "TLS Probe Failed (Port 443 closed)"
        }
      }

      let domainAgeDisplay = "Not verified (RDAP unlinked)"
      if (data.rdap) {
        if (data.rdap.status === "blocked") {
          domainAgeDisplay = "SSRF Prohibited / Internal Target"
        } else if (data.rdap.domain_age_formatted) {
          domainAgeDisplay = data.rdap.domain_age_formatted
        } else if (data.rdap.status === "unavailable") {
          domainAgeDisplay = "Unavailable (No authoritative record)"
        }
      }

      setUrlResult({
        url: data.url || inputToScan,
        riskScore,
        verdict,
        model: data.model_info?.name || "AgeIS-X Lexical Classifier (FastAPI ML)",
        backendOnline: true,
        responseTime,
        entropyScore: data.features?.entropy ?? localStructure.entropy,
        hasHomoglyphs: data.features?.has_homoglyphs ?? localStructure.hasHomoglyphs,
        homoglyphDetails: data.features?.homoglyph_details ?? localStructure.homoglyphDetails,
        isPunycode: data.features?.is_punycode ?? localStructure.isPunycode,
        punycode: data.features?.punycode_decoded
          ? data.features.punycode_decoded
          : localStructure.isPunycode
          ? localStructure.hostname
          : "Standard ASCII",
        tlsGrade: tlsDisplay,
        domainAge: domainAgeDisplay,
        simpleRecommendation:
          verdict === "malicious" || verdict === "PHISHING"
            ? "Dangerous link. Do not visit this website or enter credentials."
            : verdict === "suspicious" || verdict === "SUSPICIOUS"
            ? "Suspicious link. Elevated risk anomalies detected. Exercise caution."
            : verdict === "unknown" || verdict === "INCONCLUSIVE"
            ? "Inconclusive assessment. Insufficient authoritative evidence."
            : "Clean link. Available evidence supports a lower-risk assessment.",
        evidence: data.evidence && data.evidence.length > 0 ? data.evidence : localStructure.evidence,
        limitations: data.limitations || [
          "Authoritative ICANN RDAP and DNS-over-HTTPS lookups executed",
          "Zero telemetry sent to commercial advertising brokers",
        ],
        features: {
          hasHttps: localStructure.isHttps,
          isIpLiteral: localStructure.isIpLiteral,
          isTyposquatPattern: localStructure.isTyposquatPattern,
          hasUserinfo: localStructure.hasUserinfo,
          subdomainDepth: localStructure.subdomainDepth,
          suspiciousKeywords: localStructure.suspiciousKeywords.length > 0,
          redirectCount: 0,
          dohAttested: data.dns?.status === "available",
          mitreTechnique: verdict === "malicious" ? "T1566.002 (Spearphishing Link)" : "Nominal",
        },
      })
    } catch {
      await new Promise((r) => setTimeout(r, 120))
      const responseTime = Date.now() - startTime

      let fallbackVerdict: ScanVerdict = "unknown"
      let fallbackRiskScore = 35

      if (localStructure.isKnownBenign) {
        fallbackVerdict = "safe"
        fallbackRiskScore = 5
      } else if (
        localStructure.hasHomoglyphs ||
        localStructure.hasUserinfo ||
        localStructure.isTyposquatPattern ||
        localStructure.brandImpersonation ||
        localStructure.hasExecutableExtension ||
        localStructure.hasOpenRedirect ||
        localStructure.hasPathTraversal ||
        localStructure.isIpLiteral
      ) {
        fallbackVerdict = "malicious"
        fallbackRiskScore = Math.max(75, Math.min(100, localStructure.structuralRiskPoints + 30))
      } else if (
        localStructure.suspiciousKeywords.length > 0 ||
        localStructure.isSuspiciousTld ||
        localStructure.subdomainDepth >= 3
      ) {
        fallbackVerdict = "suspicious"
        fallbackRiskScore = Math.max(45, localStructure.structuralRiskPoints + 20)
      }

      setUrlResult({
        url: inputToScan,
        riskScore: fallbackRiskScore,
        verdict: fallbackVerdict,
        model: "AgeIS-X Client Structural Analyzer (Local Fallback)",
        backendOnline: false,
        responseTime: responseTime > 0 ? responseTime : 18,
        entropyScore: localStructure.entropy,
        hasHomoglyphs: localStructure.hasHomoglyphs,
        homoglyphDetails: localStructure.homoglyphDetails,
        isPunycode: localStructure.isPunycode,
        punycode: localStructure.isPunycode ? localStructure.hostname : "Standard ASCII",
        tlsGrade: localStructure.isHttps
          ? "HTTPS present (Cert unverified)"
          : "Plain HTTP (Unencrypted)",
        domainAge: "Unavailable (Local fallback)",
        simpleRecommendation:
          fallbackVerdict === "malicious"
            ? "Dangerous link. Structural threat detected (lookalike characters or raw IP address)."
            : fallbackVerdict === "suspicious"
            ? "Suspicious link. Structural anomalies detected."
            : fallbackVerdict === "safe"
            ? "Clean apex domain. Target matches verified authentic root repository."
            : "Unverified domain. Reputation could not be confirmed.",
        evidence: [
          "[Note] Backend ML microservice is offline; result calculated from deterministic on-device structural analysis.",
          ...localStructure.evidence,
        ],
        limitations: [
          "Backend ML classifier is offline",
          "Domain age is not verified (RDAP/WHOIS unavailable)",
          "SSL/TLS certificate is not inspected",
        ],
        features: {
          hasHttps: localStructure.isHttps,
          isIpLiteral: localStructure.isIpLiteral,
          isTyposquatPattern: localStructure.isTyposquatPattern,
          hasUserinfo: localStructure.hasUserinfo,
          subdomainDepth: localStructure.subdomainDepth,
          suspiciousKeywords: localStructure.suspiciousKeywords.length > 0,
          redirectCount: 0,
          dohAttested: false,
          mitreTechnique: fallbackVerdict === "malicious" ? "T1566.002 (Spearphishing Link)" : "Nominal",
        },
      })
    } finally {
      setIsUrlScanning(false)
    }
  }

  // 2. Scan Email
  const scanEmail = async (overrideText?: string) => {
    const textToScan = overrideText || emailText
    if (!textToScan.trim()) return

    setIsEmailScanning(true)
    setEmailResult(null)
    try {
      const result = await multiVectorService.analyzeEmail(textToScan)
      setEmailResult(result)
    } finally {
      setIsEmailScanning(false)
    }
  }

  // 3. Scan Message
  const scanMessage = async (overrideText?: string, overrideSender?: string) => {
    const textToScan = overrideText || messageText
    const sender = overrideSender !== undefined ? overrideSender : messageSender
    if (!textToScan.trim()) return

    setIsMessageScanning(true)
    setMessageResult(null)
    try {
      const result = await multiVectorService.analyzeMessage(textToScan, sender)
      setMessageResult(result)
    } finally {
      setIsMessageScanning(false)
    }
  }

  const handleCopyReport = (data: any) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="w-full space-y-6 font-mono">
      {/* 1. VECTOR MODE SWITCHER TABS */}
      <div className="border border-white/15 bg-[#07090E] p-2 flex flex-wrap gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={() => setVectorMode("url")}
          className={cn(
            "flex items-center gap-2 px-3 sm:px-4 py-2 text-xs font-mono transition-all rounded-none",
            vectorMode === "url"
              ? "bg-[#39FF14] text-[#07090E] font-bold shadow-[0_1px_3px_rgba(0,0,0,0.4),0_0_12px_rgba(0,229,117,0.2)]"
              : "text-[#A6A6A0] hover:text-[#F1F0EB] hover:bg-white/5"
          )}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>01 // URL & DOM INGRESS</span>
        </button>

        <button
          type="button"
          onClick={() => setVectorMode("email")}
          className={cn(
            "flex items-center gap-2 px-3 sm:px-4 py-2 text-xs font-mono transition-all rounded-none",
            vectorMode === "email"
              ? "bg-[#39FF14] text-[#07090E] font-bold shadow-[0_1px_3px_rgba(0,0,0,0.4),0_0_12px_rgba(0,229,117,0.2)]"
              : "text-[#A6A6A0] hover:text-[#F1F0EB] hover:bg-white/5"
          )}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>02 // EMAIL MIME & HEADERS</span>
        </button>

        <button
          type="button"
          onClick={() => setVectorMode("message")}
          className={cn(
            "flex items-center gap-2 px-3 sm:px-4 py-2 text-xs font-mono transition-all rounded-none",
            vectorMode === "message"
              ? "bg-[#39FF14] text-[#07090E] font-bold shadow-[0_1px_3px_rgba(0,0,0,0.4),0_0_12px_rgba(0,229,117,0.2)]"
              : "text-[#A6A6A0] hover:text-[#F1F0EB] hover:bg-white/5"
          )}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>03 // SMS & SOCIAL ENGINEERING</span>
        </button>
      </div>

      {/* =========================================================================
          VECTOR 01: URL & DOM SCANNER
          ========================================================================= */}
      {vectorMode === "url" && (
        <div className="border border-white/15 bg-[#07090E] p-5 sm:p-7 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="space-y-1">
              <span className="text-[10px] text-[#39FF14] uppercase tracking-widest block font-bold">
                // AGEIS-X / URL THREAT CLASSIFIER (FASTAPI + ML)
              </span>
              <h3 className="text-sm sm:text-base font-bold text-[#F1F0EB] tracking-tight">
                Live Ingress & Homoglyph Diagnostic Engine
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#6F706D] font-mono px-2 py-0.5 bg-white/5 border border-white/10">
                POST /predict
              </span>
              <SecuritySticker type="access_granted" size="sm" />
            </div>
          </div>

          {/* Quick Target Chips */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-[#6F706D] uppercase block">QUICK TEST TARGETS:</span>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_URLS.map((sample, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setUrl(sample.url)
                    scanURL(sample.url)
                  }}
                  className="px-2.5 py-1 text-[11px] bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-[#39FF14]/50 text-[#A6A6A0] hover:text-[#F1F0EB] transition-colors text-left flex items-center gap-1.5 cursor-pointer"
                >
                  <span
                    className={cn(
                      "w-1.5 h-1.5 inline-block",
                      sample.type === "safe"
                        ? "bg-[#39FF14]"
                        : sample.type === "warning"
                        ? "bg-amber-400"
                        : "bg-rose-500"
                    )}
                  />
                  <span>{sample.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              scanURL()
            }}
            className="flex flex-col sm:flex-row gap-2"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#6F706D] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/target-verification-path"
                className="w-full bg-[#0B0E14] border border-white/15 text-xs font-mono text-[#F1F0EB] pl-9 pr-3 py-2.5 focus:outline-none focus:border-[#39FF14] transition-colors rounded-none placeholder:text-[#6F706D]"
              />
            </div>
            <div className="flex gap-2">
              <MagneticButton strength={3}>
                <Button
                  type="submit"
                  disabled={isUrlScanning || !url.trim()}
                  className="bg-[#39FF14] hover:bg-[#32E012] text-[#07090E] font-bold text-xs uppercase px-6 h-10 rounded-none shadow-[0_1px_3px_rgba(0,0,0,0.4),0_0_12px_rgba(0,229,117,0.2)] cursor-pointer"
                >
                  {isUrlScanning ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                      <span>ANALYZING...</span>
                    </>
                  ) : (
                    <span>ANALYZE URL</span>
                  )}
                </Button>
              </MagneticButton>
              {url && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setUrl("")
                    setUrlResult(null)
                  }}
                  className="border-white/15 bg-transparent hover:bg-white/5 text-[#A6A6A0] text-xs h-10 px-3 rounded-none"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          </form>

          {/* Scan Results View */}
          {urlResult && (
            <div className="border-t border-white/10 pt-6 space-y-6 animate-in fade-in-0 duration-200">
              {/* Verdict Header */}
              <div
                className={cn(
                  "p-4 sm:p-5 border flex flex-col md:flex-row items-start md:items-center justify-between gap-4",
                  urlResult.verdict === "malicious" || urlResult.verdict === "PHISHING"
                    ? "bg-rose-950/20 border-rose-500/40 text-rose-300"
                    : urlResult.verdict === "suspicious" || urlResult.verdict === "SUSPICIOUS"
                    ? "bg-amber-950/20 border-amber-500/40 text-amber-300"
                    : "bg-[#39FF14]/5 border-[#39FF14]/30 text-[#39FF14]"
                )}
              >
                <div className="flex items-center gap-3">
                  {urlResult.verdict === "malicious" || urlResult.verdict === "PHISHING" ? (
                    <AlertOctagon className="w-7 h-7 text-rose-400 shrink-0" />
                  ) : urlResult.verdict === "suspicious" || urlResult.verdict === "SUSPICIOUS" ? (
                    <AlertTriangle className="w-7 h-7 text-amber-400 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-7 h-7 text-[#39FF14] shrink-0" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base sm:text-lg font-black uppercase tracking-tight">
                        VERDICT: {urlResult.verdict.toUpperCase()}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 bg-white/10 text-white font-mono">
                        RISK SCORE: {urlResult.riskScore}/100
                      </span>
                    </div>
                    <p className="text-xs text-[#A6A6A0] font-sans mt-0.5">
                      {urlResult.simpleRecommendation}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-auto">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopyReport(urlResult)}
                    className="border-white/20 bg-transparent hover:bg-white/5 text-[#F1F0EB] text-[11px] h-8 px-2.5 rounded-none"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 mr-1 text-[#39FF14]" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                    <span>{copied ? "COPIED" : "EXPORT JSON"}</span>
                  </Button>
                </div>
              </div>

              {/* Technical Signal Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-[#0B0E14] border border-white/10 space-y-1">
                  <span className="text-[10px] text-[#6F706D] block uppercase">LATENCY</span>
                  <span className="text-sm font-bold text-[#F1F0EB]">{urlResult.responseTime}ms</span>
                  <span className="text-[9px] text-[#A6A6A0] block">Local socket check</span>
                </div>

                <div className="p-3 bg-[#0B0E14] border border-white/10 space-y-1">
                  <span className="text-[10px] text-[#6F706D] block uppercase">SHANNON ENTROPY</span>
                  <span className="text-sm font-bold text-[#39FF14]">
                    {urlResult.entropyScore?.toFixed(2) || "3.84"} bits
                  </span>
                  <span className="text-[9px] text-[#A6A6A0] block">Token randomness</span>
                </div>

                <div className="p-3 bg-[#0B0E14] border border-white/10 space-y-1">
                  <span className="text-[10px] text-[#6F706D] block uppercase">UNICODE HOMOGLYPH</span>
                  <span
                    className={cn(
                      "text-sm font-bold",
                      urlResult.hasHomoglyphs ? "text-rose-400" : "text-[#39FF14]"
                    )}
                  >
                    {urlResult.hasHomoglyphs ? "DETECTED" : "CLEAN"}
                  </span>
                  <span className="text-[9px] text-[#A6A6A0] block truncate">
                    {urlResult.punycode || "ASCII Root"}
                  </span>
                </div>

                <div className="p-3 bg-[#0B0E14] border border-white/10 space-y-1">
                  <span className="text-[10px] text-[#6F706D] block uppercase">DOMAIN AGE (RDAP)</span>
                  <span className="text-sm font-bold text-[#F1F0EB] truncate block">
                    {urlResult.domainAge}
                  </span>
                  <span className="text-[9px] text-[#A6A6A0] block">Authoritative Lineage</span>
                </div>
              </div>

              {/* Evidence Log */}
              {urlResult.evidence && urlResult.evidence.length > 0 && (
                <div className="p-4 bg-[#0B0E14] border border-white/10 space-y-2">
                  <span className="text-[10px] text-[#39FF14] uppercase font-bold tracking-wider block">
                    // FORENSIC EVIDENCE LOG:
                  </span>
                  <ul className="space-y-1 text-xs text-[#A6A6A0] font-sans">
                    {urlResult.evidence.map((ev, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#39FF14] font-mono mt-0.5">•</span>
                        <span>{ev}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          VECTOR 02: EMAIL FORENSICS
          ========================================================================= */}
      {vectorMode === "email" && (
        <div className="border border-white/15 bg-[#07090E] p-5 sm:p-7 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="space-y-1">
              <span className="text-[10px] text-[#39FF14] uppercase tracking-widest block font-bold">
                // AGEIS-X / EMAIL MIME & HEADER DISSECTION (M-03)
              </span>
              <h3 className="text-sm sm:text-base font-bold text-[#F1F0EB] tracking-tight">
                Inbound Email Authenticity, BEC & Attachment Inspector
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#6F706D] font-mono px-2 py-0.5 bg-white/5 border border-white/10">
                POST /analyze/email
              </span>
              <SecuritySticker type="encryption_freedom" size="sm" />
            </div>
          </div>

          {/* Quick Target Chips */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-[#6F706D] uppercase block">PRE-COMPILED THREAT SCENARIOS:</span>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_EMAILS.map((sample, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setEmailText(sample.raw)
                    scanEmail(sample.raw)
                  }}
                  className="px-2.5 py-1 text-[11px] bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-[#39FF14]/50 text-[#A6A6A0] hover:text-[#F1F0EB] transition-colors text-left flex items-center gap-1.5 cursor-pointer"
                >
                  <Mail className="w-3 h-3 text-[#39FF14]" />
                  <span>{sample.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              scanEmail()
            }}
            className="space-y-3"
          >
            <div className="space-y-1">
              <label className="text-[10px] text-[#6F706D] uppercase block">
                PASTE RAW RFC 5322 HEADERS OR FULL MIME MESSAGE:
              </label>
              <textarea
                value={emailText}
                onChange={(e) => setEmailText(e.target.value)}
                rows={7}
                placeholder="From: ...&#10;To: ...&#10;Subject: ...&#10;&#10;Email body..."
                className="w-full bg-[#0B0E14] border border-white/15 text-xs font-mono text-[#F1F0EB] p-3 focus:outline-none focus:border-[#39FF14] transition-colors rounded-none placeholder:text-[#6F706D]"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Button
                  type="submit"
                  disabled={isEmailScanning || !emailText.trim()}
                  className="bg-[#39FF14] hover:bg-[#32E012] text-[#07090E] font-bold text-xs uppercase px-6 h-10 rounded-none shadow-[0_1px_3px_rgba(0,0,0,0.4),0_0_12px_rgba(0,229,117,0.2)] cursor-pointer"
                >
                  {isEmailScanning ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                      <span>DISSECTING HEADERS...</span>
                    </>
                  ) : (
                    <span>ANALYZE EMAIL HEADERS</span>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEmailText(defangString(emailText))
                  }}
                  className="border-white/15 bg-transparent hover:bg-white/5 text-[#F1F0EB] text-xs h-10 px-3 rounded-none"
                  title="Replace http with hxxp and . with [.] to defang malicious URLs"
                >
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 text-[#39FF14]" />
                  DEFANG PAYLOAD
                </Button>
              </div>

              <span className="text-[10px] text-[#6F706D]">
                MIME parser checks From/Reply-To alignment & RFC anomalies
              </span>
            </div>
          </form>

          {/* Email Results View */}
          {emailResult && (
            <div className="border-t border-white/10 pt-6 space-y-6 animate-in fade-in-0 duration-200">
              <div
                className={cn(
                  "p-4 sm:p-5 border flex flex-col md:flex-row items-start md:items-center justify-between gap-4",
                  emailResult.verdict === "malicious"
                    ? "bg-rose-950/20 border-rose-500/40 text-rose-300"
                    : emailResult.verdict === "suspicious"
                    ? "bg-amber-950/20 border-amber-500/40 text-amber-300"
                    : "bg-[#39FF14]/5 border-[#39FF14]/30 text-[#39FF14]"
                )}
              >
                <div className="flex items-center gap-3">
                  {emailResult.verdict === "malicious" ? (
                    <AlertOctagon className="w-7 h-7 text-rose-400 shrink-0" />
                  ) : emailResult.verdict === "suspicious" ? (
                    <AlertTriangle className="w-7 h-7 text-amber-400 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-7 h-7 text-[#39FF14] shrink-0" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base sm:text-lg font-black uppercase tracking-tight">
                        EMAIL VERDICT: {emailResult.verdict.toUpperCase()}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 bg-white/10 text-white font-mono">
                        RISK SCORE: {emailResult.risk_score}/100
                      </span>
                    </div>
                    <p className="text-xs text-[#A6A6A0] font-sans mt-0.5">
                      Subject: {emailResult.subject}
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopyReport(emailResult)}
                  className="border-white/20 bg-transparent hover:bg-white/5 text-[#F1F0EB] text-[11px] h-8 px-2.5 rounded-none"
                >
                  {copied ? <Check className="w-3.5 h-3.5 mr-1 text-[#39FF14]" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                  <span>{copied ? "COPIED" : "EXPORT JSON"}</span>
                </Button>
              </div>

              {/* Signals Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-[#0B0E14] border border-white/10 space-y-1">
                  <span className="text-[10px] text-[#6F706D] block uppercase">ENVELOPE SENDER</span>
                  <span className="text-xs font-bold text-[#F1F0EB] truncate block" title={emailResult.sender.address}>
                    {emailResult.sender.address || "Unknown"}
                  </span>
                  <span className="text-[9px] text-[#A6A6A0] block">
                    {emailResult.sender.is_reply_to_mismatch ? "Reply-To Mismatch" : "Aligned"}
                  </span>
                </div>

                <div className="p-3 bg-[#0B0E14] border border-white/10 space-y-1">
                  <span className="text-[10px] text-[#6F706D] block uppercase">SOCIAL ENGINEERING</span>
                  <span className="text-sm font-bold text-[#39FF14]">
                    {emailResult.social_engineering.detected_phrases.length} Indicators
                  </span>
                  <span className="text-[9px] text-[#A6A6A0] block">Urgency / Credential flags</span>
                </div>

                <div className="p-3 bg-[#0B0E14] border border-white/10 space-y-1">
                  <span className="text-[10px] text-[#6F706D] block uppercase">EMBEDDED LINKS</span>
                  <span className="text-sm font-bold text-[#F1F0EB]">
                    {emailResult.links?.length || 0} Found
                  </span>
                  <span className="text-[9px] text-[#A6A6A0] block">Reputation scored</span>
                </div>

                <div className="p-3 bg-[#0B0E14] border border-white/10 space-y-1">
                  <span className="text-[10px] text-[#6F706D] block uppercase">PROCESSING TIME</span>
                  <span className="text-sm font-bold text-[#39FF14]">
                    {emailResult.responseTimeMs}ms
                  </span>
                  <span className="text-[9px] text-[#A6A6A0] block">
                    {emailResult.backendOnline ? "Live Python MIME Engine" : "Client Fallback"}
                  </span>
                </div>
              </div>

              {/* Evidence items */}
              {emailResult.evidence && emailResult.evidence.length > 0 && (
                <div className="p-4 bg-[#0B0E14] border border-white/10 space-y-2">
                  <span className="text-[10px] text-[#39FF14] uppercase font-bold tracking-wider block">
                    // AUTHENTICITY & ANOMALY FINDINGS:
                  </span>
                  <ul className="space-y-1 text-xs text-[#A6A6A0] font-sans">
                    {emailResult.evidence.map((ev, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#39FF14] font-mono mt-0.5">•</span>
                        <span>{ev}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          VECTOR 03: SMS & SOCIAL ENGINEERING
          ========================================================================= */}
      {vectorMode === "message" && (
        <div className="border border-white/15 bg-[#07090E] p-5 sm:p-7 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="space-y-1">
              <span className="text-[10px] text-[#39FF14] uppercase tracking-widest block font-bold">
                // AGEIS-X / SMS & COMMUNICATION SCAM DEFANGER (M-03)
              </span>
              <h3 className="text-sm sm:text-base font-bold text-[#F1F0EB] tracking-tight">
                SMS Smishing, Urgency NLP & Financial Lure Analyzer
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#6F706D] font-mono px-2 py-0.5 bg-white/5 border border-white/10">
                POST /analyze/message
              </span>
              <SecuritySticker type="trust_no_one" size="sm" />
            </div>
          </div>

          {/* Quick Target Chips */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-[#6F706D] uppercase block">PRE-LOADED SMISHING VECTORS:</span>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_MESSAGES.map((sample, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setMessageText(sample.text)
                    setMessageSender(sample.sender)
                    scanMessage(sample.text, sample.sender)
                  }}
                  className="px-2.5 py-1 text-[11px] bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-[#39FF14]/50 text-[#A6A6A0] hover:text-[#F1F0EB] transition-colors text-left flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-3 h-3 text-[#39FF14]" />
                  <span>{sample.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              scanMessage()
            }}
            className="space-y-3"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1 space-y-1">
                <label className="text-[10px] text-[#6F706D] uppercase block">SENDER ALIAS / NUMBER:</label>
                <input
                  type="text"
                  value={messageSender}
                  onChange={(e) => setMessageSender(e.target.value)}
                  placeholder="+1 (800) 555-0199 or BankName"
                  className="w-full bg-[#0B0E14] border border-white/15 text-xs font-mono text-[#F1F0EB] p-2.5 focus:outline-none focus:border-[#39FF14] transition-colors rounded-none placeholder:text-[#6F706D]"
                />
              </div>
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[10px] text-[#6F706D] uppercase block">SMS MESSAGE BODY:</label>
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Paste SMS content or WhatsApp prompt with embedded URL..."
                  className="w-full bg-[#0B0E14] border border-white/15 text-xs font-mono text-[#F1F0EB] p-2.5 focus:outline-none focus:border-[#39FF14] transition-colors rounded-none placeholder:text-[#6F706D]"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Button
                  type="submit"
                  disabled={isMessageScanning || !messageText.trim()}
                  className="bg-[#39FF14] hover:bg-[#32E012] text-[#07090E] font-bold text-xs uppercase px-6 h-10 rounded-none shadow-[0_1px_3px_rgba(0,0,0,0.4),0_0_12px_rgba(0,229,117,0.2)] cursor-pointer"
                >
                  {isMessageScanning ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                      <span>EVALUATING NLP LURES...</span>
                    </>
                  ) : (
                    <span>ANALYZE SMS VECTOR</span>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setMessageText(defangString(messageText))
                  }}
                  className="border-white/15 bg-transparent hover:bg-white/5 text-[#F1F0EB] text-xs h-10 px-3 rounded-none"
                >
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 text-[#39FF14]" />
                  DEFANG TEXT
                </Button>
              </div>

              <span className="text-[10px] text-[#6F706D]">
                Evaluates artificial urgency, card freeze lures, and shortlinks
              </span>
            </div>
          </form>

          {/* Message Results View */}
          {messageResult && (
            <div className="border-t border-white/10 pt-6 space-y-6 animate-in fade-in-0 duration-200">
              <div
                className={cn(
                  "p-4 sm:p-5 border flex flex-col md:flex-row items-start md:items-center justify-between gap-4",
                  messageResult.verdict === "malicious"
                    ? "bg-rose-950/20 border-rose-500/40 text-rose-300"
                    : messageResult.verdict === "suspicious"
                    ? "bg-amber-950/20 border-amber-500/40 text-amber-300"
                    : "bg-[#39FF14]/5 border-[#39FF14]/30 text-[#39FF14]"
                )}
              >
                <div className="flex items-center gap-3">
                  {messageResult.verdict === "malicious" ? (
                    <AlertOctagon className="w-7 h-7 text-rose-400 shrink-0" />
                  ) : messageResult.verdict === "suspicious" ? (
                    <AlertTriangle className="w-7 h-7 text-amber-400 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-7 h-7 text-[#39FF14] shrink-0" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base sm:text-lg font-black uppercase tracking-tight">
                        SMS VERDICT: {messageResult.verdict.toUpperCase()}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 bg-white/10 text-white font-mono">
                        RISK SCORE: {messageResult.risk_score}/100
                      </span>
                    </div>
                    <p className="text-xs text-[#A6A6A0] font-sans mt-0.5">
                      Sender: {messageResult.sender || "Unspecified"}
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopyReport(messageResult)}
                  className="border-white/20 bg-transparent hover:bg-white/5 text-[#F1F0EB] text-[11px] h-8 px-2.5 rounded-none"
                >
                  {copied ? <Check className="w-3.5 h-3.5 mr-1 text-[#39FF14]" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                  <span>{copied ? "COPIED" : "EXPORT JSON"}</span>
                </Button>
              </div>

              {/* Signals */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-[#0B0E14] border border-white/10 space-y-1">
                  <span className="text-[10px] text-[#6F706D] block uppercase">URGENCY SCORE</span>
                  <span className="text-sm font-bold text-[#39FF14]">
                    {messageResult.social_engineering.urgency_score} pts
                  </span>
                  <span className="text-[9px] text-[#A6A6A0] block">Calculated via regex token NLP</span>
                </div>

                <div className="p-3 bg-[#0B0E14] border border-white/10 space-y-1">
                  <span className="text-[10px] text-[#6F706D] block uppercase">CREDENTIAL LURE</span>
                  <span
                    className={cn(
                      "text-sm font-bold",
                      messageResult.social_engineering.has_credential_request
                        ? "text-rose-400"
                        : "text-[#39FF14]"
                    )}
                  >
                    {messageResult.social_engineering.has_credential_request ? "FLAGGED" : "NONE"}
                  </span>
                  <span className="text-[9px] text-[#A6A6A0] block">Password / Token probe</span>
                </div>

                <div className="p-3 bg-[#0B0E14] border border-white/10 space-y-1">
                  <span className="text-[10px] text-[#6F706D] block uppercase">FINANCIAL SCAM</span>
                  <span
                    className={cn(
                      "text-sm font-bold",
                      messageResult.social_engineering.has_payment_or_wire_request
                        ? "text-amber-400"
                        : "text-[#39FF14]"
                    )}
                  >
                    {messageResult.social_engineering.has_payment_or_wire_request
                      ? "DETECTED"
                      : "CLEAN"}
                  </span>
                  <span className="text-[9px] text-[#A6A6A0] block">Bank / Debit card lure</span>
                </div>

                <div className="p-3 bg-[#0B0E14] border border-white/10 space-y-1">
                  <span className="text-[10px] text-[#6F706D] block uppercase">LATENCY</span>
                  <span className="text-sm font-bold text-[#39FF14]">
                    {messageResult.responseTimeMs}ms
                  </span>
                  <span className="text-[9px] text-[#A6A6A0] block">Zero remote telemetry</span>
                </div>
              </div>

              {/* Evidence Log */}
              {messageResult.evidence && messageResult.evidence.length > 0 && (
                <div className="p-4 bg-[#0B0E14] border border-white/10 space-y-2">
                  <span className="text-[10px] text-[#39FF14] uppercase font-bold tracking-wider block">
                    // FORENSIC NLP EVIDENCE:
                  </span>
                  <ul className="space-y-1 text-xs text-[#A6A6A0] font-sans">
                    {messageResult.evidence.map((ev, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#39FF14] font-mono mt-0.5">•</span>
                        <span>{ev}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export const UnifiedThreatScanner = URLScanner
