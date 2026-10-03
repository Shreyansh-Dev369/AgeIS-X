"use client"

import React, { useState } from "react"
import { SecurityScoreData } from "@/types/security"
import { ScoreExplainabilityDrawer } from "@/components/dashboard/score-explainability-drawer"
import { ArrowUpRight, ArrowDownRight, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TechnicalLabel } from "@/components/design-system/editorial-primitives"

interface SecurityPostureHeroProps {
  data: SecurityScoreData
  className?: string
}

export function SecurityPostureHero({ data, className = "" }: SecurityPostureHeroProps) {
  const [explainOpen, setExplainOpen] = useState(false)
  const { score, maxScore = 100, status, trend, breakdown = [], recommendation } = data

  return (
    <>
      <div className={`p-5 border border-white/10 bg-[#080808] font-mono flex flex-col justify-between ${className}`}>
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div>
            <TechnicalLabel className="text-[#6F706D]">HEALTH COEFFICIENT</TechnicalLabel>
            <h2 className="text-sm font-bold text-[#F1F0EB] uppercase mt-0.5">
              POSTURE EVALUATION
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#39FF14]/10 text-[#39FF14] border border-[#39FF14]/20 text-[10px] font-bold">
              {status.toUpperCase()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExplainOpen(true)}
              className="text-[11px] font-mono h-8 gap-1.5 rounded-none border-white/20 bg-transparent hover:bg-white/5 text-[#F1F0EB]"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#A6A6A0]" />
              <span>EXPLAIN</span>
            </Button>
          </div>
        </div>

        {/* Main Score Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center py-4">
          {/* Big Score Display */}
          <div className="sm:col-span-4 flex flex-col items-center justify-center text-center p-4 border border-white/10 bg-[#050505]">
            <span className="text-[10px] text-[#A6A6A0] uppercase">SCORE INDEX</span>
            <div className="text-4xl sm:text-5xl font-bold text-[#39FF14] tracking-tight my-1 font-mono">
              {score}
            </div>
            <span className="text-[11px] text-[#6F706D] font-mono">/ {maxScore} MAX</span>

            <div className="mt-2 flex items-center gap-1 text-[11px] font-mono">
              {trend.direction === "up" ? (
                <span className="flex items-center text-[#39FF14]">
                  <ArrowUpRight className="w-3.5 h-3.5" />+{trend.delta} PTS
                </span>
              ) : trend.direction === "down" ? (
                <span className="flex items-center text-rose-400">
                  <ArrowDownRight className="w-3.5 h-3.5" />-{trend.delta} PTS
                </span>
              ) : (
                <span className="text-[#A6A6A0]">0 PTS</span>
              )}
              <span className="text-[#6F706D]">({trend.period})</span>
            </div>
          </div>

          {/* Breakdown Bars */}
          <div className="sm:col-span-8 space-y-2.5 text-xs">
            <div className="flex items-center justify-between text-[10px] text-[#6F706D] uppercase pb-1 border-b border-white/10">
              <span>DOMAIN VECTOR</span>
              <span>INDEX</span>
            </div>

            <div className="space-y-2.5">
              {breakdown.slice(0, 4).map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#A6A6A0] truncate max-w-[200px] uppercase">{item.category}</span>
                    <span className="font-mono text-[#F1F0EB]">{item.score}%</span>
                  </div>
                  <div className="w-full h-1 bg-[#151515] overflow-hidden border border-white/5">
                    <div
                      className={`h-full ${
                        item.score >= 90 ? "bg-[#39FF14]" : item.score >= 70 ? "bg-sky-400" : "bg-amber-400"
                      }`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Recommendation */}
        {recommendation && (
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-[#A6A6A0]">
            <span className="text-[#6F706D] uppercase">ACTION:</span>
            <span className="truncate max-w-[340px] text-[#F1F0EB]">{recommendation}</span>
          </div>
        )}
      </div>

      <ScoreExplainabilityDrawer
        isOpen={explainOpen}
        onClose={() => setExplainOpen(false)}
        scoreData={data}
      />
    </>
  )
}
