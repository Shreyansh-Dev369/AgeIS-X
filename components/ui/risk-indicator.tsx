import React from "react"
import { cn } from "@/lib/utils"

interface RiskIndicatorProps {
  score: number // 0 to 100
  label?: string
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
  className?: string
}

export function RiskIndicator({
  score,
  label,
  size = "md",
  showLabel = true,
  className = "",
}: RiskIndicatorProps) {
  const normalizedScore = Math.min(100, Math.max(0, score))

  const getRiskDetails = (value: number) => {
    if (value < 25) {
      return {
        text: "Low Risk",
        colorClass: "text-emerald-400",
        bgClass: "bg-emerald-500",
        badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      }
    }
    if (value < 60) {
      return {
        text: "Moderate Risk",
        colorClass: "text-amber-400",
        bgClass: "bg-amber-500",
        badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      }
    }
    if (value < 85) {
      return {
        text: "High Risk",
        colorClass: "text-orange-400",
        bgClass: "bg-orange-500",
        badgeClass: "bg-orange-500/10 text-orange-400 border-orange-500/30",
      }
    }
    return {
      text: "Critical Threat",
      colorClass: "text-rose-400",
      bgClass: "bg-rose-500",
      badgeClass: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    }
  }

  const details = getRiskDetails(normalizedScore)

  return (
    <div className={cn("space-y-1.5", className)}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">{label || "Risk Score"}</span>
          <span
            className={cn(
              "font-mono font-semibold px-1.5 py-0.5 rounded text-[11px] border",
              details.badgeClass
            )}
          >
            {normalizedScore}/100 • {details.text}
          </span>
        </div>
      )}
      <div
        className={cn(
          "w-full rounded-full bg-slate-950/80 border border-slate-800/80 overflow-hidden",
          size === "sm" ? "h-1.5" : size === "lg" ? "h-3" : "h-2"
        )}
      >
        <div
          className={cn("h-full rounded-full transition-all duration-500", details.bgClass)}
          style={{ width: `${normalizedScore}%` }}
        />
      </div>
    </div>
  )
}
