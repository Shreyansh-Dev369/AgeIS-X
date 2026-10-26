"use client"

import * as React from "react"
import { Shield, Cpu, Activity, Lock, ArrowRight, CheckCircle2, Zap, Radio, Terminal } from "lucide-react"
import { cn } from "@/lib/utils"

export interface PipelineStage {
  step: string
  name: string
  metric: string
  headline: string
  desc: string
  signals: string[]
  icon: React.ElementType
  payloadPreview: Record<string, any>
}

const PIPELINE_STAGES: PipelineStage[] = [
  {
    step: "01",
    name: "INGRESS SENSOR",
    metric: "p99 < 2ms",
    headline: "Wire-Speed Socket & Protocol Ingress",
    desc: "Inspects raw network packets, punycode strings, and MIME headers at the OS socket boundary without kernel modifications.",
    signals: [
      "Punycode / Homoglyph byte detection",
      "Non-standard port identification (:8443, :8080)",
      "TLS x509 SAN certificate chain validation",
    ],
    icon: Radio,
    payloadPreview: {
      raw_stream: "https://paypаl-verify.secure-update.xyz/token",
      protocol: "TLS 1.3 // RFC 8446",
      punycode: "xn--paypl-verify-q9a.secure-update.xyz",
      ingress_latency_ms: 1.42,
    },
  },
  {
    step: "02",
    name: "LEXICAL NLP ENGINE",
    metric: "p99 < 8ms",
    headline: "Character N-Gram & Shannon Entropy Vectorization",
    desc: "Breaks URL and message strings into 3-to-5 character n-gram tokens. Calculates Shannon entropy and levenshtein brand distance locally in RAM.",
    signals: [
      "Character n-gram tokenization (char_wb 3-5)",
      "Shannon entropy calculation (H > 4.2 bits)",
      "Levenshtein distance to top 1,000 trusted domains",
    ],
    icon: Cpu,
    payloadPreview: {
      entropy_bits: 4.68,
      brand_impersonation: "Paypal",
      levenshtein_distance: 1,
      homoglyph_detected: "U+0430 (Cyrillic Small Letter A)",
      nlp_elapsed_ms: 6.18,
    },
  },
  {
    step: "03",
    name: "HEURISTIC ENSEMBLE",
    metric: "p99 < 14ms",
    headline: "Calibrated Logistic + Domain-Aware SGD Classifier",
    desc: "Feeds 23 domain-aware structural features into an on-device calibrated model to generate a deterministic threat probability score.",
    signals: [
      "23 structural domain heuristics evaluated",
      "Calibrated probability threshold (Tau = 0.70)",
      "MITRE ATT&CK technique mapping (T1566.002)",
    ],
    icon: Activity,
    payloadPreview: {
      verdict: "malicious",
      risk_score: 99,
      probability: 0.9942,
      model: "AgeIS-X Ensemble v2.0",
      classification_ms: 12.05,
    },
  },
  {
    step: "04",
    name: "ENCLAVE QUARANTINE",
    metric: "p99 < 18ms",
    headline: "Deterministic Isolation & Zero-Knowledge Attestation",
    desc: "Executes an immediate TCP reset or browser navigation defanging. Cryptographically seals the incident into local TPM storage with 0 cloud leakage.",
    signals: [
      "Zero-hour TCP handshake termination",
      "Hardware passkey enclave attestation",
      "Local cryptographic telemetry vault (AES-256)",
    ],
    icon: Lock,
    payloadPreview: {
      action: "SOCKET_TERMINATION",
      quarantine_vault: "vault-sha256-4f8e...sealed",
      cloud_bytes_exported: 0,
      total_pipeline_time_ms: 16.8,
    },
  },
]

export function KillChainPipeline({ className }: { className?: string }) {
  const [activeStep, setActiveStep] = React.useState<number>(0)
  const current = PIPELINE_STAGES[activeStep]
  const Icon = current.icon

  return (
    <div
      className={cn(
        "relative rounded-none border border-white/15 bg-[#04060A] p-6 sm:p-8 font-mono select-none overflow-hidden shadow-2xl",
        className
      )}
    >
      {/* Laser Scan Border Line */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#39FF14] to-transparent animate-pulse"
        style={{ animationDuration: "3s" }}
        aria-hidden="true"
      />

      {/* Top Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-4 mb-6">
        <div>
          <span className="text-xs font-bold text-[#39FF14] tracking-wider uppercase block">
            02 / AUTONOMOUS MITIGATION PIPELINE
          </span>
          <h3 className="text-xl sm:text-2xl font-black uppercase text-[#F1F0EB] tracking-tight mt-1">
            THE 18ms KILL-CHAIN INTERCEPTION ENGINE
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#A6A6A0]">
          <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse" />
          <span>REAL-TIME DETERMINISTIC PIPELINE</span>
        </div>
      </div>

      {/* Stage Selector Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
        {PIPELINE_STAGES.map((stage, idx) => {
          const StageIcon = stage.icon
          const isActive = activeStep === idx
          return (
            <button
              key={stage.step}
              type="button"
              onClick={() => setActiveStep(idx)}
              className={cn(
                "p-3.5 text-left border transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-2 relative group",
                isActive
                  ? "bg-[#080D14] border-[#39FF14] shadow-[0_0_20px_rgba(57,255,20,0.12)]"
                  : "bg-white/[0.02] border-white/10 hover:border-white/30 hover:bg-white/[0.04]"
              )}
            >
              <div className="flex items-center justify-between w-full">
                <span className={cn("text-xs font-black font-mono", isActive ? "text-[#39FF14]" : "text-[#A6A6A0]")}>
                  STAGE {stage.step}
                </span>
                <span className="text-[10px] text-[#A6A6A0]">{stage.metric}</span>
              </div>
              <div className="flex items-center gap-2">
                <StageIcon className={cn("w-4 h-4", isActive ? "text-[#39FF14]" : "text-[#A6A6A0]")} />
                <span className={cn("text-xs font-bold uppercase truncate", isActive ? "text-[#F1F0EB]" : "text-[#A6A6A0]")}>
                  {stage.name}
                </span>
              </div>
              {isActive && (
                <div className="absolute -bottom-px left-0 right-0 h-0.5 bg-[#39FF14]" />
              )}
            </button>
          )
        })}
      </div>

      {/* Active Stage Inspector Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Narrative & Signals */}
        <div className="lg:col-span-7 bg-[#080D14] border border-white/15 p-5 sm:p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#39FF14] uppercase tracking-wider flex items-center gap-1.5">
                <Icon className="w-3.5 h-3.5 text-[#39FF14]" />
                STAGE {current.step} SPECIFICATION
              </span>
              <span className="text-[10px] text-[#A6A6A0] border border-white/10 px-2 py-0.5">
                LATENCY: {current.metric}
              </span>
            </div>

            <h4 className="text-base sm:text-lg font-bold text-[#F1F0EB]">
              {current.headline}
            </h4>
            <p className="text-xs text-[#A6A6A0] font-sans leading-relaxed">
              {current.desc}
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-white/10">
            <span className="text-[10px] text-[#6F706D] font-bold uppercase tracking-wider block">
              VALIDATED TELEMETRY SIGNALS:
            </span>
            <ul className="space-y-1.5 text-xs text-[#F1F0EB]">
              {current.signals.map((sig, i) => (
                <li key={i} className="flex items-center gap-2 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#39FF14] shrink-0" />
                  <span>{sig}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: Live Interactive JSON Payload Terminal */}
        <div className="lg:col-span-5 bg-[#030508] border border-white/15 p-4 sm:p-5 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-[10px] border-b border-white/10 pb-2 text-[#A6A6A0]">
            <span className="flex items-center gap-1.5 font-bold text-[#39FF14]">
              <Terminal className="w-3.5 h-3.5 text-[#39FF14]" />
              ENCLAVE TELEMETRY BUFFER
            </span>
            <span>JSON EMIT</span>
          </div>

          <pre className="text-[11px] text-[#39FF14] font-mono overflow-x-auto p-2 bg-[#05080E] border border-white/5 rounded-none leading-relaxed">
            <code>{JSON.stringify(current.payloadPreview, null, 2)}</code>
          </pre>

          <div className="flex items-center justify-between text-[10px] text-[#A6A6A0] pt-1 border-t border-white/5">
            <span>ISOLATION: ZERO CLOUD BYTES</span>
            <span className="text-[#39FF14] font-bold">SHA-256 ATTESTED</span>
          </div>
        </div>
      </div>
    </div>
  )
}
