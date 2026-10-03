"use client"

import React, { useState, useEffect } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { DataTable, Column } from "@/components/ui/data-table"
import { PixelBadge } from "@/components/ui/pixel-badge"
import { Search } from "@/components/ui/search"
import { WhatHappenedDrawer } from "@/components/dashboard/what-happened-drawer"
import { securityService } from "@/lib/services/security-service"
import { ThreatItem } from "@/types/security"
import { ShieldAlert, ShieldCheck, Filter, ArrowUpRight, CheckCircle2 } from "lucide-react"

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
      header: "Threat ID",
      accessorKey: "id",
      className: "font-mono text-xs text-[#00e575] font-semibold",
    },
    {
      header: "Classification & Target",
      cell: (item) => (
        <button
          onClick={() => handleThreatClick(item)}
          className="text-left group focus:outline-none block py-0.5"
        >
          <span className="font-semibold text-slate-100 block text-xs group-hover:text-[#00e575] transition-colors">
            {item.threatType}
          </span>
          <span className="text-[11px] font-mono text-slate-400 truncate block max-w-sm">
            {item.source}
          </span>
        </button>
      ),
    },
    {
      header: "Severity",
      cell: (item) => (
        <PixelBadge
          variant={item.severity === "critical" ? "danger" : item.severity === "high" ? "warning" : "cyan"}
          size="sm"
        >
          {item.severity}
        </PixelBadge>
      ),
    },
    {
      header: "Protected Asset",
      accessorKey: "affectedAsset",
      className: "text-xs font-mono text-slate-300",
    },
    {
      header: "Status",
      cell: (item) => (
        <PixelBadge variant={item.status === "QUARANTINED" ? "danger" : "phosphor"} size="sm">
          {item.status === "QUARANTINED" ? "Quarantined" : item.status === "BLOCKED" ? "Blocked" : item.status}
        </PixelBadge>
      ),
    },
    {
      header: "Detected",
      accessorKey: "detectedTime",
      className: "text-[11px] font-mono text-slate-400",
    },
    {
      header: "Action",
      cell: (item) => (
        <button
          onClick={() => handleThreatClick(item)}
          className="text-xs font-medium text-[#00e575] hover:underline flex items-center gap-1"
        >
          <span>Inspect</span>
          <ArrowUpRight className="w-3 h-3" />
        </button>
      ),
    },
  ]

  const criticalCount = threats.filter((t) => t.severity === "critical").length
  const blockedCount = threats.filter((t) => t.status === "BLOCKED" || t.status === "QUARANTINED").length

  return (
    <AppShell
      title="Threat Center"
      breadcrumbs={[{ label: "Overview", href: "/dashboard" }, { label: "Threat Center" }]}
    >
      <div className="space-y-6">
        {/* Header Summary Card */}
        <div className="p-5 rounded-lg border border-slate-800 bg-[#080d16] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <PixelBadge variant="danger" size="sm" dot>
                Threat Interception Active
              </PixelBadge>
              <span className="text-xs font-mono text-slate-400">
                Local-first detection engine
              </span>
            </div>
            <h1 className="text-lg font-bold text-slate-100">
              Autonomous Threat Interception & Ingestion Feed
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Real-time classification and containment across malicious URLs, memory droppers, credential harvesters, and suspicious network sockets.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="p-3 bg-[#04070d] rounded border border-slate-800 text-center min-w-[110px]">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">Critical Threats</span>
              <span className="text-sm font-bold text-[#ff4b4b]">{criticalCount} Detected</span>
            </div>
            <div className="p-3 bg-[#04070d] rounded border border-slate-800 text-center min-w-[110px]">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">Contained</span>
              <span className="text-sm font-bold text-[#00e575]">{blockedCount} / {threats.length}</span>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 bg-[#080d16] rounded-lg border border-slate-800">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-slate-400 mr-1">Severity:</span>
              {["all", "critical", "high", "medium", "low"].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setSelectedSeverity(sev)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors capitalize ${
                    selectedSeverity === sev
                      ? "bg-[#00e575]/15 border border-[#00e575]/50 text-[#00e575]"
                      : "text-slate-400 hover:text-slate-200 border border-transparent"
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>

            <div className="h-4 w-px bg-slate-800 hidden lg:block mx-2" />

            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-slate-400 mr-1">Category:</span>
              {["all", "phishing", "malware", "network", "identity", "privacy"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors capitalize ${
                    selectedCategory === cat
                      ? "bg-[#00e5ff]/15 border border-[#00e5ff]/50 text-[#00e5ff]"
                      : "text-slate-400 hover:text-slate-200 border border-transparent"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full md:w-64">
            <Search
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              onClear={() => setFilterQuery("")}
              placeholder="Search threat logs..."
              className="h-8 text-xs bg-[#04070d]"
            />
          </div>
        </div>

        {/* Threat Table */}
        <div className="p-4 rounded-lg border border-slate-800 bg-[#080d16]">
          {filteredThreats.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 space-y-1.5">
              <p className="font-semibold text-slate-200">No threats match current filter criteria</p>
              <p className="text-[11px]">All vector inspection buffers in the selected scope are clean.</p>
            </div>
          ) : (
            <DataTable
              data={filteredThreats}
              columns={columns}
              keyExtractor={(item) => item.id}
            />
          )}
        </div>
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
