"use client"

import React, { useState } from "react"
import {
  ShieldAlert,
  Globe,
  Brain,
  Fingerprint,
  Cloud,
  Mail,
  Box,
  KeyRound,
  FileSearch,
  Activity,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { PixelBadge } from "@/components/ui/pixel-badge"
import { TacticalFrame } from "@/components/ui/tactical-frame"

interface StepProtectionOverviewProps {
  onNext: () => void
  onBack: () => void
}

const PROTECTION_DOMAINS = [
  {
    id: "endpoint",
    name: "Endpoint & Memory Heuristics",
    icon: ShieldAlert,
    desc: "Behavioral runtime monitoring to prevent ransomware, process hollowing, and memory injection attacks.",
    active: true,
  },
  {
    id: "network",
    name: "Encrypted DNS & Network",
    icon: Globe,
    desc: "Low-latency DNS over HTTPS/TLS filtering out command-and-control hostnames before socket connect.",
    active: true,
  },
  {
    id: "phishing",
    name: "AI Phishing & URL Engine",
    icon: Brain,
    desc: "14-dimensional lexical parsing with sub-10ms inference against zero-hour malicious domains.",
    active: true,
  },
  {
    id: "identity",
    name: "Identity & Credential Guard",
    icon: Fingerprint,
    desc: "Proactive breach monitoring against darknet dumps and anomalous authentication geographic spikes.",
    active: true,
  },
  {
    id: "cloud",
    name: "Cloud Perimeter Security",
    icon: Cloud,
    desc: "API anomaly detection and posture auditing for connected cloud services and SaaS accounts.",
    active: true,
  },
  {
    id: "email",
    name: "Email & Collaboration Armor",
    icon: Mail,
    desc: "Deep inspection of malicious attachments, brand impersonation, and hidden payload macros.",
    active: true,
  },
  {
    id: "container",
    name: "Container & Runtime Guard",
    icon: Box,
    desc: "User-space process sandboxing and privilege-escalation mitigation across developer environments.",
    active: true,
  },
  {
    id: "zero-trust",
    name: "Zero-Trust Context Gateway",
    icon: KeyRound,
    desc: "Continuous micro-authentication evaluating device health before granting internal asset access.",
    active: true,
  },
  {
    id: "dlp",
    name: "Data Loss Prevention (DLP)",
    icon: FileSearch,
    desc: "Automatic masking and interception of exposed API tokens, private keys, and sensitive PII.",
    active: true,
  },
  {
    id: "threat-intel",
    name: "Global Threat Consensus",
    icon: Activity,
    desc: "Real-time IoC telemetry synchronization from edge nodes worldwide.",
    active: true,
  },
]

export function StepProtectionOverview({ onNext, onBack }: StepProtectionOverviewProps) {
  const [selectedDomain, setSelectedDomain] = useState<string>("endpoint")

  const current = PROTECTION_DOMAINS.find((d) => d.id === selectedDomain) || PROTECTION_DOMAINS[0]
  const IconComponent = current.icon

  return (
    <div className="space-y-6 font-mono select-none">
      {/* Step Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <PixelBadge variant="phosphor" size="sm" dot>
            DEFENSE_GRID // 10_DOMAINS
          </PixelBadge>
          <span className="text-[11px] text-[#7e8b9b]">SYNCHRONIZED SHIELD</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#f8fafc] uppercase font-sans">
          AgeIS-X 10-Domain Defense Architecture
        </h2>
        <p className="text-xs text-[#7e8b9b] leading-relaxed max-w-xl">
          Review the complete spectrum of security domains synchronized through your master identity.
        </p>
      </div>

      {/* Grid Layout: Domain List vs Detail Inspector */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Domain Selection Matrix */}
        <div className="md:col-span-6 space-y-1.5 max-h-[340px] overflow-y-auto pr-1">
          {PROTECTION_DOMAINS.map((domain) => {
            const Icon = domain.icon
            const isSelected = domain.id === selectedDomain
            return (
              <button
                key={domain.id}
                type="button"
                onClick={() => setSelectedDomain(domain.id)}
                className={`w-full text-left p-2.5 border transition-all flex items-center justify-between text-xs font-mono ${
                  isSelected
                    ? "bg-[#0b1017] border-[#00ff66] text-[#00ff66] shadow-[0_0_8px_rgba(0,255,102,0.15)]"
                    : "bg-[#040608] border-white/10 text-[#7e8b9b] hover:bg-[#080c10] hover:text-[#f8fafc] hover:border-white/20"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isSelected ? "text-[#00ff66]" : "text-[#7e8b9b]"}`} />
                  <span className="font-semibold truncate uppercase tracking-tight">{domain.name}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 pl-2">
                  <span className="text-[10px] text-[#00ff66]">[ACTIVE]</span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Domain Inspector Details */}
        <TacticalFrame
          variant="panel"
          reticles={true}
          reticleColor="cyan"
          className="md:col-span-6 p-4 flex flex-col justify-between border-white/15 bg-[#040608]"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 border border-[#00f0ff]/30 bg-[#00f0ff]/10 text-[#00f0ff] flex items-center justify-center">
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#00f0ff] uppercase tracking-wider block">
                DOMAIN_SPECIFICATION // {current.id.toUpperCase()}
              </span>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#f8fafc] mt-0.5">
                {current.name}
              </h3>
            </div>
            <p className="text-xs text-[#7e8b9b] leading-relaxed">
              {current.desc}
            </p>
          </div>

          <div className="pt-4 border-t border-white/10 space-y-2 mt-4 text-[11px]">
            <div className="flex items-center gap-2 text-[#f8fafc]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff66] shrink-0" />
              <span>Zero-knowledge local inference execution</span>
            </div>
            <div className="flex items-center gap-2 text-[#f8fafc]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff66] shrink-0" />
              <span>Real-time cross-vector correlation engine</span>
            </div>
          </div>
        </TacticalFrame>
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
          <span>[ CONFIRM & CONTINUE ]</span>
          <ArrowRight className="w-3.5 h-3.5 ml-2" />
        </Button>
      </div>
    </div>
  )
}
