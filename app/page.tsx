"use client"

import React from "react"
import Link from "next/link"
import { PublicShell } from "@/components/layout/public-shell"
import { Preloader } from "@/components/preloader"
import { URLScanner } from "@/components/url-scanner"
import { GlobalThreatRadar } from "@/components/cyber/global-threat-radar"
import { InteractiveTerminal } from "@/components/cyber/interactive-terminal"
import { AttackSimulator } from "@/components/cyber/attack-simulator"
import { HexMemoryDissector } from "@/components/cyber/hex-memory-dissector"
import { TacticalArsenalShowcase } from "@/components/cyber/tactical-arsenal-showcase"
import { HeroInteractiveConsole } from "@/components/cyber/hero-interactive-console"
import { ComparisonBattleMatrix } from "@/components/cyber/comparison-battle-matrix"
import { ThreatSurfaceDiagram } from "@/components/marketing/threat-surface-diagram"
import { ProtectionMatrix } from "@/components/marketing/protection-matrix"
import { HowItWorksPipeline } from "@/components/marketing/how-it-works-pipeline"
import { AIEngineBreakdown } from "@/components/marketing/ai-engine-breakdown"
import { DeviceOnboardingFlow } from "@/components/marketing/device-onboarding-flow"
import { SecurityScore } from "@/components/ui/security-score"
import { ActivityFeed } from "@/components/ui/activity-feed"
import { Button } from "@/components/ui/button"
import { TacticalFrame } from "@/components/ui/tactical-frame"
import { PixelBadge } from "@/components/ui/pixel-badge"
import {
  PixelShield,
  PixelLock,
  PixelDevice,
  PixelIdentity,
} from "@/components/design-system/pixel-icons"
import { MOCK_SECURITY_SCORE, MOCK_ACTIVITY_FEED } from "@/lib/mock/security-data"
import { cyberAudio } from "@/lib/cyber-sound"
import {
  ArrowRight,
  Zap,
  Lock,
  Terminal,
  Activity,
  Crosshair,
  Radio,
  Cpu,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react"

const telemetryStream = [
  { time: "18:04:11", node: "NODE_GLOBAL", event: "ONLINE // ENCLAVE ATTESTED", status: "protected" as const },
  { time: "18:04:14", node: "WEB_SIGNAL", event: "LEXICAL EVALUATION (0.8MS)", status: "monitoring" as const },
  { time: "18:04:17", node: "DOMAIN_REP", event: "HOMOGLYPH CYRILLIC TRAPPED", status: "protected" as const },
  { time: "18:04:21", node: "EBPF_DAEMON", event: "SYSCALL ATTESTATION VALID (UID 0 LOCKED)", status: "protected" as const },
  { time: "18:04:24", node: "IDENTITY_VAULT", event: "SESSION TOKEN ISOLATED IN TPM 2.0", status: "monitoring" as const },
  { time: "18:04:28", node: "DNS_TUNNEL", event: "DoH TLS PINNED & AES-256 ENCRYPTED", status: "protected" as const },
]

export default function HomePage() {
  const [showPreloader, setShowPreloader] = React.useState(true)

  return (
    <>
      {showPreloader && <Preloader onComplete={() => setShowPreloader(false)} duration={3200} />}
      <PublicShell>
        {/* 1. HERO SECTION — TACTICAL CYBER COMMAND CONSOLE */}
        <section className="relative pt-8 pb-16 md:pt-16 md:pb-24 overflow-hidden border-b border-white/15 bg-[#020408]">
          {/* Subtle atmospheric technical grid */}
          <div className="absolute inset-0 technical-grid pointer-events-none opacity-40" />

          <div className="page-container relative z-10">
            {/* Top Protocol Tag */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 sm:mb-8 border-b border-white/10 pb-3 font-mono text-xs text-[#7e8b9b]">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-none bg-[#00ff66] animate-pulse" />
                <span className="text-[#00ff66] font-extrabold tracking-wider">
                  PROTOCOL://AGEIS-X_AUTONOMOUS_DEFENSE
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <span>CORE_ENGINE: <span className="text-[#00ff66] font-bold">ARMED</span></span>
                <span>•</span>
                <span>NODE: GLOBAL_MESH_ATTESTED</span>
                <span>•</span>
                <span>INFERENCE: &lt;0.8MS</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
              {/* Left Editorial / Cyber Command Column */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 border border-[#00ff66]/40 bg-[#00ff66]/10 text-[#00ff66] text-xs font-mono">
                    <Crosshair className="w-3.5 h-3.5" />
                    <span>[ ZERO-KNOWLEDGE CYBERNETIC INTELLIGENCE ]</span>
                  </div>

                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter text-[#f8fafc] leading-[1.03] uppercase">
                    ONE SECURITY BRAIN.<br />
                    <span className="text-[#00ff66] phosphor-glow">FOR YOUR DIGITAL LIFE.</span>
                  </h1>
                </div>

                <p className="text-sm sm:text-base text-[#94a3b8] font-sans max-w-xl leading-relaxed">
                  AgeIS-X is your autonomous digital security shield. It silently protects your phone, laptop, identity, and browsing — automatically detecting and blocking phishing scams, malware, password stealers, and dangerous links with zero slowdown.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2 font-mono">
                  <Button
                    size="lg"
                    onClick={() => cyberAudio.playShield()}
                    className="bg-[#00ff66] hover:bg-[#39ff14] text-[#040608] font-bold tracking-wider text-xs uppercase border border-[#00ff66] shadow-[0_0_20px_rgba(0,255,102,0.35)]"
                    asChild
                  >
                    <Link href="/dashboard">
                      [ ENTER SECURITY CONSOLE ]
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => cyberAudio.playKeyClick()}
                    className="border-white/20 bg-[#060a10] hover:border-[#00ff66]/50 hover:text-[#00ff66] font-mono text-xs uppercase"
                    asChild
                  >
                    <Link href="/download">
                      [ DOWNLOAD CLIENT ]
                    </Link>
                  </Button>
                </div>

                {/* Direct Jump Shortcuts */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2 font-mono text-xs text-[#7e8b9b]">
                  <a
                    href="#threat-radar"
                    onClick={() => cyberAudio.playSonar()}
                    className="inline-flex items-center gap-1.5 hover:text-[#00ff66] transition-colors"
                  >
                    <Radio className="w-3.5 h-3.5 text-[#00ff66]" />
                    <span>&gt; Global Threat Radar ↓</span>
                  </a>
                  <a
                    href="#attack-sandbox"
                    onClick={() => cyberAudio.playAlert()}
                    className="inline-flex items-center gap-1.5 hover:text-[#ff003c] transition-colors"
                  >
                    <Zap className="w-3.5 h-3.5 text-[#ff003c]" />
                    <span>&gt; War Game Sandbox ↓</span>
                  </a>
                  <a
                    href="#comparison-matrix"
                    onClick={() => cyberAudio.playKeyClick()}
                    className="inline-flex items-center gap-1.5 hover:text-[#00f0ff] transition-colors"
                  >
                    <Cpu className="w-3.5 h-3.5 text-[#00f0ff]" />
                    <span>&gt; Battle Matrix ↓</span>
                  </a>
                  <a
                    href="#interactive-terminal"
                    onClick={() => cyberAudio.playKeyClick()}
                    className="inline-flex items-center gap-1.5 hover:text-[#00ff66] transition-colors"
                  >
                    <Terminal className="w-3.5 h-3.5 text-[#00ff66]" />
                    <span>&gt; Hacker Terminal ↓</span>
                  </a>
                </div>

                {/* Monitored Attack Surface Bar */}
                <div className="pt-6 border-t border-white/10 font-mono">
                  <div className="text-[10px] text-[#7e8b9b] uppercase tracking-widest mb-2.5">
                    // MONITORED DIGITAL ATTACK SURFACES
                  </div>
                  <div className="flex flex-wrap gap-2 text-[11px]">
                    {["WEB", "IDENTITY", "KERNEL_EBPF", "DEVICES", "MEMORY", "NETWORK", "PRIVACY", "DATA"].map((node, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 border border-white/15 bg-[#060a10] text-[#f8fafc] flex items-center gap-1.5 font-bold hover:border-[#00ff66]/50 transition-colors"
                      >
                        <span className="w-1.5 h-1.5 bg-[#00ff66]" />
                        {node}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Interactive Tactical Holo-Display Console */}
              <div className="lg:col-span-5 w-full">
                <HeroInteractiveConsole />
              </div>
            </div>
          </div>
        </section>

        {/* 2. INSTANT THREAT VECTOR & URL DISSECTOR */}
        <section id="live-analyzer" className="border-b border-white/15 bg-[#03060a]">
          <URLScanner />
        </section>

        {/* 3. GLOBAL THREAT RADAR & ATTACK INTERCEPTOR (CENTRAL CYBER WEAPON) */}
        <section id="threat-radar" className="py-20 bg-[#020408] border-b border-white/15">
          <div className="page-container">
            <GlobalThreatRadar />
          </div>
        </section>

        {/* 4. LIVE ATTACK VECTOR EXPLOIT SIMULATOR (WAR-GAME SANDBOX) */}
        <section id="attack-sandbox" className="py-20 bg-[#04070d] border-b border-white/15">
          <div className="page-container">
            <AttackSimulator />
          </div>
        </section>

        {/* 5. ARCHITECTURAL COMPARISON BATTLE MATRIX (LEGACY VS AGEIS-X) */}
        <section id="comparison-matrix" className="py-20 bg-[#020408] border-b border-white/15">
          <div className="page-container">
            <ComparisonBattleMatrix />
          </div>
        </section>

        {/* 6. TACTICAL ARSENAL & TECHWEAR SPECIFICATION */}
        <section className="py-20 bg-[#04070d] border-b border-white/15">
          <div className="page-container">
            <TacticalArsenalShowcase />
          </div>
        </section>

        {/* 7. INTERACTIVE HACKER COMMAND TERMINAL (CLI SHELL) */}
        <section id="interactive-terminal" className="py-20 bg-[#020408] border-b border-white/15">
          <div className="page-container">
            <InteractiveTerminal />
          </div>
        </section>

        {/* 8. LIVE HARDWARE ENCLAVE MEMORY & BYTE DISSECTOR */}
        <section className="py-16 bg-[#04070d] border-b border-white/15">
          <div className="page-container">
            <HexMemoryDissector />
          </div>
        </section>

        {/* 9. THE ATTACK SURFACE PROBLEM & ARCHITECTURAL DISRUPTION */}
        <section className="py-20 bg-[#020408] border-b border-white/15 relative font-mono">
          <div className="page-container space-y-10">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 text-xs text-[#00ff66] uppercase tracking-wider">
                <span>// THREAT LANDSCAPE DISRUPTION</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#f8fafc] uppercase tracking-tight">
                YOUR DIGITAL SURFACE IS LARGER THAN YOUR SCREEN.
              </h2>
              <p className="text-xs sm:text-sm text-[#94a3b8] font-sans leading-relaxed">
                Traditional antivirus checks known file hashes. Ad-blockers filter superficial DOM elements. Disconnected tools create exploitable fissures. AgeIS-X fuses network, memory, identity, DNS, and syscall heuristics into a singular sovereign defense shield.
              </p>
            </div>

            <ThreatSurfaceDiagram />
          </div>
        </section>

        {/* 10. SECURITY SURFACE GRID — DEFENSE DOMAINS */}
        <section className="py-16 bg-[#04070d] border-b border-white/15 font-mono">
          <div className="page-container space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs text-[#7e8b9b]">
              <span className="uppercase font-bold text-[#f8fafc]">// DEFENSE DOMAINS SUMMARY</span>
              <span>SYSTEM_SPEC // V2.0-TACTICAL</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-4 border border-white/10 bg-[#020408] space-y-2 hover:border-[#00ff66]/50 transition-colors">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-xs font-bold text-[#00ff66]">01 // WEB &amp; DOH</span>
                  <PixelShield size={16} color="#00ff66" />
                </div>
                <ul className="text-xs text-[#7e8b9b] space-y-1">
                  <li>&bull; HOMOGLYPH SPOOFING</li>
                  <li>&bull; ZERO-DAY PHISHING LINKS</li>
                  <li>&bull; DRIVE-BY JIT EXPLOITS</li>
                </ul>
              </div>

              <div className="p-4 border border-white/10 bg-[#020408] space-y-2 hover:border-[#00f0ff]/50 transition-colors">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-xs font-bold text-[#00f0ff]">02 // IDENTITY VAULT</span>
                  <PixelIdentity size={16} color="#00f0ff" />
                </div>
                <ul className="text-xs text-[#7e8b9b] space-y-1">
                  <li>&bull; OAUTH SESSION CLONING</li>
                  <li>&bull; CLIPBOARD MEMORY DUMP</li>
                  <li>&bull; DARK WEB LEAK TRACING</li>
                </ul>
              </div>

              <div className="p-4 border border-white/10 bg-[#020408] space-y-2 hover:border-[#ffb800]/50 transition-colors">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-xs font-bold text-[#ffb800]">03 // KERNEL &amp; EBPF</span>
                  <PixelDevice size={16} color="#ffb800" />
                </div>
                <ul className="text-xs text-[#7e8b9b] space-y-1">
                  <li>&bull; ROOTKIT SYSCALL HOOKS</li>
                  <li>&bull; MASS-ENCRYPTION DAEMONS</li>
                  <li>&bull; PRIVILEGE ESCALATION (UID 0)</li>
                </ul>
              </div>

              <div className="p-4 border border-white/10 bg-[#020408] space-y-2 hover:border-white/50 transition-colors">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-xs font-bold text-[#f8fafc]">04 // DATA EXFIL CLOAK</span>
                  <PixelLock size={16} color="#f8fafc" />
                </div>
                <ul className="text-xs text-[#7e8b9b] space-y-1">
                  <li>&bull; HARDWARE ENCLAVE CIPHER</li>
                  <li>&bull; API TOKEN LEAK PREVENT</li>
                  <li>&bull; ZERO-KNOWLEDGE MESH ATTEST</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 11. AGEIS-X PROTECTION MATRIX */}
        <section className="py-20 bg-[#020408] border-b border-white/15 font-mono">
          <div className="page-container space-y-8">
            <div className="max-w-2xl space-y-2">
              <div className="text-xs text-[#00ff66] uppercase tracking-wider">
                // COMPREHENSIVE COVERAGE MATRIX
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#f8fafc] uppercase tracking-tight">
                TEN DEDICATED PROTECTION LAYERS
              </h2>
              <p className="text-xs text-[#7e8b9b] font-sans leading-relaxed">
                Explore how AgeIS-X systematically monitors and mitigates attack vectors across web, communications, endpoints, identity, and AI surfaces with clear capability statuses.
              </p>
            </div>

            <ProtectionMatrix />
          </div>
        </section>

        {/* 12. HOW AGEIS-X WORKS */}
        <section className="py-20 bg-[#04070d] border-b border-white/15 font-mono">
          <div className="page-container space-y-8">
            <div className="max-w-2xl space-y-2">
              <div className="text-xs text-[#00ff66] uppercase tracking-wider">
                // DETECTION &amp; RESPONSE LIFECYCLE
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#f8fafc] uppercase tracking-tight">
                SIGNALS IN. INTELLIGENCE THROUGH. ACTION OUT.
              </h2>
              <p className="text-xs text-[#7e8b9b] font-sans leading-relaxed">
                AgeIS-X is not a simple static lookup database. It evaluates multidimensional telemetry signals in real-time, performing deterministic actions without human latency.
              </p>
            </div>

            <HowItWorksPipeline />
          </div>
        </section>

        {/* 13. AI SECURITY ENGINE SECTION */}
        <section className="py-20 bg-[#020408] border-b border-white/15">
          <div className="page-container">
            <AIEngineBreakdown />
          </div>
        </section>

        {/* 14. LIVE TELEMETRY STREAM SIMULATION */}
        <section className="py-16 bg-[#04070d] border-b border-white/15 font-mono">
          <div className="page-container space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#f8fafc] uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#00ff66]" />
                  <span>REAL-TIME ENCLAVE TELEMETRY STREAM</span>
                </h3>
                <p className="text-[11px] text-[#7e8b9b] font-sans mt-0.5">
                  Demonstration telemetry feed illustrating multi-vector event correlation across edge nodes.
                </p>
              </div>
              <PixelBadge variant="outline" size="sm">
                LIVE // STREAM FEED
              </PixelBadge>
            </div>

            <div className="border border-white/15 bg-[#020408] p-4 space-y-2">
              {telemetryStream.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-white/5 last:border-0 font-mono">
                  <div className="flex items-center gap-3">
                    <span className="text-[#7e8b9b]">[{item.time}]</span>
                    <span className="text-[#00f0ff] font-bold">{item.node}</span>
                    <span className="text-white/40 hidden sm:inline">&bull;&bull;&bull;&bull;&bull;&bull;</span>
                    <span className="text-[#f8fafc]">{item.event}</span>
                  </div>
                  <PixelBadge variant={item.status === "protected" ? "phosphor" : "cyan"} size="sm">
                    {item.status === "protected" ? "VERIFIED" : "SURVEILLANCE"}
                  </PixelBadge>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 15. USER SECURITY CONSOLE DEMO PREVIEW */}
        <section className="py-20 bg-[#020408] border-b border-white/15 font-mono">
          <div className="page-container space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="text-xs text-[#00ff66] uppercase tracking-wider">
                  // SINGLE-PANE OPERATIONAL VISIBILITY
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#f8fafc] uppercase tracking-tight mt-1">
                  THE AGEIS-X SECURITY COCKPIT
                </h2>
                <p className="text-xs text-[#7e8b9b] font-sans mt-1">
                  A unified operational console displaying your real-time posture score, active shields, and historical audit trail.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => cyberAudio.playKeyClick()}
                asChild
                className="border-white/20 bg-[#040608] hover:border-[#00ff66]/40 hover:text-[#00ff66] font-mono text-xs"
              >
                <Link href="/dashboard">
                  [ ENTER CONSOLE DEMO &rarr; ]
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-6">
                <SecurityScore data={MOCK_SECURITY_SCORE} />
              </div>
              <div className="lg:col-span-6 rounded-none border border-white/15 bg-[#040608] p-5">
                <ActivityFeed
                  items={MOCK_ACTIVITY_FEED}
                  title="HISTORICAL AUDIT ACTIVITY LOG"
                  maxItems={3}
                />
              </div>
            </div>
          </div>
        </section>

        {/* 16. DEVICE ONBOARDING */}
        <section className="py-20 bg-[#04070d] border-b border-white/15">
          <div className="page-container">
            <DeviceOnboardingFlow />
          </div>
        </section>

        {/* 17. ZERO-KNOWLEDGE CRYPTOGRAPHIC PRIVACY */}
        <section className="py-20 bg-[#020408] border-b border-white/15 font-mono">
          <div className="page-container">
            <TacticalFrame variant="panel" reticles className="p-6 sm:p-8 space-y-6 bg-[#03060a]">
              <div className="max-w-2xl">
                <div className="text-[10px] uppercase tracking-widest text-[#00ff66] mb-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  <span>CRYPTOGRAPHIC_ASSURANCE // ZERO-KNOWLEDGE</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#f8fafc]">
                  Zero-Knowledge Telemetry. Local Cryptographic Processing.
                </h3>
                <p className="text-xs text-[#7e8b9b] font-sans mt-2 leading-relaxed">
                  Your raw telemetry, browsing history, and private identifiers never leave your device unencrypted. All threat analysis vectors are calculated locally in hardware enclaves before anonymized cryptographic hashes sync across the global mesh.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                <div className="p-3 border border-white/10 bg-[#020408] space-y-1">
                  <span className="text-[10px] text-[#7e8b9b] block">LOCAL ENCLAVE:</span>
                  <span className="text-xs font-bold text-[#00ff66]">HARDWARE ISOLATED (AES-256)</span>
                </div>
                <div className="p-3 border border-white/10 bg-[#020408] space-y-1">
                  <span className="text-[10px] text-[#7e8b9b] block">TELEMETRY PRIVACY:</span>
                  <span className="text-xs font-bold text-[#00f0ff]">ZERO CLOUD LOGGING</span>
                </div>
                <div className="p-3 border border-white/10 bg-[#020408] space-y-1">
                  <span className="text-[10px] text-[#7e8b9b] block">ATTESTATION:</span>
                  <span className="text-xs font-bold text-white">CRYPTOGRAPHICALLY SIGNED</span>
                </div>
              </div>
            </TacticalFrame>
          </div>
        </section>

        {/* 18. FINAL CALL TO ACTION — SYSTEM DEPLOYMENT */}
        <section className="py-24 bg-gradient-to-b from-[#04070d] to-[#020408] border-b border-white/15 text-center font-mono">
          <div className="page-container max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#00ff66]/40 bg-[#00ff66]/10 text-[#00ff66] text-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>[ SOVEREIGN CYBER DEFENSE ENGINE READY ]</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#f8fafc] uppercase tracking-tight leading-tight">
              ARM YOUR DIGITAL PERIMETER IN 60 SECONDS.
            </h2>

            <p className="text-xs sm:text-sm text-[#94a3b8] font-sans max-w-lg mx-auto leading-relaxed">
              Experience the power of autonomous zero-knowledge cybersecurity. No bloated background agents, zero tracking, sub-millisecond response.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Button
                size="lg"
                onClick={() => cyberAudio.playShield()}
                className="bg-[#00ff66] hover:bg-[#39ff14] text-[#040608] font-bold text-xs uppercase border border-[#00ff66] shadow-[0_0_25px_rgba(0,255,102,0.4)] px-6"
                asChild
              >
                <Link href="/dashboard">
                  [ ENTER SOVEREIGN CONSOLE ]
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => cyberAudio.playKeyClick()}
                className="border-white/20 bg-[#060a10] hover:border-[#00ff66]/40 hover:text-[#00ff66] text-xs uppercase px-6"
                asChild
              >
                <Link href="/login">
                  [ 1-CLICK DEMO LOGIN ]
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </PublicShell>
    </>
  )
}