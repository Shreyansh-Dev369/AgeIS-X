"use client"

import React, { useState, useEffect } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { DataTable, Column } from "@/components/ui/data-table"
import { PixelBadge } from "@/components/ui/pixel-badge"
import { TacticalFrame } from "@/components/ui/tactical-frame"
import { Toggle } from "@/components/ui/toggle"
import { Drawer, DrawerContent } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { securityService } from "@/lib/services/security-service"
import { PrivacyEvent } from "@/types/security"
import { EyeOff, ShieldCheck, Globe, ArrowRight, X, Lock, CheckCircle2 } from "lucide-react"

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
      header: "TRACKER DOMAIN",
      cell: (item) => (
        <button
          onClick={() => handleInspect(item)}
          className="text-left group focus:outline-none"
        >
          <span className="font-bold text-[#f8fafc] block text-xs group-hover:text-[#00ff66] transition-colors">
            {item.originDomain}
          </span>
          <span className="text-[10px] font-mono text-[#7e8b9b]">{item.trackerType}</span>
        </button>
      ),
    },
    {
      header: "ACTION TAKEN",
      cell: (item) => (
        <PixelBadge variant="phosphor" size="sm">
          {item.actionTaken}
        </PixelBadge>
      ),
    },
    {
      header: "BROWSER / CLIENT",
      accessorKey: "affectedBrowser",
      className: "text-xs font-mono text-[#00f0ff]",
    },
    {
      header: "RISK RATING",
      cell: (item) => (
        <PixelBadge variant={item.riskLevel === "High" ? "danger" : "warning"} size="sm">
          {item.riskLevel.toUpperCase()}
        </PixelBadge>
      ),
    },
    {
      header: "DETECTED",
      accessorKey: "timestamp",
      className: "text-[10px] font-mono text-[#7e8b9b]",
    },
    {
      header: "ACTION",
      cell: (item) => (
        <button
          onClick={() => handleInspect(item)}
          className="text-[10px] font-mono text-[#00ff66] hover:underline uppercase font-bold"
        >
          [ INSPECT ]
        </button>
      ),
    },
  ]

  return (
    <AppShell
      title="Privacy & Anti-Fingerprinting Shield"
      breadcrumbs={[{ label: "Overview", href: "/dashboard" }, { label: "Privacy Shield" }]}
    >
      <div className="space-y-6 font-mono select-none">
        {/* Top Header Banner */}
        <TacticalFrame
          variant="panel"
          reticles={true}
          reticleColor="phosphor"
          className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-white/15 bg-[#080c10]"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <PixelBadge variant="phosphor" size="sm" dot>
                ANTI-FINGERPRINTING ACTIVE
              </PixelBadge>
              <span className="text-[11px] text-[#00f0ff]">
                [ZERO OUTBOUND PAYLOAD INGESTION]
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider text-[#f8fafc] font-sans">
              Privacy Sovereignty & Tracker Defanging
            </h2>
            <p className="text-xs text-[#7e8b9b] max-w-2xl leading-relaxed">
              Injects synthetic micro-noise into HTML5 canvas/audio buffers to prevent cross-site identity reconstruction.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#040608] border border-white/10 text-center">
              <span className="text-[9px] uppercase text-[#7e8b9b] block">TRACKERS DEFANGED</span>
              <span className="text-sm font-bold text-[#00ff66]">1,284 TODAY</span>
            </div>
            <div className="p-3 bg-[#040608] border border-white/10 text-center">
              <span className="text-[9px] uppercase text-[#7e8b9b] block">SOVEREIGNTY SCORE</span>
              <span className="text-sm font-bold text-[#00f0ff]">98% STRICT</span>
            </div>
          </div>
        </TacticalFrame>

        {/* Privacy Controls Panel */}
        <TacticalFrame variant="panel" className="p-5 space-y-4 border-white/15 bg-[#080c10]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#f8fafc] pb-2 border-b border-white/10">
            Real-Time Anti-Fingerprinting Defense Controls
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
            <div className="p-3.5 bg-[#040608] border border-white/10 flex items-start justify-between gap-3">
              <div>
                <p className="font-bold text-[#f8fafc] uppercase">CANVAS NOISE RANDOMIZATION</p>
                <p className="text-[11px] text-[#7e8b9b] mt-0.5">Injects +/- 1-bit pixel noise to destroy GPU render uniqueness.</p>
              </div>
              <Toggle
                checked={toggles.canvasNoise}
                onCheckedChange={(c) => setToggles((t) => ({ ...t, canvasNoise: c }))}
                aria-label="Toggle canvas noise"
              />
            </div>

            <div className="p-3.5 bg-[#040608] border border-white/10 flex items-start justify-between gap-3">
              <div>
                <p className="font-bold text-[#f8fafc] uppercase">AUDIO FREQUENCY MASKING</p>
                <p className="text-[11px] text-[#7e8b9b] mt-0.5">Perturbs oscillator response values against acoustic fingerprinting.</p>
              </div>
              <Toggle
                checked={toggles.audioNoise}
                onCheckedChange={(c) => setToggles((t) => ({ ...t, audioNoise: c }))}
                aria-label="Toggle audio noise"
              />
            </div>

            <div className="p-3.5 bg-[#040608] border border-white/10 flex items-start justify-between gap-3">
              <div>
                <p className="font-bold text-[#f8fafc] uppercase">HSTS SUPERCOOKIE STRIPPER</p>
                <p className="text-[11px] text-[#7e8b9b] mt-0.5">Sanitizes cached HSTS flags to prevent cross-site identifier storage.</p>
              </div>
              <Toggle
                checked={toggles.supercookieBlock}
                onCheckedChange={(c) => setToggles((t) => ({ ...t, supercookieBlock: c }))}
                aria-label="Toggle supercookie stripper"
              />
            </div>

            <div className="p-3.5 bg-[#040608] border border-white/10 flex items-start justify-between gap-3">
              <div>
                <p className="font-bold text-[#f8fafc] uppercase">ZERO-LOG LOCAL ENFORCEMENT</p>
                <p className="text-[11px] text-[#7e8b9b] mt-0.5">Discards visited URI history immediately following threat evaluation.</p>
              </div>
              <Toggle
                checked={toggles.zeroLogLocal}
                onCheckedChange={(c) => setToggles((t) => ({ ...t, zeroLogLocal: c }))}
                aria-label="Toggle zero log"
              />
            </div>
          </div>
        </TacticalFrame>

        {/* Privacy Interception Events Table */}
        <TacticalFrame variant="panel" className="p-4 border-white/15 bg-[#080c10]">
          <DataTable
            data={privacyEvents}
            columns={columns}
            keyExtractor={(item) => item.id}
          />
        </TacticalFrame>
      </div>

      {/* Privacy Event Inspector Drawer */}
      {selectedEvent && (
        <Drawer open={drawerOpen} onOpenChange={(open) => !open && setDrawerOpen(false)}>
          <DrawerContent
            side="right"
            className="w-full sm:max-w-xl bg-[#040608] border-l border-white/15 p-0 text-[#f8fafc] flex flex-col h-full font-mono select-none"
          >
            <div className="p-4 sm:p-5 border-b border-white/10 bg-[#080c10] flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <PixelBadge variant="phosphor" size="sm" dot>
                    PRIVACY INTERCEPT // {selectedEvent.id.toUpperCase()}
                  </PixelBadge>
                  <PixelBadge variant="cyan" size="sm">
                    {selectedEvent.affectedBrowser}
                  </PixelBadge>
                </div>
                <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-[#f8fafc] pt-1 font-sans">
                  {selectedEvent.originDomain}
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
              <TacticalFrame variant="default" className="p-3.5 border-white/10 bg-[#080c10] space-y-1">
                <span className="text-[10px] text-[#00ff66] font-bold uppercase block">
                  TRACKER VECTOR CLASSIFICATION
                </span>
                <p className="text-[#f8fafc] text-xs font-bold">{selectedEvent.trackerType}</p>
                <p className="text-[#7e8b9b] text-[11px] leading-relaxed pt-1">
                  {selectedEvent.explanation}
                </p>
              </TacticalFrame>

              <div className="p-3.5 border border-[#00ff66]/30 bg-[#00ff66]/5 space-y-1">
                <div className="flex items-center gap-2 text-[#00ff66] font-bold uppercase text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>ACTION EXECUTED</span>
                </div>
                <p className="text-[#f8fafc] font-bold text-xs pt-0.5">{selectedEvent.actionTaken}</p>
              </div>
            </div>

            <div className="p-4 border-t border-white/10 bg-[#080c10] flex items-center justify-between">
              <PixelBadge variant="phosphor" size="sm">
                STATUS: DEFANGED
              </PixelBadge>
              <Button
                size="sm"
                onClick={() => setDrawerOpen(false)}
                className="text-xs font-mono uppercase tracking-wider font-bold h-8 px-4"
              >
                [ CLOSE INSPECTOR ]
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </AppShell>
  )
}
