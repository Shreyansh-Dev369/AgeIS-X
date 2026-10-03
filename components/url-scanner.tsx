"use client"

import React, { useState } from "react"
import { Search, CheckCircle2, AlertTriangle, AlertOctagon, Loader2, Globe, Lock, ShieldCheck, ArrowRight, ShieldAlert, AlertCircle, Info, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { analyzeUrlStructure } from "@/lib/utils/url-analyzer"
import { SecuritySticker } from "@/components/design-system/pixel-art-system"

export type ScanVerdict = "safe" | "suspicious" | "malicious" | "unknown" | "error"

export interface ScanResult {
  url: string
  riskScore: number
  verdict: ScanVerdict
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

const SAMPLE_TARGETS = [
  { label: "Bank Portal (Clean)", url: "https://secure.chase.com/auth/login" },
  { label: "Homoglyph Phishing", url: "https://paypаl-verify.secure-update.xyz/token" },
  { label: "Typosquat Domain", url: "https://wwwgoogle.com/search" },
  { label: "IP Literal Endpoint", url: "http://185.220.101.9:8080/payload.elf" },
]

export function URLScanner() {
  const [url, setUrl] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false)

  const scanURL = async (targetUrl?: string) => {
    const inputToScan = (targetUrl || url).trim()
    if (!inputToScan) return

    setIsScanning(true)
    setScanResult(null)

    const startTime = Date.now()
    const localStructure = analyzeUrlStructure(inputToScan)

    try {
      const res = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: inputToScan }),
      })

      if (!res.ok) throw new Error(`Backend HTTP ${res.status}`)
      const data = await res.json()
      const responseTime = Date.now() - startTime

      const riskScore = typeof data.risk_score === "number" ? data.risk_score : Math.round((data.probability || 0.5) * 100)
      const verdict: ScanVerdict = data.verdict || (riskScore >= 70 ? "malicious" : riskScore >= 30 ? "suspicious" : "safe")

      let tlsDisplay = localStructure.isHttps ? "HTTPS present (Cert unverified)" : "Plain HTTP (Unencrypted)"
      if (data.tls) {
        if (data.tls.status === "blocked") {
          tlsDisplay = "SSRF Prohibited / Internal Target"
        } else if (data.tls.connected) {
          const cipherInfo = data.tls.version ? `${data.tls.version}` : "TLS"
          const issuerInfo = data.tls.issuer ? data.tls.issuer.slice(0, 24) : "Active CA"
          tlsDisplay = data.tls.verified && !data.tls.is_expired
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

      setScanResult({
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
        punycode: data.features?.punycode_decoded ? data.features.punycode_decoded : localStructure.isPunycode ? localStructure.hostname : "Standard ASCII",
        tlsGrade: tlsDisplay,
        domainAge: domainAgeDisplay,
        simpleRecommendation:
          verdict === "malicious"
            ? "Dangerous link. Do not visit this website or enter credentials."
            : verdict === "suspicious"
            ? "Suspicious link. High-risk keywords or structural anomalies detected. Exercise caution."
            : "Clean link. No malicious structural indicators or phishing patterns found.",
        evidence: data.evidence && data.evidence.length > 0 ? data.evidence : localStructure.evidence,
        limitations: data.limitations || [
          "Domain age is not verified (RDAP lookup offline)",
          "SSL/TLS certificate active inspection offline"
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
      await new Promise((r) => setTimeout(r, 150))
      const responseTime = Date.now() - startTime

      let fallbackVerdict: ScanVerdict = "unknown"
      let fallbackRiskScore = 35

      if (localStructure.isKnownBenign) {
        fallbackVerdict = "safe"
        fallbackRiskScore = 2
      } else if (
        localStructure.hasHomoglyphs ||
        localStructure.hasUserinfo ||
        localStructure.isTyposquatPattern ||
        localStructure.brandImpersonation ||
        localStructure.isIpLiteral
      ) {
        fallbackVerdict = "malicious"
        fallbackRiskScore = Math.max(75, Math.min(100, localStructure.structuralRiskPoints + 30))
      } else if (localStructure.suspiciousKeywords.length > 0 || localStructure.isSuspiciousTld || localStructure.subdomainDepth >= 3) {
        fallbackVerdict = "suspicious"
        fallbackRiskScore = Math.max(45, localStructure.structuralRiskPoints + 20)
      } else {
        fallbackVerdict = "unknown"
        fallbackRiskScore = 35
      }

      setScanResult({
        url: inputToScan,
        riskScore: fallbackRiskScore,
        verdict: fallbackVerdict,
        model: "AgeIS-X Client Structural Analyzer (Local Fallback)",
        backendOnline: false,
        responseTime: responseTime > 0 ? responseTime : 20,
        entropyScore: localStructure.entropy,
        hasHomoglyphs: localStructure.hasHomoglyphs,
        homoglyphDetails: localStructure.homoglyphDetails,
        isPunycode: localStructure.isPunycode,
        punycode: localStructure.isPunycode ? localStructure.hostname : "Standard ASCII",
        tlsGrade: localStructure.isHttps ? "HTTPS present (Cert unverified)" : "Plain HTTP (Unencrypted)",
        domainAge: "Unavailable (Local fallback)",
        simpleRecommendation:
          fallbackVerdict === "malicious"
            ? "Dangerous link. Structural threat detected (lookalike characters, brand trick, or raw IP address)."
            : fallbackVerdict === "suspicious"
            ? "Suspicious link. Structural anomalies or high-risk keywords detected."
            : fallbackVerdict === "safe"
            ? "Clean apex domain. Target matches verified authentic root repository."
            : "Unverified domain. Backend ML service is offline; reputation could not be confirmed.",
        evidence: [
          "[Note] Backend ML microservice is offline; result calculated from deterministic on-device structural analysis.",
          ...localStructure.evidence
        ],
        limitations: [
          "Backend ML classifier is offline",
          "Domain age is not verified (RDAP/WHOIS unavailable)",
          "SSL/TLS certificate is not inspected"
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
      setIsScanning(false)
    }
  }

  return (
    <div className="w-full space-y-6">
      {/* Scanner Input Header */}
      <div className="border border-white/15 bg-[#050505] p-5 sm:p-7 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-[#39FF14] uppercase tracking-widest block">
              // AGEIS-X / INGESTION INTERCEPTOR
            </span>
            <h3 className="text-sm sm:text-base font-bold text-[#F1F0EB] tracking-tight">
              Live URL & Vector Diagnostic Scanner
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <SecuritySticker type="access_granted" />
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
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/target-endpoint..."
              className="w-full h-12 px-4 bg-[#080808] border border-white/20 text-[#F1F0EB] text-xs sm:text-sm font-mono outline-none focus:border-[#39FF14] transition-colors"
            />
          </div>

          <Button
            type="submit"
            disabled={isScanning || !url.trim()}
            className="bg-[#39FF14] hover:bg-[#32e012] text-[#050505] font-bold font-mono text-xs px-7 h-12 shrink-0 rounded-none shadow-[2px_2px_0px_#FFFFFF]"
          >
            {isScanning ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin text-[#050505]" />
                SCANNING...
              </>
            ) : (
              <span>SCAN VECTOR &rarr;</span>
            )}
          </Button>
        </form>

        {/* Benchmark Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-[10px] font-mono text-[#6F706D] uppercase">TEST EXAMPLES:</span>
          {SAMPLE_TARGETS.map((t) => (
            <button
              key={t.label}
              type="button"
              onClick={() => {
                setUrl(t.url)
                scanURL(t.url)
              }}
              className="px-2.5 py-1 border border-white/10 bg-[#080808] hover:border-[#39FF14]/50 text-[#A6A6A0] hover:text-[#F1F0EB] font-mono text-[11px] transition-colors"
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Result Section */}
      {scanResult && (
        <div className="border border-white/15 bg-[#050505] p-5 sm:p-7 space-y-5 animate-fade-in font-mono text-xs">
          {/* Verdict Banner */}
          <div
            className={`p-4 border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              scanResult.verdict === "malicious"
                ? "border-[#FF4545] bg-[#FF4545]/10 text-[#FF4545]"
                : scanResult.verdict === "suspicious"
                ? "border-[#FFB800] bg-[#FFB800]/10 text-[#FFB800]"
                : scanResult.verdict === "unknown"
                ? "border-[#00E5FF] bg-[#00E5FF]/10 text-[#00E5FF]"
                : "border-[#39FF14] bg-[#39FF14]/10 text-[#39FF14]"
            }`}
          >
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest font-bold block">
                VERDICT // {scanResult.verdict.toUpperCase()}
              </span>
              <p className="text-sm font-bold text-[#F1F0EB] font-sans">
                {scanResult.simpleRecommendation}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs px-2 py-1 bg-[#050505] border border-white/20 text-[#F1F0EB]">
                {scanResult.responseTime}ms
              </span>
            </div>
          </div>

          {/* Metric Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 border-y border-white/10 divide-x divide-white/10 py-3 text-center">
            <div className="p-2">
              <span className="text-[10px] text-[#6F706D] uppercase block">RISK SCORE</span>
              <span
                className={`text-xl font-bold mt-0.5 block ${
                  scanResult.riskScore > 60
                    ? "text-[#FF4545]"
                    : scanResult.riskScore > 25
                    ? "text-[#FFB800]"
                    : "text-[#39FF14]"
                }`}
              >
                {scanResult.riskScore}%
              </span>
            </div>
            <div className="p-2">
              <span className="text-[10px] text-[#6F706D] uppercase block">HOMOGLYPHS</span>
              <span className="text-xs font-bold text-[#F1F0EB] mt-1 block">
                {scanResult.hasHomoglyphs ? "DETECTED" : "NONE"}
              </span>
            </div>
            <div className="p-2">
              <span className="text-[10px] text-[#6F706D] uppercase block">PROTOCOL</span>
              <span className="text-xs font-bold text-[#00E5FF] mt-1 block">
                {scanResult.features.hasHttps ? "HTTPS" : "HTTP"}
              </span>
            </div>
            <div className="p-2">
              <span className="text-[10px] text-[#6F706D] uppercase block">CLASSIFIER</span>
              <span className="text-xs font-bold text-[#F1F0EB] mt-1 block truncate">
                {scanResult.backendOnline ? "FASTAPI ML" : "LOCAL"}
              </span>
            </div>
          </div>

          {/* Evidence Details */}
          <div className="space-y-2 pt-2">
            <span className="text-[10px] text-[#39FF14] uppercase tracking-widest font-bold block">
              DIAGNOSTIC EVIDENCE
            </span>
            <ul className="space-y-1 text-[11px] text-[#A6A6A0]">
              {scanResult.evidence.map((ev, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#39FF14] font-bold">&gt;</span>
                  <span>{ev}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Progressive Disclosure: Technical Inspector */}
          <div className="pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
              className="text-[11px] text-[#A6A6A0] hover:text-[#39FF14] flex items-center gap-1.5 transition-colors uppercase font-bold"
            >
              <span>{showTechnicalDetails ? "[-] HIDE RAW METADATA" : "[+] EXPAND RAW TELEMETRY"}</span>
            </button>

            {showTechnicalDetails && (
              <div className="mt-3 p-4 bg-[#080808] border border-white/10 space-y-2 text-[11px] text-[#A6A6A0]">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-[#6F706D]">TARGET URL:</span>
                  <span className="text-[#F1F0EB] break-all pl-2">{scanResult.url}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-[#6F706D]">ENTROPY SCORE:</span>
                  <span className="text-[#00E5FF]">{scanResult.entropyScore}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-[#6F706D]">PUNYCODE:</span>
                  <span className="text-[#F1F0EB]">{scanResult.punycode}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#6F706D]">ENGINE ATTRIBUTION:</span>
                  <span className="text-[#39FF14]">{scanResult.model}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}