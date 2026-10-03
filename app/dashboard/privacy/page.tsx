"use client"

import React, { useState, useEffect } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { DataTable, Column } from "@/components/ui/data-table"
import { PixelBadge } from "@/components/ui/pixel-badge"
import { Toggle } from "@/components/ui/toggle"
import { Drawer, DrawerContent } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { securityService } from "@/lib/services/security-service"
import { PrivacyEvent } from "@/types/security"
import { EyeOff, ShieldCheck, Globe, ArrowUpRight, X, Lock, CheckCircle2 } from "lucide-react"

export default function PrivacyPage() {
  const [privacyEvents, setPrivacyEvents] = useState<PrivacyEvent[]>([])
  const [selectedEvent, setSelectedEvent] = useState<PrivacyEvent | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const [toggles, setToggles] = useState({
    canvasNoise: true,
    audioNoise: true,
    supercookieBlock: true,
    zeroLogLocal: true,
  })

  useEffect(() => {
    securityService.getPrivacyEvents().then((list) => setPrivacyEvents(list))
  }, [])

  const handleInspect = (ev: PrivacyEvent) => {
    setSelectedEvent(ev)
    setDrawerOpen(true)
  }

  const columns: Column<PrivacyEvent>[] = [
    {
      header: "Tracker Domain",
      cell: (item) => (
        <button
          onClick={() => handleInspect(item)}
          className="text-left group focus:outline-none block py-0.5"
        >
          <span className="font-semibold text-slate-100 block text-xs group-hover:text-[#00e575] transition-colors">
            {item.originDomain}
          </span>
          <span className="text-[11px] font-mono text-slate-400">{item.trackerType}</span>
        </button>
      ),
    },
    {
      header: "Action Taken",
      cell: (item) => (
        <PixelBadge variant="phosphor" size="sm">
          {item.actionTaken}
        </PixelBadge>
      ),
    },
    {
      header: "Client / Browser",
      accessorKey: "affectedBrowser",
      className: "text-xs font-mono text-[#00e5ff]",
    },
    {
      header: "Risk Rating",
      cell: (item) => (
        <PixelBadge variant={item.riskLevel === "High" ? "danger" : "warning"} size="sm">
          {item.riskLevel}
        </PixelBadge>
      ),
    },
    {
      header: "Timestamp",
      accessorKey: "timestamp",
      className: "text-[11px] font-mono text-slate-400",
    },
    {
      header: "Action",
      cell: (item) => (
        <button
          onClick={() => handleInspect(item)}
          className="text-xs font-medium text-[#00e575] hover:underline flex items-center gap-1"
        >
          <span>Inspect</span>
          <ArrowUpRight className="w-3 h-3" />
        </button>
      ),
    },
  ]

  return (
    <AppShell
      title="Privacy Shield"
      breadcrumbs={[{ label: "Overview", href: "/dashboard" }, { label: "Privacy" }]}
    >
      <div className="space-y-6">
        {/* Top Header Banner */}
        <div className="p-5 rounded-lg border border-slate-800 bg-[#080d16] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <PixelBadge variant="phosphor" size="sm" dot>
                Anti-Fingerprinting Active
              </PixelBadge>
              <span className="text-xs font-mono text-slate-400">
                Zero outbound payload ingestion
              </span>
            </div>
            <h1 className="text-lg font-bold text-slate-100">
              Privacy Sovereignty & Tracker Defanging
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Injects synthetic micro-noise into HTML5 canvas/audio buffers to prevent cross-site identity profiling and supercookie tracking.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="p-3 bg-[#04070d] rounded border border-slate-800 text-center min-w-[120px]">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">Trackers Defanged</span>
              <span className="text-sm font-bold text-[#00e575]">1,284 Today</span>
            </div>
            <div className="p-3 bg-[#04070d] rounded border border-slate-800 text-center min-w-[120px]">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">Privacy Rating</span>
              <span className="text-sm font-bold text-[#00e5ff]">98% Strict</span>
            </div>
          </div>
        </div>

        {/* Privacy Controls Panel */}
        <div className="p-5 rounded-lg space-y-4 border border-slate-800 bg-[#080d16]">
          <h2 className="text-sm font-bold text-slate-100 pb-2 border-b border-slate-800">
            Real-Time Anti-Fingerprinting Controls
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-[#04070d] rounded-lg border border-slate-800 flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-200">Canvas Noise Randomization</p>
                <p className="text-xs text-slate-400 mt-1">Injects +/- 1-bit pixel noise to destroy GPU render uniqueness.</p>
              </div>
              <Toggle
                checked={toggles.canvasNoise}
                onCheckedChange={(c) => setToggles((t) => ({ ...t, canvasNoise: c }))}
                aria-label="Toggle canvas noise"
              />
            </div>

            <div className="p-4 bg-[#04070d] rounded-lg border border-slate-800 flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-200">Audio Frequency Masking</p>
                <p className="text-xs text-slate-400 mt-1">Perturbs oscillator response values against acoustic fingerprinting.</p>
              </div>
              <Toggle
                checked={toggles.audioNoise}
                onCheckedChange={(c) => setToggles((t) => ({ ...t, audioNoise: c }))}
                aria-label="Toggle audio noise"
              />
            </div>

            <div className="p-4 bg-[#04070d] rounded-lg border border-slate-800 flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-200">HSTS Supercookie Stripper</p>
                <p className="text-xs text-slate-400 mt-1">Sanitizes cached HSTS flags to prevent cross-site identifier storage.</p>
              </div>
              <Toggle
                checked={toggles.supercookieBlock}
                onCheckedChange={(c) => setToggles((t) => ({ ...t, supercookieBlock: c }))}
                aria-label="Toggle supercookie stripper"
              />
            </div>

            <div className="p-4 bg-[#04070d] rounded-lg border border-slate-800 flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-200">Zero-Log Local Enforcement</p>
                <p className="text-xs text-slate-400 mt-1">Discards visited URI history immediately following threat evaluation.</p>
              </div>
              <Toggle
                checked={toggles.zeroLogLocal}
                onCheckedChange={(c) => setToggles((t) => ({ ...t, zeroLogLocal: c }))}
                aria-label="Toggle zero log"
              />
            </div>
          </div>
        </div>

        {/* Privacy Interception Events Table */}
        <div className="p-4 rounded-lg border border-slate-800 bg-[#080d16]">
          <DataTable
            data={privacyEvents}
            columns={columns}
            keyExtractor={(item) => item.id}
          />
        </div>
      </div>

      {/* Privacy Event Inspector Drawer */}
      {selectedEvent && (
        <Drawer open={drawerOpen} onOpenChange={(open) => !open && setDrawerOpen(false)}>
          <DrawerContent
            side="right"
            className="w-full sm:max-w-xl bg-[#04070d] border-l border-slate-800 p-0 text-slate-100 flex flex-col h-full"
          >
            <div className="p-5 border-b border-slate-800 bg-[#080d16] flex items-start justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <PixelBadge variant="phosphor" size="sm" dot>
                    Privacy Intercept
                  </PixelBadge>
                  <PixelBadge variant="cyan" size="sm">
                    {selectedEvent.affectedBrowser}
                  </PixelBadge>
                </div>
                <h2 className="text-base font-bold text-slate-100">
                  {selectedEvent.originDomain}
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
              <div className="p-4 rounded-lg border border-slate-800 bg-[#080d16] space-y-1.5">
                <span className="text-[11px] font-semibold text-[#00e575] uppercase tracking-wider block">
                  Tracker Vector Classification
                </span>
                <p className="text-slate-100 font-semibold text-xs">{selectedEvent.trackerType}</p>
                <p className="text-slate-400 text-xs leading-relaxed mt-1">
                  {selectedEvent.explanation}
                </p>
              </div>

              <div className="p-4 rounded-lg border border-[#00e575]/30 bg-[#00e575]/5 space-y-1 text-xs">
                <div className="flex items-center gap-2 text-[#00e575] font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Defanging Action Applied</span>
                </div>
                <p className="text-slate-200 font-semibold text-xs pt-1">{selectedEvent.actionTaken}</p>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-[#080d16] flex items-center justify-between">
              <PixelBadge variant="phosphor" size="sm">
                Status: Defanged
              </PixelBadge>
              <Button
                size="sm"
                onClick={() => setDrawerOpen(false)}
                className="text-xs font-medium h-8 px-4"
              >
                Close Inspector
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </AppShell>
  )
}
