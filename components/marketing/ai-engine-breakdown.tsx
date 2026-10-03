import React from "react"
import { Cpu, Terminal, Shield, Network, Lock, FileText, CheckCircle2, Layers, ArrowDown } from "lucide-react"
import { TacticalFrame } from "@/components/ui/tactical-frame"
import { PixelBadge } from "@/components/ui/pixel-badge"

const models = [
  {
    code: "M-01",
    name: "LEXICAL & SYNTACTIC MODEL",
    domain: "URL & DOMAIN ANALYSIS",
    status: "OPERATIONAL LOCAL ML",
    badgeVariant: "phosphor" as const,
    details: "SGDClassifier and character 2-5 n-grams with deterministic Unicode homoglyph and syntactic structure analysis.",
  },
  {
    code: "M-02",
    name: "TLS & LINEAGE CLASSIFIER",
    domain: "CERTIFICATE & DOMAIN AGE",
    status: "ARCHITECTURE PROTOTYPE",
    badgeVariant: "neutral" as const,
    details: "Architectural specification for active TLS handshake probing and X.509 certificate lineage verification.",
  },
  {
    code: "M-03",
    name: "HEADER & DMARC TELEMETRY ENGINE",
    domain: "EMAIL & COMMUNICATION",
    status: "PLANNED SPECIFICATION",
    badgeVariant: "neutral" as const,
    details: "Planned cross-check of cryptographic email sender alignment (SPF, DKIM, DMARC) with embedded link destinations.",
  },
  {
    code: "M-04",
    name: "BEHAVIORAL SYSCALL HEURISTIC",
    domain: "ENDPOINT MEMORY & DAEMONS",
    status: "RESEARCH SPECIFICATION",
    badgeVariant: "neutral" as const,
    details: "Research specification for passive user-space process and filesystem telemetry monitoring.",
  },
]

const pipelineLayers = [
  "URL INTELLIGENCE",
  "DOMAIN / DNS REPUTATION",
  "HTML / JAVASCRIPT SCAN",
  "EMAIL DMARC / SPF",
  "FILE HEURISTICS",
  "NETWORK ANOMALIES",
  "BEHAVIORAL PROCESSES",
  "IDENTITY EXPOSURE",
]

export function AIEngineBreakdown() {
  return (
    <TacticalFrame variant="panel" reticles className="p-5 sm:p-7 space-y-6 font-mono">
      <div>
        <div className="text-[10px] uppercase tracking-widest text-[#00ff66] mb-1 flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5" />
          <span>ENGINEERING_SPEC // SPECIALIZED CLASSIFIER ENSEMBLE</span>
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-[#f8fafc]">
          Multi-Layer Security Engine Architecture
        </h3>
        <p className="text-xs text-[#7e8b9b] font-sans mt-2 max-w-2xl leading-relaxed">
          Rather than relying on a slow, generic large language model, AgeIS-X routes incoming telemetry to domain-specialized, deterministic mathematical models, synthesizing their signals through a calibrated risk aggregation layer.
        </p>
      </div>

      {/* Pipeline Visual Schematic */}
      <div className="p-4 border border-white/10 bg-[#040608] space-y-3">
        <div className="text-[10px] text-[#7e8b9b] uppercase tracking-widest">
          // MULTI-STREAM INGESTION VECTORS
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[10px]">
          {pipelineLayers.map((layer, idx) => (
            <div key={idx} className="p-2 border border-white/10 bg-[#080c10] text-[#f8fafc]/90">
              <span className="text-[#00ff66] block text-[9px] mb-0.5">STREAM {idx + 1}</span>
              <span className="font-bold truncate block">{layer}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-center py-1 text-[#00ff66]">
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </div>

        {/* Core Consensus Block */}
        <div className="p-3 border border-[#00ff66]/40 bg-[#00ff66]/10 text-center space-y-1">
          <div className="text-xs font-bold text-[#00ff66] tracking-wider uppercase">
            [ RISK AGGREGATION &bull; CALIBRATION &bull; GLOBAL THREAT CONSENSUS ]
          </div>
          <div className="text-[10px] text-[#7e8b9b] font-sans">
            Inference engine aggregates individual model confidence scores against local policy thresholds
          </div>
        </div>

        <div className="flex justify-center py-1 text-[#00ff66]">
          <ArrowDown className="w-4 h-4" />
        </div>

        {/* Security Decision Block */}
        <div className="p-2.5 border border-[#00f0ff]/40 bg-[#00f0ff]/10 text-center">
          <span className="text-xs font-bold text-[#00f0ff] tracking-wider uppercase">
            &gt; AUTONOMOUS VERDICT: ALLOW / WARN / BLOCK / QUARANTINE / ISOLATE
          </span>
        </div>
      </div>

      {/* Model Spec Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {models.map((m, idx) => (
          <div
            key={idx}
            className="p-4 rounded-none border border-white/10 bg-[#080c10] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2 border-b border-white/5 pb-2">
                <span className="text-xs font-bold text-[#f8fafc]">
                  [{m.code}] {m.name}
                </span>
                <PixelBadge variant={m.badgeVariant} size="sm">
                  {m.status}
                </PixelBadge>
              </div>
              <span className="text-[10px] text-[#00f0ff] block mb-2">{m.domain}</span>
              <p className="text-xs text-[#7e8b9b] font-sans leading-relaxed">{m.details}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Sovereign Privacy Banner */}
      <div className="p-3.5 border border-white/10 bg-[#040608] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-[#f8fafc]">
          <Shield className="w-4 h-4 text-[#00ff66] shrink-0" />
          <span className="font-sans text-xs">Zero unencrypted personal telemetry is transmitted to third-party APIs.</span>
        </div>
        <PixelBadge variant="phosphor" size="sm">
          LOCAL SOVEREIGN INFERENCE
        </PixelBadge>
      </div>
    </TacticalFrame>
  )
}
