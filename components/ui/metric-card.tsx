import * as React from "react"
import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { cn } from "@/lib/utils"

export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  value: string | number
  delta?: string
  trend?: "up" | "down" | "neutral"
  positiveTrendIsGood?: boolean
  caption?: string
  icon?: LucideIcon
  badge?: string
}

export function MetricCard({
  label,
  value,
  delta,
  trend,
  positiveTrendIsGood = true,
  caption,
  icon: Icon,
  badge,
  className,
  ...props
}: MetricCardProps) {
  const isUp = trend === "up"
  const isDown = trend === "down"
  const isPositiveDelta = (isUp && positiveTrendIsGood) || (isDown && !positiveTrendIsGood)

  return (
    <div
      className={cn(
        "rounded-xl border border-slate-800 bg-slate-900/60 p-5 hover:border-slate-700/80 transition-colors flex flex-col justify-between",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-medium text-slate-400 truncate">{label}</span>
        <div className="flex items-center gap-2">
          {badge && (
            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
              {badge}
            </span>
          )}
          {Icon && (
            <div className="p-1.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
              <Icon className="w-3.5 h-3.5 stroke-[1.75]" />
            </div>
          )}
        </div>
      </div>

      <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-100 tracking-tight">
        {value}
      </div>

      {(delta || caption) && (
        <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-xs">
          {delta && (
            <div className="flex items-center gap-1 font-mono">
              <span
                className={cn(
                  "inline-flex items-center font-medium",
                  trend === "neutral"
                    ? "text-slate-400"
                    : isPositiveDelta
                    ? "text-emerald-400"
                    : "text-rose-400"
                )}
              >
                {isUp ? <ArrowUpRight className="w-3 h-3" /> : isDown ? <ArrowDownRight className="w-3 h-3" /> : null}
                {delta}
              </span>
            </div>
          )}
          {caption && <span className="text-slate-500 text-[11px] truncate">{caption}</span>}
        </div>
      )}
    </div>
  )
}
