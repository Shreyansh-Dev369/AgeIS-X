"use client"

import React from "react"
import { KeyRound, ShieldCheck, Smartphone, Clock, Laptop, ArrowRight, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { PixelBadge } from "@/components/ui/pixel-badge"
import { TacticalFrame } from "@/components/ui/tactical-frame"
import { SecurityPreferences } from "@/types/auth"

interface StepAccountSecurityProps {
  preferences: SecurityPreferences
  onChange: (prefs: Partial<SecurityPreferences>) => void
  onNext: () => void
  onBack: () => void
}

const MFA_OPTIONS = [
  {
    id: "passkey" as const,
    title: "FIDO2 PASSKEY / HARDWARE KEY",
    subtitle: "Biometrics / YubiKey (Recommended)",
    desc: "Phishing-resistant authentication utilizing your device's biometric Secure Enclave or hardware token.",
    icon: KeyRound,
    recommended: true,
  },
  {
    id: "authenticator" as const,
    title: "AUTHENTICATOR APP (TOTP)",
    subtitle: "Standard 6-digit dynamic code",
    desc: "Use 1Password, Google Authenticator, or Bitwarden for time-based one-time codes.",
    icon: ShieldCheck,
    recommended: false,
  },
  {
    id: "sms" as const,
    title: "CELLULAR SMS OTP",
    subtitle: "Fallback channel",
    desc: "Standard SMS OTP verification. Note: Subject to SIM swapping and SS7 interception vulnerabilities.",
    icon: Smartphone,
    recommended: false,
  },
]

export function StepAccountSecurity({
  preferences,
  onChange,
  onNext,
  onBack,
}: StepAccountSecurityProps) {
  return (
    <div className="space-y-6 font-mono select-none">
      {/* Step Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <PixelBadge variant="phosphor" size="sm" dot>
            AUTHENTICATION // MFA_HARDENING
          </PixelBadge>
          <span className="text-[11px] text-[#7e8b9b]">CREDENTIAL DEFENSE</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#f8fafc] uppercase font-sans">
          Account Hardening & Credential Protection
        </h2>
        <p className="text-xs text-[#7e8b9b] leading-relaxed max-w-xl">
          Protect your central AgeIS-X administrative credentials with phishing-resistant second factors.
        </p>
      </div>

      {/* MFA Method Selection */}
      <div className="space-y-3">
        <label className="text-[11px] font-bold uppercase tracking-wider text-[#7e8b9b] block">
          PRIMARY MULTI-FACTOR AUTHENTICATION METHOD
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {MFA_OPTIONS.map((opt) => {
            const Icon = opt.icon
            const isSelected = preferences.mfaMethod === opt.id

            return (
              <div
                key={opt.id}
                role="button"
                tabIndex={0}
                onClick={() =>
                  onChange({
                    mfaMethod: opt.id,
                    mfaEnrolled: true,
                  })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    onChange({
                      mfaMethod: opt.id,
                      mfaEnrolled: true,
                    })
                  }
                }}
                className={`p-3.5 border text-left transition-all flex flex-col justify-between cursor-pointer focus:outline-none ${
                  isSelected
                    ? "bg-[#0b1017] border-[#00ff66] text-[#f8fafc] shadow-[0_0_12px_rgba(0,255,102,0.2)]"
                    : "bg-[#040608] border-white/10 text-[#7e8b9b] hover:border-white/30 hover:text-[#f8fafc]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`w-8 h-8 border flex items-center justify-center ${
                        isSelected
                          ? "bg-[#00ff66]/10 border-[#00ff66] text-[#00ff66]"
                          : "bg-[#080c10] border-white/10 text-[#7e8b9b]"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    {isSelected && (
                      <span className="text-[#00ff66] font-bold text-xs">[✓ ACTIVE]</span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#f8fafc]">{opt.title}</h4>
                  <span className="text-[10px] text-[#00f0ff] block mb-1.5">{opt.subtitle}</span>
                  <p className="text-[11px] text-[#7e8b9b] leading-tight">{opt.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Device & Session Controls */}
      <TacticalFrame variant="default" className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 border-white/15 bg-[#040608]">
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-[#7e8b9b] flex items-center gap-1.5">
            <Laptop className="w-3.5 h-3.5 text-[#00ff66]" />
            <span>TRUSTED DEVICE LABEL</span>
          </label>
          <Input
            value={preferences.trustedDeviceName}
            onChange={(e) => onChange({ trustedDeviceName: e.target.value })}
            placeholder="e.g. Work MacBook Pro 16"
            className="bg-[#080c10]"
          />
          <p className="text-[10px] text-[#7e8b9b]">Helps identify active sessions across your hardware fleet.</p>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-[#7e8b9b] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#00f0ff]" />
            <span>SESSION TIMEOUT INACTIVITY</span>
          </label>
          <Select
            value={preferences.sessionTimeoutMinutes.toString()}
            onValueChange={(val) => onChange({ sessionTimeoutMinutes: parseInt(val, 10) })}
          >
            <SelectTrigger className="w-full bg-[#080c10] border-white/15 text-xs font-mono">
              <SelectValue placeholder="Select timeout" />
            </SelectTrigger>
            <SelectContent className="bg-[#080c10] border-white/15 text-xs font-mono text-[#f8fafc]">
              <SelectItem value="15">15 Minutes (High Security)</SelectItem>
              <SelectItem value="60">1 Hour (Standard)</SelectItem>
              <SelectItem value="480">8 Hours (Full Workday)</SelectItem>
              <SelectItem value="43200">30 Days (Extended Trust)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-[10px] text-[#7e8b9b]">Auto-locks dashboard session after period of no interaction.</p>
        </div>
      </TacticalFrame>

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
          <span>[ CALCULATE BASELINE ]</span>
          <ArrowRight className="w-3.5 h-3.5 ml-2" />
        </Button>
      </div>
    </div>
  )
}
