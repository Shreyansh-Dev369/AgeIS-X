"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface ParallaxContextValue {
  scrollY: number
  pointerX: number
  pointerY: number
  isReducedMotion: boolean
  isTouch: boolean
  isVisible: boolean
}

const ParallaxContext = React.createContext<ParallaxContextValue>({
  scrollY: 0,
  pointerX: 0,
  pointerY: 0,
  isReducedMotion: false,
  isTouch: false,
  isVisible: true,
})

export function useParallax() {
  return React.useContext(ParallaxContext)
}

export interface ParallaxSceneProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  enablePointer?: boolean
  pointerDamping?: number
}

export function ParallaxScene({
  children,
  className,
  enablePointer = true,
  pointerDamping = 0.08,
  ...props
}: ParallaxSceneProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [scrollY, setScrollY] = React.useState(0)
  const [pointer, setPointer] = React.useState({ x: 0, y: 0 })
  const [targetPointer, setTargetPointer] = React.useState({ x: 0, y: 0 })
  const [isReducedMotion, setIsReducedMotion] = React.useState(false)
  const [isTouch, setIsTouch] = React.useState(false)
  const [isVisible, setIsVisible] = React.useState(true)

  // 1. Detect user preferences & device type
  React.useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setIsReducedMotion(motionQuery.matches)

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches)
    }
    motionQuery.addEventListener("change", handleMotionChange)

    const touchDetected =
      "ontouchstart" in window || navigator.maxTouchPoints > 0
    setIsTouch(touchDetected)

    return () => {
      motionQuery.removeEventListener("change", handleMotionChange)
    }
  }, [])

  // 2. IntersectionObserver to pause processing when offscreen
  React.useEffect(() => {
    if (!containerRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.05 }
    )
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  // 3. Scroll tracking with requestAnimationFrame
  React.useEffect(() => {
    if (isReducedMotion || !isVisible) return

    let rafId: number
    const handleScroll = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      // Calculate relative scroll offset inside viewport
      const offset = -rect.top
      setScrollY(offset)
    }

    const onScroll = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(handleScroll)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(rafId)
    }
  }, [isReducedMotion, isVisible])

  // 4. Pointer tracking with smooth lerp
  React.useEffect(() => {
    if (isReducedMotion || isTouch || !enablePointer || !isVisible) return

    let rafId: number
    let currentX = pointer.x
    let currentY = pointer.y

    const updatePointer = () => {
      currentX += (targetPointer.x - currentX) * pointerDamping
      currentY += (targetPointer.y - currentY) * pointerDamping
      setPointer({ x: currentX, y: currentY })

      if (
        Math.abs(targetPointer.x - currentX) > 0.001 ||
        Math.abs(targetPointer.y - currentY) > 0.001
      ) {
        rafId = requestAnimationFrame(updatePointer)
      }
    }

    rafId = requestAnimationFrame(updatePointer)

    return () => cancelAnimationFrame(rafId)
  }, [targetPointer, isReducedMotion, isTouch, enablePointer, isVisible, pointerDamping])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isReducedMotion || isTouch || !enablePointer) return
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    // Normalized between -1 and 1
    const normalizedX = ((e.clientX - rect.left) / rect.width) * 2 - 1
    const normalizedY = ((e.clientY - rect.top) / rect.height) * 2 - 1
    setTargetPointer({ x: normalizedX, y: normalizedY })
  }

  const handleMouseLeave = () => {
    setTargetPointer({ x: 0, y: 0 })
  }

  return (
    <ParallaxContext.Provider
      value={{
        scrollY,
        pointerX: pointer.x,
        pointerY: pointer.y,
        isReducedMotion,
        isTouch,
        isVisible,
      }}
    >
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn("relative overflow-hidden", className)}
        {...props}
      >
        {children}
      </div>
    </ParallaxContext.Provider>
  )
}

export interface ParallaxLayerProps extends React.HTMLAttributes<HTMLDivElement> {
  depth?: number // 0.0 to 1.0 (scroll speed factor)
  pointerFactor?: number // Multiplier for mouse movement (pixels)
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export function ParallaxLayer({
  depth = 0.5,
  pointerFactor = 12,
  children,
  className,
  style,
  ...props
}: ParallaxLayerProps) {
  const { scrollY, pointerX, pointerY, isReducedMotion, isTouch } = useParallax()

  if (isReducedMotion) {
    return (
      <div className={cn("relative w-full h-full", className)} style={style} {...props}>
        {children}
      </div>
    )
  }

  // Calculate transform
  const scrollOffset = scrollY * depth * 0.4
  const mouseOffsetX = isTouch ? 0 : pointerX * pointerFactor * depth
  const mouseOffsetY = isTouch ? 0 : pointerY * (pointerFactor * 0.7) * depth

  const transformStyle: React.CSSProperties = {
    transform: `translate3d(${mouseOffsetX.toFixed(2)}px, ${(
      scrollOffset + mouseOffsetY
    ).toFixed(2)}px, 0)`,
    willChange: "transform",
    ...style,
  }

  return (
    <div
      className={cn("relative w-full h-full transition-transform duration-75 ease-out", className)}
      style={transformStyle}
      {...props}
    >
      {children}
    </div>
  )
}
