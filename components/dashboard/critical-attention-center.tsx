"use client"

import React, { useState } from "react"
import Link from "next/link"
import { CriticalAttentionItem } from "@/types/security"
import { PixelBadge } from "@/components/ui/pixel-badge"
import { TacticalFrame } from "@/components/ui/tactical-frame"
import { ArrowRight, X, CheckCircle2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CriticalAttentionCenterProps {
  items?: CriticalAttentionItem[]
}

export function CriticalAttentionCenter({ items = [] }: CriticalAttentionCenterProps) {
  const [activeItems, setActiveItems] = useState(items)

  const handleDismiss = (id: string) => {
    setActiveItems((prev) => prev.filter((i) => i.id !== id))
  }

  if (activeItems.length === 0) {
    return (
      <TacticalFrame
        variant="default"
        className="p-3.5 flex items-center justify-between gap-4 border-white/10 bg-[#040608] font-mono select-none"
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 border border-[#00ff66]/30 bg-[#00ff66]/10 text-[#00ff66] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#f8fafc]">
              CRITICAL ATTENTION CENTER // ALL POSTURES CLEAR
            </span>
            <p className="text-[11px] text-[#7e8b9b]">
              No uncontained zero-day threats or critical vulnerabilities currently require operator intervention.
            </p>
          </div>
        </div>
        <PixelBadge variant="phosphor" size="sm">
          OPTIMAL
        </PixelBadge>
      </TacticalFrame>
    )
  }

  return (
    <TacticalFrame
      variant="panel"
      reticles={true}
      reticleColor="warning"
      className="p-4 sm:p-5 space-y-3.5 border-[#ffb800]/40 bg-[#080c10] font-mono select-none"
    >
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-[#ffb800] rounded-none animate-pulse" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#ffb800]">
            CRITICAL ATTENTION REQUIRED ({activeItems.length})
          </h3>
        </div>
        <span className="text-[10px] text-white/50">OPERATOR MITIGATION NEEDED</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {activeItems.map((item) => {
          const isCritical = item.severity === "critical"
          const isHigh = item.severity === "high"

          return (
            <div
              key={item.id}
              className="p-3.5 bg-[#040608] border border-white/15 flex flex-col justify-between gap-3 text-xs"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <PixelBadge
                    variant={isCritical ? "danger" : isHigh ? "warning" : "cyan"}
                    size="sm"
                  >
                    {item.severity.toUpperCase()}
                  </PixelBadge>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#00ff66] border border-[#00ff66]/30 px-1.5 py-0.2 bg-[#00ff66]/10">
                      {item.status || "ACTION REQUIRED"}
                    </span>
                    <span className="text-[10px] text-[#7e8b9b]">{item.timestamp}</span>
                  </div>
                </div>

                <h4 className="font-bold uppercase tracking-wide text-[#f8fafc] text-xs pt-1">
                  {item.title}
                </h4>
                <p className="text-[11px] text-[#7e8b9b] leading-relaxed">
                  {item.description}
                </p>
                {item.affectedAsset && (
                  <p className="text-[10px] text-[#00f0ff]">
                    AFFECTED_ASSET: <span className="text-white">{item.affectedAsset}</span>
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-2.5 border-t border-white/10">
                <span className="text-[10px] text-[#7e8b9b] truncate max-w-[140px]">
                  SRC: {item.source}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDismiss(item.id)}
                    className="text-[10px] uppercase text-[#7e8b9b] hover:text-white px-1.5 py-1 border border-white/10 hover:border-white/30 transition-colors"
                  >
                    [ DISMISS ]
                  </button>
                  <Link href={item.actionHref}>
                    <Button
                      size="sm"
                      className="h-7 px-2.5 text-[11px] font-mono uppercase tracking-wider font-bold"
                    >
                      <span>{item.actionLabel}</span>
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </TacticalFrame>
  )
}
