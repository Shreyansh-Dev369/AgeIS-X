"use client"

import React, { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import {
  Sparkles,
  Play,
  RotateCcw,
  Download,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Clock,
  Layers,
  ChevronRight,
  Database,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { DemoLabHeader } from "@/components/demo-lab/demo-lab-header"
import { ResultCard } from "@/components/demo-lab/result-card"
import { TriggeredRulesTable } from "@/components/demo-lab/triggered-rules-table"
import { EvidencePanel } from "@/components/demo-lab/evidence-panel"
import { RecommendationsPanel } from "@/components/demo-lab/recommendations-panel"
import { demoLabService, ScenarioExecutionResult, Finding } from "@/lib/services/demo-lab-service"
import { cn } from "@/lib/utils"

function IncidentWorkspaceInner() {
  const searchParams = useSearchParams()
  const initialScenario = searchParams.get("scenario") || "scenario_d"

  const [selectedScenario, setSelectedScenario] = useState<string>(initialScenario)
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState<ScenarioExecutionResult | null>(null)
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null)
  const [error, setError] = useState<string | null>(null)

  const scenarios = [
    {
      id: "scenario_d",
      code: "D",
      title: "Full Multi-Stage Incident (Kill Chain)",
      subtitle: "Phish → Link → Account → EDR → C2 → Unified Meta Decision",
    },
    {
      id: "scenario_a",
      code: "A",
      title: "Suspicious Link Investigation",
      subtitle: "Authentic Google vs Typosquat Credential Harvester",
    },
    {
      id: "scenario_b",
      code: "B",
      title: "Endpoint & Network Investigation",
      subtitle: "Office Macro Spawning PowerShell → C2 Beaconing",
    },
    {
      id: "scenario_c",
      code: "C",
      title: "Account & Payment Scam",
      subtitle: "Impossible Travel Logins → Urgent Vendor Bank Switch",
    },
  ]

  const handleRun = async (scenarioId: string = selectedScenario) => {
    setIsRunning(true)
    setError(null)
    setSelectedFinding(null)
    try {
      const data = await demoLabService.runScenario(scenarioId)
      setResult(data)
    } catch (err: any) {
      setError(`Failed to execute scenario: ${err.message || String(err)}`)
    } finally {
      setIsRunning(false)
    }
  }

  // Auto-run on initial mount
  useEffect(() => {
    handleRun(selectedScenario)
  }, [selectedScenario])

  const handleExportJson = () => {
    if (!result) return
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `AGEIS-X-INCIDENT-REPORT-${result.scenario.code}-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-8 font-mono">
      <DemoLabHeader
        engineId="INCIDENT WORKSPACE"
        engineName="Multi-Engine Incident Orchestration"
        category="Unified Cyber Triage"
        description="Correlates disparate telemetry across Link, Content, Endpoint, Network, Identity, Scam, and Threat feeds into an explainable, time-sequenced incident investigation."
        analysisMode="simulated"
        onReset={() => handleRun(selectedScenario)}
        isAnalyzing={isRunning}
      />

      {/* Scenario Selector Ribbon */}
      <div className="bg-[#0B0E14] border border-white/10 rounded-lg p-4 space-y-3">
        <div className="text-xs font-bold text-[#F8FAFC] flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#00E575]" />
            SELECT DEMONSTRATION SCENARIO
          </span>
          <div className="flex gap-2">
            {result && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportJson}
                className="h-7 text-xs border-white/10 hover:border-white/20 text-[#00E575] bg-[#00E575]/5"
              >
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Export Forensic JSON
              </Button>
            )}
            <Button
              size="sm"
              onClick={() => handleRun(selectedScenario)}
              disabled={isRunning}
              className="h-7 text-xs bg-[#00E575] hover:bg-[#00c966] text-[#07090E] font-bold"
            >
              <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
              {isRunning ? "Executing..." : "Re-Run Scenario"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {scenarios.map((sc) => {
            const isSelected = selectedScenario === sc.id
            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => setSelectedScenario(sc.id)}
                className={cn(
                  "text-left p-3 rounded border transition-all text-xs",
                  isSelected
                    ? "bg-[#151922] border-[#00E575] text-[#F8FAFC] shadow-sm shadow-[#00E575]/10"
                    : "bg-[#07090E] border-white/5 text-[#94A3B8] hover:border-white/15 hover:text-[#F8FAFC]"
                )}
              >
                <div className="flex items-center justify-between font-bold mb-1">
                  <span>Scenario {sc.code}</span>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-[#00E575]" />}
                </div>
                <div className="font-semibold text-[11px] text-[#E2E8F0] truncate">{sc.title}</div>
                <div className="text-[10px] text-[#64748B] mt-1 font-sans truncate">{sc.subtitle}</div>
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

      {/* Main Results View */}
      {result && (
        <div className="space-y-8">
          {/* M-14 Unified Assessment Result Card */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-[#64748B]">
              <span className="uppercase font-bold tracking-wider text-[#00E575] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                M-14 UNIFIED RISK & META DECISION AGGREGATION
              </span>
              <span>Execution Time: {result.execution_time_ms} ms</span>
            </div>
            <ResultCard result={result.unified_assessment} />
          </div>

          {/* Contributing Engines Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-[#F8FAFC] uppercase tracking-wider">
                PARTICIPATING ENGINES & COMPONENT EVALUATIONS ({result.engine_results.length})
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {result.engine_results.map((eng) => (
                <div
                  key={eng.engine_id}
                  className="bg-[#0B0E14] border border-white/10 rounded-lg p-4 space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#00E575] px-2 py-0.5 bg-[#00E575]/10 border border-[#00E575]/20 rounded">
                        {eng.engine_id}
                      </span>
                      <span
                        className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded uppercase",
                          eng.verdict === "malicious"
                            ? "bg-[#FF0055]/10 text-[#FF0055] border border-[#FF0055]/30"
                            : eng.verdict === "suspicious"
                            ? "bg-[#FFB800]/10 text-[#FFB800] border border-[#FFB800]/30"
                            : "bg-[#00E575]/10 text-[#00E575] border border-[#00E575]/30"
                        )}
                      >
                        {eng.verdict} ({eng.risk_score})
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-[#F8FAFC]">{eng.engine_name}</h4>
                    <p className="text-xs text-[#94A3B8] font-sans mt-1.5 leading-normal line-clamp-3">
                      {eng.summary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-[#64748B]">
                    <span>{eng.findings.length} findings</span>
                    <span className="text-[#00F0FF]">
                      {eng.analysis_mode === "live" ? "Live" : "Simulated"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Unified Findings & Rules */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TriggeredRulesTable rules={result.unified_assessment.triggered_rules} />
            <div className="space-y-6">
              <RecommendationsPanel recommendations={result.unified_assessment.recommendations} />
              <EvidencePanel evidence={result.unified_assessment.evidence} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function IncidentWorkspacePage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-8 text-center text-xs font-mono text-[#64748B]">
          Initializing Incident Workspace telemetry stream...
        </div>
      }
    >
      <IncidentWorkspaceInner />
    </React.Suspense>
  )
}
