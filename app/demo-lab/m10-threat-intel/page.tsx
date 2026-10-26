"use client"

import React, { useState } from "react"
import { Radio, Search, Play, Database, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DemoLabHeader } from "@/components/demo-lab/demo-lab-header"
import { ResultCard } from "@/components/demo-lab/result-card"
import { TriggeredRulesTable } from "@/components/demo-lab/triggered-rules-table"
import { EvidencePanel } from "@/components/demo-lab/evidence-panel"
import { RecommendationsPanel } from "@/components/demo-lab/recommendations-panel"
import { demoLabService, StandardEngineResponse } from "@/lib/services/demo-lab-service"

export default function M10ThreatIntelPage() {
  const [query, setQuery] = useState("c2-stealth-relay.biz")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<StandardEngineResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const presets = [
    { label: "APT29 C2 Domain", value: "c2-stealth-relay.biz" },
    { label: "FIN7 Bulletproof C2 IP", value: "185.220.101.5" },
    { label: "WannaCry Ransomware Hash", value: "ed01ebf83334a19373630c745e1f7e35a019319f34aa06524f7f5087dc06c5e2" },
    { label: "Expired / Stale Record", value: "legacy-phish-2022.com" },
    { label: "Unmatched Unseen Query", value: "clean-developer-portal.internal" },
  ]

  const handleLookup = async (targetQuery: string = query) => {
    if (!targetQuery.trim()) return
    setLoading(true)
    setError(null)
    try {
      const data = await demoLabService.m10LookupThreatIntel({ query: targetQuery })
      setResult(data)
    } catch (err: any) {
      setError(`Threat intel query error: ${err.message || String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 font-mono">
      <DemoLabHeader
        engineId="M-10"
        engineName="Threat Intelligence"
        category="Indicator of Compromise (IoC) & Attribution"
        description="Cross-references domain names, IP addresses, and cryptographic binary hashes against verified threat feeds. Preserves provenance, threat-actor tags, and expiry timestamps. Distinctly handles unmatched queries as inconclusive rather than falsely classifying them as safe."
        analysisMode="simulated"
        onReset={() => setResult(null)}
        isAnalyzing={loading}
      />

      <div className="bg-[#0B0E14] border border-white/10 rounded-lg p-5 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Query IoC indicator (e.g. domain, IP address, or SHA-256 hash)"
              className="pl-10 bg-[#07090E] border-white/10 text-xs font-mono text-[#F8FAFC]"
            />
          </div>
          <Button
            onClick={() => handleLookup(query)}
            disabled={loading}
            className="bg-[#00E575] hover:bg-[#00c966] text-[#07090E] font-bold text-xs"
          >
            <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
            {loading ? "Querying Feed Oracle..." : "Query IoC Feed"}
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
          <span className="text-[11px] text-[#64748B]">DEMO FIXTURES:</span>
          {presets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setQuery(p.value)
                handleLookup(p.value)
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
