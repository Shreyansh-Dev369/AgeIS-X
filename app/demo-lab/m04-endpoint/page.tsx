"use client"

import React, { useState } from "react"
import { Laptop, Play, Terminal, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DemoLabHeader } from "@/components/demo-lab/demo-lab-header"
import { ResultCard } from "@/components/demo-lab/result-card"
import { TriggeredRulesTable } from "@/components/demo-lab/triggered-rules-table"
import { EvidencePanel } from "@/components/demo-lab/evidence-panel"
import { RecommendationsPanel } from "@/components/demo-lab/recommendations-panel"
import { demoLabService, StandardEngineResponse } from "@/lib/services/demo-lab-service"

export default function M04EndpointPage() {
  const [preset, setPreset] = useState("macro_powershell")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<StandardEngineResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const presets = [
    {
      id: "macro_powershell",
      title: "Office Macro Spawning Encoded PowerShell",
      desc: "winword.exe spawning cmd.exe -> hidden powershell.exe with Base64 -enc dropper and Registry Run Key persistence.",
    },
    {
      id: "ransomware_activity",
      title: "Ransomware Inhibit System Recovery (VSSADMIN)",
      desc: "vssadmin.exe delete shadows /all /quiet followed by high-frequency file renames (.locked) with Shannon entropy > 7.9.",
    },
    {
      id: "usb_badusb",
      title: "Rogue BadUSB Keystroke Injection",
      desc: "Flash drive presenting HID Keyboard hardware class injecting high-speed automated PowerShell download string.",
    },
    {
      id: "malicious_extension",
      title: "High-Privilege Browser Extension Exfiltration",
      desc: "Chrome extension requesting <all_urls>, webRequestBlocking, and cookie storage permissions.",
    },
  ]

  const handleScan = async (selectedPreset: string = preset) => {
    setLoading(true)
    setError(null)
    try {
      const data = await demoLabService.m04AnalyzeEndpoint({ scenario_preset: selectedPreset })
      setResult(data)
    } catch (err: any) {
      setError(`Endpoint analysis error: ${err.message || String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 font-mono">
      <DemoLabHeader
        engineId="M-04"
        engineName="Endpoint Security Lab"
        category="Process, Persistence & Peripheral Telemetry"
        description="Evaluates synthetic process creation trees, MITRE ATT&CK execution patterns, autostart registry persistence, unauthorized BadUSB keystroke emulators, and high-entropy bulk file alterations characteristic of ransomware."
        analysisMode="simulated"
        onReset={() => setResult(null)}
        isAnalyzing={loading}
      />

      {/* Preset Selector */}
      <div className="bg-[#0B0E14] border border-white/10 rounded-lg p-5 space-y-4">
        <div className="text-xs font-bold text-[#F8FAFC] flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#00E575]" />
            SELECT SYNTHETIC ENDPOINT EVENT SEQUENCE
          </span>
          <Button
            onClick={() => handleScan(preset)}
            disabled={loading}
            className="bg-[#00E575] hover:bg-[#00c966] text-[#07090E] font-bold text-xs"
          >
            <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
            {loading ? "Analyzing Process Trees..." : "Analyse Telemetry Batch"}
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
