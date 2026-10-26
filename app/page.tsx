"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { PublicShell } from "@/components/layout/public-shell"
import { CinematicHero } from "@/components/cinematic/cinematic-hero"
import { LiveDefenseTicker } from "@/components/cinematic/live-defense-ticker"
import { RevealOnScroll } from "@/components/cinematic/reveal-on-scroll"
import { PointerDepthCard } from "@/components/cinematic/pointer-depth-card"
import { MagneticButton } from "@/components/cinematic/magnetic-button"
import { ScrollProgressRail } from "@/components/cinematic/scroll-progress-rail"
import { MaskedHeading } from "@/components/cinematic/typography-choreography"
import { TacticalThreatRadar } from "@/components/cinematic/tactical-threat-radar"
import { ZeroDaySimulator } from "@/components/cinematic/zero-day-simulator"
import { PanoramicLineupTheater } from "@/components/cinematic/panoramic-lineup-theater"
import { DualEnclaveShowcase } from "@/components/cinematic/dual-enclave-showcase"
import { InteractiveSurfaceLab } from "@/components/cinematic/interactive-surface-lab"
import { KillChainPipeline } from "@/components/cinematic/kill-chain-pipeline"
import { ArchitecturalComparison } from "@/components/cinematic/architectural-comparison"
import { Button } from "@/components/ui/button"
import {
  EditorialSection,
  TechnicalLabel,
} from "@/components/design-system/editorial-primitives"
import {
  ArrowRight,
  Radio,
  Shield,
  Activity,
  Cpu,
} from "lucide-react"

const robotRoster = [
  {
    index: "01",
    id: "scout",
    name: "SCOUT",
    code: "SX-01",
    tier: "FREE",
    price: "₹0",
    role: "RECONNAISSANCE UNIT",
    verb: "Detect.",
    desc: "Lightweight, agile reconnaissance unit for individuals. Real-time URL and phishing vector scanner with zero latency.",
    glyph: Radio,
    devices: "1 Device",
    image: "/robots/scout-portrait.webp",
    stats: { latency: "< 18ms", ram: "18 MB", rate: "99.4%" },
  },
  {
    index: "02",
    id: "guard",
    name: "GUARD",
    code: "SX-02",
    tier: "CORE",
    price: "₹999 / yr",
    role: "PERSONAL DEFENSE UNIT",
    verb: "Protect.",
    desc: "Tactical defense unit with continuous web protection, email forensics, and cross-device synchronization.",
    glyph: Shield,
    devices: "2 Devices",
    image: "/robots/guard-portrait.webp",
    stats: { latency: "< 16ms", ram: "24 MB", rate: "99.8%" },
  },
  {
    index: "03",
    id: "sentinel",
    name: "SENTINEL",
    code: "SX-03",
    tier: "PRO",
    price: "₹1,999 / yr",
    role: "ADVANCED THREAT INTELLIGENCE",
    verb: "Analyze.",
    desc: "Heavy reconnaissance and intelligence unit. Deep malicious file dissection and multi-OS workstation fleet defense.",
    glyph: Activity,
    devices: "5 Devices",
    image: "/robots/sentinel-portrait.webp",
    stats: { latency: "< 14ms", ram: "32 MB", rate: "99.94%" },
  },
  {
    index: "04",
    id: "aegis",
    name: "AEGIS",
    code: "SX-04",
    tier: "SENTINEL",
    price: "₹3,499 / yr",
    role: "ULTIMATE DIGITAL GUARDIAN",
    verb: "Defend.",
    desc: "Flagship sovereign enclave guardian. Full-spectrum threat orchestration, priority support, and multi-endpoint enclave.",
    glyph: Cpu,
    devices: "10 Devices",
    image: "/robots/aegis-portrait.webp",
    stats: { latency: "< 12ms", ram: "38 MB", rate: "99.99%" },
  },
]

export default function HomePage() {
  return (
    <PublicShell>
      {/* Subtle Desktop System Navigation Rail */}
      <ScrollProgressRail />

      {/* 1. MASTER 7-LAYER CINEMATIC HERO & PARALLAX SCENE */}
      <CinematicHero />

      {/* 2. REAL-TIME INSTITUTIONAL TELEMETRY TICKER */}
      <LiveDefenseTicker />

      {/* 3. REAL-TIME INTERACTIVE THREAT RADAR */}
      <EditorialSection
        id="radar"
        mode="dark-lab"
        containerWidth="wide"
        className="py-16 md:py-24 border-b border-white/10"
      >
        <RevealOnScroll direction="up" distance={20}>
          <TacticalThreatRadar />
        </RevealOnScroll>
      </EditorialSection>

      {/* 4. INTERACTIVE ZERO-DAY ATTACK DEFENSE LAB */}
      <EditorialSection
        id="defense-lab"
        mode="editorial-black"
        containerWidth="wide"
        className="py-20 md:py-28 border-b border-white/10"
      >
        <RevealOnScroll direction="up" distance={20}>
          <ZeroDaySimulator />
        </RevealOnScroll>
      </EditorialSection>

      {/* 5. SHOWCASE: 3D PANORAMIC FLEET LINEUP THEATER */}
      <EditorialSection
        id="fleet"
        mode="dark-lab"
        containerWidth="wide"
        className="py-20 md:py-28 border-b border-white/10"
      >
        <div className="space-y-8 font-mono">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
            <div className="space-y-2">
              <TechnicalLabel signal className="text-[#39FF14]">03 / AUTONOMOUS FLEET</TechnicalLabel>
              <MaskedHeading
                level={2}
                lines={["THE AGEIS-X ROBOT FLEET", "IN 3D SPATIAL LINEUP"]}
                className="text-2xl sm:text-3xl md:text-5xl font-black uppercase text-[#F1F0EB] tracking-tight font-mono"
              />
            </div>
            <p className="text-xs sm:text-sm text-[#A6A6A0] max-w-md font-sans leading-relaxed">
              Four purpose-engineered autonomous guardians. Hover or tap across the stage to inspect sensor payloads, live clock latency, and memory footprints.
            </p>
          </div>

          <RevealOnScroll direction="up" distance={24}>
            <PanoramicLineupTheater />
          </RevealOnScroll>
        </div>
      </EditorialSection>

      {/* 6. ARCHITECTURAL DUAL ENCLAVE SHOWCASE (NEURAL CORE & SHIELD UNIT) */}
      <EditorialSection
        id="architecture"
        mode="editorial-black"
        containerWidth="wide"
        className="py-20 md:py-28 border-b border-white/10"
      >
        <RevealOnScroll direction="up" distance={20}>
          <DualEnclaveShowcase />
        </RevealOnScroll>
      </EditorialSection>

      {/* 7. INTERACTIVE SURFACE DEFENSE LAB */}
      <EditorialSection
        id="surfaces"
        mode="dark-lab"
        containerWidth="wide"
        className="py-20 md:py-28 border-b border-white/10"
      >
        <RevealOnScroll direction="up" distance={20}>
          <InteractiveSurfaceLab />
        </RevealOnScroll>
      </EditorialSection>

      {/* 8. AUTONOMOUS 18MS MITIGATION PIPELINE */}
      <EditorialSection
        id="pipeline"
        mode="editorial-black"
        containerWidth="wide"
        className="py-16 md:py-24 border-b border-white/10"
      >
        <RevealOnScroll direction="up" distance={20}>
          <KillChainPipeline />
        </RevealOnScroll>
      </EditorialSection>

      {/* 9. PARADIGM SHIFT: LEGACY ANTIVIRUS VS. AGEIS-X */}
      <EditorialSection
        id="paradigm"
        mode="dark-lab"
        containerWidth="wide"
        className="py-20 md:py-28 border-b border-white/10"
      >
        <RevealOnScroll direction="up" distance={20}>
          <ArchitecturalComparison />
        </RevealOnScroll>
      </EditorialSection>

      {/* 8. 4-ROBOT SECURITY UNIT ROSTER (SPATIAL 3D DEPTH CARDS WITH ARTWORK) */}
      <EditorialSection
        id="roster"
        mode="dark-lab"
        containerWidth="wide"
        className="py-20 md:py-28 border-b border-white/10"
      >
        <div className="space-y-12 font-mono">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
            <div className="space-y-2">
              <TechnicalLabel signal className="text-[#39FF14]">05 / SECURITY UNITS</TechnicalLabel>
              <MaskedHeading
                level={2}
                lines={["THE AGEIS-X UNIT ROSTER"]}
                className="text-2xl sm:text-3xl md:text-5xl font-black uppercase text-[#F1F0EB] tracking-tight font-mono"
              />
            </div>
            <p className="text-xs sm:text-sm text-[#A6A6A0] max-w-md font-sans leading-relaxed">
              You are not merely choosing a software tier. You are commissioning a dedicated autonomous guardian unit for your digital perimeter.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {robotRoster.map((robot, idx) => {
              return (
                <RevealOnScroll key={idx} delay={idx * 70} direction="up" distance={20}>
                  <PointerDepthCard
                    depthLevel="medium"
                    glowColor="green"
                    className="p-5 sm:p-6 bg-[#04060A] border border-white/15 flex flex-col justify-between space-y-5 h-full group hover:border-[#39FF14]/50 transition-colors shadow-2xl"
                  >
                    <div className="space-y-4">
                      {/* Top Header */}
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse" />
                          <span className="text-xs font-black text-[#F1F0EB] uppercase tracking-wider group-hover:text-[#39FF14] transition-colors font-mono">
                            {robot.name} // {robot.code}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#39FF14] font-bold border border-[#39FF14]/30 px-1.5 py-0.5 bg-[#39FF14]/10">
                          {robot.tier}
                        </span>
                      </div>

                      {/* Framed Robot Portrait Viewport */}
                      <div className="relative w-full aspect-[4/3] bg-[#07090E] border border-white/10 overflow-hidden group/thumb">
                        {/* Ambient backlighting behind robot */}
                        <div className="absolute inset-0 bg-radial from-[#39FF14]/[0.08] via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />

                        {/* High-res character portrait */}
                        <Image
                          src={robot.image}
                          alt={`AgeIS-X ${robot.name} Autonomous Robot Guardian`}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-contain object-bottom filter contrast-[1.08] brightness-[0.98] group-hover:scale-[1.06] transition-transform duration-500 ease-out"
                        />

                        {/* Holographic targeting reticle ticks */}
                        <div className="pointer-events-none absolute top-2 left-2 text-[8px] text-[#39FF14]/60 font-mono">+</div>
                        <div className="pointer-events-none absolute top-2 right-2 text-[8px] text-[#39FF14]/60 font-mono">+</div>
                        <div className="pointer-events-none absolute bottom-2 left-2 text-[8px] text-[#39FF14]/60 font-mono">+</div>
                        <div className="pointer-events-none absolute bottom-2 right-2 text-[8px] text-[#39FF14]/60 font-mono">+</div>

                        {/* Scanline overlay */}
                        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(57,255,20,0.03)_1px,transparent_1px)] bg-[size:100%_4px]" />

                        {/* Floating live status overlay */}
                        <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-[#04060A]/90 border border-white/15 text-[8px] text-[#39FF14] font-mono">
                          STATUS: ACTIVE
                        </div>
                      </div>

                      {/* Tier & Price */}
                      <div>
                        <div className="flex items-baseline justify-between">
                          <span className="text-[10px] text-[#A6A6A0] uppercase tracking-wider">
                            ANNUAL COMMISSION
                          </span>
                          <span className="text-xl font-black text-[#39FF14] font-mono">
                            {robot.price}
                          </span>
                        </div>
                        <span className="text-[9px] text-[#6F706D] uppercase block mt-1 font-bold">
                          {robot.role}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-[#A6A6A0] font-sans leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all">
                        {robot.desc}
                      </p>

                      {/* Hardware Specs Micro-Bar */}
                      <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-white/5 text-[9px] text-[#A6A6A0]">
                        <div className="flex justify-between px-1.5 py-1 bg-white/[0.02]">
                          <span>LATENCY:</span>
                          <span className="text-[#39FF14] font-mono font-bold">{robot.stats.latency}</span>
                        </div>
                        <div className="flex justify-between px-1.5 py-1 bg-white/[0.02]">
                          <span>MEMORY:</span>
                          <span className="text-[#F1F0EB] font-mono font-bold">{robot.stats.ram}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white/5 text-[10px] text-[#6F706D] flex items-center justify-between">
                        <span>ALLOCATION:</span>
                        <span className="text-[#F1F0EB] font-bold">{robot.devices}</span>
                      </div>
                    </div>

                    <MagneticButton strength={3.5} className="w-full pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full font-mono text-[11px] uppercase tracking-wider h-10 rounded-none border-white/20 bg-transparent hover:bg-white/10 text-[#F1F0EB] group-hover:border-[#39FF14]/50 group-hover:text-[#39FF14] transition-colors"
                        asChild
                      >
                        <Link href="/pricing">
                          <span>COMMISSION {robot.name}</span>
                          <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                        </Link>
                      </Button>
                    </MagneticButton>
                  </PointerDepthCard>
                </RevealOnScroll>
              )
            })}
          </div>
        </div>
      </EditorialSection>

      {/* 7. COMMISSIONING ARCHIVE CALL TO ACTION */}
      <section
        id="commission"
        className="relative py-16 sm:py-24 bg-[#080D14] border-t border-white/10 font-mono"
      >
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
          <RevealOnScroll direction="up" distance={24}>
            <div className="p-8 sm:p-12 bg-[#04060A] border border-white/15 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
              {/* Vibrant ambient glow behind card */}
              <div
                className="pointer-events-none absolute -right-20 -bottom-20 w-80 h-80 bg-[#39FF14]/[0.08] blur-[100px] rounded-full"
                aria-hidden="true"
              />

              <div className="space-y-3 max-w-xl relative z-10">
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

              <div className="relative z-10 w-full md:w-auto">
                <MagneticButton strength={5} className="w-full md:w-auto">
                  <Button
                    size="lg"
                    className="w-full md:w-auto bg-[#39FF14] hover:bg-[#32E012] text-[#04060A] font-mono font-black text-xs uppercase tracking-wider rounded-none px-8 h-12 shrink-0 shadow-[0_0_25px_rgba(57,255,20,0.35)]"
                    asChild
                  >
                    <Link href="/pricing">
                      <span>VIEW FULL PRICING ROSTER</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </MagneticButton>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </PublicShell>
  )
}
