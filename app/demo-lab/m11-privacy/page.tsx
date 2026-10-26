"use client"

import React, { useState } from "react"
import { EyeOff, Play, ShieldAlert, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DemoLabHeader } from "@/components/demo-lab/demo-lab-header"
import { ResultCard } from "@/components/demo-lab/result-card"
import { TriggeredRulesTable } from "@/components/demo-lab/triggered-rules-table"
import { EvidencePanel } from "@/components/demo-lab/evidence-panel"
import { RecommendationsPanel } from "@/components/demo-lab/recommendations-panel"
import { demoLabService, StandardEngineResponse } from "@/lib/services/demo-lab-service"

export default function M11PrivacyPage() {
  const [preset, setPreset] = useState("high_tracker_adtech")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<StandardEngineResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const presets = [
    {
      id: "high_tracker_adtech",
      title: "Commercial AdTech & Persistent Canvas Fingerprinting",
      desc: "News site fanning out to 38 ad-tech domains with active WebGL/Canvas hardware fingerprinting scripts and intrusive clipboard/sensor requests.",
    },
    {
      id: "data_broker_pixel_leak",
      title: "PII Checkout Leakage to Data Brokers",
      desc: "E-commerce checkout flow leaking customer email hashes and purchase identifiers in unencrypted third-party query strings.",
    },
    {
      id: "privacy_respecting_site",
      title: "Zero-Tracker Privacy Architecture",
      desc: "Zero-knowledge documentation site with no third-party cookies, zero fingerprinters, and no invasive browser permissions.",
    },
  ]

  const handleScan = async (selectedPreset: string = preset) => {
    setLoading(true)
    setError(null)
    try {
      const data = await demoLabService.m11AnalyzePrivacy({ scenario_preset: selectedPreset })
      setResult(data)
    } catch (err: any) {
      setError(`Privacy analysis failed: ${err.message || String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 font-mono">
      <DemoLabHeader
        engineId="M-11"
        engineName="Privacy Intelligence"
        category="Fingerprinting, Egress & Data Broker Defense"
        description="Audits website egress telemetry to identify hardware Canvas/WebGL fingerprinters, third-party tracking cookie density, sensitive PII parameter leaks, and invasive browser permission requests."
        analysisMode="simulated"
        onReset={() => setResult(null)}
        isAnalyzing={loading}
      />

      <div className="bg-[#0B0E14] border border-white/10 rounded-lg p-5 space-y-4">
        <div className="text-xs font-bold text-[#F8FAFC] flex items-center justify-between">
          <span className="flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-[#00E575]" />
            SELECT SITE PRIVACY TELEMETRY REPORT
          </span>
          <Button
            onClick={() => handleScan(preset)}
            disabled={loading}
            className="bg-[#00E575] hover:bg-[#00c966] text-[#07090E] font-bold text-xs"
          >
            <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
            {loading ? "Auditing Trackers..." : "Analyse Privacy Report"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
