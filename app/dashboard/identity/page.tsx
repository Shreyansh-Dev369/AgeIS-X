"use client"

import React, { useState, useEffect } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { DataTable, Column } from "@/components/ui/data-table"
import { PixelBadge } from "@/components/ui/pixel-badge"
import { TacticalFrame } from "@/components/ui/tactical-frame"
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
  ArrowRight,
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
      header: "IDENTITY IDENTIFIER",
      cell: (item) => (
        <button
          onClick={() => handleAccountClick(item)}
          className="text-left group focus:outline-none"
        >
          <span className="font-bold text-[#f8fafc] block text-xs group-hover:text-[#00ff66] transition-colors">
            {item.identifier}
          </span>
          <span className="text-[10px] font-mono text-[#7e8b9b]">{item.service}</span>
        </button>
      ),
    },
    {
      header: "MFA ENFORCEMENT",
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
      header: "TAKEOVER RISK",
      cell: (item) => (
        <span className="font-bold text-xs text-[#00ff66]">
          {item.takeoverRisk.toUpperCase()}
        </span>
      ),
    },
    {
      header: "BREACH EXPOSURES",
      cell: (item) => (
        <span className="text-xs font-mono text-[#00ff66]">
          {item.breachExposureCount} LEAKS
        </span>
      ),
    },
    {
      header: "POSTURE SCORE",
      cell: (item) => (
        <span className="font-bold text-xs text-[#00f0ff]">
          {item.securityScore}%
        </span>
      ),
    },
    {
      header: "STATUS",
      cell: (item) => (
        <PixelBadge variant={item.status === "SECURE" ? "phosphor" : "warning"} size="sm">
          {item.status}
        </PixelBadge>
      ),
    },
    {
      header: "ACTION",
      cell: (item) => (
        <button
          onClick={() => handleAccountClick(item)}
          className="text-[10px] font-mono text-[#00ff66] hover:underline uppercase font-bold"
        >
          [ AUDIT ]
        </button>
      ),
    },
  ]

  return (
    <AppShell
      title="Identity & Credential Defense Center"
      breadcrumbs={[{ label: "Overview", href: "/dashboard" }, { label: "Identity Defense" }]}
    >
      <div className="space-y-6 font-mono select-none">
        {/* Identity Header */}
        <TacticalFrame
          variant="panel"
          reticles={true}
          reticleColor="phosphor"
          className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-white/15 bg-[#080c10]"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <PixelBadge variant="phosphor" size="sm" dot>
                ZERO-KNOWLEDGE IDENTITY CLOAK
              </PixelBadge>
              <span className="text-[11px] text-[#00f0ff]">
                [{accounts.length} ACCOUNTS MONITORED]
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider text-[#f8fafc] font-sans">
              Identity Protection & Credential Hardening
            </h2>
            <p className="text-xs text-[#7e8b9b] max-w-2xl leading-relaxed">
              Monitors memory hooks attempting to scrape session cookies or API keys, with simulated darknet leak feeds.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#040608] border border-white/10 text-center">
              <span className="text-[9px] uppercase text-[#7e8b9b] block">BREACH LEAKS</span>
              <span className="text-sm font-bold text-[#00ff66]">0 DETECTED</span>
            </div>
            <div className="p-3 bg-[#040608] border border-white/10 text-center">
              <span className="text-[9px] uppercase text-[#7e8b9b] block">PASSKEYS ENFORCED</span>
              <span className="text-sm font-bold text-[#00f0ff]">3 OF 4</span>
            </div>
          </div>
        </TacticalFrame>

        {/* 3 Identity Surface Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <TacticalFrame variant="default" className="p-4 bg-[#080c10] border-white/10 space-y-1">
            <span className="text-[10px] text-[#7e8b9b] uppercase block">PROTECTED KEYRINGS</span>
            <p className="text-sm font-bold text-[#f8fafc]">macOS Keychain / libsecret</p>
            <p className="text-[10px] text-[#7e8b9b]">Hardware enclave locked against scrapers</p>
          </TacticalFrame>

          <TacticalFrame variant="default" className="p-4 bg-[#080c10] border-white/10 space-y-1">
            <span className="text-[10px] text-[#7e8b9b] uppercase block">MONITORED EMAIL ALIASES</span>
            <p className="text-sm font-bold text-[#00f0ff]">18 Enrolled Aliases</p>
            <p className="text-[10px] text-[#7e8b9b]">Zero-knowledge hash comparison</p>
          </TacticalFrame>

          <TacticalFrame variant="default" className="p-4 bg-[#080c10] border-white/10 space-y-1">
            <span className="text-[10px] text-[#7e8b9b] uppercase block">FEED POSTURE</span>
            <p className="text-sm font-bold text-[#00ff66]">0 Compromises Found</p>
            <p className="text-[10px] text-white/40">SIMULATED / DEMO ATTRIBUTES LABELED</p>
          </TacticalFrame>
        </div>

        {/* Identity Table */}
        <TacticalFrame variant="panel" className="p-4 border-white/15 bg-[#080c10]">
          <DataTable
            data={accounts}
            columns={columns}
            keyExtractor={(item) => item.id}
          />
        </TacticalFrame>
      </div>

      {/* Account Detail Drawer */}
      {selectedAccount && (
        <Drawer open={drawerOpen} onOpenChange={(open) => !open && setDrawerOpen(false)}>
          <DrawerContent
            side="right"
            className="w-full sm:max-w-xl bg-[#040608] border-l border-white/15 p-0 text-[#f8fafc] flex flex-col h-full font-mono select-none"
          >
            <div className="p-4 sm:p-5 border-b border-white/10 bg-[#080c10] flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <PixelBadge variant="phosphor" size="sm" dot>
                    IDENTITY // {selectedAccount.id.toUpperCase()}
                  </PixelBadge>
                  <PixelBadge variant="cyan" size="sm">
                    {selectedAccount.capability}
                  </PixelBadge>
                </div>
                <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-[#f8fafc] pt-1">
                  {selectedAccount.identifier}
                </h2>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1 border border-white/10 hover:border-white/30 text-[#7e8b9b] hover:text-white transition-colors"
                aria-label="Close audit"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs">
              <TacticalFrame variant="default" className="p-3.5 border-white/10 bg-[#080c10] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#7e8b9b] uppercase">ACCOUNT HARDENING SCORE</span>
                  <span className="text-base font-bold text-[#00ff66]">{selectedAccount.securityScore}%</span>
                </div>
                <PixelStatusBar value={selectedAccount.securityScore} variant="phosphor" showPercentage={false} />
              </TacticalFrame>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 border border-white/10 bg-[#080c10] space-y-1">
                  <span className="text-[10px] text-[#7e8b9b] uppercase block">PROVIDER / SERVICE</span>
                  <span className="text-[#00f0ff] font-bold text-xs">{selectedAccount.service}</span>
                </div>
                <div className="p-3 border border-white/10 bg-[#080c10] space-y-1">
                  <span className="text-[10px] text-[#7e8b9b] uppercase block">MFA CONFIGURATION</span>
                  <span className="text-[#00ff66] font-bold text-xs">{selectedAccount.mfaStatus}</span>
                </div>
              </div>

              {/* Recent Logins */}
              {selectedAccount.recentLogins && selectedAccount.recentLogins.length > 0 && (
                <div className="p-3.5 border border-white/10 bg-[#080c10] space-y-2">
                  <span className="text-[10px] text-[#00ff66] font-bold uppercase block">
                    RECENT AUTHENTICATION TELEMETRY
                  </span>
                  <div className="space-y-1.5">
                    {selectedAccount.recentLogins.map((login, idx) => (
                      <div key={idx} className="p-2 bg-[#040608] border border-white/5 flex items-center justify-between text-[11px]">
                        <div>
                          <span className="text-[#f8fafc] font-bold">{login.location}</span>
                          <span className="text-[10px] text-[#7e8b9b] block">{login.ip} • {login.timestamp}</span>
                        </div>
                        <PixelBadge variant={login.status === "ALLOWED" ? "phosphor" : "warning"} size="sm">
                          {login.status}
                        </PixelBadge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Action */}
              <div className="p-3.5 border border-[#00ff66]/30 bg-[#00ff66]/5 space-y-1 text-[11px]">
                <span className="font-bold text-[#00ff66] uppercase block">
                  RECOMMENDED IDENTITY HARDENING
                </span>
                <p className="text-[#f8fafc]/90 leading-relaxed">
                  Attestation key validated. No exposed passwords found in credential database indices.
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-white/10 bg-[#080c10] flex items-center justify-between">
              <PixelBadge variant="phosphor" size="sm">
                STATUS: {selectedAccount.status}
              </PixelBadge>
              <Button
                size="sm"
                onClick={() => setDrawerOpen(false)}
                className="text-xs font-mono uppercase tracking-wider font-bold h-8 px-4"
              >
                [ CLOSE AUDIT ]
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </AppShell>
  )
}
