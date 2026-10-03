import * as React from "react"
import { cn } from "@/lib/utils"
import { ReticleCorners } from "./reticle-corners"

export interface TerminalBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  badge?: string
  status?: "protected" | "monitoring" | "warning" | "danger" | "idle"
  reticles?: boolean
  scanline?: boolean
  headerRight?: React.ReactNode
  footer?: React.ReactNode
}

export function TerminalBox({
  title,
  badge,
  status = "idle",
  reticles = true,
  scanline = false,
  headerRight,
  footer,
  className,
  children,
  ...props
}: TerminalBoxProps) {
  const statusGlow = {
    protected: "border-[#00ff66]/30",
    monitoring: "border-[#00f0ff]/30",
    warning: "border-[#ffb800]/30",
    danger: "border-[#ff3b30]/30",
    idle: "border-white/10",
  }

  const statusDot = {
    protected: "bg-[#00ff66]",
    monitoring: "bg-[#00f0ff]",
    warning: "bg-[#ffb800]",
    danger: "bg-[#ff3b30]",
    idle: "bg-[#7e8b9b]",
  }

  return (
    <div
      className={cn(
        "relative bg-[#080c10] border text-[#f8fafc] flex flex-col",
        statusGlow[status],
        scanline && "crt-scanline",
        className
      )}
      {...props}
    >
      {reticles && (
        <ReticleCorners
          color={
            status === "protected"
              ? "phosphor"
              : status === "monitoring"
              ? "cyan"
              : status === "warning"
              ? "warning"
              : status === "danger"
              ? "danger"
              : "muted"
          }
        />
      )}

      {/* Terminal Box Header */}
      {(title || badge || headerRight) && (
        <div className="flex items-center justify-between border-b border-white/10 px-3.5 py-2 text-xs font-mono bg-[#0b1017]/80">
          <div className="flex items-center gap-2">
            {status !== "idle" && (
              <span
                className={cn("w-2 h-2 shrink-0 rounded-none", statusDot[status])}
                aria-hidden="true"
              />
            )}
            {title && (
              <span className="font-bold tracking-wider uppercase text-white/90">
                {title}
              </span>
            )}
            {badge && (
              <span className="text-[10px] text-[#7e8b9b] border border-white/10 px-1 py-0.5 uppercase tracking-tight">
                {badge}
              </span>
            )}
          </div>
          {headerRight && (
            <div className="text-[11px] text-[#7e8b9b] flex items-center gap-2">
              {headerRight}
            </div>
          )}
        </div>
      )}

      {/* Terminal Box Body */}
      <div className="p-4 flex-1">{children}</div>

      {/* Terminal Box Footer */}
      {footer && (
        <div className="border-t border-white/10 px-3.5 py-1.5 text-xs font-mono text-[#7e8b9b] bg-[#040608]/90">
          {footer}
        </div>
      )}
    </div>
  )
}
