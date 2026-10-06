"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface ImageMaskRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  wipeDirection?: "vertical" | "horizontal" | "diagonal"
  delay?: number
  duration?: number
  className?: string
}

/**
 * Architectural Image Mask Reveal.
 * Opens an image/canvas through a disciplined geometric clip-path curtain.
 */
export function ImageMaskReveal({
  children,
  wipeDirection = "vertical",
  delay = 0,
  duration = 800,
  className,
  ...props
}: ImageMaskRevealProps) {
  const [isRevealed, setIsRevealed] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (motionQuery.matches) {
      setIsRevealed(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true)
          if (containerRef.current) observer.unobserve(containerRef.current)
        }
      },
      { threshold: 0.15 }
    )

    if (containerRef.current) observer.observe(containerRef.current)

    return () => observer.disconnect()
  }, [])

  const getClipPath = () => {
    if (isRevealed) {
      return "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
    }
    switch (wipeDirection) {
      case "vertical":
        return "polygon(0 0, 100% 0, 100% 0, 0 0)"
      case "horizontal":
        return "polygon(0 0, 0 0, 0 100%, 0 100%)"
      case "diagonal":
        return "polygon(0 0, 0 0, 0 100%, 0 100%)"
    }
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
      style={{
        clipPath: getClipPath(),
        transition: `clip-path ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
        transitionDelay: `${delay}ms`,
        willChange: "clip-path",
      }}
      {...props}
    >
      {children}
    </div>
  )
}
