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
    <div className={cn("w-full overflow-x-auto rounded-lg border border-slate-800 bg-slate-900/60", className)}>
      <table className="w-full text-left text-xs text-slate-300">
        <thead className="bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-800">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className={cn("px-4 py-3 font-medium", col.className)}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {data.length > 0 ? (
            data.map((item) => (
              <tr
                key={keyExtractor(item)}
                className="hover:bg-slate-800/30 transition-colors"
              >
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className={cn("px-4 py-3.5", col.className)}>
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
                className="px-4 py-8 text-center text-slate-500"
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
