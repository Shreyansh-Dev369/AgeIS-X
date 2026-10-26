"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { ParallaxScene, ParallaxLayer } from "./parallax-scene"
import { MagneticButton } from "./magnetic-button"
import { Button } from "@/components/ui/button"
import { analyzeUrlStructure } from "@/lib/utils/url-analyzer"
import { getApiBaseUrl } from "@/lib/config/api"
import {
  Globe,
  Search,
  ArrowRight,
  AlertTriangle,
  AlertOctagon,
  Loader2,
  CheckCircle2,
  Shield,
  Zap,
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

  const handleScan = async (e?: React.FormEvent, overrideUrl?: string) => {
    if (e) e.preventDefault()
    const target = (overrideUrl || inputUrl).trim()
    if (!target) return
    if (overrideUrl) setInputUrl(overrideUrl)

    setIsScanning(true)
    setScanResult(null)

    const startTime = Date.now()
    const localStructure = analyzeUrlStructure(target)

    try {
      const res = await fetch(`${getApiBaseUrl()}/predict`, {
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
    <ParallaxScene
      id="hero"
      enablePointer={true}
      pointerDamping={0.045}
      className="relative w-full min-h-[90vh] lg:min-h-[94vh] bg-[#04060A] flex items-center border-b border-white/10 font-mono overflow-hidden"
    >
      {/* LAYER 00: BASE CANVAS & TECHNICAL GRID */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(57, 255, 20, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(57, 255, 20, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
        aria-hidden="true"
      />

      {/* LAYER 01: ATMOSPHERIC MOUNTAIN RIDGE BACKGROUND */}
      <ParallaxLayer
        depth={0.08}
        pointerFactor={6}
        scrollFactor={0.05}
        className="pointer-events-none absolute inset-0 z-[1]"
      >
        <div className="absolute top-0 right-0 w-full lg:w-[62%] h-full opacity-40">
          <Image
            src="/ageis-x/hero/environment-clean.webp"
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 62vw"
            className="object-cover object-right-top filter contrast-[1.15] brightness-[0.7]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#04060A] via-[#04060A]/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#04060A]/60 via-transparent to-[#04060A]" />
        </div>
      </ParallaxLayer>

      {/* LAYER 02: VOLUMETRIC EMERALD & CYAN ATMOSPHERE */}
      <ParallaxLayer
        depth={0.16}
        pointerFactor={10}
        scrollFactor={0.08}
        className="pointer-events-none absolute inset-0 z-[2]"
      >
        <div
          className="absolute top-1/4 right-[16%] w-[600px] h-[600px] bg-[#39FF14]/[0.08] blur-[160px] rounded-full animate-hero-glow"
          aria-hidden="true"
        />
        <div
          className="absolute top-1/3 right-[2%] w-[450px] h-[450px] bg-[#00E5FF]/[0.05] blur-[170px] rounded-full animate-hero-glow"
          style={{ animationDelay: "2.5s" }}
          aria-hidden="true"
        />
      </ParallaxLayer>

      {/* LAYER 03: 3D AGEIS-X ROBOT GUARDIAN (CLEAN, HEROIC PRESENTATION) */}
      <ParallaxLayer
        depth={0.45}
        pointerFactor={20}
        scrollFactor={0.2}
        className="pointer-events-none absolute inset-0 z-[3]"
      >
        <div className="absolute top-0 right-0 w-full sm:w-[85%] md:w-[70%] lg:w-[56%] xl:w-[50%] 2xl:w-[48%] h-full flex items-end justify-end pointer-events-none">
          <div className="relative w-full h-[88%] sm:h-[92%] lg:h-[96%] max-h-[880px] animate-hero-float opacity-40 sm:opacity-65 lg:opacity-100 transition-opacity duration-300">
            {/* Robot Artwork */}
            <Image
              src="/ageis-x/hero/robot-clean.webp"
              alt="AgeIS-X Sovereign Robotic Security Guardian"
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 52vw"
              className="object-contain object-bottom-right filter contrast-[1.12] brightness-[0.98]"
            />

            {/* Radiant Volumetric Backlight */}
            <div
              className="absolute inset-0 bg-radial from-[#39FF14]/[0.1] via-transparent to-transparent pointer-events-none mix-blend-screen"
              aria-hidden="true"
            />

            {/* Mobile Bottom Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#04060A] via-transparent to-transparent lg:hidden" />

            {/* Sleek Corner Telemetry Pill (Framing the Robot Without Obscuring) */}
            <div className="absolute bottom-6 right-6 hidden xl:flex items-center gap-2.5 px-3 py-1.5 bg-[#04060A]/85 border border-white/15 backdrop-blur-md text-[10px] text-[#A6A6A0] font-mono shadow-2xl">
              <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14] animate-pulse" />
              <span className="text-[#F1F0EB] font-bold tracking-wider">SOVEREIGN ENCLAVE</span>
              <span className="text-white/20">|</span>
              <span className="text-[#39FF14] font-bold">P99 &lt; 14ms</span>
            </div>
          </div>
        </div>
      </ParallaxLayer>

      {/* LAYER 04: CRISP FOREGROUND EDITORIAL CONTENT & SCANNER */}
      <div className="relative z-10 w-full pt-16 pb-10 lg:pt-16 lg:pb-12 pointer-events-auto">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-5">
              {/* Architecture Badge */}
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-white/[0.04] border border-white/10 text-[10px] text-[#A6A6A0] uppercase font-mono">
                <span className="w-1.5 h-1.5 bg-[#39FF14] inline-block animate-pulse" />
                <span className="text-[#39FF14] font-black tracking-wider">SOVEREIGN DEFENSE PLATFORM</span>
                <span className="text-white/20">/</span>
                <span>ON-DEVICE AI</span>
              </div>

              {/* High-Impact Editorial Display Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-[70px] font-black uppercase tracking-tight text-[#F1F0EB] leading-[0.94] font-mono">
                <span>ONE SECURITY BRAIN.</span>
                <br />
                <span className="text-[#39FF14] drop-shadow-[0_0_25px_rgba(57,255,20,0.35)]">
                  YOUR ENTIRE DIGITAL LIFE.
                </span>
              </h1>

              {/* Concise Subheadline */}
              <p className="text-xs sm:text-sm lg:text-base text-[#A6A6A0] max-w-xl font-sans leading-relaxed">
                AgeIS-X defends your browsing, communications, and identity against zero-hour threats with fast on-device machine intelligence. <strong className="text-[#F1F0EB]">Zero cloud browsing logs. Zero build slowdown.</strong>
              </p>

              {/* Primary Action Buttons Bar */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <MagneticButton strength={4}>
                  <Button
                    size="lg"
                    className="bg-[#39FF14] hover:bg-[#32E012] text-[#04060A] font-mono font-black text-xs uppercase tracking-wider rounded-none px-6 h-11 shadow-[0_0_25px_rgba(57,255,20,0.35)]"
                    asChild
                  >
                    <Link href="/pricing">
                      <span>COMMISSION UNIT</span>
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Link>
                  </Button>
                </MagneticButton>

                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 bg-transparent hover:bg-white/10 text-[#F1F0EB] hover:border-[#39FF14]/50 hover:text-[#39FF14] font-mono text-xs uppercase tracking-wider rounded-none h-11 px-5 transition-colors"
                  asChild
                >
                  <Link href="#defense-lab">
                    <Zap className="w-3.5 h-3.5 mr-1.5 text-[#39FF14]" />
                    <span>SIMULATE ATTACK</span>
                  </Link>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 bg-transparent hover:bg-white/10 text-[#F1F0EB] hover:border-[#00E5FF]/50 hover:text-[#00E5FF] font-mono text-xs uppercase tracking-wider rounded-none h-11 px-5 transition-colors hidden sm:inline-flex"
                  asChild
                >
                  <Link href="#fleet">
                    <Shield className="w-3.5 h-3.5 mr-1.5 text-[#00E5FF]" />
                    <span>INSPECT FLEET</span>
                  </Link>
                </Button>
              </div>

              {/* URL Intelligence Scanner */}
              <div className="pt-2 max-w-xl">
                <div className="p-3.5 sm:p-4 bg-[#080D14]/95 backdrop-blur-md border border-white/15 shadow-2xl space-y-2.5 transition-[border-color,box-shadow] duration-200 focus-within:border-[#39FF14] focus-within:shadow-[0_0_30px_rgba(57,255,20,0.2)]">
                  <div className="flex items-center justify-between text-[10px] uppercase">
                    <span className="flex items-center gap-1.5 font-bold text-[#F1F0EB] tracking-wider font-mono">
                      <Globe className="w-3.5 h-3.5 text-[#39FF14]" />
                      <span>URL INTELLIGENCE SCANNER</span>
                    </span>
                    <span className="text-[#39FF14] text-[10px] font-mono font-bold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-[#39FF14] inline-block animate-pulse" />
                      <span>ENGINE READY</span>
                    </span>
                  </div>

                  <form onSubmit={handleScan} className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <Search className="w-3.5 h-3.5 text-[#6F706D] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="https://example.com/target-verification"
                        value={inputUrl}
                        onChange={(e) => setInputUrl(e.target.value)}
                        className="w-full bg-[#04060A] border border-white/15 text-xs font-mono text-[#F1F0EB] pl-8 pr-3 py-2 focus:outline-none focus:border-[#39FF14] transition-colors rounded-none placeholder:text-[#6F706D]"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isScanning || !inputUrl.trim()}
                      className="bg-[#39FF14] hover:bg-[#32E012] disabled:opacity-50 text-[#04060A] font-mono font-black text-xs uppercase tracking-wider rounded-none px-5 h-9 shrink-0 cursor-pointer shadow-[0_0_20px_rgba(57,255,20,0.3)] w-full sm:w-auto"
                    >
                      {isScanning ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin mr-1" />
                          <span>EVALUATING...</span>
                        </>
                      ) : (
                        <>
                          <span>SCAN NOW</span>
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </>
                      )}
                    </Button>
                  </form>

                  {/* Quick Test Chips */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[9px] text-[#6F706D] pt-0.5">
                    <span className="uppercase text-[#A6A6A0]">QUICK TEST:</span>
                    <button
                      type="button"
                      onClick={() => handleScan(undefined, "https://secure.chase.com/auth/login")}
                      className="px-1.5 py-0.5 bg-white/5 border border-white/10 hover:border-[#39FF14] hover:text-[#39FF14] text-[#A6A6A0] transition-colors cursor-pointer"
                    >
                      Clean Bank
                    </button>
                    <button
                      type="button"
                      onClick={() => handleScan(undefined, "https://paypаl-verify.secure-update.xyz/token")}
                      className="px-1.5 py-0.5 bg-white/5 border border-white/10 hover:border-[#FF4545] hover:text-[#FF4545] text-[#A6A6A0] transition-colors cursor-pointer"
                    >
                      Homoglyph Phish
                    </button>
                    <button
                      type="button"
                      onClick={() => handleScan(undefined, "http://185.220.101.9:8080/payload.elf")}
                      className="px-1.5 py-0.5 bg-white/5 border border-white/10 hover:border-amber-400 hover:text-amber-400 text-[#A6A6A0] transition-colors cursor-pointer"
                    >
                      Raw IP
                    </button>
                  </div>

                  {/* Scan Result */}
                  {scanResult && (
                    <div className="pt-2.5 border-t border-white/10 space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          {scanResult.verdict === "safe" ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#39FF14]" />
                          ) : scanResult.verdict === "suspicious" ? (
                            <AlertTriangle className="w-3.5 h-3.5 text-[#FFB800]" />
                          ) : (
                            <AlertOctagon className="w-3.5 h-3.5 text-[#FF4545]" />
                          )}
                          <span
                            className={cn(
                              "text-xs font-bold uppercase font-mono",
                              scanResult.verdict === "safe"
                                ? "text-[#39FF14]"
                                : scanResult.verdict === "suspicious"
                                ? "text-[#FFB800]"
                                : "text-[#FF4545]"
                            )}
                          >
                            VERDICT: {scanResult.verdict} ({scanResult.riskScore}/100)
                          </span>
                        </div>
                        <span className="text-[9px] text-[#A6A6A0] font-mono">
                          {scanResult.responseTime}ms
                        </span>
                      </div>
                      <p className="text-[11px] text-[#D4D4D0] font-sans leading-relaxed">
                        {scanResult.recommendation}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Above-the-fold Telemetry Metrics */}
              <div className="grid grid-cols-3 gap-2 sm:gap-6 pt-3 border-t border-white/10 max-w-xl font-mono text-xs">
                <div>
                  <span className="text-sm sm:text-base font-black text-[#F1F0EB] block">&lt; 18ms</span>
                  <span className="text-[8px] sm:text-[9px] text-[#A6A6A0] uppercase block tracking-wider">
                    LOCAL INFERENCE
                  </span>
                </div>
                <div className="border-l border-white/10 pl-3">
                  <span className="text-sm sm:text-base font-black text-[#39FF14] block">0 BYTES</span>
                  <span className="text-[8px] sm:text-[9px] text-[#A6A6A0] uppercase block tracking-wider">
                    CLOUD LOGGING
                  </span>
                </div>
                <div className="border-l border-white/10 pl-3">
                  <span className="text-sm sm:text-base font-black text-[#F1F0EB] block">&lt; 38 MB</span>
                  <span className="text-[8px] sm:text-[9px] text-[#A6A6A0] uppercase block tracking-wider">
                    HOST RAM
                  </span>
                </div>
              </div>
            </div>

            {/* Right Spacer Column (Framer for Robot in Layer 03) */}
            <div className="lg:col-span-5 h-20 sm:h-32 lg:h-[620px] pointer-events-none" />
          </div>
        </div>
      </div>
    </ParallaxScene>
  )
}
