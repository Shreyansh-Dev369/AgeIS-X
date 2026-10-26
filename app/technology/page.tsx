"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { PublicShell } from "@/components/layout/public-shell"
import { Button } from "@/components/ui/button"
import {
  EditorialSection,
  EditorialHeading,
  TechnicalLabel,
  SignalMarker,
} from "@/components/design-system/editorial-primitives"
import { SecuritySticker } from "@/components/design-system/pixel-art-system"
import { TechnologyApiPlayground } from "@/components/technology/api-playground"
import { Terminal, Cpu, Server, Code2, Lock, ArrowRight, Binary, Globe, Mail, MessageSquare, ShieldCheck, Activity } from "lucide-react"

export default function TechnologyPage() {
  return (
    <PublicShell>
      {/* 1. HERO (MODE B - EDITORIAL RESEARCH WHITE-PAPER) */}
      <EditorialSection mode="editorial-black" className="pt-10 pb-16 md:pt-16 md:pb-20 font-mono">
        <div className="space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <SignalMarker status="active" label="TECHNICAL ARCHITECTURE SPEC" />
              <span className="text-white/30 text-xs font-mono">/</span>
              <TechnicalLabel>DOCUMENT ID: SPEC-2026-X</TechnicalLabel>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-[#39FF14] font-mono px-2 py-0.5 bg-[#39FF14]/10 border border-[#39FF14]/30">
                MULTI-SIGNAL ENGINE V2.0.0
              </span>
              <SecuritySticker type="encryption_freedom" size="sm" />
            </div>
          </div>

          <div className="max-w-4xl space-y-6">
            <EditorialHeading level={1} className="leading-[0.92]">
              THE AGEIS-X
              <br />
              <span className="text-[#39FF14]">TECHNOLOGY SPECIFICATION.</span>
            </EditorialHeading>

            <p className="text-base sm:text-lg text-[#A6A6A0] max-w-2xl leading-relaxed font-sans font-normal">
              A transparent architectural breakdown of what is running in production today across M-01 through M-04, our sub-20ms inference loops, and our open cryptographic research roadmap.
            </p>
          </div>
        </div>
      </EditorialSection>

      {/* 2. LIVE INTERACTIVE API WORKBENCH */}
      <EditorialSection mode="dark-lab" className="py-14 md:py-20 border-b border-white/10">
        <div className="space-y-8 font-mono">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <span className="text-xs font-bold text-[#39FF14] uppercase tracking-wider block">
                01 / INGESTION PLAYGROUND
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase text-[#F1F0EB] mt-1">
                LIVE REST MICROSERVICE WORKBENCH
              </h2>
            </div>
            <p className="text-xs text-[#A6A6A0] font-sans max-w-md">
              Send live JSON requests to the local Python FastAPI daemon on port 8000 and inspect multi-signal responses.
            </p>
          </div>

          <TechnologyApiPlayground />
        </div>
      </EditorialSection>

      {/* 3. 4 MODULAR ENGINES (M-01 TO M-04) */}
      <EditorialSection mode="editorial-black" className="py-20 md:py-28 border-b border-white/10">
        <div className="space-y-12 font-mono">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
            <div className="space-y-2">
              <TechnicalLabel className="text-[#39FF14]">02 / MODULAR ENGINES</TechnicalLabel>
              <EditorialHeading level={2}>MULTI-SIGNAL PIPELINE BREAKDOWN</EditorialHeading>
            </div>
            <span className="text-xs text-[#A6A6A0]">VERIFIED IN UNIT TESTS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10">
            {/* M-01 */}
            <div className="p-6 bg-[#07090E] space-y-3">
              <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
                <span className="text-[#39FF14] font-bold">M-01</span>
                <span className="text-[9px] text-[#A6A6A0]">LEXICAL</span>
              </div>
              <Cpu className="w-5 h-5 text-[#39FF14]" />
              <h3 className="text-sm font-bold text-[#F1F0EB] uppercase">
                Deterministic Tokenizer & Homoglyph Engine
              </h3>
              <p className="text-xs text-[#A6A6A0] leading-relaxed font-sans font-normal">
                Sliding 3-5 character n-gram vectorizer, Shannon entropy calculation, and character-by-character Cyrillic/Greek Unicode homoglyph detector.
              </p>
            </div>

            {/* M-02 */}
            <div className="p-6 bg-[#07090E] space-y-3">
              <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
                <span className="text-[#00E5FF] font-bold">M-02</span>
                <span className="text-[9px] text-[#A6A6A0]">NETWORK</span>
              </div>
              <Globe className="w-5 h-5 text-[#00E5FF]" />
              <h3 className="text-sm font-bold text-[#F1F0EB] uppercase">
                DoH, RDAP & TLS/X.509 Cryptographic Inspector
              </h3>
              <p className="text-xs text-[#A6A6A0] leading-relaxed font-sans font-normal">
                Resolves DNS via Cloudflare/Google HTTPS endpoints, checks authoritative ICANN RDAP domain registration age, and probes active SSL certificates.
              </p>
            </div>

            {/* M-03 */}
            <div className="p-6 bg-[#07090E] space-y-3">
              <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
                <span className="text-[#FFB800] font-bold">M-03</span>
                <span className="text-[9px] text-[#A6A6A0]">COMMUNICATION</span>
              </div>
              <Mail className="w-5 h-5 text-[#FFB800]" />
              <h3 className="text-sm font-bold text-[#F1F0EB] uppercase">
                Email MIME & Social Engineering NLP
              </h3>
              <p className="text-xs text-[#A6A6A0] leading-relaxed font-sans font-normal">
                Extracts SPF, DKIM, and DMARC headers, flags From vs Reply-To mismatches, and evaluates SMS/email body text for urgency or banking scam lures.
              </p>
            </div>

            {/* M-04 */}
            <div className="p-6 bg-[#07090E] space-y-3">
              <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
                <span className="text-rose-400 font-bold">M-04</span>
                <span className="text-[9px] text-[#A6A6A0]">DOM TREE</span>
              </div>
              <Server className="w-5 h-5 text-rose-400" />
              <h3 className="text-sm font-bold text-[#F1F0EB] uppercase">
                DOM Threat Parser & SSRF Guard
              </h3>
              <p className="text-xs text-[#A6A6A0] leading-relaxed font-sans font-normal">
                Strict multi-layer SSRF filter blocks private IP ranges (127.0.0.1, 10.0.0.0/8, 169.254.0.0/16). Fetches safe HTML to detect off-domain form actions.
              </p>
            </div>
          </div>
        </div>
      </EditorialSection>

      {/* 4. TIER 2: ACTIVE PROTOTYPES (MODE C - OFF-WHITE PAPER TEXTURE) */}
      <EditorialSection mode="off-white-editorial" className="py-20 md:py-28 font-mono">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-4 space-y-3">
            <TechnicalLabel className="text-[#6F706D] font-bold">TIER 2 • SYSTEM SPECIFICATION</TechnicalLabel>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#07090E] tracking-tight leading-tight uppercase">
              PLANNED SYSTEM ARCHITECTURE.
            </h2>
            <p className="text-xs text-[#6F706D] leading-relaxed font-sans">
              Currently undergoing performance benchmarks and cryptographic review.
            </p>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div className="divide-y divide-[#242424]/15 border-t border-b border-[#242424]/15">
              <div className="py-6 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-[#07090E] uppercase">Sandboxed eBPF Probes (Linux / macOS)</h3>
                  <span className="text-[10px] px-2 py-0.5 bg-[#07090E] text-[#F1F0EB]">PROTOTYPE</span>
                </div>
                <p className="text-sm text-[#6F706D] font-sans">
                  In-kernel programs attached to kprobes and tracepoints to intercept unauthorized memory manipulations, raw socket binds, and ransomware bulk encryption syscalls.
                </p>
              </div>

              <div className="py-6 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-[#07090E] uppercase">Zero-Knowledge Hardware Vault</h3>
                  <span className="text-[10px] px-2 py-0.5 bg-[#07090E] text-[#F1F0EB]">PROTOTYPE</span>
                </div>
                <p className="text-sm text-[#6F706D] font-sans">
                  Local SQLite database encrypted with AES-256 GCM using keys stored in the platform Secure Enclave (Apple Silicon) or TPM 2.0 (Windows 11).
                </p>
              </div>
            </div>
          </div>
        </div>
      </EditorialSection>

      {/* 5. CALL TO ACTION */}
      <EditorialSection mode="dark-lab" className="py-20 text-center border-t border-white/10 font-mono">
        <div className="max-w-2xl mx-auto space-y-6">
          <TechnicalLabel className="text-[#A6A6A0]">ENGINE ACCESS</TechnicalLabel>
          <EditorialHeading level={2}>
            TEST THE ENGINE IN YOUR ENVIRONMENT.
          </EditorialHeading>
          <p className="text-sm text-[#A6A6A0] leading-relaxed font-sans">
            Download the client daemon or inspect our transparent pricing roster.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              asChild
              className="bg-[#39FF14] hover:bg-[#32E012] text-[#07090E] font-mono font-bold text-xs uppercase tracking-wider rounded-none px-8 h-12 shadow-[0_1px_3px_rgba(0,0,0,0.4),0_0_12px_rgba(0,229,117,0.2)]"
            >
              <Link href="/download">
                <span>DOWNLOAD COMPILED BINARY</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white/20 bg-transparent hover:bg-white/5 text-[#F1F0EB] font-mono text-xs uppercase tracking-wider rounded-none h-12 px-6"
            >
              <Link href="/protection">
                OPEN FORENSIC WORKBENCH
              </Link>
            </Button>
          </div>
        </div>
      </EditorialSection>
    </PublicShell>
  )
}
