"use client"

import React, { useState } from "react"
import { useAuth } from "@/lib/auth/auth-context"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TechnicalLabel, SignalMarker } from "@/components/design-system/editorial-primitives"
import { SecuritySticker } from "@/components/design-system/pixel-art-system"

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

  const primaryNode = onboardingProgress?.selectedPlatform || "macOS"

  return (
    <div className="p-5 border border-white/10 bg-[#080808] flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-3 text-[11px]">
          <SignalMarker status="active" label="ENVIRONMENT ENCLAVE ACTIVE" />
          <span className="text-white/20">|</span>
          <span className="text-[#A6A6A0]">
            HOST NODE: <strong className="text-[#F1F0EB]">{primaryNode.toUpperCase()}</strong>
          </span>
          <span className="text-white/20">|</span>
          <span className="text-[#39FF14]">
            INFERENCE: 100% LOCAL
          </span>
        </div>

        <h1 className="font-mono text-lg sm:text-xl font-bold tracking-tight text-[#F1F0EB] uppercase">
          OPERATIONAL SECURITY RUNTIME
          {user?.name && <span className="text-[#A6A6A0] font-normal text-xs"> // {user.name}</span>}
        </h1>
        <p className="text-xs text-[#A6A6A0] max-w-2xl leading-relaxed font-sans font-normal">
          Autonomous zero-trust protection actively shielding socket ingress, communications, identity enclaves, and endpoints.
        </p>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <div className="text-right hidden sm:block text-[11px] font-mono">
          <span className="text-[#6F706D] block">TELEMETRY SYNC</span>
          <span className="text-[#39FF14]">{isSyncing ? "SYNCING..." : lastSyncTime}</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleSyncClick}
          disabled={isSyncing}
          className="text-xs font-mono rounded-none h-10 px-4 border-white/20 bg-transparent hover:bg-white/5 text-[#F1F0EB]"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#39FF14] mr-2 ${isSyncing ? "animate-spin" : ""}`} />
          <span>{isSyncing ? "SYNCING..." : syncedRecently ? "SYNCED" : "SYNC TELEMETRY"}</span>
        </Button>
      </div>
    </div>
  )
}
