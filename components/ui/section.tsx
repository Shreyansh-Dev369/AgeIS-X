import * as React from "react"
import { cn } from "@/lib/utils"

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  title?: string
  description?: string
  action?: React.ReactNode
  container?: boolean
}

export function Section({
  title,
  description,
  action,
  container = true,
  children,
  className,
  ...props
}: SectionProps) {
  const content = (
    <section className={cn("py-8 md:py-12", className)} {...props}>
      {(title || description || action) && (
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            {title && (
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-100">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
                {description}
              </p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </section>
  )

  if (container) {
    return <div className="page-container">{content}</div>
  }

  return content
}
