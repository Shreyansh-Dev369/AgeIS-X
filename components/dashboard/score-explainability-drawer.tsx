"use client"

import React from "react"
import Link from "next/link"
import { Drawer, DrawerContent } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { PixelBadge } from "@/components/ui/pixel-badge"
import { TacticalFrame } from "@/components/ui/tactical-frame"
import { SecurityScoreData } from "@/types/security"
import { ArrowRight, X, Info } from "lucide-react"

interface ScoreExplainabilityDrawerProps {
  isOpen: boolean
  onClose: () => void
  scoreData: SecurityScoreData
}

export function ScoreExplainabilityDrawer({
  isOpen,
  onClose,
  scoreData,
}: ScoreExplainabilityDrawerProps) {
  const { score, maxScore = 100, factors = [] } = scoreData

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent
        side="right"
        className="w-full sm:max-w-xl bg-[#040608] border-l border-white/15 p-0 text-[#f8fafc] flex flex-col h-full font-mono select-none"
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-[#080c10] flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <PixelBadge variant="phosphor" size="sm" dot>
                EXPLAINABILITY // SCORE_FACTORS
              </PixelBadge>
              <span className="text-xs text-[#00ff66] font-bold">RATING: {score}/{maxScore} PTS</span>
            </div>
            <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-[#f8fafc] pt-1">
              Security Score Factor Breakdown
            </h2>
            <p className="text-[11px] text-[#7e8b9b] leading-relaxed">
              Transparent deterministic calculation of posture readiness across verified vectors.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 border border-white/10 hover:border-white/30 text-[#7e8b9b] hover:text-white transition-colors"
            aria-label="Close explainability panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Factors List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 text-xs">
          {/* Methodology Banner */}
          <TacticalFrame variant="default" className="p-3.5 border-white/10 bg-[#080c10] flex items-start gap-3">
            <Info className="w-4 h-4 text-[#00f0ff] shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-[11px]">
              <p className="font-bold uppercase tracking-wider text-[#00f0ff]">Deterministic Posture Algorithm</p>
              <p className="text-[#7e8b9b] leading-relaxed">
                Evaluated from active daemon telemetry, biometric MFA enforcement, domain vector coverage, and sandbox quarantine backlogs.
              </p>
            </div>
          </TacticalFrame>

          {/* Factor Cards */}
          <div className="space-y-2.5">
            {factors.map((factor) => {
              const isStrong = factor.status === "Strong"
              const isGood = factor.status === "Good"
              const isNeedsAttention = factor.status === "Needs Attention"

              return (
                <div
                  key={factor.id}
                  className="p-3.5 border border-white/10 bg-[#080c10] space-y-2 hover:border-[#00ff66]/40 transition-all"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-none ${
                          isStrong
                            ? "bg-[#00ff66]"
                            : isGood
                            ? "bg-[#00f0ff]"
                            : isNeedsAttention
                            ? "bg-[#ffb800]"
                            : "bg-[#ff3b30]"
                        }`}
                      />
                      <h3 className="text-xs font-bold uppercase tracking-wide text-[#f8fafc]">{factor.name}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-white/40">WEIGHT: {factor.weight}%</span>
                      <PixelBadge
                        variant={isStrong ? "phosphor" : isGood ? "cyan" : isNeedsAttention ? "warning" : "danger"}
                        size="sm"
                      >
                        {factor.status.toUpperCase()} ({factor.score}%)
                      </PixelBadge>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#7e8b9b] leading-relaxed">{factor.reason}</p>

                  <div className="pt-2 flex items-center justify-between border-t border-white/10">
                    <span className="text-[10px] text-[#7e8b9b]">RECOMMENDED STEP:</span>
                    <Link
                      href={factor.actionHref}
                      onClick={onClose}
                      className="inline-flex items-center gap-1 text-[11px] text-[#00ff66] hover:underline font-bold transition-colors uppercase"
                    >
                      <span>[ {factor.action} ]</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-white/10 bg-[#080c10] flex items-center justify-between text-xs text-[#7e8b9b]">
          <span>EVALUATED: {scoreData.lastEvaluated}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs font-mono uppercase tracking-wider h-8 border-white/20"
          >
            [ CLOSE PANEL ]
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
