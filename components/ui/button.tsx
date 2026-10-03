import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00ff66] focus-visible:ring-offset-1 focus-visible:ring-offset-[#040608] disabled:pointer-events-none disabled:opacity-50 select-none active:scale-[0.98] rounded-sm",
  {
    variants: {
      variant: {
        default:
          "bg-[#00ff66] text-[#040608] font-semibold hover:bg-[#39ff14] border border-[#00ff66] shadow-[0_0_12px_rgba(0,255,102,0.25)]",
        secondary:
          "bg-[#080c10] text-[#f8fafc] border border-white/10 hover:bg-[#0b1017] hover:border-[#00ff66]/40 shadow-sm",
        outline:
          "border border-white/15 bg-transparent text-[#f8fafc] hover:bg-[#080c10] hover:text-[#00ff66] hover:border-[#00ff66]/50",
        ghost:
          "bg-transparent text-[#7e8b9b] hover:bg-[#080c10] hover:text-[#f8fafc]",
        destructive:
          "bg-[#ff3b30] text-white font-semibold hover:bg-[#ff3b30]/90 border border-[#ff3b30] shadow-[0_0_12px_rgba(255,59,48,0.25)]",
        success:
          "bg-[#00ff66] text-[#040608] font-semibold hover:bg-[#39ff14] border border-[#00ff66] shadow-[0_0_12px_rgba(0,255,102,0.25)]",
        link: "text-[#00ff66] underline-offset-4 hover:underline p-0 h-auto font-mono",
        tactical:
          "bg-[#0b1017] text-[#00ff66] border border-[#00ff66]/40 hover:bg-[#00ff66]/10 font-mono tracking-wider uppercase",
      },
      size: {
        default: "h-9 px-4 py-2 text-xs font-mono uppercase tracking-wider",
        sm: "h-7 px-2.5 text-[11px] font-mono uppercase tracking-wider",
        lg: "h-11 px-6 text-sm font-semibold tracking-wide",
        icon: "h-9 w-9 p-0",
        "icon-sm": "h-7 w-7 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
