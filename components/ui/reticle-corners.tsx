import * as React from "react"
import { cn } from "@/lib/utils"

export interface ReticleCornersProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
  color?: "phosphor" | "muted" | "cyan" | "danger" | "warning"
  inset?: boolean
}

export function ReticleCorners({
  className,
  size = "md",
  color = "phosphor",
  inset = false,
  ...props
}: ReticleCornersProps) {
  const sizeMap = {
    sm: "w-1.5 h-1.5",
    md: "w-2.5 h-2.5",
    lg: "w-3.5 h-3.5",
  }

  const borderThickness = {
    sm: "border",
    md: "border",
    lg: "border-[1.5px]",
  }

  const colorMap = {
    phosphor: "border-[#00ff66]/60",
    muted: "border-white/20",
    cyan: "border-[#00f0ff]/60",
    danger: "border-[#ff3b30]/60",
    warning: "border-[#ffb800]/60",
  }

  const offsetClass = inset ? "m-1" : "-m-px"

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 select-none", className)}
      {...props}
    >
      {/* Top-Left Reticle */}
      <span
        className={cn(
          "absolute top-0 left-0 border-t border-l",
          sizeMap[size],
          borderThickness[size],
          colorMap[color],
          offsetClass
        )}
      />
      {/* Top-Right Reticle */}
      <span
        className={cn(
          "absolute top-0 right-0 border-t border-r",
          sizeMap[size],
          borderThickness[size],
          colorMap[color],
          offsetClass
        )}
      />
      {/* Bottom-Left Reticle */}
      <span
        className={cn(
          "absolute bottom-0 left-0 border-b border-l",
          sizeMap[size],
          borderThickness[size],
          colorMap[color],
          offsetClass
        )}
      />
      {/* Bottom-Right Reticle */}
      <span
        className={cn(
          "absolute bottom-0 right-0 border-b border-r",
          sizeMap[size],
          borderThickness[size],
          colorMap[color],
          offsetClass
        )}
      />
    </div>
  )
}
