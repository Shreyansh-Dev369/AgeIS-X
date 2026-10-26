"use client"

import * as React from "react"
import { Globe, Mail, Fingerprint, Laptop, EyeOff, Lock, ArrowRight, CheckCircle2, Shield, Terminal } from "lucide-react"
import { PointerDepthCard } from "./pointer-depth-card"
import { cn } from "@/lib/utils"

export interface DefenseSurfaceItem {
  id: string
  num: string
  surface: string
  title: string
  desc: string
  icon: any
  spec: string
  latency: string
  terminalLog: string[]
}

const SURFACES: DefenseSurfaceItem[] = [
  {
    id: "web",
    num: "01",
    surface: "WEB & SOCKET INGRESS",
    title: "Zero-Hour URL & Phishing Interception",
    desc: "Blocks punycode homographs, token-stealing reverse proxies, and credential harvesters before TLS handshake finishes.",
    icon: Globe,
    spec: "RFC-3492 Punycode",
    latency: "< 14.2ms",
    terminalLog: [
      "[SOCKET] TLS ClientHello intercepted on TCP :443",
      "[SNI] Target: xn--paypl-auth-e1a.xyz (RFC-3492 homoglyph)",
      "[LEXICAL] Bayesian Risk: 99.8% (brand impersonation)",
      "[ACTION] Socket aborted; zero packets dispatched to host",
    ],
  },
  {
    id: "email",
    num: "02",
    surface: "COMMUNICATION CHANNELS",
    title: "Header Spoofing & Payload Defanging",
    desc: "Dissects DMARC/SPF anomalies, disguised invoice macros, and QR-phishing embedded in incoming telemetry streams.",
    icon: Mail,
    spec: "SHA-256 Local",
    latency: "< 16.8ms",
    terminalLog: [
      "[EMAIL] Inbound MIME multipart stream parsed",
      "[DMARC] Alignment failure: Return-Path domain mismatch",
      "[ATTACHMENT] 2D QR matrix detected in inline PNG payload",
      "[ACTION] QR defanged; sanitized cryptographic tombstone rendered",
    ],
  },
  {
    id: "identity",
    num: "03",
    surface: "IDENTITY ENCLAVES",
    title: "Hardware Passkey Protection & Leak Scans",
    desc: "Continuous cross-referencing against breached credential datasets with hardware-bound enclave authorization.",
    icon: Fingerprint,
    spec: "k-Anonymity",
    latency: "< 8.5ms",
    terminalLog: [
      "[AUTH] WebAuthn FIDO2 authentication flow monitored",
      "[ENCLAVE] k-Anonymity query against 8.4B breached hashes",
      "[INTEGRITY] Zero plaintext credential exposure detected",
      "[ACTION] Passkey approved; session binding verified",
    ],
  },
  {
    id: "endpoint",
    num: "04",
    surface: "HARDWARE ENDPOINTS",
    title: "Silent Host Shielding for macOS & Windows",
    desc: "Zero-throttling daemon monitors suspicious child process spawning, clipboard snooping, and driver tampering.",
    icon: Laptop,
    spec: "< 0.4% CPU",
    latency: "< 1.8ms",
    terminalLog: [
      "[PROCESS] Monitoring child process tree from user browser",
      "[HEURISTIC] Suspicious cmd.exe spawn from pdf reader blocked",
      "[MEMORY] Daemon resident footprint: 28.4 MB (Sleep active)",
      "[ACTION] Host thread isolated; administrative audit logged",
    ],
  },
  {
    id: "profiling",
    num: "05",
    surface: "ANTI-PROFILING",
    title: "Canvas Noise & Fingerprint Neutralizer",
    desc: "Defangs tracking parameters and injects non-deterministic micro-noise into HTML5 canvas and WebGL buffers.",
    icon: EyeOff,
    spec: "RFC-9110",
    latency: "< 0.8ms",
    terminalLog: [
      "[DOM] Canvas 2D render context call intercepted",
      "[NOISE] Injected non-deterministic micro-bits into WebGL plane",
      "[TRACKER] Cross-site canvas fingerprint hashing poisoned",
      "[ACTION] Identity anonymized across 100% of origin sessions",
    ],
  },
  {
    id: "vault",
    num: "06",
    surface: "ISOLATION VAULT",
    title: "Cryptographic Quarantine Storage",
    desc: "Suspicious artifacts are sealed into ephemeral, encrypted vaults with host-level key isolation.",
    icon: Lock,
    spec: "AES-256-GCM",
    latency: "< 12.0ms",
    terminalLog: [
      "[VAULT] Malicious artifact detected: payload.exe.bin",
      "[CRYPTO] Sealing into ephemeral RAM disk with AES-256-GCM",
      "[EPHEMERAL] Key memory purged from CPU register after write",
      "[ACTION] Zero lateral persistence possible on host system",
    ],
  },
]

export function InteractiveSurfaceLab() {
  const [activeSurface, setActiveSurface] = React.useState<DefenseSurfaceItem>(SURFACES[0])
  const ActiveIcon = activeSurface.icon

  return (
    <div className="space-y-12 font-mono">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#39FF14] tracking-wider uppercase">
            <span className="w-2 h-2 bg-[#39FF14] inline-block animate-pulse" />
            <span>05 // SURFACE MATRIX</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase text-[#F1F0EB] tracking-tight">
            WHAT AGEIS-X PROTECTS
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[#A6A6A0] max-w-md font-sans leading-relaxed">
          Six cohesive defense perimeters operating as a unified hardware-level intelligence blanket across your digital presence.
        </p>
      </div>

      {/* Main Grid: Interactive Selector (Left 6) + Live Terminal Inspector (Right 6) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: 6 Defense Surface Selector Cards */}
        <div className="lg:col-span-7 space-y-3">
          {SURFACES.map((item) => {
            const isSelected = activeSurface.id === item.id
            const Icon = item.icon
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveSurface(item)}
                className={cn(
                  "w-full text-left p-4 sm:p-5 border transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group",
                  isSelected
                    ? "bg-[#39FF14]/[0.08] border-[#39FF14] shadow-[0_0_25px_rgba(57,255,20,0.18)]"
                    : "bg-[#04060A] border-white/10 hover:border-white/25 hover:bg-white/[0.02]"
                )}
              >
                <div className="flex items-start sm:items-center gap-4">
                  <div className="text-xs font-bold text-[#39FF14] font-mono">
                    {item.num}
                  </div>
                  <div className="p-2 bg-white/5 border border-white/10 shrink-0">
                    <Icon className={cn("w-4 h-4", isSelected ? "text-[#39FF14]" : "text-[#A6A6A0]")} />
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-[10px] text-[#A6A6A0] uppercase tracking-wider font-bold">
                      {item.surface}
                    </div>
                    <div className={cn("text-xs sm:text-sm font-bold", isSelected ? "text-[#F1F0EB]" : "text-[#A6A6A0] group-hover:text-[#F1F0EB]")}>
                      {item.title}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <span className="text-[10px] px-2 py-0.5 bg-white/5 border border-white/10 text-[#39FF14] font-mono">
                    {item.spec}
                  </span>
                  <span className="text-[10px] text-[#A6A6A0] font-mono">
                    {item.latency}
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Right: Live Telemetry Inspector Terminal */}
        <div className="lg:col-span-5">
          <PointerDepthCard
            depthLevel="medium"
            glowColor="green"
            className="p-6 sm:p-8 bg-[#04060A] border border-white/15 space-y-6 sticky top-24 shadow-2xl"
          >
            {/* Inspector Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <ActiveIcon className="w-5 h-5 text-[#39FF14]" />
                <span className="text-xs font-black uppercase text-[#F1F0EB] tracking-wider">
                  SURFACE // {activeSurface.num}: {activeSurface.surface}
                </span>
              </div>
              <span className="text-[10px] text-[#39FF14] font-bold border border-[#39FF14]/30 px-2 py-0.5 bg-[#39FF14]/10">
                ACTIVE
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-base sm:text-lg font-bold text-[#F1F0EB]">
                {activeSurface.title}
              </h3>
              <p className="text-xs text-[#A6A6A0] font-sans leading-relaxed">
                {activeSurface.desc}
              </p>
            </div>

            {/* Simulated Live Kernel Stream */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] text-[#A6A6A0]">
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-[#39FF14]" />
                  <span>ON-DEVICE MITIGATION STREAM:</span>
                </span>
                <span className="text-[#39FF14]">{activeSurface.latency}</span>
              </div>

              <div className="bg-[#020305] border border-white/10 p-4 font-mono text-[11px] space-y-1.5 text-[#A6A6A0]">
                {activeSurface.terminalLog.map((line, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-[#39FF14] select-none">&gt;</span>
                    <span className={idx === activeSurface.terminalLog.length - 1 ? "text-[#39FF14] font-bold" : ""}>
                      {line}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Hardware Attestation */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[10px]">
              <span className="text-[#A6A6A0]">CRYPTOGRAPHIC ATTESTATION:</span>
              <span className="text-[#39FF14] font-bold font-mono">EAL6+ COMPLIANT</span>
            </div>
          </PointerDepthCard>
        </div>
      </div>
    </div>
  )
}
