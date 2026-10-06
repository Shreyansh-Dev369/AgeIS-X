"use client"

import React, { useState, useEffect, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  PixelScoutGlyph,
  PixelGuardGlyph,
  PixelSentinelGlyph,
  PixelAegisGlyph,
  BarcodeGraphic,
  RegistrationMark,
} from "@/components/pricing/robot-pixel-sprites"
import {
  ShieldCheck,
  ShieldAlert,
  Cpu,
  Fingerprint,
  Radio,
  Lock,
  Zap,
  Terminal,
  SkipForward,
  CheckCircle2,
  Globe,
  Sparkles,
  Server,
  Code2,
} from "lucide-react"
import { cyberAudio } from "@/lib/cyber-sound"
import { cn } from "@/lib/utils"

export interface PreloaderProps {
  onComplete: () => void
  duration?: number
}

const BOOT_STAGES = [
  {
    step: "01",
    name: "ENCLAVE KEY ATTESTATION",
    protocol: "AES-256-GCM // TPM 2.0",
    detail: "Validating host enclave key material and zero-trust sandbox boundaries.",
    threshold: 20,
    icon: Fingerprint,
  },
  {
    step: "02",
    name: "LEXICAL INGESTION ENGINE",
    protocol: "N-GRAM VECTORIZER",
    detail: "Loading sliding window 3-to-5 character tokenization into RAM.",
    threshold: 48,
    icon: Cpu,
  },
  {
    step: "03",
    name: "LOCAL INFERENCE LOOP",
    protocol: "p99 < 18ms LATENCY",
    detail: "Arming sub-20ms NLP classification heuristics and homoglyph defense.",
    threshold: 75,
    icon: Radio,
  },
  {
    step: "04",
    name: "GUARDIAN FLEET ONLINE",
    protocol: "4/4 AUTONOMOUS UNITS",
    detail: "Scout, Guard, Sentinel, and Aegis units synchronized across perimeter.",
    threshold: 95,
    icon: ShieldCheck,
  },
]

const GUARDIAN_FLEET = [
  { id: "01", name: "SCOUT", role: "RECON", glyph: PixelScoutGlyph, code: "SX-01", target: 22 },
  { id: "02", name: "GUARD", role: "DEFENSE", glyph: PixelGuardGlyph, code: "SX-02", target: 48 },
  { id: "03", name: "SENTINEL", role: "ANALYZE", glyph: PixelSentinelGlyph, code: "SX-03", target: 74 },
  { id: "04", name: "AEGIS", role: "ENCLAVE", glyph: PixelAegisGlyph, code: "SX-04", target: 95 },
]

export function Preloader({ onComplete, duration = 2600 }: PreloaderProps) {
  const [progress, setProgress] = useState(0)
  const [isExiting, setIsExiting] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [hexMemory, setHexMemory] = useState("0x7FFF8A109E2B")

  // Current active stage
  const activeStage = useMemo(() => {
    if (progress < 25) return BOOT_STAGES[0]
    if (progress < 52) return BOOT_STAGES[1]
    if (progress < 78) return BOOT_STAGES[2]
    return BOOT_STAGES[3]
  }, [progress])

  const handleComplete = useCallback(() => {
    setIsExiting(true)
    try {
      cyberAudio.playSuccess()
    } catch {}
    setTimeout(onComplete, 450)
  }, [onComplete])

  const skipIntro = () => {
    try {
      cyberAudio.playKeyClick()
    } catch {}
    handleComplete()
  }

  // Keyboard shortcut (Escape or Space to skip)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " ") {
        skipIntro()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleComplete])

  useEffect(() => {
    setMounted(true)
    try {
      cyberAudio.playSonar()
    } catch {}

    const startTime = Date.now()
    let animationFrame: number

    const updateProgress = () => {
      const elapsed = Date.now() - startTime
      const newProgress = Math.min((elapsed / duration) * 100, 100)
      setProgress(newProgress)

      // Dynamic hex hash ticker
      if (Math.random() > 0.4) {
        const randHex = Math.floor(Math.random() * 0xffffffffffff)
          .toString(16)
          .toUpperCase()
          .padStart(12, "0")
        setHexMemory(`0x${randHex}`)
      }

      if (newProgress >= 100) {
        setTimeout(handleComplete, 200)
      } else {
        animationFrame = requestAnimationFrame(updateProgress)
      }
    }

    animationFrame = requestAnimationFrame(updateProgress)
    return () => cancelAnimationFrame(animationFrame)
  }, [duration, handleComplete])

  const formatProgress = Math.floor(progress).toString().padStart(3, "0")

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          className="fixed inset-0 z-[999999] flex flex-col justify-between min-h-screen overflow-hidden bg-[#03060B] p-4 sm:p-8 font-mono select-none"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.03,
            filter: "blur(12px)",
            transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
          }}
        >
          {/* =========================================================================
              LAYER 00: ARCHITECTURAL MATRIX GRID & LASER SCANNER
              ========================================================================= */}
          <div
            className="absolute inset-0 pointer-events-none opacity-25"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
              `,
              backgroundSize: "36px 36px",
            }}
          />

          {/* Sweeping Laser Scan Line */}
          <motion.div
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#39FF14] to-transparent shadow-[0_0_12px_#39FF14] pointer-events-none opacity-70"
            animate={{ top: ["0%", "100%"] }}
            transition={{ duration: 3.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />

          {/* Volumetric Core Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-[#39FF14]/[0.035] blur-[180px] rounded-full pointer-events-none" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-[#00E5FF]/[0.025] blur-[160px] rounded-full pointer-events-none" />

          {/* Precision Screen Frame Reticles */}
          <div className="absolute top-3 left-3 sm:top-5 sm:left-5 text-white/30 text-[10px] pointer-events-none">
            [+] SEC-SYS // BOOT-2026.4
          </div>
          <div className="absolute top-3 right-3 sm:top-5 right-5 text-white/30 text-[10px] pointer-events-none hidden sm:block">
            MEM_LOC: {hexMemory}
          </div>
          <div className="absolute bottom-3 left-3 sm:bottom-5 sm:left-5 text-white/30 text-[10px] pointer-events-none hidden sm:block">
            INFERENCE_ENGINE: LOCAL_ENCLAVE
          </div>
          <div className="absolute bottom-3 right-3 sm:bottom-5 sm:right-5 text-white/30 text-[10px] pointer-events-none hidden sm:block">
            CLOUD_HARVEST: 0_BYTES
          </div>

          {/* =========================================================================
              1. TOP PROTOCOL BAR & SKIP CONTROL
              ========================================================================= */}
          <div className="relative z-30 flex items-center justify-between w-full border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 bg-[#39FF14] inline-block animate-pulse shadow-[0_0_10px_#39FF14]" />
              <span className="font-bold text-[#F1F0EB] text-xs sm:text-sm tracking-wider uppercase">
                AGEIS-X // SOVEREIGN INITIALIZATION
              </span>
              <span className="text-white/20 hidden md:inline">|</span>
              <span className="text-[#39FF14] text-[10px] font-bold hidden md:inline">
                STAGE {activeStage.step} OF 04
              </span>
            </div>

            <button
              onClick={skipIntro}
              className="px-3.5 py-1.5 border border-white/20 bg-white/5 hover:bg-[#39FF14]/15 hover:border-[#39FF14] text-[#F1F0EB] hover:text-[#39FF14] text-[10px] sm:text-[11px] font-bold tracking-widest uppercase transition-all duration-200 cursor-pointer flex items-center gap-2 shadow-[2px_2px_0px_rgba(255,255,255,0.1)] active:translate-y-0.5"
            >
              <span>[ SKIP BOOT // ESC ]</span>
              <SkipForward className="w-3.5 h-3.5 text-[#39FF14]" />
            </button>
          </div>

          {/* =========================================================================
              2. CENTERPIECE DESIGNER HOLOGRAPHIC CORE & TELEMETRY
              ========================================================================= */}
          <div className="relative z-20 flex flex-col items-center justify-center flex-1 py-4 gap-6 sm:gap-8 w-full max-w-2xl mx-auto text-center">
            {/* Concentric Biometric Radar & Shield Core */}
            <div className="relative h-48 w-48 sm:h-56 sm:w-56 flex items-center justify-center">
              {/* Outer Dashed 64-Tick Aperture */}
              <motion.div
                className="absolute inset-0 rounded-full border border-white/10 border-dashed"
                animate={{ rotate: 360 }}
                transition={{ duration: 22, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />

              {/* Middle 3-Segment Tactical Radar Arc */}
              <motion.div
                className="absolute inset-3 sm:inset-4 rounded-full border-2 border-transparent"
                style={{
                  borderTopColor: "#39FF14",
                  borderLeftColor: "#00E5FF",
                  filter: "drop-shadow(0 0 8px rgba(57,255,20,0.4))",
                }}
                animate={{ rotate: -360 }}
                transition={{ duration: 7, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />

              {/* Inner Precision Crosshairs Frame */}
              <div className="absolute inset-9 sm:inset-10 rounded-full border border-white/15 flex items-center justify-center">
                {/* Center High-Tech Box */}
                <div className="relative w-20 h-20 bg-[#040810] border border-[#39FF14]/60 flex items-center justify-center shadow-[0_0_35px_rgba(57,255,20,0.2)]">
                  {/* Corner Precision Plus Marks */}
                  <span className="absolute -top-1.5 -left-1.5 text-[9px] text-[#39FF14] font-mono leading-none">+</span>
                  <span className="absolute -top-1.5 -right-1.5 text-[9px] text-[#39FF14] font-mono leading-none">+</span>
                  <span className="absolute -bottom-1.5 -left-1.5 text-[9px] text-[#39FF14] font-mono leading-none">+</span>
                  <span className="absolute -bottom-1.5 -right-1.5 text-[9px] text-[#39FF14] font-mono leading-none">+</span>

                  {progress >= 95 ? (
                    <ShieldCheck className="w-10 h-10 text-[#39FF14] animate-in zoom-in-50 duration-300" />
                  ) : (
                    <Lock className="w-9 h-9 text-[#39FF14] animate-pulse" />
                  )}
                </div>
              </div>
            </div>

            {/* Giant Monochromatic Rolling Counter & Kicker */}
            <div className="space-y-2">
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter text-[#F1F0EB] leading-none font-mono">
                  {formatProgress}
                </span>
                <span className="text-2xl sm:text-3xl font-black text-[#39FF14] font-mono">
                  %
                </span>
              </div>

              <div className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[#A6A6A0] flex items-center justify-center gap-2">
                <span className="text-[#39FF14] font-bold">SOVEREIGN DEFENSE PLATFORM</span>
                <span>/</span>
                <span>LOCAL HARDWARE ENCLAVE</span>
              </div>
            </div>

            {/* Active Stage Technical Descriptor Panel */}
            <div className="w-full bg-[#050A12]/90 border border-white/15 p-4 sm:p-5 text-left space-y-2 shadow-2xl relative">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[#39FF14] font-bold">
                    [{activeStage.step}] // {activeStage.name}
                  </span>
                </div>
                <span className="text-[10px] text-[#00E5FF] px-2 py-0.5 bg-[#00E5FF]/10 border border-[#00E5FF]/30 font-bold">
                  {activeStage.protocol}
                </span>
              </div>

              <p className="text-xs text-[#D4D4D0] font-sans leading-relaxed">
                {activeStage.detail}
              </p>

              {/* Razor Thin Dynamic Emerald Progress Track */}
              <div className="pt-2">
                <div className="h-1.5 w-full bg-white/10 rounded-none overflow-hidden relative">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#00E5FF] to-[#39FF14] shadow-[0_0_15px_#39FF14]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* 4 Guardian Fleet Interactive Assembly Deck */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full">
              {GUARDIAN_FLEET.map((guardian) => {
                const isOnline = progress >= guardian.target
                const Glyph = guardian.glyph

                return (
                  <div
                    key={guardian.id}
                    className={cn(
                      "p-3 border text-left transition-all duration-300 flex items-center justify-between",
                      isOnline
                        ? "border-[#39FF14]/50 bg-[#39FF14]/[0.06] text-[#F1F0EB] shadow-[0_0_15px_rgba(57,255,20,0.1)]"
                        : "border-white/10 bg-white/[0.015] text-[#6F706D] opacity-60"
                    )}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] text-[#A6A6A0]">{guardian.id}</span>
                        <span className="text-xs font-bold uppercase tracking-tight">
                          {guardian.name}
                        </span>
                      </div>
                      <span className="text-[9px] text-[#39FF14] block font-bold">
                        {guardian.role}
                      </span>
                    </div>

                    <div className="shrink-0 pl-2">
                      <Glyph
                        size={22}
                        color={isOnline ? "#39FF14" : "#6F706D"}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* =========================================================================
              3. DOCKED BOTTOM TELEMETRY BAR
              ========================================================================= */}
          <div className="relative z-30 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/10 text-[10px] text-[#6F706D]">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-[#F1F0EB]">
                <span className="w-1.5 h-1.5 bg-[#39FF14] inline-block animate-pulse" />
                <span className="font-bold">REAL-TIME TELEMETRY</span>
              </span>
              <span>•</span>
              <span>TOKEN INFERENCE: &lt; 20MS LOCAL</span>
              <span>•</span>
              <span className="text-[#39FF14]">SHA-256 VERIFIED</span>
            </div>

            <div className="flex items-center gap-4 text-[#A6A6A0]">
              <BarcodeGraphic code="SX-AGEIS-INITIALIZE" />
              <RegistrationMark size={12} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
