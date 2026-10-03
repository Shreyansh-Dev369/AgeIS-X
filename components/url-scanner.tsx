"use client"

import React, { useState } from "react"
import { Search, CheckCircle2, AlertTriangle, AlertOctagon, Loader2, RefreshCw, Cpu, Globe, Lock, ShieldCheck, Terminal, ArrowRight, Zap, Radio, ShieldAlert, Check, HelpCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TacticalFrame } from "@/components/ui/tactical-frame"
import { TerminalPrompt } from "@/components/ui/terminal-prompt"
import { cyberAudio } from "@/lib/cyber-sound"
import { useCyberTheme } from "@/lib/cyber-theme"
import { analyzeUrlStructure, StructuralAnalysisResult } from "@/lib/utils/url-analyzer"

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
  { label: "✅ Real Bank (Safe)", url: "https://secure.chase.com/auth/login" },
  { label: "🚨 Fake Phishing Link (Homoglyph)", url: "https://paypаl-verify.secure-update.xyz/token" },
  { label: "⚠️ Missing Dot Typosquat", url: "https://wwwgoogle.com/search" },
  { label: "🦠 IP Literal Port", url: "http://185.220.101.9:8080/payload.elf" },
]

export function URLScanner() {
  const [url, setUrl] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [scansUsed, setScansUsed] = useState(0)
  const { triggerGlitch } = useCyberTheme()

  const scanURL = async (targetUrl?: string) => {
    const inputToScan = (targetUrl || url).trim()
    if (!inputToScan) return

    setIsScanning(true)
    setScanResult(null)
    cyberAudio.playSonar()

    const startTime = Date.now()

    // 1. Perform deterministic local structural and Unicode analysis
    const localStructure = analyzeUrlStructure(inputToScan)

    try {
      // 2. Query Local/Cluster Backend API
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

      if (verdict === "malicious" || verdict === "suspicious") {
        cyberAudio.playAlert()
        triggerGlitch(600)
      } else {
        cyberAudio.playSuccess()
      }

      // Format TLS Grade from live probe
      let tlsDisplay = localStructure.isHttps ? "HTTPS present (Cert unverified)" : "Plain HTTP (No Encryption)"
      if (data.tls) {
        if (data.tls.status === "blocked") {
          tlsDisplay = "SSRF Blocked"
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

      // Format Domain Age from live RDAP
      let domainAgeDisplay = "Not verified (Live RDAP unlinked)"
      if (data.rdap) {
        if (data.rdap.status === "blocked") {
          domainAgeDisplay = "SSRF Prohibited / Internal Target"
        } else if (data.rdap.domain_age_formatted) {
          domainAgeDisplay = data.rdap.domain_age_formatted
        } else if (data.rdap.status === "unavailable") {
          domainAgeDisplay = "Unavailable (No authoritative RDAP record)"
        }
      }

      setScanResult({
        url: data.url || inputToScan,
        riskScore,
        verdict,
        model: data.model_info?.name || "AgeIS-X Lexical Classifier (SGD + HashingVectorizer)",
        backendOnline: true,
        responseTime,
        entropyScore: data.features?.entropy ?? localStructure.entropy,
        hasHomoglyphs: data.features?.has_homoglyphs ?? localStructure.hasHomoglyphs,
        homoglyphDetails: data.features?.homoglyph_details ?? localStructure.homoglyphDetails,
        isPunycode: data.features?.is_punycode ?? localStructure.isPunycode,
        punycode: data.features?.punycode_decoded ? data.features.punycode_decoded : localStructure.isPunycode ? localStructure.hostname : "N/A (Standard ASCII)",
        tlsGrade: tlsDisplay,
        domainAge: domainAgeDisplay,
        simpleRecommendation:
          verdict === "malicious"
            ? "🚨 DANGEROUS LINK: High risk score and malicious lexical/structural indicators detected."
            : verdict === "suspicious"
            ? "⚠️ SUSPICIOUS LINK: Ambiguous tokens or structural anomalies detected. Exercise caution."
            : "✅ VERIFIED CLEAN: No structural threats or malicious token patterns found in URL.",
        evidence: data.evidence && data.evidence.length > 0 ? data.evidence : localStructure.evidence,
        limitations: data.limitations || [
          "Domain age is not verified (RDAP/WHOIS lookup not connected)",
          "SSL/TLS certificate is not inspected (active TLS probe not connected)"
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
          mitreTechnique: verdict === "malicious" ? "T1566.002 (Spearphishing Link)" : "NOMINAL",
        },
      })
      setScansUsed((prev) => prev + 1)
    } catch {
      // 3. Truthful Local Deterministic Fallback (Backend Offline)
      await new Promise((r) => setTimeout(r, 200))
      const responseTime = Date.now() - startTime

      let fallbackVerdict: ScanVerdict = "unknown"
      let fallbackRiskScore = 40

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
        // Random / unknown domain with backend offline -> UNKNOWN (NEVER silent safe!)
        fallbackVerdict = "unknown"
        fallbackRiskScore = 35
      }

      if (fallbackVerdict === "malicious" || fallbackVerdict === "suspicious") {
        cyberAudio.playAlert()
        triggerGlitch(600)
      } else {
        cyberAudio.playSuccess()
      }

      setScanResult({
        url: inputToScan,
        riskScore: fallbackRiskScore,
        verdict: fallbackVerdict,
        model: "AgeIS-X Client Structural Analyzer (Local Fallback)",
        backendOnline: false,
        responseTime: responseTime > 0 ? responseTime : 25,
        entropyScore: localStructure.entropy,
        hasHomoglyphs: localStructure.hasHomoglyphs,
        homoglyphDetails: localStructure.homoglyphDetails,
        isPunycode: localStructure.isPunycode,
        punycode: localStructure.isPunycode ? localStructure.hostname : "N/A (Standard ASCII)",
        tlsGrade: localStructure.isHttps ? "HTTPS present (Cert unverified)" : "Plain HTTP (No Encryption)",
        domainAge: "Unavailable (RDAP offline)",
        simpleRecommendation:
          fallbackVerdict === "malicious"
            ? "🚨 DANGEROUS LINK: Severe structural threat detected (homoglyphs / typosquatting / credential trick)."
            : fallbackVerdict === "suspicious"
            ? "⚠️ SUSPICIOUS LINK: Structural anomalies or high-risk keywords detected."
            : fallbackVerdict === "safe"
            ? "✅ VERIFIED APEX DOMAIN: Target matches established authentic root repository."
            : "⚠️ UNVERIFIED DOMAIN: Backend ML engine is offline. Local check found no explicit threats, but reputation is unconfirmed.",
        evidence: [
          "[NOTE] Backend ML microservice is offline; result derived from deterministic client-side structural analysis.",
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
          mitreTechnique: fallbackVerdict === "malicious" ? "T1566.002 (Spearphishing Link)" : "NOMINAL",
        },
      })
      setScansUsed((prev) => prev + 1)
    } finally {
      setIsScanning(false)
    }
  }

  return (
    <section className="py-16 border-y border-white/10 bg-[#020407] relative font-mono">
      <div className="page-container relative z-10">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Section Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 border border-[#00ff66]/40 bg-[#00ff66]/10 text-[#00ff66] text-xs font-bold">
              <Terminal className="w-3.5 h-3.5" />
              <span>DETERMINISTIC &amp; ML PHISHING SCANNER</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#f8fafc] uppercase">
              Check Any Link Before You Click
            </h2>
            <p className="text-xs sm:text-sm text-[#94a3b8] font-sans max-w-xl mx-auto leading-relaxed">
              Analyzes uniform resource identifiers for homoglyphs, credential harvesting tricks, typosquatting, and lexical anomaly signatures.
            </p>
          </div>

          {/* Quick Example Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-[10px] text-[#7e8b9b] uppercase font-bold">// TEST BENCHMARK TARGETS:</span>
            {SAMPLE_TARGETS.map((t) => (
              <button
                key={t.label}
                onClick={() => {
                  setUrl(t.url)
                  scanURL(t.url)
                }}
                className="px-3 py-1.5 border border-white/15 bg-[#060a10] hover:border-[#00ff66]/60 hover:text-[#00ff66] text-[#e2e8f0] text-xs transition-colors min-h-[36px] font-mono"
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Tactical Terminal Frame Box */}
          <TacticalFrame variant="panel" reticles className="p-4 sm:p-7 shadow-[0_0_40px_rgba(0,0,0,0.8)] bg-[#03060a]">
            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                scanURL()
              }}
              className="flex flex-col sm:flex-row gap-2 mb-4"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste any link or domain (e.g. https://...)"
                  className="w-full h-11 px-3.5 border border-white/15 bg-[#010204] text-[#f8fafc] text-xs sm:text-sm font-mono outline-none focus:border-[#00ff66] focus:ring-1 focus:ring-[#00ff66]"
                />
              </div>

              <Button
                type="submit"
                disabled={isScanning || !url.trim()}
                className="bg-[#00ff66] hover:bg-[#39ff14] text-[#040608] font-bold text-xs uppercase px-6 h-11 tracking-wider shrink-0 shadow-[0_0_15px_rgba(0,255,102,0.3)]"
              >
                {isScanning ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ANALYZING URL...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2 fill-current" />
                    [ SCAN LINK NOW ]
                  </>
                )}
              </Button>
            </form>

            {/* Scan Result Output Dossier */}
            {scanResult && (
              <div className="border border-white/15 bg-[#020408] p-4 sm:p-5 space-y-4 animate-fade-in">
                {/* Result Header Banner */}
                <div
                  className={`p-4 border text-xs font-sans ${
                    scanResult.verdict === "malicious"
                      ? "border-[#ff003c] bg-[#ff003c]/15 text-[#f8fafc]"
                      : scanResult.verdict === "suspicious"
                      ? "border-[#ffb800] bg-[#ffb800]/15 text-[#f8fafc]"
                      : scanResult.verdict === "unknown"
                      ? "border-blue-500/40 bg-blue-500/10 text-[#f8fafc]"
                      : "border-[#00ff66] bg-[#00ff66]/15 text-[#f8fafc]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                    <div className="flex items-center gap-2 font-mono font-extrabold text-sm uppercase">
                      {scanResult.verdict === "malicious" ? (
                        <>
                          <AlertOctagon className="w-5 h-5 text-[#ff003c]" />
                          <span className="text-[#ff003c]">🚨 MALICIOUS LINK DETECTED</span>
                        </>
                      ) : scanResult.verdict === "suspicious" ? (
                        <>
                          <AlertTriangle className="w-5 h-5 text-[#ffb800]" />
                          <span className="text-[#ffb800]">⚠️ SUSPICIOUS UNVERIFIED LINK</span>
                        </>
                      ) : scanResult.verdict === "unknown" ? (
                        <>
                          <AlertCircle className="w-5 h-5 text-blue-400" />
                          <span className="text-blue-400">ℹ️ UNVERIFIED / OFFLINE ANALYSIS</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-[#00ff66]" />
                          <span className="text-[#00ff66]">✅ VERIFIED CLEAN LINK</span>
                        </>
                      )}
                    </div>

                    <span className="text-[10px] font-mono px-2 py-0.5 border border-white/10 bg-black/40 text-[#94a3b8]">
                      {scanResult.backendOnline ? "ENGINE: FASTAPI ML (ACTIVE)" : "ENGINE: CLIENT HEURISTIC (OFFLINE)"}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold">{scanResult.simpleRecommendation}</p>
                </div>

                {/* Score & Telemetry Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                  <div className="p-3 border border-white/10 bg-[#060a10]">
                    <span className="text-[10px] text-[#7e8b9b] uppercase block">CALCULATED RISK</span>
                    <span
                      className={`text-xl sm:text-2xl font-extrabold ${
                        scanResult.riskScore > 60
                          ? "text-[#ff003c]"
                          : scanResult.riskScore > 25
                          ? "text-[#ffb800]"
                          : "text-[#00ff66]"
                      }`}
                    >
                      {scanResult.riskScore}%
                    </span>
                  </div>

                  <div className="p-3 border border-white/10 bg-[#060a10]">
                    <span className="text-[10px] text-[#7e8b9b] uppercase block">UNICODE HOMOGLYPHS</span>
                    <span className={`text-sm sm:text-base font-bold ${scanResult.hasHomoglyphs ? "text-[#ff003c]" : "text-[#00ff66]"}`}>
                      {scanResult.hasHomoglyphs ? "LOOKALIKE DETECTED" : "CLEAN (ASCII)"}
                    </span>
                  </div>

                  <div className="p-3 border border-white/10 bg-[#060a10]">
                    <span className="text-[10px] text-[#7e8b9b] uppercase block">ENCRYPTION STATUS</span>
                    <span className="text-xs font-mono text-[#f8fafc] block truncate" title={scanResult.tlsGrade}>
                      {scanResult.tlsGrade}
                    </span>
                  </div>

                  <div className="p-3 border border-white/10 bg-[#060a10]">
                    <span className="text-[10px] text-[#7e8b9b] uppercase block">ANALYSIS TIME</span>
                    <span className="text-base sm:text-lg font-bold text-[#00ff66]">
                      {scanResult.responseTime}ms
                    </span>
                  </div>
                </div>

                {/* Evidence & Findings Breakdown */}
                <div className="p-3 border border-white/10 bg-[#03070d] space-y-2">
                  <span className="text-[10px] font-bold text-[#00ff66] uppercase block tracking-wider">
                    // STRUCTURAL EVIDENCE &amp; DIAGNOSTIC SIGNALS:
                  </span>
                  <ul className="space-y-1 text-xs font-mono text-[#cbd5e1]">
                    {scanResult.evidence.map((ev, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-[#00f0ff] font-bold">&gt;</span>
                        <span>{ev}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technical Diagnostic Details */}
                <div className="space-y-1.5 text-xs pt-1">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-[#7e8b9b]">SCANNED ADDRESS:</span>
                    <span className="text-[#f8fafc] font-mono break-all pl-2 text-right">{scanResult.url}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-[#7e8b9b]">DOMAIN REGISTRATION AGE:</span>
                    <span className="text-[#94a3b8] font-mono">{scanResult.domainAge}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-[#7e8b9b]">INFERENCE MODEL:</span>
                    <span className="text-[#f8fafc] font-mono text-[11px]">{scanResult.model}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#7e8b9b]">LIMITATIONS &amp; SCOPE:</span>
                    <span className="text-[#94a3b8] text-[10px] text-right">
                      {scanResult.limitations.join("; ")}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </TacticalFrame>
        </div>
      </div>
    </section>
  )
}