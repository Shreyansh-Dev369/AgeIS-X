"use client"

import React from "react"
import { CheckSquare, ArrowRight, ShieldCheck } from "lucide-react"

interface RecommendationsPanelProps {
  recommendations: string[]
}

export function RecommendationsPanel({ recommendations }: RecommendationsPanelProps) {
  if (!recommendations || recommendations.length === 0) {
    return null
  }

  return (
    <div className="bg-[#0B0E14] border border-white/10 rounded-lg p-5 font-mono">
      <div className="flex items-center gap-2 mb-3.5 pb-2.5 border-b border-white/5">
        <CheckSquare className="w-4 h-4 text-[#00E575]" />
        <span className="text-xs font-bold text-[#F8FAFC] tracking-wider uppercase">
          RECOMMENDED INCIDENT RESPONSE ACTIONS
        </span>
      </div>

      <ul className="space-y-2.5">
        {recommendations.map((rec, idx) => (
          <li key={idx} className="flex items-start gap-2.5 text-xs text-[#E2E8F0] font-sans">
            <span className="flex items-center justify-center w-5 h-5 rounded bg-white/[0.04] border border-white/10 text-[10px] font-mono text-[#00E575] font-bold shrink-0 mt-0.5">
              {idx + 1}
            </span>
            <span className="leading-relaxed">{rec}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
