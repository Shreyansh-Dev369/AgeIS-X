import React from "react"
import { AlertCircle, Clock, X } from "lucide-react"
import { AuthError } from "@/types/auth"
import { cn } from "@/lib/utils"

export function AuthErrorBanner({
  error,
  onDismiss,
  className = "",
}: {
  error: AuthError | null
  onDismiss?: () => void
  className?: string
}) {
  if (!error) return null

  const isRateLimit = error.code === "RATE_LIMITED"

  return (
    <div
      role="alert"
      className={cn(
        "border p-3 font-mono text-xs flex items-start gap-2.5 animate-in fade-in-50 duration-150 relative select-none",
        isRateLimit
          ? "bg-[#ffb800]/10 border-[#ffb800]/40 text-[#ffb800]"
          : "bg-[#ff3b30]/10 border-[#ff3b30]/40 text-[#ff3b30]",
        className
      )}
    >
      {isRateLimit ? (
        <Clock className="w-4 h-4 text-[#ffb800] shrink-0 mt-0.5" />
      ) : (
        <AlertCircle className="w-4 h-4 text-[#ff3b30] shrink-0 mt-0.5" />
      )}

      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-bold uppercase tracking-wider text-[11px]">
            {isRateLimit ? "[ RATE LIMIT EXCEEDED ]" : "[ AUTHENTICATION ERROR ]"}
          </span>
          {error.code && (
            <span className="text-[10px] text-white/50 border border-current/20 px-1 py-0.2">
              {error.code}
            </span>
          )}
        </div>
        <p className="text-xs text-[#f8fafc]/90 leading-relaxed">{error.message}</p>
        {error.retryAfterSeconds && (
          <p className="text-[11px] text-[#ffb800] font-bold">
            RETRY_AFTER: {error.retryAfterSeconds}s
          </p>
        )}
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="text-white/60 hover:text-white p-0.5 border border-white/10 hover:border-white/30 focus:outline-none transition-colors"
          aria-label="Dismiss error notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}
