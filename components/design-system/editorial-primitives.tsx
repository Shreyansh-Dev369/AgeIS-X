import * as React from "react"
import { cn } from "@/lib/utils"

export type BackgroundMode =
  | "dark-lab"
  | "editorial-black"
  | "off-white"
  | "off-white-editorial"
  | "pixel-system"
  | "pixel-system-state"

/**
 * Editorial Section wrapper with configurable background mode,
 * fine grain texture, razor-thin borders, and responsive layout.
 */
export interface EditorialSectionProps extends React.HTMLAttributes<HTMLElement> {
  mode?: BackgroundMode
  bordered?: boolean
  containerWidth?: "default" | "narrow" | "wide" | "full"
  children: React.ReactNode
}

export function EditorialSection({
  mode = "editorial-black",
  bordered = true,
  containerWidth = "default",
  className,
  children,
  ...props
}: EditorialSectionProps) {
  const isLight = mode === "off-white" || mode === "off-white-editorial"

  const modeClasses: Record<BackgroundMode, string> = {
    "dark-lab": "bg-[#050505] technical-grid text-[#F1F0EB]",
    "editorial-black": "bg-[#080808] text-[#F1F0EB]",
    "off-white": "bg-[#F1F0EB] paper-texture text-[#050505]",
    "off-white-editorial": "bg-[#F1F0EB] paper-texture text-[#050505]",
    "pixel-system": "bg-[#050505] bitmap-texture text-[#FFFFFF]",
    "pixel-system-state": "bg-[#050505] bitmap-texture text-[#FFFFFF]",
  }

  const widthClasses = {
    narrow: "max-w-4xl",
    default: "max-w-[1440px] 2xl:max-w-[1600px]",
    wide: "max-w-[1600px]",
    full: "max-w-full px-0",
  }

  return (
    <section
      className={cn(
        "py-12 md:py-20 relative overflow-hidden",
        modeClasses[mode] || modeClasses["editorial-black"],
        bordered && (isLight ? "border-b border-[#242424]/15" : "border-b border-white/10"),
        className
      )}
      {...props}
    >
      <div className={cn("page-container", widthClasses[containerWidth])}>
        {children}
      </div>
    </section>
  )
}

/**
 * Editorial Heading with aggressive scale contrast, section numbers, and kicker.
 */
export interface EditorialHeadingProps {
  number?: string
  kicker?: string
  title?: string | React.ReactNode
  subtitle?: string | React.ReactNode
  children?: React.ReactNode
  level?: 1 | 2 | 3 | 4 | number
  size?: "sm" | "md" | "lg" | "xl" | "hero"
  align?: "left" | "center" | "right"
  mode?: BackgroundMode
  className?: string
}

export function EditorialHeading({
  number,
  kicker,
  title,
  subtitle,
  children,
  level = 2,
  size,
  align = "left",
  mode = "editorial-black",
  className,
}: EditorialHeadingProps) {
  const isLight = mode === "off-white" || mode === "off-white-editorial"

  const effectiveSize = size || (level === 1 ? "hero" : level === 2 ? "xl" : level === 3 ? "lg" : "md")

  const sizeClasses = {
    sm: "text-lg sm:text-xl font-bold tracking-tight font-mono",
    md: "text-xl sm:text-2xl font-bold tracking-tight font-mono",
    lg: "text-2xl sm:text-3xl font-extrabold tracking-tight font-mono",
    xl: "text-3xl sm:text-4xl md:text-5xl font-black tracking-tight font-mono uppercase",
    hero: "text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter uppercase leading-[0.92] font-mono",
  }

  const content = children || title

  const Tag: React.ElementType = level === 1 ? "h1" : level === 2 ? "h2" : level === 3 ? "h3" : "h4"

  return (
    <div
      className={cn(
        "space-y-3",
        align === "center" && "text-center mx-auto",
        align === "right" && "text-right ml-auto",
        className
      )}
    >
      {(number || kicker) && (
        <div className="flex items-center gap-2.5 text-xs font-mono">
          {number && (
            <span className={cn("font-bold text-[#39FF14]", isLight && "text-[#050505]")}>
              {number}
            </span>
          )}
          {number && kicker && <span className={cn("text-white/20", isLight && "text-black/20")}>/</span>}
          {kicker && (
            <span
              className={cn(
                "uppercase tracking-widest text-[11px] font-semibold",
                isLight ? "text-[#6F706D]" : "text-[#A6A6A0]"
              )}
            >
              {kicker}
            </span>
          )}
        </div>
      )}

      <Tag
        className={cn(
          sizeClasses[effectiveSize],
          isLight ? "text-[#050505]" : "text-[#F1F0EB]"
        )}
      >
        {content}
      </Tag>

      {subtitle && (
        <p
          className={cn(
            "text-xs sm:text-sm leading-relaxed max-w-2xl font-sans font-normal",
            isLight ? "text-[#6F706D]" : "text-[#A6A6A0]",
            align === "center" && "mx-auto"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}

/**
 * Editorial Rule: 1px razor line with optional label or dot marker
 */
export function EditorialRule({
  label,
  className,
  color = "default",
}: {
  label?: string
  className?: string
  color?: "default" | "signal" | "dark"
}) {
  return (
    <div className={cn("relative my-6 flex items-center gap-3 select-none", className)}>
      <div className={cn("flex-1 h-px", color === "signal" ? "bg-[#39FF14]/40" : color === "dark" ? "bg-black/15" : "bg-white/10")} />
      {label && (
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#A6A6A0] px-1 shrink-0">
          {label}
        </span>
      )}
      {label && <div className={cn("flex-1 h-px", color === "signal" ? "bg-[#39FF14]/40" : color === "dark" ? "bg-black/15" : "bg-white/10")} />}
    </div>
  )
}

/**
 * Technical metadata label marker
 */
export function TechnicalLabel({
  children,
  signal = false,
  className,
}: {
  children: React.ReactNode
  signal?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wider uppercase text-[#A6A6A0] select-none",
        className
      )}
    >
      {signal && <span className="w-1.5 h-1.5 rounded-none bg-[#39FF14] inline-block animate-pulse" />}
      <span>{children}</span>
    </div>
  )
}

/**
 * Signal Marker Dot with optional label
 */
export function SignalMarker({
  status = "active",
  label,
  className,
}: {
  status?: "active" | "warning" | "critical" | "neutral"
  label?: string
  className?: string
}) {
  const colors = {
    active: "bg-[#39FF14]",
    warning: "bg-[#FFB800]",
    critical: "bg-[#FF4545]",
    neutral: "bg-[#6F706D]",
  }

  return (
    <div className={cn("inline-flex items-center gap-2 font-mono text-[11px]", className)}>
      <span
        className={cn(
          "w-2 h-2 rounded-none inline-block shrink-0",
          colors[status]
        )}
      />
      {label && <span className="text-[#F1F0EB] font-bold tracking-wider uppercase">{label}</span>}
    </div>
  )
}

/**
 * Data Strip: Clean horizontal metric layout replacing card grids.
 */
export interface MetricItem {
  label: string
  value: string | number
  unit?: string
  trend?: string
  subtext?: string
  highlight?: boolean
}

export function DataStrip({
  items,
  metrics,
  className,
}: {
  items?: MetricItem[]
  metrics?: MetricItem[]
  className?: string
}) {
  const list = items || metrics || []
  return (
    <div
      className={cn(
        "grid grid-cols-2 sm:grid-cols-4 border-y border-white/10 divide-x divide-white/10 bg-[#050505] py-2",
        className
      )}
    >
      {list.map((m, idx) => (
        <div key={idx} className="p-4 sm:p-5 flex flex-col justify-between space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#6F706D] block">
            {m.label}
          </span>
          <div className="flex items-baseline gap-1.5 pt-1">
            <span
              className={cn(
                "text-2xl sm:text-3xl font-bold font-mono tracking-tight",
                m.highlight ? "text-[#39FF14]" : "text-[#F1F0EB]"
              )}
            >
              {m.value}
            </span>
            {m.unit && <span className="text-xs font-mono text-[#A6A6A0]">{m.unit}</span>}
          </div>
          {(m.subtext || m.trend) && (
            <span className="text-[11px] text-[#A6A6A0] font-sans font-normal pt-1">
              {m.subtext || m.trend}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
