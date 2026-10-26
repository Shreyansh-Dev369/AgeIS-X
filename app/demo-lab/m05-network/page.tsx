"use client"

import React, { useState } from "react"
import { Network, Play, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DemoLabHeader } from "@/components/demo-lab/demo-lab-header"
import { ResultCard } from "@/components/demo-lab/result-card"
import { TriggeredRulesTable } from "@/components/demo-lab/triggered-rules-table"
import { EvidencePanel } from "@/components/demo-lab/evidence-panel"
import { RecommendationsPanel } from "@/components/demo-lab/recommendations-panel"
import { demoLabService, StandardEngineResponse } from "@/lib/services/demo-lab-service"

export default function M05NetworkPage() {
  const [preset, setPreset] = useState("c2_beaconing")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<StandardEngineResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const presets = [
    {
      id: "c2_beaconing",
      title: "Low-Jitter C2 Heartbeat Beaconing",
      desc: "Synchronized outbound TCP connections to external IP 185.220.101.45:8443 at 60s intervals with low standard deviation (jitter < 2%).",
    },
    {
      id: "dga_dns_tunneling",
      title: "Algorithmic DGA & DNS Exfiltration Cluster",
      desc: "Burst of high-entropy TXT queries across pseudorandom domains (x94bfq29la0z983ka.biz, entropy > 3.8/8.0).",
    },
    {
      id: "lateral_port_scan",
      title: "Internal Subnet Sweeping & Reconnaissance",
      desc: "Host scanning private IP subnets across administrative ports (445 SMB, 3389 RDP, 22 SSH) within short intervals.",
    },
    {
      id: "normal_baseline",
      title: "Nominal Baseline Web Traffic",
      desc: "Standard HTTPS client sessions to reputable content delivery networks (Google, Cloudflare) with organic timing deltas.",
    },
  ]

  const handleScan = async (selectedPreset: string = preset) => {
    setLoading(true)
    setError(null)
    try {
      const data = await demoLabService.m05AnalyzeNetwork({ scenario_preset: selectedPreset })
      setResult(data)
    } catch (err: any) {
      setError(`Network analysis failed: ${err.message || String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 font-mono">
      <DemoLabHeader
        engineId="M-05"
        engineName="Network Intelligence Lab"
        category="Egress NetFlow, DNS & Beaconing Plane"
        description="Analyzes connection timing intervals to compute mathematical jitter, flags low-variance automated beaconing patterns, calculates Shannon entropy over DNS query names to identify DGAs, and detects internal subnet sweeps."
        analysisMode="simulated"
        onReset={() => setResult(null)}
        isAnalyzing={loading}
      />

      <div className="bg-[#0B0E14] border border-white/10 rounded-lg p-5 space-y-4">
        <div className="text-xs font-bold text-[#F8FAFC] flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Network className="w-4 h-4 text-[#00E575]" />
            SELECT NETFLOW & DNS TELEMETRY DATASET
          </span>
          <Button
            onClick={() => handleScan(preset)}
            disabled={loading}
            className="bg-[#00E575] hover:bg-[#00c966] text-[#07090E] font-bold text-xs"
          >
            <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
            {loading ? "Calculating Timing Jitter..." : "Analyse Network Traffic"}
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
