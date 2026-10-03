"use client"

import * as React from "react"
import {
  PROTECTION_COMPARISON_MATRIX,
  FeatureStatus,
  AGEIS_ROBOT_PLANS,
  PlanId,
} from "./robot-plans-data"
import {
  PixelScoutGlyph,
  PixelGuardGlyph,
  PixelSentinelGlyph,
  PixelAegisGlyph,
  RegistrationMark,
} from "./robot-pixel-sprites"
import { Check, Minus, AlertCircle, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ProtectionMatrixTableProps {
  selectedPlan: PlanId
  onSelectPlan: (id: PlanId) => void
}

export function ProtectionMatrixTable({
  selectedPlan,
  onSelectPlan,
}: ProtectionMatrixTableProps) {
  const renderStatusCell = (statusOrText: FeatureStatus | string, isCurrentColSelected: boolean) => {
    if (statusOrText === "AVAILABLE") {
      return (
        <div className="flex items-center justify-center">
          <span className="inline-flex items-center justify-center w-5 h-5 bg-[#39FF14]/15 border border-[#39FF14]/40 text-[#39FF14]">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </span>
          <span className="sr-only">Available</span>
        </div>
      )
    }

    if (statusOrText === "BETA") {
      return (
        <div className="flex items-center justify-center">
          <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-[#FFB800]/15 text-[#FFB800] border border-[#FFB800]/40 uppercase tracking-wider">
            BETA
          </span>
        </div>
      )
    }

    if (statusOrText === "PROTOTYPE") {
      return (
        <div className="flex items-center justify-center">
          <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/40 uppercase tracking-wider">
            LAB
          </span>
        </div>
      )
    }

    if (statusOrText === "PLANNED") {
      return (
        <div className="flex items-center justify-center">
          <span className="px-1.5 py-0.5 text-[9px] font-mono text-[#6F706D] bg-white/5 border border-white/10 uppercase tracking-wider">
            PLANNED
          </span>
        </div>
      )
    }

    if (statusOrText === "NOT_INCLUDED") {
      return (
        <div className="flex items-center justify-center text-[#4A4A48]">
          <Minus className="w-4 h-4" />
          <span className="sr-only">Not Included</span>
        </div>
      )
    }

    // Custom string (e.g. "1 Device", "10 Devices", "Priority Channel")
    return (
      <span
        className={cn(
          "text-xs font-mono font-bold text-center block",
          isCurrentColSelected ? "text-[#39FF14]" : "text-[#D4D4D0]"
        )}
      >
        {statusOrText}
      </span>
    )
  }

  return (
    <section className="relative w-full py-16 md:py-24 border-b border-white/10 font-mono">
      {/* Section Heading */}
      <div className="space-y-4 mb-12">
        <div className="flex items-center gap-2 text-xs text-[#39FF14]">
          <span>02</span>
          <span className="text-white/20">/</span>
          <span className="text-[#A6A6A0] uppercase tracking-widest">
            TECHNICAL MATRIX
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[#F1F0EB]">
            COMPARE PROTECTION
          </h2>
          <p className="text-xs sm:text-sm text-[#A6A6A0] font-sans max-w-md">
            Granular breakdown of defense capabilities, telemetry throughput, and supported modules across the AgeIS-X unit roster.
          </p>
        </div>
      </div>

      {/* Comparison Table with Horizontal Scroll on Mobile and Sticky Column */}
      <div className="relative border border-white/15 bg-[#070707] overflow-x-auto shadow-2xl">
        <table className="w-full text-left border-collapse min-w-[700px]">
          {/* Table Header with Robot Headers */}
          <thead>
            <tr className="border-b border-white/15 bg-[#050505]">
              <th className="p-4 sm:p-5 text-xs text-[#A6A6A0] font-mono uppercase tracking-wider w-[36%] sticky left-0 bg-[#050505] z-20 border-r border-white/10">
                CAPABILITY / SUBSYSTEM
              </th>
              {AGEIS_ROBOT_PLANS.map((plan) => {
                const isSelected = plan.id === selectedPlan
                return (
                  <th
                    key={plan.id}
                    onClick={() => onSelectPlan(plan.id)}
                    className={cn(
                      "p-4 sm:p-5 text-center cursor-pointer transition-colors w-[16%]",
                      isSelected
                        ? "bg-[#39FF14]/10 border-t-2 border-t-[#39FF14]"
                        : "hover:bg-white/5"
                    )}
                  >
                    <div className="space-y-1 flex flex-col items-center">
                      <span className="text-[9px] text-[#6F706D] block">
                        UNIT {plan.index}
                      </span>
                      <span
                        className={cn(
                          "text-xs sm:text-sm font-black uppercase tracking-tight block",
                          isSelected ? "text-[#39FF14]" : "text-[#F1F0EB]"
                        )}
                      >
                        {plan.robotName}
                      </span>
                      <span className="text-[10px] text-[#A6A6A0] font-mono block">
                        {plan.priceFormatted}
                      </span>
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>

          {/* Table Body Iterating Categories */}
          <tbody>
            {PROTECTION_COMPARISON_MATRIX.map((cat, catIdx) => (
              <React.Fragment key={catIdx}>
                {/* Category Header Row */}
                <tr className="bg-[#0A0A0A] border-y border-white/10">
                  <td
                    colSpan={5}
                    className="py-2.5 px-4 sm:px-5 text-[10px] font-bold text-[#39FF14] tracking-wider uppercase sticky left-0 z-10 bg-[#0A0A0A]"
                  >
                    {cat.categoryName}
                  </td>
                </tr>

                {/* Individual Feature Rows */}
                {cat.features.map((feat, fIdx) => (
                  <tr
                    key={fIdx}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Feature Description Sticky Col */}
                    <td className="p-4 sm:p-5 text-xs sticky left-0 bg-[#070707] z-10 border-r border-white/10">
                      <div className="space-y-1">
                        <span className="font-bold text-[#F1F0EB] block font-mono uppercase text-[11px] sm:text-xs">
                          {feat.name}
                        </span>
                        <p className="text-[10px] text-[#6F706D] font-sans leading-relaxed">
                          {feat.description}
                        </p>
                      </div>
                    </td>

                    {/* Scout Col */}
                    <td
                      className={cn(
                        "p-4 text-center border-r border-white/5",
                        selectedPlan === "scout" && "bg-[#39FF14]/[0.03]"
                      )}
                    >
                      {renderStatusCell(feat.scout, selectedPlan === "scout")}
                    </td>

                    {/* Guard Col */}
                    <td
                      className={cn(
                        "p-4 text-center border-r border-white/5",
                        selectedPlan === "guard" && "bg-[#39FF14]/[0.03]"
                      )}
                    >
                      {renderStatusCell(feat.guard, selectedPlan === "guard")}
                    </td>

                    {/* Sentinel Col */}
                    <td
                      className={cn(
                        "p-4 text-center border-r border-white/5",
                        selectedPlan === "sentinel" && "bg-[#39FF14]/[0.03]"
                      )}
                    >
                      {renderStatusCell(feat.sentinel, selectedPlan === "sentinel")}
                    </td>

                    {/* Aegis Col */}
                    <td
                      className={cn(
                        "p-4 text-center",
                        selectedPlan === "aegis" && "bg-[#39FF14]/[0.03]"
                      )}
                    >
                      {renderStatusCell(feat.aegis, selectedPlan === "aegis")}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend & Verification Note */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-[10px] text-[#A6A6A0]">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-[#6F706D] uppercase font-bold">STATUS KEY:</span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 bg-[#39FF14]/20 border border-[#39FF14]/50 inline-flex items-center justify-center text-[#39FF14] text-[9px] font-bold">
              ✓
            </span>
            <span>AVAILABLE NOW</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="px-1 py-0.2 bg-[#FFB800]/20 text-[#FFB800] border border-[#FFB800]/50 text-[8px] font-bold">
              BETA
            </span>
            <span>STAGED ROLLOUT</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="px-1 py-0.2 bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/50 text-[8px] font-bold">
              LAB
            </span>
            <span>IN-FLIGHT PROTOTYPE</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Minus className="w-3.5 h-3.5 text-[#6F706D]" />
            <span>NOT INCLUDED</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-white/30">INTEGRITY_HASH: 0x99A4FE</span>
          <RegistrationMark size={10} />
        </div>
      </div>
    </section>
  )
}
