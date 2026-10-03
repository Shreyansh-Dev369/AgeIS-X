import React from "react"
import { ActivityFeedItem } from "@/types/security"
import { CategoryIcon } from "@/components/design-system/icons"
import { ThreatSeverity } from "@/components/ui/threat-severity"
import { StatusBadge } from "@/components/ui/status-badge"
import { cn } from "@/lib/utils"

export interface ActivityItemProps {
  item: ActivityFeedItem
  className?: string
  showAction?: boolean
}

export function ActivityItem({
  item,
  className = "",
  showAction = true,
}: ActivityItemProps) {
  const { timestamp, title, description, category, severity, status, entity, actionTaken } = item

  return (
    <div
      className={cn(
        "flex items-start gap-3.5 p-3.5 rounded-lg border border-slate-800/80 bg-slate-900/40 hover:bg-slate-900/80 hover:border-slate-700 transition-all",
        className
      )}
    >
      <div className="p-2 rounded-md bg-slate-950 border border-slate-800 text-slate-300 shrink-0 mt-0.5">
        <CategoryIcon category={category} className="w-4 h-4" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-semibold text-slate-100">{title}</h4>
            {entity && (
              <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                {entity}
              </span>
            )}
          </div>
          <span className="text-[11px] font-mono text-slate-500 shrink-0">{timestamp}</span>
        </div>

        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{description}</p>

        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <ThreatSeverity severity={severity} />
          <StatusBadge state={status} size="sm" showIcon={false} />
          {actionTaken && showAction && (
            <span className="text-[11px] text-slate-400 font-mono">
              Action: <span className="text-slate-200">{actionTaken}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
