import React from "react"
import { Loader2, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingStateProps {
  title?: string
  description?: string
  variant?: "spinner" | "scan" | "skeleton"
  className?: string
}

export function LoadingState({
  title = "Analyzing security telemetry...",
  description = "AgeIS-X neural model is inspecting active vectors and threat signatures.",
  variant = "spinner",
  className = "",
}: LoadingStateProps) {
  if (variant === "skeleton") {
    return (
      <div className={cn("space-y-3 p-4 animate-pulse", className)} aria-busy="true">
        <div className="h-4 bg-slate-800 rounded w-1/3" />
        <div className="h-8 bg-slate-800/60 rounded w-full" />
        <div className="h-8 bg-slate-800/40 rounded w-5/6" />
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center rounded-lg border border-slate-800/60 bg-slate-950/40",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-3">
        {variant === "scan" ? (
          <RefreshCw className="w-5 h-5 animate-spin" />
        ) : (
          <Loader2 className="w-5 h-5 animate-spin" />
        )}
      </div>
      <h4 className="text-sm font-semibold text-slate-200">{title}</h4>
      {description && (
        <p className="text-xs text-slate-400 mt-1 max-w-sm leading-relaxed">
          {description}
        </p>
      )}
    </div>
  )
}
