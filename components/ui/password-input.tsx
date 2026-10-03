"use client"

import * as React from "react"
import { Eye, EyeOff, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

export interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, error, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)

    return (
      <div className="relative w-full">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7e8b9b] pointer-events-none flex items-center justify-center">
          <Lock className="w-4 h-4" />
        </div>
        <input
          type={showPassword ? "text" : "password"}
          className={cn(
            "flex h-9 w-full rounded-none border bg-[#080c10] pl-9 pr-10 py-1 font-mono text-xs text-[#f8fafc] transition-colors placeholder:text-[#7e8b9b]/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00ff66] disabled:cursor-not-allowed disabled:opacity-50",
            error
              ? "border-[#ff3b30] focus-visible:ring-[#ff3b30]"
              : "border-white/10 hover:border-white/20 focus-visible:border-[#00ff66]",
            className
          )}
          ref={ref}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7e8b9b] hover:text-[#f8fafc] focus:outline-none p-1 rounded-none"
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>
    )
  }
)
PasswordInput.displayName = "PasswordInput"

export { PasswordInput }
