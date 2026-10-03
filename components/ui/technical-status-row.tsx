import * as React from "react"
import { cn } from "@/lib/utils"

export interface TechnicalStatusRowProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode
  value: React.ReactNode
  status?: "protected" | "monitoring" | "warning" | "danger" | "muted" | "default"
  valueClassName?: string
}

export function TechnicalStatusRow({
  label,
  value,
  status = "default",
  className,
  valueClassName,
  ...props
}: TechnicalStatusRowProps) {
  const statusColors = {
    protected: "text-[#00ff66]",
    monitoring: "text-[#00f0ff]",
    warning: "text-[#ffb800]",
    danger: "text-[#ff3b30]",
    muted: "text-[#7e8b9b]",
    default: "text-[#f8fafc]",
  }

  return (
    <div
      className={cn(
        "dotted-leader font-mono text-xs text-[#7e8b9b] uppercase tracking-wider py-0.5",
        className
      )}
      {...props}
    >
      <span className="shrink-0 font-medium text-[#7e8b9b]">{label}</span>
      <span className="dotted-leader-fill" aria-hidden="true" />
      <span
        className={cn(
          "shrink-0 font-semibold tracking-wide",
          statusColors[status],
          valueClassName
        )}
      >
        {value}
      </span>
    </div>
  )
}
