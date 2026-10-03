import * as React from "react"
import { cn } from "@/lib/utils"

export type PixelBadgeVariant =
  | "phosphor"
  | "cyan"
  | "warning"
  | "danger"
  | "neutral"
  | "outline"

export interface PixelBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: PixelBadgeVariant
  size?: "sm" | "md" | "lg"
  dot?: boolean
}

export function PixelBadge({
  className,
  variant = "phosphor",
  size = "md",
  dot = false,
  children,
  ...props
}: PixelBadgeProps) {
  const variantStyles = {
    phosphor: "border-[#00ff66]/40 bg-[#00ff66]/10 text-[#00ff66]",
    cyan: "border-[#00f0ff]/40 bg-[#00f0ff]/10 text-[#00f0ff]",
    warning: "border-[#ffb800]/40 bg-[#ffb800]/10 text-[#ffb800]",
    danger: "border-[#ff3b30]/40 bg-[#ff3b30]/10 text-[#ff3b30]",
    neutral: "border-white/10 bg-white/5 text-[#7e8b9b]",
    outline: "border-white/20 bg-transparent text-[#f8fafc]",
  }

  const dotColors = {
    phosphor: "bg-[#00ff66]",
    cyan: "bg-[#00f0ff]",
    warning: "bg-[#ffb800]",
    danger: "bg-[#ff3b30]",
    neutral: "bg-[#7e8b9b]",
    outline: "bg-white",
  }

  const sizeStyles = {
    sm: "text-[10px] px-1.5 py-0.2 tracking-wider",
    md: "text-xs px-2 py-0.5 tracking-wider",
    lg: "text-xs px-2.5 py-1 tracking-widest",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-mono uppercase border select-none transition-colors",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn("inline-block w-1.5 h-1.5 rounded-none shrink-0", dotColors[variant])}
          aria-hidden="true"
        />
      )}
      <span>[</span>
      <span className="font-semibold">{children}</span>
      <span>]</span>
    </span>
  )
}
