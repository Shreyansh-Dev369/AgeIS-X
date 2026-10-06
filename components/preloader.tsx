"use client"

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
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
  Lock,
  Cpu,
  Radio,
  Fingerprint,
  SkipForward,
  Volume2,
  VolumeX,
  Sparkles,
  Terminal,
  Activity,
  Check,
} from "lucide-react"
import { cyberAudio } from "@/lib/cyber-sound"
import { cn } from "@/lib/utils"

export interface PreloaderProps {
  onComplete: () => void
  duration?: number
}

interface BootStage {
  step: string
  name: string
  protocol: string
  detail: string
  threshold: number
  icon: React.ElementType
}

const BOOT_STAGES: BootStage[] = [
  {
    step: "01",
    name: "ENCLAVE KEY ATTESTATION",
    protocol: "AES-256-GCM // TPM 2.0",
    detail: "Validating host enclave key material and zero-trust sandbox boundaries.",
    threshold: 25,
    icon: Fingerprint,
  },
  {
    step: "02",
    name: "LEXICAL INGESTION ENGINE",
    protocol: "N-GRAM VECTORIZER // SGD-NLP",
    detail: "Loading 120k threat signatures and sliding-window lexical weights into RAM.",
    threshold: 52,
    icon: Cpu,
  },
  {
    step: "03",
    name: "LOCAL INFERENCE LOOP",
    protocol: "p99 < 18ms // ZERO-LOGGING",
    detail: "Arming sub-20ms NLP classification heuristics and homoglyph neutralizer.",
    threshold: 78,
    icon: Radio,
  },
  {
    step: "04",
    name: "GUARDIAN FLEET ARMED",
    protocol: "4/4 AUTONOMOUS UNITS ONLINE",
    detail: "Scout, Guard, Sentinel, and Aegis units synchronized across perimeter.",
    threshold: 95,
    icon: ShieldCheck,
  },
]

const GUARDIAN_FLEET = [
  {
    id: "01",
    name: "SCOUT",
    role: "RECON",
    code: "SX-01",
    target: 25,
    glyph: PixelScoutGlyph,
    avatar: "/robots/scout-avatar.webp",
  },
  {
    id: "02",
    name: "GUARD",
    role: "DEFENSE",
    code: "SX-02",
    target: 50,
    glyph: PixelGuardGlyph,
    avatar: "/robots/guard-avatar.webp",
  },
  {
    id: "03",
    name: "SENTINEL",
    role: "ANALYZE",
    code: "SX-03",
    target: 75,
    glyph: PixelSentinelGlyph,
    avatar: "/robots/sentinel-avatar.webp",
  },
  {
    id: "04",
    name: "AEGIS",
    role: "ENCLAVE",
    code: "SX-04",
    target: 95,
    glyph: PixelAegisGlyph,
    avatar: "/robots/aegis-avatar.webp",
  },
]

export function Preloader({ onComplete, duration = 2200 }: PreloaderProps) {
  const [progress, setProgress] = useState(0)
  const [isExiting, setIsExiting] = useState(false)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [hexMemory, setHexMemory] = useState("0x7FFF8A109E2B")
  const [activeStageIdx, setActiveStageIdx] = useState(0)
  const [shockwaveActive, setShockwaveActive] = useState(false)

  const audioMilestonesRef = useRef({
    s1: false,
    s2: false,
    s3: false,
    s4: false,
    lastTick: 0,
  })

  // Initialize audio state
  useEffect(() => {
    setIsAudioEnabled(cyberAudio.isEnabled())
  }, [])

  const toggleSound = () => {
    const nextState = cyberAudio.toggleAudio()
    setIsAudioEnabled(nextState)
  }

  // Active stage
  const activeStage = useMemo(() => {
    if (progress < 25) return BOOT_STAGES[0]
    if (progress < 52) return BOOT_STAGES[1]
    if (progress < 78) return BOOT_STAGES[2]
    return BOOT_STAGES[3]
  }, [progress])

  const handleComplete = useCallback(() => {
    setShockwaveActive(true)
    try {
      cyberAudio.playSuccess()
    } catch {}

    setTimeout(() => {
      setIsExiting(true)
      setTimeout(onComplete, 450)
    }, 280)
  }, [onComplete])

  const skipIntro = useCallback(() => {
    try {
      cyberAudio.playKeyClick()
    } catch {}
    handleComplete()
  }, [handleComplete])

  // Keyboard shortcut (Escape or Space to skip)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " ") {
        e.preventDefault()
        skipIntro()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [skipIntro])

  // Non-linear realistic boot progression
  useEffect(() => {
    const startTime = Date.now()
    let animationFrame: number

    const updateProgress = () => {
      const elapsed = Date.now() - startTime
      const linearRatio = Math.min(elapsed / duration, 1)

      // Nonlinear acceleration curve (snappy start, deliberate calculation pauses, rapid finish)
      let curvedRatio: number
      if (linearRatio < 0.28) {
        // Fast ignition burst: 0 to 32%
        curvedRatio = (linearRatio / 0.28) * 0.32
      } else if (linearRatio < 0.6) {
        // Neural weight loading: 32% to 68%
        const subRatio = (linearRatio - 0.28) / (0.6 - 0.28)
        curvedRatio = 0.32 + subRatio * 0.36
      } else if (linearRatio < 0.85) {
        // Fleet sync: 68% to 92%
        const subRatio = (linearRatio - 0.6) / (0.85 - 0.6)
        curvedRatio = 0.68 + subRatio * 0.24
      } else {
        // Final lock: 92% to 100%
        const subRatio = (linearRatio - 0.85) / (1 - 0.85)
        curvedRatio = 0.92 + subRatio * 0.08
      }

      const currentProg = Math.min(Math.round(curvedRatio * 100), 100)
      setProgress(currentProg)

      // Trigger tactical audio cues
      const milestones = audioMilestonesRef.current
      if (currentProg >= 25 && !milestones.s1) {
        milestones.s1 = true
        setActiveStageIdx(1)
        try {
          cyberAudio.playSonar()
        } catch {}
      } else if (currentProg >= 52 && !milestones.s2) {
        milestones.s2 = true
        setActiveStageIdx(2)
        try {
          cyberAudio.playShield()
        } catch {}
      } else if (currentProg >= 78 && !milestones.s3) {
        milestones.s3 = true
        setActiveStageIdx(3)
        try {
          cyberAudio.playSonar()
        } catch {}
      } else if (currentProg >= 98 && !milestones.s4) {
        milestones.s4 = true
      }

      // Micro byte tick audio
      if (currentProg - milestones.lastTick >= 7) {
        milestones.lastTick = currentProg
        try {
          cyberAudio.playByteTick()
        } catch {}
      }

      // Dynamic tumbling memory hash
      if (Math.random() > 0.4) {
        const randHex = Math.floor(Math.random() * 0xffffffffffff)
          .toString(16)
          .toUpperCase()
          .padStart(12, "0")
        setHexMemory(`0x${randHex}`)
      }

      if (linearRatio >= 1 || currentProg >= 100) {
        handleComplete()
      } else {
        animationFrame = requestAnimationFrame(updateProgress)
      }
    }

    animationFrame = requestAnimationFrame(updateProgress)
    return () => cancelAnimationFrame(animationFrame)
  }, [duration, handleComplete])

  const formattedProgress = Math.floor(progress).toString().padStart(3, "0")

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          className="fixed inset-0 z-[999999] flex flex-col justify-between min-h-screen overflow-hidden bg-[#020509] p-4 sm:p-8 font-mono select-none"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.04,
            filter: "blur(16px)",
            transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
          }}
        >
          {/* =========================================================================
              LAYER 00: TACTICAL ARCHITECTURAL MATRIX & TRAVELING SCANLINE
              ========================================================================= */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
              `,
              backgroundSize: "32px 32px",
            }}
          />

          {/* Precision Sweeping Emerald Laser Line */}
          <motion.div
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#39FF14] to-transparent shadow-[0_0_15px_#39FF14] pointer-events-none opacity-75 z-10"
            animate={{ top: ["0%", "100%"] }}
            transition={{ duration: 3.2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />

          {/* Volumetric Dual Emerald / Cyan Atmosphere Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#39FF14]/[0.035] blur-[180px] rounded-full pointer-events-none" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-[#00E5FF]/[0.025] blur-[160px] rounded-full pointer-events-none" />

          {/* Precision Corner Reticles */}
          <div className="absolute top-3 left-3 sm:top-5 sm:left-5 text-white/30 text-[10px] pointer-events-none flex items-center gap-2">
            <span className="text-[#39FF14] font-bold">[+]</span>
            <span>SEC-SYS // BOOT-2026.4</span>
          </div>
          <div className="absolute top-3 right-3 sm:top-5 right-5 text-white/30 text-[10px] pointer-events-none hidden sm:flex items-center gap-2">
            <span>MEM_LOC:</span>
            <span className="text-[#00E5FF]">{hexMemory}</span>
          </div>
          <div className="absolute bottom-3 left-3 sm:bottom-5 sm:left-5 text-white/30 text-[10px] pointer-events-none hidden sm:flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#39FF14] rounded-full animate-ping" />
            <span>ENCLAVE: HARDWARE_ISOLATED</span>
          </div>
          <div className="absolute bottom-3 right-3 sm:bottom-5 sm:right-5 text-white/30 text-[10px] pointer-events-none hidden sm:flex items-center gap-2">
            <span>ZERO_CLOUD_TELEMETRY:</span>
            <span className="text-[#39FF14] font-bold">0_BYTES</span>
          </div>

          {/* Shockwave Expansion Ring on 100% */}
          {shockwaveActive && (
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#39FF14] pointer-events-none z-40"
              initial={{ width: 120, height: 120, opacity: 1 }}
              animate={{ width: 1400, height: 1400, opacity: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
            />
          )}

          {/* =========================================================================
              1. TOP PROTOCOL STATUS & CONTROLS
              ========================================================================= */}
          <div className="relative z-30 flex items-center justify-between w-full border-b border-white/10 pb-3 sm:pb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="w-2 h-2 bg-[#39FF14] inline-block shadow-[0_0_10px_#39FF14] animate-pulse" />
              <span className="font-bold text-[#F1F0EB] text-xs sm:text-sm tracking-wider uppercase">
                AGEIS-X // AUTONOMOUS SECURITY CORE
              </span>
              <span className="text-white/20 hidden md:inline">|</span>
              <span className="text-[#39FF14] text-[10px] font-bold hidden md:inline">
                STAGE {activeStage.step} OF 04
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Sound Synthesizer Toggle */}
              <button
                type="button"
                onClick={toggleSound}
                className="px-2.5 py-1 sm:px-3 sm:py-1.5 border border-white/15 bg-white/5 hover:bg-white/10 text-[#A6A6A0] hover:text-[#39FF14] text-[10px] sm:text-[11px] font-mono transition-colors flex items-center gap-1.5 cursor-pointer"
                aria-label={isAudioEnabled ? "Mute audio" : "Enable audio"}
              >
                {isAudioEnabled ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-[#39FF14]" />
                    <span className="hidden sm:inline">AUDIO ON</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-[#6F706D]" />
                    <span className="hidden sm:inline">MUTED</span>
                  </>
                )}
              </button>

              {/* Fast Skip Button */}
              <button
                type="button"
                onClick={skipIntro}
                className="px-3 py-1 sm:px-3.5 sm:py-1.5 border border-[#39FF14]/40 bg-[#39FF14]/10 hover:bg-[#39FF14]/20 text-[#F1F0EB] hover:text-[#39FF14] text-[10px] sm:text-[11px] font-bold tracking-widest uppercase transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-[2px_2px_0px_#39FF14] active:translate-y-0.5"
              >
                <span>[ SKIP // ESC ]</span>
                <SkipForward className="w-3.5 h-3.5 text-[#39FF14]" />
              </button>
            </div>
          </div>

          {/* =========================================================================
              2. CENTERPIECE: TACTICAL HOLOGRAPHIC CORE & DIAGNOSTICS
              ========================================================================= */}
          <div className="relative z-20 flex flex-col items-center justify-center flex-1 py-2 sm:py-4 gap-5 sm:gap-8 w-full max-w-4xl mx-auto text-center">
            
            {/* Center HUD & Gyroscope */}
            <div className="relative flex items-center justify-center">
              {/* Giant Outer Compass Azimuth Ring */}
              <motion.div
                className="w-48 h-48 sm:w-64 sm:h-64 rounded-full border border-white/10 flex items-center justify-center relative"
                animate={{ rotate: 360 }}
                transition={{ duration: 24, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                {/* 4 Azimuth Cardinal Degree Ticks */}
                <span className="absolute -top-3 text-[8px] text-white/30 font-mono">000°</span>
                <span className="absolute -right-4 text-[8px] text-white/30 font-mono">090°</span>
                <span className="absolute -bottom-3 text-[8px] text-white/30 font-mono">180°</span>
                <span className="absolute -left-4 text-[8px] text-white/30 font-mono">270°</span>

                {/* Sub-degree tick marks */}
                <div className="absolute inset-1 rounded-full border border-dashed border-white/10" />
              </motion.div>

              {/* Counter-Rotating Dual Cyan/Green Arc Brackets */}
              <motion.div
                className="absolute w-40 h-40 sm:w-52 sm:h-52 rounded-full border-2 border-transparent"
                style={{
                  borderTopColor: "#39FF14",
                  borderLeftColor: "#00E5FF",
                  filter: "drop-shadow(0 0 10px rgba(57,255,20,0.5))",
                }}
                animate={{ rotate: -360 }}
                transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />

              {/* Inner Pulsing Hexagonal Shield Center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-[#040812] border-2 border-[#39FF14]/80 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(57,255,20,0.25)] transition-all duration-300">
                  {/* Corner Crosshair Pips */}
                  <span className="absolute -top-1.5 -left-1.5 text-[9px] text-[#39FF14] font-mono leading-none">+</span>
                  <span className="absolute -top-1.5 -right-1.5 text-[9px] text-[#39FF14] font-mono leading-none">+</span>
                  <span className="absolute -bottom-1.5 -left-1.5 text-[9px] text-[#39FF14] font-mono leading-none">+</span>
                  <span className="absolute -bottom-1.5 -right-1.5 text-[9px] text-[#39FF14] font-mono leading-none">+</span>

                  {/* Laser Visor Line sweeping inside icon */}
                  <motion.div
                    className="absolute left-1 right-1 h-0.5 bg-[#39FF14] shadow-[0_0_8px_#39FF14] pointer-events-none"
                    animate={{ top: ["10%", "85%", "10%"] }}
                    transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  />

                  {progress >= 98 ? (
                    <ShieldCheck className="w-12 h-12 text-[#39FF14] animate-in zoom-in-75 duration-300 drop-shadow-[0_0_12px_#39FF14]" />
                  ) : (
                    <Lock className="w-10 h-10 text-[#39FF14] animate-pulse drop-shadow-[0_0_8px_#39FF14]" />
                  )}

                  <span className="text-[8px] font-mono font-bold tracking-widest text-[#39FF14] mt-1 uppercase">
                    {progress >= 98 ? "SECURED" : "ARMING"}
                  </span>
                </div>
              </div>
            </div>

            {/* Giant Monochromatic Rolling Counter */}
            <div className="space-y-1 sm:space-y-2">
              <div className="flex items-baseline justify-center gap-1 sm:gap-2">
                <span className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tighter text-[#F1F0EB] leading-none font-mono drop-shadow-[0_0_25px_rgba(255,255,255,0.1)]">
                  {formattedProgress}
                </span>
                <span className="text-2xl sm:text-4xl font-black text-[#39FF14] font-mono animate-pulse">
                  %
                </span>
              </div>

              <div className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[#A6A6A0] flex items-center justify-center gap-2">
                <span className="text-[#39FF14] font-bold">SOVEREIGN DEFENSE PLATFORM</span>
                <span className="text-white/20">/</span>
                <span className="text-[#F1F0EB]">LOCAL ENCLAVE</span>
              </div>
            </div>

            {/* Active Stage Technical Descriptor & Segmented Progress Rail */}
            <div className="w-full bg-[#050A14]/90 border border-white/15 p-4 sm:p-5 text-left space-y-3 shadow-2xl relative">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#39FF14] inline-block animate-ping" />
                  <span className="text-[#39FF14] font-bold tracking-wider">
                    [{activeStage.step}] // {activeStage.name}
                  </span>
                </div>
                <span className="text-[9px] sm:text-[10px] text-[#00E5FF] px-2 py-0.5 bg-[#00E5FF]/10 border border-[#00E5FF]/30 font-bold tracking-wider">
                  {activeStage.protocol}
                </span>
              </div>

              <p className="text-xs text-[#D4D4D0] font-sans leading-relaxed">
                {activeStage.detail}
              </p>

              {/* High-Precision Dual-Layer Progress Beam */}
              <div className="space-y-1.5 pt-1">
                <div className="h-2 w-full bg-white/10 relative overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#00E5FF] via-[#39FF14] to-[#39FF14] shadow-[0_0_20px_#39FF14]"
                    style={{ width: `${progress}%` }}
                    transition={{ ease: "easeOut" }}
                  />
                </div>

                {/* Micro segmented ticks */}
                <div className="flex justify-between text-[8px] text-[#6F706D] font-mono pt-0.5">
                  <span>00% INITIALIZE</span>
                  <span>25% ATTESTATION</span>
                  <span>50% INGESTION</span>
                  <span>75% LOCAL ML</span>
                  <span className={progress >= 95 ? "text-[#39FF14] font-bold" : ""}>
                    100% ARMED
                  </span>
                </div>
              </div>
            </div>

            {/* 4 Guardian Fleet Interactive Assembly Deck */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 w-full">
              {GUARDIAN_FLEET.map((guardian) => {
                const isOnline = progress >= guardian.target
                const Glyph = guardian.glyph

                return (
                  <div
                    key={guardian.id}
                    className={cn(
                      "p-2.5 sm:p-3 border text-left transition-all duration-300 flex items-center justify-between relative overflow-hidden",
                      isOnline
                        ? "border-[#39FF14]/60 bg-[#39FF14]/[0.08] text-[#F1F0EB] shadow-[0_0_20px_rgba(57,255,20,0.12)]"
                        : "border-white/10 bg-white/[0.015] text-[#6F706D] opacity-60"
                    )}
                  >
                    {isOnline && (
                      <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-[#39FF14]" />
                    )}

                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] text-[#A6A6A0]">{guardian.id}</span>
                        <span className="text-xs font-bold uppercase tracking-tight truncate">
                          {guardian.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[9px]">
                        <span className={isOnline ? "text-[#39FF14] font-bold" : "text-[#6F706D]"}>
                          {isOnline ? "ONLINE" : "STANDBY"}
                        </span>
                        <span>•</span>
                        <span className="text-[#A6A6A0] uppercase">{guardian.role}</span>
                      </div>
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
          <div className="relative z-30 flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 sm:pt-4 border-t border-white/10 text-[10px] text-[#6F706D]">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 sm:gap-4">
              <span className="flex items-center gap-1.5 text-[#F1F0EB]">
                <span className="w-1.5 h-1.5 bg-[#39FF14] inline-block animate-pulse" />
                <span className="font-bold">REAL-TIME TELEMETRY</span>
              </span>
              <span>•</span>
              <span>INFERENCE: &lt; 18MS LOCAL</span>
              <span>•</span>
              <span className="text-[#39FF14] font-bold">SHA-256 VERIFIED</span>
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
