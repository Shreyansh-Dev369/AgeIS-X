import * as React from "react"
import { cn } from "@/lib/utils"
import { ReticleCorners } from "./reticle-corners"

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
    default: "bg-[#040608] border border-white/10",
    panel: "bg-[#080c10] border border-white/10",
    elevated: "bg-[#0b1017] border border-[#00ff66]/20",
    stepped: "bg-[#080c10] border border-white/15 stepped-frame",
    highlight: "bg-[#0b1017] border border-[#00ff66]/40 phosphor-box-glow",
  }

  return (
    <div
      className={cn(
        "relative transition-all duration-150 text-[#f8fafc]",
        variantStyles[variant],
        glow && "phosphor-box-glow",
        className
      )}
      {...props}
    >
      {reticles && <ReticleCorners color={reticleColor} />}
      {children}
    </div>
  )
}
