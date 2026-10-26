"use client"

import React from "react"
import { ShieldCheck, AlertTriangle, ShieldAlert, HelpCircle, Info, Clock, Hash, Percent } from "lucide-react"
import { StandardEngineResponse } from "@/lib/services/demo-lab-service"
import { cn } from "@/lib/utils"

interface ResultCardProps {
  result: StandardEngineResponse
}

export function ResultCard({ result }: ResultCardProps) {
  const verdictConfig = {
    safe: {
      label: "SAFE / BENIGN",
      icon: ShieldCheck,
      color: "text-[#00E575]",
      bgColor: "bg-[#00E575]/10",
      borderColor: "border-[#00E575]/30",
      barColor: "bg-[#00E575]",
    },
    suspicious: {
      label: "SUSPICIOUS / ELEVATED",
      icon: AlertTriangle,
      color: "text-[#FFB800]",
      bgColor: "bg-[#FFB800]/10",
      borderColor: "border-[#FFB800]/30",
      barColor: "bg-[#FFB800]",
    },
    malicious: {
      label: "MALICIOUS / CRITICAL",
      icon: ShieldAlert,
      color: "text-[#FF0055]",
      bgColor: "bg-[#FF0055]/10",
      borderColor: "border-[#FF0055]/30",
      barColor: "bg-[#FF0055]",
    },
    inconclusive: {
      label: "INCONCLUSIVE / UNVERIFIED",
      icon: HelpCircle,
      color: "text-[#94A3B8]",
      bgColor: "bg-[#94A3B8]/10",
      borderColor: "border-[#94A3B8]/30",
      barColor: "bg-[#94A3B8]",
    },
  }

  const v = verdictConfig[result.verdict] || verdictConfig.inconclusive
  const Icon = v.icon

  return (
    <div className="bg-[#0B0E14] border border-white/10 rounded-lg p-5 sm:p-6 space-y-6 font-mono">
      {/* Top Header: Verdict & Score Meter */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Verdict Badge */}
        <div className="flex items-center gap-4">
          <div className={cn("p-3 rounded-lg border", v.bgColor, v.borderColor)}>
            <Icon className={cn("w-8 h-8", v.color)} />
          </div>
          <div>
            <div className="text-[11px] text-[#64748B] uppercase tracking-wider font-semibold">
              ENGINE VERDICT
            </div>
            <div className={cn("text-lg font-bold tracking-tight", v.color)}>
              {v.label}
            </div>
          </div>
        </div>

        {/* Risk Score Meter */}
        <div className="space-y-1.5 md:border-x md:border-white/10 md:px-6">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#94A3B8]">RISK SCORE</span>
            <span className={cn("font-bold text-base", v.color)}>
              {result.risk_score} <span className="text-[#64748B] text-xs">/ 100</span>
            </span>
          </div>
          <div className="h-2 w-full bg-[#151922] rounded-full overflow-hidden">
            <div
              className={cn("h-full transition-all duration-500 rounded-full", v.barColor)}
              style={{ width: `${Math.min(100, Math.max(5, result.risk_score))}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-[#64748B]">
            <span>0 (CLEAN)</span>
            <span>30 (SUSP)</span>
            <span>70+ (MALICIOUS)</span>
          </div>
        </div>

        {/* Confidence & Metadata */}
        <div className="flex items-center justify-between md:justify-end gap-6 text-xs text-[#94A3B8]">
          {result.confidence !== null && result.confidence !== undefined && (
            <div>
              <div className="text-[10px] text-[#64748B] uppercase">CALIBRATED CONFIDENCE</div>
              <div className="text-base font-bold text-[#F8FAFC]">
                {(result.confidence * 100).toFixed(1)}%
              </div>
            </div>
          )}
          <div>
            <div className="text-[10px] text-[#64748B] uppercase">ANALYSIS ID</div>
            <div className="text-xs text-[#F8FAFC] font-mono truncate max-w-[140px]">
              {result.analysis_id}
            </div>
          </div>
        </div>
      </div>

      {/* Summary Box */}
      <div className="bg-[#07090E] border border-white/5 p-4 rounded text-sm text-[#F8FAFC] leading-relaxed font-sans">
        <span className="font-mono text-xs font-bold text-[#00E575] mr-2">[SUMMARY]</span>
        {result.summary}
      </div>

      {/* Limitations & Caveats Banner */}
      {result.limitations && result.limitations.length > 0 && (
        <div className="border border-amber-500/20 bg-amber-500/5 rounded p-3.5 flex items-start gap-3">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-300/90 leading-relaxed font-sans">
            <span className="font-mono font-bold text-amber-400 mr-1.5 uppercase text-[11px]">
              SCOPE & UNCERTAINTY DISCLOSURE:
            </span>
            {result.limitations.join(" ")}
          </div>
        </div>
      )}
    </div>
  )
}
