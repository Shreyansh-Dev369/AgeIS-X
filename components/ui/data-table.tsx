import * as React from "react"
import { cn } from "@/lib/utils"

export interface Column<T> {
  header: string
  accessorKey?: keyof T
  cell?: (item: T) => React.ReactNode
  className?: string
}

export interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  keyExtractor: (item: T) => string
  emptyMessage?: string
  className?: string
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  emptyMessage = "No records found.",
  className = "",
}: DataTableProps<T>) {
  return (
    <div className={cn("w-full overflow-x-auto rounded-md border border-white/10 bg-[#04070d]", className)}>
      <table className="w-full text-left text-xs text-slate-200">
        <thead className="bg-[#080d16] text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-white/10 font-mono">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className={cn("px-4 py-3 font-medium", col.className)}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 font-sans">
          {data.length > 0 ? (
            data.map((item) => (
              <tr
                key={keyExtractor(item)}
                className="hover:bg-white/5 transition-colors"
              >
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className={cn("px-4 py-3 text-xs", col.className)}>
                    {col.cell
                      ? col.cell(item)
                      : col.accessorKey
                      ? String(item[col.accessorKey] ?? "")
                      : null}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-slate-400"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
