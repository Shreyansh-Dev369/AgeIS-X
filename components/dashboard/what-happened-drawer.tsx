"use client"

import React from "react"
import { Drawer, DrawerContent } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { PixelBadge } from "@/components/ui/pixel-badge"
import { TacticalFrame } from "@/components/ui/tactical-frame"
import { ActivityFeedItem, SecurityIncident, DetailedEventExplanation } from "@/types/security"
import {
  X,
  Clock,
  MapPin,
  HelpCircle,
  ShieldCheck,
  Info,
  Zap,
} from "lucide-react"

interface WhatHappenedDrawerProps {
  isOpen: boolean
  onClose: () => void
  item: ActivityFeedItem | SecurityIncident | any | null
}

export function WhatHappenedDrawer({ isOpen, onClose, item }: WhatHappenedDrawerProps) {
  if (!item) return null

  const exp: DetailedEventExplanation = item.explanation || {
    whatHappened: "description" in item ? item.description : item.title || "Detected security anomaly.",
    when: "timestamp" in item ? item.timestamp : item.detectedAt || "Recent",
    where: "entity" in item && item.entity ? item.entity : "target" in item ? item.target : "source" in item ? item.source : "Local Workstation",
    why: "Matched security heuristic signatures.",
    whatAgeISXDid: "actionTaken" in item && item.actionTaken ? item.actionTaken : "Contained and isolated threat.",
    whatMayBeAffected: "Affected target is isolated. Host memory intact.",
    whatShouldIDo: "remediation" in item && item.remediation ? item.remediation : "Review event logs and confirm status.",
    currentStatus: item.status || "PROTECTED",
  }

  const isCritical = item.severity === "critical"
  const isHigh = item.severity === "high"

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent
        side="right"
        className="w-full sm:max-w-xl bg-[#040608] border-l border-white/15 p-0 text-[#f8fafc] flex flex-col h-full font-mono select-none"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-[#080c10] flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <PixelBadge variant="phosphor" size="sm" dot>
                EXPLAINABILITY // {item.id || "EVENT"}
              </PixelBadge>
              <PixelBadge variant={isCritical ? "danger" : isHigh ? "warning" : "cyan"} size="sm">
                {(item.severity || "INFO").toUpperCase()}
              </PixelBadge>
            </div>
            <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-[#f8fafc] pt-1">
              {item.title || item.threatType}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 border border-white/10 hover:border-white/30 text-[#7e8b9b] hover:text-white transition-colors"
            aria-label="Close explainability dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Explainability Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs">
          {/* 1. What Happened? */}
          <TacticalFrame variant="default" className="p-3.5 border-white/10 bg-[#080c10] space-y-1">
            <div className="flex items-center gap-2 text-[#00ff66] font-bold uppercase text-[11px]">
              <Info className="w-3.5 h-3.5" />
              <span>WHAT HAPPENED</span>
            </div>
            <p className="text-[#f8fafc]/90 leading-relaxed text-[11px] pt-1">{exp.whatHappened}</p>
          </TacticalFrame>

          {/* 2. When & Where */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 border border-white/10 bg-[#080c10] space-y-1">
              <div className="flex items-center gap-1.5 text-[#7e8b9b] text-[10px] uppercase">
                <Clock className="w-3 h-3 text-[#00f0ff]" />
                <span>TIMESTAMP (WHEN)</span>
              </div>
              <p className="font-bold text-[#f8fafc] text-[11px]">{exp.when}</p>
            </div>

            <div className="p-3 border border-white/10 bg-[#080c10] space-y-1">
              <div className="flex items-center gap-1.5 text-[#7e8b9b] text-[10px] uppercase">
                <MapPin className="w-3 h-3 text-[#00f0ff]" />
                <span>ORIGIN / ASSET (WHERE)</span>
              </div>
              <p className="font-bold text-[#f8fafc] text-[11px] truncate">{exp.where}</p>
            </div>
          </div>

          {/* 3. Why AgeIS-X flagged it (Detection Signals) */}
          <TacticalFrame variant="default" className="p-3.5 border-white/10 bg-[#080c10] space-y-2">
            <div className="flex items-center gap-2 text-[#00f0ff] font-bold uppercase text-[11px]">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>WHY AGEIS-X FLAGGED IT (SIGNALS)</span>
            </div>
            <p className="text-[#7e8b9b] text-[11px] leading-relaxed">{exp.why}</p>

            {exp.signals && exp.signals.length > 0 && (
              <div className="space-y-1.5 pt-1.5 border-t border-white/10">
                {exp.signals.map((sig, idx) => (
                  <div key={sig.id || idx} className="p-2 bg-[#040608] border border-white/5 space-y-0.5">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-[#00ff66]">
                        SIGNAL 0{idx + 1} :: {sig.name}
                      </span>
                      <span className="text-[#00f0ff] font-mono">
                        {Math.round(sig.confidence * 100)}% CONF
                      </span>
                    </div>
                    <p className="text-[10px] text-[#7e8b9b]">{sig.description}</p>
                  </div>
                ))}
              </div>
            )}
          </TacticalFrame>

          {/* 4. What AgeIS-X did */}
          <div className="p-3.5 border border-[#00ff66]/30 bg-[#00ff66]/5 space-y-1">
            <div className="flex items-center gap-2 text-[#00ff66] font-bold uppercase text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>WHAT AGEIS-X DID (MITIGATION)</span>
            </div>
            <p className="text-[#f8fafc]/90 leading-relaxed text-[11px] pt-0.5">{exp.whatAgeISXDid}</p>
          </div>

          {/* 5. What May Be Affected & What Should I Do? */}
          <TacticalFrame variant="default" className="p-3.5 border-white/10 bg-[#080c10] space-y-2">
            <div className="space-y-1">
              <span className="text-[10px] uppercase text-[#7e8b9b] block">WHAT MAY BE AFFECTED</span>
              <p className="text-[#f8fafc] text-[11px]">{exp.whatMayBeAffected}</p>
            </div>
            <div className="pt-2 border-t border-white/10 space-y-1">
              <span className="text-[10px] uppercase text-[#00f0ff] font-bold block flex items-center gap-1">
                <Zap className="w-3 h-3 text-[#00ff66]" />
                <span>RECOMMENDED OPERATOR ACTION</span>
              </span>
              <p className="text-[#f8fafc] text-[11px] font-bold">{exp.whatShouldIDo}</p>
            </div>
          </TacticalFrame>

          {/* 6. Cryptographic IoC Signature (if present) */}
          {exp.iocSignature && (
            <div className="p-3 bg-[#040608] border border-white/10 space-y-1">
              <span className="text-[10px] text-[#7e8b9b] uppercase block">IOC_SIGNATURE_HASH</span>
              <code className="text-[10px] text-[#00ff66] break-all select-all block">
                {exp.iocSignature}
              </code>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-white/10 bg-[#080c10] flex items-center justify-between">
          <PixelBadge variant="phosphor" size="sm">
            STATUS: {item.status || "MONITORED"}
          </PixelBadge>
          <Button
            size="sm"
            onClick={onClose}
            className="text-xs font-mono uppercase tracking-wider font-bold h-8 px-4"
          >
            [ ACKNOWLEDGE & CLOSE ]
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
