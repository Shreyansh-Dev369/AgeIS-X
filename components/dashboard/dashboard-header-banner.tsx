"use client"

import React, { useState } from "react"
import { useAuth } from "@/lib/auth/auth-context"
import { ShieldCheck, RefreshCw, Terminal, Cpu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PixelBadge } from "@/components/ui/pixel-badge"
import { TacticalFrame } from "@/components/ui/tactical-frame"

interface DashboardHeaderBannerProps {
  onSync?: () => void
  isSyncing?: boolean
  lastSyncTime?: string
}

export function DashboardHeaderBanner({
  onSync,
  isSyncing = false,
  lastSyncTime = "Just now",
}: DashboardHeaderBannerProps) {
  const { user, onboardingProgress } = useAuth()
  const [syncedRecently, setSyncedRecently] = useState(false)

  const handleSyncClick = () => {
    if (onSync) onSync()
    setSyncedRecently(true)
    setTimeout(() => setSyncedRecently(false), 3000)
  }

  const primaryNode = (onboardingProgress?.selectedPlatform || "macOS").toUpperCase()

  return (
    <TacticalFrame
      variant="panel"
      reticles={true}
      reticleColor="phosphor"
      className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-white/15 bg-[#080c10] select-none font-mono"
    >
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[#00ff66] font-bold text-xs tracking-wider">
            AGEIS-X://SECURITY_COMMAND
          </span>
          <span className="text-white/20">•</span>
          <PixelBadge variant="phosphor" size="sm" dot>
            ONLINE
          </PixelBadge>
          <span className="text-white/20">•</span>
          <span className="text-[11px] text-[#00f0ff]">
            NODE: {primaryNode}
          </span>
          <span className="text-white/20">•</span>
          <span className="text-[10px] text-white/50 border border-white/10 px-1.5 py-0.2">
            LOCAL-FIRST INGESTION
          </span>
        </div>

        <h1 className="text-base sm:text-lg font-bold tracking-tight text-[#f8fafc] uppercase font-sans">
          Central Security Intelligence System
          {user?.name && <span className="text-[#7e8b9b] font-normal font-mono text-xs"> — {user.name}</span>}
        </h1>
        <p className="text-xs text-[#7e8b9b] max-w-2xl leading-relaxed">
          Autonomous zero-trust protection synchronized across network, endpoint, identity, and AI surfaces.
        </p>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <div className="text-right hidden sm:block text-[11px]">
          <span className="text-[10px] uppercase text-[#7e8b9b] block">TELEMETRY_SYNC</span>
          <span className="text-[#00ff66] font-bold">{isSyncing ? "SYNCING..." : lastSyncTime}</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleSyncClick}
          disabled={isSyncing}
          className="text-xs font-mono uppercase tracking-wider h-9 px-3 border-white/15 bg-[#040608] hover:border-[#00ff66]/50"
        >
          <RefreshCw className={`w-3 h-3 text-[#00ff66] mr-1.5 ${isSyncing ? "animate-spin" : ""}`} />
          <span>{isSyncing ? "SYNCHRONIZING..." : syncedRecently ? "SYNCHRONIZED" : "SYNC TELEMETRY"}</span>
        </Button>
      </div>
    </TacticalFrame>
  )
}
