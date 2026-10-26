"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Shield, Cpu, Lock, CheckCircle2, ArrowRight, Zap, Radio, Activity } from "lucide-react"
import { PointerDepthCard } from "./pointer-depth-card"
import { MagneticButton } from "./magnetic-button"
import { Button } from "@/components/ui/button"

export function DualEnclaveShowcase() {
  return (
    <div className="space-y-12 font-mono">
      {/* Editorial Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#39FF14] tracking-wider uppercase">
            <span className="w-2 h-2 bg-[#39FF14] inline-block animate-pulse" />
            <span>03 // ARCHITECTURAL DUAL ENCLAVE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase text-[#F1F0EB] tracking-tight">
            HARDWARE-BOUND DEFENSE STACK
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[#A6A6A0] max-w-md font-sans leading-relaxed">
          AgeIS-X operates as a dual-engine architecture: an on-device neural tokenization core coupled with a zero-delay hardware perimeter shield.
        </p>
      </div>

      {/* Dual Enclave Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Enclave Module 01: Neural Core */}
        <PointerDepthCard
          depthLevel="medium"
          glowColor="green"
          className="p-6 sm:p-8 bg-[#04060A] border border-white/15 flex flex-col justify-between space-y-6 relative overflow-hidden group shadow-2xl"
        >
          {/* Ambient Lighting Backdrop */}
          <div
            className="pointer-events-none absolute -top-20 -right-20 w-80 h-80 bg-[#39FF14]/[0.08] blur-[120px] rounded-full group-hover:bg-[#39FF14]/[0.14] transition-all duration-500"
            aria-hidden="true"
          />

          <div className="space-y-6 relative z-10">
            {/* Top Badge */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-[#39FF14]" />
                <span className="text-xs font-black uppercase tracking-wider text-[#F1F0EB]">
                  CORE // 01: NEURAL TOKENIZER
                </span>
              </div>
              <span className="text-[10px] text-[#39FF14] font-bold border border-[#39FF14]/30 px-2 py-0.5 bg-[#39FF14]/10">
                LOCAL INFERENCE
              </span>
            </div>

            {/* Neural Core Image Stage with 3D Hover & Scanning Line */}
            <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] bg-[#07090E] border border-white/10 overflow-hidden group/image">
              <Image
                src="/ageis-x/technology/neural-core.webp"
                alt="AgeIS-X Local Neural Core Architecture"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center filter contrast-[1.1] brightness-[0.92] group-hover/image:scale-[1.03] transition-transform duration-700 ease-out"
              />

              {/* Laser Horizon Sweep */}
              <div
                className="pointer-events-none absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#39FF14] to-transparent opacity-50 animate-laser-sweep"
                aria-hidden="true"
              />

              {/* Holographic Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#04060A] via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-3 left-3 px-2 py-1 bg-[#04060A]/90 border border-white/15 text-[9px] text-[#39FF14] font-mono">
                MODEL: TF-IDF + NAIVE BAYES ENSEMBLE
              </div>
              <div className="absolute bottom-3 right-3 px-2 py-1 bg-[#04060A]/90 border border-white/15 text-[9px] text-[#F1F0EB] font-mono">
                ENCLAVE RAM: &lt; 38 MB
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3">
              <h3 className="text-lg sm:text-xl font-bold uppercase text-[#F1F0EB] group-hover:text-[#39FF14] transition-colors">
                Sandboxed On-Device NLP Engine
              </h3>
              <p className="text-xs sm:text-sm text-[#A6A6A0] font-sans leading-relaxed">
                Evaluates URL character distributions, n-gram entropy, domain age, and homoglyph patterns locally on your CPU/NPU without sending browsing history or queries to external servers.
              </p>
            </div>

            {/* Telemetry Metrics */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/10 text-center font-mono">
              <div className="p-2 bg-white/[0.02] border border-white/5">
                <span className="text-[9px] text-[#A6A6A0] uppercase block">LATENCY</span>
                <span className="text-sm font-black text-[#39FF14]">&lt; 18ms</span>
              </div>
              <div className="p-2 bg-white/[0.02] border border-white/5">
                <span className="text-[9px] text-[#A6A6A0] uppercase block">CLOUD EGRESS</span>
                <span className="text-sm font-black text-[#F1F0EB]">0 BYTES</span>
              </div>
              <div className="p-2 bg-white/[0.02] border border-white/5">
                <span className="text-[9px] text-[#A6A6A0] uppercase block">ACCURACY</span>
                <span className="text-sm font-black text-[#39FF14]">99.8%</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-4">
            <MagneticButton strength={3.5} className="w-full">
              <Button
                variant="outline"
                size="sm"
                className="w-full font-mono text-[11px] uppercase tracking-wider h-10 rounded-none border-white/20 bg-transparent hover:bg-white/10 text-[#F1F0EB] group-hover:border-[#39FF14]/50 group-hover:text-[#39FF14] transition-colors"
                asChild
              >
                <Link href="/technology">
                  <span>INSPECT NEURAL BENCHMARKS</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-2" />
                </Link>
              </Button>
            </MagneticButton>
          </div>
        </PointerDepthCard>

        {/* Enclave Module 02: Shield Unit */}
        <PointerDepthCard
          depthLevel="medium"
          glowColor="cyan"
          className="p-6 sm:p-8 bg-[#04060A] border border-white/15 flex flex-col justify-between space-y-6 relative overflow-hidden group shadow-2xl"
        >
          {/* Ambient Lighting Backdrop */}
          <div
            className="pointer-events-none absolute -top-20 -right-20 w-80 h-80 bg-[#00E5FF]/[0.08] blur-[120px] rounded-full group-hover:bg-[#00E5FF]/[0.14] transition-all duration-500"
            aria-hidden="true"
          />

          <div className="space-y-6 relative z-10">
            {/* Top Badge */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#00E5FF]" />
                <span className="text-xs font-black uppercase tracking-wider text-[#F1F0EB]">
                  CORE // 02: PERIMETER SHIELD
                </span>
              </div>
              <span className="text-[10px] text-[#00E5FF] font-bold border border-[#00E5FF]/30 px-2 py-0.5 bg-[#00E5FF]/10">
                ACTIVE INGRESS
              </span>
            </div>

            {/* Shield Unit Image Stage with 3D Hover & Scanning Line */}
            <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] bg-[#07090E] border border-white/10 overflow-hidden group/image">
              <Image
                src="/ageis-x/protection/shield-unit.webp"
                alt="AgeIS-X Hardware Perimeter Shield Unit"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center filter contrast-[1.1] brightness-[0.92] group-hover/image:scale-[1.03] transition-transform duration-700 ease-out"
              />

              {/* Laser Horizon Sweep */}
              <div
                className="pointer-events-none absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent opacity-50 animate-laser-sweep"
                aria-hidden="true"
              />

              {/* Holographic Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#04060A] via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-3 left-3 px-2 py-1 bg-[#04060A]/90 border border-white/15 text-[9px] text-[#00E5FF] font-mono">
                LAYER: SOCKET &amp; TLS PRE-FLIGHT
              </div>
              <div className="absolute bottom-3 right-3 px-2 py-1 bg-[#04060A]/90 border border-white/15 text-[9px] text-[#F1F0EB] font-mono">
                SPEC: EAL6+ COMPLIANT
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3">
              <h3 className="text-lg sm:text-xl font-bold uppercase text-[#F1F0EB] group-hover:text-[#00E5FF] transition-colors">
                Autonomous Perimeter Interceptor
              </h3>
              <p className="text-xs sm:text-sm text-[#A6A6A0] font-sans leading-relaxed">
                Prevents reverse-proxy session hijacks, defangs Cyrillic homoglyph lookalikes, blocks suspicious QR-code redirects, and isolates zero-hour payloads into ephemeral cryptographic sandboxes.
              </p>
            </div>

            {/* Telemetry Metrics */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/10 text-center font-mono">
              <div className="p-2 bg-white/[0.02] border border-white/5">
                <span className="text-[9px] text-[#A6A6A0] uppercase block">PRE-TLS DELAY</span>
                <span className="text-sm font-black text-[#00E5FF]">&lt; 2ms</span>
              </div>
              <div className="p-2 bg-white/[0.02] border border-white/5">
                <span className="text-[9px] text-[#A6A6A0] uppercase block">HOMOGLYPH CHECK</span>
                <span className="text-sm font-black text-[#F1F0EB]">PUNYCODE RFC</span>
              </div>
              <div className="p-2 bg-white/[0.02] border border-white/5">
                <span className="text-[9px] text-[#A6A6A0] uppercase block">CPU OVERHEAD</span>
                <span className="text-sm font-black text-[#00E5FF]">&lt; 0.4%</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-4">
            <MagneticButton strength={3.5} className="w-full">
              <Button
                variant="outline"
                size="sm"
                className="w-full font-mono text-[11px] uppercase tracking-wider h-10 rounded-none border-white/20 bg-transparent hover:bg-white/10 text-[#F1F0EB] group-hover:border-[#00E5FF]/50 group-hover:text-[#00E5FF] transition-colors"
                asChild
              >
                <Link href="/protection">
                  <span>INSPECT SHIELD PROTOCOLS</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-2" />
                </Link>
              </Button>
            </MagneticButton>
          </div>
        </PointerDepthCard>
      </div>
    </div>
  )
}
