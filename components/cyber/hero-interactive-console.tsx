"use client"

import React, { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Shield,
  ShieldAlert,
  Terminal,
  Activity,
  Radio,
  Zap,
  Lock,
  Database,
  Cpu,
  Skull,
  CheckCircle2,
  RefreshCw,
  Eye,
  AlertTriangle,
  Play,
  Crosshair,
} from "lucide-react"
import { cyberAudio } from "@/lib/cyber-sound"
import { ReticleCorners } from "@/components/ui/reticle-corners"

type TabMode = "posture" | "threat_feed" | "mini_radar" | "detonate"

interface ThreatFeedItem {
  id: string
  time: string
  vector: string
  origin: string
  payload: string
  status: "DROPPED" | "SINKHOLED" | "ISOLATED"
  severity: "CRITICAL" | "HIGH" | "MEDIUM"
}

const INITIAL_FEEDS: ThreatFeedItem[] = [
  { id: "1", time: "JUST NOW", vector: "CVE-2026-09214 Zero-Day", origin: "RU_MOSCOW", payload: "0x7FFF5F00 Heap Inject", status: "DROPPED", severity: "CRITICAL" },
  { id: "2", time: "2s AGO", vector: "Cyrillic Homoglyph Phish", origin: "CN_SHENZHEN", payload: "раураl.com -> 0.0.0.0", status: "SINKHOLED", severity: "HIGH" },
  { id: "3", time: "5s AGO", vector: "eBPF Syscall Hook Probe", origin: "NL_AMSTERDAM", payload: "Ring-0 Rootkit Hijack", status: "ISOLATED", severity: "CRITICAL" },
  { id: "4", time: "9s AGO", vector: "1.8 Tbps SYN Flood Wave", origin: "GLOBAL_BOTNET", payload: "TCP SYN Scrubber Edge", status: "DROPPED", severity: "HIGH" },
  { id: "5", time: "14s AGO", vector: "OAuth Token Hijack Attempt", origin: "US_ASHBURN", payload: "Memory Scraper Hook", status: "ISOLATED", severity: "MEDIUM" },
]

export function HeroInteractiveConsole() {
  const [activeTab, setActiveTab] = useState<TabMode>("posture")
  const [threatCount, setThreatCount] = useState(14892)
  const [isSimulating, setIsSimulating] = useState(false)
  const [simStep, setSimStep] = useState<"idle" | "incoming" | "neutralizing" | "secured">("idle")
  const [radarDegree, setRadarDegree] = useState(0)

  // Rotating radar animation
  useEffect(() => {
    const interval = setInterval(() => {
      setRadarDegree((prev) => (prev + 3) % 360)
    }, 30)
    return () => clearInterval(interval)
  }, [])

  // Auto-increment live threat counter
  useEffect(() => {
    const interval = setInterval(() => {
      setThreatCount((prev) => prev + Math.floor(Math.random() * 2) + 1)
    }, 4500)
    return () => clearInterval(interval)
  }, [])

  const switchTab = (tab: TabMode) => {
    cyberAudio.playKeyClick()
    setActiveTab(tab)
  }

  // Live Attack Simulation trigger
  const runSimulation = () => {
    if (isSimulating) return
    setIsSimulating(true)
    setSimStep("incoming")
    cyberAudio.playAlert()

    setTimeout(() => {
      setSimStep("neutralizing")
      cyberAudio.playSonar()
    }, 1100)

    setTimeout(() => {
      setSimStep("secured")
      cyberAudio.playShield()
      setThreatCount((prev) => prev + 1)
    }, 2200)

    setTimeout(() => {
      setIsSimulating(false)
      setSimStep("idle")
    }, 3800)
  }

  return (
    <div className="w-full border border-white/20 bg-[#03060a]/95 backdrop-blur-xl font-mono relative shadow-2xl overflow-hidden select-none">
      <ReticleCorners />

      {/* Top Holographic Header & Live Status */}
      <div className="flex flex-wrap items-center justify-between border-b border-white/10 bg-white/5 px-3 sm:px-4 py-2 text-xs">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-[#00ff66]" />
          <span className="font-bold text-white tracking-wider text-[11px] sm:text-xs">
            AGEIS-X // CORE COMMAND MATRIX
          </span>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-[#7e8b9b]">
          <span className="hidden sm:inline">SIMULATED SCENARIOS</span>
          <span className="text-white/30 hidden sm:inline">•</span>
          <span className="text-[#00f0ff] flex items-center gap-1 font-bold">
            <span className="inline-block w-1.5 h-1.5 rounded-none bg-[#00f0ff]" />
            DEMO
          </span>
        </div>
      </div>

      {/* Interactive Navigation Mode Tabs */}
      <div className="grid grid-cols-4 border-b border-white/10 text-[10px] sm:text-[11px] bg-[#020407]">
        {[
          { id: "posture", label: "POSTURE", icon: Shield },
          { id: "threat_feed", label: "THREATS", icon: Activity },
          { id: "mini_radar", label: "RADAR", icon: Radio },
          { id: "detonate", label: "WAR GAME", icon: Zap },
        ].map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id
          return (
            <button
              key={id}
              onClick={() => switchTab(id as TabMode)}
              className={`py-2 px-1 text-center font-bold flex items-center justify-center gap-1 transition-all border-r last:border-r-0 border-white/10 ${
                isActive
                  ? "bg-[#00ff66]/15 text-[#00ff66] border-b-2 border-b-[#00ff66] shadow-[inset_0_1px_0_rgba(0,255,102,0.4)]"
                  : "text-[#7e8b9b] hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-3 h-3 shrink-0" />
              <span className="truncate">{label}</span>
            </button>
          )
        })}
      </div>

      {/* Tab Content Display Area */}
      <div className="p-3 sm:p-4 min-h-[220px] sm:min-h-[240px] flex flex-col justify-between">
        <AnimatePresence mode="wait">
          {/* TAB 1: POSTURE MATRIX */}
          {activeTab === "posture" && (
            <motion.div
              key="posture"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="space-y-3"
            >
              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-[#94a3b8] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#00ff66]" />
                    AUTONOMOUS DEFENSE ENGINE
                  </span>
                  <span className="text-[#00ff66] font-bold">[ ARMED // 0.8ms ]</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-[#94a3b8] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#00ff66]" />
                    KERNEL EBPF ROOT HOOK PROBE
                  </span>
                  <span className="text-[#00ff66] font-bold">[ UID_0_LOCKED ]</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-[#94a3b8] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#00ff66]" />
                    HARDWARE ENCLAVE KEYSTORE
                  </span>
                  <span className="text-[#00f0ff] font-bold">[ AES-256 GCM ]</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-[#94a3b8] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#00ff66]" />
                    DNS OVER TLS ZERO-SINKHOLE
                  </span>
                  <span className="text-[#00ff66] font-bold">[ PORT 853 OK ]</span>
                </div>
              </div>

              {/* Progress Index */}
              <div className="p-2.5 border border-white/10 bg-[#020408] space-y-1">
                <div className="flex justify-between text-[10px] text-[#7e8b9b]">
                  <span>GLOBAL DEFENSE POSTURE</span>
                  <span className="text-[#00ff66] font-bold">99.8% (OPTIMAL)</span>
                </div>
                <div className="h-2 bg-white/10 overflow-hidden relative">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#00f0ff] to-[#00ff66]"
                    initial={{ width: "0%" }}
                    animate={{ width: "99.8%" }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: LIVE THREAT STREAM FEED */}
          {activeTab === "threat_feed" && (
            <motion.div
              key="threats"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="space-y-1.5 text-[10px]"
            >
              <div className="flex items-center justify-between text-[#7e8b9b] border-b border-white/10 pb-1 text-[9px] uppercase">
                <span>INCOMING ATTACK VECTOR</span>
                <span>ORIGIN &bull; STATUS</span>
              </div>
              {INITIAL_FEEDS.slice(0, 4).map((feed) => (
                <div
                  key={feed.id}
                  className="flex items-center justify-between p-1.5 border border-white/5 bg-[#020408] hover:border-white/20 transition-colors"
                >
                  <div className="flex items-center gap-1.5 min-w-0 pr-2">
                    <span
                      className={`w-1.5 h-1.5 shrink-0 ${
                        feed.severity === "CRITICAL"
                          ? "bg-[#ff003c]"
                          : feed.severity === "HIGH"
                          ? "bg-[#ffb800]"
                          : "bg-[#00f0ff]"
                      }`}
                    />
                    <div className="truncate">
                      <span className="font-bold text-white truncate block">{feed.vector}</span>
                      <span className="text-[#7e8b9b] text-[9px] truncate block">{feed.payload}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      className={`px-1 py-0.2 text-[8px] font-bold border ${
                        feed.status === "DROPPED"
                          ? "border-[#ff003c]/60 bg-[#ff003c]/15 text-[#ff003c]"
                          : feed.status === "SINKHOLED"
                          ? "border-[#ffb800]/60 bg-[#ffb800]/15 text-[#ffb800]"
                          : "border-[#00ff66]/60 bg-[#00ff66]/15 text-[#00ff66]"
                      }`}
                    >
                      {feed.status}
                    </span>
                    <div className="text-[8px] text-[#7e8b9b] mt-0.5">{feed.origin}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* TAB 3: MINI TACTICAL RADAR */}
          {activeTab === "mini_radar" && (
            <motion.div
              key="radar"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col sm:flex-row items-center gap-4 justify-between"
            >
              {/* Radar circular sweep */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full border border-[#00ff66]/40 bg-[#020604] flex items-center justify-center shrink-0 overflow-hidden shadow-[0_0_15px_rgba(0,255,102,0.15)]">
                {/* Concentric rings */}
                <div className="absolute w-20 h-20 rounded-full border border-[#00ff66]/20" />
                <div className="absolute w-10 h-10 rounded-full border border-[#00ff66]/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-px bg-[#00ff66]/20" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-full w-px bg-[#00ff66]/20" />
                </div>

                {/* Rotating beam */}
                <div
                  className="absolute inset-0 origin-center pointer-events-none"
                  style={{ transform: `rotate(${radarDegree}deg)` }}
                >
                  <div className="w-1/2 h-1/2 bg-gradient-to-br from-[#00ff66]/40 via-[#00ff66]/10 to-transparent" />
                </div>

                {/* Blip dots */}
                <div className="absolute top-6 right-7 w-2 h-2 rounded-full bg-[#ff003c] animate-ping" />
                <div className="absolute bottom-6 left-8 w-1.5 h-1.5 rounded-full bg-[#00ff66]" />
                <div className="absolute top-14 left-5 w-1.5 h-1.5 rounded-full bg-[#00f0ff]" />
              </div>

              {/* Radar metrics */}
              <div className="flex-1 space-y-1 text-[10px] w-full">
                <div className="p-1.5 border border-white/10 bg-[#020408]">
                  <span className="text-[#7e8b9b] block text-[9px]">SENTRY RANGE:</span>
                  <span className="text-[#00ff66] font-bold">GLOBAL MESH (360°)</span>
                </div>
                <div className="p-1.5 border border-white/10 bg-[#020408]">
                  <span className="text-[#7e8b9b] block text-[9px]">TARGETS TRACKED:</span>
                  <span className="text-white font-bold">48 ACTIVE HUBS</span>
                </div>
                <div className="p-1.5 border border-white/10 bg-[#020408]">
                  <span className="text-[#7e8b9b] block text-[9px]">ATTACK INTERCEPT:</span>
                  <span className="text-[#00f0ff] font-bold">BALLISTIC SUB-MS</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: LIVE WAR GAME SIMULATION DETONATOR */}
          {activeTab === "detonate" && (
            <motion.div
              key="detonate"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="space-y-3"
            >
              <div className="text-[10px] text-[#94a3b8] leading-relaxed">
                Trigger a simulated live zero-day exploit payload against the local defense sandbox:
              </div>

              <div className="p-2 border border-white/15 bg-[#020408]">
                {simStep === "idle" && (
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-[#7e8b9b]">SANDBOX POSTURE:</span>
                    <span className="text-[#00ff66] font-bold">READY FOR DETONATION</span>
                  </div>
                )}
                {simStep === "incoming" && (
                  <div className="flex items-center justify-between text-[10px] text-[#ff003c] animate-pulse">
                    <span className="flex items-center gap-1 font-bold">
                      <Skull className="w-3.5 h-3.5 text-[#ff003c]" />
                      🚨 ZERO-DAY INGESTION DETECTED
                    </span>
                    <span className="font-bold">PAYLOAD INJECT</span>
                  </div>
                )}
                {simStep === "neutralizing" && (
                  <div className="flex items-center justify-between text-[10px] text-[#ffb800]">
                    <span className="flex items-center gap-1 font-bold">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#ffb800]" />
                      ⚔️ ENGAGING EBPF RING-0 GUARD
                    </span>
                    <span className="font-bold">ISOLATING</span>
                  </div>
                )}
                {simStep === "secured" && (
                  <div className="flex items-center justify-between text-[10px] text-[#00ff66]">
                    <span className="flex items-center gap-1 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff66]" />
                      🛡️ THREAT SINKHOLED & SECURED
                    </span>
                    <span className="font-bold">DEFCON 1 OK</span>
                  </div>
                )}
              </div>

              <button
                onClick={runSimulation}
                disabled={isSimulating}
                className={`w-full py-2 px-3 border font-mono text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isSimulating
                    ? "border-[#ff003c] bg-[#ff003c]/20 text-[#ff003c]"
                    : "border-[#00ff66] bg-[#00ff66]/10 text-[#00ff66] hover:bg-[#00ff66] hover:text-black shadow-[0_0_15px_rgba(0,255,102,0.25)]"
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isSimulating ? "[ SIMULATING ATTACK SURGE... ]" : "[ DETONATE ZERO-DAY ATTACK ]"}</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Console Bottom Telemetry Footer */}
        <div className="mt-3 pt-2 border-t border-white/10 flex flex-wrap items-center justify-between text-[9px] text-[#7e8b9b]">
          <div>
            TOTAL PURGED: <span className="text-[#00ff66] font-bold">{threatCount.toLocaleString()}</span>
          </div>
          <div className="text-[#00f0ff] font-bold">
            AES-256 ENCLAVE // TPM 2.0 VALID
          </div>
        </div>
      </div>
    </div>
  )
}
