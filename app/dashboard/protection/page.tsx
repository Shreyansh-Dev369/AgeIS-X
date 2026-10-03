"use client"

import React, { useState } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { PixelBadge } from "@/components/ui/pixel-badge"
import { TacticalFrame } from "@/components/ui/tactical-frame"
import { Toggle } from "@/components/ui/toggle"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent } from "@/components/ui/drawer"
import { MOCK_PROTECTION_DOMAINS } from "@/lib/mock/security-data"
import { ProtectionDomainItem } from "@/types/security"
import {
  Globe,
  Network,
  ShieldCheck,
  Fingerprint,
  Cloud,
  Mail,
  KeyRound,
  EyeOff,
  Database,
  Brain,
  ArrowRight,
  X,
  CheckCircle2,
  Info,
  Cpu,
  Zap,
} from "lucide-react"

const DOMAIN_ICONS: Record<string, any> = {
  "web-phishing": Globe,
  "network-dns": Network,
  "endpoint-memory": ShieldCheck,
  "identity-credentials": Fingerprint,
  "cloud-perimeter": Cloud,
  "email-collab": Mail,
  "device-enclave": KeyRound,
  "privacy-sovereignty": EyeOff,
  "data-dlp": Database,
  "ai-runtime": Brain,
}

export default function ProtectionDashboardPage() {
  const [domains, setDomains] = useState<ProtectionDomainItem[]>(MOCK_PROTECTION_DOMAINS)
  const [selectedDomain, setSelectedDomain] = useState<ProtectionDomainItem | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const toggleDomainStatus = (id: string) => {
    setDomains((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const nextStatus = d.status === "ACTIVE" ? "MONITORING" : "ACTIVE"
          return { ...d, status: nextStatus }
        }
        return d
      })
    )
  }

  const handleInspect = (domain: ProtectionDomainItem) => {
    setSelectedDomain(domain)
    setDrawerOpen(true)
  }

  const activeCount = domains.filter((d) => d.status === "ACTIVE").length

  return (
    <AppShell
      title="Protection Center"
      breadcrumbs={[{ label: "Overview", href: "/dashboard" }, { label: "Protection" }]}
    >
      <div className="space-y-6 font-mono select-none">
        {/* Protection Banner Header */}
        <TacticalFrame
          variant="panel"
          reticles={true}
          reticleColor="phosphor"
          className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-white/15 bg-[#080c10]"
        >
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <PixelBadge variant="phosphor" size="sm" dot>
                STATUS: {activeCount === domains.length ? "OPTIMAL SHIELD" : "PARTIAL SHIELD"}
              </PixelBadge>
              <span className="text-[11px] text-[#00f0ff]">
                [{activeCount} OF {domains.length} DOMAINS ACTIVE]
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider text-[#f8fafc] font-sans">
              10-Domain Autonomous Defense Grid
            </h2>
            <p className="text-xs text-[#7e8b9b] max-w-2xl leading-relaxed">
              Synchronized heuristic interception engines operating in isolated user-space with hardware enclave attestation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#040608] border border-white/10 text-center">
              <span className="text-[9px] uppercase text-[#7e8b9b] block">INGESTION LATENCY</span>
              <span className="text-sm font-bold text-[#00ff66]">&lt; 9.4 MS</span>
            </div>
            <div className="p-3 bg-[#040608] border border-white/10 text-center">
              <span className="text-[9px] uppercase text-[#7e8b9b] block">SIGNATURE CONSENSUS</span>
              <span className="text-sm font-bold text-[#00f0ff]">98.4K IOCS</span>
            </div>
          </div>
        </TacticalFrame>

        {/* 10 Domains Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {domains.map((domain) => {
            const Icon = DOMAIN_ICONS[domain.id] || ShieldCheck
            const isActive = domain.status === "ACTIVE"

            return (
              <div
                key={domain.id}
                className="p-4 border border-white/10 bg-[#080c10] hover:border-white/25 transition-all flex flex-col justify-between gap-3"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 border border-[#00ff66]/30 bg-[#00ff66]/10 text-[#00ff66] flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-[#f8fafc]">
                          {domain.name}
                        </h3>
                        <span className="text-[10px] text-[#00f0ff] uppercase">
                          COVERAGE: {domain.coverageLevel}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <PixelBadge variant={isActive ? "phosphor" : "warning"} size="sm">
                        {domain.status}
                      </PixelBadge>
                      <Toggle
                        checked={isActive}
                        onCheckedChange={() => toggleDomainStatus(domain.id)}
                        aria-label={`Toggle ${domain.name}`}
                      />
                    </div>
                  </div>

                  <p className="text-[11px] text-[#7e8b9b] leading-relaxed">
                    {domain.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-[10px]">
                    <div>
                      <span className="text-white/40 uppercase block">FILTERED (24H)</span>
                      <span className="text-[#f8fafc] font-bold">{domain.eventsCount24h}</span>
                    </div>
                    <div>
                      <span className="text-white/40 uppercase block">BLOCKED (24H)</span>
                      <span className="text-[#00ff66] font-bold">{domain.blockedCount24h}</span>
                    </div>
                    <div>
                      <span className="text-white/40 uppercase block">RISK POSTURE</span>
                      <span className="text-[#00f0ff] font-bold">{domain.riskLevel}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[9px] text-[#7e8b9b] uppercase">
                    CAPABILITY: [{domain.capability}]
                  </span>
                  <button
                    type="button"
                    onClick={() => handleInspect(domain)}
                    className="text-[11px] text-[#00ff66] hover:underline uppercase font-bold flex items-center gap-1"
                  >
                    <span>[ INSPECT POLICIES ]</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Domain Inspector Drawer */}
      {selectedDomain && (
        <Drawer open={drawerOpen} onOpenChange={(open) => !open && setDrawerOpen(false)}>
          <DrawerContent
            side="right"
            className="w-full sm:max-w-xl bg-[#040608] border-l border-white/15 p-0 text-[#f8fafc] flex flex-col h-full font-mono select-none"
          >
            <div className="p-4 sm:p-5 border-b border-white/10 bg-[#080c10] flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <PixelBadge variant="phosphor" size="sm" dot>
                    DOMAIN // {selectedDomain.id.toUpperCase()}
                  </PixelBadge>
                  <PixelBadge variant="cyan" size="sm">
                    {selectedDomain.capability}
                  </PixelBadge>
                </div>
                <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-[#f8fafc] pt-1 font-sans">
                  {selectedDomain.name}
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
                  ARCHITECTURE SPECIFICATION
                </span>
                <p className="text-[#f8fafc] text-[11px] leading-relaxed">
                  {selectedDomain.description}
                </p>
              </TacticalFrame>

              {selectedDomain.details && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 border border-white/10 bg-[#080c10] space-y-1">
                    <span className="text-[10px] text-[#7e8b9b] uppercase block">INFERENCE ENGINE</span>
                    <span className="text-[#00f0ff] font-bold text-xs">{selectedDomain.details.engine}</span>
                  </div>
                  <div className="p-3 border border-white/10 bg-[#080c10] space-y-1">
                    <span className="text-[10px] text-[#7e8b9b] uppercase block">P99 LATENCY</span>
                    <span className="text-[#00ff66] font-bold text-xs">{selectedDomain.details.latency}</span>
                  </div>
                </div>
              )}

              {selectedDomain.details?.activeRules && (
                <div className="p-3.5 border border-white/10 bg-[#080c10] space-y-2">
                  <span className="text-[10px] text-[#7e8b9b] uppercase font-bold block">
                    ACTIVE HEURISTIC ENFORCEMENT RULES
                  </span>
                  <div className="space-y-1.5">
                    {selectedDomain.details.activeRules.map((rule, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[11px] text-[#f8fafc]">
                        <span className="text-[#00ff66] font-bold">[✓]</span>
                        <span>{rule}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-3.5 border border-[#00ff66]/30 bg-[#00ff66]/5 space-y-1 text-[11px]">
                <div className="flex items-center gap-2 text-[#00ff66] font-bold uppercase">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>ZERO-KNOWLEDGE SOVEREIGNTY GUARANTEE</span>
                </div>
                <p className="text-[#f8fafc]/90 leading-relaxed pt-0.5">
                  All lexical token parsing and bytecode heuristics execute locally in user-space. No raw payload telemetry leaves your machine.
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-white/10 bg-[#080c10] flex items-center justify-between">
              <PixelBadge variant="phosphor" size="sm">
                ENFORCEMENT: ACTIVE
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
