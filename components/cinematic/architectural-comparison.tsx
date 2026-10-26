"use client"

import * as React from "react"
import { Shield, XCircle, CheckCircle2, AlertOctagon, Zap, Lock } from "lucide-react"

export interface ComparisonRow {
  dimension: string
  legacy: string
  ageisX: string
  advantage: string
}

const COMPARISONS: ComparisonRow[] = [
  {
    dimension: "TELEMETRY & PRIVACY",
    legacy: "Siphons full browsing history, URL strings, and DNS lookups to remote cloud infrastructure.",
    ageisX: "100% on-device execution. 0 bytes ever leaves your local hardware enclave.",
    advantage: "Absolute Privacy",
  },
  {
    dimension: "INTERCEPTION LATENCY",
    legacy: "180ms - 500ms cloud round-trip delay. Intercepts files only after download completes.",
    ageisX: "p99 < 18ms local inference. Blocks malicious vectors before TLS handshake finishes.",
    advantage: "Zero-Hour Speed",
  },
  {
    dimension: "CPU OVERHEAD & BATTERY",
    legacy: "Heavy background processes consuming 8% to 25% CPU; severe battery drain on laptops.",
    ageisX: "Ultra-lean daemon sleeps when idle; consumes < 0.4% CPU overhead with no battery drain.",
    advantage: "Silent Execution",
  },
  {
    dimension: "DETECTION PARADIGM",
    legacy: "Outdated signature file lists updated daily; blind to zero-day polymorphic permutations.",
    ageisX: "Local TF-IDF, character entropy, and Bayesian ensemble models detecting novel zero-day vectors.",
    advantage: "Proactive ML",
  },
  {
    dimension: "USER EXPERIENCE",
    legacy: "Intrusive nag screens, fake registry clean warnings, and perpetual annual upsell modals.",
    ageisX: "Zero nagware. Silent background defense with clean, transparent developer telemetry dossiers.",
    advantage: "Zero Marketing Noise",
  },
  {
    dimension: "INSTALLATION FOOTPRINT",
    legacy: "1.2 GB+ bloated installer, invasive kernel drivers, and system destabilization risks.",
    ageisX: "< 38 MB resident memory footprint; sandboxed user-space inference loop.",
    advantage: "30x Lighter",
  },
]

export function ArchitecturalComparison() {
  return (
    <div className="space-y-12 font-mono">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#39FF14] tracking-wider uppercase">
            <span className="w-2 h-2 bg-[#39FF14] inline-block animate-pulse" />
            <span>06 // THE PARADIGM SHIFT</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase text-[#F1F0EB] tracking-tight">
            LEGACY ANTIVIRUS VS. AGEIS-X
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[#A6A6A0] max-w-md font-sans leading-relaxed">
          Security software should defend you, not monetize your telemetry. Examine the architectural contrast between legacy suites and AgeIS-X sovereign protection.
        </p>
      </div>

      {/* Comparison Table / Matrix */}
      <div className="border border-white/15 bg-[#04060A] overflow-hidden shadow-2xl">
        {/* Table Head */}
        <div className="grid grid-cols-1 md:grid-cols-12 border-b border-white/10 bg-[#080D14] text-xs font-black uppercase">
          <div className="md:col-span-3 p-4 sm:p-5 text-[#A6A6A0]">
            TECHNICAL DIMENSION
          </div>
          <div className="md:col-span-4 p-4 sm:p-5 border-t md:border-t-0 md:border-l border-white/10 text-red-400 flex items-center gap-2">
            <XCircle className="w-4 h-4 shrink-0" />
            <span>LEGACY SECURITY SUITES</span>
          </div>
          <div className="md:col-span-5 p-4 sm:p-5 border-t md:border-t-0 md:border-l border-white/10 bg-[#39FF14]/5 text-[#39FF14] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>AGEIS-X SOVEREIGN DEFENSE</span>
            </div>
            <span className="text-[9px] border border-[#39FF14]/40 px-2 py-0.5 bg-[#39FF14]/10 hidden sm:inline">
              EAL6+
            </span>
          </div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-white/10">
          {COMPARISONS.map((row, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 md:grid-cols-12 text-xs hover:bg-white/[0.02] transition-colors group"
            >
              {/* Technical Dimension */}
              <div className="md:col-span-3 p-4 sm:p-5 space-y-1 bg-white/[0.01]">
                <span className="font-bold text-[#F1F0EB] block tracking-wider">
                  {row.dimension}
                </span>
                <span className="text-[10px] text-[#39FF14] font-bold block">
                  [{row.advantage}]
                </span>
              </div>

              {/* Legacy Suite */}
              <div className="md:col-span-4 p-4 sm:p-5 border-t md:border-t-0 md:border-l border-white/10 text-[#A6A6A0] font-sans leading-relaxed">
                <span className="md:hidden text-[10px] text-red-400 font-mono font-bold block mb-1">
                  LEGACY SUITE:
                </span>
                {row.legacy}
              </div>

              {/* AgeIS-X */}
              <div className="md:col-span-5 p-4 sm:p-5 border-t md:border-t-0 md:border-l border-white/10 bg-[#39FF14]/[0.02] text-[#F1F0EB] font-sans leading-relaxed group-hover:bg-[#39FF14]/[0.05] transition-colors">
                <span className="md:hidden text-[10px] text-[#39FF14] font-mono font-bold block mb-1">
                  AGEIS-X:
                </span>
                <p className="font-medium text-[#F1F0EB]">
                  {row.ageisX}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
