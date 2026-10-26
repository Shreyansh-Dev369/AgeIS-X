"use client"

import React, { useState, useRef } from "react"
import { Eye, Upload, Play, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DemoLabHeader } from "@/components/demo-lab/demo-lab-header"
import { ResultCard } from "@/components/demo-lab/result-card"
import { TriggeredRulesTable } from "@/components/demo-lab/triggered-rules-table"
import { EvidencePanel } from "@/components/demo-lab/evidence-panel"
import { RecommendationsPanel } from "@/components/demo-lab/recommendations-panel"
import { demoLabService, StandardEngineResponse } from "@/lib/services/demo-lab-service"

export default function M09VisualThreatPage() {
  const [preset, setPreset] = useState("microsoft_login_clone")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<StandardEngineResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const presets = [
    {
      id: "microsoft_login_clone",
      title: "Microsoft 365 Phishing Portal Clone",
      desc: "Centered white modal authentication card on light grey backdrop with Microsoft Corporate Blue (#0067B8) action button coordinates.",
    },
    {
      id: "scareware_ransom_screen",
      title: "Extortion / Scareware Crimson Warning Screen",
      desc: "High-saturation red canvas with central banner box, typical of fraudulent tech-support lockouts or ransomware demand interfaces.",
    },
    {
      id: "legitimate_clean_screenshot",
      title: "Clean Corporate Dashboard Telemetry Screen",
      desc: "Balanced aspect ratio with standard multi-card distribution and neutral administrative palette.",
    },
  ]

  const handleScanPreset = async (presetId: string = preset) => {
    setLoading(true)
    setError(null)
    try {
      const data = await demoLabService.m09AnalyzeVisual({ scenario_preset: presetId })
      setResult(data)
    } catch (err: any) {
      setError(`Visual inspection failed: ${err.message || String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    setError(null)
    try {
      const data = await demoLabService.m09UploadScreenshot(file)
      setResult(data)
    } catch (err: any) {
      setError(`Screenshot upload failed: ${err.message || String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 font-mono">
      <DemoLabHeader
        engineId="M-09"
        engineName="Visual Threat Intelligence"
        category="Perceptual Hashing & Spatial Layout Plane"
        description="Analyzes image dimensions, color channel histograms, spatial clustering of credential prompts, and enterprise brand color signatures using Python Pillow. Transparently discloses OCR engine availability without fabricating results."
        analysisMode="live"
        onReset={() => setResult(null)}
        isAnalyzing={loading}
      />

      <div className="bg-[#0B0E14] border border-white/10 rounded-lg p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
          <div className="text-xs font-bold text-[#F8FAFC]">SCREENSHOT SUBMISSION & PRESETS</div>
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept="image/png,image/jpeg"
              ref={fileInputRef}
              onChange={handleScreenshotUpload}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="h-8 text-xs font-mono border-white/10 hover:border-white/20 text-[#00E575] bg-[#00E575]/5"
            >
              <Upload className="w-3.5 h-3.5 mr-1.5" />
              Upload Live PNG/JPG
            </Button>
            <Button
              onClick={() => handleScanPreset(preset)}
              disabled={loading}
              className="h-8 bg-[#00E575] hover:bg-[#00c966] text-[#07090E] font-bold text-xs"
            >
              <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
              {loading ? "Inspecting Image Matrix..." : "Analyse Preset"}
            </Button>
          </div>
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
                  handleScanPreset(p.id)
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
