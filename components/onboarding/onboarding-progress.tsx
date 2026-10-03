"use client"

import React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface OnboardingProgressProps {
  currentStep: number
  totalSteps?: number
  stepTitles: string[]
  onStepClick?: (step: number) => void
  completedSteps?: number[]
}

export function OnboardingProgress({
  currentStep,
  totalSteps = 8,
  stepTitles,
  onStepClick,
  completedSteps = [],
}: OnboardingProgressProps) {
  const progressPercent = Math.round(((currentStep - 1) / (totalSteps - 1)) * 100)
  const filledBlocks = Math.round(((currentStep - 1) / (totalSteps - 1)) * 16)
  const emptyBlocks = 16 - filledBlocks

  return (
    <div className="w-full space-y-4 font-mono select-none">
      {/* Top Header & Percentage Display */}
      <div className="flex flex-wrap items-center justify-between text-xs gap-2 pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-[#00ff66] font-bold">
            STEP [{String(currentStep).padStart(2, "0")} / {String(totalSteps).padStart(2, "0")}]
          </span>
          <span className="text-white/20">::</span>
          <span className="text-[#f8fafc] font-semibold uppercase tracking-wider">
            {stepTitles[currentStep - 1] || "SYSTEM INITIALIZATION"}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <span className="text-white/30 font-bold">[</span>
            <span className="text-[#00ff66] font-mono font-black tracking-widest text-[11px]">
              {"■".repeat(filledBlocks)}
            </span>
            <span className="text-white/15 font-mono tracking-widest text-[11px]">
              {"□".repeat(emptyBlocks)}
            </span>
            <span className="text-white/30 font-bold">]</span>
          </div>
          <span className="text-[#00f0ff] font-bold text-xs">{progressPercent}%</span>
        </div>
      </div>

      {/* Discrete Step Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 pt-1">
        {stepTitles.map((title, idx) => {
          const stepNum = idx + 1
          const isCurrent = stepNum === currentStep
          const isCompleted = completedSteps.includes(stepNum) || stepNum < currentStep

          return (
            <button
              key={idx}
              type="button"
              disabled={!onStepClick || stepNum > currentStep}
              onClick={() => onStepClick?.(stepNum)}
              className={cn(
                "p-2 border text-left transition-all flex flex-col justify-between group",
                isCurrent
                  ? "bg-[#0b1017] border-[#00ff66] text-[#00ff66] shadow-[0_0_10px_rgba(0,255,102,0.2)]"
                  : isCompleted
                  ? "bg-[#080c10] border-white/20 text-[#f8fafc] hover:border-[#00ff66]/50 cursor-pointer"
                  : "bg-[#040608] border-white/5 text-[#7e8b9b]/40 cursor-not-allowed"
              )}
            >
              <div className="flex items-center justify-between text-[10px] mb-1">
                <span className="font-bold">
                  {isCompleted && !isCurrent ? (
                    <span className="text-[#00ff66]">[✓]</span>
                  ) : isCurrent ? (
                    <span className="text-[#00ff66] font-black">[&gt;]</span>
                  ) : (
                    <span className="text-white/20">[{String(stepNum).padStart(2, "0")}]</span>
                  )}
                </span>
                <span className="text-[9px] text-[#7e8b9b]/60">0{stepNum}</span>
              </div>
              <span
                className={cn(
                  "text-[10px] leading-tight truncate uppercase tracking-tight font-medium",
                  isCurrent
                    ? "text-[#00ff66] font-bold"
                    : isCompleted
                    ? "text-[#f8fafc]"
                    : "text-[#7e8b9b]/40"
                )}
              >
                {title}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
