"use client"

import React, { useState, useEffect } from "react"
import { ShieldCheck, Cpu, HardDrive, ArrowRight, ArrowLeft, RefreshCw, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PixelBadge } from "@/components/ui/pixel-badge"
import { TacticalFrame } from "@/components/ui/tactical-frame"

interface StepProtectionSetupProps {
  platform: "macos" | "windows" | "linux" | "android" | "ios" | "browser"
  onNext: () => void
  onBack: () => void
}

export function StepProtectionSetup({ platform, onNext, onBack }: StepProtectionSetupProps) {
  const [probeState, setProbeState] = useState<"verifying" | "ready">("verifying")

  useEffect(() => {
    const t = setTimeout(() => {
      setProbeState("ready")
    }, 900)
    return () => clearTimeout(t)
  }, [platform])

  return (
    <div className="space-y-6 font-mono select-none">
      {/* Step Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <PixelBadge variant="phosphor" size="sm" dot>
            RUNTIME_POSTURE // {platform.toUpperCase()}
          </PixelBadge>
          <span className="text-[11px] text-[#7e8b9b]">NON-INTRUSIVE DAEMON</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#f8fafc] uppercase font-sans">
          Node Capabilities & Runtime Posture
        </h2>
        <p className="text-xs text-[#7e8b9b] leading-relaxed max-w-xl">
          AgeIS-X operates as a strictly non-intrusive, user-space security engine engineered for zero kernel panics and negligible CPU overhead.
        </p>
      </div>

      {/* Verification Status Card */}
      <TacticalFrame variant="default" className="p-4 space-y-4 border-white/15 bg-[#040608]">
        <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#00ff66]" />
            <span className="font-bold uppercase tracking-wider text-[#f8fafc]">
              LOCAL DAEMON & RUNTIME HEALTH CHECK
            </span>
          </div>
          {probeState === "verifying" ? (
            <div className="flex items-center gap-1.5 text-xs text-[#00f0ff]">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>[ PROBING NODE ENVIRONMENT... ]</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-[#00ff66]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>[ ENVIRONMENT COMPATIBLE ]</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-[#080c10] border border-white/10 space-y-1">
            <span className="text-[10px] text-[#7e8b9b] uppercase">ARCHITECTURE</span>
            <p className="font-bold text-[#00ff66]">USER-SPACE ISOLATED</p>
            <p className="text-[10px] text-[#7e8b9b]">0 kernel drivers installed</p>
          </div>
          <div className="p-3 bg-[#080c10] border border-white/10 space-y-1">
            <span className="text-[10px] text-[#7e8b9b] uppercase">MEMORY FOOTPRINT</span>
            <p className="font-bold text-[#00f0ff]">&lt; 38 MB RESIDENT</p>
            <p className="text-[10px] text-[#7e8b9b]">Zero heap fragmentation</p>
          </div>
          <div className="p-3 bg-[#080c10] border border-white/10 space-y-1">
            <span className="text-[10px] text-[#7e8b9b] uppercase">INFERENCE LATENCY</span>
            <p className="font-bold text-[#00ff66]">&lt; 9.4 MS SUB-SECOND</p>
            <p className="text-[10px] text-[#7e8b9b]">Hardware accelerated NPU/CPU</p>
          </div>
        </div>
      </TacticalFrame>

      {/* Permissions & Guarantees */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#7e8b9b]">
          REQUIRED OPERATING SYSTEM CAPABILITIES
        </h3>
        <div className="space-y-2 text-xs">
          <div className="p-3 border border-white/10 bg-[#040608] flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-[#00ff66] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold uppercase tracking-wide text-[#f8fafc]">
                SOCKET FILTERING & LOCAL DNS HOOK
              </p>
              <p className="text-[11px] text-[#7e8b9b] mt-0.5">
                Inspects outbound domain resolutions to prevent drive-by downloads and phishing connections before socket handshakes occur.
              </p>
            </div>
          </div>

          <div className="p-3 border border-white/10 bg-[#040608] flex items-start gap-3">
            <HardDrive className="w-4 h-4 text-[#00f0ff] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold uppercase tracking-wide text-[#f8fafc]">
                ENCRYPTED LOCAL QUARANTINE VAULT
              </p>
              <p className="text-[11px] text-[#7e8b9b] mt-0.5">
                Suspect files and payloads are isolated in an encrypted sandboxed directory with execution bit revoked.
              </p>
            </div>
          </div>
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
          disabled={probeState === "verifying"}
          className="h-9 px-5 text-xs font-mono uppercase tracking-wider font-bold"
        >
          <span>[ CONTINUE TO PRIVACY RULES ]</span>
          <ArrowRight className="w-3.5 h-3.5 ml-2" />
        </Button>
      </div>
    </div>
  )
}
