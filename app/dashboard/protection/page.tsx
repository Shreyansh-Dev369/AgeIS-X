"use client"

import React, { useState } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { PixelBadge } from "@/components/ui/pixel-badge"
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
  ArrowUpRight,
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
      title="Protection Controls"
      breadcrumbs={[{ label: "Overview", href: "/dashboard" }, { label: "Protection" }]}
    >
      <div className="space-y-6">
        {/* Protection Banner Header */}
        <div className="p-5 rounded-lg border border-slate-800 bg-[#080d16] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <PixelBadge variant="phosphor" size="sm" dot>
                {activeCount === domains.length ? "Optimal Protection" : "Partial Protection"}
              </PixelBadge>
              <span className="text-xs font-mono text-slate-400">
                {activeCount} of {domains.length} surfaces active
              </span>
            </div>
            <h1 className="text-lg font-bold text-slate-100">
              Autonomous Defense Surfaces & Heuristic Policies
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Synchronized interception modules operating in isolated user-space with hardware enclave attestation.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="p-3 bg-[#04070d] rounded border border-slate-800 text-center min-w-[120px]">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">Ingestion Latency</span>
              <span className="text-sm font-bold text-[#00e575]">&lt; 9.4 ms</span>
            </div>
            <div className="p-3 bg-[#04070d] rounded border border-slate-800 text-center min-w-[120px]">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">Local Signatures</span>
              <span className="text-sm font-bold text-[#00e5ff]">98.4K IoCs</span>
            </div>
          </div>
        </div>

        {/* 10 Domains Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {domains.map((domain) => {
            const Icon = DOMAIN_ICONS[domain.id] || ShieldCheck
            const isActive = domain.status === "ACTIVE"

            return (
              <div
                key={domain.id}
                className="p-4 rounded-lg border border-slate-800 bg-[#080d16] hover:border-slate-700 transition-all flex flex-col justify-between gap-3.5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg border border-[#00e575]/30 bg-[#00e575]/10 text-[#00e575] flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h2 className="text-sm font-semibold text-slate-100">
                          {domain.name}
                        </h2>
                        <span className="text-[11px] text-slate-400">
                          Coverage: <strong className="text-[#00e5ff] font-medium">{domain.coverageLevel}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <PixelBadge variant={isActive ? "phosphor" : "warning"} size="sm">
                        {domain.status === "ACTIVE" ? "Active" : "Monitoring"}
                      </PixelBadge>
                      <Toggle
                        checked={isActive}
                        onCheckedChange={() => toggleDomainStatus(domain.id)}
                        aria-label={`Toggle ${domain.name}`}
                      />
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {domain.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 pt-2.5 border-t border-slate-800 text-[11px]">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Filtered (24h)</span>
                      <span className="text-slate-200 font-mono font-medium">{domain.eventsCount24h}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Blocked (24h)</span>
                      <span className="text-[#00e575] font-mono font-medium">{domain.blockedCount24h}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Risk Posture</span>
                      <span className="text-[#00e5ff] font-mono font-medium">{domain.riskLevel}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Capability: <strong className="text-slate-300">{domain.capability}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleInspect(domain)}
                    className="text-xs text-[#00e575] hover:underline font-medium flex items-center gap-1"
                  >
                    <span>Inspect Policies</span>
                    <ArrowUpRight className="w-3 h-3" />
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
            className="w-full sm:max-w-xl bg-[#04070d] border-l border-slate-800 p-0 text-slate-100 flex flex-col h-full"
          >
            <div className="p-5 border-b border-slate-800 bg-[#080d16] flex items-start justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <PixelBadge variant="phosphor" size="sm" dot>
                    Domain: {selectedDomain.name}
                  </PixelBadge>
                  <PixelBadge variant="cyan" size="sm">
                    {selectedDomain.capability}
                  </PixelBadge>
                </div>
                <h2 className="text-base font-bold text-slate-100">
                  {selectedDomain.name}
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
                  Architecture Specification
                </span>
                <p className="text-slate-300 text-xs leading-relaxed">
                  {selectedDomain.description}
                </p>
              </div>

              {selectedDomain.details && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-lg border border-slate-800 bg-[#080d16] space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Inference Engine</span>
                    <span className="text-[#00e5ff] font-semibold text-xs font-mono">{selectedDomain.details.engine}</span>
                  </div>
                  <div className="p-3.5 rounded-lg border border-slate-800 bg-[#080d16] space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">P99 Latency</span>
                    <span className="text-[#00e575] font-semibold text-xs font-mono">{selectedDomain.details.latency}</span>
                  </div>
                </div>
              )}

              {selectedDomain.details?.activeRules && (
                <div className="p-4 rounded-lg border border-slate-800 bg-[#080d16] space-y-2.5">
                  <span className="text-[11px] text-slate-300 uppercase font-semibold block">
                    Active Heuristic Rules
                  </span>
                  <div className="space-y-2">
                    {selectedDomain.details.activeRules.map((rule, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#00e575] shrink-0" />
                        <span>{rule}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-4 rounded-lg border border-[#00e575]/30 bg-[#00e575]/5 space-y-1 text-xs">
                <div className="flex items-center gap-2 text-[#00e575] font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Zero-Knowledge Guarantee</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  All lexical token parsing and bytecode heuristics execute locally in user-space. No raw payload telemetry leaves your machine.
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-[#080d16] flex items-center justify-between">
              <PixelBadge variant="phosphor" size="sm">
                Enforcement: Active
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
