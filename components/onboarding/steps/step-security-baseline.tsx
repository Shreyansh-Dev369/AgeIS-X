"use client"

import React, { useState, useEffect } from "react"
import { ShieldCheck, CheckCircle2, ArrowRight, ArrowLeft, RefreshCw, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PixelBadge } from "@/components/ui/pixel-badge"
import { PixelStatusBar } from "@/components/ui/pixel-status-bar"
import { TacticalFrame } from "@/components/ui/tactical-frame"
import { BaselineReadiness } from "@/types/auth"

interface StepSecurityBaselineProps {
  baseline: BaselineReadiness
  onNext: () => void
  onBack: () => void
}

export function StepSecurityBaseline({ baseline, onNext, onBack }: StepSecurityBaselineProps) {
  const [isCalculating, setIsCalculating] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCalculating(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-6 font-mono select-none">
      {/* Step Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <PixelBadge variant="phosphor" size="sm" dot>
            ASSESSMENT // POSTURE_BASELINE
          </PixelBadge>
          <span className="text-[11px] text-[#7e8b9b]">ZERO-TRUST EVALUATION</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#f8fafc] uppercase font-sans">
          Initial Security Baseline Assessment
        </h2>
        <p className="text-xs text-[#7e8b9b] leading-relaxed max-w-xl">
          AgeIS-X computes a zero-trust posture readiness rating based on your configured identity, node, and privacy parameters.
        </p>
      </div>

      {/* Main Score Banner */}
      <TacticalFrame
        variant="highlight"
        className="p-5 flex flex-col sm:flex-row items-center justify-between gap-6 border-[#00ff66]/40 bg-[#080c10]"
      >
        <div className="space-y-2 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <PixelBadge variant="phosphor" size="sm">
              STATUS: {baseline.status}
            </PixelBadge>
            <span className="text-[11px] text-[#00f0ff]">[OPTIMAL THRESHOLD]</span>
          </div>
          <h3 className="text-lg font-bold text-[#f8fafc] uppercase">
            {isCalculating ? "Evaluating Security Baseline..." : "Baseline Architecture Verified"}
          </h3>
          <p className="text-xs text-[#7e8b9b] max-w-md leading-relaxed">
            Your configuration meets global standards for zero-trust identity isolation and local-first payload inspection.
          </p>
        </div>

        <div className="shrink-0 flex flex-col items-center justify-center p-4 bg-[#040608] border border-white/10 min-w-[150px]">
          <span className="text-[10px] uppercase text-[#7e8b9b]">READINESS_INDEX</span>
          <div className="text-3xl font-black text-[#00ff66] tracking-tight my-1">
            {isCalculating ? (
              <RefreshCw className="w-7 h-7 animate-spin text-[#00ff66] mx-auto my-1" />
            ) : (
              `${baseline.overallReadiness}%`
            )}
          </div>
          <PixelBadge variant="phosphor" size="sm">OPTIMAL READY</PixelBadge>
        </div>
      </TacticalFrame>

      {/* Domain Vector Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-3.5 border border-white/10 bg-[#040608] space-y-2">
          <PixelStatusBar
            value={baseline.accountScore}
            label="ACCOUNT & IDENTITY ISOLATION"
            variant="phosphor"
          />
          <p className="text-[10px] text-[#7e8b9b]">Verified master email & cryptographic session storage.</p>
        </div>

        <div className="p-3.5 border border-white/10 bg-[#040608] space-y-2">
          <PixelStatusBar
            value={baseline.authScore}
            label="AUTHENTICATION & SECOND FACTOR"
            variant="cyan"
          />
          <p className="text-[10px] text-[#7e8b9b]">Phishing-resistant passkey/MFA configuration active.</p>
        </div>

        <div className="p-3.5 border border-white/10 bg-[#040608] space-y-2">
          <PixelStatusBar
            value={baseline.deviceScore}
            label="DEVICE TELEMETRY & NODE HEALTH"
            variant="phosphor"
          />
          <p className="text-[10px] text-[#7e8b9b]">User-space daemon socket filtering & quarantine readiness.</p>
        </div>

        <div className="p-3.5 border border-white/10 bg-[#040608] space-y-2">
          <PixelStatusBar
            value={baseline.privacyScore}
            label="ZERO-KNOWLEDGE SOVEREIGNTY"
            variant="cyan"
          />
          <p className="text-[10px] text-[#7e8b9b]">Local-only ML heuristics & anonymous threat hash sharing.</p>
        </div>
      </div>

      {/* Health Checks Checklist */}
      <div className="p-4 border border-white/10 bg-[#040608] space-y-2.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#f8fafc]">
          BASELINE HEALTH CHECKS ATTESTATION
        </h4>
        <div className="space-y-1.5 text-xs text-[#7e8b9b]">
          {baseline.recommendations.map((rec, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-[#00ff66] font-bold">[✓]</span>
              <span className="text-[#f8fafc]">{rec}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <Button
          variant="outline"
          onClick={onBack}
          className="text-xs font-mono uppercase tracking-wider h-9 px-4 border-white/20"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
          <span>[ BACK ]</span>
        </Button>
        <Button
          onClick={onNext}
          disabled={isCalculating}
          className="h-9 px-5 text-xs font-mono uppercase tracking-wider font-bold"
        >
          <span>[ FINALIZE WORKSPACE ]</span>
          <ArrowRight className="w-3.5 h-3.5 ml-2" />
        </Button>
      </div>
    </div>
  )
}
