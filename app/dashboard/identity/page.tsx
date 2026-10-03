"use client"

import React, { useState, useEffect } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { DataTable, Column } from "@/components/ui/data-table"
import { PixelBadge } from "@/components/ui/pixel-badge"
import { PixelStatusBar } from "@/components/ui/pixel-status-bar"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent } from "@/components/ui/drawer"
import { securityService } from "@/lib/services/security-service"
import { IdentityAccount } from "@/types/security"
import {
  Fingerprint,
  Key,
  Lock,
  CheckCircle2,
  ShieldCheck,
  ArrowUpRight,
  X,
  UserCheck,
  Globe,
  Clock,
} from "lucide-react"

export default function IdentityPage() {
  const [accounts, setAccounts] = useState<IdentityAccount[]>([])
  const [selectedAccount, setSelectedAccount] = useState<IdentityAccount | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    securityService.getIdentityAccounts().then((list) => setAccounts(list))
  }, [])

  const handleAccountClick = (account: IdentityAccount) => {
    setSelectedAccount(account)
    setDrawerOpen(true)
  }

  const columns: Column<IdentityAccount>[] = [
    {
      header: "Identity & Service",
      cell: (item) => (
        <button
          onClick={() => handleAccountClick(item)}
          className="text-left group focus:outline-none block py-0.5"
        >
          <span className="font-semibold text-slate-100 block text-xs group-hover:text-[#00e575] transition-colors">
            {item.identifier}
          </span>
          <span className="text-[11px] font-mono text-slate-400">{item.service}</span>
        </button>
      ),
    },
    {
      header: "MFA Enforcement",
      cell: (item) => (
        <PixelBadge
          variant={item.mfaStatus.includes("Passkey") ? "phosphor" : item.mfaStatus.includes("TOTP") ? "cyan" : "warning"}
          size="sm"
        >
          {item.mfaStatus}
        </PixelBadge>
      ),
    },
    {
      header: "Takeover Risk",
      cell: (item) => (
        <span className="font-semibold text-xs text-[#00e575] capitalize">
          {item.takeoverRisk}
        </span>
      ),
    },
    {
      header: "Breach Exposures",
      cell: (item) => (
        <span className="text-xs font-mono text-[#00e575]">
          {item.breachExposureCount} leaks
        </span>
      ),
    },
    {
      header: "Posture Score",
      cell: (item) => (
        <span className="font-semibold text-xs text-[#00e5ff] font-mono">
          {item.securityScore}%
        </span>
      ),
    },
    {
      header: "Status",
      cell: (item) => (
        <PixelBadge variant={item.status === "SECURE" ? "phosphor" : "warning"} size="sm">
          {item.status === "SECURE" ? "Secure" : item.status}
        </PixelBadge>
      ),
    },
    {
      header: "Action",
      cell: (item) => (
        <button
          onClick={() => handleAccountClick(item)}
          className="text-xs font-medium text-[#00e575] hover:underline flex items-center gap-1"
        >
          <span>Audit</span>
          <ArrowUpRight className="w-3 h-3" />
        </button>
      ),
    },
  ]

  return (
    <AppShell
      title="Identity Defense"
      breadcrumbs={[{ label: "Overview", href: "/dashboard" }, { label: "Identity" }]}
    >
      <div className="space-y-6">
        {/* Identity Header */}
        <div className="p-5 rounded-lg border border-slate-800 bg-[#080d16] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <PixelBadge variant="phosphor" size="sm" dot>
                Zero-Knowledge Identity Shield
              </PixelBadge>
              <span className="text-xs font-mono text-slate-400">
                {accounts.length} identities monitored
              </span>
            </div>
            <h1 className="text-lg font-bold text-slate-100">
              Identity Protection & Credential Hardening
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Monitors memory hooks attempting to scrape session tokens, with continuous darknet leak feed matching.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="p-3 bg-[#04070d] rounded border border-slate-800 text-center min-w-[120px]">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">Breach Leaks</span>
              <span className="text-sm font-bold text-[#00e575]">0 Detected</span>
            </div>
            <div className="p-3 bg-[#04070d] rounded border border-slate-800 text-center min-w-[120px]">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">Passkeys</span>
              <span className="text-sm font-bold text-[#00e5ff]">3 of 4 Enforced</span>
            </div>
          </div>
        </div>

        {/* 3 Identity Surface Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-[#080d16] border border-slate-800 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Protected Keyrings</span>
            <p className="text-sm font-bold text-slate-100">Hardware Secure Enclave</p>
            <p className="text-xs text-slate-400">Locked against unauthorized scraper access</p>
          </div>

          <div className="p-4 rounded-lg bg-[#080d16] border border-slate-800 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Monitored Aliases</span>
            <p className="text-sm font-bold text-[#00e5ff]">18 Enrolled Aliases</p>
            <p className="text-xs text-slate-400">Zero-knowledge hash comparison</p>
          </div>

          <div className="p-4 rounded-lg bg-[#080d16] border border-slate-800 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Breach Watch</span>
            <p className="text-sm font-bold text-[#00e575]">0 Compromises Found</p>
            <p className="text-xs text-slate-400">Continuous credential index monitoring</p>
          </div>
        </div>

        {/* Identity Table */}
        <div className="p-4 rounded-lg border border-slate-800 bg-[#080d16]">
          <DataTable
            data={accounts}
            columns={columns}
            keyExtractor={(item) => item.id}
          />
        </div>
      </div>

      {/* Account Detail Drawer */}
      {selectedAccount && (
        <Drawer open={drawerOpen} onOpenChange={(open) => !open && setDrawerOpen(false)}>
          <DrawerContent
            side="right"
            className="w-full sm:max-w-xl bg-[#04070d] border-l border-slate-800 p-0 text-slate-100 flex flex-col h-full"
          >
            <div className="p-5 border-b border-slate-800 bg-[#080d16] flex items-start justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <PixelBadge variant="phosphor" size="sm" dot>
                    Identity: {selectedAccount.id}
                  </PixelBadge>
                  <PixelBadge variant="cyan" size="sm">
                    {selectedAccount.capability}
                  </PixelBadge>
                </div>
                <h2 className="text-base font-bold text-slate-100">
                  {selectedAccount.identifier}
                </h2>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1 rounded border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors"
                aria-label="Close audit"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
              <div className="p-4 rounded-lg border border-slate-800 bg-[#080d16] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Account Hardening Score</span>
                  <span className="text-base font-bold text-[#00e575] font-mono">{selectedAccount.securityScore}%</span>
                </div>
                <PixelStatusBar value={selectedAccount.securityScore} variant="phosphor" showPercentage={false} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-lg border border-slate-800 bg-[#080d16] space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Service Provider</span>
                  <span className="text-[#00e5ff] font-semibold text-xs font-mono">{selectedAccount.service}</span>
                </div>
                <div className="p-3.5 rounded-lg border border-slate-800 bg-[#080d16] space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">MFA Configuration</span>
                  <span className="text-[#00e575] font-semibold text-xs font-mono">{selectedAccount.mfaStatus}</span>
                </div>
              </div>

              {/* Recent Logins */}
              {selectedAccount.recentLogins && selectedAccount.recentLogins.length > 0 && (
                <div className="p-4 rounded-lg border border-slate-800 bg-[#080d16] space-y-3">
                  <span className="text-[11px] text-[#00e575] font-semibold uppercase tracking-wider block">
                    Recent Authentication Telemetry
                  </span>
                  <div className="space-y-2">
                    {selectedAccount.recentLogins.map((login, idx) => (
                      <div key={idx} className="p-2.5 rounded bg-[#04070d] border border-slate-800 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-slate-200 font-semibold">{login.location}</span>
                          <span className="text-[11px] text-slate-400 block font-mono">{login.ip} • {login.timestamp}</span>
                        </div>
                        <PixelBadge variant={login.status === "ALLOWED" ? "phosphor" : "warning"} size="sm">
                          {login.status === "ALLOWED" ? "Allowed" : login.status}
                        </PixelBadge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-4 rounded-lg border border-[#00e575]/30 bg-[#00e575]/5 space-y-1 text-xs">
                <span className="font-semibold text-[#00e575] block">
                  Identity Audit Verdict
                </span>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  Attestation key validated. No exposed passwords or sessions found in breach indices.
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-[#080d16] flex items-center justify-between">
              <PixelBadge variant="phosphor" size="sm">
                Status: {selectedAccount.status}
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
