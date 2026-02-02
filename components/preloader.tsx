"use client"

import React from "react"

import { useState, useEffect, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Shield, Lock, Wifi, Eye, Terminal, Database, Server, Cpu, AlertTriangle, CheckCircle2, Fingerprint, Scan, Radio, Zap } from "lucide-react"

interface PreloaderProps {
  onComplete: () => void
  duration?: number
}

// Optimized Matrix rain with fewer elements
function MatrixRain() {
  const columns = useMemo(() => {
    const chars = "01アイウエオカキクケコサシスセソ"
    return Array.from({ length: 25 }, (_, i) => ({
      id: i,
      chars: Array.from({ length: 20 }, () => chars[Math.floor(Math.random() * chars.length)]),
      left: `${(i / 25) * 100}%`,
      duration: 3 + Math.random() * 3,
      delay: Math.random() * 2,
    }))
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden opacity-15">
      {columns.map((col) => (
        <motion.div
          key={col.id}
          className="absolute top-0 font-mono text-[10px] text-primary leading-tight"
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

// Cyber grid with animated pulse
function CyberGrid() {
  return (
    <div className="absolute inset-0">
      <svg className="h-full w-full opacity-[0.08]">
        <defs>
          <pattern id="cyber-grid-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cyber-grid-pattern)" />
      </svg>
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(ellipse at 50% 50%, oklch(0.7 0.2 155 / 0.08) 0%, transparent 60%)",
            "radial-gradient(ellipse at 30% 70%, oklch(0.7 0.2 155 / 0.12) 0%, transparent 60%)",
            "radial-gradient(ellipse at 70% 30%, oklch(0.7 0.2 155 / 0.08) 0%, transparent 60%)",
            "radial-gradient(ellipse at 50% 50%, oklch(0.7 0.2 155 / 0.08) 0%, transparent 60%)",
          ],
        }}
        transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
    </div>
  )
}

// Scanning beams
function ScanningBeams() {
  return (
    <>
      <motion.div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 3.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />
      <motion.div
        className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-cyan-400/60 to-transparent"
        animate={{ left: ["0%", "100%"] }}
        transition={{ duration: 4.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />
      <motion.div
        className="absolute left-0 right-0 h-16 bg-gradient-to-b from-primary/5 via-primary/10 to-transparent"
        animate={{ top: ["-10%", "110%"] }}
        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />
    </>
  )
}

// Advanced rotating security rings
function SecurityRings() {
  const rings = useMemo(() => [
    { size: 280, duration: 25, direction: 1, nodes: 8, strokeWidth: 1, dashArray: "8 4" },
    { size: 240, duration: 20, direction: -1, nodes: 6, strokeWidth: 1.5, dashArray: "12 6" },
    { size: 200, duration: 15, direction: 1, nodes: 4, strokeWidth: 1, dashArray: "4 8" },
    { size: 160, duration: 12, direction: -1, nodes: 3, strokeWidth: 2, dashArray: "none" },
  ], [])

  return (
    <div className="relative h-72 w-72 sm:h-80 sm:w-80">
      {rings.map((ring, idx) => (
        <motion.div
          key={idx}
          className="absolute inset-0 flex items-center justify-center"
          animate={{ rotate: 360 * ring.direction }}
          transition={{ duration: ring.duration, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        >
          <svg width={ring.size} height={ring.size} className="absolute">
            <circle
              cx={ring.size / 2}
              cy={ring.size / 2}
              r={ring.size / 2 - 10}
              fill="none"
              stroke="currentColor"
              strokeWidth={ring.strokeWidth}
              strokeDasharray={ring.dashArray}
              className="text-primary/20"
            />
            {/* Animated arc segment */}
            <motion.circle
              cx={ring.size / 2}
              cy={ring.size / 2}
              r={ring.size / 2 - 10}
              fill="none"
              stroke="currentColor"
              strokeWidth={ring.strokeWidth + 1}
              strokeDasharray={`${ring.size * 0.3} ${ring.size * 2}`}
              strokeLinecap="round"
              className="text-primary"
              initial={{ strokeDashoffset: 0 }}
              animate={{ strokeDashoffset: -ring.size * Math.PI * 2 }}
              transition={{ duration: ring.duration / 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
            {/* Ring nodes */}
            {Array.from({ length: ring.nodes }).map((_, i) => {
              const angle = (360 / ring.nodes) * i * (Math.PI / 180)
              const r = ring.size / 2 - 10
              return (
                <motion.circle
                  key={i}
                  cx={ring.size / 2 + r * Math.cos(angle)}
                  cy={ring.size / 2 + r * Math.sin(angle)}
                  r={3}
                  className="fill-primary"
                  animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: i * 0.2 }}
                />
              )
            })}
          </svg>
        </motion.div>
      ))}

      {/* Center Shield with Lock */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative"
          animate={{
            filter: [
              "drop-shadow(0 0 15px oklch(0.7 0.2 155 / 0.4))",
              "drop-shadow(0 0 35px oklch(0.7 0.2 155 / 0.7))",
              "drop-shadow(0 0 15px oklch(0.7 0.2 155 / 0.4))",
            ],
          }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          <motion.div
            className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent backdrop-blur-sm border border-primary/30"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
          >
            <Shield className="h-12 w-12 text-primary" />
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1, 1, 0.5] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, times: [0, 0.2, 0.8, 1] }}
            >
              <Lock className="h-6 w-6 text-primary" />
            </motion.div>
          </motion.div>

          {/* Pulse rings */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-2xl border border-primary/40"
              initial={{ opacity: 0.6, scale: 1 }}
              animate={{ opacity: 0, scale: 1.8 }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: i * 0.6 }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  )
}

// Floating threat/status indicators
function FloatingIndicators({ progress }: { progress: number }) {
  const indicators = useMemo(() => [
    { icon: Scan, label: "Scanning Systems", threshold: 10, position: { top: "15%", left: "8%" } },
    { icon: Fingerprint, label: "Biometric Init", threshold: 25, position: { top: "25%", right: "8%" } },
    { icon: Database, label: "ML Models Ready", threshold: 40, position: { top: "60%", left: "5%" } },
    { icon: Radio, label: "Signal Secure", threshold: 55, position: { top: "70%", right: "5%" } },
    { icon: Eye, label: "Threat Monitor", threshold: 70, position: { bottom: "30%", left: "10%" } },
    { icon: Zap, label: "Neural Active", threshold: 85, position: { bottom: "25%", right: "10%" } },
  ], [])

  return (
    <div className="absolute inset-0 pointer-events-none hidden sm:block">
      {indicators.map((ind, i) => (
        <AnimatePresence key={i}>
          {progress >= ind.threshold && (
            <motion.div
              className="absolute flex items-center gap-2 rounded-full border border-primary/30 bg-background/80 px-3 py-1.5 text-xs backdrop-blur-md"
              style={ind.position as React.CSSProperties}
              initial={{ opacity: 0, scale: 0, x: i % 2 === 0 ? -30 : 30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <ind.icon className="h-3 w-3 text-primary" />
              </motion.div>
              <span className="text-primary/90 font-mono">{ind.label}</span>
              <motion.div
                className="h-1.5 w-1.5 rounded-full bg-primary"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      ))}
    </div>
  )
}

// Hacker console with live logs
function HackerConsole({ progress }: { progress: number }) {
  const logs = useMemo(() => [
    { text: "[BOOT] Initializing AgeIS-X Security Core v2.0...", threshold: 0 },
    { text: "[CRYPTO] Loading encryption protocols...", threshold: 8 },
    { text: "[NET] Establishing secure TLS 1.3 connection...", threshold: 16 },
    { text: "[ML] Loading TF-IDF vectorizer model...", threshold: 24 },
    { text: "[NEURAL] Activating deep learning inference engine...", threshold: 32 },
    { text: "[API] Connecting to threat intelligence feeds...", threshold: 40 },
    { text: "[SCAN] Calibrating URL phishing detector...", threshold: 48 },
    { text: "[AUTH] Preparing JWT token validation...", threshold: 56 },
    { text: "[REDIS] Initializing rate limiter cache...", threshold: 64 },
    { text: "[DB] Syncing threat signature database...", threshold: 72 },
    { text: "[SEC] Running security diagnostics...", threshold: 80 },
    { text: "[READY] All defense systems operational!", threshold: 92, highlight: true },
  ], [])

  const visibleLogs = logs.filter((log) => progress >= log.threshold)

  return (
    <motion.div
      className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8 max-h-28 sm:max-h-36 overflow-hidden rounded-lg border border-border/50 bg-background/95 backdrop-blur-md"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, type: "spring" }}
    >
      {/* Terminal header */}
      <div className="flex items-center gap-2 border-b border-border/50 bg-muted/30 px-3 py-1.5">
        <Terminal className="h-3 w-3 text-primary" />
        <span className="text-[10px] sm:text-xs font-mono text-muted-foreground">system@ageis-x:~</span>
        <div className="ml-auto flex gap-1.5">
          <div className="h-2 w-2 rounded-full bg-red-500/60" />
          <div className="h-2 w-2 rounded-full bg-amber-500/60" />
          <div className="h-2 w-2 rounded-full bg-green-500/60" />
        </div>
      </div>

      {/* Log output */}
      <div className="p-2 sm:p-3 space-y-0.5 font-mono text-[9px] sm:text-[11px] overflow-y-auto max-h-20 sm:max-h-24">
        {visibleLogs.map((log, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className={log.highlight ? "text-primary font-semibold" : "text-muted-foreground"}
          >
            <span className="text-primary/60 mr-2">{">>"}</span>
            {log.text}
          </motion.div>
        ))}
        <motion.span
          className="inline-block w-2 h-3 bg-primary ml-1"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
        />
      </div>
    </motion.div>
  )
}

// Binary data streams
function DataStreams() {
  const streams = useMemo(() => 
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      left: `${15 + i * 14}%`,
      duration: 2.5 + Math.random() * 1.5,
      delay: i * 0.4,
    })), [])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {streams.map((stream) => (
        <motion.div
          key={stream.id}
          className="absolute w-px bg-gradient-to-b from-transparent via-primary/40 to-transparent h-32"
          style={{ left: stream.left }}
          animate={{ top: ["-10%", "110%"] }}
          transition={{
            duration: stream.duration,
            repeat: Number.POSITIVE_INFINITY,
            delay: stream.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  )
}

// Progress status phases
function ProgressSection({ progress, phase }: { progress: number; phase: string }) {
  return (
    <motion.div
      className="absolute bottom-36 sm:bottom-48 left-1/2 -translate-x-1/2 w-72 sm:w-80"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      {/* Phase text */}
      <div className="flex items-center justify-between mb-2 text-xs font-mono">
        <motion.span 
          className="text-muted-foreground"
          key={phase}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {phase}
        </motion.span>
        <span className="text-primary font-bold">{Math.round(progress)}%</span>
      </div>

      {/* Progress bar */}
      <div className="relative h-1.5 bg-muted/30 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-cyan-400 to-primary rounded-full"
          style={{ width: `${progress}%` }}
        />
        <motion.div
          className="absolute inset-y-0 w-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 1.2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ width: `${progress}%` }}
          animate={{
            boxShadow: [
              "0 0 8px oklch(0.7 0.2 155 / 0.5)",
              "0 0 16px oklch(0.7 0.2 155 / 0.8)",
              "0 0 8px oklch(0.7 0.2 155 / 0.5)",
            ],
          }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
        />
      </div>

      {/* Status icons */}
      <div className="mt-4 flex justify-center gap-6">
        {[
          { Icon: Cpu, threshold: 25 },
          { Icon: Database, threshold: 50 },
          { Icon: Wifi, threshold: 75 },
          { Icon: CheckCircle2, threshold: 95 },
        ].map(({ Icon, threshold }, i) => (
          <motion.div
            key={i}
            className="flex flex-col items-center gap-1"
            initial={{ opacity: 0.3 }}
            animate={{
              opacity: progress >= threshold ? 1 : 0.3,
              scale: progress >= threshold ? [1, 1.2, 1] : 1,
            }}
            transition={{ duration: 0.4 }}
          >
            <Icon className={`h-4 w-4 ${progress >= threshold ? "text-primary" : "text-muted-foreground"}`} />
            <div className={`h-0.5 w-4 rounded-full ${progress >= threshold ? "bg-primary" : "bg-muted"}`} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export function Preloader({ onComplete, duration = 4500 }: PreloaderProps) {
  const [progress, setProgress] = useState(0)
  const [isExiting, setIsExiting] = useState(false)

  const phases = useMemo(() => [
    "Initializing Security Core",
    "Loading Neural Networks",
    "Calibrating Threat Detection",
    "Establishing Secure Channels",
    "Defense Systems Online",
  ], [])

  const currentPhase = phases[Math.min(Math.floor(progress / 25), 4)]

  const handleComplete = useCallback(() => {
    setIsExiting(true)
    setTimeout(onComplete, 700)
  }, [onComplete])

  useEffect(() => {
    const startTime = Date.now()
    let animationFrame: number

    const updateProgress = () => {
      const elapsed = Date.now() - startTime
      const newProgress = Math.min((elapsed / duration) * 100, 100)
      setProgress(newProgress)

      if (newProgress >= 100) {
        setTimeout(handleComplete, 400)
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
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: "blur(8px)" }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          {/* Background layers */}
          <CyberGrid />
          <MatrixRain />
          <DataStreams />
          <ScanningBeams />
          <FloatingIndicators progress={progress} />

          {/* Main content */}
          <div className="relative z-10 flex flex-col items-center">
            <SecurityRings />

            {/* Logo */}
            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <motion.h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-1">
                <span className="text-foreground">Age</span>
                <motion.span
                  className="text-primary"
                  animate={{
                    textShadow: [
                      "0 0 10px oklch(0.7 0.2 155 / 0.5)",
                      "0 0 25px oklch(0.7 0.2 155 / 0.8)",
                      "0 0 10px oklch(0.7 0.2 155 / 0.5)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  IS-X
                </motion.span>
              </motion.h1>
              <motion.p
                className="text-[10px] sm:text-xs font-mono tracking-[0.15em] text-primary/70"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                AI-POWERED THREAT INTELLIGENCE
              </motion.p>
            </motion.div>
          </div>

          {/* Progress section */}
          <ProgressSection progress={progress} phase={currentPhase} />

          {/* Console */}
          <HackerConsole progress={progress} />

          {/* Corner elements */}
          <div className="absolute top-4 left-4 text-[10px] font-mono text-muted-foreground/50">
            v2.0.0
          </div>
          <motion.div
            className="absolute top-4 right-4 flex items-center gap-2 text-[10px] font-mono"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <motion.div
              className="h-2 w-2 rounded-full bg-primary"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
            />
            <span className="text-primary/80">SECURE</span>
          </motion.div>

          {/* Corner brackets */}
          {["top-left", "top-right", "bottom-left", "bottom-right"].map((pos) => (
            <div
              key={pos}
              className={`absolute w-12 h-12 ${
                pos === "top-left" ? "top-8 left-8" :
                pos === "top-right" ? "top-8 right-8" :
                pos === "bottom-left" ? "bottom-44 left-8" :
                "bottom-44 right-8"
              } hidden sm:block`}
            >
              <motion.div
                className={`absolute ${pos.includes("left") ? "left-0" : "right-0"} ${pos.includes("top") ? "top-0" : "bottom-0"} w-6 h-px bg-primary/40`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                style={{ transformOrigin: pos.includes("left") ? "left" : "right" }}
              />
              <motion.div
                className={`absolute ${pos.includes("left") ? "left-0" : "right-0"} ${pos.includes("top") ? "top-0" : "bottom-0"} w-px h-6 bg-primary/40`}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                style={{ transformOrigin: pos.includes("top") ? "top" : "bottom" }}
              />
            </div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
