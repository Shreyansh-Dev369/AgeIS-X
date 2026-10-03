import * as React from "react"
import { cn } from "@/lib/utils"

export interface TacticalFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "panel" | "elevated" | "stepped" | "highlight"
  reticles?: boolean
  reticleColor?: "phosphor" | "muted" | "cyan" | "danger" | "warning"
  glow?: boolean
}

export function TacticalFrame({
  className,
  variant = "default",
  reticles = false,
  reticleColor = "phosphor",
  glow = false,
  children,
  ...props
}: TacticalFrameProps) {
  const variantStyles = {
    default: "bg-[#080d16] border border-white/10 rounded-lg",
    panel: "bg-[#080d16] border border-white/10 rounded-lg",
    elevated: "bg-[#0c1320] border border-white/15 rounded-lg shadow-lg",
    stepped: "bg-[#080d16] border border-white/10 rounded-lg",
    highlight: "bg-[#0c1320] border border-emerald-500/30 rounded-lg shadow-md",
  }

  return (
    <div
      className={cn(
        "relative transition-all duration-150 text-[#f8fafc]",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
