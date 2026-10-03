import React from "react"
import { ThreatSeverity as ThreatSeverityType } from "@/types/security"
import { SEVERITY_CONFIG } from "@/lib/design-tokens"
import { SeverityIcon } from "@/components/design-system/icons"
import { cn } from "@/lib/utils"

interface ThreatSeverityProps {
  severity: ThreatSeverityType
  showIcon?: boolean
  className?: string
}

export function ThreatSeverity({
  severity,
  showIcon = true,
  className = "",
}: ThreatSeverityProps) {
  const config = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.info

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-medium uppercase border",
        config.borderClass,
        config.textClass,
        severity === "critical" ? "bg-rose-950/40" : severity === "high" ? "bg-orange-950/40" : severity === "medium" ? "bg-amber-950/40" : "bg-slate-900",
        className
      )}
    >
      {showIcon && <SeverityIcon severity={severity} className="w-3 h-3" />}
      <span>{config.label}</span>
    </span>
  )
}
