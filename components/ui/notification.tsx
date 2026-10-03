import React from "react"
import { ThreatSeverity } from "@/types/security"
import { SeverityIcon } from "@/components/design-system/icons"
import { SEVERITY_CONFIG } from "@/lib/design-tokens"
import { cn } from "@/lib/utils"

export interface NotificationItemProps {
  id: string
  title: string
  message: string
  timestamp: string
  severity?: ThreatSeverity
  read?: boolean
  onClick?: () => void
}

export function NotificationItem({
  title,
  message,
  timestamp,
  severity = "info",
  read = false,
  onClick,
}: NotificationItemProps) {
  const config = SEVERITY_CONFIG[severity]

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-start gap-3 p-3 rounded-none border transition-colors cursor-pointer text-left font-mono",
        read
          ? "bg-[#080c10]/60 border-white/5 opacity-75 hover:opacity-100 hover:border-white/15"
          : "bg-[#080c10] border-white/10 hover:border-[#00ff66]/30"
      )}
      role="article"
    >
      <div className={cn("p-1 rounded-none shrink-0 mt-0.5 bg-[#040608] border", config.borderClass, config.textClass)}>
        <SeverityIcon severity={severity} className="w-3.5 h-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-bold text-[#f8fafc] truncate">{title}</p>
          <span className="text-[10px] text-[#7e8b9b] shrink-0">{timestamp}</span>
        </div>
        <p className="text-xs text-[#7e8b9b] font-sans mt-1 line-clamp-2 leading-relaxed">{message}</p>
      </div>
      {!read && <span className="w-1.5 h-1.5 rounded-none bg-[#00ff66] mt-2 shrink-0" />}
    </div>
  )
}
