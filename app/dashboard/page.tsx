"use client"

import React, { useState } from "react"
import Link from "next/link"
import { AppShell } from "@/components/layout/app-shell"
import { DataTable, Column } from "@/components/ui/data-table"
import {
  MOCK_SECURITY_SCORE,
  MOCK_CRITICAL_ATTENTION_ITEMS,
  MOCK_PROTECTION_DOMAINS,
  MOCK_ACTIVITY_FEED,
  MOCK_INCIDENTS,
  MOCK_RECOMMENDATIONS,
} from "@/lib/mock/security-data"
import { SecurityIncident } from "@/types/security"
import { DashboardHeaderBanner } from "@/components/dashboard/dashboard-header-banner"
import { CriticalAttentionCenter } from "@/components/dashboard/critical-attention-center"
import { SecurityPostureHero } from "@/components/dashboard/security-posture-hero"
import { TelemetryTrendChart } from "@/components/dashboard/telemetry-trend-chart"
import { ProtectionDomainsGrid } from "@/components/dashboard/protection-domains-grid"
import { ActivityTimelineSection } from "@/components/dashboard/activity-timeline-section"
import { RecommendationsSection } from "@/components/dashboard/recommendations-section"
import { WhatHappenedDrawer } from "@/components/dashboard/what-happened-drawer"
import { TechnicalLabel, DataStrip } from "@/components/design-system/editorial-primitives"
import { PixelSleepingCatState, SecuritySticker } from "@/components/design-system/pixel-art-system"
import { AlertOctagon, ArrowRight } from "lucide-react"

export default function DashboardOverviewPage() {
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSyncTime, setLastSyncTime] = useState("Just now")
  const [selectedIncident, setSelectedIncident] = useState<SecurityIncident | null>(null)
  const [incidentDrawerOpen, setIncidentDrawerOpen] = useState(false)

  const handleSync = () => {
    setIsSyncing(true)
    setTimeout(() => {
      setIsSyncing(false)
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
    }, 1200)
  }

  const handleIncidentClick = (incident: SecurityIncident) => {
    setSelectedIncident(incident)
    setIncidentDrawerOpen(true)
  }

  const incidentColumns: Column<SecurityIncident>[] = [
    {
      header: "INCIDENT VECTOR",
      cell: (item) => (
        <button
          type="button"
          onClick={() => handleIncidentClick(item)}
          className="text-left group focus:outline-none"
        >
          <span className="font-bold text-[#F1F0EB] block text-xs group-hover:text-[#39FF14] transition-colors">
            {item.title}
          </span>
          <span className="text-[10px] text-[#6F706D] font-mono">{item.target}</span>
        </button>
      ),
    },
    {
      header: "SEVERITY",
      cell: (item) => (
        <span
          className={`text-[9px] font-mono px-1.5 py-0.2 font-bold ${
            item.severity === "critical"
              ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
              : item.severity === "high"
              ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
              : "bg-[#39FF14]/15 text-[#39FF14] border border-[#39FF14]/30"
          }`}
        >
          {item.severity.toUpperCase()}
        </span>
      ),
    },
    {
      header: "STATUS",
      cell: (item) => (
        <span className="text-[9px] font-mono px-1.5 py-0.2 bg-white/5 text-[#A6A6A0] border border-white/10">
          {item.status.toUpperCase()}
        </span>
      ),
    },
    {
      header: "DETECTED",
      accessorKey: "detectedAt",
      className: "font-mono text-[11px] text-[#6F706D]",
    },
  ]

  return (
    <AppShell
      title="SECURITY OVERVIEW"
      breadcrumbs={[{ label: "OVERVIEW" }]}
    >
      <div className="space-y-8 font-mono">
        {/* 1. Header Context Banner */}
        <DashboardHeaderBanner
          onSync={handleSync}
          isSyncing={isSyncing}
          lastSyncTime={lastSyncTime}
        />

        {/* 2. Critical Attention Center */}
        <CriticalAttentionCenter items={MOCK_CRITICAL_ATTENTION_ITEMS} />

        {/* 3. Top Key Security Summary Data Strip (Replaces Card Wall) */}
        <div className="p-4 border border-white/10 bg-[#080808]">
          <DataStrip
            items={[
              { label: "THREATS ISOLATED (24H)", value: "1,429", subtext: "+12.4% vs previous 24h" },
              { label: "ON-DEVICE INFERENCE", value: "9.4ms", subtext: "Character n-gram local" },
              { label: "PROTECTED HOSTS", value: "4 / 5", subtext: "4 online, 1 pending link" },
              { label: "IDENTITY BREACH LEAKS", value: "0 LEAKS", subtext: "18 monitored aliases clean" },
            ]}
          />
        </div>

        {/* 4. Main Posture Score & Telemetry Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-5 flex flex-col">
            <SecurityPostureHero data={MOCK_SECURITY_SCORE} className="flex-1" />
          </div>

          <div className="lg:col-span-7 flex flex-col">
            <TelemetryTrendChart />
          </div>
        </div>

        {/* 5. Protection Domains Coverage */}
        <ProtectionDomainsGrid domains={MOCK_PROTECTION_DOMAINS} />

        {/* 6. Recent Activity Timeline & Incidents */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left 7 cols: Scannable Activity Timeline */}
          <div className="lg:col-span-7 space-y-4">
            <ActivityTimelineSection items={MOCK_ACTIVITY_FEED} />
          </div>

          {/* Right 5 cols: Active Incidents Table */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 border border-white/10 bg-[#080808] space-y-3 font-mono">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <AlertOctagon className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-bold text-[#F1F0EB] uppercase">
                    ACTIVE INCIDENTS ({MOCK_INCIDENTS.length})
                  </h3>
                </div>
                <Link
                  href="/dashboard/incidents"
                  className="text-xs text-[#39FF14] hover:underline font-mono inline-flex items-center gap-1 uppercase"
                >
                  <span>VIEW ALL</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <DataTable
                data={MOCK_INCIDENTS}
                columns={incidentColumns}
                keyExtractor={(item) => item.id}
              />
            </div>
          </div>
        </div>

        {/* 7. Recommendations Section */}
        <RecommendationsSection recommendations={MOCK_RECOMMENDATIONS} />
      </div>

      {/* Incident Explainability Drawer */}
      <WhatHappenedDrawer
        isOpen={incidentDrawerOpen}
        onClose={() => setIncidentDrawerOpen(false)}
        item={selectedIncident}
      />
    </AppShell>
  )
}
