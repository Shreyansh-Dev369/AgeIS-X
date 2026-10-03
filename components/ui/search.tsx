"use client"

import * as React from "react"
import { Search as SearchIcon, X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SearchInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void
  containerClassName?: string
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, containerClassName, value, onChange, onClear, placeholder = "Search security telemetry, endpoints, incidents...", ...props }, ref) => {
    return (
      <div className={cn("relative flex items-center w-full", containerClassName)}>
        <SearchIcon className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none stroke-[1.75]" />
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={cn(
            "flex h-9 w-full rounded-md border border-slate-800 bg-slate-950/60 pl-9 pr-8 py-1.5 text-sm text-slate-100 placeholder:text-slate-500 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-blue-500 hover:border-slate-700",
            className
          )}
          ref={ref}
          {...props}
        />
        {value && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-2.5 p-0.5 rounded text-slate-400 hover:text-slate-200 focus:outline-none"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    )
  }
)
SearchInput.displayName = "SearchInput"

export { SearchInput, SearchInput as Search }
