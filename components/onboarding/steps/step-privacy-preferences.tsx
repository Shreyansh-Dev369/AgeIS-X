"use client"

import React from "react"
import { Lock, EyeOff, Shield, Radio, ArrowRight, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import { PixelBadge } from "@/components/ui/pixel-badge"
import { ConsentPreferences } from "@/types/auth"

interface StepPrivacyPreferencesProps {
  preferences: ConsentPreferences
  onChange: (prefs: Partial<ConsentPreferences>) => void
  onNext: () => void
  onBack: () => void
}

export function StepPrivacyPreferences({
  preferences,
  onChange,
  onNext,
  onBack,
}: StepPrivacyPreferencesProps) {
  return (
    <div className="space-y-6 font-mono select-none">
      {/* Step Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <PixelBadge variant="phosphor" size="sm" dot>
            DATA_SOVEREIGNTY // PRIVACY_RULES
          </PixelBadge>
          <span className="text-[11px] text-[#7e8b9b]">ZERO-KNOWLEDGE BOUNDS</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#f8fafc] uppercase font-sans">
          Zero-Knowledge Privacy & Telemetry Bounds
        </h2>
        <p className="text-xs text-[#7e8b9b] leading-relaxed max-w-xl">
          AgeIS-X is built on strict data sovereignty. You control exactly what cryptographic signals leave your machine.
        </p>
      </div>

      <div className="space-y-3">
        {/* Local Processing Only */}
        <div className="p-4 border border-white/10 bg-[#040608] flex items-start justify-between gap-4">
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#00ff66]" />
              <p className="font-bold uppercase tracking-wide text-[#f8fafc]">
                LOCAL-ONLY AI INFERENCE
              </p>
              <PixelBadge variant="phosphor" size="sm">STRICT</PixelBadge>
            </div>
            <p className="text-[11px] text-[#7e8b9b] leading-relaxed">
              Process all URL tokenization and file heuristics locally on this device. When enabled, zero payload data is transmitted to cloud models.
            </p>
          </div>
          <Toggle
            checked={preferences.localProcessingOnly}
            onCheckedChange={(checked) => onChange({ localProcessingOnly: checked })}
            aria-label="Toggle local processing only"
          />
        </div>

        {/* Anonymous Threat Hash Sharing */}
        <div className="p-4 border border-white/10 bg-[#040608] flex items-start justify-between gap-4">
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-[#00f0ff]" />
              <p className="font-bold uppercase tracking-wide text-[#f8fafc]">
                ANONYMOUS THREAT-HASH SHARING
              </p>
              <PixelBadge variant="cyan" size="sm">CONSENSUS</PixelBadge>
            </div>
            <p className="text-[11px] text-[#7e8b9b] leading-relaxed">
              Contribute one-way SHA-256 hashes of detected zero-day malware to the global consensus network. Never includes URLs, names, or file contents.
            </p>
          </div>
          <Toggle
            checked={preferences.anonymousThreatHashSharing}
            onCheckedChange={(checked) => onChange({ anonymousThreatHashSharing: checked })}
            aria-label="Toggle anonymous threat hash sharing"
          />
        </div>

        {/* Autonomous Quarantine Prompt */}
        <div className="p-4 border border-white/10 bg-[#040608] flex items-start justify-between gap-4">
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#ffb800]" />
              <p className="font-bold uppercase tracking-wide text-[#f8fafc]">
                AUTONOMOUS QUARANTINE CONFIRMATION
              </p>
              <PixelBadge variant="warning" size="sm">PROMPT</PixelBadge>
            </div>
            <p className="text-[11px] text-[#7e8b9b] leading-relaxed">
              Prompt for confirmation before automatically isolating low-confidence threats into the local encrypted vault.
            </p>
          </div>
          <Toggle
            checked={preferences.automaticQuarantinePrompt}
            onCheckedChange={(checked) => onChange({ automaticQuarantinePrompt: checked })}
            aria-label="Toggle quarantine prompt"
          />
        </div>

        {/* Optional Crash Telemetry */}
        <div className="p-4 border border-white/10 bg-[#040608] flex items-start justify-between gap-4">
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#7e8b9b]" />
              <p className="font-bold uppercase tracking-wide text-[#f8fafc]">
                OPTIONAL CLIENT CRASH TELEMETRY
              </p>
              <PixelBadge variant="neutral" size="sm">OPTIONAL</PixelBadge>
            </div>
            <p className="text-[11px] text-[#7e8b9b] leading-relaxed">
              Send sanitized stack traces if a background daemon encounters an unhandled exception.
            </p>
          </div>
          <Toggle
            checked={preferences.optionalCrashTelemetry}
            onCheckedChange={(checked) => onChange({ optionalCrashTelemetry: checked })}
            aria-label="Toggle crash telemetry"
          />
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
          className="h-9 px-5 text-xs font-mono uppercase tracking-wider font-bold"
        >
          <span>[ SAVE RULES & CONTINUE ]</span>
          <ArrowRight className="w-3.5 h-3.5 ml-2" />
        </Button>
      </div>
    </div>
  )
}
