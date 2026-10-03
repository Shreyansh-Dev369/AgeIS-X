"use client"

import React from "react"
import { Shield, BrainCircuit, Lock, Network, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PixelBadge } from "@/components/ui/pixel-badge"
import { TacticalFrame } from "@/components/ui/tactical-frame"

interface StepWelcomeProps {
  onNext: () => void
  userEmail?: string
}

export function StepWelcome({ onNext, userEmail }: StepWelcomeProps) {
  return (
    <div className="space-y-6 font-mono select-none">
      {/* Step Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <PixelBadge variant="phosphor" size="sm" dot>
            SYS_INIT // PROTOCOL_01
          </PixelBadge>
          <span className="text-[11px] text-[#7e8b9b]">PROVISIONING ENGINE</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#f8fafc] uppercase font-sans">
          Welcome to AgeIS-X Global Security
        </h2>
        <p className="text-xs text-[#7e8b9b] leading-relaxed max-w-xl font-mono">
          Establishing your central AgeIS-X security identity. One unified intelligence engine protects your digital footprint across network, endpoint, identity, and AI surfaces.
        </p>
      </div>

      {/* Authorized Operator Strip */}
      {userEmail && (
        <div className="p-3 bg-[#040608] border border-white/10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[#7e8b9b] uppercase text-[11px]">AUTHORIZED_OPERATOR:</span>
            <span className="font-bold text-[#f8fafc]">{userEmail}</span>
          </div>
          <PixelBadge variant="cyan" size="sm">
            VERIFIED
          </PixelBadge>
        </div>
      )}

      {/* 3 Tactical Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        <TacticalFrame variant="default" className="p-4 space-y-2 border-white/10 bg-[#040608]">
          <div className="w-8 h-8 border border-[#00ff66]/30 bg-[#00ff66]/10 text-[#00ff66] flex items-center justify-center">
            <Shield className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#f8fafc]">
            UNIFIED PROTECTION
          </h3>
          <p className="text-[11px] text-[#7e8b9b] leading-relaxed">
            Eliminate security fragmentation with synchronized intelligence across all 10 defense domains.
          </p>
        </TacticalFrame>

        <TacticalFrame variant="default" className="p-4 space-y-2 border-white/10 bg-[#040608]">
          <div className="w-8 h-8 border border-[#00f0ff]/30 bg-[#00f0ff]/10 text-[#00f0ff] flex items-center justify-center">
            <BrainCircuit className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#f8fafc]">
            SUB-SECOND DEFENSE
          </h3>
          <p className="text-[11px] text-[#7e8b9b] leading-relaxed">
            Local & edge neural inference engines inspect threats before execution without socket latency.
          </p>
        </TacticalFrame>

        <TacticalFrame variant="default" className="p-4 space-y-2 border-white/10 bg-[#040608]">
          <div className="w-8 h-8 border border-[#ffb800]/30 bg-[#ffb800]/10 text-[#ffb800] flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#f8fafc]">
            ZERO-KNOWLEDGE
          </h3>
          <p className="text-[11px] text-[#7e8b9b] leading-relaxed">
            Your telemetry and credentials are encrypted on-device. Private data is never decrypted remotely.
          </p>
        </TacticalFrame>
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <div className="text-[11px] text-[#7e8b9b] flex items-center gap-1.5 font-mono">
          <Network className="w-3.5 h-3.5 text-[#00ff66]" />
          <span>ESTIMATED DURATION: ~2 MINUTES</span>
        </div>
        <Button
          onClick={onNext}
          className="h-9 px-5 text-xs font-mono uppercase tracking-wider font-bold"
        >
          <span>[ BEGIN SETUP ]</span>
          <ArrowRight className="w-3.5 h-3.5 ml-2" />
        </Button>
      </div>
    </div>
  )
}
