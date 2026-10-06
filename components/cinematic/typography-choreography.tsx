"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface MaskedHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  lines: string[]
  level?: 1 | 2 | 3 | 4
  accentLineIndex?: number
  accentClassName?: string
  className?: string
  delay?: number
}

/**
 * Masked Line-by-Line Typography Reveal.
 * Text climbs from behind an architectural mask plane on viewport entry.
 * Respects prefers-reduced-motion.
 */
export function MaskedHeading({
  lines,
  level = 1,
  accentLineIndex,
  accentClassName = "text-[#39FF14]",
  className,
  delay = 0,
  ...props
}: MaskedHeadingProps) {
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

  const Tag = (`h${level}` as unknown) as React.ElementType

  return (
    <div ref={containerRef} className={cn("space-y-0.5 select-none", className)}>
      <Tag className="space-y-0.5">
        {lines.map((line, idx) => {
          const isAccent = idx === accentLineIndex
          const lineDelay = delay + idx * 90

          return (
            <span key={idx} className="block overflow-hidden pb-1">
              <span
                className={cn(
                  "block transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  isRevealed ? "translate-y-0 opacity-100" : "translate-y-[110%] opacity-0",
                  isAccent && accentClassName
                )}
                style={{
                  transitionDelay: `${lineDelay}ms`,
                  willChange: "transform, opacity",
                }}
              >
                {line}
              </span>
            </span>
          )
        })}
      </Tag>
    </div>
  )
}

export interface TechnicalTrackingRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  delay?: number
  className?: string
}

/**
 * Technical tracking/kerning entrance for system labels and kickers.
 */
export function TechnicalTrackingReveal({
  children,
  delay = 0,
  className,
  ...props
}: TechnicalTrackingRevealProps) {
  const [isRevealed, setIsRevealed] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

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
          if (ref.current) observer.unobserve(ref.current)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) observer.observe(ref.current)

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-600 ease-out inline-flex items-center",
        isRevealed
          ? "opacity-100 translate-x-0 tracking-widest"
          : "opacity-0 -translate-x-2 tracking-normal",
        className
      )}
      style={{
        transitionDelay: `${delay}ms`,
        willChange: "opacity, transform",
      }}
      {...props}
    >
      {children}
    </div>
  )
}
