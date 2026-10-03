import React from "react"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
  retryLabel?: string
  className?: string
}

export function ErrorState({
  title = "Security data could not be loaded",
  description = "Telemetry connection to AgeIS-X ingestion node was interrupted. Check your network or retry.",
  onRetry,
  retryLabel = "Retry Telemetry Connection",
  className = "",
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center rounded-lg border border-rose-900/30 bg-rose-950/10",
        className
      )}
      role="alert"
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-rose-950/40 border border-rose-800/40 text-rose-400 mb-3.5 shadow-sm">
        <AlertCircle className="w-6 h-6 stroke-[1.75]" />
      </div>
      <h4 className="text-sm font-semibold text-rose-200">{title}</h4>
      <p className="text-xs text-slate-400 mt-1 max-w-md leading-relaxed">
        {description}
      </p>
      {onRetry && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onRetry}
          className="mt-4 gap-2 border-slate-700 hover:border-slate-600"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          {retryLabel}
        </Button>
      )}
    </div>
  )
}
