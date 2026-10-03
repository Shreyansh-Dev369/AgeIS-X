"use client"

import React, { useState } from "react"
import {
  Globe,
  Mail,
  MessageSquare,
  CreditCard,
  Fingerprint,
  Laptop,
  Network,
  EyeOff,
  Database,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Activity,
  Lock,
} from "lucide-react"
import { TacticalFrame } from "@/components/ui/tactical-frame"
import { ReticleCorners } from "@/components/ui/reticle-corners"
import { PixelBadge } from "@/components/ui/pixel-badge"
import { TechnicalStatusRow } from "@/components/ui/technical-status-row"
import { cn } from "@/lib/utils"

const surfaces = [
  {
    id: "web",
    num: "01",
    label: "WEB & URLS",
    icon: Globe,
    description: "Phishing links, malicious redirects, spoofed domains, typosquatting, and exploit kits.",
    traditional: "Basic browser blacklist updated every few hours with blind spots on zero-hour phishing.",
    ageisx: "Sub-28ms neural lexical vectorization and SSL certificate lineage attestation before connection.",
    status: "ACTIVE",
    badgeVariant: "phosphor" as const,
  },
  {
    id: "email",
    num: "02",
    label: "EMAIL INGESTION",
    icon: Mail,
    description: "Spear-phishing attachments, DMARC/SPF spoofing bypasses, and executive BEC fraud.",
    traditional: "Isolated spam filters that fail to cross-reference outbound link payloads with local processes.",
    ageisx: "Cross-correlated URL and header heuristic inspection with local zero-export sandbox detonation.",
    status: "MONITOR",
    badgeVariant: "cyan" as const,
  },
  {
    id: "messages",
    num: "03",
    label: "SMS & MESSAGING",
    icon: MessageSquare,
    description: "Smishing campaigns, shortened link lures, bank impersonation, and OTP interception.",
    traditional: "Zero protection on native mobile messaging and direct chat applications.",
    ageisx: "On-device lightweight NLP classifier evaluates message syntax and defangs unknown domains before tap.",
    status: "MONITOR",
    badgeVariant: "cyan" as const,
  },
  {
    id: "payments",
    num: "04",
    label: "PAYMENTS & FRAUD",
    icon: CreditCard,
    description: "Fake checkout overlays, Magecart DOM skimming scripts, and rogue crypto address swaps.",
    traditional: "Post-incident bank alerts after financial exfiltration has already completed.",
    ageisx: "Proactive gateway SSL validation and cryptographic clipboard monitoring for wallet addresses.",
    status: "ACTIVE",
    badgeVariant: "phosphor" as const,
  },
  {
    id: "identity",
    num: "05",
    label: "IDENTITY & VAULTS",
    icon: Fingerprint,
    description: "Credential stuffing, infostealer malware, browser cookie theft, and session hijacking.",
    traditional: "Static password managers lacking active runtime memory cloaking and breach cross-checks.",
    ageisx: "Zero-knowledge token isolation, breach database surveillance, and biometric step-up enforcement.",
    status: "ACTIVE",
    badgeVariant: "phosphor" as const,
  },
  {
    id: "devices",
    num: "06",
    label: "ENDPOINT DEVICES",
    icon: Laptop,
    description: "Ransomware mass encryption, rogue background daemons, and unauthorized kernel drivers.",
    traditional: "Bloated legacy antivirus engines that impose high CPU overhead and depend on signature updates.",
    ageisx: "Lightweight kernel-level behavioral monitoring, decoy canary traps, and instant process freezing.",
    status: "ACTIVE",
    badgeVariant: "phosphor" as const,
  },
  {
    id: "network",
    num: "07",
    label: "NETWORK & DNS",
    icon: Network,
    description: "Command & Control beaconing, rogue public WiFi, DNS hijacking, and unencrypted traffic snooping.",
    traditional: "Unencrypted DNS queries vulnerable to ISP-level logging and middleman interception.",
    ageisx: "Encrypted DNS-over-HTTPS enforcement, TLS certificate pinning, and automatic rogue socket drops.",
    status: "ACTIVE",
    badgeVariant: "phosphor" as const,
  },
  {
    id: "privacy",
    num: "08",
    label: "PRIVACY & TRACKING",
    icon: EyeOff,
    description: "Cross-site HTML5 canvas fingerprinting, audio telemetry probes, and behavioral trackers.",
    traditional: "Superficial cookie banners that do not block sophisticated canvas or hardware fingerprinting.",
    ageisx: "Active canvas noise injection, automated tracker defanging, and query parameter stripping.",
    status: "ACTIVE",
    badgeVariant: "phosphor" as const,
  },
  {
    id: "data",
    num: "09",
    label: "DATA & FILES",
    icon: Database,
    description: "Sensitive credential leakage, clipboard scrapers, accidental bucket exposures, and binary drops.",
    traditional: "Manual periodic file scanning without runtime write-protection for sensitive directories.",
    ageisx: "Real-time process sandboxing, API key entropy scanning, and cryptographic local attestation.",
    status: "MONITOR",
    badgeVariant: "cyan" as const,
  },
  {
    id: "ai",
    num: "10",
    label: "SYNTHETIC AI THREATS",
    icon: Cpu,
    description: "Deepfake synthesis, AI-generated lures, prompt injection, and automated social engineering.",
    traditional: "No legacy security tooling exists to detect generative AI synthetic lures.",
    ageisx: "Linguistic entropy models, synthetic artifact pattern classifiers, and media stream verification.",
    status: "MONITOR",
    badgeVariant: "cyan" as const,
  },
]

export function ThreatSurfaceDiagram() {
  const [selectedId, setSelectedId] = useState<string>("web")
  const selected = surfaces.find((s) => s.id === selectedId) || surfaces[0]
  const SelectedIcon = selected.icon

  return (
    <TacticalFrame variant="panel" reticles className="p-5 sm:p-7 font-mono">
      {/* Tactical Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10 mb-6 text-xs">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#00ff66]" />
          <span className="font-bold text-[#f8fafc] uppercase tracking-wider">
            SURFACE_TOPOLOGY // 10 CONNECTED DOMAINS
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-[#7e8b9b]">
          <span>CENTRAL_BRAIN:</span>
          <PixelBadge variant="phosphor" size="sm">ONLINE</PixelBadge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Surface Selection Grid */}
        <div className="lg:col-span-6 space-y-2">
          <div className="text-[10px] uppercase tracking-widest text-[#7e8b9b] mb-2">
            // SELECT VECTOR SURFACE FOR TELEMETRY INSPECTION
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {surfaces.map((surface) => {
              const Icon = surface.icon
              const isSelected = surface.id === selectedId

              return (
                <button
                  key={surface.id}
                  onClick={() => setSelectedId(surface.id)}
                  className={cn(
                    "flex items-center justify-between gap-2 p-2.5 rounded-none border text-left transition-all",
                    isSelected
                      ? "bg-[#0b1017] border-[#00ff66]/60 text-[#00ff66] shadow-[0_0_12px_rgba(0,255,102,0.15)]"
                      : "bg-[#040608] border-white/10 text-[#7e8b9b] hover:border-white/20 hover:text-[#f8fafc]"
                  )}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[10px] text-[#7e8b9b]">{surface.num}</span>
                    <Icon className={cn("w-3.5 h-3.5 shrink-0", isSelected ? "text-[#00ff66]" : "text-[#7e8b9b]")} />
                    <span className="text-[11px] font-bold tracking-tight truncate">
                      {surface.label}
                    </span>
                  </div>
                  <span className={cn("text-[9px] px-1 py-0.2 border shrink-0", isSelected ? "border-[#00ff66]/40 text-[#00ff66]" : "border-white/10 text-[#7e8b9b]")}>
                    {surface.status}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Right Architectural Comparison Detail */}
        <div className="lg:col-span-6 rounded-none border border-white/15 bg-[#040608] p-5 flex flex-col justify-between relative">
          <ReticleCorners size="sm" color="cyan" />
          
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 border border-[#00ff66]/30 bg-[#00ff66]/10 text-[#00ff66]">
                  <SelectedIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#f8fafc]">
                    [{selected.num}] {selected.label}
                  </h3>
                  <span className="text-[10px] text-[#7e8b9b]">
                    TELEMETRY VECTOR SPECIFICATION
                  </span>
                </div>
              </div>
              <PixelBadge variant={selected.badgeVariant} size="sm">
                {selected.status}
              </PixelBadge>
            </div>

            <p className="text-xs text-[#f8fafc]/90 font-sans mt-3.5 leading-relaxed">
              {selected.description}
            </p>

            <div className="mt-5 space-y-3">
              {/* Fragmented Legacy Model */}
              <div className="p-3 border border-white/10 bg-[#080c10] space-y-1">
                <span className="text-[10px] font-mono text-[#ff3b30] uppercase tracking-wider block font-bold">
                  [×] FRAGMENTED SILO APPROACH
                </span>
                <p className="text-xs text-[#7e8b9b] font-sans leading-relaxed">
                  {selected.traditional}
                </p>
              </div>

              {/* AgeIS-X Unified Architecture */}
              <div className="p-3 border border-[#00ff66]/30 bg-[#00ff66]/5 space-y-1">
                <span className="text-[10px] font-mono text-[#00ff66] uppercase tracking-wider block font-bold">
                  [✓] AGEIS-X AUTONOMOUS DEFENSE
                </span>
                <p className="text-xs text-[#f8fafc] font-sans leading-relaxed">
                  {selected.ageisx}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-[#7e8b9b]">
            <span>NODE_INTERFACE: ACTIVE</span>
            <span className="text-[#00ff66] flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-none bg-[#00ff66]" />
              CONTINUOUS ATTESTATION
            </span>
          </div>
        </div>
      </div>
    </TacticalFrame>
  )
}
