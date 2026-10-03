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
    phosphor: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-medium",
    cyan: "border-sky-500/30 bg-sky-500/10 text-sky-400 font-medium",
    warning: "border-amber-500/30 bg-amber-500/10 text-amber-400 font-medium",
    danger: "border-rose-500/30 bg-rose-500/10 text-rose-400 font-medium",
    neutral: "border-white/10 bg-white/5 text-slate-400 font-medium",
    outline: "border-white/20 bg-transparent text-slate-200",
  }

  const dotColors = {
    phosphor: "bg-emerald-400",
    cyan: "bg-sky-400",
    warning: "bg-amber-400",
    danger: "bg-rose-400",
    neutral: "bg-slate-400",
    outline: "bg-white",
  }

  const sizeStyles = {
    sm: "text-[10px] px-2 py-0.5 rounded",
    md: "text-xs px-2.5 py-0.5 rounded-md",
    lg: "text-xs px-3 py-1 rounded-md",
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
          className={cn("inline-block w-1.5 h-1.5 rounded-full shrink-0", dotColors[variant])}
          aria-hidden="true"
        />
      )}
      <span className="font-semibold">{children}</span>
    </span>
  )
}
