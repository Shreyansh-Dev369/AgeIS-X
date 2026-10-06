"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface ParallaxContextValue {
  isReducedMotion: boolean
  isTouch: boolean
  isVisible: boolean
}

const ParallaxContext = React.createContext<ParallaxContextValue>({
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

/**
 * Ultra-Smooth High-Precision Parallax Scene Controller.
 * Tracks global viewport pointer movement and scroll progress with continuous
 * physics damping (lerp) via requestAnimationFrame.
 * Mutates CSS custom properties directly on the DOM with zero React re-render overhead.
 */
export function ParallaxScene({
  children,
  className,
  enablePointer = true,
  pointerDamping = 0.048,
  ...props
}: ParallaxSceneProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [isReducedMotion, setIsReducedMotion] = React.useState(false)
  const [isTouch, setIsTouch] = React.useState(false)
  const [isVisible, setIsVisible] = React.useState(true)

  const targetPointerRef = React.useRef({ x: 0, y: 0 })
  const currentPointerRef = React.useRef({ x: 0, y: 0 })

  const rafPointerId = React.useRef<number | null>(null)
  const rafScrollId = React.useRef<number | null>(null)

  // 1. Detect user preferences & device type
  React.useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setIsReducedMotion(motionQuery.matches)

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches)
    }
    motionQuery.addEventListener("change", handleMotionChange)

    const touchDetected =
      "ontouchstart" in window || navigator.maxTouchPoints > 0 || window.innerWidth < 1024
    setIsTouch(touchDetected)

    const handleResize = () => {
      setIsTouch(
        "ontouchstart" in window || navigator.maxTouchPoints > 0 || window.innerWidth < 1024
      )
    }
    window.addEventListener("resize", handleResize, { passive: true })

    return () => {
      motionQuery.removeEventListener("change", handleMotionChange)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // 2. IntersectionObserver to pause all processing when offscreen
  React.useEffect(() => {
    if (!containerRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.02 }
    )
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  // 3. Ultra-smooth scroll tracking via CSS variables
  React.useEffect(() => {
    if (isReducedMotion || !isVisible) return

    const handleScroll = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const scrollProgress = Math.max(0, -rect.top)
      const normalizedProgress = Math.min(1, Math.max(0, -rect.top / (rect.height || 1)))

      containerRef.current.style.setProperty("--parallax-scroll", `${scrollProgress.toFixed(1)}px`)
      containerRef.current.style.setProperty("--parallax-progress", `${normalizedProgress.toFixed(3)}`)
    }

    const onScroll = () => {
      if (rafScrollId.current !== null) cancelAnimationFrame(rafScrollId.current)
      rafScrollId.current = requestAnimationFrame(handleScroll)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener("scroll", onScroll)
      if (rafScrollId.current !== null) cancelAnimationFrame(rafScrollId.current)
    }
  }, [isReducedMotion, isVisible])

  // 4. Global window pointer tracking with smooth inertia damping
  const updatePointerLoop = React.useCallback(() => {
    if (!containerRef.current) return

    const cur = currentPointerRef.current
    const target = targetPointerRef.current

    cur.x += (target.x - cur.x) * pointerDamping
    cur.y += (target.y - cur.y) * pointerDamping

    const el = containerRef.current
    el.style.setProperty("--cam-x", `${cur.x.toFixed(4)}`)
    el.style.setProperty("--cam-y", `${cur.y.toFixed(4)}`)
    el.style.setProperty("--parallax-mouse-x", `${cur.x.toFixed(4)}`)
    el.style.setProperty("--parallax-mouse-y", `${cur.y.toFixed(4)}`)

    if (Math.abs(target.x - cur.x) > 0.0001 || Math.abs(target.y - cur.y) > 0.0001) {
      rafPointerId.current = requestAnimationFrame(updatePointerLoop)
    } else {
      rafPointerId.current = null
    }
  }, [pointerDamping])

  React.useEffect(() => {
    if (isReducedMotion || isTouch || !enablePointer || !isVisible) return

    const handlePointerMove = (e: PointerEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1
      const normY = (e.clientY / window.innerHeight) * 2 - 1

      targetPointerRef.current = { x: normX, y: normY }

      if (rafPointerId.current === null) {
        rafPointerId.current = requestAnimationFrame(updatePointerLoop)
      }
    }

    const handleMouseLeave = () => {
      targetPointerRef.current = { x: 0, y: 0 }
      if (rafPointerId.current === null) {
        rafPointerId.current = requestAnimationFrame(updatePointerLoop)
      }
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    document.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      document.removeEventListener("mouseleave", handleMouseLeave)
      if (rafPointerId.current !== null) cancelAnimationFrame(rafPointerId.current)
    }
  }, [isReducedMotion, isTouch, enablePointer, isVisible, updatePointerLoop])

  return (
    <ParallaxContext.Provider
      value={{
        isReducedMotion,
        isTouch,
        isVisible,
      }}
    >
      <div
        ref={containerRef}
        className={cn("relative overflow-hidden", className)}
        style={
          {
            "--cam-x": "0",
            "--cam-y": "0",
            "--parallax-scroll": "0px",
            "--parallax-progress": "0",
            "--parallax-mouse-x": "0",
            "--parallax-mouse-y": "0",
          } as React.CSSProperties
        }
        {...props}
      >
        {children}
      </div>
    </ParallaxContext.Provider>
  )
}

export interface ParallaxLayerProps extends React.HTMLAttributes<HTMLDivElement> {
  depth?: number // 0.0 (distant) to 1.0 (near)
  pointerFactor?: number // Multiplier for camera horizontal displacement (pixels)
  scrollFactor?: number // Multiplier for scroll-driven vertical motion
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

/**
 * Spatial Camera Depth Layer with smooth GPU-accelerated transforms.
 */
export function ParallaxLayer({
  depth = 0.5,
  pointerFactor = 16,
  scrollFactor,
  children,
  className,
  style,
  ...props
}: ParallaxLayerProps) {
  const { isReducedMotion, isTouch } = useParallax()

  if (isReducedMotion) {
    return (
      <div className={className} style={style} {...props}>
        {children}
      </div>
    )
  }

  const effectiveScrollMultiplier = scrollFactor !== undefined ? scrollFactor : depth * 0.35
  const mouseMultiplierX = isTouch ? 0 : pointerFactor * depth
  const mouseMultiplierY = isTouch ? 0 : pointerFactor * 0.65 * depth

  const transformStyle: React.CSSProperties = {
    transform: `translate3d(
      calc(var(--cam-x, 0) * ${mouseMultiplierX.toFixed(2)}px),
      calc(var(--parallax-scroll, 0px) * ${effectiveScrollMultiplier.toFixed(3)} + var(--cam-y, 0) * ${mouseMultiplierY.toFixed(2)}px),
      0
    )`,
    willChange: "transform",
    ...style,
  }

  return (
    <div
      className={cn("transition-transform duration-100 ease-out", className)}
      style={transformStyle}
      {...props}
    >
      {children}
    </div>
  )
}
