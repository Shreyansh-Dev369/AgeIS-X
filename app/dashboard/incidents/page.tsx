"use client"

import React, { useState, useEffect } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { DataTable, Column } from "@/components/ui/data-table"
import { PixelBadge } from "@/components/ui/pixel-badge"
import { TacticalFrame } from "@/components/ui/tactical-frame"
import { Search } from "@/components/ui/search"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent } from "@/components/ui/drawer"
import { securityService } from "@/lib/services/security-service"
import { SecurityIncident } from "@/types/security"
import { AlertOctagon, ArrowRight, X, Clock, CheckCircle2, ShieldAlert, Laptop, User } from "lucide-react"

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
      header: "INCIDENT ID",
      accessorKey: "id",
      className: "font-mono text-xs text-[#00ff66] font-bold",
    },
    {
      header: "TITLE & TARGET",
      cell: (item) => (
        <button
          onClick={() => handleIncidentClick(item)}
          className="text-left group focus:outline-none"
        >
          <span className="font-bold text-[#f8fafc] block text-xs group-hover:text-[#00ff66] transition-colors">
            {item.title}
          </span>
          <span className="text-[10px] font-mono text-[#7e8b9b]">{item.target}</span>
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
      header: "LIFECYCLE STATUS",
      cell: (item) => (
        <PixelBadge variant={item.status === "RESOLVED" ? "phosphor" : "warning"} size="sm">
          {item.status}
        </PixelBadge>
      ),
    },
    {
      header: "REMEDIATION STATE",
      cell: (item) => (
        <span className="text-xs text-[#f8fafc] font-mono">
          {item.remediation || "CONTAINED & ISOLATED"}
        </span>
      ),
    },
    {
      header: "DETECTED (UTC)",
      accessorKey: "detectedAt",
      className: "font-mono text-[10px] text-[#7e8b9b]",
    },
    {
      header: "ACTION",
      cell: (item) => (
        <button
          onClick={() => handleIncidentClick(item)}
          className="text-[10px] font-mono text-[#00ff66] hover:underline uppercase font-bold"
        >
          [ TIMELINE ]
        </button>
      ),
    },
  ]

  return (
    <AppShell
      title="Incident Response Center"
      breadcrumbs={[{ label: "Overview", href: "/dashboard" }, { label: "Incidents" }]}
    >
      <div className="space-y-6 font-mono select-none">
        {/* Incident Lifecycle Header */}
        <TacticalFrame
          variant="panel"
          reticles={true}
          reticleColor="warning"
          className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-white/15 bg-[#080c10]"
        >
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <PixelBadge variant="warning" size="sm" dot>
                INCIDENT RESPONSE PIPELINE
              </PixelBadge>
              <span className="text-[11px] text-[#00ff66]">
                [{incidents.length} TOTAL AUDITED]
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider text-[#f8fafc] font-sans">
              Automated Containment & Remediation Audit
            </h2>
            <p className="text-xs text-[#7e8b9b] max-w-2xl leading-relaxed">
              Trace multi-vector containment events through the deterministic lifecycle: Detected → Investigating → Contained → Resolved.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-[#040608] p-2 border border-white/10 text-[10px]">
            <span className="text-[#00ff66] font-bold">[DETECTED]</span>
            <span className="text-white/30">→</span>
            <span className="text-[#00f0ff] font-bold">[CONTAINED]</span>
            <span className="text-white/30">→</span>
            <span className="text-[#ffb800] font-bold">[ACTION]</span>
            <span className="text-white/30">→</span>
            <span className="text-[#00ff66] font-bold">[RESOLVED]</span>
          </div>
        </TacticalFrame>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-[#080c10] border border-white/10">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] text-[#7e8b9b] uppercase mr-1">STATUS:</span>
            {["all", "DETECTED", "INVESTIGATING", "CONTAINED", "ACTION REQUIRED", "RESOLVED"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2 py-0.5 text-[10px] font-bold uppercase transition-colors ${
                  statusFilter === st
                    ? "bg-[#00ff66]/10 border border-[#00ff66] text-[#00ff66]"
                    : "text-[#7e8b9b] hover:text-[#f8fafc] border border-transparent"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-64">
            <Search
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              onClear={() => setFilterQuery("")}
              placeholder="Search incident logs..."
              className="h-8 text-xs bg-[#040608]"
            />
          </div>
        </div>

        {/* Incident Table */}
        <TacticalFrame variant="panel" className="p-4 border-white/15 bg-[#080c10]">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#7e8b9b] space-y-1">
              <p className="font-bold text-white uppercase">[ NO INCIDENTS MATCH CURRENT FILTER ]</p>
              <p className="text-[11px]">All active remediation workflows are clear.</p>
            </div>
          ) : (
            <DataTable
              data={filtered}
              columns={columns}
              keyExtractor={(item) => item.id}
            />
          )}
        </TacticalFrame>
      </div>

      {/* Detailed Incident Inspector Drawer */}
      {selectedIncident && (
        <Drawer open={drawerOpen} onOpenChange={(open) => !open && setDrawerOpen(false)}>
          <DrawerContent
            side="right"
            className="w-full sm:max-w-xl bg-[#040608] border-l border-white/15 p-0 text-[#f8fafc] flex flex-col h-full font-mono select-none"
          >
            <div className="p-4 sm:p-5 border-b border-white/10 bg-[#080c10] flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <PixelBadge variant="warning" size="sm" dot>
                    INCIDENT // {selectedIncident.id}
                  </PixelBadge>
                  <PixelBadge
                    variant={selectedIncident.severity === "critical" ? "danger" : "warning"}
                    size="sm"
                  >
                    {selectedIncident.severity.toUpperCase()}
                  </PixelBadge>
                </div>
                <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-[#f8fafc] pt-1">
                  {selectedIncident.title}
                </h2>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1 border border-white/10 hover:border-white/30 text-[#7e8b9b] hover:text-white transition-colors"
                aria-label="Close inspector"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs">
              {/* Incident Summary */}
              <TacticalFrame variant="default" className="p-3.5 border-white/10 bg-[#080c10] space-y-1">
                <span className="text-[10px] text-[#00ff66] font-bold uppercase block">
                  INCIDENT SUMMARY
                </span>
                <p className="text-[#f8fafc] text-[11px] leading-relaxed">
                  Target: <strong className="text-[#00f0ff]">{selectedIncident.target}</strong>
                </p>
                <p className="text-[#7e8b9b] text-[11px] leading-relaxed">
                  {selectedIncident.remediation || "Automated containment engaged. Socket suspended."}
                </p>
              </TacticalFrame>

              {/* Timeline Sequence */}
              {selectedIncident.timeline && selectedIncident.timeline.length > 0 && (
                <div className="p-3.5 border border-white/10 bg-[#080c10] space-y-2">
                  <span className="text-[10px] text-[#00f0ff] font-bold uppercase block">
                    CHRONOLOGICAL INCIDENT TIMELINE
                  </span>
                  <div className="space-y-2 border-l border-white/10 ml-1.5 pl-3">
                    {selectedIncident.timeline.map((event, idx) => (
                      <div key={idx} className="space-y-0.5 relative">
                        <span className="w-2 h-2 bg-[#00ff66] absolute -left-[17px] top-1 rounded-none" />
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-[#7e8b9b]">{event.timestamp}</span>
                          <span className="text-white/40">ACTOR: {event.actor}</span>
                        </div>
                        <p className="text-[#f8fafc] text-[11px] font-semibold">{event.event}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Scope & Assets */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 border border-white/10 bg-[#080c10] space-y-1">
                  <span className="text-[10px] text-[#7e8b9b] uppercase block flex items-center gap-1">
                    <Laptop className="w-3 h-3 text-[#00ff66]" />
                    <span>AFFECTED NODES</span>
                  </span>
                  <span className="text-[#f8fafc] text-xs font-bold">
                    {selectedIncident.affectedDevices?.join(", ") || "macOS Node 01"}
                  </span>
                </div>
                <div className="p-3 border border-white/10 bg-[#080c10] space-y-1">
                  <span className="text-[10px] text-[#7e8b9b] uppercase block flex items-center gap-1">
                    <User className="w-3 h-3 text-[#00f0ff]" />
                    <span>AFFECTED IDENTITIES</span>
                  </span>
                  <span className="text-[#f8fafc] text-xs font-bold">
                    {selectedIncident.affectedAccounts?.join(", ") || "secops@corp"}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-white/10 bg-[#080c10] flex items-center justify-between">
              <PixelBadge variant="phosphor" size="sm">
                LIFECYCLE: {selectedIncident.status}
              </PixelBadge>
              <Button
                size="sm"
                onClick={() => setDrawerOpen(false)}
                className="text-xs font-mono uppercase tracking-wider font-bold h-8 px-4"
              >
                [ CLOSE INCIDENT AUDIT ]
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </AppShell>
  )
}
