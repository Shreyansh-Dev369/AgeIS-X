import * as React from "react"
import { cn } from "@/lib/utils"

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  subtitle?: string
  headerAction?: React.ReactNode
}

export function Panel({
  title,
  subtitle,
  headerAction,
  children,
  className,
  ...props
}: PanelProps) {
  return (
    <div
      className={cn(
        "rounded-none border border-white/10 bg-[#080c10] overflow-hidden text-[#f8fafc]",
        className
      )}
      {...props}
    >
      {(title || headerAction) && (
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-[#0b1017]">
          <div>
            {title && <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#f8fafc]">{title}</h3>}
            {subtitle && <p className="text-[11px] text-[#7e8b9b] font-mono mt-0.5">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  )
}
