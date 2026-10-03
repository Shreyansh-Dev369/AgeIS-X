import React from "react"
import { ArrowUpRight, ArrowDownRight, Minus, LucideIcon } from "lucide-react"
import { SecurityState } from "@/types/security"
import { StatusBadge } from "@/components/ui/status-badge"
import { cn } from "@/lib/utils"

export interface SecurityMetricProps {
  label: string
  value: string | number
  change?: string
  trend?: "up" | "down" | "neutral"
  trendPositive?: boolean // If trend "up" is good or bad (e.g., threats blocked up is good, incidents up is bad)
  icon?: LucideIcon
  status?: SecurityState
  description?: string
  timeframe?: string
  className?: string
}

export function SecurityMetric({
  label,
  value,
  change,
  trend,
  trendPositive = true,
  icon: Icon,
  status,
  description,
  timeframe = "vs last 24h",
  className = "",
}: SecurityMetricProps) {
  const getTrendColor = () => {
    if (!trend || trend === "neutral") return "text-slate-400"
    if (trend === "up") {
      return trendPositive ? "text-emerald-400" : "text-rose-400"
    }
    return trendPositive ? "text-rose-400" : "text-emerald-400"
  }

  return (
    <div
      className={cn(
        "p-5 rounded-lg border border-slate-800 bg-slate-900/60 hover:border-slate-700/80 transition-all",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-medium text-slate-400 truncate">{label}</span>
        {Icon && (
          <div className="p-1.5 rounded-md bg-slate-950 border border-slate-800 text-slate-400">
            <Icon className="w-4 h-4" strokeWidth={1.75} />
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-100 tracking-tight">
          {value}
        </div>
        {status && <StatusBadge state={status} size="sm" showIcon={false} />}
      </div>

      {(change || description) && (
        <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
          {change && (
            <div className="flex items-center gap-1">
              <span className={cn("inline-flex items-center font-medium font-mono", getTrendColor())}>
                {trend === "up" ? (
                  <ArrowUpRight className="w-3.5 h-3.5" />
                ) : trend === "down" ? (
                  <ArrowDownRight className="w-3.5 h-3.5" />
                ) : (
                  <Minus className="w-3.5 h-3.5" />
                )}
                {change}
              </span>
              <span className="text-slate-500">{timeframe}</span>
            </div>
          )}
          {description && !change && (
            <span className="text-slate-400">{description}</span>
          )}
        </div>
      )}
    </div>
  )
}
