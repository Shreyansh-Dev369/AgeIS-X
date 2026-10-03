"use client"

import React, { useState, useEffect } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { ChartContainer } from "@/components/ui/chart-container"
import { PixelBadge } from "@/components/ui/pixel-badge"
import { TacticalFrame } from "@/components/ui/tactical-frame"
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
} from "lucide-react"

const CATEGORY_DISTRIBUTION = [
  { name: "Phishing & URLs", value: 58, color: "#00ff66" },
  { name: "Malware / Macros", value: 18, color: "#ff3b30" },
  { name: "Network / C2", value: 12, color: "#00f0ff" },
  { name: "Identity Hooks", value: 8, color: "#ffb800" },
  { name: "Trackers & Privacy", value: 4, color: "#7e8b9b" },
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
      title="Security Analytics & Attestation Reports"
      breadcrumbs={[{ label: "Overview", href: "/dashboard" }, { label: "Analytics & Intel" }]}
    >
      <div className="space-y-6 font-mono select-none">
        {/* Header Summary */}
        <TacticalFrame
          variant="panel"
          reticles={true}
          reticleColor="cyan"
          className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-white/15 bg-[#080c10]"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <PixelBadge variant="cyan" size="sm" dot>
                TELEMETRY ANALYTICS
              </PixelBadge>
              <span className="text-[11px] text-[#00ff66]">
                [F1 PRECISION 99.82%]
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider text-[#f8fafc] font-sans">
              Fleet Telemetry & Vector Ingestion Analytics
            </h2>
            <p className="text-xs text-[#7e8b9b] max-w-2xl leading-relaxed">
              Deterministic performance metrics, vector category distributions, and certified executive compliance reports.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#040608] border border-white/10 text-center">
              <span className="text-[9px] uppercase text-[#7e8b9b] block">24H TELEMETRY</span>
              <span className="text-sm font-bold text-[#00f0ff]">48.2 MB</span>
            </div>
            <div className="p-3 bg-[#040608] border border-white/10 text-center">
              <span className="text-[9px] uppercase text-[#7e8b9b] block">FALSE POSITIVE</span>
              <span className="text-sm font-bold text-[#00ff66]">0.003%</span>
            </div>
          </div>
        </TacticalFrame>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <TacticalFrame variant="default" className="p-4 bg-[#080c10] border-white/10 space-y-1">
            <div className="flex items-center justify-between text-[#7e8b9b]">
              <span className="text-[10px] uppercase font-bold">TOTAL INGESTION VOLUME</span>
              <BarChart3 className="w-4 h-4 text-[#00f0ff]" />
            </div>
            <div className="text-2xl font-black text-[#00f0ff] tracking-tight">48.2 MB</div>
            <p className="text-[10px] text-[#7e8b9b]">+8.4% 24h telemetry packets</p>
          </TacticalFrame>

          <TacticalFrame variant="default" className="p-4 bg-[#080c10] border-white/10 space-y-1">
            <div className="flex items-center justify-between text-[#7e8b9b]">
              <span className="text-[10px] uppercase font-bold">NEURAL PRECISION (F1)</span>
              <TrendingUp className="w-4 h-4 text-[#00ff66]" />
            </div>
            <div className="text-2xl font-black text-[#00ff66] tracking-tight">99.82%</div>
            <p className="text-[10px] text-[#7e8b9b]">Verified local heuristic precision</p>
          </TacticalFrame>

          <TacticalFrame variant="default" className="p-4 bg-[#080c10] border-white/10 space-y-1">
            <div className="flex items-center justify-between text-[#7e8b9b]">
              <span className="text-[10px] uppercase font-bold">SCORE READINESS</span>
              <Activity className="w-4 h-4 text-[#00ff66]" />
            </div>
            <div className="text-2xl font-black text-[#f8fafc] tracking-tight">94 / 100</div>
            <p className="text-[10px] text-[#7e8b9b]">Optimal zero-trust baseline</p>
          </TacticalFrame>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Main Bar Chart: Ingestion Rate */}
          <div className="lg:col-span-8">
            <ChartContainer
              title="Hourly Incident & Vector Ingestion Rate"
              subtitle="Distribution of anomalous activity flags against clean traffic baseline"
            >
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={MOCK_TELEMETRY_CHART_DATA}>
                    <CartesianGrid strokeDasharray="2 2" stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis dataKey="time" stroke="#7e8b9b" fontSize={10} tickLine={false} />
                    <YAxis stroke="#7e8b9b" fontSize={10} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#040608",
                        borderColor: "rgba(255,255,255,0.15)",
                        borderRadius: "0px",
                        fontSize: "11px",
                        fontFamily: "monospace",
                        color: "#f8fafc",
                      }}
                    />
                    <Bar dataKey="cleanRequests" name="Clean Traffic" fill="#00f0ff" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="threatsBlocked" name="Threats Blocked" fill="#ff3b30" radius={[0, 0, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartContainer>
          </div>

          {/* Pie / Donut Chart: Threat Distribution */}
          <div className="lg:col-span-4">
            <ChartContainer
              title="Threat Vector Distribution"
              subtitle="Breakdown by primary attack vector"
            >
              <div className="h-64 w-full flex flex-col items-center justify-between font-mono text-xs">
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
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="#040608" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#040608",
                        borderColor: "rgba(255,255,255,0.15)",
                        fontSize: "10px",
                        fontFamily: "monospace",
                        color: "#f8fafc",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                <div className="w-full space-y-1 text-[10px] pt-2 border-t border-white/10">
                  {CATEGORY_DISTRIBUTION.slice(0, 3).map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-none shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-[#7e8b9b]">{item.name}</span>
                      </div>
                      <span className="text-[#f8fafc] font-bold">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </ChartContainer>
          </div>
        </div>

        {/* Security Reports Section */}
        <TacticalFrame
          variant="panel"
          reticles={true}
          reticleColor="phosphor"
          className="p-5 space-y-4 border-white/15 bg-[#080c10]"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#00ff66]" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#f8fafc]">
                  Executive Security Attestation Reports
                </h3>
              </div>
              <p className="text-[11px] text-[#7e8b9b]">
                Deterministic compliance summaries ready for audit and client-side JSON export.
              </p>
            </div>
            <PixelBadge variant="phosphor" size="sm">
              AUDIT READY
            </PixelBadge>
          </div>

          <div className="space-y-3">
            {reports.map((rep) => (
              <div
                key={rep.id}
                className="p-4 border border-white/10 bg-[#040608] flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#00ff66]">{rep.id}</span>
                    <span className="text-white/20">•</span>
                    <span className="text-xs font-bold text-[#f8fafc]">{rep.period}</span>
                    <PixelBadge variant="cyan" size="sm">
                      {rep.capability}
                    </PixelBadge>
                  </div>
                  <p className="text-[11px] text-[#7e8b9b] leading-relaxed max-w-2xl">
                    {rep.summary}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-[10px] text-white/50 pt-1">
                    <span>THREATS BLOCKED: <strong className="text-[#00ff66]">{rep.threatsBlocked}</strong></span>
                    <span>•</span>
                    <span>SCORE: <strong className="text-[#00f0ff]">{rep.overallScore}%</strong></span>
                    <span>•</span>
                    <span>COMPLIANCE: <strong className="text-white">{rep.fleetCompliance}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    onClick={() => handleOpenReport(rep)}
                    className="text-xs font-mono uppercase tracking-wider font-bold h-8 px-3"
                  >
                    [ VIEW FULL REPORT ]
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TacticalFrame>
      </div>

      {/* Security Report Detail Drawer */}
      {selectedReport && (
        <Drawer open={reportDrawerOpen} onOpenChange={(open) => !open && setReportDrawerOpen(false)}>
          <DrawerContent
            side="right"
            className="w-full sm:max-w-xl bg-[#040608] border-l border-white/15 p-0 text-[#f8fafc] flex flex-col h-full font-mono select-none"
          >
            <div className="p-4 sm:p-5 border-b border-white/10 bg-[#080c10] flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <PixelBadge variant="phosphor" size="sm" dot>
                    REPORT // {selectedReport.id}
                  </PixelBadge>
                  <span className="text-[11px] text-[#00f0ff]">SCORE: {selectedReport.overallScore}%</span>
                </div>
                <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-[#f8fafc] pt-1">
                  Executive Security Attestation Report
                </h2>
              </div>
              <button
                onClick={() => setReportDrawerOpen(false)}
                className="p-1 border border-white/10 hover:border-white/30 text-[#7e8b9b] hover:text-white transition-colors"
                aria-label="Close report"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs">
              <TacticalFrame variant="default" className="p-3.5 border-white/10 bg-[#080c10] space-y-1">
                <span className="text-[10px] text-[#00ff66] font-bold uppercase block">
                  EXECUTIVE SUMMARY // {selectedReport.period}
                </span>
                <p className="text-[#f8fafc] text-[11px] leading-relaxed pt-1">
                  {selectedReport.summary}
                </p>
              </TacticalFrame>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 border border-white/10 bg-[#080c10] space-y-1">
                  <span className="text-[10px] text-[#7e8b9b] uppercase block">TOTAL DETECTIONS</span>
                  <span className="text-base font-bold text-[#00ff66]">{selectedReport.threatsDetected}</span>
                </div>
                <div className="p-3 border border-white/10 bg-[#080c10] space-y-1">
                  <span className="text-[10px] text-[#7e8b9b] uppercase block">INCIDENTS CONTAINED</span>
                  <span className="text-base font-bold text-[#00f0ff]">{selectedReport.incidentsResolved}</span>
                </div>
              </div>

              {/* Key Findings List */}
              <div className="p-3.5 border border-white/10 bg-[#080c10] space-y-2">
                <span className="text-[10px] text-[#00f0ff] font-bold uppercase block">
                  VERIFIED AUDIT FINDINGS
                </span>
                <div className="space-y-1.5">
                  {selectedReport.keyFindings.map((finding, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-[11px] text-[#f8fafc]">
                      <span className="text-[#00ff66] font-bold shrink-0">[✓]</span>
                      <span>{finding}</span>
                    </div>
                  ))}
                </div>
              </div>

              {exportNotice && (
                <div className="p-2.5 bg-[#00ff66]/10 border border-[#00ff66]/40 text-[#00ff66] text-[11px] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Report exported successfully to client device.</span>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-white/10 bg-[#080c10] flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportJSON}
                className="text-xs font-mono uppercase tracking-wider h-8 px-3 border-white/20 gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-[#00ff66]" />
                <span>[ EXPORT JSON ]</span>
              </Button>
              <Button
                size="sm"
                onClick={() => setReportDrawerOpen(false)}
                className="text-xs font-mono uppercase tracking-wider font-bold h-8 px-4"
              >
                [ CLOSE REPORT ]
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </AppShell>
  )
}
