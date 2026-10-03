"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, X, Shield, AlertTriangle, Zap, Cpu, Lock, Terminal, Activity, ChevronRight, HelpCircle } from "lucide-react"
import { cyberAudio } from "@/lib/cyber-sound"
import { ReticleCorners } from "@/components/ui/reticle-corners"

interface ComparisonRow {
  vector: string
  legacyAV: {
    title: string
    description: string
    status: "failed" | "partial"
  }
  ageisx: {
    title: string
    description: string
    status: "protected"
  }
  specCode: string
}

const COMPARISON_DATA: ComparisonRow[] = [
  {
    vector: "Zero-Hour Phishing & Cyrillic Spoofs",
    legacyAV: {
      title: "Delayed Database Blacklists",
      description: "Relies on outdated URL reputation lists updated every 6-24 hours. Blind to brand-new zero-minute spoof domains.",
      status: "failed",
    },
    ageisx: {
      title: "Real-time Lexical Vectorization",
      description: "Sub-24ms on-device entropy analysis, visual DOM layout heuristics, and SSL certificate lineage verification before socket connects.",
      status: "protected",
    },
    specCode: "RFC_HOMOGLYPH_SINK",
  },
  {
    vector: "Kernel Exploits & Ring-0 Rootkits",
    legacyAV: {
      title: "Userland Process Inspection",
      description: "Easily bypassed if the malware gains ring-0 or runs via unmonitored syscall hooks.",
      status: "failed",
    },
    ageisx: {
      title: "eBPF Autonomous Syscall Guard",
      description: "Hardware-enforced eBPF probes trap unauthorized privilege escalation (UID 0) in memory with zero kernel crashes.",
      status: "protected",
    },
    specCode: "EBPF_RING0_ISOLATE",
  },
  {
    vector: "Session Token & Cookie Infostealers",
    legacyAV: {
      title: "No Memory Cloaking",
      description: "Browser process memory is exposed in plaintext; background malware dumps active session tokens silently.",
      status: "failed",
    },
    ageisx: {
      title: "Hardware Enclave Vault (AES-256)",
      description: "Session tokens and master credentials are encrypted in a dedicated TPM 2.0 enclave with biometric step-up challenges.",
      status: "protected",
    },
    specCode: "TPM2.0_AES256_GCM",
  },
  {
    vector: "System Overhead & Performance Lag",
    legacyAV: {
      title: "Bloated 800MB+ Background Scans",
      description: "Heavy disk scanning causes fan spins, battery drain, and noticeable gaming or compiling latency.",
      status: "failed",
    },
    ageisx: {
      title: "<18MB Sub-Millisecond Footprint",
      description: "Lightweight zero-overhead engine triggers only on verified anomaly signals with near-zero CPU and RAM utilization.",
      status: "protected",
    },
    specCode: "ZERO_OVERHEAD_DAEMON",
  },
  {
    vector: "Telemetric Privacy & User Tracking",
    legacyAV: {
      title: "Full Cloud Log Ingestion",
      description: "Your full browsing history and visited file names are transmitted to vendor corporate analytics servers.",
      status: "failed",
    },
    ageisx: {
      title: "Zero-Knowledge Sovereign Shield",
      description: "All evaluations occur locally on your machine; only cryptographically blinded threat hashes are synced across the global mesh.",
      status: "protected",
    },
    specCode: "PQC_KYBER_ANON",
  },
]

export function ComparisonBattleMatrix() {
  const [activeRow, setActiveRow] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<"simple" | "technical">("simple")

  const toggleRow = (idx: number) => {
    cyberAudio.playKeyClick()
    setActiveRow(activeRow === idx ? null : idx)
  }

  const toggleViewMode = (mode: "simple" | "technical") => {
    cyberAudio.playKeyClick()
    setViewMode(mode)
  }

  return (
    <div className="w-full space-y-6 font-mono">
      {/* Header with Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs text-[#00ff66] uppercase tracking-wider mb-1">
            <Shield className="w-3.5 h-3.5" />
            <span>// ARCHITECTURAL BATTLE MATRIX</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#f8fafc] uppercase tracking-tight">
            LEGACY ANTIVIRUS VS. AGEIS-X AUTONOMOUS SHIELD
          </h2>
          <p className="text-xs sm:text-sm text-[#7e8b9b] font-sans mt-1">
            Why traditional signature-based antivirus fails against modern polymorphic exploits, and how AgeIS-X redefines sovereign defense.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 border border-white/20 bg-[#020407] p-1 shrink-0 self-start sm:self-auto">
          <button
            onClick={() => toggleViewMode("simple")}
            className={`px-3 py-1 text-xs font-bold transition-all ${
              viewMode === "simple"
                ? "bg-[#00ff66] text-black shadow-[0_0_10px_rgba(0,255,102,0.4)]"
                : "text-[#7e8b9b] hover:text-white"
            }`}
          >
            SIMPLE VIEW
          </button>
          <button
            onClick={() => toggleViewMode("technical")}
            className={`px-3 py-1 text-xs font-bold transition-all ${
              viewMode === "technical"
                ? "bg-[#00f0ff] text-black shadow-[0_0_10px_rgba(0,240,255,0.4)]"
                : "text-[#7e8b9b] hover:text-white"
            }`}
          >
            TECHNICAL SPEC
          </button>
        </div>
      </div>

      {/* Battle Cards Grid */}
      <div className="space-y-3">
        {COMPARISON_DATA.map((row, idx) => {
          const isExpanded = activeRow === idx

          return (
            <div
              key={idx}
              className="border border-white/15 bg-[#03060a] hover:border-white/30 transition-all overflow-hidden relative"
            >
              <ReticleCorners />

              {/* Row Header Bar */}
              <div
                onClick={() => toggleRow(idx)}
                className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer bg-[#050910]/80 hover:bg-[#070e1a] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="px-2 py-0.5 border border-[#00ff66]/30 bg-[#00ff66]/10 text-[#00ff66] text-xs font-bold">
                    0{idx + 1}
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wide">
                    {row.vector}
                  </h3>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  {viewMode === "technical" && (
                    <span className="text-[#00f0ff] font-bold text-[11px] hidden sm:inline">
                      [{row.specCode}]
                    </span>
                  )}
                  <span className="text-[#7e8b9b] flex items-center gap-1 text-[11px]">
                    {isExpanded ? "[ CLOSE DETAILS ]" : "[ EXPAND BREAKDOWN ]"}
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? "rotate-90 text-[#00ff66]" : ""}`} />
                  </span>
                </div>
              </div>

              {/* Side-by-Side Comparative Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10 border-t border-white/10">
                {/* Left Column: Legacy Antivirus */}
                <div className="p-4 bg-[#0a0305]/40 space-y-2">
                  <div className="flex items-center justify-between text-xs pb-1 border-b border-[#ff003c]/20">
                    <span className="text-[#ff003c] font-bold flex items-center gap-1.5">
                      <X className="w-4 h-4 text-[#ff003c]" />
                      LEGACY ANTIVIRUS &amp; AD-BLOCKERS
                    </span>
                    <span className="px-1.5 py-0.2 text-[9px] bg-[#ff003c]/20 text-[#ff003c] font-bold border border-[#ff003c]/30">
                      VULNERABLE
                    </span>
                  </div>
                  <div className="font-bold text-xs text-white/90">
                    {row.legacyAV.title}
                  </div>
                  <p className="text-xs text-[#94a3b8] font-sans leading-relaxed">
                    {row.legacyAV.description}
                  </p>
                </div>

                {/* Right Column: AgeIS-X Sovereign Shield */}
                <div className="p-4 bg-[#020905]/40 space-y-2">
                  <div className="flex items-center justify-between text-xs pb-1 border-b border-[#00ff66]/20">
                    <span className="text-[#00ff66] font-bold flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-[#00ff66]" />
                      AGEIS-X AUTONOMOUS DEFENSE
                    </span>
                    <span className="px-1.5 py-0.2 text-[9px] bg-[#00ff66]/20 text-[#00ff66] font-bold border border-[#00ff66]/30 shadow-[0_0_10px_rgba(0,255,102,0.3)]">
                      HARDENED
                    </span>
                  </div>
                  <div className="font-bold text-xs text-white/90">
                    {row.ageisx.title}
                  </div>
                  <p className="text-xs text-[#cbd5e1] font-sans leading-relaxed">
                    {row.ageisx.description}
                  </p>
                </div>
              </div>

              {/* Expandable Technical Deep-Dive */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-white/10 bg-[#020408] p-4 text-xs space-y-2"
                  >
                    <div className="flex items-center gap-2 text-[#00f0ff] font-bold">
                      <Terminal className="w-3.5 h-3.5" />
                      <span>HEURISTIC ARCHITECTURAL DEEP-DIVE // {row.specCode}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] pt-1">
                      <div className="p-2 border border-white/10 bg-[#04070d]">
                        <span className="text-[#7e8b9b] block text-[10px]">DETECTION LAYER:</span>
                        <span className="text-white font-bold">Pre-Execution Kernel Trap</span>
                      </div>
                      <div className="p-2 border border-white/10 bg-[#04070d]">
                        <span className="text-[#7e8b9b] block text-[10px]">MITIGATION TIME:</span>
                        <span className="text-[#00ff66] font-bold">&lt; 0.8ms Deterministic</span>
                      </div>
                      <div className="p-2 border border-white/10 bg-[#04070d]">
                        <span className="text-[#7e8b9b] block text-[10px]">USER INTERVENTION:</span>
                        <span className="text-[#00f0ff] font-bold">0% (Autonomous Defang)</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}
