"use client"

import React, { useState } from "react"
import Link from "next/link"
import { ActivityFeedItem } from "@/types/security"
import { WhatHappenedDrawer } from "@/components/dashboard/what-happened-drawer"
import { ArrowRight, Activity } from "lucide-react"
import { cn } from "@/lib/utils"

interface ActivityTimelineSectionProps {
  items: ActivityFeedItem[]
}

export function ActivityTimelineSection({ items }: ActivityTimelineSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [activeItem, setActiveItem] = useState<ActivityFeedItem | null>(null)
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)

  const handleItemClick = (item: ActivityFeedItem) => {
    setActiveItem(item)
    setDrawerOpen(true)
  }

  const filteredItems = items.filter((item) => {
    if (selectedCategory === "all") return true
    return item.category === selectedCategory
  })

  return (
    <div className="p-5 rounded-lg border border-white/10 bg-[#080d16] space-y-4 font-sans select-none">
      {/* Header with category filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">
            Recent Security Activity
          </h3>
          <p className="text-xs text-slate-400">Click any event to view why it occurred and evidence.</p>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 text-xs">
          {[
            { id: "all", label: "All" },
            { id: "phishing", label: "Phishing" },
            { id: "network", label: "Network" },
            { id: "device", label: "Device" },
            { id: "identity", label: "Identity" },
            { id: "data", label: "Data" },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors shrink-0 ${
                selectedCategory === cat.id
                  ? "bg-emerald-500/10 text-emerald-400 font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scannable Activity List */}
      <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
        {filteredItems.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No events match the selected category.
          </div>
        ) : (
          filteredItems.map((item) => {
            const isCritical = item.severity === "critical"
            const isHigh = item.severity === "high"

            return (
              <div
                key={item.id}
                role="button"
                tabIndex={0}
                onClick={() => handleItemClick(item)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    handleItemClick(item)
                  }
                }}
                className="group p-3 rounded-md border border-white/5 bg-[#04070d] hover:bg-[#0c1320] hover:border-white/15 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="mt-0.5 shrink-0">
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
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-100 group-hover:text-emerald-400 transition-colors truncate">
                        {item.title}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1 leading-tight mt-0.5">
                      {item.description}
                    </p>
                    {item.entity && (
                      <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
                        Target: {item.entity}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                  <span className="text-xs text-slate-400">{item.timestamp}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {item.status}
                  </span>
                  <span className="text-xs text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline flex items-center gap-0.5 font-medium">
                    <span>Inspect</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            )
          })
        )}
      </div>

      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
        <span className="text-xs text-slate-400">{filteredItems.length} events logged</span>
        <Link
          href="/dashboard/threats"
          className="text-xs text-emerald-400 hover:underline font-medium inline-flex items-center gap-1"
        >
          <span>View all threats</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <WhatHappenedDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        item={activeItem}
      />
    </div>
  )
}
