"use client"

import React from "react"
import { Drawer, DrawerContent } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
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
        className="w-full sm:max-w-xl bg-[#060a12] border-l border-white/10 p-0 text-[#f8fafc] flex flex-col h-full font-sans select-none"
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10 bg-[#080d16] flex items-start justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Event Details
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-medium ${isCritical ? "bg-rose-500/15 text-rose-400 border border-rose-500/30" : isHigh ? "bg-amber-500/15 text-amber-400 border border-amber-500/30" : "bg-sky-500/15 text-sky-400 border border-sky-500/30"}`}>
                {(item.severity || "INFO").toUpperCase()}
              </span>
            </div>
            <h2 className="text-base font-semibold text-slate-100 pt-0.5">
              {item.title || item.threatType}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Explainability Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* 1. What Happened? */}
          <div className="p-4 rounded-md border border-white/10 bg-[#080d16] space-y-1">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
              <Info className="w-4 h-4" />
              <span>What Happened</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-xs pt-1">{exp.whatHappened}</p>
          </div>

          {/* 2. When & Where */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-md border border-white/10 bg-[#080d16] space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <Clock className="w-3.5 h-3.5 text-sky-400" />
                <span>When</span>
              </div>
              <p className="font-medium text-slate-200 text-xs">{exp.when}</p>
            </div>

            <div className="p-3.5 rounded-md border border-white/10 bg-[#080d16] space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                <span>Affected Target</span>
              </div>
              <p className="font-medium text-slate-200 text-xs truncate">{exp.where}</p>
            </div>
          </div>

          {/* 3. Why AgeIS-X flagged it */}
          <div className="p-4 rounded-md border border-white/10 bg-[#080d16] space-y-2">
            <div className="flex items-center gap-2 text-sky-400 font-semibold text-xs">
              <HelpCircle className="w-4 h-4" />
              <span>Why We Flagged It</span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">{exp.why}</p>

            {exp.signals && exp.signals.length > 0 && (
              <div className="space-y-1.5 pt-2 border-t border-white/5">
                {exp.signals.map((sig, idx) => (
                  <div key={sig.id || idx} className="p-2.5 rounded bg-[#04070d] border border-white/5 space-y-0.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-emerald-400">
                        {sig.name}
                      </span>
                      <span className="text-sky-400 font-mono text-[11px]">
                        {Math.round(sig.confidence * 100)}% confidence
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{sig.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 4. What AgeIS-X did */}
          <div className="p-4 rounded-md border border-emerald-500/20 bg-emerald-500/5 space-y-1">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>Action Taken by AgeIS-X</span>
            </div>
            <p className="text-slate-200 leading-relaxed text-xs pt-0.5">{exp.whatAgeISXDid}</p>
          </div>

          {/* 5. What May Be Affected & What Should I Do? */}
          <div className="p-4 rounded-md border border-white/10 bg-[#080d16] space-y-3">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 block font-medium">Impact Assessment</span>
              <p className="text-slate-300 text-xs">{exp.whatMayBeAffected}</p>
            </div>
            <div className="pt-2 border-t border-white/5 space-y-1">
              <span className="text-xs text-emerald-400 font-semibold block flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                <span>Recommended Action</span>
              </span>
              <p className="text-slate-200 text-xs font-medium">{exp.whatShouldIDo}</p>
            </div>
          </div>

          {/* 6. Cryptographic IoC Signature (if present) */}
          {exp.iocSignature && (
            <div className="p-3.5 rounded-md bg-[#04070d] border border-white/10 space-y-1 font-mono text-[11px]">
              <span className="text-slate-400 block text-[10px]">IOC Signature Hash</span>
              <code className="text-emerald-400 break-all select-all block">
                {exp.iocSignature}
              </code>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-white/10 bg-[#080d16] flex items-center justify-between">
          <span className="text-xs font-mono text-slate-400">
            Status: <strong className="text-emerald-400">{item.status || "Mitigated"}</strong>
          </span>
          <Button
            size="sm"
            onClick={onClose}
            className="text-xs font-sans h-8 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold"
          >
            Close Details
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
