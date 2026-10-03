"use client"

import React from "react"
import Link from "next/link"
import { ThreatIntelligenceSummary } from "@/types/security"
import { PixelBadge } from "@/components/ui/pixel-badge"
import { TacticalFrame } from "@/components/ui/tactical-frame"
import { Activity, ArrowRight } from "lucide-react"

interface ThreatIntelligenceCardProps {
  data: ThreatIntelligenceSummary
}

export function ThreatIntelligenceCard({ data }: ThreatIntelligenceCardProps) {
  return (
    <TacticalFrame
      variant="panel"
      reticles={true}
      reticleColor="cyan"
      className="p-5 space-y-4 border-white/15 bg-[#080c10] font-mono select-none"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#00f0ff]" />
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#f8fafc]">
            Global Threat Intelligence Architecture
          </h3>
        </div>
        <div className="flex items-center gap-2 text-[10px]">
          <PixelBadge variant="cyan" size="sm">
            {data.architectureStatus}
          </PixelBadge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Left Metrics */}
        <div className="md:col-span-4 space-y-2.5 text-xs">
          <div className="p-3 bg-[#040608] border border-white/10 space-y-1">
            <span className="text-[10px] text-[#7e8b9b] uppercase block">CONSENSUS NODES</span>
            <span className="text-lg font-bold text-[#f8fafc]">{data.consensusNodesOnline.toLocaleString()}</span>
            <p className="text-[10px] text-[#7e8b9b]">Decentralized edge validation nodes</p>
          </div>

          <div className="p-3 bg-[#040608] border border-white/10 space-y-1">
            <span className="text-[10px] text-[#7e8b9b] uppercase block">SYNCHRONIZED SIGNATURES</span>
            <span className="text-lg font-bold text-[#00ff66]">{data.signaturesSynchronized}</span>
            <p className="text-[10px] text-[#7e8b9b]">Zero-day lexical hashes & vectors</p>
          </div>
        </div>

        {/* Right Emerging Vectors */}
        <div className="md:col-span-8 space-y-2">
          <span className="text-[10px] text-[#7e8b9b] uppercase block">
            // EMERGING THREAT VECTORS (CONSENSUS FLAGGED)
          </span>

          <div className="space-y-1.5 text-xs">
            {data.topEmergingVectors.map((vec, idx) => (
              <div
                key={idx}
                className="p-2.5 bg-[#040608] border border-white/10 flex items-center justify-between"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-1.5 h-1.5 bg-[#00f0ff] rounded-none shrink-0" />
                  <span className="text-[#f8fafc] font-bold truncate text-[11px]">{vec.name}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0 text-[10px]">
                  <span className="text-[#7e8b9b]">{vec.change} spike</span>
                  <PixelBadge variant={vec.severity === "critical" ? "danger" : "warning"} size="sm">
                    {vec.severity.toUpperCase()}
                  </PixelBadge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
        <span className="text-[10px] text-[#7e8b9b]">
          Decentralized IoC consensus is continuously verified against local model baselines.
        </span>
        <Link
          href="/dashboard/threats"
          className="text-xs text-[#00ff66] hover:underline uppercase font-bold inline-flex items-center gap-1"
        >
          <span>[ OPEN VECTOR FEED ]</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </TacticalFrame>
  )
}
