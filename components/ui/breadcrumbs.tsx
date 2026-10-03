import * as React from "react"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  showHome?: boolean
  className?: string
}

export function Breadcrumbs({
  items,
  showHome = true,
  className = "",
}: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumbs"
      className={cn("flex items-center space-x-1.5 text-xs text-slate-400", className)}
    >
      {showHome && (
        <>
          <Link
            href="/dashboard"
            className="flex items-center gap-1 hover:text-slate-200 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="sr-only">Dashboard Home</span>
          </Link>
          {items.length > 0 && (
            <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
          )}
        </>
      )}

      {items.map((item, index) => {
        const isLast = index === items.length - 1
        return (
          <React.Fragment key={index}>
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="hover:text-slate-200 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className={cn(isLast ? "text-slate-200 font-medium" : "")}>
                {item.label}
              </span>
            )}
            {!isLast && (
              <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}
