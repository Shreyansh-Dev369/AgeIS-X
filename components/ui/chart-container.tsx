"use client"

import * as React from "react"
import { LoadingState } from "@/components/ui/loading-state"
import { EmptyState } from "@/components/ui/empty-state"
import { ErrorState } from "@/components/ui/error-state"
import { BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  subtitle?: string
  action?: React.ReactNode
  loading?: boolean
  error?: string | null
  empty?: boolean
  emptyMessage?: string
  onRetry?: () => void
  minHeight?: number
}

export function ChartContainer({
  title,
  subtitle,
  action,
  loading = false,
  error = null,
  empty = false,
  emptyMessage = "No telemetry metrics recorded for this timeframe",
  onRetry,
  minHeight = 280,
  children,
  className,
  ...props
}: ChartContainerProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6 flex flex-col",
        className
      )}
      {...props}
    >
      {(title || subtitle || action) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-800/80">
          <div>
            {title && (
              <h3 className="text-sm font-semibold text-slate-100 tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}

      <div
        className="flex-1 w-full relative flex flex-col justify-center"
        style={{ minHeight }}
      >
        {loading ? (
          <LoadingState
            title="Loading chart telemetry..."
            description="Acquiring time-series data points..."
          />
        ) : error ? (
          <ErrorState
            title="Chart rendering failure"
            description={error}
            onRetry={onRetry}
          />
        ) : empty ? (
          <EmptyState
            icon={BarChart3}
            title="No telemetry data"
            description={emptyMessage}
          />
        ) : (
          children
        )}
      </div>
    </div>
  )
}
