import * as React from "react"
import { cn } from "@/lib/utils"

export interface PixelStatusBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number // 0 to 100
  totalBlocks?: number
  label?: string
  showPercentage?: boolean
  variant?: "phosphor" | "cyan" | "warning" | "danger" | "auto"
}

export function PixelStatusBar({
  value,
  totalBlocks = 10,
  label,
  showPercentage = true,
  variant = "auto",
  className,
  ...props
}: PixelStatusBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value))
  const filledBlocks = Math.round((clampedValue / 100) * totalBlocks)
  const emptyBlocks = totalBlocks - filledBlocks

  const resolvedVariant =
    variant === "auto"
      ? clampedValue >= 80
        ? "phosphor"
        : clampedValue >= 50
        ? "warning"
        : "danger"
      : variant

  const colorStyles = {
    phosphor: {
      text: "text-[#00ff66]",
      filled: "text-[#00ff66]",
      empty: "text-white/15",
    },
    cyan: {
      text: "text-[#00f0ff]",
      filled: "text-[#00f0ff]",
      empty: "text-white/15",
    },
    warning: {
      text: "text-[#ffb800]",
      filled: "text-[#ffb800]",
      empty: "text-white/15",
    },
    danger: {
      text: "text-[#ff3b30]",
      filled: "text-[#ff3b30]",
      empty: "text-white/15",
    },
  }

  const activeColor = colorStyles[resolvedVariant]

  return (
    <div
      className={cn("flex flex-col gap-1 font-mono select-none text-xs", className)}
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label || "Security posture status"}
      {...props}
    >
      {label && (
        <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-[#7e8b9b]">
          <span>{label}</span>
          {showPercentage && <span className={activeColor.text}>{clampedValue}%</span>}
        </div>
      )}
      <div className="flex items-center gap-1.5 tracking-tighter">
        <span className="text-white/40 font-bold">[</span>
        <span className={cn("font-mono font-black tracking-widest", activeColor.filled)}>
          {"■".repeat(filledBlocks)}
        </span>
        <span className={cn("font-mono tracking-widest", activeColor.empty)}>
          {"□".repeat(emptyBlocks)}
        </span>
        <span className="text-white/40 font-bold">]</span>
        {!label && showPercentage && (
          <span className={cn("font-mono ml-2 font-bold", activeColor.text)}>
            {clampedValue}%
          </span>
        )}
      </div>
    </div>
  )
}
