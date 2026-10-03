import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#04070d] disabled:pointer-events-none disabled:opacity-50 select-none active:scale-[0.99] rounded-md",
  {
    variants: {
      variant: {
        default:
          "bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400 shadow-sm",
        secondary:
          "bg-[#0e1624] text-slate-100 border border-white/10 hover:bg-[#152032] hover:border-white/20",
        outline:
          "border border-white/15 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white",
        ghost:
          "bg-transparent text-slate-300 hover:bg-white/5 hover:text-white",
        destructive:
          "bg-rose-600 text-white font-semibold hover:bg-rose-500 shadow-sm",
        success:
          "bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400 shadow-sm",
        link: "text-emerald-400 underline-offset-4 hover:underline p-0 h-auto",
        tactical:
          "bg-[#0e1624] text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/10 font-medium",
      },
      size: {
        default: "h-9 px-4 py-2 text-xs",
        sm: "h-8 px-3 text-xs",
        lg: "h-11 px-6 text-sm font-semibold",
        icon: "h-9 w-9 p-0",
        "icon-sm": "h-8 w-8 p-0",
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
