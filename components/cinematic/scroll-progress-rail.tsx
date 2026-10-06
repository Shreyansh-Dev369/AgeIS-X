"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface SectionIndicator {
  id: string
  num: string
  label: string
}

export interface ScrollProgressRailProps {
  sections?: SectionIndicator[]
  className?: string
}

const DEFAULT_SECTIONS: SectionIndicator[] = [
  { id: "hero", num: "00", label: "SOVEREIGN CORE" },
  { id: "surfaces", num: "01", label: "DEFENSE SURFACES" },
  { id: "paradigm", num: "02", label: "PARADIGM SHIFT" },
  { id: "roster", num: "03", label: "SECURITY UNITS" },
  { id: "commission", num: "04", label: "COMMISSION" },
]

/**
 * Minimalist System Orientation Rail (Desktop Only).
 * Indicates current active architectural sector without visual clutter or HUD noise.
 */
export function ScrollProgressRail({
  sections = DEFAULT_SECTIONS,
  className,
}: ScrollProgressRailProps) {
  const [activeSection, setActiveSection] = React.useState<string>(sections[0]?.id || "")
  const [scrollPercent, setScrollPercent] = React.useState(0)
  const isReducedMotionRef = React.useRef(false)

  React.useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    isReducedMotionRef.current = motionQuery.matches

    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight > 0) {
        const p = Math.min(100, Math.max(0, (window.scrollY / docHeight) * 100))
        setScrollPercent(p)
      }

      // Find current section in view
      for (const section of sections) {
        const el = document.getElementById(section.id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= window.innerHeight * 0.45 && rect.bottom >= window.innerHeight * 0.2) {
            setActiveSection(section.id)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [sections])

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <nav
      aria-label="System Section Navigation"
      className={cn(
        "fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-end gap-3 font-mono text-[10px] select-none pointer-events-auto",
        className
      )}
    >
      {/* Tiny vertical track */}
      <div className="relative w-px h-28 bg-white/10 my-1 self-end mr-[5px]">
        <div
          className="absolute top-0 w-full bg-[#39FF14] transition-all duration-150 ease-out"
          style={{ height: `${scrollPercent}%` }}
        />
      </div>

      <div className="flex flex-col items-end space-y-2">
        {sections.map((s) => {
          const isActive = activeSection === s.id
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => scrollToSection(s.id)}
              className={cn(
                "group flex items-center gap-2 text-right transition-colors duration-200 cursor-pointer outline-none focus-visible:text-[#39FF14]",
                isActive ? "text-[#39FF14]" : "text-[#6F706D] hover:text-[#A6A6A0]"
              )}
              aria-current={isActive ? "step" : undefined}
            >
              <span
                className={cn(
                  "opacity-0 group-hover:opacity-100 transition-opacity duration-200 tracking-wider text-[9px] uppercase",
                  isActive && "opacity-100 font-bold"
                )}
              >
                {s.label}
              </span>
              <span className="font-bold">{s.num}</span>
              <span
                className={cn(
                  "w-1.5 h-1.5 transition-all duration-200 inline-block",
                  isActive
                    ? "bg-[#39FF14] scale-125 shadow-[0_0_8px_#39FF14]"
                    : "bg-white/20 group-hover:bg-white/50"
                )}
              />
            </button>
          )
        })}
      </div>
    </nav>
  )
}
