"use client"

import React, { useState } from "react"
import { GitBranch, Play, Clock, ArrowRight, ShieldAlert, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DemoLabHeader } from "@/components/demo-lab/demo-lab-header"
import { ResultCard } from "@/components/demo-lab/result-card"
import { TriggeredRulesTable } from "@/components/demo-lab/triggered-rules-table"
import { EvidencePanel } from "@/components/demo-lab/evidence-panel"
import { RecommendationsPanel } from "@/components/demo-lab/recommendations-panel"
import { demoLabService, StandardEngineResponse } from "@/lib/services/demo-lab-service"

export default function M13BehaviouralPage() {
  const [preset, setPreset] = useState("multi_stage_compromise")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<StandardEngineResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const presets = [
    {
      id: "multi_stage_compromise",
      title: "Coordinated Multi-Stage Cyber Kill Chain",
      desc: "Chronological sequence: Spearphishing email (M-03) -> Phishing link click (M-01) -> Brute-force/Impossible travel login (M-06) -> Process injection (M-04) -> Low-jitter C2 beaconing (M-05).",
    },
    {
      id: "lateral_movement_spill",
      title: "Lateral Movement & Domain Controller Sweep",
      desc: "Service account NTLM spray failures followed by sudden successful authentication and rapid SMB port sweeps across 12 internal domain controllers.",
    },
  ]

  const handleScan = async (selectedPreset: string = preset) => {
    setLoading(true)
    setError(null)
    try {
      const data = await demoLabService.m13AnalyzeBehavioural({ scenario_preset: selectedPreset })
      setResult(data)
    } catch (err: any) {
      setError(`Behavioural correlation error: ${err.message || String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 font-mono">
      <DemoLabHeader
        engineId="M-13"
        engineName="Behavioural Analysis"
        category="Temporal Correlation & Multi-Stage Attack Chains"
        description="Ingests timestamped telemetry across independent security engines, sequences events chronologically, correlates common identity and network entities, and identifies complete cyber kill chains while explicitly acknowledging that temporal association does not definitively prove causation."
        analysisMode="simulated"
        onReset={() => setResult(null)}
        isAnalyzing={loading}
      />

      <div className="bg-[#0B0E14] border border-white/10 rounded-lg p-5 space-y-4">
        <div className="text-xs font-bold text-[#F8FAFC] flex items-center justify-between">
          <span className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-[#00E575]" />
            SELECT MULTI-ENGINE CORRELATION SEQUENCE
          </span>
          <Button
            onClick={() => handleScan(preset)}
            disabled={loading}
            className="bg-[#00E575] hover:bg-[#00c966] text-[#07090E] font-bold text-xs"
          >
            <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
            {loading ? "Sequencing Timeline..." : "Correlate Events"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {presets.map((p) => {
            const isSelected = preset === p.id
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setPreset(p.id)
                  handleScan(p.id)
                }}
                className={`text-left p-3.5 rounded border transition-all ${
                  isSelected
                    ? "bg-[#151922] border-[#00E575] text-[#F8FAFC]"
                    : "bg-[#07090E] border-white/5 text-[#94A3B8] hover:border-white/15 hover:text-[#F8FAFC]"
                }`}
              >
                <div className="font-bold text-xs text-[#F8FAFC]">{p.title}</div>
                <div className="text-[11px] text-[#64748B] font-sans mt-1 leading-relaxed">
                  {p.desc}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded text-xs text-red-400">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-6">
          <ResultCard result={result} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TriggeredRulesTable rules={result.triggered_rules} />
            <div className="space-y-6">
              <RecommendationsPanel recommendations={result.recommendations} />
              <EvidencePanel evidence={result.evidence} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
