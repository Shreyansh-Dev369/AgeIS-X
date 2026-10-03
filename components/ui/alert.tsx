import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from "lucide-react"
import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-none border p-3.5 text-xs flex gap-3 items-start font-mono",
  {
    variants: {
      variant: {
        default: "bg-[#080c10] text-[#f8fafc] border-white/15",
        info: "bg-[#00f0ff]/10 text-[#f8fafc] border-[#00f0ff]/40 [&>svg]:text-[#00f0ff]",
        success: "bg-[#00ff66]/10 text-[#f8fafc] border-[#00ff66]/40 [&>svg]:text-[#00ff66]",
        warning: "bg-[#ffb800]/10 text-[#f8fafc] border-[#ffb800]/40 [&>svg]:text-[#ffb800]",
        destructive: "bg-[#ff3b30]/10 text-[#f8fafc] border-[#ff3b30]/40 [&>svg]:text-[#ff3b30]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  title?: string
  onClose?: () => void
}

export function Alert({
  className,
  variant = "default",
  title,
  children,
  onClose,
  ...props
}: AlertProps) {
  const getIcon = () => {
    switch (variant) {
      case "info":
        return <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#00f0ff]" />
      case "success":
        return <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#00ff66]" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#ffb800]" />
      case "destructive":
        return <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#ff3b30]" />
      default:
        return <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#7e8b9b]" />
    }
  }

  return (
    <div
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {getIcon()}
      <div className="flex-1">
        {title && <h5 className="font-bold uppercase tracking-wider leading-tight mb-1 text-[#f8fafc]">{title}</h5>}
        <div className="text-xs text-[#7e8b9b] font-sans leading-relaxed">{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-[#7e8b9b] hover:text-[#f8fafc] p-1 rounded-none focus:outline-none focus:ring-1 focus:ring-[#00ff66]"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
