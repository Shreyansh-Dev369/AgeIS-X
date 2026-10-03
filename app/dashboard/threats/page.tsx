"use client"

import React, { useState, useEffect } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { DataTable, Column } from "@/components/ui/data-table"
import { PixelBadge } from "@/components/ui/pixel-badge"
import { TacticalFrame } from "@/components/ui/tactical-frame"
import { Search } from "@/components/ui/search"
import { WhatHappenedDrawer } from "@/components/dashboard/what-happened-drawer"
import { securityService } from "@/lib/services/security-service"
import { ThreatItem } from "@/types/security"
import { ShieldAlert, RefreshCw, Filter, ArrowRight } from "lucide-react"

export default function ThreatsPage() {
  const [threats, setThreats] = useState<ThreatItem[]>([])
  const [filterQuery, setFilterQuery] = useState("")
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedThreat, setSelectedThreat] = useState<ThreatItem | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    securityService.getThreats().then((list) => setThreats(list))
  }, [])

  const filteredThreats = threats.filter((t) => {
    if (selectedSeverity !== "all" && t.severity !== selectedSeverity) return false
    if (selectedCategory !== "all" && t.category !== selectedCategory) return false
    if (filterQuery.trim()) {
      const q = filterQuery.toLowerCase()
      return (
        t.threatType.toLowerCase().includes(q) ||
        t.source.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        t.affectedAsset.toLowerCase().includes(q)
      )
    }
    return true
  })

  const handleThreatClick = (threat: ThreatItem) => {
    setSelectedThreat(threat)
    setDrawerOpen(true)
  }

  const columns: Column<ThreatItem>[] = [
    {
      header: "THREAT ID",
      accessorKey: "id",
      className: "font-mono text-xs text-[#00ff66] font-bold",
    },
    {
      header: "CLASSIFICATION & SOURCE",
      cell: (item) => (
        <button
          onClick={() => handleThreatClick(item)}
          className="text-left group focus:outline-none"
        >
          <span className="font-bold text-[#f8fafc] block text-xs group-hover:text-[#00ff66] transition-colors">
            {item.threatType}
          </span>
          <span className="text-[10px] font-mono text-[#7e8b9b] truncate block max-w-sm">
            {item.source}
          </span>
        </button>
      ),
    },
    {
      header: "SEVERITY",
      cell: (item) => (
        <PixelBadge
          variant={item.severity === "critical" ? "danger" : item.severity === "high" ? "warning" : "cyan"}
          size="sm"
        >
          {item.severity.toUpperCase()}
        </PixelBadge>
      ),
    },
    {
      header: "AFFECTED ASSET",
      accessorKey: "affectedAsset",
      className: "text-xs font-mono text-[#f8fafc]",
    },
    {
      header: "STATUS",
      cell: (item) => (
        <PixelBadge variant={item.status === "QUARANTINED" ? "danger" : "phosphor"} size="sm">
          {item.status}
        </PixelBadge>
      ),
    },
    {
      header: "DETECTED",
      accessorKey: "detectedTime",
      className: "text-[10px] font-mono text-[#7e8b9b]",
    },
    {
      header: "ACTION",
      cell: (item) => (
        <button
          onClick={() => handleThreatClick(item)}
          className="text-[10px] font-mono text-[#00ff66] hover:underline uppercase font-bold"
        >
          [ INSPECT ]
        </button>
      ),
    },
  ]

  const criticalCount = threats.filter((t) => t.severity === "critical").length
  const blockedCount = threats.filter((t) => t.status === "BLOCKED" || t.status === "QUARANTINED").length

  return (
    <AppShell
      title="Threat Intelligence Center"
      breadcrumbs={[{ label: "Overview", href: "/dashboard" }, { label: "Threat Center" }]}
    >
      <div className="space-y-6 font-mono select-none">
        {/* Top Summary Banner */}
        <TacticalFrame
          variant="panel"
          reticles={true}
          reticleColor="danger"
          className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-white/15 bg-[#080c10]"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <PixelBadge variant="danger" size="sm" dot>
                VECTOR INTERCEPTOR ACTIVE
              </PixelBadge>
              <span className="text-[11px] text-[#00ff66]">
                [99.8% INFERENCE ACCURACY]
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider text-[#f8fafc] font-sans">
              Autonomous Threat Intelligence & Vector Feed
            </h2>
            <p className="text-xs text-[#7e8b9b] max-w-2xl leading-relaxed">
              Real-time IoC classification across malicious URLs, memory droppers, credential harvesters, and C2 beacons.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#040608] border border-white/10 text-center">
              <span className="text-[9px] uppercase text-[#7e8b9b] block">CRITICAL THREATS</span>
              <span className="text-sm font-bold text-[#ff3b30]">{criticalCount} DETECTED</span>
            </div>
            <div className="p-3 bg-[#040608] border border-white/10 text-center">
              <span className="text-[9px] uppercase text-[#7e8b9b] block">CONTAINED / BLOCKED</span>
              <span className="text-sm font-bold text-[#00ff66]">{blockedCount} / {threats.length}</span>
            </div>
          </div>
        </TacticalFrame>

        {/* Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3.5 bg-[#080c10] border border-white/10">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-[#7e8b9b] uppercase mr-1">SEVERITY:</span>
              {["all", "critical", "high", "medium", "low"].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setSelectedSeverity(sev)}
                  className={`px-2 py-0.5 text-[10px] font-bold uppercase transition-colors ${
                    selectedSeverity === sev
                      ? "bg-[#00ff66]/10 border border-[#00ff66] text-[#00ff66]"
                      : "text-[#7e8b9b] hover:text-[#f8fafc] border border-transparent"
                  }`}
                >
                  {sev.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="h-4 w-px bg-white/10 hidden lg:block mx-1" />

            <div className="flex items-center gap-1">
              <span className="text-[10px] text-[#7e8b9b] uppercase mr-1">CATEGORY:</span>
              {["all", "phishing", "malware", "network", "identity", "privacy"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2 py-0.5 text-[10px] font-bold uppercase transition-colors ${
                    selectedCategory === cat
                      ? "bg-[#00f0ff]/10 border border-[#00f0ff] text-[#00f0ff]"
                      : "text-[#7e8b9b] hover:text-[#f8fafc] border border-transparent"
                  }`}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full md:w-64">
            <Search
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              onClear={() => setFilterQuery("")}
              placeholder="Filter threat logs..."
              className="h-8 text-xs bg-[#040608]"
            />
          </div>
        </div>

        {/* Threat Table */}
        <TacticalFrame
          variant="panel"
          className="p-4 border-white/15 bg-[#080c10]"
        >
          {filteredThreats.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#7e8b9b] space-y-1">
              <p className="font-bold text-white uppercase">[ NO THREATS MATCH CURRENT FILTER ]</p>
              <p className="text-[11px]">All vector buffers in selected criteria are clean.</p>
            </div>
          ) : (
            <DataTable
              data={filteredThreats}
              columns={columns}
              keyExtractor={(item) => item.id}
            />
          )}
        </TacticalFrame>
      </div>

      {/* Threat Detail Inspector Drawer */}
      <WhatHappenedDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        item={selectedThreat}
      />
    </AppShell>
  )
}
