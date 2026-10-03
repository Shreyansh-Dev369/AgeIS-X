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
  AlertTriangle,
  Clock,
  ArrowRight,
  Terminal,
} from "lucide-react"
import { TacticalFrame } from "@/components/ui/tactical-frame"
import { ReticleCorners } from "@/components/ui/reticle-corners"
import { PixelBadge } from "@/components/ui/pixel-badge"
import { cn } from "@/lib/utils"

export interface DomainDetail {
  id: string
  num: string
  title: string
  icon: any
  status: "AVAILABLE NOW" | "IN DEVELOPMENT" | "PLANNED ARCHITECTURE"
  badgeVariant: "phosphor" | "warning" | "neutral"
  threats: string[]
  approach: string
  currentCapability: string
  futureCapability: string
}

export const PROTECTION_DOMAINS: DomainDetail[] = [
  {
    id: "web",
    num: "01",
    title: "Web & URL Protection",
    icon: Globe,
    status: "AVAILABLE NOW",
    badgeVariant: "phosphor",
    threats: [
      "Credential-harvesting phishing domains",
      "Typosquatting & Unicode homograph attacks",
      "Malicious URL redirects & drive-by scripts",
      "Exploit kit landing pages",
    ],
    approach:
      "Evaluates URL token n-grams, lexical character distributions, and TLS certificate lineage prior to HTTP connection handshake.",
    currentCapability: "Live TF-IDF neural vectorizer and lexical risk inference microservice.",
    futureCapability: "Client-side WebAssembly heuristic pre-filtering and automated DNS sinkholing.",
  },
  {
    id: "email",
    num: "02",
    title: "Email Vector Protection",
    icon: Mail,
    status: "IN DEVELOPMENT",
    badgeVariant: "warning",
    threats: [
      "Inbound spear-phishing with malicious links",
      "Executive impersonation & BEC fraud",
      "Obfuscated macro attachments (.docm, .xlsm)",
      "DKIM/DMARC spoofing bypasses",
    ],
    approach:
      "Header telemetry cross-correlation with outbound link reputation scoring and sandboxed payload detonation.",
    currentCapability: "Inbound email link extraction and neural risk scoring.",
    futureCapability: "Direct IMAP/OAuth zero-knowledge mail stream inspector.",
  },
  {
    id: "messaging",
    num: "03",
    title: "Communication & SMS Scams",
    icon: MessageSquare,
    status: "IN DEVELOPMENT",
    badgeVariant: "warning",
    threats: [
      "SMS smishing campaigns with shortened URLs",
      "Bank fraud alert impersonations",
      "Rogue verification codes & OTP stealers",
      "Social engineering lures",
    ],
    approach:
      "On-device lightweight NLP classifier evaluates message syntax and defangs unknown domains before user tap.",
    currentCapability: "Clipboard URL sanitization and risk rating.",
    futureCapability: "Native mobile SMS filter extension with zero cloud message export.",
  },
  {
    id: "payment",
    num: "04",
    title: "Payment & Financial Fraud",
    icon: CreditCard,
    status: "PLANNED ARCHITECTURE",
    badgeVariant: "neutral",
    threats: [
      "Fake payment checkout overlays",
      "Credit card skimming scripts (Magecart)",
      "Rogue crypto deposit address swaps",
      "Unauthorized recurring subscription traps",
    ],
    approach:
      "DOM structure integrity attestation on checkout pages and cryptographic clipboard monitoring for cryptocurrency addresses.",
    currentCapability: "Architectural specification and simulated address swap detection.",
    futureCapability: "Browser DOM tamper detection and payment gateway validation engine.",
  },
  {
    id: "identity",
    num: "05",
    title: "Identity & Credential Defense",
    icon: Fingerprint,
    status: "AVAILABLE NOW",
    badgeVariant: "phosphor",
    threats: [
      "Dark web credential exposure",
      "Browser cookie & session token theft",
      "Account takeover via credential stuffing",
      "Keylogging and clipboard monitoring",
    ],
    approach:
      "Zero-knowledge dark web exposure audits combined with local OS keychain protection hooks.",
    currentCapability: "Automated breach repository cross-check for enrolled domains.",
    futureCapability: "Hardware enclave session token cloaking and biometric authorization gates.",
  },
  {
    id: "device",
    num: "06",
    title: "Device & Endpoint Defense",
    icon: Laptop,
    status: "IN DEVELOPMENT",
    badgeVariant: "warning",
    threats: [
      "Ransomware mass file encryption",
      "Background cryptominers and rogue daemons",
      "Unauthorized kernel extensions & drivers",
      "Process memory injection",
    ],
    approach:
      "Passive syscall monitoring, cryptographic canary files, and parent-child process relationship analysis.",
    currentCapability: "Host system attestation and process inventory logging.",
    futureCapability: "Native eBPF kernel probes on Linux/macOS and mini-filter drivers on Windows.",
  },
  {
    id: "network",
    num: "07",
    title: "Network & Traffic Telemetry",
    icon: Network,
    status: "IN DEVELOPMENT",
    badgeVariant: "warning",
    threats: [
      "Command-and-Control (C2) beaconing",
      "Rogue captive portals & evil twin WiFi",
      "DNS poisoning and interception",
      "Unencrypted sensitive traffic leakage",
    ],
    approach:
      "Encrypted DNS-over-HTTPS enforcement, untrusted WiFi TLS certificate pinning, and automatic rogue socket termination.",
    currentCapability: "Diagnostic socket monitoring and DNS latency benchmarking.",
    futureCapability: "Integrated local WireGuard split-tunnel with zero-log packet filtering.",
  },
  {
    id: "privacy",
    num: "08",
    title: "Privacy & Anti-Tracking",
    icon: EyeOff,
    status: "AVAILABLE NOW",
    badgeVariant: "phosphor",
    threats: [
      "Cross-site canvas & audio fingerprinting",
      "Behavioral advertising trackers & beacons",
      "Excessive app background permissions",
      "Location and telemetry leakage",
    ],
    approach:
      "Micro-noise injection into HTML5 canvas/audio APIs and automatic tracking parameter stripping from outgoing requests.",
    currentCapability: "URL tracking parameter stripping and canvas noise injection.",
    futureCapability: "System-wide network tracker defanging engine.",
  },
  {
    id: "data",
    num: "09",
    title: "Data Exfiltration Prevention",
    icon: Database,
    status: "PLANNED ARCHITECTURE",
    badgeVariant: "neutral",
    threats: [
      "Malicious software exfiltrating local documents",
      "Clipboard content scrapers",
      "Accidental public cloud bucket uploads",
      "Sensitive token leakage in logs",
    ],
    approach:
      "Local regex and entropy scanners that detect API keys, SSH keys, and credit cards before outbound dispatch.",
    currentCapability: "Prototype token regex validator in developer toolchain.",
    futureCapability: "Kernel-level filesystem watch preventing unauthorized bulk reading of sensitive folders.",
  },
  {
    id: "ai",
    num: "10",
    title: "AI Scams & Deepfake Defense",
    icon: Cpu,
    status: "PLANNED ARCHITECTURE",
    badgeVariant: "neutral",
    threats: [
      "AI-generated synthetic voice lures",
      "Automated adaptive phishing bots",
      "Prompt injection against local AI assistants",
      "Deepfake video identity verification bypasses",
    ],
    approach:
      "Linguistic entropy checks, synthetic pattern recognition, and provenance verification of media streams.",
    currentCapability: "Research benchmarking on synthetic phishing lexical patterns.",
    futureCapability: "Real-time acoustic and textual artifact analyzer for incoming communications.",
  },
]

export function ProtectionMatrix({ initialDomain = "web" }: { initialDomain?: string }) {
  const [activeId, setActiveId] = useState<string>(initialDomain)
  const active = PROTECTION_DOMAINS.find((d) => d.id === activeId) || PROTECTION_DOMAINS[0]
  const ActiveIcon = active.icon

  return (
    <div className="space-y-6 font-mono">
      {/* Category Pills Navigation */}
      <div className="flex flex-wrap gap-1.5 pb-1">
        {PROTECTION_DOMAINS.map((domain) => {
          const isCurrent = domain.id === activeId
          const Icon = domain.icon

          return (
            <button
              key={domain.id}
              onClick={() => setActiveId(domain.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-none border text-xs transition-all uppercase tracking-wider",
                isCurrent
                  ? "bg-[#00ff66]/10 border-[#00ff66] text-[#00ff66] font-bold shadow-[0_0_10px_rgba(0,255,102,0.2)]"
                  : "bg-[#080c10] border-white/10 text-[#7e8b9b] hover:border-white/20 hover:text-[#f8fafc]"
              )}
            >
              <Icon className={cn("w-3.5 h-3.5", isCurrent ? "text-[#00ff66]" : "text-[#7e8b9b]")} />
              <span>[{domain.num}] {domain.title.split(" ")[0]}</span>
            </button>
          )
        })}
      </div>

      {/* Selected Domain Showcase Panel */}
      <TacticalFrame variant="panel" reticles className="p-5 sm:p-7 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 border border-[#00ff66]/40 bg-[#00ff66]/10 text-[#00ff66]">
              <ActiveIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#f8fafc]">
                [{active.num}] {active.title}
              </h3>
              <p className="text-[11px] text-[#7e8b9b] mt-0.5 font-mono">
                CORE DEFENSE DOMAIN // TELEMETRY PROBE
              </p>
            </div>
          </div>

          <div>
            <PixelBadge variant={active.badgeVariant} size="md" dot>
              {active.status}
            </PixelBadge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Threats Covered */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#f8fafc] flex items-center gap-1.5">
              <span className="text-[#ff3b30]">//</span> THREAT VECTORS ADDRESSED
            </h4>
            <ul className="space-y-2 text-xs">
              {active.threats.map((threat, idx) => (
                <li key={idx} className="flex items-start gap-2 p-2 rounded-none bg-[#040608] border border-white/10 text-[#f8fafc]/90 font-sans">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff66] shrink-0 mt-0.5" />
                  <span>{threat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Defense Methodology */}
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#f8fafc] flex items-center gap-1.5 mb-2">
                <span className="text-[#00ff66]">//</span> DETECTION & MITIGATION METHODOLOGY
              </h4>
              <p className="text-xs text-[#7e8b9b] font-sans leading-relaxed bg-[#040608] p-3 border border-white/10">
                {active.approach}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-[#040608] border border-[#00ff66]/30">
                <span className="text-[10px] uppercase text-[#00ff66] block font-bold mb-1">
                  [CURRENT CAPABILITY]
                </span>
                <p className="text-[11px] text-[#f8fafc] font-sans leading-snug">
                  {active.currentCapability}
                </p>
              </div>

              <div className="p-3 bg-[#040608] border border-white/15">
                <span className="text-[10px] uppercase text-[#00f0ff] block font-bold mb-1">
                  [PLANNED ROADMAP]
                </span>
                <p className="text-[11px] text-[#7e8b9b] font-sans leading-snug">
                  {active.futureCapability}
                </p>
              </div>
            </div>
          </div>
        </div>
      </TacticalFrame>
    </div>
  )
}
