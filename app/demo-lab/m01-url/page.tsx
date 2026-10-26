"use client"

import React, { useState } from "react"
import { Globe, Search, ArrowRight, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DemoLabHeader } from "@/components/demo-lab/demo-lab-header"
import { ResultCard } from "@/components/demo-lab/result-card"
import { TriggeredRulesTable } from "@/components/demo-lab/triggered-rules-table"
import { EvidencePanel } from "@/components/demo-lab/evidence-panel"
import { RecommendationsPanel } from "@/components/demo-lab/recommendations-panel"
import { demoLabService, StandardEngineResponse } from "@/lib/services/demo-lab-service"

export default function M01UrlPage() {
  const [url, setUrl] = useState("https://login-auth-corp.ageis-sso.xyz")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<StandardEngineResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const presets = [
    { label: "Typosquat / Phishing Portal", value: "https://login-auth-corp.ageis-sso.xyz" },
    { label: "Cyrillic Homoglyph Lookalike", value: "http://xn--paypl-auth-e1a.xyz" },
    { label: "Direct IP Literal Navigation", value: "http://185.220.101.5:8080/login" },
    { label: "Verified Authentic Domain", value: "https://www.google.com" },
  ]

  const handleScan = async (targetUrl: string = url) => {
    if (!targetUrl.trim()) return
    setLoading(true)
    setError(null)
    try {
      const data = await demoLabService.m01PredictUrl(targetUrl)
      setResult(data)
    } catch (err: any) {
      setError(`Scan failed: ${err.message || String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 font-mono">
      <DemoLabHeader
        engineId="M-01"
        engineName="URL & Domain Intelligence"
        category="Lexical, Syntactic & Cryptographic Plane"
        description="Analyzes lexical structure, Unicode homoglyphs, Shannon entropy, live RDAP domain registration age, DNS resolution, and TLS X.509 cryptographic certificates using the hybrid ML pipeline (TF-IDF + 23 features + Logistic Regression)."
        analysisMode="live"
        onReset={() => {
          setUrl("https://login-auth-corp.ageis-sso.xyz")
          setResult(null)
        }}
        isAnalyzing={loading}
      />

      {/* Input Panel */}
      <div className="bg-[#0B0E14] border border-white/10 rounded-lg p-5 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Globe className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL to inspect (e.g. https://target-domain.com)"
              className="pl-10 bg-[#07090E] border-white/10 text-xs font-mono text-[#F8FAFC] focus-visible:ring-[#00E575]"
            />
          </div>
          <Button
            onClick={() => handleScan(url)}
            disabled={loading}
            className="bg-[#00E575] hover:bg-[#00c966] text-[#07090E] font-bold text-xs"
          >
            <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
            {loading ? "Inspecting Live..." : "Analyse URL"}
          </Button>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
          <span className="text-[11px] text-[#64748B]">PRESETS:</span>
          {presets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setUrl(p.value)
                handleScan(p.value)
              }}
              className="text-[11px] px-2.5 py-1 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 rounded text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded text-xs text-red-400">
          {error}
        </div>
      )}

      {/* Results View */}
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
