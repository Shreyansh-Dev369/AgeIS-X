import React from "react"
import {
  Activity,
  Cpu,
  ShieldCheck,
  Ban,
  Lock,
  AlertTriangle,
  FileCheck,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  Terminal,
} from "lucide-react"
import { TacticalFrame } from "@/components/ui/tactical-frame"
import { ReticleCorners } from "@/components/ui/reticle-corners"
import { PixelBadge } from "@/components/ui/pixel-badge"
import { cn } from "@/lib/utils"

const pipelineSteps = [
  {
    step: "01",
    label: "EVENT INGESTION",
    icon: Activity,
    badge: "PASSIVE PROBE",
    description: "Inbound URL click, email attachment download, or memory execution syscall triggers immediate telemetry evaluation.",
  },
  {
    step: "02",
    label: "SIGNAL EXTRACTION",
    icon: Cpu,
    badge: "SUB-5MS",
    description: "Extracts character token n-grams, domain registration age, TLS cipher suite, parent process ID, and cryptographic hashes.",
  },
  {
    step: "03",
    label: "SPECIALIZED INFERENCE",
    icon: Cpu,
    badge: "MULTI-MODEL",
    description: "Evaluates extracted vectors across purpose-built neural classifiers for lexical entropy, phishing probability, and behavioral risk.",
  },
  {
    step: "04",
    label: "RISK CONSENSUS",
    icon: ShieldCheck,
    badge: "DETERMINISTIC",
    description: "Correlates individual model confidence ratings against global threat hashes and local policy thresholds to produce an authoritative verdict.",
  },
  {
    step: "05",
    label: "AUTONOMOUS ACTION",
    icon: Ban,
    badge: "ZERO-LATENCY",
    description: "Applies immediate mitigation: Allow clean traffic, Warn on anomalies, Block malicious domains, or Quarantine binary files.",
  },
  {
    step: "06",
    label: "HUMAN EXPLANATION",
    icon: HelpCircle,
    badge: "TRANSPARENT",
    description: "Explains what occurred, why it was blocked, what AgeIS-X did to neutralize it, and recommendations for continued safety.",
  },
]

const actions = [
  { name: "ALLOW", color: "text-[#00ff66] bg-[#00ff66]/10 border-[#00ff66]/40", desc: "Verified clean traffic" },
  { name: "WARN", color: "text-[#ffb800] bg-[#ffb800]/10 border-[#ffb800]/40", desc: "Suspicious pattern advisory" },
  { name: "BLOCK", color: "text-[#ff3b30] bg-[#ff3b30]/10 border-[#ff3b30]/40", desc: "Socket dropped before TLS" },
  { name: "QUARANTINE", color: "text-[#b356ff] bg-[#b356ff]/10 border-[#b356ff]/40", desc: "Binary moved to isolated vault" },
  { name: "ISOLATE", color: "text-[#8b5cf6] bg-[#8b5cf6]/10 border-[#8b5cf6]/40", desc: "Host network cut from lateral spread" },
  { name: "ACTION REQUIRED", color: "text-[#ff6b00] bg-[#ff6b00]/10 border-[#ff6b00]/40", desc: "MFA or config prompt" },
]

export function HowItWorksPipeline() {
  return (
    <div className="space-y-8 font-mono">
      {/* 6-Step Visual Flow */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {pipelineSteps.map((item, idx) => {
          const Icon = item.icon
          return (
            <div
              key={idx}
              className="rounded-none border border-white/10 bg-[#080c10] p-4 flex flex-col justify-between hover:border-[#00ff66]/40 transition-colors relative group"
            >
              <div>
                <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                  <span className="text-xs font-mono font-bold text-[#00ff66]">
                    [{item.step} // STEP]
                  </span>
                  <span className="text-[10px] text-[#7e8b9b] border border-white/10 px-1 py-0.2">
                    {item.badge}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-3.5 h-3.5 text-[#00f0ff]" />
                  <h4 className="text-xs font-bold text-[#f8fafc] tracking-wider">{item.label}</h4>
                </div>

                <p className="text-xs text-[#7e8b9b] font-sans leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Action Types Matrix */}
      <TacticalFrame variant="panel" reticles className="p-5 sm:p-6">
        <div className="mb-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#f8fafc] flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-[#00ff66]" />
            <span>DETERMINISTIC AUTONOMOUS ACTION SPECTRUM</span>
          </h4>
          <p className="text-xs text-[#7e8b9b] font-sans mt-1">
            AgeIS-X never confuses the user with vague warnings. Every mitigation maps to a defined, auditable security state.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {actions.map((act, idx) => (
            <div
              key={idx}
              className={cn("p-2.5 rounded-none border text-center space-y-1", act.color)}
            >
              <span className="text-xs font-mono font-bold block">[{act.name}]</span>
              <span className="text-[10px] font-sans block leading-tight opacity-90">{act.desc}</span>
            </div>
          ))}
        </div>
      </TacticalFrame>
    </div>
  )
}
