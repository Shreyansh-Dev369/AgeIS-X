import * as React from "react"
import { cn } from "@/lib/utils"

export interface TerminalPromptProps extends React.HTMLAttributes<HTMLDivElement> {
  user?: string
  host?: string
  path?: string
  command?: string
  showCursor?: boolean
  prefix?: string
}

export function TerminalPrompt({
  user = "ageis-x",
  host = "security-core",
  path = "~",
  command,
  showCursor = true,
  prefix,
  className,
  children,
  ...props
}: TerminalPromptProps) {
  return (
    <div
      className={cn(
        "font-mono text-xs text-[#f8fafc] flex items-center flex-wrap gap-x-1.5 py-1 select-none",
        className
      )}
      {...props}
    >
      {prefix ? (
        <span className="text-[#00ff66] font-bold">{prefix}</span>
      ) : (
        <span className="flex items-center gap-0.5">
          <span className="text-[#00ff66] font-semibold">{user}</span>
          <span className="text-white/40">@</span>
          <span className="text-[#00f0ff] font-medium">{host}</span>
          <span className="text-white/40">:</span>
          <span className="text-[#ffb800]">{path}</span>
          <span className="text-white/60 font-bold ml-1">$</span>
        </span>
      )}

      {command && <span className="text-[#f8fafc] font-medium">{command}</span>}
      {children}
      {showCursor && <span className="terminal-cursor" aria-hidden="true" />}
    </div>
  )
}
