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
import { SecuritySticker } from "@/components/design-system/pixel-art-system"
import { Terminal, Cpu, Server, Code2, Lock, ArrowRight, Binary } from "lucide-react"

export default function TechnologyPage() {
  return (
    <PublicShell>
      {/* 1. HERO (MODE B - EDITORIAL RESEARCH WHITE-PAPER) */}
      <EditorialSection mode="editorial-black" className="pt-10 pb-16 md:pt-16 md:pb-24">
        <div className="space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <SignalMarker status="active" label="TECHNICAL ARCHITECTURE SPEC" />
              <span className="text-white/30 text-xs font-mono">/</span>
              <TechnicalLabel>DOCUMENT ID: SPEC-2026-X</TechnicalLabel>
            </div>
            <div className="flex items-center gap-3">
              <SecuritySticker type="encryption_freedom" size="sm" />
            </div>
          </div>

          <div className="max-w-4xl space-y-6">
            <EditorialHeading level={1} className="leading-[0.92]">
              THE AGEIS-X
              <br />
              <span className="text-[#A6A6A0]">TECHNOLOGY SPECIFICATION.</span>
            </EditorialHeading>

            <p className="text-base sm:text-lg text-[#A6A6A0] max-w-2xl leading-relaxed font-sans font-normal">
              A transparent architectural breakdown of what is running in production today, what is in active development, and our long-term cryptographic research roadmap.
            </p>
          </div>
        </div>
      </EditorialSection>

      {/* 2. TIER 1: OPERATIONAL BASELINE (MODE A - DARK LAB) */}
      <EditorialSection mode="dark-lab" className="py-20 md:py-28 border-b border-white/10">
        <div className="space-y-12 font-mono">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
            <div className="space-y-2">
              <TechnicalLabel className="text-[#39FF14]">TIER 1 • OPERATIONAL BASELINE</TechnicalLabel>
              <EditorialHeading level={2}>CURRENT PRODUCTION IMPLEMENTATION</EditorialHeading>
            </div>
            <span className="text-xs px-2 py-1 bg-[#39FF14]/10 text-[#39FF14] border border-[#39FF14]/20">
              ACTIVE IN INGESTION API
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 border border-white/10">
            <div className="p-6 bg-[#050505] space-y-3">
              <Cpu className="w-5 h-5 text-[#39FF14]" />
              <h3 className="text-sm font-bold text-[#F1F0EB] uppercase">
                TF-IDF Character N-Gram Vectorizer
              </h3>
              <p className="text-xs text-[#A6A6A0] leading-relaxed font-sans font-normal">
                Tokenizes uniform resource identifiers into sliding 3-gram to 5-gram substrings, capturing subtle brand impersonations, character substitutions, and obfuscated subdomains.
              </p>
            </div>

            <div className="p-6 bg-[#050505] space-y-3">
              <Server className="w-5 h-5 text-[#39FF14]" />
              <h3 className="text-sm font-bold text-[#F1F0EB] uppercase">
                FastAPI Asynchronous Microservice
              </h3>
              <p className="text-xs text-[#A6A6A0] leading-relaxed font-sans font-normal">
                High-performance Python/Uvicorn REST daemon serving the <code className="text-[#39FF14] font-mono text-xs">/predict</code> endpoint with sub-30ms execution and non-blocking IO.
              </p>
            </div>

            <div className="p-6 bg-[#050505] space-y-3">
              <Code2 className="w-5 h-5 text-[#39FF14]" />
              <h3 className="text-sm font-bold text-[#F1F0EB] uppercase">
                Deterministic Feature Extractor
              </h3>
              <p className="text-xs text-[#A6A6A0] leading-relaxed font-sans font-normal">
                Extracts lexical flags including HTTPS protocol presence, suspicious keyword density, domain entropy, and redirect count.
              </p>
            </div>
          </div>

          {/* Raw Protocol Inspection */}
          <div className="border border-white/10 bg-[#080808] p-6 space-y-4">
            <div className="flex items-center justify-between text-xs border-b border-white/10 pb-3">
              <span className="font-bold text-[#F1F0EB] uppercase">Live Microservice Ingestion Protocol</span>
              <span className="text-[#39FF14]">POST /predict</span>
            </div>
            <pre className="text-xs text-[#A6A6A0] p-4 bg-[#050505] border border-white/10 overflow-x-auto leading-relaxed">
{`# Sample cURL Request to local or cluster daemon:
curl -X POST "http://127.0.0.1:8000/predict" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://secure-portal-verify.cc/login"}'

# Structured JSON Verdict Payload:
{
  "url": "https://secure-portal-verify.cc/login",
  "prediction": "malicious",
  "probability": 0.942,
  "features": {
    "has_https": true,
    "suspicious_keywords": true,
    "domain_age_days": 1
  },
  "latency_ms": 14.8
}`}
            </pre>
          </div>
        </div>
      </EditorialSection>

      {/* 3. TIER 2: ACTIVE PROTOTYPES (MODE C - OFF-WHITE PAPER TEXTURE) */}
      <EditorialSection mode="off-white-editorial" className="py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start font-mono">
          <div className="lg:col-span-4 space-y-3">
            <TechnicalLabel className="text-[#6F706D] font-bold">TIER 2 • ENGINEERING PROTOTYPE</TechnicalLabel>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#050505] tracking-tight leading-tight uppercase">
              PLANNED SYSTEM ARCHITECTURE.
            </h2>
            <p className="text-xs text-[#6F706D] leading-relaxed font-sans">
              Currently implemented in private testing branches undergoing security review.
            </p>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div className="divide-y divide-[#242424]/15 border-t border-b border-[#242424]/15">
              <div className="py-6 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-[#050505] uppercase">Sandboxed eBPF Probes (Linux / macOS)</h3>
                  <span className="text-[10px] px-2 py-0.5 bg-[#050505] text-[#F1F0EB]">PROTOTYPE</span>
                </div>
                <p className="text-sm text-[#6F706D] font-sans">
                  In-kernel programs attached to kprobes and tracepoints to intercept unauthorized memory manipulations, raw socket binds, and ransomware bulk encryption syscalls.
                </p>
              </div>

              <div className="py-6 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-[#050505] uppercase">Zero-Knowledge Hardware Vault</h3>
                  <span className="text-[10px] px-2 py-0.5 bg-[#050505] text-[#F1F0EB]">PROTOTYPE</span>
                </div>
                <p className="text-sm text-[#6F706D] font-sans">
                  Local SQLite database encrypted with AES-256 GCM using keys stored in the platform Secure Enclave (Apple Silicon) or TPM 2.0 (Windows 11).
                </p>
              </div>
            </div>
          </div>
        </div>
      </EditorialSection>

      {/* 4. TIER 3: RESEARCH ROADMAP */}
      <EditorialSection mode="dark-lab" className="py-20 text-center border-t border-white/10">
        <div className="max-w-2xl mx-auto space-y-6 font-mono">
          <TechnicalLabel className="text-[#A6A6A0]">TIER 3 • CRYPTOGRAPHIC ROADMAP</TechnicalLabel>
          <EditorialHeading level={2}>
            JOIN THE OPEN RESEARCH EFFORT.
          </EditorialHeading>
          <p className="text-sm text-[#A6A6A0] leading-relaxed font-sans">
            Homomorphic encryption pipelines and verifiable zero-knowledge threat attestations for decentralized telemetry without metadata exposure.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              asChild
              className="bg-[#39FF14] hover:bg-[#32e012] text-[#050505] font-mono font-bold text-xs uppercase tracking-wider rounded-none px-8 h-12"
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
              <Link href="/how-it-works">
                VIEW HOW IT WORKS
              </Link>
            </Button>
          </div>
        </div>
      </EditorialSection>
    </PublicShell>
  )
}
