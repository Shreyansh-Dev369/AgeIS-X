"use client"

import React, { useState } from "react"
import { Layers, Play, Cpu, CheckCircle2, AlertOctagon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DemoLabHeader } from "@/components/demo-lab/demo-lab-header"
import { ResultCard } from "@/components/demo-lab/result-card"
import { TriggeredRulesTable } from "@/components/demo-lab/triggered-rules-table"
import { EvidencePanel } from "@/components/demo-lab/evidence-panel"
import { RecommendationsPanel } from "@/components/demo-lab/recommendations-panel"
import { demoLabService, StandardEngineResponse } from "@/lib/services/demo-lab-service"

export default function M14UnifiedRiskPage() {
  const [preset, setPreset] = useState("multi_stage_incident")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<StandardEngineResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const presets = [
    {
      id: "multi_stage_incident",
      title: "Critical Multi-Vector Intrusion (High Risk)",
      desc: "Aggregates findings from M-02 (Web), M-04 (Endpoint), M-05 (Network), M-06 (Identity), M-07 (Scam), M-08 (File), and M-10 (Threat Intel). Deduplicates findings and applies category weights.",
    },
    {
      id: "benign_audit",
      title: "Nominal Security Baseline (Benign Audit)",
      desc: "Aggregates clean baseline telemetry across Endpoint, Network, and Identity modules with expected nominal posture.",
    },
  ]

  const handleScan = async (selectedPreset: string = preset) => {
    setLoading(true)
    setError(null)
    try {
      const data = await demoLabService.m14AnalyzeUnifiedRisk({ scenario_preset: selectedPreset })
      setResult(data)
    } catch (err: any) {
      setError(`Unified risk aggregation error: ${err.message || String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 font-mono">
      <DemoLabHeader
        engineId="M-14"
        engineName="Unified Risk & Meta Decision"
        category="Explainable Multi-Criteria Aggregation Plane"
        description="Consumes structured evaluations from engines M-01 through M-13, normalizes risk severities, tracks evidence provenance, eliminates double-counting via signal deduplication, and applies mathematically transparent category weights to produce an overall enterprise risk posture."
        analysisMode="live"
        onReset={() => setResult(null)}
        isAnalyzing={loading}
      />

      <div className="bg-[#0B0E14] border border-white/10 rounded-lg p-5 space-y-4">
        <div className="text-xs font-bold text-[#F8FAFC] flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#00E575]" />
            SELECT COMPOSITE TELEMETRY AGGREGATION BATCH
          </span>
          <Button
            onClick={() => handleScan(preset)}
            disabled={loading}
            className="bg-[#00E575] hover:bg-[#00c966] text-[#07090E] font-bold text-xs"
          >
            <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
            {loading ? "Aggregating Weights..." : "Compute Meta Decision"}
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

          {/* Engine Weights & Breakdown Cards */}
          {result.metadata && result.metadata.engine_scores && (
            <div className="bg-[#0B0E14] border border-white/10 rounded-lg p-5 space-y-3">
              <div className="text-xs font-bold text-[#F8FAFC] uppercase tracking-wider flex items-center justify-between">
                <span>Category Contribution & Weight Breakdown</span>
                <span className="text-[#00E575] text-[11px]">
                  Raw Weighted: {result.metadata.raw_weighted_score} / 100
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2">
                {Object.entries(result.metadata.engine_scores as Record<string, number>).map(
                  ([engId, score]) => {
                    const weight = (result.metadata.engine_weights as Record<string, number>)?.[engId] || 0
                    return (
                      <div
                        key={engId}
                        className="p-2.5 bg-[#07090E] border border-white/5 rounded text-xs"
                      >
                        <div className="flex items-center justify-between text-[#64748B]">
                          <span className="font-bold text-[#00E575]">{engId}</span>
                          <span className="text-[10px]">w: {weight}</span>
                        </div>
                        <div className="text-sm font-bold text-[#F8FAFC] mt-1">
                          {score} <span className="text-[10px] text-[#64748B]">/100</span>
                        </div>
                      </div>
                    )
                  }
                )}
              </div>
            </div>
          )}

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
