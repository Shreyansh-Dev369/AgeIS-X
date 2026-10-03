import React from "react"
import { ActivityFeedItem } from "@/types/security"
import { ActivityItem } from "@/components/ui/activity-item"
import { EmptyState } from "@/components/ui/empty-state"
import { Activity } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ActivityFeedProps {
  items: ActivityFeedItem[]
  title?: string
  emptyMessage?: string
  maxItems?: number
  className?: string
}

export function ActivityFeed({
  items,
  title,
  emptyMessage = "No security events recorded in the current session.",
  maxItems,
  className = "",
}: ActivityFeedProps) {
  const displayItems = maxItems ? items.slice(0, maxItems) : items

  return (
    <div className={cn("space-y-3", className)}>
      {title && (
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {title}
          </h3>
          <span className="text-[11px] font-mono text-slate-500">
            {items.length} events
          </span>
        </div>
      )}

      {displayItems.length > 0 ? (
        <div className="space-y-2.5">
          {displayItems.map((item) => (
            <ActivityItem key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Activity}
          title="No Recent Activity"
          description={emptyMessage}
        />
      )}
    </div>
  )
}
