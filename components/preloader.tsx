"use client"

import React, { useState, useEffect, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Shield, Lock, Wifi, Eye, Terminal, Database, Server, Cpu, AlertTriangle, CheckCircle2, Fingerprint, Scan, Radio, Zap, SkipForward, ShieldAlert, Skull, Bug, Crosshair, Sparkles } from "lucide-react"
import { cyberAudio } from "@/lib/cyber-sound"

interface PreloaderProps {
  onComplete: () => void
  duration?: number
}

interface CyberPopupItem {
  id: string
  title: string
  subtitle: string
  badge: string
  code: string
  metric: string
  icon: any
  type: "threat" | "defense" | "telemetry"
  xPercent: number // screen X %
  yPercent: number // screen Y %
}

const POPUP_BLUEPRINTS = [
  {
    title: "ZERO-DAY BLOCKED",
    code: "0x7FFF:CVE-09214",
    status: "PURGED",
    icon: Skull,
    type: "threat" as const,
  },
  {
    title: "KERNEL ROOT GUARD",
    code: "UID_0_LOCKED",
    status: "ARMED",
    icon: Bug,
    type: "threat" as const,
  },
  {
    title: "TPM 2.0 ENCLAVE",
    code: "AES-256-GCM",
    status: "ATTESTED",
    icon: Database,
    type: "defense" as const,
  },
  {
    title: "GLOBAL MESH SYNC",
    code: "14.8K NODES",
    status: "ONLINE",
    icon: Radio,
    type: "defense" as const,
  },
  {
    title: "CYRILLIC SINKHOLE",
    code: "0.0.0.0_TRAP",
    status: "NULL-ROUTED",
    icon: AlertTriangle,
    type: "threat" as const,
  },
  {
    title: "QUANTUM CIPHER",
    code: "KYBER-1024",
    status: "PQC OK",
    icon: Sparkles,
    type: "defense" as const,
  },
  {
    title: "SYN SCRUBBER",
    code: "1.8 Tbps EDGE",
    status: "FILTERED",
    icon: Zap,
    type: "threat" as const,
  },
  {
    title: "FIDO2 PASSKEY",
    code: "AUTH_NOMINAL",
    status: "VERIFIED",
    icon: Fingerprint,
    type: "defense" as const,
  },
  {
    title: "ASLR HEAP SHIELD",
    code: "ROP_CHAIN_DEF",
    status: "PROTECTED",
    icon: ShieldAlert,
    type: "threat" as const,
  },
  {
    title: "PERIMETER HARDENED",
    code: "10/10 SURFACES",
    status: "SECURE",
    icon: CheckCircle2,
    type: "defense" as const,
  },
]

// Dual-tone Matrix rain
function MatrixRain() {
  const columns = useMemo(() => {
    const chars = "01アイウエオカキクケコサシスセソ010101XYZ#!"
    return Array.from({ length: 24 }, (_, i) => ({
      id: i,
      chars: Array.from({ length: 18 }, () => chars[Math.floor(Math.random() * chars.length)]),
      left: `${(i / 24) * 100}%`,
      duration: 2.8 + Math.random() * 3,
      delay: Math.random() * 2,
      isRed: i % 4 === 0,
    }))
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
      {columns.map((col) => (
        <motion.div
          key={col.id}
          className={`absolute top-0 font-mono text-[10px] leading-tight select-none ${
            col.isRed ? "text-[#ff003c]" : "text-[#00ff66]"
          }`}
          style={{ left: col.left }}
          initial={{ y: "-100%" }}
          animate={{ y: "100vh" }}
          transition={{
            duration: col.duration,
            repeat: Number.POSITIVE_INFINITY,
            delay: col.delay,
            ease: "linear",
          }}
        >
          {col.chars.map((char, j) => (
            <div key={j} style={{ opacity: 1 - j * 0.04 }}>{char}</div>
          ))}
        </motion.div>
      ))}
    </div>
  )
}

// Cyber grid with animated dual-tone Red & Green pulse
function CyberGrid() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg className="h-full w-full opacity-[0.08]">
        <defs>
          <pattern id="cyber-grid-pattern" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cyber-grid-pattern)" />
      </svg>
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(ellipse at 30% 40%, rgba(255, 0, 60, 0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 60%, rgba(0, 255, 102, 0.12) 0%, transparent 60%)",
            "radial-gradient(ellipse at 70% 30%, rgba(255, 0, 60, 0.15) 0%, transparent 60%), radial-gradient(ellipse at 30% 70%, rgba(0, 255, 102, 0.15) 0%, transparent 60%)",
            "radial-gradient(ellipse at 30% 40%, rgba(255, 0, 60, 0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 60%, rgba(0, 255, 102, 0.12) 0%, transparent 60%)",
          ],
        }}
        transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
    </div>
  )
}

// Scanning laser lines
function ScanningBeams() {
  return (
    <div className="pointer-events-none">
      <motion.div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00ff66] to-transparent shadow-[0_0_8px_#00ff66]"
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 3.2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />
      <motion.div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ff003c] to-transparent shadow-[0_0_10px_#ff003c]"
        animate={{ top: ["100%", "0%"] }}
        transition={{ duration: 2.8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />
    </div>
  )
}

// Dynamic Small Randomized Micro Cyber Holographic Popups
function DynamicRandomPopups({ progress }: { progress: number }) {
  const [activePopups, setActivePopups] = useState<Array<{
    id: string
    title: string
    code: string
    status: string
    icon: any
    type: "threat" | "defense"
    xPercent: number
    yPercent: number
  }>>([])
  const [closedIds, setClosedIds] = useState<Set<string>>(new Set())

  // Perimeter anchor zones around the edges avoiding center logo
  const anchorZones = useMemo(() => [
    { x: 3, y: 14 },   // Top-Left
    { x: 70, y: 14 },  // Top-Right
    { x: 3, y: 44 },   // Mid-Left
    { x: 71, y: 42 },  // Mid-Right
    { x: 4, y: 70 },   // Low-Left
    { x: 69, y: 70 },  // Low-Right
    { x: 28, y: 8 },   // Top-Center
    { x: 50, y: 76 },  // Bottom-Center
  ], [])

  // Dynamically trigger popups based on progress milestones
  useEffect(() => {
    const milestones = [6, 16, 28, 40, 52, 64, 76, 88]

    milestones.forEach((threshold, idx) => {
      const blueprint = POPUP_BLUEPRINTS[idx % POPUP_BLUEPRINTS.length]
      const popupId = `micro-pop-${idx}`

      if (progress >= threshold && !closedIds.has(popupId)) {
        setActivePopups((prev) => {
          if (prev.some((p) => p.id === popupId)) return prev
          const zone = anchorZones[idx % anchorZones.length]
          const jitterX = ((idx * 6) % 6) - 3
          const jitterY = ((idx * 8) % 6) - 3

          if (typeof window !== "undefined") {
            try {
              if (blueprint.type === "threat") {
                cyberAudio.playAlert()
              } else {
                cyberAudio.playSonar()
              }
            } catch {}
          }

          const newPopup = {
            id: popupId,
            title: blueprint.title,
            code: blueprint.code,
            status: blueprint.status,
            icon: blueprint.icon,
            type: blueprint.type,
            xPercent: Math.max(2, Math.min(74, zone.x + jitterX)),
            yPercent: Math.max(5, Math.min(78, zone.y + jitterY)),
          }
          return [...prev, newPopup]
        })
      }
    })
  }, [progress, closedIds, anchorZones])

  const dismissPopup = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    try {
      cyberAudio.playKeyClick()
    } catch {}
    setClosedIds((prev) => new Set(prev).add(id))
    setActivePopups((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
      <AnimatePresence>
        {activePopups.map((p) => {
          const Icon = p.icon
          const isThreat = p.type === "threat"

          return (
            <motion.div
              key={p.id}
              className={`absolute pointer-events-auto cursor-pointer max-w-[190px] sm:max-w-[210px] select-none backdrop-blur-xl border font-mono transition-all duration-150 group shadow-lg ${
                isThreat
                  ? "border-[#ff003c]/80 bg-[#080204]/90 text-[#ff003c] shadow-[0_0_18px_rgba(255,0,60,0.35)] hover:border-[#ff003c]"
                  : "border-[#00ff66]/80 bg-[#020804]/90 text-[#00ff66] shadow-[0_0_18px_rgba(0,255,102,0.35)] hover:border-[#00ff66]"
              }`}
              style={{
                left: `${p.xPercent}%`,
                top: `${p.yPercent}%`,
              }}
              initial={{ opacity: 0, scale: 0.4, y: 10, rotateX: 20 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: [0, -2, 0],
                rotateX: 0,
              }}
              exit={{ opacity: 0, scale: 0.5, filter: "blur(4px)", y: -6 }}
              transition={{
                type: "spring",
                stiffness: 450,
                damping: 25,
                y: { duration: 2.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
              }}
              onClick={(e) => dismissPopup(p.id, e)}
            >
              {/* Corner Reticle Brackets */}
              <div className="absolute -top-0.5 -left-0.5 w-1.5 h-1.5 border-t border-l border-current pointer-events-none" />
              <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 border-t border-r border-current pointer-events-none" />
              <div className="absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 border-b border-l border-current pointer-events-none" />
              <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 border-b border-r border-current pointer-events-none" />

              {/* Compact Single/Dual Deck */}
              <div className="px-2 py-1.5 flex items-center gap-2">
                {/* Micro Icon */}
                <div
                  className={`p-1 border shrink-0 flex items-center justify-center ${
                    isThreat
                      ? "border-[#ff003c]/40 bg-[#ff003c]/15 text-[#ff003c]"
                      : "border-[#00ff66]/40 bg-[#00ff66]/15 text-[#00ff66]"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 animate-pulse" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 leading-none">
                    <span className="text-[10px] font-extrabold uppercase truncate text-white">
                      {p.title}
                    </span>
                    <span className={`text-[8px] font-bold px-1 py-0.2 shrink-0 ${
                      isThreat ? "bg-[#ff003c]/20 text-[#ff003c]" : "bg-[#00ff66]/20 text-[#00ff66]"
                    }`}>
                      {p.status}
                    </span>
                  </div>
                  <div className="text-[8.5px] text-[#94a3b8] font-mono leading-none mt-1 truncate flex items-center gap-1">
                    <span className={`w-1 h-1 rounded-full ${isThreat ? "bg-[#ff003c]" : "bg-[#00ff66]"}`} />
                    <span className="font-semibold text-white/90">{p.code}</span>
                  </div>
                </div>

                {/* Micro Close */}
                <button
                  onClick={(e) => dismissPopup(p.id, e)}
                  className="text-white/40 hover:text-white text-[9px] font-bold leading-none p-0.5 shrink-0"
                  title="Close"
                >
                  ✕
                </button>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

// Compact Security & Threat Rings
function SecurityRings({ progress }: { progress: number }) {
  const isNeutralizing = progress >= 75

  const rings = useMemo(() => [
    { size: 230, duration: 20, direction: 1, color: "#ff003c", strokeWidth: 1.5, dashArray: "10 5", isRed: true },
    { size: 190, duration: 16, direction: -1, color: "#00ff66", strokeWidth: 2, dashArray: "6 3", isRed: false },
    { size: 150, duration: 12, direction: 1, color: "#ff003c", strokeWidth: 1.5, dashArray: "4 6", isRed: true },
    { size: 120, duration: 9, direction: -1, color: "#00ff66", strokeWidth: 2, dashArray: "none", isRed: false },
  ], [])

  return (
    <div className="relative h-44 w-44 sm:h-52 sm:w-52 flex items-center justify-center shrink-0">
      {rings.map((ring, idx) => (
        <motion.div
          key={idx}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          animate={{ rotate: 360 * ring.direction }}
          transition={{ duration: ring.duration, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        >
          <svg width={ring.size} height={ring.size} className="absolute max-w-full">
            <circle
              cx={ring.size / 2}
              cy={ring.size / 2}
              r={ring.size / 2 - 8}
              fill="none"
              stroke={ring.color}
              strokeWidth={ring.strokeWidth}
              strokeDasharray={ring.dashArray}
              className={ring.isRed ? "opacity-30" : "opacity-40"}
            />
            {/* Animated arc segment */}
            <motion.circle
              cx={ring.size / 2}
              cy={ring.size / 2}
              r={ring.size / 2 - 8}
              fill="none"
              stroke={isNeutralizing ? "#00ff66" : ring.color}
              strokeWidth={ring.strokeWidth + 1.5}
              strokeDasharray={`${ring.size * 0.35} ${ring.size * 2}`}
              strokeLinecap="round"
              style={{
                filter: ring.isRed ? "drop-shadow(0 0 6px #ff003c)" : "drop-shadow(0 0 6px #00ff66)",
              }}
              initial={{ strokeDashoffset: 0 }}
              animate={{ strokeDashoffset: -ring.size * Math.PI * 2 }}
              transition={{ duration: ring.duration / 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
          </svg>
        </motion.div>
      ))}

      {/* Center Shield with Dynamic Red Threat Alert -> Green Shield Lock */}
      <div className="relative z-10 flex items-center justify-center">
        <motion.div
          className={`relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-none backdrop-blur-md border transition-colors ${
            isNeutralizing
              ? "bg-[#00ff66]/15 border-[#00ff66] shadow-[0_0_20px_rgba(0,255,102,0.5)]"
              : "bg-[#ff003c]/15 border-[#ff003c] shadow-[0_0_20px_rgba(255,0,60,0.5)]"
          }`}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY }}
        >
          {isNeutralizing ? (
            <Shield className="h-7 w-7 sm:h-8 sm:w-8 text-[#00ff66]" />
          ) : (
            <ShieldAlert className="h-7 w-7 sm:h-8 sm:w-8 text-[#ff003c] animate-pulse" />
          )}

          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1, 1, 0.5] }}
            transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, times: [0, 0.2, 0.8, 1] }}
          >
            {isNeutralizing ? (
              <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-[#00ff66]" />
            ) : (
              <Skull className="h-4 w-4 sm:h-5 sm:w-5 text-[#ff003c]" />
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

// In-Flow Progress Section
function ProgressSection({ progress, phase }: { progress: number; phase: string }) {
  const isNeutralizing = progress >= 75

  return (
    <div className="w-full max-w-xs sm:max-w-sm space-y-2 font-mono">
      {/* Phase title and percentage */}
      <div className="flex items-center justify-between text-xs">
        <span className={`text-[11px] font-bold truncate pr-2 ${isNeutralizing ? "text-[#00ff66]" : "text-[#ff003c]"}`}>
          {phase}
        </span>
        <span className={`text-xs font-bold shrink-0 ${isNeutralizing ? "text-[#00ff66]" : "text-[#ff003c]"}`}>
          {Math.round(progress)}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="relative h-2 bg-white/10 rounded-none overflow-hidden border border-white/20">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#ff003c] via-[#ffb800] to-[#00ff66]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Status icons row */}
      <div className="pt-1 flex justify-between px-1">
        {[
          { Icon: Skull, label: "THREAT", threshold: 25, isRed: true },
          { Icon: Cpu, label: "KERNEL", threshold: 50, isRed: true },
          { Icon: Shield, label: "ENCLAVE", threshold: 75, isRed: false },
          { Icon: CheckCircle2, label: "SECURE", threshold: 95, isRed: false },
        ].map(({ Icon, label, threshold, isRed }, i) => {
          const isPassed = progress >= threshold
          return (
            <div key={i} className="flex flex-col items-center gap-0.5">
              <Icon
                className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${
                  isPassed
                    ? isRed && progress < 75
                      ? "text-[#ff003c]"
                      : "text-[#00ff66]"
                    : "text-[#7e8b9b]/60"
                }`}
              />
              <span className={`text-[9px] ${isPassed ? "text-white" : "text-[#7e8b9b]/50"}`}>{label}</span>
              <div
                className={`h-0.5 w-3 ${
                  isPassed
                    ? isRed && progress < 75
                      ? "bg-[#ff003c]"
                      : "bg-[#00ff66]"
                    : "bg-white/10"
                }`}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Hacker console with live Red Threat & Green Defense logs
function HackerConsole({ progress }: { progress: number }) {
  const logs = useMemo(() => [
    { text: "[BOOT] Initializing AgeIS-X Security Core v2.0...", threshold: 0, color: "#7e8b9b" },
    { text: "[ALERT] Inbound Cyrillic Homoglyph Probe Detected...", threshold: 12, color: "#ff003c" },
    { text: "[EBPF] Intercepting unauthorized kernel syscall...", threshold: 26, color: "#ff003c" },
    { text: "[SHIELD] Activating hardware enclave AES-256 vault...", threshold: 42, color: "#00ff66" },
    { text: "[DEFENSE] Malicious socket terminated. DNS null-routed...", threshold: 58, color: "#00ff66" },
    { text: "[RADAR] Synchronizing global threat mesh nodes...", threshold: 72, color: "#00f0ff" },
    { text: "[POSTURE] Threat neutralized. All defense surfaces nominal!", threshold: 86, color: "#00ff66", highlight: true },
    { text: "[READY] Sovereign digital defense armed & verified!", threshold: 95, color: "#00ff66", highlight: true },
  ], [])

  const visibleLogs = logs.filter((log) => progress >= log.threshold)

  return (
    <div className="w-full border border-white/15 bg-[#020408]/95 backdrop-blur-md font-mono shrink-0">
      {/* Terminal header */}
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-3 py-1">
        <Terminal className="h-3 w-3 text-[#ff003c]" />
        <span className="text-[10px] font-mono text-[#7e8b9b]">sentinel@ageis-x:~ (BOOT SEQUENCE)</span>
        <div className="ml-auto flex gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-[#ff003c] animate-ping" />
          <div className="h-1.5 w-1.5 rounded-full bg-[#00ff66]" />
        </div>
      </div>

      {/* Log output */}
      <div className="p-2 space-y-0.5 font-mono text-[9px] sm:text-[10px] overflow-hidden max-h-14 sm:max-h-16">
        {visibleLogs.slice(-3).map((log, i) => (
          <div
            key={i}
            className={`font-mono truncate ${log.highlight ? "font-bold" : ""}`}
            style={{ color: log.color }}
          >
            <span className="opacity-50 mr-1.5">{">>"}</span>
            {log.text}
          </div>
        ))}
      </div>
    </div>
  )
}

export function Preloader({ onComplete, duration = 3400 }: PreloaderProps) {
  const [mounted, setMounted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isExiting, setIsExiting] = useState(false)

  const phases = useMemo(() => [
    "🚨 INGESTING ATTACK SIGNALS",
    "⚔️ ENGAGING EBPF DEFENSE",
    "🔒 HARDENING ENCLAVES",
    "🛡️ ROUTING SINKHOLE",
    "✅ ALL SYSTEMS ARMED",
  ], [])

  const currentPhase = phases[Math.min(Math.floor(progress / 20), 4)]

  const handleComplete = useCallback(() => {
    setIsExiting(true)
    cyberAudio.playSuccess()
    setTimeout(onComplete, 400)
  }, [onComplete])

  const skipIntro = () => {
    cyberAudio.playKeyClick()
    handleComplete()
  }

  useEffect(() => {
    setMounted(true)
    cyberAudio.playAlert()
  }, [])

  useEffect(() => {
    const startTime = Date.now()
    let animationFrame: number

    const updateProgress = () => {
      const elapsed = Date.now() - startTime
      const newProgress = Math.min((elapsed / duration) * 100, 100)
      setProgress(newProgress)

      if (newProgress >= 100) {
        setTimeout(handleComplete, 200)
      } else {
        animationFrame = requestAnimationFrame(updateProgress)
      }
    }

    animationFrame = requestAnimationFrame(updateProgress)
    return () => cancelAnimationFrame(animationFrame)
  }, [duration, handleComplete])

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col justify-between min-h-screen overflow-hidden bg-[#020408] p-4 sm:p-6"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02, filter: "blur(6px)" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          {/* Background layers */}
          <CyberGrid />
          {mounted && <MatrixRain />}
          <ScanningBeams />

          {/* Dynamic Random Popups Around the Perimeter */}
          <DynamicRandomPopups progress={progress} />

          {/* 1. TOP PROTOCOL BAR */}
          <div className="relative z-30 flex items-center justify-between w-full font-mono text-[10px]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-none bg-[#ff003c] animate-ping" />
              <span className="text-[#ff003c] font-bold">DEFCON 1</span>
              <span className="text-white/20 hidden sm:inline">|</span>
              <span className="text-[#7e8b9b] hidden sm:inline">AGEIS-X BOOT PROTOCOL</span>
            </div>

            <button
              onClick={skipIntro}
              className="px-2.5 py-1 border border-white/20 bg-[#080d14] hover:border-[#00ff66] hover:text-[#00ff66] text-[#e2e8f0] font-mono flex items-center gap-1.5 transition-colors cursor-pointer min-h-[30px]"
            >
              <span>[ SKIP INTRO ]</span>
              <SkipForward className="w-3 h-3 text-[#00ff66]" />
            </button>
          </div>

          {/* 2. CENTER CLEAN VERTICAL STACK */}
          <div className="relative z-10 flex flex-col items-center justify-center flex-1 py-2 gap-3 w-full">
            {/* Security Rings */}
            {mounted && <SecurityRings progress={progress} />}

            {/* Logo Title & Subtitle */}
            <div className="text-center font-mono space-y-0.5">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                <span className="text-[#ff003c] drop-shadow-[0_0_10px_#ff003c]">Age</span>
                <span className="text-[#00ff66] phosphor-glow">IS-X</span>
              </h1>
              <div className="text-[10px] sm:text-[11px] font-mono tracking-wider text-[#f8fafc]/80 flex items-center justify-center gap-2">
                <span className="text-[#ff003c] font-bold">[ THREAT INGESTION ]</span>
                <span className="text-[#7e8b9b]">&bull;</span>
                <span className="text-[#00ff66] font-bold">[ AUTONOMOUS SHIELD ]</span>
              </div>
            </div>

            {/* In-Flow Progress Bar */}
            <ProgressSection progress={progress} phase={currentPhase} />
          </div>

          {/* 3. DOCKED BOTTOM CONSOLE */}
          <div className="relative z-30 w-full max-w-xl mx-auto">
            <HackerConsole progress={progress} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
