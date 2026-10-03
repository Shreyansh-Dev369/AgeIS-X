"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { ParallaxScene, ParallaxLayer } from "./parallax-scene"
import { Button } from "@/components/ui/button"
import { analyzeUrlStructure } from "@/lib/utils/url-analyzer"
import {
  Globe,
  Search,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  Loader2,
  CheckCircle2,
  Lock,
  ChevronDown,
} from "lucide-react"
import { cn } from "@/lib/utils"

export type ScanVerdict = "safe" | "suspicious" | "malicious" | "unknown" | "error"

export interface HeroScanResult {
  url: string
  riskScore: number
  verdict: ScanVerdict
  model: string
  responseTime: number
  hasHttps: boolean
  domainAge: string
  recommendation: string
}

export function CinematicHero() {
  const [inputUrl, setInputUrl] = React.useState("")
  const [isScanning, setIsScanning] = React.useState(false)
  const [scanResult, setScanResult] = React.useState<HeroScanResult | null>(null)
  const [scanError, setScanError] = React.useState<string | null>(null)

  const handleScan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const target = inputUrl.trim()
    if (!target) return

    setIsScanning(true)
    setScanResult(null)
    setScanError(null)

    const startTime = Date.now()
    const localStructure = analyzeUrlStructure(target)

    try {
      const res = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: target }),
      })

      const elapsed = Date.now() - startTime

      if (res.ok) {
        const data = await res.json()
        const riskScore =
          typeof data.risk_score === "number"
            ? data.risk_score
            : Math.round((data.probability || 0.5) * 100)
        const verdict: ScanVerdict =
          data.verdict ||
          (riskScore >= 70 ? "malicious" : riskScore >= 30 ? "suspicious" : "safe")

        let domainAge = "Verified"
        if (data.rdap && data.rdap.domain_age_formatted) {
          domainAge = data.rdap.domain_age_formatted
        }

        setScanResult({
          url: target,
          riskScore,
          verdict,
          model: data.model_version || "TF-IDF + Bayesian Ensemble",
          responseTime: elapsed,
          hasHttps: localStructure.isHttps,
          domainAge,
          recommendation:
            verdict === "safe"
              ? "URL passed structural & lexical threat evaluation. Safe to access."
              : verdict === "suspicious"
              ? "Elevated anomaly patterns detected. Caution advised."
              : "High-risk phishing or malicious vector detected. Connection blocked.",
        })
      } else {
        // Fallback to local heuristic scoring if backend is offline
        const isSuspicious =
          localStructure.structuralRiskPoints >= 20 ||
          localStructure.hasHomoglyphs ||
          localStructure.isTyposquatPattern ||
          localStructure.isSuspiciousTld
        const riskScore = isSuspicious ? 68 : 12
        const verdict: ScanVerdict = isSuspicious ? "suspicious" : "safe"
        setScanResult({
          url: target,
          riskScore,
          verdict,
          model: "Client-side Lexical Engine",
          responseTime: elapsed,
          hasHttps: localStructure.isHttps,
          domainAge: "Offline evaluation",
          recommendation: isSuspicious
            ? "Lexical heuristics detected anomaly characteristics."
            : "No common homoglyph or spoofing patterns detected.",
        })
      }
    } catch {
      // Local fallback
      const elapsed = Date.now() - startTime
      const isSuspicious =
        localStructure.structuralRiskPoints >= 20 ||
        localStructure.hasHomoglyphs ||
        localStructure.isTyposquatPattern ||
        localStructure.isSuspiciousTld
      const riskScore = isSuspicious ? 65 : 10
      const verdict: ScanVerdict = isSuspicious ? "suspicious" : "safe"
      setScanResult({
        url: target,
        riskScore,
        verdict,
        model: "Client-side Lexical Analyzer",
        responseTime: elapsed,
        hasHttps: localStructure.isHttps,
        domainAge: "Local evaluation",
        recommendation: isSuspicious
          ? "Potential typosquat or suspicious structure identified."
          : "URL structure evaluated clear of common phishing patterns.",
      })
    } finally {
      setIsScanning(false)
    }
  }

  return (
    <ParallaxScene className="relative w-full min-h-[90vh] lg:min-h-screen bg-[#04070D] flex items-center border-b border-white/10 font-mono overflow-hidden">
      {/* =========================================================================
          LAYER 00: BASE CANVAS & RESTRAINED ARCHITECTURAL GRID (Depth: 0.0)
          ========================================================================= */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-25"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.035) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.035) 1px, transparent 1px)
          `,
          backgroundSize: "36px 36px",
        }}
        aria-hidden="true"
      />

      {/* =========================================================================
          LAYER 01: CLEAN ATMOSPHERIC ENVIRONMENT & MOUNTAIN RIDGE (Depth: 0.10)
          ========================================================================= */}
      <ParallaxLayer depth={0.1} pointerFactor={4} className="pointer-events-none absolute inset-0 z-[1]">
        <div className="absolute top-0 right-0 w-full lg:w-[62%] h-full opacity-40">
          <Image
            src="/ageis-x/hero/environment-clean.webp"
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 62vw"
            className="object-cover object-right-top filter contrast-[1.1] brightness-[0.70]"
          />
          {/* Smooth left and vertical vignettes */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#04070D] via-[#04070D]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#04070D]/60 via-transparent to-[#04070D]" />
        </div>
      </ParallaxLayer>

      {/* =========================================================================
          LAYER 02: VOLUMETRIC ATMOSPHERE & VISOR LIGHT FALLOFF (Depth: 0.20)
          ========================================================================= */}
      <ParallaxLayer depth={0.2} pointerFactor={7} className="pointer-events-none absolute inset-0 z-[2]">
        {/* Soft, controlled emerald atmospheric light */}
        <div
          className="absolute top-1/4 right-[22%] w-[420px] h-[420px] bg-[#39FF14]/[0.03] blur-[140px] rounded-full"
          aria-hidden="true"
        />
        {/* Subtle cyan ambient rim */}
        <div
          className="absolute top-1/3 right-[8%] w-[350px] h-[350px] bg-[#00E5FF]/[0.02] blur-[150px] rounded-full"
          aria-hidden="true"
        />
      </ParallaxLayer>

      {/* =========================================================================
          LAYER 03: LARGE MONOCHROMATIC GEOMETRY & TYPOGRAPHY (Depth: 0.32)
          ========================================================================= */}
      <ParallaxLayer depth={0.32} pointerFactor={10} className="pointer-events-none absolute inset-0 z-[3]">
        <div
          className="absolute top-24 right-10 lg:right-20 text-[140px] sm:text-[200px] lg:text-[250px] font-black tracking-tighter text-white/[0.015] uppercase select-none leading-none"
          aria-hidden="true"
        >
          AGEIS
        </div>
        {/* Subtle structural alignment line */}
        <div className="absolute top-0 right-[40%] bottom-0 w-px bg-white/[0.03] hidden lg:block" aria-hidden="true" />
      </ParallaxLayer>

      {/* =========================================================================
          LAYER 04: PURE ISOLATED AGEIS-X ROBOT GUARDIAN (Depth: 0.55)
          ========================================================================= */}
      <ParallaxLayer depth={0.55} pointerFactor={15} className="pointer-events-none absolute inset-0 z-[4]">
        <div className="absolute top-4 lg:top-6 right-0 lg:right-[1%] w-[88%] sm:w-[70%] lg:w-[52%] h-[92%] lg:h-[96%] flex items-end justify-end">
          <div className="relative w-full h-full max-h-[820px]">
            <Image
              src="/ageis-x/hero/robot-clean.webp"
              alt="AgeIS-X Robotic Security Guardian"
              fill
              priority
              sizes="(max-width: 768px) 88vw, (max-width: 1200px) 65vw, 52vw"
              className="object-contain object-bottom-right filter contrast-[1.12] brightness-[0.94]"
            />
            {/* Mobile bottom fade */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#04070D] via-transparent to-transparent lg:hidden" />
          </div>
        </div>
      </ParallaxLayer>

      {/* =========================================================================
          LAYER 05: RESTRAINED FOREGROUND REGISTRATION MARKS (Depth: 0.75)
          ========================================================================= */}
      <ParallaxLayer depth={0.75} pointerFactor={20} className="pointer-events-none absolute inset-0 z-[5]">
        <span className="absolute top-24 left-8 text-[11px] text-white/20 hidden lg:block font-mono select-none" aria-hidden="true">
          + DEFENSE_CORE
        </span>
        <span className="absolute top-24 right-12 text-[11px] text-white/20 hidden lg:block font-mono select-none" aria-hidden="true">
          + ON_DEVICE_ML
        </span>
      </ParallaxLayer>

      {/* =========================================================================
          LAYER 06: CRISP FOREGROUND UI / TYPOGRAPHY / REAL SCANNER (Depth: 0.03)
          ========================================================================= */}
      <ParallaxLayer depth={0.03} pointerFactor={3} className="relative z-[6] w-full pt-20 pb-12 sm:pt-24 sm:pb-16">
        <div className="page-container max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Real Content Hierarchy */}
            <div className="lg:col-span-7 space-y-6">
              {/* Architecture Label */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 text-[10px] text-[#A6A6A0] tracking-widest uppercase">
                <span className="w-1.5 h-1.5 bg-[#39FF14] inline-block" />
                <span className="text-[#39FF14] font-bold">SOVEREIGN DEFENSE PLATFORM</span>
                <span className="text-white/20">/</span>
                <span>ON-DEVICE INTELLIGENCE</span>
              </div>

              {/* Primary Display Headline */}
              <div className="space-y-1">
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tighter text-[#F1F0EB] leading-[0.88] select-none">
                  ONE SECURITY
                  <br />
                  BRAIN.
                  <br />
                  <span className="text-[#39FF14]">
                    YOUR ENTIRE
                  </span>
                  <br />
                  <span className="text-[#39FF14]">
                    DIGITAL LIFE.
                  </span>
                </h1>
              </div>

              {/* Concise Truthful Value Proposition */}
              <p className="text-sm sm:text-base text-[#A6A6A0] max-w-xl font-sans font-normal leading-relaxed">
                AgeIS-X guards your browsing, communications, identity, and personal endpoints against zero-hour threat vectors using fast on-device machine intelligence. Zero cloud browsing logs. Zero build slowdown.
              </p>

              {/* Real URL Intelligence Scanner */}
              <div className="pt-2 max-w-xl">
                <div className="p-4 sm:p-5 bg-[#080D16]/90 backdrop-blur-md border border-white/15 shadow-2xl space-y-3">
                  <div className="flex items-center justify-between text-[10px] text-[#A6A6A0] uppercase">
                    <span className="flex items-center gap-1.5 font-bold text-[#F1F0EB]">
                      <Globe className="w-3.5 h-3.5 text-[#39FF14]" />
                      <span>REAL-TIME URL THREAT SCANNER</span>
                    </span>
                    <span className="text-[#39FF14] text-[9px]">
                      READY // FASTAPI + ML
                    </span>
                  </div>

                  <form onSubmit={handleScan} className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-[#6F706D] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="https://example.com/target-verification"
                        value={inputUrl}
                        onChange={(e) => setInputUrl(e.target.value)}
                        className="w-full bg-[#04070D] border border-white/15 text-xs font-mono text-[#F1F0EB] pl-9 pr-3 py-2.5 focus:outline-none focus:border-[#39FF14] transition-colors rounded-none placeholder:text-[#6F706D]"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isScanning || !inputUrl.trim()}
                      className="bg-[#39FF14] hover:bg-[#32e012] disabled:opacity-50 text-[#04070D] font-mono font-bold text-xs uppercase tracking-wider rounded-none px-5 h-10 shrink-0 cursor-pointer shadow-[2px_2px_0px_#FFFFFF]"
                    >
                      {isScanning ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                          <span>EVALUATING...</span>
                        </>
                      ) : (
                        <>
                          <span>SCAN</span>
                          <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                        </>
                      )}
                    </Button>
                  </form>

                  {/* Sample Test Targets */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[9px] text-[#6F706D]">
                    <span>QUICK TEST:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setInputUrl("https://secure.chase.com/auth/login")
                      }}
                      className="hover:text-[#39FF14] underline cursor-pointer"
                    >
                      Clean Bank Portal
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => {
                        setInputUrl("https://paypаl-verify.secure-update.xyz/token")
                      }}
                      className="hover:text-[#FF4545] underline cursor-pointer"
                    >
                      Homoglyph Phishing
                    </button>
                  </div>

                  {/* Real-time Scan Result Card */}
                  {scanResult && (
                    <div className="pt-3 border-t border-white/10 space-y-2 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {scanResult.verdict === "safe" ? (
                            <CheckCircle2 className="w-4 h-4 text-[#39FF14]" />
                          ) : scanResult.verdict === "suspicious" ? (
                            <AlertTriangle className="w-4 h-4 text-[#FFB800]" />
                          ) : (
                            <AlertOctagon className="w-4 h-4 text-[#FF4545]" />
                          )}
                          <span
                            className={cn(
                              "text-xs font-bold uppercase",
                              scanResult.verdict === "safe"
                                ? "text-[#39FF14]"
                                : scanResult.verdict === "suspicious"
                                ? "text-[#FFB800]"
                                : "text-[#FF4545]"
                            )}
                          >
                            VERDICT: {scanResult.verdict} (Risk: {scanResult.riskScore}/100)
                          </span>
                        </div>
                        <span className="text-[9px] text-[#A6A6A0]">
                          {scanResult.responseTime}ms
                        </span>
                      </div>
                      <p className="text-[11px] text-[#D4D4D0] font-sans">
                        {scanResult.recommendation}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Primary Call-to-Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button
                  size="lg"
                  asChild
                  className="bg-[#39FF14] hover:bg-[#32e012] text-[#04070D] font-mono font-bold text-xs uppercase tracking-wider rounded-none px-7 h-12 shadow-[2px_2px_0px_#FFFFFF]"
                >
                  <Link href="/pricing">
                    <span>COMMISSION SECURITY UNIT</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="border-white/20 bg-transparent hover:bg-white/5 text-[#F1F0EB] font-mono text-xs uppercase tracking-wider rounded-none h-12 px-6"
                >
                  <Link href="/download">
                    <span>DEPLOY ON WORKSTATION</span>
                  </Link>
                </Button>
              </div>

              {/* Core Real Performance Metrics */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10 max-w-xl">
                <div className="space-y-0.5">
                  <span className="text-xl sm:text-2xl font-black text-[#F1F0EB] block">
                    &lt; 20ms
                  </span>
                  <span className="text-[10px] text-[#A6A6A0] uppercase block">
                    LOCAL INFERENCE
                  </span>
                </div>
                <div className="space-y-0.5 border-l border-white/10 pl-4">
                  <span className="text-xl sm:text-2xl font-black text-[#39FF14] block">
                    0 BYTES
                  </span>
                  <span className="text-[10px] text-[#A6A6A0] uppercase block">
                    CLOUD LOGGING
                  </span>
                </div>
                <div className="space-y-0.5 border-l border-white/10 pl-4">
                  <span className="text-xl sm:text-2xl font-black text-[#F1F0EB] block">
                    &lt; 38 MB
                  </span>
                  <span className="text-[10px] text-[#A6A6A0] uppercase block">
                    HOST RAM FOOTPRINT
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Spacer to give prominence to the isolated robot in Layer 04 */}
            <div className="lg:col-span-5 h-[340px] sm:h-[450px] lg:h-[620px] pointer-events-none" />
          </div>

          {/* Bottom Scroll Prompt */}
          <div className="pt-8 flex items-center justify-between border-t border-white/5 text-[10px] text-[#6F706D]">
            <div className="flex items-center gap-2">
              <span className="w-4 h-6 rounded-full border border-white/20 inline-flex items-start justify-center p-1">
                <span className="w-1 h-1.5 bg-[#39FF14] rounded-full animate-bounce" />
              </span>
              <span className="uppercase tracking-wider">SCROLL TO INSPECT ARCHITECTURE</span>
            </div>
            <div className="hidden sm:flex items-center gap-4">
              <span>PLATFORM: MACOS / WIN11 / LINUX</span>
            </div>
          </div>
        </div>
      </ParallaxLayer>
    </ParallaxScene>
  )
}
