import React from "react"
import { ShieldCheck, LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon?: LucideIcon
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function EmptyState({
  icon: Icon = ShieldCheck,
  title = "No security threats detected",
  description = "All perimeter defenses and endpoint shields are functioning normally.",
  actionLabel,
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center rounded-lg border border-slate-800/80 bg-slate-950/40",
        className
      )}
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 mb-3.5 shadow-sm">
        <Icon className="w-6 h-6 stroke-[1.75] text-emerald-400" />
      </div>
      <h4 className="text-sm font-semibold text-slate-200">{title}</h4>
      <p className="text-xs text-slate-400 mt-1 max-w-sm leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button
          variant="outline"
          size="sm"
          onClick={onAction}
          className="mt-4"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
