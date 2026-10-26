"use client"

import * as React from "react"
import { Shield, AlertTriangle, CheckCircle2, Terminal, Play, RotateCcw, Zap, Lock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PointerDepthCard } from "./pointer-depth-card"
import { cn } from "@/lib/utils"

export interface AttackVectorScenario {
  id: string
  name: string
  category: string
  rawPayload: string
  exploitMechanism: string
  defangMethod: string
  latencyMs: number
  riskScore: number
  heuristicProof: string[]
}

const SCENARIOS: AttackVectorScenario[] = [
  {
    id: "homoglyph",
    name: "CYRILLIC HOMOGLYPH SPOOF",
    category: "Punycode URL Impersonation",
    rawPayload: "https://paypаl-verify.secure-token.xyz/login?session=steal",
    exploitMechanism: "Substitutes Latin 'a' (U+0061) with Cyrillic 'а' (U+0430) to bypass browser visual inspection.",
    defangMethod: "Decodes RFC-3492 punycode ('xn--paypl-verify-q1a'), isolates Cyrillic code-block, halts socket handshake.",
    latencyMs: 14.2,
    riskScore: 99.8,
    heuristicProof: [
      "[0.0ms] Ingress socket received pre-flight request",
      "[1.4ms] RFC-3492 punycode transform: xn--paypl-verify-q1a.secure-token.xyz",
      "[4.8ms] Mixed script detection: Cyrillic codepoint U+0430 detected in financial brand token",
      "[10.2ms] Domain age cross-reference: Created 4 hours ago (Registrar: Epik Inc)",
      "[14.2ms] DECISION: MALICIOUS (99.8% risk). Connection defanged and aborted.",
    ],
  },
  {
    id: "aitm",
    name: "AITM REVERSE-PROXY SESSION STEALER",
    category: "Credential & Cookie Harvester",
    rawPayload: "https://login.microsoftonline.corp-enclave.work/auth/session-token",
    exploitMechanism: "Proxies live Microsoft 365 MFA session to intercept session cookies in real time.",
    defangMethod: "Analyzes TLS certificate chain mismatch and domain entropy, blocks session token forwarding.",
    latencyMs: 16.5,
    riskScore: 98.4,
    heuristicProof: [
      "[0.0ms] Ingress HTTPS connection initiated",
      "[2.1ms] SNI header inspection: 'login.microsoftonline' embedded as subdomain on untrusted parent",
      "[7.5ms] TLS Cert SAN analysis: Cert issued by Let's Encrypt (Expected: DigiCert Global Root G2)",
      "[12.3ms] Entropy scoring: 4.91 bits/char (High anomalous structural density)",
      "[16.5ms] DECISION: REVERSE PROXY HIJACK. Socket killed before HTTP POST credentials dispatched.",
    ],
  },
  {
    id: "quishing",
    name: "EMBEDDED QR QUISHING VECTOR",
    category: "Email Channel Payload",
    rawPayload: "base64://iVBORw0KGgoAAAANSUhEUgAA... [Target: https://update-bank-mfa.cloud]",
    exploitMechanism: "Bypasses text-based spam filters by encoding malicious phishing URLs into an embedded QR graphic.",
    defangMethod: "Local computer-vision scanner decodes QR matrix in memory buffer, routes URL to lexical classifier.",
    latencyMs: 17.8,
    riskScore: 96.2,
    heuristicProof: [
      "[0.0ms] Incoming email MIME stream analyzed in local memory sandbox",
      "[3.2ms] Image attachment identified: 320x320 PNG with 2D matrix structure",
      "[8.9ms] On-device QR decoder extracted URL: https://update-bank-mfa.cloud/otp-sync",
      "[14.1ms] Machine learning scoring: High-risk brand keyword + dynamic DNS TLD (.cloud)",
      "[17.8ms] DECISION: DEFANGED. QR graphic replaced with cryptographic warning tombstone.",
    ],
  },
  {
    id: "canvas",
    name: "CANVAS FINGERPRINT PROFILER",
    category: "Host Anti-Profiling Defeat",
    rawPayload: "script://eval('HTMLCanvasElement.prototype.toDataURL.apply(canvas, [])')",
    exploitMechanism: "Renders hidden geometric text to extract unique GPU hardware canvas hash for cross-site tracking.",
    defangMethod: "Injects non-deterministic micro-noise into WebGL and canvas buffers, breaking tracking persistence.",
    latencyMs: 1.2,
    riskScore: 94.0,
    heuristicProof: [
      "[0.0ms] DOM script executed hidden 2D canvas draw instruction",
      "[0.3ms] Suspicious method call: toDataURL() without preceding visible canvas attachment",
      "[0.7ms] Cryptographic noise injection: 3 micro-bits randomized across RGB alpha plane",
      "[1.2ms] DECISION: NEUTRALIZED. Tracking hash successfully rendered unique and non-correlatable.",
    ],
  },
]

export function ZeroDaySimulator() {
  const [activeScenario, setActiveScenario] = React.useState<AttackVectorScenario>(SCENARIOS[0])
  const [isSimulating, setIsSimulating] = React.useState(false)
  const [simStep, setSimStep] = React.useState(SCENARIOS[0].heuristicProof.length)
  const [completed, setCompleted] = React.useState(true)

  const triggerSimulation = (scenario: AttackVectorScenario) => {
    setActiveScenario(scenario)
    setIsSimulating(true)
    setSimStep(0)
    setCompleted(false)

    let current = 0
    const interval = setInterval(() => {
      current++
      setSimStep(current)
      if (current >= scenario.heuristicProof.length) {
        clearInterval(interval)
        setIsSimulating(false)
        setCompleted(true)
      }
    }, 380)
  }

  return (
    <div className="space-y-8 font-mono">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#39FF14] tracking-wider uppercase">
            <span className="w-2 h-2 bg-[#39FF14] inline-block animate-pulse" />
            <span>04 // INTERACTIVE LAB</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase text-[#F1F0EB] tracking-tight">
            ZERO-DAY ATTACK DEFENSE LAB
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[#A6A6A0] max-w-md font-sans leading-relaxed">
          Select a real-world cyber threat vector below to observe how the AgeIS-X on-device neural engine defangs it in under 18 milliseconds without leaking telemetry.
        </p>
      </div>

      {/* Scenario Selector Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {SCENARIOS.map((scenario) => {
          const isSelected = activeScenario.id === scenario.id
          return (
            <button
              key={scenario.id}
              type="button"
              onClick={() => triggerSimulation(scenario)}
              className={cn(
                "p-3 sm:p-4 text-left border transition-all duration-200 cursor-pointer relative",
                isSelected
                  ? "bg-[#39FF14]/10 border-[#39FF14] text-[#F1F0EB] shadow-[0_0_20px_rgba(57,255,20,0.2)]"
                  : "bg-[#04060A] border-white/10 text-[#A6A6A0] hover:border-white/25 hover:text-[#F1F0EB]"
              )}
            >
              <div className="flex items-center justify-between text-[10px] mb-1.5">
                <span className={cn("font-bold", isSelected ? "text-[#39FF14]" : "text-[#A6A6A0]")}>
                  {scenario.category}
                </span>
                <span className="text-[9px] text-[#A6A6A0] font-mono">&lt; {scenario.latencyMs}ms</span>
              </div>
              <div className="text-xs sm:text-sm font-bold uppercase tracking-tight text-[#F1F0EB]">
                {scenario.name}
              </div>
              {isSelected && (
                <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#39FF14] animate-ping" />
              )}
            </button>
          )
        })}
      </div>

      {/* Interactive Simulation Terminal Screen */}
      <PointerDepthCard
        depthLevel="subtle"
        glowColor="green"
        className="p-5 sm:p-8 bg-[#04060A] border border-white/15 relative overflow-hidden shadow-2xl"
      >
        {/* Terminal Title Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#39FF14] inline-block" />
            </div>
            <span className="text-xs font-black uppercase text-[#F1F0EB] tracking-wider">
              DEFENSE KERNEL // {activeScenario.name}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-[10px] text-[#A6A6A0]">
              CLOCK: <strong className="text-[#39FF14] font-black">{activeScenario.latencyMs}ms</strong>
            </span>
            <span className="text-white/20">|</span>
            <span className="text-[10px] text-[#A6A6A0]">
              VERDICT: <strong className="text-[#39FF14] font-black">DEFANGED</strong>
            </span>
            <Button
              size="sm"
              onClick={() => triggerSimulation(activeScenario)}
              disabled={isSimulating}
              className="bg-[#39FF14] hover:bg-[#32E012] text-[#04060A] font-mono text-[10px] font-black uppercase tracking-wider rounded-none h-7 px-3 cursor-pointer"
            >
              {isSimulating ? (
                <span>ANALYZING...</span>
              ) : (
                <span className="flex items-center gap-1">
                  <RotateCcw className="w-3 h-3" />
                  <span>RE-RUN</span>
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Payload Banner */}
        <div className="p-3 bg-[#080D14] border border-white/10 mb-6 space-y-1">
          <div className="text-[10px] text-[#A6A6A0] uppercase flex items-center justify-between">
            <span>INTERCEPTED INGRESS VECTOR:</span>
            <span className="text-red-400 font-bold">HOSTILE INJECTION</span>
          </div>
          <div className="text-xs sm:text-sm text-red-300 font-mono break-all font-bold">
            {activeScenario.rawPayload}
          </div>
        </div>

        {/* Real-time Proof Step Output */}
        <div className="bg-[#020305] border border-white/10 p-4 sm:p-5 font-mono text-xs space-y-2 min-h-[190px]">
          {activeScenario.heuristicProof.slice(0, simStep).map((log, index) => {
            const isLast = index === simStep - 1 && completed
            return (
              <div
                key={index}
                className={cn(
                  "flex items-start gap-2 leading-relaxed animate-in fade-in duration-200",
                  isLast ? "text-[#39FF14] font-bold" : "text-[#A6A6A0]"
                )}
              >
                <span className="text-white/30 select-none">&gt;</span>
                <span>{log}</span>
              </div>
            )
          })}

          {isSimulating && (
            <div className="flex items-center gap-2 text-[#39FF14] animate-pulse">
              <span className="text-white/30">&gt;</span>
              <span>Scanning neural token vectors...</span>
            </div>
          )}
        </div>

        {/* Bottom Verification Deck */}
        <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-xs">
          <div className="p-2.5 bg-white/[0.02] border border-white/5 space-y-1">
            <span className="text-[9px] text-[#A6A6A0] uppercase block">EXPLOIT MECHANISM</span>
            <p className="text-[11px] text-[#F1F0EB] font-sans leading-normal">
              {activeScenario.exploitMechanism}
            </p>
          </div>
          <div className="p-2.5 bg-white/[0.02] border border-white/5 space-y-1">
            <span className="text-[9px] text-[#A6A6A0] uppercase block">DEFANGING PROTOCOL</span>
            <p className="text-[11px] text-[#39FF14] font-sans leading-normal">
              {activeScenario.defangMethod}
            </p>
          </div>
          <div className="p-2.5 bg-white/[0.02] border border-white/5 space-y-1">
            <span className="text-[9px] text-[#A6A6A0] uppercase block">TELEMETRY SENT TO CLOUD</span>
            <div className="text-base font-black text-[#39FF14] pt-1">
              0 BYTES (PROVEN)
            </div>
          </div>
        </div>
      </PointerDepthCard>
    </div>
  )
}
