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
import { HowItWorksPipeline } from "@/components/marketing/how-it-works-pipeline"
import { AIEngineBreakdown } from "@/components/marketing/ai-engine-breakdown"
import { SecuritySticker } from "@/components/design-system/pixel-art-system"
import { RevealOnScroll } from "@/components/cinematic/reveal-on-scroll"
import { DepthCard } from "@/components/cinematic/depth-card"
import { ArrowRight, Terminal, ShieldAlert, Cpu } from "lucide-react"

const walkthroughSteps = [
  {
    step: "01",
    phase: "PASSIVE SOCKET HOOK",
    title: "Ingress Interception Before Handshake",
    desc: "When a socket connection is initiated (e.g. clicking https://auth-portal-verify.cc in an email), AgeIS-X edge hooks pause the raw TCP handshake before DNS resolution completes.",
  },
  {
    step: "02",
    phase: "LOCAL INFERENCE LOOP",
    title: "Sliding Window N-Gram Tokenization (< 15ms)",
    desc: "The character vectorizer extracts 3-to-5 gram substrings on-device. Risk features—such as brand token entropy, newly observed TLD, and keyword clusters—are scored against the local model.",
  },
  {
    step: "03",
    phase: "DETERMINISTIC QUARANTINE",
    title: "Connection Severed & Evidence Captured",
    desc: "The socket is terminated. Cryptographic artifacts are written to the local isolated vault, and a clean explainability card is rendered to the user without confusing technical jargon.",
  },
]

export default function HowItWorksPage() {
  return (
    <PublicShell>
      {/* 1. HERO (MODE B - EDITORIAL BLACK) */}
      <EditorialSection mode="editorial-black" className="pt-10 pb-16 md:pt-16 md:pb-24 border-b border-white/10 font-mono">
        <div className="space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <SignalMarker status="active" label="PIPELINE SPECIFICATION" />
              <span className="text-white/30 text-xs font-mono">/</span>
              <TechnicalLabel>AUTONOMOUS EXECUTION FLOW</TechnicalLabel>
            </div>
            <div className="flex items-center gap-3">
              <SecuritySticker type="access_granted" size="sm" />
            </div>
          </div>

          <div className="max-w-4xl space-y-6">
            <EditorialHeading level={1} className="leading-[0.92]">
              HOW AGEIS-X DEFENDS
              <br />
              <span className="text-[#39FF14]">IN SUB-20 MILLISECONDS.</span>
            </EditorialHeading>

            <p className="text-base sm:text-lg text-[#A6A6A0] max-w-2xl leading-relaxed font-sans font-normal">
              From the instant a network request is initiated to forensic containment, signals are evaluated locally without latency or remote surveillance.
            </p>
          </div>
        </div>
      </EditorialSection>

      {/* 2. WALKTHROUGH PIPELINE (MODE C - OFF-WHITE PAPER TEXTURE) */}
      <EditorialSection mode="off-white-editorial" className="py-20 md:py-28 border-b border-white/10">
        <div className="space-y-12 font-mono">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#242424]/15 pb-6">
            <div className="space-y-2">
              <TechnicalLabel className="text-[#6F706D] font-bold">01 / FORENSIC WALKTHROUGH</TechnicalLabel>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#050505] tracking-tight leading-tight uppercase">
                CASE STUDY: INTERCEPTING A PHISHING ATTACK
              </h2>
            </div>
            <span className="text-xs text-[#6F706D]">VERIFIED DETERMINISTIC</span>
          </div>

          <div className="divide-y divide-[#242424]/15 border-t border-b border-[#242424]/15">
            {walkthroughSteps.map((s, idx) => (
              <RevealOnScroll key={idx} delay={idx * 80}>
                <div className="py-8 px-2 sm:px-4 grid grid-cols-1 md:grid-cols-12 gap-6 items-start font-mono">
                  <div className="md:col-span-1 text-xl font-bold text-[#050505]">
                    {s.step}
                  </div>
                  <div className="md:col-span-4 space-y-1">
                    <span className="text-[10px] tracking-widest text-[#6F706D] uppercase block font-bold">
                      {s.phase}
                    </span>
                    <h3 className="text-base font-bold text-[#050505] uppercase">
                      {s.title}
                    </h3>
                  </div>
                  <div className="md:col-span-7 text-sm text-[#242424] font-sans leading-relaxed">
                    {s.desc}
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </EditorialSection>

      {/* 3. MULTI-LAYER INTERACTIVE PIPELINE */}
      <EditorialSection mode="dark-lab" className="py-20 md:py-28 border-b border-white/10">
        <div className="space-y-12 font-mono">
          <div className="space-y-2 border-b border-white/10 pb-6">
            <TechnicalLabel className="text-[#39FF14]">02 / ARCHITECTURAL PIPELINE</TechnicalLabel>
            <EditorialHeading level={2}>FULL-SPECTRUM ENGINE TRACE</EditorialHeading>
          </div>
          <RevealOnScroll direction="up">
            <HowItWorksPipeline />
          </RevealOnScroll>
        </div>
      </EditorialSection>

      {/* 4. AI ENGINE INFERENCE DEEP-DIVE */}
      <EditorialSection mode="editorial-black" className="py-20 md:py-28">
        <div className="space-y-12 font-mono">
          <div className="space-y-2 border-b border-white/10 pb-6">
            <TechnicalLabel className="text-[#39FF14]">03 / INFERENCE METHODOLOGY</TechnicalLabel>
            <EditorialHeading level={2}>ON-DEVICE VECTOR CLASSIFICATION</EditorialHeading>
          </div>
          <RevealOnScroll direction="up">
            <AIEngineBreakdown />
          </RevealOnScroll>
        </div>
      </EditorialSection>

      {/* 5. COMMISSION CALL TO ACTION */}
      <section className="py-16 sm:py-20 bg-[#080808] text-center font-mono border-t border-white/10">
        <div className="page-container max-w-xl space-y-6">
          <h3 className="text-2xl sm:text-3xl font-black text-[#F1F0EB] uppercase">
            CHOOSE YOUR DEFENSE UNIT
          </h3>
          <p className="text-xs sm:text-sm text-[#A6A6A0] font-sans leading-relaxed">
            Select a dedicated AgeIS-X security unit calibrated for your specific devices and operational requirements.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Button
              className="bg-[#39FF14] hover:bg-[#32e012] text-[#050505] font-mono font-bold text-xs uppercase tracking-wider rounded-none px-7 h-11 shadow-[2px_2px_0px_#FFFFFF]"
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
