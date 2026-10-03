import React from "react"
import { SecurityState } from "@/types/security"
import { SECURITY_STATES } from "@/lib/design-tokens"
import { SecurityStateIcon } from "@/components/design-system/icons"
import { cn } from "@/lib/utils"

interface SecurityStatusProps {
  state: SecurityState
  subtext?: string
  size?: "sm" | "md" | "lg"
  className?: string
  showBadgeOnly?: boolean
}

export function SecurityStatus({
  state,
  subtext,
  size = "md",
  className = "",
  showBadgeOnly = false,
}: SecurityStatusProps) {
  const config = SECURITY_STATES[state] || SECURITY_STATES.UNKNOWN

  if (showBadgeOnly) {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border",
          config.bgClass,
          config.borderClass,
          config.textClass,
          className
        )}
        role="status"
        aria-label={config.label}
      >
        <SecurityStateIcon state={state} className="w-3.5 h-3.5 shrink-0" />
        <span>{config.label}</span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg border",
        config.bgClass,
        config.borderClass,
        className
      )}
      role="status"
      aria-label={`Security status: ${config.label}`}
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-md p-2 bg-slate-950/60 border",
          config.borderClass,
          config.textClass
        )}
      >
        <SecurityStateIcon
          state={state}
          className={size === "lg" ? "w-6 h-6" : "w-5 h-5"}
        />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className={cn("font-semibold text-sm", config.textClass)}>
            {config.label}
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          {subtext || config.accessibleDescription}
        </p>
      </div>
    </div>
  )
}
