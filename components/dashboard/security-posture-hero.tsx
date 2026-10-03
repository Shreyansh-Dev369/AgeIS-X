"use client"

import React, { useState } from "react"
import { SecurityScoreData } from "@/types/security"
import { PixelBadge } from "@/components/ui/pixel-badge"
import { PixelStatusBar } from "@/components/ui/pixel-status-bar"
import { TacticalFrame } from "@/components/ui/tactical-frame"
import { ScoreExplainabilityDrawer } from "@/components/dashboard/score-explainability-drawer"
import { ArrowUpRight, ArrowDownRight, HelpCircle, ChevronRight, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SecurityPostureHeroProps {
  data: SecurityScoreData
  className?: string
}

export function SecurityPostureHero({ data, className = "" }: SecurityPostureHeroProps) {
  const [explainOpen, setExplainOpen] = useState(false)
  const { score, maxScore = 100, status, trend, breakdown = [], recommendation } = data

  const percentage = Math.min(100, Math.max(0, Math.round((score / maxScore) * 100)))

  return (
    <>
      <TacticalFrame
        variant="panel"
        reticles={true}
        reticleColor="phosphor"
        className={`p-5 sm:p-6 border-white/15 bg-[#080c10] font-mono select-none flex flex-col justify-between ${className}`}
      >
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7e8b9b]">
                POSTURE // TELEMETRY
              </span>
              <PixelBadge variant="phosphor" size="sm" dot>
                SYNCHRONIZED
              </PixelBadge>
            </div>
            <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-[#f8fafc] mt-0.5 font-sans">
              Overall Security Posture
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <PixelBadge variant="phosphor" size="md">
              {status}
            </PixelBadge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExplainOpen(true)}
              className="text-xs font-mono uppercase tracking-wider h-8 gap-1.5 border-white/20 bg-[#040608] hover:border-[#00ff66]/50"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#00ff66]" />
              <span>[ EXPLAIN ]</span>
            </Button>
          </div>
        </div>

        {/* Main Score Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center py-4">
          {/* Big Monospace Score Display */}
          <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-3 bg-[#040608] border border-white/10">
            <span className="text-[10px] uppercase text-[#7e8b9b]">POSTURE_RATING</span>
            <div className="text-4xl sm:text-5xl font-black text-[#00ff66] tracking-tight my-1">
              {score}
            </div>
            <span className="text-[10px] text-white/40 font-mono">/ {maxScore} PTS</span>

            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[#7e8b9b]">
              {trend.direction === "up" ? (
                <span className="flex items-center text-[#00ff66] font-bold">
                  <ArrowUpRight className="w-3.5 h-3.5" />+{trend.delta} PTS
                </span>
              ) : trend.direction === "down" ? (
                <span className="flex items-center text-[#ff3b30] font-bold">
                  <ArrowDownRight className="w-3.5 h-3.5" />-{trend.delta} PTS
                </span>
              ) : (
                <span className="text-white/40">0 PTS</span>
              )}
              <span className="text-[10px]">vs {trend.period}</span>
            </div>
          </div>

          {/* Breakdown Bars */}
          <div className="md:col-span-8 space-y-2.5">
            <div className="flex items-center justify-between text-[11px] text-[#7e8b9b] pb-1 border-b border-white/5">
              <span>DOMAIN VECTOR</span>
              <span>CONFIDENCE READINESS</span>
            </div>

            <div className="space-y-2">
              {breakdown.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <PixelStatusBar
                    value={item.score}
                    label={item.category}
                    variant={item.score >= 90 ? "phosphor" : item.score >= 70 ? "cyan" : "warning"}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer recommendation callout */}
        {recommendation && (
          <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-start sm:items-center gap-2 text-[#7e8b9b]">
              <Zap className="w-3.5 h-3.5 text-[#00ff66] shrink-0 mt-0.5 sm:mt-0" />
              <span className="text-[11px]">
                <strong className="text-[#f8fafc]">RECOMMENDED ACTION:</strong> {recommendation}
              </span>
            </div>
            <button
              onClick={() => setExplainOpen(true)}
              className="inline-flex items-center gap-1 text-[11px] text-[#00ff66] hover:underline shrink-0 uppercase font-bold"
            >
              <span>[ VIEW 7 FACTORS ]</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        )}
      </TacticalFrame>

      <ScoreExplainabilityDrawer
        isOpen={explainOpen}
        onClose={() => setExplainOpen(false)}
        scoreData={data}
      />
    </>
  )
}
