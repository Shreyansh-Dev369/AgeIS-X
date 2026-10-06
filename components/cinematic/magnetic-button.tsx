"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface MagneticButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  strength?: number // Maximum displacement in pixels (default 4px)
  radius?: number // Proximity radius in pixels to activate magnetic attraction (default 70px)
  damping?: number // Interpolation easing speed (default 0.12)
  className?: string
  disabled?: boolean
}

/**
 * Magnetic Button Engine (Desktop Pointer Enhancement).
 * Calculates pointer distance to button center, applies damped sub-pixel translation
 * via CSS custom properties outside the React render lifecycle.
 * Fully disables on touch devices and respects prefers-reduced-motion.
 */
export function MagneticButton({
  children,
  strength = 4.5,
  radius = 65,
  damping = 0.12,
  className,
  disabled = false,
  ...props
}: MagneticButtonProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const targetOffsetRef = React.useRef({ x: 0, y: 0 })
  const currentOffsetRef = React.useRef({ x: 0, y: 0 })
  const rafId = React.useRef<number | null>(null)
  const isReducedMotionRef = React.useRef(false)
  const isTouchRef = React.useRef(false)

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
      if (rafId.current !== null) cancelAnimationFrame(rafId.current)
    }
  }, [])

  const updatePositionLoop = React.useCallback(() => {
    if (!containerRef.current) return

    const cur = currentOffsetRef.current
    const target = targetOffsetRef.current

    cur.x += (target.x - cur.x) * damping
    cur.y += (target.y - cur.y) * damping

    containerRef.current.style.setProperty("--mag-x", `${cur.x.toFixed(2)}px`)
    containerRef.current.style.setProperty("--mag-y", `${cur.y.toFixed(2)}px`)

    if (Math.abs(target.x - cur.x) > 0.05 || Math.abs(target.y - cur.y) > 0.05) {
      rafId.current = requestAnimationFrame(updatePositionLoop)
    } else {
      rafId.current = null
    }
  }, [damping])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || isReducedMotionRef.current || isTouchRef.current) return
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const distX = e.clientX - centerX
    const distY = e.clientY - centerY
    const distance = Math.hypot(distX, distY)

    if (distance < radius) {
      const pullFactor = (1 - distance / radius) * strength
      const normX = distX / (distance || 1)
      const normY = distY / (distance || 1)

      targetOffsetRef.current = {
        x: normX * pullFactor,
        y: normY * pullFactor,
      }
    } else {
      targetOffsetRef.current = { x: 0, y: 0 }
    }

    if (rafId.current === null) {
      rafId.current = requestAnimationFrame(updatePositionLoop)
    }
  }

  const handleMouseLeave = () => {
    targetOffsetRef.current = { x: 0, y: 0 }
    if (rafId.current === null) {
      rafId.current = requestAnimationFrame(updatePositionLoop)
    }
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("inline-block", className)}
      style={
        {
          "--mag-x": "0px",
          "--mag-y": "0px",
          transform: "translate3d(var(--mag-x, 0px), var(--mag-y, 0px), 0)",
          willChange: "transform",
        } as React.CSSProperties
      }
      {...props}
    >
      {children}
    </div>
  )
}
