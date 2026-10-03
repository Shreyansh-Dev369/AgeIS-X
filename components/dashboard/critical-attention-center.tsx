"use client"

import React, { useState } from "react"
import Link from "next/link"
import { CriticalAttentionItem } from "@/types/security"
import { ArrowRight, X, CheckCircle2, AlertTriangle, AlertOctagon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CriticalAttentionCenterProps {
  items?: CriticalAttentionItem[]
}

export function CriticalAttentionCenter({ items = [] }: CriticalAttentionCenterProps) {
  const [activeItems, setActiveItems] = useState(items)

  const handleDismiss = (id: string) => {
    setActiveItems((prev) => prev.filter((i) => i.id !== id))
  }

  if (activeItems.length === 0) {
    return (
      <div className="p-4 rounded-lg border border-white/10 bg-[#080d16] flex items-center justify-between gap-4 font-sans">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-100">
              All Security Postures Clear
            </span>
            <p className="text-xs text-slate-400 mt-0.5">
              No active threats or required configurations need your immediate attention right now.
            </p>
          </div>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Optimal
        </span>
      </div>
    )
  }

  return (
    <div className="p-5 rounded-lg border border-amber-500/30 bg-[#0c1320] space-y-4 font-sans">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-slate-100">
            {activeItems.length} Item{activeItems.length > 1 ? "s" : ""} Need Your Attention
          </h3>
        </div>
        <span className="text-xs text-slate-400">Action recommended</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {activeItems.map((item) => {
          const isCritical = item.severity === "critical"
          const isHigh = item.severity === "high"

          return (
            <div
              key={item.id}
              className="p-4 rounded-md bg-[#080d16] border border-white/10 flex flex-col justify-between gap-3 text-xs"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "text-[10px] font-mono px-2 py-0.5 rounded font-medium",
                      isCritical
                        ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                        : isHigh
                        ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                        : "bg-sky-500/15 text-sky-400 border border-sky-500/30"
                    )}
                  >
                    {item.severity.toUpperCase()}
                  </span>
                  <span className="text-[11px] text-slate-500">{item.timestamp}</span>
                </div>

                <h4 className="font-semibold text-slate-100 text-xs pt-1">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.description}
                </p>
                {item.source && (
                  <p className="text-[11px] text-slate-500">
                    Source: <span className="text-slate-300">{item.source}</span>
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => handleDismiss(item.id)}
                  className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Dismiss
                </button>
                <Button
                  size="sm"
                  asChild
                  className="h-8 px-3 text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold"
                >
                  <Link href={item.actionHref}>
                    <span>{item.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Link>
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
