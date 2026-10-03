"use client"

import React from "react"
import Link from "next/link"
import { PublicShell } from "@/components/layout/public-shell"
import { Button } from "@/components/ui/button"
import {
  EditorialSection,
  EditorialHeading,
  EditorialRule,
  TechnicalLabel,
  SignalMarker,
  DataStrip,
} from "@/components/design-system/editorial-primitives"
import { PixelSleepingCatState, SecuritySticker } from "@/components/design-system/pixel-art-system"
import { RevealOnScroll } from "@/components/cinematic/reveal-on-scroll"
import { DepthCard } from "@/components/cinematic/depth-card"
import { ArrowRight, Target, Lock, Cpu, Globe } from "lucide-react"

const principles = [
  {
    num: "01",
    title: "UNIFIED OVER FRAGMENTED",
    tagline: "ONE COHESIVE OPERATING SYSTEM",
    desc: "Users should not have to manage five disparate point tools, four browser extensions, and three password alerts. Security must function as a coherent, unified layer that operates quietly across all digital vectors.",
    icon: Target,
  },
  {
    num: "02",
    title: "ZERO-KNOWLEDGE SOVEREIGNTY",
    tagline: "NEVER HARVEST USER SECRETS",
    desc: "Security software must never become spyware. We engineer AgeIS-X so that private browsing history, unencrypted messages, and host files remain on your device, mathematically isolated in hardware enclaves.",
    icon: Lock,
  },
  {
    num: "03",
    title: "MATHEMATICAL DETERMINISM",
    tagline: "SUB-20MS LOCAL INFERENCE",
    desc: "Threat decisions must be instantaneous. We employ lightweight character n-gram tokenization and local Bayesian inference rather than relying on slow, snooping remote round-trips for every link.",
    icon: Cpu,
  },
  {
    num: "04",
    title: "FORENSIC TRANSPARENCY",
    tagline: "REPRODUCIBLE RESEARCH & MODELS",
    desc: "We operate with total scientific integrity. We clearly document what is operational today versus simulated research capabilities, and invite third-party cryptography audits of our inference pipelines.",
    icon: Globe,
  },
]

export default function AboutPage() {
  return (
    <PublicShell>
      {/* 1. HERO (MODE B - EDITORIAL BLACK) */}
      <EditorialSection mode="editorial-black" className="pt-10 pb-16 md:pt-16 md:pb-24 border-b border-white/10 font-mono">
        <div className="space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <SignalMarker status="active" label="RESEARCH MANIFESTO" />
              <span className="text-white/30 text-xs font-mono">/</span>
              <TechnicalLabel>EST. 2026</TechnicalLabel>
            </div>
            <div className="flex items-center gap-3">
              <SecuritySticker type="stay_curious" size="sm" />
              <SecuritySticker type="encryption_freedom" size="sm" />
            </div>
          </div>

          <div className="max-w-4xl space-y-6">
            <EditorialHeading level={1} className="leading-[0.92]">
              DEFENDING DIGITAL
              <br />
              <span className="text-[#39FF14]">SOVEREIGNTY & PRIVACY.</span>
            </EditorialHeading>

            <p className="text-base sm:text-lg text-[#A6A6A0] max-w-2xl leading-relaxed font-sans font-normal">
              Our mission is to engineer an autonomous, zero-overhead defense operating system that protects your complete digital life without harvesting or surveilling your private telemetry.
            </p>
          </div>
        </div>
      </EditorialSection>

      {/* 2. EDITORIAL MANIFESTO (MODE C - OFF-WHITE PAPER TEXTURE) */}
      <EditorialSection mode="off-white-editorial" className="py-20 md:py-28 border-b border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-4 space-y-3">
            <TechnicalLabel className="text-[#6F706D] font-bold">01 / THE CONTRADICTION</TechnicalLabel>
            <h2 className="font-mono text-2xl sm:text-3xl font-extrabold text-[#050505] tracking-tight leading-tight uppercase">
              THE COMMERCIAL SECURITY INDUSTRY IS BROKEN.
            </h2>
          </div>

          <div className="lg:col-span-8 space-y-6 text-[#242424] text-base sm:text-lg leading-relaxed font-sans">
            <p className="font-medium text-[#050505]">
              Modern security companies became ad-tech brokers: collecting user telemetry, injecting root certificates, and consuming gigabytes of system memory while failing to block modern social engineering attacks.
            </p>
            <p className="text-sm sm:text-base text-[#6F706D] leading-relaxed">
              AgeIS-X was founded on a simple mathematical conviction: machine learning models for lexical threat analysis are compact enough to run entirely on the CPU of an endpoint device without ever uploading URL strings or documents to a centralized server.
            </p>

            <div className="pt-4 border-t border-[#242424]/15 font-mono text-xs text-[#050505] flex flex-wrap items-center justify-between gap-4">
              <span>ZERO LOG RETENTION POLICY</span>
              <span>100% EXPLAINABLE HEURISTICS</span>
            </div>
          </div>
        </div>
      </EditorialSection>

      {/* 3. FOUR CORE PILLARS (MODE A - DARK LAB / RAZOR BORDERS) */}
      <EditorialSection mode="dark-lab" className="py-20 md:py-28 border-b border-white/10">
        <div className="space-y-12 font-mono">
          <div className="space-y-2 border-b border-white/10 pb-6">
            <TechnicalLabel className="text-[#39FF14]">02 / ARCHITECTURAL PRINCIPLES</TechnicalLabel>
            <EditorialHeading level={2}>HOW WE ENGINEER AGEIS-X</EditorialHeading>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10 border border-white/10">
            {principles.map((p, idx) => {
              const Icon = p.icon
              return (
                <RevealOnScroll key={idx} delay={idx * 80}>
                  <DepthCard depthLevel="medium" glowColor="green" className="p-8 bg-[#050505] space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#39FF14]">{p.num}</span>
                      <Icon className="w-5 h-5 text-[#A6A6A0]" />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#A6A6A0] tracking-widest uppercase block font-bold">
                        {p.tagline}
                      </span>
                      <h3 className="text-lg font-bold text-[#F1F0EB] tracking-tight uppercase mt-1">
                        {p.title}
                      </h3>
                    </div>
                    <p className="text-xs text-[#A6A6A0] leading-relaxed font-sans font-normal">
                      {p.desc}
                    </p>
                  </DepthCard>
                </RevealOnScroll>
              )
            })}
          </div>
        </div>
      </EditorialSection>

      {/* 4. CALL TO ACTION */}
      <section className="py-16 sm:py-20 bg-[#080808] text-center font-mono">
        <div className="page-container max-w-xl space-y-6">
          <h3 className="text-2xl sm:text-3xl font-black text-[#F1F0EB] uppercase">
            JOIN THE DEFENSE REVOLUTION
          </h3>
          <p className="text-xs sm:text-sm text-[#A6A6A0] font-sans leading-relaxed">
            Experience sovereign, on-device threat interception on your personal machines.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <Button
              className="bg-[#39FF14] hover:bg-[#32e012] text-[#050505] font-mono font-bold text-xs uppercase tracking-wider rounded-none px-8 h-11 shadow-[2px_2px_0px_#FFFFFF]"
              asChild
            >
              <Link href="/pricing">
                <span>COMMISSION YOUR UNIT</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </PublicShell>
  )
}
