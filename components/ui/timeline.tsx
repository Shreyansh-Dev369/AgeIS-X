import React from "react"
import { cn } from "@/lib/utils"

export interface TimelineItem {
  id: string
  time: string
  title: string
  description?: string
  status?: "success" | "warning" | "danger" | "neutral"
  icon?: React.ReactNode
}

export interface TimelineProps {
  items: TimelineItem[]
  className?: string
}

export function Timeline({ items, className = "" }: TimelineProps) {
  const getStatusColor = (status: TimelineItem["status"]) => {
    switch (status) {
      case "success":
        return "bg-emerald-500 border-emerald-400/40 text-emerald-400"
      case "warning":
        return "bg-amber-500 border-amber-400/40 text-amber-400"
      case "danger":
        return "bg-rose-500 border-rose-400/40 text-rose-400"
      default:
        return "bg-slate-700 border-slate-600 text-slate-400"
    }
  }

  return (
    <div className={cn("relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-slate-800", className)}>
      {items.map((item) => (
        <div key={item.id} className="relative group">
          {/* Timeline Dot */}
          <div
            className={cn(
              "absolute -left-6 top-1 w-4 h-4 rounded-full border-2 bg-slate-950 flex items-center justify-center shrink-0 shadow-sm",
              getStatusColor(item.status)
            )}
          >
            <div className={cn("w-1.5 h-1.5 rounded-full", item.status === "danger" ? "bg-rose-400" : item.status === "warning" ? "bg-amber-400" : item.status === "success" ? "bg-emerald-400" : "bg-slate-400")} />
          </div>

          <div className="flex items-center justify-between gap-2">
            <h4 className="text-xs font-semibold text-slate-200">{item.title}</h4>
            <span className="text-[11px] font-mono text-slate-500">{item.time}</span>
          </div>

          {item.description && (
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {item.description}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
