import React from "react"
import Link from "next/link"
import { PublicShell } from "@/components/layout/public-shell"
import { ProtectionMatrix } from "@/components/marketing/protection-matrix"
import { Button } from "@/components/ui/button"
import { TacticalFrame } from "@/components/ui/tactical-frame"
import { PixelBadge } from "@/components/ui/pixel-badge"
import { TerminalBox } from "@/components/ui/terminal-box"
import { ShieldCheck, ArrowRight, Terminal, Layers, Lock, Cpu } from "lucide-react"

export default function ProtectionPage() {
  return (
    <PublicShell>
      {/* Header */}
      <section className="py-16 md:py-20 border-b border-white/10 bg-[#040608] font-mono relative">
        <div className="absolute inset-0 technical-grid opacity-25 pointer-events-none" />
        <div className="page-container max-w-4xl text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 border border-[#00ff66]/30 bg-[#00ff66]/10 text-[#00ff66] text-xs">
            <Terminal className="w-3.5 h-3.5" />
            <span>ARCHITECTURE // UNIFIED DEFENSE SPECIFICATION</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#f8fafc] uppercase">
            PROTECTION ACROSS 10 CRITICAL SURFACES
          </h1>
          <p className="text-xs sm:text-sm text-[#7e8b9b] font-sans max-w-2xl mx-auto leading-relaxed">
            AgeIS-X consolidates fragmented point tools into one integrated operating system. Inspect how each protection domain functions, from live capabilities to planned roadmap features.
          </p>
        </div>
      </section>

      {/* Main Interactive Matrix */}
      <section className="py-16 bg-[#080c10] border-b border-white/10 font-mono">
        <div className="page-container space-y-8">
          <div className="max-w-2xl">
            <div className="text-xs text-[#00ff66] uppercase tracking-wider mb-1">// COVERAGE TELEMETRY</div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#f8fafc] uppercase">INTERACTIVE PROTECTION MATRIX</h2>
            <p className="text-xs text-[#7e8b9b] font-sans mt-1">
              Select any domain below to inspect targeted threat vectors, detection methodology, and production status.
            </p>
          </div>

          <ProtectionMatrix />
        </div>
      </section>

      {/* 4-Stage Response Lifecycle */}
      <section className="py-16 bg-[#040608] border-b border-white/10 font-mono">
        <div className="page-container space-y-8">
          <div className="max-w-2xl">
            <div className="text-xs text-[#00ff66] uppercase tracking-wider mb-1">// OPERATIONAL PROTOCOL</div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#f8fafc] uppercase">THE 4-STAGE AUTONOMOUS DEFENSE CYCLE</h2>
            <p className="text-xs text-[#7e8b9b] font-sans mt-1">
              How every protection layer continuously operates without human latency.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-4 border border-white/10 bg-[#080c10] space-y-2">
              <span className="text-xs text-[#00ff66] font-bold block">[01 // INGEST &amp; INTERCEPT]</span>
              <h3 className="text-xs font-bold text-[#f8fafc]">ZERO-OVERHEAD PROBES</h3>
              <p className="text-xs text-[#7e8b9b] font-sans leading-relaxed">
                Passive sensor hooks capture URL handshakes, socket requests, and file downloads as they occur.
              </p>
            </div>

            <div className="p-4 border border-white/10 bg-[#080c10] space-y-2">
              <span className="text-xs text-[#00f0ff] font-bold block">[02 // ANALYZE &amp; VECTORIZE]</span>
              <h3 className="text-xs font-bold text-[#f8fafc]">SUB-28MS INFERENCE</h3>
              <p className="text-xs text-[#7e8b9b] font-sans leading-relaxed">
                Specialized NLP and behavioral models calculate risk probability and flag known anomaly patterns.
              </p>
            </div>

            <div className="p-4 border border-white/10 bg-[#080c10] space-y-2">
              <span className="text-xs text-[#ffb800] font-bold block">[03 // MITIGATE &amp; ISOLATE]</span>
              <h3 className="text-xs font-bold text-[#f8fafc]">DETERMINISTIC ACTION</h3>
              <p className="text-xs text-[#7e8b9b] font-sans leading-relaxed">
                Rogue connections are dropped, malicious binaries are quarantined, and session tokens are shielded.
              </p>
            </div>

            <div className="p-4 border border-white/10 bg-[#080c10] space-y-2">
              <span className="text-xs text-[#f8fafc] font-bold block">[04 // AUDIT FEEDBACK]</span>
              <h3 className="text-xs font-bold text-[#f8fafc]">CLEAR EXPLANATIONS</h3>
              <p className="text-xs text-[#7e8b9b] font-sans leading-relaxed">
                Users receive actionable context explaining what occurred, why it was stopped, and ongoing safety advice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-[#080c10] text-center font-mono">
        <div className="page-container max-w-xl space-y-4">
          <h3 className="text-xl sm:text-2xl font-bold text-[#f8fafc] uppercase">READY TO INITIALIZE DEFENSE?</h3>
          <p className="text-xs text-[#7e8b9b] font-sans leading-relaxed">
            Run a diagnostic scan on any URL vector or download the native client.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Button className="bg-[#00ff66] hover:bg-[#39ff14] text-[#040608] font-bold text-xs uppercase" asChild>
              <Link href="/download">[ DOWNLOAD CLIENT ]</Link>
            </Button>
            <Button variant="outline" className="border-white/20 bg-[#040608] text-xs uppercase" asChild>
              <Link href="/#live-analyzer">[ TRY URL ANALYZER ]</Link>
            </Button>
          </div>
        </div>
      </section>
    </PublicShell>
  )
}
