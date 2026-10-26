"use client"

import React, { useState } from "react"
import { Fingerprint, Play, UserX, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DemoLabHeader } from "@/components/demo-lab/demo-lab-header"
import { ResultCard } from "@/components/demo-lab/result-card"
import { TriggeredRulesTable } from "@/components/demo-lab/triggered-rules-table"
import { EvidencePanel } from "@/components/demo-lab/evidence-panel"
import { RecommendationsPanel } from "@/components/demo-lab/recommendations-panel"
import { demoLabService, StandardEngineResponse } from "@/lib/services/demo-lab-service"

export default function M06IdentityPage() {
  const [preset, setPreset] = useState("impossible_travel")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<StandardEngineResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const presets = [
    {
      id: "impossible_travel",
      title: "Impossible Travel Velocity Anomaly",
      desc: "Logins from New York (USA) and Sofia (Bulgaria) within 18 minutes (calculated velocity > 15,000 km/h; commercial aviation threshold 900 km/h).",
    },
    {
      id: "brute_force_spray",
      title: "Distributed Password Spray Attack",
      desc: "12 rapid consecutive authentication failures targeting distinct administrative principals (admin, ceo, billing) from common foreign IP.",
    },
    {
      id: "mfa_downgrade",
      title: "MFA Revocation & Rogue Device Enrollment",
      desc: "Privileged account password reset immediately followed by MFA method disablement and registration of an unmanaged mobile device.",
    },
    {
      id: "normal_mfa_login",
      title: "Standard Enterprise FIDO2 Passkey Login",
      desc: "Successful passwordless authentication from corporate-enrolled workstation with valid cryptographic hardware token.",
    },
  ]

  const handleScan = async (selectedPreset: string = preset) => {
    setLoading(true)
    setError(null)
    try {
      const data = await demoLabService.m06AnalyzeIdentity({ scenario_preset: selectedPreset })
      setResult(data)
    } catch (err: any) {
      setError(`Identity analysis failed: ${err.message || String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 font-mono">
      <DemoLabHeader
        engineId="M-06"
        engineName="Identity Security Lab"
        category="Authentication, Credential & MFA Defense"
        description="Correlates authentication event sequences, calculates geographical velocity using great-circle haversine mathematics to detect impossible travel, identifies password spray campaigns, and alerts on unauthorized MFA downgrade actions."
        analysisMode="simulated"
        onReset={() => setResult(null)}
        isAnalyzing={loading}
      />

      <div className="bg-[#0B0E14] border border-white/10 rounded-lg p-5 space-y-4">
        <div className="text-xs font-bold text-[#F8FAFC] flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Fingerprint className="w-4 h-4 text-[#00E575]" />
            SELECT IDENTITY & AUTHENTICATION SCENARIO
          </span>
          <Button
            onClick={() => handleScan(preset)}
            disabled={loading}
            className="bg-[#00E575] hover:bg-[#00c966] text-[#07090E] font-bold text-xs"
          >
            <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
            {loading ? "Calculating Velocity..." : "Analyse Authentication Log"}
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
