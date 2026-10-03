"use client"

import React from "react"
import Link from "next/link"
import { PublicShell } from "@/components/layout/public-shell"
import { ProtectionMatrix } from "@/components/marketing/protection-matrix"
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
import { ShieldCheck, ArrowRight, Layers, Lock, Cpu, Globe, Activity } from "lucide-react"

export default function ProtectionPage() {
  return (
    <PublicShell>
      {/* 1. EDITORIAL HEADER */}
      <EditorialSection mode="editorial-black" className="pt-10 pb-16 md:pt-16 md:pb-24 border-b border-white/10 font-mono">
        <div className="space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <SignalMarker status="active" label="DEFENSE ARCHITECTURE" />
              <span className="text-white/30 text-xs font-mono">/</span>
              <TechnicalLabel>UNIFIED ATTACK SURFACE RECON</TechnicalLabel>
            </div>
            <div className="flex items-center gap-3">
              <SecuritySticker type="access_granted" size="sm" />
            </div>
          </div>

          <div className="max-w-4xl space-y-6">
            <EditorialHeading level={1} className="leading-[0.92]">
              PROTECTION ACROSS
              <br />
              <span className="text-[#39FF14]">CRITICAL SURFACES.</span>
            </EditorialHeading>

            <p className="text-base sm:text-lg text-[#A6A6A0] max-w-2xl leading-relaxed font-sans font-normal">
              AgeIS-X consolidates fragmented point tools into one integrated operating system. Inspect how each protection domain functions, from active operational capabilities to staged rollout features.
            </p>
          </div>
        </div>
      </EditorialSection>

      {/* 2. MAIN INTERACTIVE MATRIX */}
      <EditorialSection mode="dark-lab" className="py-16 md:py-24 border-b border-white/10">
        <div className="space-y-8 font-mono">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <span className="text-xs font-bold text-[#39FF14] uppercase tracking-wider block">
                01 / COVERAGE & STATUS
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase text-[#F1F0EB] mt-1">
                INTERACTIVE SURFACE MATRIX
              </h2>
            </div>
            <p className="text-xs text-[#A6A6A0] font-sans max-w-md">
              Select any domain below to inspect targeted threat vectors, detection methodology, and production status.
            </p>
          </div>

          <RevealOnScroll direction="up">
            <ProtectionMatrix />
          </RevealOnScroll>
        </div>
      </EditorialSection>

      {/* 3. 4-STAGE AUTONOMOUS DEFENSE CYCLE */}
      <EditorialSection mode="editorial-black" className="py-20 md:py-28 border-b border-white/10">
        <div className="space-y-12 font-mono">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
            <div className="space-y-2">
              <TechnicalLabel className="text-[#39FF14]">02 / OPERATIONAL PROTOCOL</TechnicalLabel>
              <EditorialHeading level={2}>4-STAGE AUTONOMOUS CYCLE</EditorialHeading>
            </div>
            <p className="text-xs sm:text-sm text-[#A6A6A0] max-w-md font-sans leading-relaxed">
              How every protection layer continuously operates without introducing client-side latency.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10">
            <DepthCard depthLevel="medium" glowColor="green" className="p-6 bg-[#050505] space-y-3">
              <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
                <span className="text-[#39FF14] font-bold">01 // INGEST</span>
                <span className="text-[9px] text-[#A6A6A0]">PASSIVE</span>
              </div>
              <h3 className="text-sm font-bold text-[#F1F0EB] uppercase">Zero-Overhead Probes</h3>
              <p className="text-xs text-[#A6A6A0] font-sans leading-relaxed">
                Sensor hooks capture URL handshakes, socket requests, and file downloads as they occur at network boundaries.
              </p>
            </DepthCard>

            <DepthCard depthLevel="medium" glowColor="cyan" className="p-6 bg-[#050505] space-y-3">
              <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
                <span className="text-[#00E5FF] font-bold">02 // INFERENCE</span>
                <span className="text-[9px] text-[#A6A6A0]">&lt; 20MS</span>
              </div>
              <h3 className="text-sm font-bold text-[#F1F0EB] uppercase">Sub-20ms NLP Scoring</h3>
              <p className="text-xs text-[#A6A6A0] font-sans leading-relaxed">
                Specialized character n-gram classifiers calculate exploit probability and flag typosquats.
              </p>
            </DepthCard>

            <DepthCard depthLevel="medium" glowColor="green" className="p-6 bg-[#050505] space-y-3">
              <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
                <span className="text-[#FFB800] font-bold">03 // MITIGATE</span>
                <span className="text-[9px] text-[#A6A6A0]">CONTAIN</span>
              </div>
              <h3 className="text-sm font-bold text-[#F1F0EB] uppercase">Deterministic Action</h3>
              <p className="text-xs text-[#A6A6A0] font-sans leading-relaxed">
                Rogue connections are dropped, malicious binaries are quarantined, and session tokens are shielded.
              </p>
            </DepthCard>

            <DepthCard depthLevel="medium" glowColor="white" className="p-6 bg-[#050505] space-y-3">
              <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
                <span className="text-[#F1F0EB] font-bold">04 // EXPLAIN</span>
                <span className="text-[9px] text-[#A6A6A0]">AUDIT</span>
              </div>
              <h3 className="text-sm font-bold text-[#F1F0EB] uppercase">Actionable Context</h3>
              <p className="text-xs text-[#A6A6A0] font-sans leading-relaxed">
                Users receive clear, human-readable explanations of what occurred and why it was neutralized.
              </p>
            </DepthCard>
          </div>
        </div>
      </EditorialSection>

      {/* 4. CALL TO ACTION */}
      <section className="py-16 sm:py-20 bg-[#080808] text-center font-mono">
        <div className="page-container max-w-xl space-y-6">
          <h3 className="text-2xl sm:text-3xl font-black text-[#F1F0EB] uppercase">
            COMMISSION DEFENSE
          </h3>
          <p className="text-xs sm:text-sm text-[#A6A6A0] font-sans leading-relaxed">
            Select a dedicated AgeIS-X robot security unit or run a live threat vector scan.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Button
              className="bg-[#39FF14] hover:bg-[#32e012] text-[#050505] font-mono font-bold text-xs uppercase tracking-wider rounded-none px-7 h-11 shadow-[2px_2px_0px_#FFFFFF]"
              asChild
            >
              <Link href="/pricing">
                <span>VIEW ROBOT PLANS</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button
              variant="outline"
              className="border-white/20 bg-transparent hover:bg-white/5 text-[#F1F0EB] text-xs font-mono rounded-none h-11 px-6"
              asChild
            >
              <Link href="/">Try URL Scanner</Link>
            </Button>
          </div>
        </div>
      </section>
    </PublicShell>
  )
}
