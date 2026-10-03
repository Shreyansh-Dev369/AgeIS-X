"use client"

import React, { useState, useEffect } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { ChartContainer } from "@/components/ui/chart-container"
import { PixelBadge } from "@/components/ui/pixel-badge"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent } from "@/components/ui/drawer"
import { MOCK_TELEMETRY_CHART_DATA, MOCK_SECURITY_SCORE } from "@/lib/mock/security-data"
import { securityService, MOCK_SECURITY_REPORTS } from "@/lib/services/security-service"
import { SecurityReport } from "@/types/security"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts"
import {
  BarChart3,
  TrendingUp,
  Activity,
  FileText,
  Download,
  ShieldCheck,
  CheckCircle2,
  X,
  ArrowUpRight,
} from "lucide-react"

const CATEGORY_DISTRIBUTION = [
  { name: "Phishing & URLs", value: 58, color: "#00e575" },
  { name: "Malware & Droppers", value: 18, color: "#ff4b4b" },
  { name: "Network & C2", value: 12, color: "#00e5ff" },
  { name: "Identity Hooks", value: 8, color: "#ffb800" },
  { name: "Trackers & Privacy", value: 4, color: "#64748b" },
]

export default function AnalyticsPage() {
  const [reports, setReports] = useState<SecurityReport[]>(MOCK_SECURITY_REPORTS)
  const [selectedReport, setSelectedReport] = useState<SecurityReport | null>(null)
  const [reportDrawerOpen, setReportDrawerOpen] = useState(false)
  const [exportNotice, setExportNotice] = useState(false)

  const handleOpenReport = (rep: SecurityReport) => {
    setSelectedReport(rep)
    setReportDrawerOpen(true)
  }

  const handleExportJSON = () => {
    if (!selectedReport) return
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(selectedReport, null, 2))
    const downloadAnchor = document.createElement("a")
    downloadAnchor.setAttribute("href", dataStr)
    downloadAnchor.setAttribute("download", `ageis_x_report_${selectedReport.id.toLowerCase()}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
    setExportNotice(true)
    setTimeout(() => setExportNotice(false), 3000)
  }

  return (
    <AppShell
      title="Analytics & Reports"
      breadcrumbs={[{ label: "Overview", href: "/dashboard" }, { label: "Analytics" }]}
    >
      <div className="space-y-6">
        {/* Header Summary */}
        <div className="p-5 rounded-lg border border-slate-800 bg-[#080d16] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <PixelBadge variant="cyan" size="sm" dot>
                Telemetry Analytics
              </PixelBadge>
              <span className="text-xs font-mono text-slate-400">
                F1 Precision: 99.82%
              </span>
            </div>
            <h1 className="text-lg font-bold text-slate-100">
              Fleet Telemetry & Vector Ingestion Analytics
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Performance metrics, vector category distributions, and certified executive security reports.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="p-3 bg-[#04070d] rounded border border-slate-800 text-center min-w-[120px]">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">24h Ingestion</span>
              <span className="text-sm font-bold text-[#00e5ff]">48.2 MB</span>
            </div>
            <div className="p-3 bg-[#04070d] rounded border border-slate-800 text-center min-w-[120px]">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">False Positives</span>
              <span className="text-sm font-bold text-[#00e575]">0.003%</span>
            </div>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-[#080d16] border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Total Ingestion Volume</span>
              <BarChart3 className="w-4 h-4 text-[#00e5ff]" />
            </div>
            <div className="text-2xl font-bold text-[#00e5ff] tracking-tight">48.2 MB</div>
            <p className="text-[11px] text-slate-400">+8.4% 24h telemetry packets</p>
          </div>

          <div className="p-4 rounded-lg bg-[#080d16] border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Heuristic Precision (F1)</span>
              <TrendingUp className="w-4 h-4 text-[#00e575]" />
            </div>
            <div className="text-2xl font-bold text-[#00e575] tracking-tight">99.82%</div>
            <p className="text-[11px] text-slate-400">Verified local heuristic accuracy</p>
          </div>

          <div className="p-4 rounded-lg bg-[#080d16] border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Readiness Index</span>
              <Activity className="w-4 h-4 text-[#00e575]" />
            </div>
            <div className="text-2xl font-bold text-slate-100 tracking-tight">94 / 100</div>
            <p className="text-[11px] text-slate-400">Optimal zero-trust baseline</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Main Bar Chart: Ingestion Rate */}
          <div className="lg:col-span-8">
            <ChartContainer
              title="Hourly Ingestion & Threat Block Rate"
              subtitle="Comparison of clean traffic baseline against blocked threats"
            >
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={MOCK_TELEMETRY_CHART_DATA}>
                    <CartesianGrid strokeDasharray="2 2" stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#04070d",
                        borderColor: "rgba(255,255,255,0.15)",
                        borderRadius: "6px",
                        fontSize: "12px",
                        color: "#f8fafc",
                      }}
                    />
                    <Bar dataKey="cleanRequests" name="Clean Traffic" fill="#00e5ff" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="threatsBlocked" name="Threats Blocked" fill="#ff4b4b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartContainer>
          </div>

          {/* Pie / Donut Chart: Threat Distribution */}
          <div className="lg:col-span-4">
            <ChartContainer
              title="Vector Distribution"
              subtitle="Breakdown by primary attack vector"
            >
              <div className="h-64 w-full flex flex-col items-center justify-between text-xs">
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={CATEGORY_DISTRIBUTION}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {CATEGORY_DISTRIBUTION.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="#04070d" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#04070d",
                        borderColor: "rgba(255,255,255,0.15)",
                        borderRadius: "6px",
                        fontSize: "11px",
                        color: "#f8fafc",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                <div className="w-full space-y-1.5 text-[11px] pt-2 border-t border-slate-800">
                  {CATEGORY_DISTRIBUTION.slice(0, 3).map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-slate-400">{item.name}</span>
                      </div>
                      <span className="text-slate-200 font-semibold">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </ChartContainer>
          </div>
        </div>

        {/* Security Reports Section */}
        <div className="p-5 rounded-lg space-y-4 border border-slate-800 bg-[#080d16]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#00e575]" />
                <h2 className="text-base font-bold text-slate-100">
                  Executive Security Attestation Reports
                </h2>
              </div>
              <p className="text-xs text-slate-400">
                Compliance summaries ready for review and local JSON export.
              </p>
            </div>
            <PixelBadge variant="phosphor" size="sm">
              Audit Ready
            </PixelBadge>
          </div>

          <div className="space-y-3">
            {reports.map((rep) => (
              <div
                key={rep.id}
                className="p-4 rounded-lg border border-slate-800 bg-[#04070d] flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#00e575]">{rep.id}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs font-semibold text-slate-200">{rep.period}</span>
                    <PixelBadge variant="cyan" size="sm">
                      {rep.capability}
                    </PixelBadge>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                    {rep.summary}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1">
                    <span>Threats Blocked: <strong className="text-[#00e575] font-mono">{rep.threatsBlocked}</strong></span>
                    <span>•</span>
                    <span>Score: <strong className="text-[#00e5ff] font-mono">{rep.overallScore}%</strong></span>
                    <span>•</span>
                    <span>Compliance: <strong className="text-slate-300">{rep.fleetCompliance}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenReport(rep)}
                    className="text-xs h-8 px-3 border-slate-700 bg-slate-900"
                  >
                    View Report
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Security Report Detail Drawer */}
      {selectedReport && (
        <Drawer open={reportDrawerOpen} onOpenChange={(open) => !open && setReportDrawerOpen(false)}>
          <DrawerContent
            side="right"
            className="w-full sm:max-w-xl bg-[#04070d] border-l border-slate-800 p-0 text-slate-100 flex flex-col h-full"
          >
            <div className="p-5 border-b border-slate-800 bg-[#080d16] flex items-start justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <PixelBadge variant="phosphor" size="sm" dot>
                    Report: {selectedReport.id}
                  </PixelBadge>
                  <span className="text-xs text-[#00e5ff] font-mono">Score: {selectedReport.overallScore}%</span>
                </div>
                <h2 className="text-base font-bold text-slate-100">
                  Executive Security Attestation Report
                </h2>
              </div>
              <button
                onClick={() => setReportDrawerOpen(false)}
                className="p-1 rounded border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors"
                aria-label="Close report"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              <div className="p-4 rounded-lg border border-slate-800 bg-[#080d16] space-y-1.5">
                <span className="text-[11px] font-semibold text-[#00e575] uppercase tracking-wider block">
                  Executive Summary ({selectedReport.period})
                </span>
                <p className="text-slate-300 text-xs leading-relaxed">
                  {selectedReport.summary}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-lg border border-slate-800 bg-[#080d16] space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Detections</span>
                  <span className="text-base font-bold text-[#00e575] font-mono">{selectedReport.threatsDetected}</span>
                </div>
                <div className="p-3.5 rounded-lg border border-slate-800 bg-[#080d16] space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Incidents Contained</span>
                  <span className="text-base font-bold text-[#00e5ff] font-mono">{selectedReport.incidentsResolved}</span>
                </div>
              </div>

              {/* Key Findings List */}
              <div className="p-4 rounded-lg border border-slate-800 bg-[#080d16] space-y-2.5">
                <span className="text-[11px] text-slate-300 uppercase font-semibold block">
                  Verified Audit Findings
                </span>
                <div className="space-y-2">
                  {selectedReport.keyFindings.map((finding, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00e575] shrink-0 mt-0.5" />
                      <span>{finding}</span>
                    </div>
                  ))}
                </div>
              </div>

              {exportNotice && (
                <div className="p-3 bg-[#00e575]/10 border border-[#00e575]/30 text-[#00e575] rounded-lg text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Report exported successfully as JSON.</span>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-800 bg-[#080d16] flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportJSON}
                className="text-xs h-8 px-3 border-slate-700 bg-slate-900 gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-[#00e575]" />
                <span>Export JSON</span>
              </Button>
              <Button
                size="sm"
                onClick={() => setReportDrawerOpen(false)}
                className="text-xs font-medium h-8 px-4"
              >
                Close Report
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </AppShell>
  )
}
