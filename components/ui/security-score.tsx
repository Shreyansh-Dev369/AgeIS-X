"use client"

import * as React from "react"
import { ArrowUpRight, ArrowDownRight, ShieldCheck, ShieldAlert, AlertTriangle } from "lucide-react"
import { SecurityScoreData, SecurityState } from "@/types/security"
import { StatusBadge } from "@/components/ui/status-badge"
import { cn } from "@/lib/utils"

export interface SecurityScoreProps {
  data: SecurityScoreData
  variant?: "hero" | "compact" | "detailed"
  className?: string
}

export function SecurityScore({
  data,
  variant = "detailed",
  className = "",
}: SecurityScoreProps) {
  const { score, maxScore = 100, status, trend, breakdown, recommendation, lastEvaluated } = data
  const percentage = Math.min(100, Math.max(0, Math.round((score / maxScore) * 100)))

  // Determine health color based on score thresholds
  const getScoreColor = (value: number) => {
    if (value >= 90) return { stroke: "#10b981", text: "text-emerald-400", bg: "bg-emerald-500/10" }
    if (value >= 70) return { stroke: "#0ea5e9", text: "text-sky-400", bg: "bg-sky-500/10" }
    if (value >= 50) return { stroke: "#f59e0b", text: "text-amber-400", bg: "bg-amber-500/10" }
    return { stroke: "#ef4444", text: "text-rose-400", bg: "bg-rose-500/10" }
  }

  const scoreTheme = getScoreColor(percentage)
  const radius = 42
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  if (variant === "compact") {
    return (
      <div className={cn("flex items-center gap-3 p-3 rounded-lg border border-slate-800 bg-slate-900/60", className)}>
        <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
          <svg className="w-12 h-12 -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="10"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke={scoreTheme.stroke}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <span className="absolute text-xs font-mono font-bold text-slate-100">{percentage}</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-100">Security Score</span>
            <StatusBadge state={status} size="sm" showIcon={false} />
          </div>
          <p className="text-xs text-slate-400">
            {trend.delta >= 0 ? `+${trend.delta}` : trend.delta} pts {trend.period}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("rounded-xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6", className)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Posture Telemetry</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">Live</span>
          </div>
          <h3 className="text-base font-semibold text-slate-100 mt-0.5">Overall Security Posture</h3>
        </div>
        <StatusBadge state={status} size="lg" pulseDot={status === "PROTECTED"} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center py-6">
        {/* Circular Gauge */}
        <div className="md:col-span-4 flex flex-col items-center justify-center text-center">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-36 h-36 -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke={scoreTheme.stroke}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-bold font-mono text-slate-100 tracking-tight">
                {score}
              </span>
              <span className="text-[11px] text-slate-500 font-mono">/ {maxScore}</span>
            </div>
          </div>

          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            {trend.direction === "up" ? (
              <span className="flex items-center text-emerald-400 font-medium">
                <ArrowUpRight className="w-3.5 h-3.5" />+{trend.delta}
              </span>
            ) : trend.direction === "down" ? (
              <span className="flex items-center text-rose-400 font-medium">
                <ArrowDownRight className="w-3.5 h-3.5" />-{trend.delta}
              </span>
            ) : (
              <span className="text-slate-400">0</span>
            )}
            <span>from {trend.period}</span>
          </div>
        </div>

        {/* Breakdown by Category */}
        <div className="md:col-span-8 space-y-3">
          {breakdown && breakdown.length > 0 ? (
            <div className="space-y-2.5">
              {breakdown.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">{item.category}</span>
                    <div className="flex items-center gap-2">
                      {item.issuesCount > 0 && (
                        <span className="text-[11px] text-amber-400">
                          {item.issuesCount} advisory
                        </span>
                      )}
                      <span className="font-mono text-slate-200 font-semibold">{item.score}%</span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        item.score >= 90
                          ? "bg-emerald-500"
                          : item.score >= 70
                          ? "bg-sky-500"
                          : item.score >= 50
                          ? "bg-amber-500"
                          : "bg-rose-500"
                      )}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400">No category breakdown available.</p>
          )}
        </div>
      </div>

      {/* Recommendation and Evaluation Footer */}
      {(recommendation || lastEvaluated) && (
        <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          {recommendation && (
            <p className="text-slate-400">
              <span className="text-slate-300 font-medium">Recommendation:</span> {recommendation}
            </p>
          )}
          {lastEvaluated && (
            <span className="text-[11px] text-slate-500 font-mono shrink-0">
              Evaluated: {lastEvaluated}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
