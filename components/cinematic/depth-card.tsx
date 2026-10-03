"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface DepthCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  depthLevel?: "subtle" | "medium" | "deep"
  glowColor?: "green" | "cyan" | "white" | "none"
  bordered?: boolean
  className?: string
}

export function DepthCard({
  children,
  depthLevel = "medium",
  glowColor = "none",
  bordered = true,
  className,
  ...props
}: DepthCardProps) {
  const [isHovered, setIsHovered] = React.useState(false)

  const depthStyles = {
    subtle: "hover:translate-y-[-2px] transition-transform duration-300",
    medium: "hover:translate-y-[-4px] transition-transform duration-400",
    deep: "hover:translate-y-[-6px] transition-transform duration-500",
  }

  const glowStyles = {
    none: "",
    green: "hover:shadow-[0_0_25px_rgba(57,255,20,0.12)] hover:border-[#39FF14]/40",
    cyan: "hover:shadow-[0_0_25px_rgba(0,229,255,0.12)] hover:border-[#00E5FF]/40",
    white: "hover:shadow-[0_0_25px_rgba(255,255,255,0.08)] hover:border-white/30",
  }

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative bg-[#070707] p-6 sm:p-7 font-mono select-none ease-out",
        bordered && "border border-white/10",
        depthStyles[depthLevel],
        glowStyles[glowColor],
        className
      )}
      {...props}
    >
      {/* Corner crosshairs on hover */}
      <span
        className={cn(
          "absolute top-1 left-1 text-[8px] transition-opacity duration-300",
          isHovered ? "text-[#39FF14] opacity-100" : "text-white/20 opacity-40"
        )}
        aria-hidden="true"
      >
        +
      </span>
      <span
        className={cn(
          "absolute top-1 right-1 text-[8px] transition-opacity duration-300",
          isHovered ? "text-[#39FF14] opacity-100" : "text-white/20 opacity-40"
        )}
        aria-hidden="true"
      >
        +
      </span>

      {children}
    </div>
  )
}
