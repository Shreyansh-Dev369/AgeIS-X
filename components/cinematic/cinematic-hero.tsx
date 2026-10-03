"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { ParallaxScene, ParallaxLayer } from "./parallax-scene"
import { URLScanner } from "@/components/url-scanner"
import { Button } from "@/components/ui/button"
import {
  Globe,
  ShieldCheck,
  ArrowRight,
  Cpu,
  Terminal,
  Activity,
  ChevronDown,
  Layers,
  Search,
} from "lucide-react"
import { cn } from "@/lib/utils"

export function CinematicHero() {
  const [quickScanUrl, setQuickScanUrl] = React.useState("")
  const [scannerActive, setScannerActive] = React.useState(false)

  return (
    <ParallaxScene className="relative w-full min-h-[92vh] lg:min-h-screen bg-[#050505] flex items-center border-b border-white/10 font-mono">
      {/* =========================================================================
          LAYER 0: BASE CANVAS & TECHNICAL GRID (Depth: 0.0)
          ========================================================================= */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
        }}
        aria-hidden="true"
      />

      {/* =========================================================================
          LAYER 1: DISTANT CELESTIAL HORIZON & MOUNTAIN RIDGE (Depth: 0.12)
          ========================================================================= */}
      <ParallaxLayer depth={0.12} pointerFactor={6} className="pointer-events-none absolute inset-0 z-[1]">
        <div className="absolute top-0 right-0 w-full lg:w-[65%] h-full opacity-45">
          <Image
            src="/ageis-x/hero/environment-mountains.webp"
            alt="Distant atmospheric horizon"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 65vw"
            className="object-cover object-right-top filter contrast-[1.1] brightness-[0.75]"
          />
          {/* Subtle horizontal gradient blend to left side */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/50 via-transparent to-[#050505]" />
        </div>
      </ParallaxLayer>

      {/* =========================================================================
          LAYER 2: VOLUMETRIC ATMOSPHERE & SPECTRAL ILLUMINATION (Depth: 0.22)
          ========================================================================= */}
      <ParallaxLayer depth={0.22} pointerFactor={10} className="pointer-events-none absolute inset-0 z-[2]">
        {/* Soft emerald atmospheric bloom around the robot's visor */}
        <div
          className="absolute top-1/4 right-[25%] w-[450px] h-[450px] bg-[#39FF14]/[0.035] blur-[130px] rounded-full"
          aria-hidden="true"
        />
        {/* Deep cyan rim lighting behind silhouette */}
        <div
          className="absolute top-1/3 right-[10%] w-[380px] h-[380px] bg-[#00E5FF]/[0.025] blur-[140px] rounded-full"
          aria-hidden="true"
        />
      </ParallaxLayer>

      {/* =========================================================================
          LAYER 3: GEOMETRIC ARCHITECTURE & OVERSIZED TYPOGRAPHY (Depth: 0.35)
          ========================================================================= */}
      <ParallaxLayer depth={0.35} pointerFactor={14} className="pointer-events-none absolute inset-0 z-[3]">
        {/* Giant Monochromatic Typography Fragment */}
        <div
          className="absolute top-20 right-8 lg:right-16 text-[130px] sm:text-[180px] lg:text-[230px] font-black tracking-tighter text-white/[0.018] uppercase select-none leading-none"
          aria-hidden="true"
        >
          AGEIS
        </div>

        {/* Structural Alignment Lines */}
        <div className="absolute top-0 right-[42%] bottom-0 w-px bg-white/[0.04] hidden lg:block" aria-hidden="true" />
        <div className="absolute top-28 left-0 right-0 h-px bg-white/[0.03] hidden lg:block" aria-hidden="true" />

        {/* Tactical Pillars Stack on far right */}
        <div className="absolute top-36 right-8 hidden xl:flex flex-col gap-3 text-[10px] tracking-widest text-[#6F706D] select-none text-right">
          <span className="text-[#39FF14] font-bold">DETECT</span>
          <span>ANALYZE</span>
          <span>PROTECT</span>
          <span>RESPOND</span>
        </div>
      </ParallaxLayer>

      {/* =========================================================================
          LAYER 4: MAIN AGEIS-X ROBOT GUARDIAN (Depth: 0.55)
          ========================================================================= */}
      <ParallaxLayer depth={0.55} pointerFactor={18} className="pointer-events-none absolute inset-0 z-[4]">
        <div className="absolute top-4 lg:top-8 right-0 lg:right-[-2%] w-[85%] sm:w-[68%] lg:w-[54%] h-[92%] lg:h-[96%] flex items-end justify-end">
          <div className="relative w-full h-full max-h-[820px]">
            <Image
              src="/ageis-x/hero/robot-isolated.webp"
              alt="AgeIS-X Cyber Defense Guardian Unit"
              fill
              priority
              sizes="(max-width: 768px) 85vw, (max-width: 1200px) 60vw, 50vw"
              className="object-contain object-bottom-right filter contrast-[1.12] brightness-[0.92]"
            />
            {/* Edge fade gradient ensuring smooth blend on mobile */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent lg:hidden" />
          </div>
        </div>
      </ParallaxLayer>

      {/* =========================================================================
          LAYER 5: FOREGROUND TECHNICAL ANNOTATIONS & TELEMETRY (Depth: 0.80)
          ========================================================================= */}
      <ParallaxLayer depth={0.8} pointerFactor={24} className="pointer-events-none absolute inset-0 z-[5]">
        {/* Precision Registration Marks (+) */}
        <div className="absolute top-24 left-8 text-xs text-white/30 hidden lg:block">+ SEC_INGRESS // 01</div>
        <div className="absolute top-24 right-10 text-xs text-white/30 hidden lg:block">+ SENSOR_PAYLOAD_V2</div>
        <div className="absolute bottom-16 right-10 text-[10px] text-white/25 hidden lg:block text-right">
          <span>AGEIS-X DEFENSE PLATFORM</span>
          <br />
          <span className="text-[#39FF14]">BUILD 2026.04 // STABLE</span>
        </div>

        {/* Live Status Telemetry Pill on Top Right */}
        <div className="absolute top-28 right-8 hidden sm:flex flex-col items-end gap-1 text-[9px] text-[#A6A6A0] bg-[#050505]/80 backdrop-blur-md p-2.5 border border-white/10">
          <div className="flex items-center gap-1.5 text-[#39FF14]">
            <span className="w-1.5 h-1.5 bg-[#39FF14] inline-block animate-pulse" />
            <span className="font-bold">&gt; SYSTEM ONLINE</span>
          </div>
          <div>&gt; THREAT INTELLIGENCE ACTIVE</div>
          <div className="text-[#39FF14]">&gt; PROTECTION LEVEL: OPTIMAL</div>
        </div>
      </ParallaxLayer>

      {/* =========================================================================
          LAYER 6: CRISP INTERACTION LAYER / TYPOGRAPHY / SCANNER (Depth: 0.04)
          ========================================================================= */}
      <ParallaxLayer depth={0.04} pointerFactor={4} className="relative z-[6] w-full pt-20 pb-14 sm:pt-24 sm:pb-20">
        <div className="page-container max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-7">
              {/* Kicker Tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 text-[11px] text-[#A6A6A0] tracking-widest uppercase">
                <span className="text-[#39FF14] font-bold">[ CYBER DEFENSE PLATFORM ]</span>
                <span className="text-white/20">/</span>
                <span>NEURAL SURVEILLANCE</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-1">
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tighter text-[#F1F0EB] leading-[0.90] select-none">
                  ONE SECURITY
                  <br />
                  BRAIN.
                  <br />
                  <span className="text-[#39FF14] drop-shadow-[0_0_20px_rgba(57,255,20,0.25)]">
                    YOUR ENTIRE
                  </span>
                  <br />
                  <span className="text-[#39FF14] drop-shadow-[0_0_20px_rgba(57,255,20,0.25)]">
                    DIGITAL LIFE.
                  </span>
                </h1>
              </div>

              {/* Truth-aligned Value Proposition */}
              <p className="text-sm sm:text-base text-[#D4D4D0] max-w-xl font-sans font-normal leading-relaxed">
                AgeIS-X combines on-device machine intelligence, real-time URL & phishing vector analysis, and proactive endpoint defense to guard your browsing, identity, and workstations.
              </p>

              {/* Integrated Live URL Threat Scanner Trigger / Box */}
              <div className="pt-2 max-w-xl">
                <div className="p-4 sm:p-5 bg-[#080808]/90 backdrop-blur-md border border-white/15 shadow-2xl space-y-3">
                  <div className="flex items-center justify-between text-[10px] text-[#A6A6A0] uppercase">
                    <span className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-[#39FF14]" />
                      <span>URL INTELLIGENCE SCANNER</span>
                    </span>
                    <span className="text-[#39FF14] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-[#39FF14] inline-block animate-pulse" />
                      ENGINE READY
                    </span>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      setScannerActive(true)
                      const el = document.getElementById("hero-scanner-section")
                      if (el) {
                        el.scrollIntoView({ behavior: "smooth", block: "start" })
                      }
                    }}
                    className="flex flex-col sm:flex-row gap-2"
                  >
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-[#6F706D] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="https://example.com/target-verification"
                        value={quickScanUrl}
                        onChange={(e) => setQuickScanUrl(e.target.value)}
                        className="w-full bg-[#040404] border border-white/10 text-xs font-mono text-[#F1F0EB] pl-9 pr-3 py-2.5 focus:outline-none focus:border-[#39FF14] transition-colors rounded-none placeholder:text-[#6F706D]"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="bg-[#39FF14] hover:bg-[#32e012] text-[#050505] font-mono font-bold text-xs uppercase tracking-wider rounded-none px-5 h-10 shrink-0 cursor-pointer shadow-[2px_2px_0px_#FFFFFF]"
                    >
                      <span>SCAN NOW</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </form>

                  <div className="flex items-center justify-between text-[9px] text-[#6F706D] pt-1">
                    <span>● READY | REAL-TIME DOMAIN / WEB / PHISHING ANALYSIS</span>
                    <span className="hidden sm:inline">SHA-256 HASHED</span>
                  </div>
                </div>
              </div>

              {/* Metrics & Operational Pillars Strip */}
              <div className="grid grid-cols-3 gap-4 pt-2 border-t border-white/10 max-w-xl">
                <div className="space-y-0.5">
                  <span className="text-xl sm:text-2xl font-black text-[#F1F0EB] block">24/7</span>
                  <span className="text-[10px] text-[#A6A6A0] uppercase block">MONITORING</span>
                </div>
                <div className="space-y-0.5 border-l border-white/10 pl-4">
                  <span className="text-xl sm:text-2xl font-black text-[#39FF14] block">ON-DEVICE</span>
                  <span className="text-[10px] text-[#A6A6A0] uppercase block">INFERENCE</span>
                </div>
                <div className="space-y-0.5 border-l border-white/10 pl-4">
                  <span className="text-xl sm:text-2xl font-black text-[#F1F0EB] block">ZERO-LOG</span>
                  <span className="text-[10px] text-[#A6A6A0] uppercase block">ENCLAVE</span>
                </div>
              </div>
            </div>

            {/* Right Column: Spacer to allow the robot layer behind to show gracefully */}
            <div className="lg:col-span-5 h-[340px] sm:h-[450px] lg:h-[600px] pointer-events-none" />
          </div>

          {/* Bottom Scroll Indicator */}
          <div className="pt-10 flex items-center justify-between border-t border-white/5 text-[10px] text-[#6F706D]">
            <div className="flex items-center gap-2">
              <span className="w-4 h-6 rounded-full border border-white/20 inline-flex items-start justify-center p-1">
                <span className="w-1 h-1.5 bg-[#39FF14] rounded-full animate-bounce" />
              </span>
              <span className="uppercase tracking-wider">SCROLL TO EXPLORE ARCHITECTURE</span>
            </div>
            <div className="hidden sm:flex items-center gap-4">
              <span>LATENCY: &lt; 20MS</span>
              <span className="text-white/20">|</span>
              <span>PLATFORM: MACOS / WIN11 / LINUX</span>
            </div>
          </div>
        </div>
      </ParallaxLayer>

      {/* Embedded Anchor for Scanner */}
      <div id="hero-scanner-section" />
    </ParallaxScene>
  )
}
