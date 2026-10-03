"use client"

import React, { useState } from "react"
import Link from "next/link"
import { ActivityFeedItem } from "@/types/security"
import { PixelBadge } from "@/components/ui/pixel-badge"
import { TacticalFrame } from "@/components/ui/tactical-frame"
import { WhatHappenedDrawer } from "@/components/dashboard/what-happened-drawer"
import { ArrowRight } from "lucide-react"
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
    <TacticalFrame
      variant="panel"
      reticles={true}
      reticleColor="cyan"
      className="p-5 space-y-4 border-white/15 bg-[#080c10] font-mono select-none"
    >
      {/* Header with category filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#f8fafc]">
            Live Security Activity Timeline
          </h3>
          <p className="text-[11px] text-[#7e8b9b]">Click any event to inspect plain-language explainability and signals.</p>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: "ALL" },
            { id: "phishing", label: "PHISHING" },
            { id: "network", label: "NETWORK" },
            { id: "device", label: "DEVICE" },
            { id: "identity", label: "IDENTITY" },
            { id: "data", label: "DATA" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2 py-0.5 text-[10px] font-bold uppercase transition-colors shrink-0 ${
                selectedCategory === cat.id
                  ? "bg-[#00ff66]/10 border border-[#00ff66] text-[#00ff66]"
                  : "text-[#7e8b9b] hover:text-[#f8fafc] border border-transparent"
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
          <div className="py-8 text-center text-xs text-[#7e8b9b]">
            [ NO EVENTS MATCH CATEGORY FILTER ]
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
                className="group p-3 border border-white/10 bg-[#040608] hover:bg-[#0b1017] hover:border-[#00ff66]/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs cursor-pointer focus:outline-none"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="mt-0.5 shrink-0">
                    <PixelBadge
                      variant={isCritical ? "danger" : isHigh ? "warning" : "cyan"}
                      size="sm"
                    >
                      {item.severity.toUpperCase()}
                    </PixelBadge>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#f8fafc] group-hover:text-[#00ff66] transition-colors truncate">
                        {item.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#7e8b9b] line-clamp-1 leading-tight mt-0.5">
                      {item.description}
                    </p>
                    {item.entity && (
                      <span className="text-[10px] text-white/40 mt-1 block">
                        TARGET: {item.entity}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
                  <span className="text-[10px] text-[#7e8b9b]">{item.timestamp}</span>
                  <PixelBadge variant="phosphor" size="sm">
                    {item.status}
                  </PixelBadge>
                  <span className="text-[10px] text-[#00ff66] opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline flex items-center gap-0.5 font-bold">
                    <span>[ EXPLAIN ]</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            )
          })
        )}
      </div>

      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
        <span className="text-[10px] text-[#7e8b9b]">SHOWING {filteredItems.length} RECENT TELEMETRY EVENTS</span>
        <Link
          href="/dashboard/threats"
          className="text-xs text-[#00ff66] hover:underline uppercase font-bold inline-flex items-center gap-1"
        >
          <span>[ VIEW THREAT CENTER → ]</span>
        </Link>
      </div>

      <WhatHappenedDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        item={activeItem}
      />
    </TacticalFrame>
  )
}
