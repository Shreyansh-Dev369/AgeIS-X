import * as React from "react"
import { cn } from "@/lib/utils"

export interface PixelArtProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  signalColor?: string
  title?: string
  subtitle?: string
  label?: string
  sublabel?: string
}

/**
 * Reference A: 1-Bit Pixel Sleeping Cat under Lightbulb
 * Expressive, minimalist idle & empty state with huge negative space.
 */
export function PixelSleepingCatState({
  className,
  title,
  subtitle,
  label,
  sublabel,
  ...props
}: PixelArtProps) {
  const displayTitle = label || title || "waiting for something to happen?"
  const displaySubtitle = sublabel || subtitle || "All monitored security surfaces are quiet. No active incidents detected."

  return (
    <div
      className={cn(
        "py-12 px-4 flex flex-col items-center justify-center text-center select-none space-y-5",
        className
      )}
      {...props}
    >
      {/* Hanging Lightbulb SVG */}
      <div className="flex flex-col items-center space-y-0.5">
        <div className="w-0.5 h-10 bg-white/40" />
        <svg
          width="24"
          height="32"
          viewBox="0 0 14 18"
          fill="none"
          shapeRendering="crispEdges"
          className="text-white"
        >
          {/* Bulb cap */}
          <rect x="5" y="0" width="4" height="2" fill="currentColor" />
          <rect x="4" y="2" width="6" height="2" fill="currentColor" />
          {/* Filament rays */}
          <rect x="1" y="2" width="1" height="2" fill="currentColor" opacity="0.6" />
          <rect x="12" y="2" width="1" height="2" fill="currentColor" opacity="0.6" />
          <rect x="0" y="6" width="2" height="1" fill="currentColor" opacity="0.6" />
          <rect x="12" y="6" width="2" height="1" fill="currentColor" opacity="0.6" />
          {/* Bulb body */}
          <rect x="3" y="4" width="8" height="6" fill="currentColor" />
          <rect x="2" y="5" width="10" height="4" fill="currentColor" />
          <rect x="4" y="10" width="6" height="3" fill="currentColor" />
          <rect x="5" y="13" width="4" height="2" fill="currentColor" />
          <rect x="6" y="15" width="2" height="2" fill="currentColor" />
          {/* Inner dark notch */}
          <rect x="6" y="6" width="2" height="3" fill="#050505" />
        </svg>
      </div>

      {/* Sleeping Cat Pixel Art */}
      <div className="relative py-3">
        {/* ZZZ Floating animation */}
        <div className="absolute right-0 -top-1 text-xs font-mono tracking-widest text-white/70">
          z <span className="text-[10px] text-white/50">z</span> <span className="text-[8px] text-[#39FF14]">z</span>
        </div>

        <svg
          width="80"
          height="46"
          viewBox="0 0 32 18"
          fill="none"
          shapeRendering="crispEdges"
          className="text-white mx-auto"
        >
          {/* Ears */}
          <rect x="8" y="2" width="3" height="3" fill="currentColor" />
          <rect x="20" y="2" width="3" height="3" fill="currentColor" />
          <rect x="9" y="3" width="1" height="1" fill="#050505" />
          <rect x="21" y="3" width="1" height="1" fill="#050505" />
          {/* Head & Body outline */}
          <rect x="6" y="5" width="19" height="10" fill="currentColor" />
          <rect x="7" y="6" width="17" height="8" fill="#050505" />
          {/* Closed eyes (horizontal slits) */}
          <rect x="10" y="9" width="3" height="1" fill="currentColor" />
          <rect x="18" y="9" width="3" height="1" fill="currentColor" />
          {/* Tail */}
          <rect x="1" y="9" width="6" height="3" fill="currentColor" />
          <rect x="2" y="10" width="4" height="1" fill="#050505" />
          {/* Paws */}
          <rect x="8" y="14" width="4" height="2" fill="currentColor" />
          <rect x="19" y="14" width="4" height="2" fill="currentColor" />
        </svg>
      </div>

      {/* Narrative Label */}
      <div className="space-y-1 max-w-sm">
        <p className="font-mono text-xs sm:text-sm tracking-wider text-white uppercase font-bold">
          {displayTitle}
        </p>
        {displaySubtitle && (
          <p className="text-[11px] text-[#A6A6A0] leading-relaxed font-sans">
            {displaySubtitle}
          </p>
        )}
      </div>
    </div>
  )
}

/**
 * Reference D: Cybersecurity Graphic Stickers & Stamps
 */
export function SecuritySticker({
  type = "access_granted",
  size = "md",
  className,
}: {
  type: "access_granted" | "trust_no_one" | "encryption_freedom" | "stay_curious" | "lock_it_up"
  size?: "sm" | "md" | "lg"
  className?: string
}) {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-[9px]",
    md: "px-2.5 py-1 text-[10px]",
    lg: "px-3.5 py-1.5 text-xs font-bold",
  }

  switch (type) {
    case "access_granted":
      return (
        <div
          className={cn(
            "inline-flex items-center gap-1.5 rounded-none bg-[#050505] border border-white/20 text-[#39FF14] font-mono tracking-wider uppercase select-none shadow-[2px_2px_0px_#242424]",
            sizeClasses[size],
            className
          )}
        >
          <span className="w-1.5 h-1.5 bg-[#39FF14] inline-block" />
          <span>&gt; ACCESS GRANTED</span>
        </div>
      )
    case "trust_no_one":
      return (
        <div
          className={cn(
            "inline-flex items-center rounded-none bg-[#E8E7E2] border border-black text-[#050505] font-mono font-bold tracking-wider uppercase select-none shadow-[2px_2px_0px_#242424]",
            sizeClasses[size],
            className
          )}
        >
          <span>TRUST NO ONE</span>
        </div>
      )
    case "encryption_freedom":
      return (
        <div
          className={cn(
            "inline-flex items-center gap-1.5 rounded-none bg-[#080808] border border-[#39FF14]/40 text-[#F1F0EB] font-mono tracking-wider uppercase select-none shadow-[2px_2px_0px_rgba(57,255,20,0.2)]",
            sizeClasses[size],
            className
          )}
        >
          <span className="text-[#39FF14]">🔒</span>
          <span>ENCRYPTION IS FREEDOM</span>
        </div>
      )
    case "stay_curious":
      return (
        <div
          className={cn(
            "inline-flex items-center rounded-none bg-[#050505] border border-white/20 text-[#F1F0EB] font-mono tracking-wider select-none",
            sizeClasses[size],
            className
          )}
        >
          <span>stay curious</span>
        </div>
      )
    case "lock_it_up":
      return (
        <div
          className={cn(
            "inline-flex items-center gap-1 rounded-none bg-[#050505] border border-white/15 text-[#A6A6A0] font-mono select-none",
            sizeClasses[size],
            className
          )}
        >
          <span>keep your data. lock it up.</span>
          <span className="text-[#39FF14]">♥</span>
        </div>
      )
  }
}
