"use client"

import * as React from "react"
import { AGEIS_ROBOT_PLANS, PlanId } from "./robot-plans-data"
import {
  PixelScoutGlyph,
  PixelGuardGlyph,
  PixelSentinelGlyph,
  PixelAegisGlyph,
  RegistrationMark,
} from "./robot-pixel-sprites"
import { ArrowRight, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface WhichUnitGuideProps {
  selectedPlan: PlanId
  onSelectPlan: (id: PlanId) => void
}

export function WhichUnitGuide({ selectedPlan, onSelectPlan }: WhichUnitGuideProps) {
  const glyphMap = {
    scout: PixelScoutGlyph,
    guard: PixelGuardGlyph,
    sentinel: PixelSentinelGlyph,
    aegis: PixelAegisGlyph,
  }

  return (
    <section className="relative w-full py-16 md:py-24 border-b border-white/10 font-mono">
      {/* Heading */}
      <div className="space-y-4 mb-12">
        <div className="flex items-center gap-2 text-xs text-[#39FF14]">
          <span>03</span>
          <span className="text-white/20">/</span>
          <span className="text-[#A6A6A0] uppercase tracking-widest">
            NEUTRAL ADVISORY
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[#F1F0EB]">
            WHICH UNIT
            <br />
            DO YOU NEED?
          </h2>
          <p className="text-xs sm:text-sm text-[#A6A6A0] font-sans max-w-md">
            Clear operational context for every security archetype. Evaluate your device surface and threat model without forced upgrades or sales manipulation.
          </p>
        </div>
      </div>

      {/* 4 Neutral Decision Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/15">
        {AGEIS_ROBOT_PLANS.map((plan) => {
          const isSelected = plan.id === selectedPlan
          const Glyph = glyphMap[plan.id]

          return (
            <div
              key={plan.id}
              onClick={() => onSelectPlan(plan.id)}
              className={cn(
                "p-6 sm:p-7 bg-[#050505] flex flex-col justify-between space-y-6 transition-all cursor-pointer",
                isSelected
                  ? "bg-[#0A0A0A] ring-1 ring-[#39FF14]/40"
                  : "hover:bg-[#080808]"
              )}
            >
              <div className="space-y-4">
                {/* Unit Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Glyph size={20} color={isSelected ? "#39FF14" : "#A6A6A0"} />
                    <span
                      className={cn(
                        "text-xs font-bold uppercase tracking-wider",
                        isSelected ? "text-[#39FF14]" : "text-[#F1F0EB]"
                      )}
                    >
                      {plan.robotName}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#A6A6A0]">UNIT {plan.index}</span>
                </div>

                {/* Direct User Quote */}
                <div className="py-2">
                  <p className="text-base font-serif italic text-[#F1F0EB] leading-relaxed">
                    &ldquo;{plan.decisionScenario}&rdquo;
                  </p>
                </div>

                {/* Practical Assessment */}
                <div className="space-y-2 text-xs border-t border-white/10 pt-3">
                  <span className="text-[9px] text-[#6F706D] font-mono uppercase tracking-wider block font-bold">
                    OPERATIONAL PROFILE:
                  </span>
                  <p className="text-[11px] text-[#A6A6A0] font-sans leading-relaxed">
                    {plan.dossier.deploymentTarget}
                  </p>
                </div>

                {/* Coverage & Price quick recap */}
                <div className="text-[10px] text-[#A6A6A0] flex items-center justify-between pt-2 border-t border-white/5">
                  <span>{plan.devicesLabel}</span>
                  <span className="font-bold text-[#F1F0EB]">{plan.priceFormatted}</span>
                </div>
              </div>

              {/* Commission Button Link */}
              <div className="pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelectPlan(plan.id)
                    const el = document.getElementById(`plan-${plan.id}`)
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" })
                  }}
                  className={cn(
                    "w-full text-xs font-mono uppercase tracking-wider py-2.5 px-3 flex items-center justify-between transition-colors",
                    isSelected
                      ? "bg-[#39FF14] text-[#050505] font-bold"
                      : "bg-white/5 hover:bg-white/10 text-[#F1F0EB]"
                  )}
                >
                  <span>FOCUS UNIT {plan.index}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
