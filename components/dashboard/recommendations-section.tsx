"use client"

import React from "react"
import Link from "next/link"
import { SecurityRecommendationItem } from "@/types/security"
import { Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PixelBadge } from "@/components/ui/pixel-badge"
import { TacticalFrame } from "@/components/ui/tactical-frame"

interface RecommendationsSectionProps {
  recommendations: SecurityRecommendationItem[]
}

export function RecommendationsSection({ recommendations }: RecommendationsSectionProps) {
  return (
    <TacticalFrame
      variant="panel"
      reticles={true}
      reticleColor="phosphor"
      className="p-5 space-y-4 border-white/15 bg-[#080c10] font-mono select-none"
    >
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#00ff66]" />
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#f8fafc]">
            Prioritized Security Recommendations
          </h3>
        </div>
        <PixelBadge variant="phosphor" size="sm">
          ACTIONABLE
        </PixelBadge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        {recommendations.map((rec) => {
          const isHigh = rec.impact === "High"

          return (
            <div
              key={rec.id}
              className="p-4 border border-white/10 bg-[#040608] flex flex-col justify-between gap-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <PixelBadge variant={isHigh ? "danger" : "cyan"} size="sm">
                    {rec.impact.toUpperCase()} IMPACT
                  </PixelBadge>
                </div>

                <h4 className="font-bold text-[#f8fafc] uppercase tracking-wide leading-snug">{rec.title}</h4>

                <div className="space-y-1 text-[11px] text-[#7e8b9b]">
                  <p>
                    <strong className="text-[#00f0ff]">WHY:</strong> {rec.whyItMatters}
                  </p>
                  <p>
                    <strong className="text-[#00ff66]">ACTION:</strong> {rec.whatToDo}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10">
                <Link href={rec.actionHref}>
                  <Button
                    size="sm"
                    className="w-full text-xs font-mono uppercase tracking-wider font-bold h-8 justify-between"
                  >
                    <span>{rec.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </TacticalFrame>
  )
}
