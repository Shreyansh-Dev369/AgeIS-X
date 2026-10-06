"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface PointerDepthCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  depthLevel?: "subtle" | "medium" | "deep"
  glowColor?: "green" | "cyan" | "white" | "none"
  bordered?: boolean
  className?: string
  enableTilt?: boolean
}

/**
 * High-precision tactile card with localized cursor tracking.
 * Updates local rotation, depth translation, and spotlight sheen via CSS variables
 * outside React rendering.
 */
export function PointerDepthCard({
  children,
  depthLevel = "medium",
  glowColor = "none",
  bordered = true,
  enableTilt = true,
  className,
  ...props
}: PointerDepthCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null)
  const isReducedMotionRef = React.useRef(false)
  const isTouchRef = React.useRef(false)
  const [isHovered, setIsHovered] = React.useState(false)

  React.useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    isReducedMotionRef.current = motionQuery.matches

    const handleMotionChange = (e: MediaQueryListEvent) => {
      isReducedMotionRef.current = e.matches
    }
    motionQuery.addEventListener("change", handleMotionChange)

    isTouchRef.current =
      "ontouchstart" in window || navigator.maxTouchPoints > 0 || window.innerWidth < 1024

    return () => {
      motionQuery.removeEventListener("change", handleMotionChange)
    }
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isReducedMotionRef.current || isTouchRef.current || !cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const normX = (x / rect.width) * 2 - 1
    const normY = (y / rect.height) * 2 - 1

    const maxTilt = depthLevel === "subtle" ? 1.5 : depthLevel === "medium" ? 3.0 : 4.5
    const rotX = -normY * maxTilt
    const rotY = normX * maxTilt

    const el = cardRef.current
    el.style.setProperty("--card-px", `${x}px`)
    el.style.setProperty("--card-py", `${y}px`)
    el.style.setProperty("--card-rot-x", enableTilt ? `${rotX.toFixed(2)}deg` : "0deg")
    el.style.setProperty("--card-rot-y", enableTilt ? `${rotY.toFixed(2)}deg` : "0deg")
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    if (!cardRef.current) return
    const el = cardRef.current
    el.style.setProperty("--card-rot-x", "0deg")
    el.style.setProperty("--card-rot-y", "0deg")
  }

  const glowStyles = {
    none: "",
    green: "hover:shadow-[0_0_30px_rgba(57,255,20,0.14)] hover:border-[#39FF14]/40",
    cyan: "hover:shadow-[0_0_30px_rgba(0,229,255,0.14)] hover:border-[#00E5FF]/40",
    white: "hover:shadow-[0_0_30px_rgba(255,255,255,0.10)] hover:border-white/30",
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative bg-[#070707] p-6 sm:p-7 font-mono select-none transition-[border-color,box-shadow] duration-300",
        bordered && "border border-white/10",
        glowStyles[glowColor],
        className
      )}
      style={
        {
          "--card-rot-x": "0deg",
          "--card-rot-y": "0deg",
          transform: `perspective(800px) rotateX(var(--card-rot-x, 0deg)) rotateY(var(--card-rot-y, 0deg)) ${
            isHovered ? (depthLevel === "subtle" ? "translateY(-2px)" : depthLevel === "medium" ? "translateY(-4px)" : "translateY(-6px)") : "translateY(0)"
          }`,
          transition: "transform 240ms cubic-bezier(0.16, 1, 0.3, 1), border-color 200ms ease, box-shadow 200ms ease",
          willChange: "transform",
        } as React.CSSProperties
      }
      {...props}
    >
      {/* Subtle radial spotlight following pointer */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: "radial-gradient(400px circle at var(--card-px, 50%) var(--card-py, 50%), rgba(255,255,255,0.035), transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Corner crosshairs */}
      <span
        className={cn(
          "absolute top-1.5 left-1.5 text-[8px] transition-opacity duration-300 pointer-events-none select-none",
          isHovered ? "text-[#39FF14] opacity-100" : "text-white/20 opacity-40"
        )}
        aria-hidden="true"
      >
        +
      </span>
      <span
        className={cn(
          "absolute top-1.5 right-1.5 text-[8px] transition-opacity duration-300 pointer-events-none select-none",
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
