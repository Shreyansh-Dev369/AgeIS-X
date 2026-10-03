"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { PublicShell } from "@/components/layout/public-shell"
import { CinematicHero } from "@/components/cinematic/cinematic-hero"
import { RevealOnScroll } from "@/components/cinematic/reveal-on-scroll"
import { DepthCard } from "@/components/cinematic/depth-card"
import { Button } from "@/components/ui/button"
import {
  EditorialSection,
  EditorialHeading,
  TechnicalLabel,
  SignalMarker,
} from "@/components/design-system/editorial-primitives"
import {
  PixelScoutGlyph,
  PixelGuardGlyph,
  PixelSentinelGlyph,
  PixelAegisGlyph,
  BarcodeGraphic,
  RegistrationMark,
} from "@/components/pricing/robot-pixel-sprites"
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

const robotRoster = [
  {
    index: "01",
    name: "SCOUT",
    tier: "FREE",
    price: "₹0",
    role: "RECONNAISSANCE UNIT",
    verb: "Detect.",
    desc: "Lightweight, agile reconnaissance unit for individuals. Real-time URL and phishing vector scanner with zero latency.",
    glyph: PixelScoutGlyph,
    devices: "1 Device",
  },
  {
    index: "02",
    name: "GUARD",
    tier: "CORE",
    price: "₹999 / yr",
    role: "PERSONAL DEFENSE UNIT",
    verb: "Protect.",
    desc: "Tactical defense unit with continuous web protection, email forensics, and cross-device synchronization.",
    glyph: PixelGuardGlyph,
    devices: "2 Devices",
  },
  {
    index: "03",
    name: "SENTINEL",
    tier: "PRO",
    price: "₹1,999 / yr",
    role: "ADVANCED THREAT INTELLIGENCE",
    verb: "Analyze.",
    desc: "Heavy reconnaissance and intelligence unit. Deep malicious file dissection and multi-OS workstation fleet defense.",
    glyph: PixelSentinelGlyph,
    devices: "5 Devices",
  },
  {
    index: "04",
    name: "AEGIS",
    tier: "SENTINEL",
    price: "₹3,499 / yr",
    role: "ULTIMATE DIGITAL GUARDIAN",
    verb: "Defend.",
    desc: "Flagship sovereign enclave guardian. Full-spectrum threat orchestration, priority support, and multi-endpoint enclave.",
    glyph: PixelAegisGlyph,
    devices: "10 Devices",
  },
]

export default function HomePage() {
  return (
    <PublicShell>
      {/* 1. MASTER 7-LAYER CINEMATIC HERO */}
      <CinematicHero />

      {/* 2. THREAT SURFACE DEFENSE MATRIX (MODE A - DARK LAB) */}
      <EditorialSection mode="dark-lab" className="py-20 md:py-28 border-b border-white/10">
        <div className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
            <div className="space-y-2">
              <TechnicalLabel>01 / DEFENSE SURFACES</TechnicalLabel>
              <EditorialHeading level={2}>WHAT AGEIS-X PROTECTS</EditorialHeading>
            </div>
            <p className="text-xs sm:text-sm text-[#A6A6A0] max-w-md font-sans leading-relaxed">
              Autonomous defense operating as one cohesive layer across your entire hardware and network perimeter.
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
                      <span className="text-[10px] tracking-widest text-[#A6A6A0] uppercase block font-bold">
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

      {/* 3. EDITORIAL MANIFESTO: THE MATHEMATICAL PARADIGM SHIFT (OFF-WHITE PAPER TEXTURE) */}
      <EditorialSection mode="off-white-editorial" className="py-20 md:py-28 border-b border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-4 space-y-3">
            <TechnicalLabel className="text-[#6F706D] font-bold">02 / PARADIGM SHIFT</TechnicalLabel>
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

      {/* 4. 4-ROBOT SECURITY UNIT ROSTER INTRODUCTION */}
      <EditorialSection mode="dark-lab" className="py-20 md:py-28 border-b border-white/10">
        <div className="space-y-12 font-mono">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
            <div className="space-y-2">
              <TechnicalLabel className="text-[#39FF14]">03 / SECURITY UNITS</TechnicalLabel>
              <EditorialHeading level={2}>THE AGEIS-X ROBOT ROSTER</EditorialHeading>
            </div>
            <p className="text-xs sm:text-sm text-[#A6A6A0] max-w-md font-sans leading-relaxed">
              You are not merely choosing a software tier. You are commissioning a dedicated autonomous guardian unit for your digital life.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/15">
            {robotRoster.map((robot, idx) => {
              const Glyph = robot.glyph
              return (
                <RevealOnScroll key={idx} delay={idx * 80}>
                  <DepthCard
                    depthLevel="medium"
                    glowColor="green"
                    className="p-6 bg-[#050505] flex flex-col justify-between space-y-6 h-full"
                  >
                    <div className="space-y-4">
                      {/* Top Header */}
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <div className="flex items-center gap-2">
                          <Glyph size={22} color="#39FF14" />
                          <span className="text-xs font-bold text-[#F1F0EB] uppercase tracking-wider">
                            {robot.name}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#39FF14] font-bold">
                          UNIT {robot.index}
                        </span>
                      </div>

                      {/* Tier & Price */}
                      <div>
                        <div className="flex items-baseline justify-between">
                          <span className="text-[10px] text-[#A6A6A0] uppercase tracking-wider">
                            PLAN {robot.tier}
                          </span>
                          <span className="text-xl font-bold text-[#39FF14]">
                            {robot.price}
                          </span>
                        </div>
                        <span className="text-[9px] text-[#6F706D] uppercase block mt-1 font-bold">
                          {robot.role}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-[#A6A6A0] font-sans leading-relaxed">
                        {robot.desc}
                      </p>

                      <div className="pt-2 border-t border-white/5 text-[10px] text-[#6F706D] flex items-center justify-between">
                        <span>ALLOCATION:</span>
                        <span className="text-[#F1F0EB] font-bold">{robot.devices}</span>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full font-mono text-[11px] uppercase tracking-wider h-9 rounded-none border-white/20 bg-transparent hover:bg-white/10 text-[#F1F0EB]"
                      asChild
                    >
                      <Link href="/pricing">
                        <span>COMMISSION {robot.name}</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                      </Link>
                    </Button>
                  </DepthCard>
                </RevealOnScroll>
              )
            })}
          </div>
        </div>
      </EditorialSection>

      {/* 5. CALL TO ACTION & PRICING LINK */}
      <section className="relative py-16 sm:py-24 bg-[#080D16] border-t border-white/10 font-mono">
        <div className="page-container max-w-7xl">
          <div className="p-8 sm:p-12 bg-[#04070D] border border-white/15 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl">
              <div className="flex items-center gap-2 text-xs text-[#39FF14]">
                <span className="w-1.5 h-1.5 bg-[#39FF14] inline-block animate-pulse" />
                <span className="uppercase font-bold tracking-wider">
                  COMMISSIONING ARCHIVE
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase text-[#F1F0EB] tracking-tight">
                SELECT YOUR SECURITY UNIT
              </h2>
              <p className="text-xs sm:text-sm text-[#A6A6A0] font-sans leading-relaxed">
                Explore the complete unit archive with classified dossiers, technical sensor payload comparisons, and transparent annual pricing.
              </p>
            </div>

            <Button
              size="lg"
              className="bg-[#39FF14] hover:bg-[#32e012] text-[#04070D] font-mono font-bold text-xs uppercase tracking-wider rounded-none px-8 h-12 shrink-0 shadow-[2px_2px_0px_#FFFFFF]"
              asChild
            >
              <Link href="/pricing">
                <span>VIEW FULL PRICING ROSTER</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </PublicShell>
  )
}