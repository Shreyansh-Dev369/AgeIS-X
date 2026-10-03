"use client"

import * as React from "react"
import Link from "next/link"
import { PublicShell } from "@/components/layout/public-shell"
import { CinematicHero } from "@/components/cinematic/cinematic-hero"
import { URLScanner } from "@/components/url-scanner"
import { RevealOnScroll } from "@/components/cinematic/reveal-on-scroll"
import { DepthCard } from "@/components/cinematic/depth-card"
import { Button } from "@/components/ui/button"
import {
  EditorialSection,
  EditorialHeading,
  TechnicalLabel,
  SignalMarker,
} from "@/components/design-system/editorial-primitives"
import { SecuritySticker } from "@/components/design-system/pixel-art-system"
import {
  Globe,
  Mail,
  Fingerprint,
  Laptop,
  EyeOff,
  Lock,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  Activity,
  Terminal,
} from "lucide-react"

const protectionSurfaces = [
  {
    num: "01",
    surface: "WEB & SOCKET INGRESS",
    title: "Zero-Hour URL & Phishing Interception",
    desc: "Blocks punycode homographs, token-stealing reverse proxies, and credential harvesters before TLS handshake finishes.",
    icon: Globe,
    spec: "p99 < 18ms",
  },
  {
    num: "02",
    surface: "COMMUNICATION CHANNELS",
    title: "Header Spoofing & Payload Defanging",
    desc: "Dissects DMARC/SPF anomalies, disguised invoice macros, and QR-phishing embedded in incoming telemetry streams.",
    icon: Mail,
    spec: "SHA-256 local",
  },
  {
    num: "03",
    surface: "IDENTITY ENCLAVES",
    title: "Hardware Passkey Protection & Leak Scans",
    desc: "Continuous cross-referencing against breached credential datasets with hardware-bound enclave authorization.",
    icon: Fingerprint,
    spec: "k-Anonymity",
  },
  {
    num: "04",
    surface: "HARDWARE ENDPOINTS",
    title: "Silent Host Shielding for macOS & Windows",
    desc: "Zero-throttling daemon monitors suspicious child process spawning, clipboard snooping, and driver tampering.",
    icon: Laptop,
    spec: "< 0.4% CPU",
  },
  {
    num: "05",
    surface: "ANTI-PROFILING",
    title: "Canvas Noise & Fingerprint Neutralizer",
    desc: "Defangs tracking parameters and injects non-deterministic micro-noise into HTML5 canvas and WebGL buffers.",
    icon: EyeOff,
    spec: "RFC-9110",
  },
  {
    num: "06",
    surface: "ISOLATION VAULT",
    title: "Cryptographic Quarantine Storage",
    desc: "Suspicious artifacts are sealed into ephemeral, encrypted vaults with host-level key isolation.",
    icon: Lock,
    spec: "AES-256-GCM",
  },
]

export default function HomePage() {
  return (
    <PublicShell>
      {/* 1. MASTER 7-LAYER CINEMATIC HERO */}
      <CinematicHero />

      {/* 2. REAL-TIME THREAT VECTOR SCANNER EXPANDED SUITE */}
      <section className="relative z-20 bg-[#050505] border-b border-white/10 py-12">
        <div className="page-container">
          <RevealOnScroll direction="up">
            <URLScanner />
          </RevealOnScroll>
        </div>
      </section>

      {/* 3. EDITORIAL MANIFESTO (OFF-WHITE PAPER TEXTURE) */}
      <EditorialSection mode="off-white-editorial" className="py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-4 space-y-3">
            <TechnicalLabel className="text-[#6F706D] font-bold">01 / PARADIGM SHIFT</TechnicalLabel>
            <h2 className="font-mono text-2xl sm:text-3xl font-extrabold text-[#050505] tracking-tight leading-tight uppercase">
              SECURITY SOFTWARE SHOULD NOT BE SPYWARE.
            </h2>
          </div>

          <div className="lg:col-span-8 space-y-6 text-[#242424] text-base sm:text-lg leading-relaxed font-sans">
            <p className="font-medium text-[#050505]">
              For two decades, legacy antivirus suites have monetized users by siphoning full web history, DNS requests, and personal files to offshore telemetry clouds.
            </p>
            <p className="text-sm sm:text-base text-[#6F706D] leading-relaxed">
              AgeIS-X inverts the entire paradigm. All lexical token scoring, threat classification, and heuristic parsing run locally inside a sandboxed inference loop on your device. Your data never leaves your hardware enclave.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-[#242424]/15">
              <RevealOnScroll delay={100}>
                <div className="space-y-1">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[#6F706D] block font-bold">
                    INFERENCE DELTA
                  </span>
                  <span className="font-mono text-xl font-bold text-[#050505]">&lt; 20ms</span>
                  <p className="text-xs text-[#6F706D]">Local tokenization without remote round-trips.</p>
                </div>
              </RevealOnScroll>

              <RevealOnScroll delay={200}>
                <div className="space-y-1">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[#6F706D] block font-bold">
                    CLOUD HARVESTING
                  </span>
                  <span className="font-mono text-xl font-bold text-[#050505]">0 BYTES</span>
                  <p className="text-xs text-[#6F706D]">No URL logging, no profile harvesting.</p>
                </div>
              </RevealOnScroll>

              <RevealOnScroll delay={300}>
                <div className="space-y-1">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[#6F706D] block font-bold">
                    MEMORY FOOTPRINT
                  </span>
                  <span className="font-mono text-xl font-bold text-[#050505]">&lt; 38 MB</span>
                  <p className="text-xs text-[#6F706D]">Lightweight daemon sleeps when idle.</p>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </div>
      </EditorialSection>

      {/* 4. SURFACE PROTECTION MATRIX (DARK LAB) */}
      <EditorialSection mode="dark-lab" className="py-20 md:py-28">
        <div className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
            <div className="space-y-2">
              <TechnicalLabel>02 / DEFENSE MATRIX</TechnicalLabel>
              <EditorialHeading level={2}>SIX UNIFIED SURFACES</EditorialHeading>
            </div>
            <p className="text-xs sm:text-sm text-[#A6A6A0] max-w-md font-sans leading-relaxed">
              Comprehensive autonomous defense operating as one cohesive layer across your entire hardware and network perimeter.
            </p>
          </div>

          {/* Continuous Row Architecture with Subtle Elevation on Hover */}
          <div className="divide-y divide-white/10 border-t border-b border-white/10 font-mono">
            {protectionSurfaces.map((surface, idx) => {
              const Icon = surface.icon
              return (
                <RevealOnScroll key={idx} delay={idx * 60}>
                  <div className="py-6 px-2 sm:px-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center hover:bg-white/[0.02] transition-colors group">
                    <div className="md:col-span-1 text-xs font-bold text-[#39FF14]">
                      {surface.num}
                    </div>
                    <div className="md:col-span-3 space-y-1">
                      <span className="text-[10px] tracking-widest text-[#A6A6A0] uppercase block">
                        {surface.surface}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-[#F1F0EB] group-hover:text-[#39FF14] transition-colors flex items-center gap-2">
                        <Icon className="w-4 h-4 text-[#A6A6A0] group-hover:text-[#39FF14] transition-colors shrink-0" />
                        <span>{surface.title}</span>
                      </h3>
                    </div>
                    <div className="md:col-span-6 text-xs text-[#A6A6A0] font-sans leading-relaxed">
                      {surface.desc}
                    </div>
                    <div className="md:col-span-2 text-right">
                      <span className="inline-block text-[10px] font-mono px-2 py-0.5 bg-white/5 border border-white/10 text-[#A6A6A0]">
                        {surface.spec}
                      </span>
                    </div>
                  </div>
                </RevealOnScroll>
              )
            })}
          </div>
        </div>
      </EditorialSection>

      {/* 5. ROBOT COMMISSIONING BANNER HOOK */}
      <section className="relative py-16 sm:py-24 bg-[#080808] border-b border-white/10 overflow-hidden font-mono">
        <div className="page-container max-w-7xl">
          <div className="p-8 sm:p-12 bg-[#050505] border border-white/15 flex flex-col md:flex-row items-center justify-between gap-8 relative">
            <div className="space-y-4 max-w-xl">
              <div className="flex items-center gap-2 text-xs text-[#39FF14]">
                <span className="w-1.5 h-1.5 bg-[#39FF14] inline-block animate-pulse" />
                <span className="uppercase font-bold tracking-wider">CHOOSE YOUR GUARDIAN</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black uppercase text-[#F1F0EB] tracking-tight">
                COMMISSION AN AGEIS-X SECURITY UNIT
              </h2>
              <p className="text-xs sm:text-sm text-[#A6A6A0] font-sans leading-relaxed">
                Choose from Scout, Guard, Sentinel, or Aegis. Each unit is calibrated with dedicated sensor arrays and real-time defense intelligence.
              </p>
            </div>

            <Button
              size="lg"
              className="bg-[#39FF14] hover:bg-[#32e012] text-[#050505] font-mono font-bold text-xs uppercase tracking-wider rounded-none px-8 h-12 shrink-0 shadow-[0_0_20px_rgba(57,255,20,0.25)]"
              asChild
            >
              <Link href="/pricing">
                <span>VIEW ROBOT ROSTER</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </PublicShell>
  )
}