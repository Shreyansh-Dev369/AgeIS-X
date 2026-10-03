import React from "react"
import { ThreatCategory, ThreatSeverity } from "@/types/security"
import { CategoryIcon } from "@/components/design-system/icons"
import { ThreatSeverity as ThreatSeverityBadge } from "@/components/ui/threat-severity"
import { cn } from "@/lib/utils"

interface ThreatIndicatorProps {
  category: ThreatCategory
  title: string
  severity: ThreatSeverity
  count?: number
  lastDetected?: string
  className?: string
}

export function ThreatIndicator({
  category,
  title,
  severity,
  count,
  lastDetected,
  className = "",
}: ThreatIndicatorProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-900/60 hover:border-slate-700 transition-colors",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-md bg-slate-950 border border-slate-800 text-slate-300">
          <CategoryIcon category={category} className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-semibold text-slate-200">{title}</h4>
          {lastDetected && (
            <p className="text-[11px] text-slate-500 font-mono mt-0.5">
              Detected {lastDetected}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        {count !== undefined && (
          <span className="text-xs font-mono text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded">
            {count}
          </span>
        )}
        <ThreatSeverityBadge severity={severity} />
      </div>
    </div>
  )
}
