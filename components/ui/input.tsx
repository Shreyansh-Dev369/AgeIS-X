import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  icon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, icon, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7e8b9b] pointer-events-none flex items-center justify-center">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-9 w-full rounded-none border bg-[#080c10] px-3 py-1 font-mono text-xs text-[#f8fafc] transition-colors placeholder:text-[#7e8b9b]/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00ff66] disabled:cursor-not-allowed disabled:opacity-50",
            icon ? "pl-9" : "pl-3",
            error
              ? "border-[#ff3b30] focus-visible:ring-[#ff3b30]"
              : "border-white/10 hover:border-white/20 focus-visible:border-[#00ff66]",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
