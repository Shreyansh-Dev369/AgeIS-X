"use client"

import React, { useState } from "react"
import { ShieldCheck, ArrowRight, Laptop, Lock, Shield, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PixelBadge } from "@/components/ui/pixel-badge"
import { TacticalFrame } from "@/components/ui/tactical-frame"
import { OnboardingProgress } from "@/types/auth"

interface StepCompletionProps {
  progress: OnboardingProgress
  onComplete: () => Promise<void>
  isSubmitting?: boolean
}

export function StepCompletion({ progress, onComplete, isSubmitting = false }: StepCompletionProps) {
  const [loading, setLoading] = useState(false)

  const handleLaunch = async () => {
    setLoading(true)
    await onComplete()
  }

  const platformName = (progress.selectedPlatform || "macos").toUpperCase()
  const mfaName =
    progress.securityPreferences.mfaMethod === "passkey"
      ? "FIDO2 PASSKEY / BIOMETRICS"
      : progress.securityPreferences.mfaMethod === "authenticator"
      ? "TOTP AUTHENTICATOR APP"
      : "SMS OTP"

  return (
    <div className="space-y-6 font-mono select-none">
      {/* Center Congratulations Banner */}
      <div className="text-center space-y-3 max-w-lg mx-auto">
        <div className="w-14 h-14 border border-[#00ff66]/40 bg-[#00ff66]/10 text-[#00ff66] mx-auto flex items-center justify-center shadow-[0_0_20px_rgba(0,255,102,0.2)]">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <div className="flex items-center justify-center gap-2">
          <PixelBadge variant="phosphor" size="sm" dot>
            STATUS: INITIALIZED
          </PixelBadge>
          <span className="text-[11px] text-[#00f0ff]">[PROVISIONING COMPLETE]</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-[#f8fafc] uppercase font-sans">
          Your AgeIS-X Security Workspace is Ready
        </h2>
        <p className="text-xs text-[#7e8b9b] leading-relaxed">
          Your central security identity is now fully provisioned. 10 protection domains stand guard across your primary {platformName} node and connected endpoints.
        </p>
      </div>

      {/* Summary Recap Card */}
      <TacticalFrame variant="default" className="p-4 border-white/15 bg-[#040608] divide-y divide-white/10 text-xs">
        <div className="py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#7e8b9b]">
            <Laptop className="w-4 h-4 text-[#00ff66]" />
            <span className="uppercase">PRIMARY PROTECTION NODE:</span>
          </div>
          <span className="font-bold text-[#f8fafc]">{platformName} DEDICATED NODE</span>
        </div>

        <div className="py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#7e8b9b]">
            <Lock className="w-4 h-4 text-[#00f0ff]" />
            <span className="uppercase">MFA & CREDENTIAL HARDENING:</span>
          </div>
          <span className="font-bold text-[#00ff66]">{mfaName}</span>
        </div>

        <div className="py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#7e8b9b]">
            <Shield className="w-4 h-4 text-[#ffb800]" />
            <span className="uppercase">ZERO-KNOWLEDGE TELEMETRY:</span>
          </div>
          <span className="font-bold text-[#f8fafc]">
            {progress.consentPreferences.localProcessingOnly ? "LOCAL-ONLY HEURISTICS (STRICT)" : "HYBRID EDGE"}
          </span>
        </div>

        <div className="py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#7e8b9b]">
            <ShieldCheck className="w-4 h-4 text-[#00ff66]" />
            <span className="uppercase">SECURITY BASELINE READINESS:</span>
          </div>
          <span className="font-bold text-[#00ff66]">
            {progress.baselineReadiness?.overallReadiness || 94}% [OPTIMAL READY]
          </span>
        </div>
      </TacticalFrame>

      {/* Enter Dashboard CTA */}
      <div className="pt-2 space-y-2">
        <Button
          onClick={handleLaunch}
          disabled={loading || isSubmitting}
          className="w-full h-11 text-xs font-mono uppercase tracking-wider font-bold shadow-[0_0_20px_rgba(0,255,102,0.25)]"
        >
          {loading || isSubmitting ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin text-[#040608]" />
              <span>INITIALIZING DASHBOARD SESSION...</span>
            </>
          ) : (
            <>
              <span>[ LAUNCH SECURITY DASHBOARD ]</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
        <p className="text-center text-[10px] text-[#7e8b9b] font-mono">
          // You can modify node rules, active sessions, and threat telemetry anytime in Settings.
        </p>
      </div>
    </div>
  )
}
