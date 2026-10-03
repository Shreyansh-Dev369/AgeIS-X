"use client"

import React, { useState, useEffect } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { DataTable, Column } from "@/components/ui/data-table"
import { PixelBadge } from "@/components/ui/pixel-badge"
import { Search } from "@/components/ui/search"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent } from "@/components/ui/drawer"
import { securityService } from "@/lib/services/security-service"
import { SecurityIncident } from "@/types/security"
import { AlertOctagon, ArrowUpRight, X, Clock, CheckCircle2, ShieldAlert, Laptop, User } from "lucide-react"

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<SecurityIncident[]>([])
  const [filterQuery, setFilterQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedIncident, setSelectedIncident] = useState<SecurityIncident | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    securityService.getIncidents().then((list) => setIncidents(list))
  }, [])

  const filtered = incidents.filter((i) => {
    if (statusFilter !== "all" && i.status !== statusFilter) return false
    if (filterQuery.trim()) {
      const q = filterQuery.toLowerCase()
      return (
        i.title.toLowerCase().includes(q) ||
        i.target.toLowerCase().includes(q) ||
        i.id.toLowerCase().includes(q)
      )
    }
    return true
  })

  const handleIncidentClick = (incident: SecurityIncident) => {
    setSelectedIncident(incident)
    setDrawerOpen(true)
  }

  const columns: Column<SecurityIncident>[] = [
    {
      header: "Incident ID",
      accessorKey: "id",
      className: "font-mono text-xs text-[#00e575] font-semibold",
    },
    {
      header: "Incident Title & Target",
      cell: (item) => (
        <button
          onClick={() => handleIncidentClick(item)}
          className="text-left group focus:outline-none block py-0.5"
        >
          <span className="font-semibold text-slate-100 block text-xs group-hover:text-[#00e575] transition-colors">
            {item.title}
          </span>
          <span className="text-[11px] font-mono text-slate-400">{item.target}</span>
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
      header: "Lifecycle Stage",
      cell: (item) => (
        <PixelBadge variant={item.status === "RESOLVED" ? "phosphor" : "warning"} size="sm">
          {item.status}
        </PixelBadge>
      ),
    },
    {
      header: "Remediation",
      cell: (item) => (
        <span className="text-xs text-slate-300 font-sans">
          {item.remediation || "Contained & isolated"}
        </span>
      ),
    },
    {
      header: "Detected Time",
      accessorKey: "detectedAt",
      className: "font-mono text-[11px] text-slate-400",
    },
    {
      header: "Action",
      cell: (item) => (
        <button
          onClick={() => handleIncidentClick(item)}
          className="text-xs font-medium text-[#00e575] hover:underline flex items-center gap-1"
        >
          <span>Timeline</span>
          <ArrowUpRight className="w-3 h-3" />
        </button>
      ),
    },
  ]

  return (
    <AppShell
      title="Incident Response"
      breadcrumbs={[{ label: "Overview", href: "/dashboard" }, { label: "Incidents" }]}
    >
      <div className="space-y-6">
        {/* Incident Lifecycle Header */}
        <div className="p-5 rounded-lg border border-slate-800 bg-[#080d16] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <PixelBadge variant="warning" size="sm" dot>
                Incident Response Pipeline
              </PixelBadge>
              <span className="text-xs font-mono text-slate-400">
                {incidents.length} total recorded
              </span>
            </div>
            <h1 className="text-lg font-bold text-slate-100">
              Automated Containment & Remediation Audit
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Trace multi-vector containment events through the deterministic lifecycle: Detected → Investigating → Contained → Resolved.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#04070d] px-3 py-2 rounded border border-slate-800 text-xs font-medium">
            <span className="text-[#00e575]">Detected</span>
            <span className="text-slate-600">→</span>
            <span className="text-[#00e5ff]">Contained</span>
            <span className="text-slate-600">→</span>
            <span className="text-[#ffb800]">Action</span>
            <span className="text-slate-600">→</span>
            <span className="text-[#00e575]">Resolved</span>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-[#080d16] rounded-lg border border-slate-800">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] font-semibold text-slate-400 mr-1">Status:</span>
            {["all", "DETECTED", "INVESTIGATING", "CONTAINED", "ACTION REQUIRED", "RESOLVED"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  statusFilter === st
                    ? "bg-[#00e575]/15 border border-[#00e575]/50 text-[#00e575]"
                    : "text-slate-400 hover:text-slate-200 border border-transparent"
                }`}
              >
                {st === "all" ? "All" : st}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-64">
            <Search
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              onClear={() => setFilterQuery("")}
              placeholder="Search incident logs..."
              className="h-8 text-xs bg-[#04070d]"
            />
          </div>
        </div>

        {/* Incident Table */}
        <div className="p-4 rounded-lg border border-slate-800 bg-[#080d16]">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 space-y-1.5">
              <p className="font-semibold text-slate-200">No incidents match current criteria</p>
              <p className="text-[11px]">All active remediation workflows in this view are completed.</p>
            </div>
          ) : (
            <DataTable
              data={filtered}
              columns={columns}
              keyExtractor={(item) => item.id}
            />
          )}
        </div>
      </div>

      {/* Detailed Incident Inspector Drawer */}
      {selectedIncident && (
        <Drawer open={drawerOpen} onOpenChange={(open) => !open && setDrawerOpen(false)}>
          <DrawerContent
            side="right"
            className="w-full sm:max-w-xl bg-[#04070d] border-l border-slate-800 p-0 text-slate-100 flex flex-col h-full"
          >
            <div className="p-5 border-b border-slate-800 bg-[#080d16] flex items-start justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <PixelBadge variant="warning" size="sm" dot>
                    Incident {selectedIncident.id}
                  </PixelBadge>
                  <PixelBadge
                    variant={selectedIncident.severity === "critical" ? "danger" : "warning"}
                    size="sm"
                  >
                    {selectedIncident.severity}
                  </PixelBadge>
                </div>
                <h2 className="text-base font-bold text-slate-100">
                  {selectedIncident.title}
                </h2>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1 rounded border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors"
                aria-label="Close inspector"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
              {/* Incident Summary */}
              <div className="p-4 rounded-lg border border-slate-800 bg-[#080d16] space-y-1.5">
                <span className="text-[11px] font-semibold text-[#00e575] uppercase tracking-wider block">
                  Incident Summary
                </span>
                <p className="text-slate-200 text-xs">
                  Target Asset: <strong className="text-[#00e5ff] font-mono">{selectedIncident.target}</strong>
                </p>
                <p className="text-slate-400 text-xs leading-relaxed">
                  {selectedIncident.remediation || "Automated containment engaged. Socket suspended."}
                </p>
              </div>

              {/* Timeline Sequence */}
              {selectedIncident.timeline && selectedIncident.timeline.length > 0 && (
                <div className="p-4 rounded-lg border border-slate-800 bg-[#080d16] space-y-3">
                  <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block">
                    Chronological Timeline
                  </span>
                  <div className="space-y-3 border-l-2 border-slate-800 ml-2 pl-3">
                    {selectedIncident.timeline.map((event, idx) => (
                      <div key={idx} className="space-y-1 relative">
                        <span className="w-2 h-2 bg-[#00e575] absolute -left-[17px] top-1 rounded-full" />
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-mono text-slate-400">{event.timestamp}</span>
                          <span className="text-slate-500">Actor: {event.actor}</span>
                        </div>
                        <p className="text-slate-200 font-medium text-xs">{event.event}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Scope & Assets */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-lg border border-slate-800 bg-[#080d16] space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1.5">
                    <Laptop className="w-3.5 h-3.5 text-[#00e575]" />
                    <span>Affected Endpoints</span>
                  </span>
                  <span className="text-slate-200 text-xs font-semibold block">
                    {selectedIncident.affectedDevices?.join(", ") || "macOS Workstation"}
                  </span>
                </div>
                <div className="p-3.5 rounded-lg border border-slate-800 bg-[#080d16] space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#00e5ff]" />
                    <span>Affected Identities</span>
                  </span>
                  <span className="text-slate-200 text-xs font-semibold block">
                    {selectedIncident.affectedAccounts?.join(", ") || "secops@corp"}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-[#080d16] flex items-center justify-between">
              <PixelBadge variant="phosphor" size="sm">
                Status: {selectedIncident.status}
              </PixelBadge>
              <Button
                size="sm"
                onClick={() => setDrawerOpen(false)}
                className="text-xs font-medium h-8 px-4"
              >
                Close Audit
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </AppShell>
  )
}
