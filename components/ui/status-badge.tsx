import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { SecurityState } from "@/types/security"
import { SecurityStateIcon } from "@/components/design-system/icons"
import { SECURITY_STATES } from "@/lib/design-tokens"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-none px-2 py-0.5 text-xs font-mono font-medium border select-none uppercase tracking-wider transition-colors",
  {
    variants: {
      variant: {
        protected:
          "bg-[#00ff66]/10 text-[#00ff66] border-[#00ff66]/40",
        monitoring:
          "bg-[#00f0ff]/10 text-[#00f0ff] border-[#00f0ff]/40",
        warning:
          "bg-[#ffb800]/10 text-[#ffb800] border-[#ffb800]/40",
        danger:
          "bg-[#ff6b00]/10 text-[#ff6b00] border-[#ff6b00]/40",
        critical:
          "bg-[#ff3b30]/10 text-[#ff3b30] border-[#ff3b30]/40",
        purple:
          "bg-[#b356ff]/10 text-[#b356ff] border-[#b356ff]/40",
        neutral:
          "bg-white/5 text-[#7e8b9b] border-white/10",
        outline:
          "text-[#f8fafc] border-white/20 bg-transparent",
      },
      size: {
        sm: "text-[10px] px-1.5 py-0.2 gap-1",
        default: "text-xs px-2 py-0.5 gap-1.5",
        lg: "text-xs px-2.5 py-1 gap-2",
      },
    },
    defaultVariants: {
      variant: "neutral",
      size: "default",
    },
  }
)

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  state?: SecurityState
  showIcon?: boolean
  pulseDot?: boolean
}

export function StatusBadge({
  className,
  variant,
  size,
  state,
  showIcon = true,
  pulseDot = false,
  children,
  ...props
}: StatusBadgeProps) {
  if (state) {
    const config = SECURITY_STATES[state] || SECURITY_STATES.UNKNOWN
    const autoVariant = config.badgeVariant

    return (
      <div
        className={cn(
          badgeVariants({ variant: variant || autoVariant, size }),
          className
        )}
        title={config.accessibleDescription}
        role="status"
        aria-label={`Security status: ${config.label}`}
        {...props}
      >
        {pulseDot && (
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span
              className={cn(
                "animate-ping absolute inline-flex h-full w-full rounded-none opacity-75",
                state === "CRITICAL" || state === "HIGH RISK"
                  ? "bg-[#ff3b30]"
                  : state === "WARNING" || state === "ACTION REQUIRED"
                  ? "bg-[#ffb800]"
                  : "bg-[#00ff66]"
              )}
            />
            <span
              className={cn(
                "relative inline-flex rounded-none h-1.5 w-1.5",
                state === "CRITICAL" || state === "HIGH RISK"
                  ? "bg-[#ff3b30]"
                  : state === "WARNING" || state === "ACTION REQUIRED"
                  ? "bg-[#ffb800]"
                  : "bg-[#00ff66]"
              )}
            />
          </span>
        )}
        {showIcon && !pulseDot && (
          <SecurityStateIcon
            state={state}
            className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"}
          />
        )}
        <span>{children || config.label}</span>
      </div>
    )
  }

  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {children}
    </div>
  )
}
