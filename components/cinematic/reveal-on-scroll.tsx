"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface RevealOnScrollProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  delay?: number // in ms
  direction?: "up" | "down" | "left" | "right" | "none"
  distance?: number // in pixels
  threshold?: number
  className?: string
}

export function RevealOnScroll({
  children,
  delay = 0,
  direction = "up",
  distance = 24,
  threshold = 0.15,
  className,
  ...props
}: RevealOnScrollProps) {
  const [isRevealed, setIsRevealed] = React.useState(false)
  const [isReducedMotion, setIsReducedMotion] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setIsReducedMotion(mediaQuery.matches)
    if (mediaQuery.matches) {
      setIsRevealed(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true)
          if (ref.current) observer.unobserve(ref.current)
        }
      },
      { threshold }
    )

    if (ref.current) observer.observe(ref.current)

    return () => observer.disconnect()
  }, [threshold])

  if (isReducedMotion) {
    return (
      <div className={className} {...props}>
        {children}
      </div>
    )
  }

  const getTransform = () => {
    if (isRevealed) return "translate3d(0, 0, 0)"
    switch (direction) {
      case "up":
        return `translate3d(0, ${distance}px, 0)`
      case "down":
        return `translate3d(0, -${distance}px, 0)`
      case "left":
        return `translate3d(${distance}px, 0, 0)`
      case "right":
        return `translate3d(-${distance}px, 0, 0)`
      case "none":
        return "translate3d(0, 0, 0)"
    }
  }

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out will-change-[transform,opacity]",
        isRevealed ? "opacity-100" : "opacity-0",
        className
      )}
      style={{
        transform: getTransform(),
        transitionDelay: `${delay}ms`,
      }}
      {...props}
    >
      {children}
    </div>
  )
}
