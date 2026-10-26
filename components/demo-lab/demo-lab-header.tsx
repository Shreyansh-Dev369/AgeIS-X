"use client"

import React from "react"
import Link from "next/link"
import { Shield, RotateCcw, AlertTriangle, CheckCircle2, ChevronRight, Activity, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DemoLabHeaderProps {
  engineId: string
  engineName: string
  category: string
  description: string
  analysisMode: "live" | "simulated"
  onReset?: () => void
  isAnalyzing?: boolean
}

export function DemoLabHeader({
  engineId,
  engineName,
  category,
  description,
  analysisMode,
  onReset,
  isAnalyzing = false,
}: DemoLabHeaderProps) {
  return (
    <div className="relative border-b border-white/10 bg-[#0B0E14] p-5 sm:p-6 mb-6">
      {/* Top Breadcrumbs & Mode Badge */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-2 text-xs font-mono text-[#94A3B8]">
          <Link href="/demo-lab" className="hover:text-[#00E575] transition-colors">
            DEMO LAB
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#64748B]">{category}</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#F8FAFC] font-bold">{engineId}</span>
        </div>

        {/* Mode Pill */}
        <div className="flex items-center gap-2">
          {analysisMode === "live" ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#00E575]/10 text-[#00E575] border border-[#00E575]/30 text-xs font-mono font-bold tracking-wider rounded">
              <span className="w-2 h-2 rounded-full bg-[#00E575] animate-pulse" />
              LIVE ANALYSIS
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30 text-xs font-mono font-bold tracking-wider rounded">
              <span className="w-2 h-2 rounded-full bg-[#00F0FF]" />
              SIMULATED DEMO TELEMETRY
            </span>
          )}

          {onReset && (
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              disabled={isAnalyzing}
              className="h-7 text-xs font-mono border-white/10 hover:border-white/20 bg-white/[0.03] text-[#94A3B8] hover:text-[#F8FAFC]"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Title & Description */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-xl font-black text-[#00E575] font-mono tracking-tight bg-[#00E575]/10 px-2.5 py-0.5 border border-[#00E575]/20">
              {engineId}
            </span>
            <h1 className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-[#F8FAFC]">
              {engineName}
            </h1>
          </div>
          <p className="mt-2 text-sm text-[#94A3B8] max-w-3xl leading-relaxed font-sans">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}
