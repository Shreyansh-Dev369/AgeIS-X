import React from "react"
import { ShieldCheck, ShieldAlert, Activity } from "lucide-react"
import { SecurityState } from "@/types/security"
import { SECURITY_STATES } from "@/lib/design-tokens"
import { cn } from "@/lib/utils"

interface ProtectionStatusProps {
  state: SecurityState
  shieldCount?: number
  lastUpdated?: string
  className?: string
}

export function ProtectionStatus({
  state,
  shieldCount = 8,
  lastUpdated = "Real-time",
  className = "",
}: ProtectionStatusProps) {
  const config = SECURITY_STATES[state] || SECURITY_STATES.UNKNOWN

  return (
    <div
      className={cn(
        "flex items-center justify-between p-3.5 rounded-lg border bg-slate-900/80 border-slate-800",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "p-2 rounded-md flex items-center justify-center border",
            config.bgClass,
            config.borderClass,
            config.textClass
          )}
        >
          {state === "PROTECTED" || state === "PROTECTION ACTIVE" ? (
            <ShieldCheck className="w-5 h-5 stroke-[1.75]" />
          ) : state === "MONITORING" ? (
            <Activity className="w-5 h-5 stroke-[1.75]" />
          ) : (
            <ShieldAlert className="w-5 h-5 stroke-[1.75]" />
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-100">
              AgeIS-X Kernel Protection
            </span>
            <span
              className={cn(
                "text-[11px] font-mono px-1.5 py-0.5 rounded border",
                config.bgClass,
                config.borderClass,
                config.textClass
              )}
            >
              {config.label}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {shieldCount} active shield layers • Telemetry: {lastUpdated}
          </p>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span className="text-xs font-mono text-emerald-400">ONLINE</span>
      </div>
    </div>
  )
}
