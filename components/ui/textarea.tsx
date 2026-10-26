import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-none border bg-[#080c10] px-3 py-2 font-mono text-xs text-[#f8fafc] transition-colors placeholder:text-[#7e8b9b]/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00ff66] disabled:cursor-not-allowed disabled:opacity-50",
          error
            ? "border-[#ff3b30] focus-visible:ring-[#ff3b30]"
            : "border-white/10 hover:border-white/20 focus-visible:border-[#00ff66]",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
