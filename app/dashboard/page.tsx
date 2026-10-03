"use client"

import React, { useState } from "react"
import Link from "next/link"
import { AppShell } from "@/components/layout/app-shell"
import { DataTable, Column } from "@/components/ui/data-table"
import { PixelBadge } from "@/components/ui/pixel-badge"
import { TacticalFrame } from "@/components/ui/tactical-frame"
import {
  MOCK_SECURITY_SCORE,
  MOCK_CRITICAL_ATTENTION_ITEMS,
  MOCK_PROTECTION_DOMAINS,
  MOCK_ACTIVITY_FEED,
  MOCK_INCIDENTS,
  MOCK_RECOMMENDATIONS,
  MOCK_THREAT_INTELLIGENCE,
} from "@/lib/mock/security-data"
import { SecurityIncident } from "@/types/security"
import { DashboardHeaderBanner } from "@/components/dashboard/dashboard-header-banner"
import { CriticalAttentionCenter } from "@/components/dashboard/critical-attention-center"
import { SecurityPostureHero } from "@/components/dashboard/security-posture-hero"
import { TelemetryTrendChart } from "@/components/dashboard/telemetry-trend-chart"
import { ProtectionDomainsGrid } from "@/components/dashboard/protection-domains-grid"
import { SurfacePostureCards } from "@/components/dashboard/surface-posture-cards"
import { ActivityTimelineSection } from "@/components/dashboard/activity-timeline-section"
import { RecommendationsSection } from "@/components/dashboard/recommendations-section"
import { ThreatIntelligenceCard } from "@/components/dashboard/threat-intelligence-card"
import { WhatHappenedDrawer } from "@/components/dashboard/what-happened-drawer"
import { ShieldCheck, Zap, Laptop, Activity, ArrowRight, AlertOctagon } from "lucide-react"

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
      header: "INCIDENT ID",
      accessorKey: "id",
      className: "font-mono text-xs text-[#00ff66] font-bold",
    },
    {
      header: "VECTOR / TARGET",
      cell: (item) => (
        <button
          onClick={() => handleIncidentClick(item)}
          className="text-left group focus:outline-none"
        >
          <span className="font-bold text-[#f8fafc] block text-xs group-hover:text-[#00ff66] transition-colors">
            {item.title}
          </span>
          <span className="text-[10px] font-mono text-[#7e8b9b]">{item.target}</span>
        </button>
      ),
    },
    {
      header: "SEVERITY",
      cell: (item) => (
        <PixelBadge
          variant={item.severity === "critical" ? "danger" : item.severity === "high" ? "warning" : "cyan"}
          size="sm"
        >
          {item.severity.toUpperCase()}
        </PixelBadge>
      ),
    },
    {
      header: "STATUS",
      cell: (item) => (
        <PixelBadge variant="phosphor" size="sm">
          {item.status}
        </PixelBadge>
      ),
    },
    {
      header: "TIMESTAMP",
      accessorKey: "detectedAt",
      className: "font-mono text-[10px] text-[#7e8b9b]",
    },
  ]

  return (
    <AppShell
      title="Security Command Center"
      breadcrumbs={[{ label: "Overview" }]}
    >
      <div className="space-y-6">
        {/* 1. Header Context Banner */}
        <DashboardHeaderBanner
          onSync={handleSync}
          isSyncing={isSyncing}
          lastSyncTime={lastSyncTime}
        />

        {/* 2. Critical Attention Center */}
        <CriticalAttentionCenter items={MOCK_CRITICAL_ATTENTION_ITEMS} />

        {/* 3. Top Security Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
          <TacticalFrame variant="default" className="p-4 bg-[#080c10] border-white/10 space-y-1">
            <div className="flex items-center justify-between text-[#7e8b9b]">
              <span className="text-[10px] uppercase font-bold">THREATS BLOCKED (24H)</span>
              <ShieldCheck className="w-4 h-4 text-[#00ff66]" />
            </div>
            <div className="text-2xl font-black text-[#00ff66] tracking-tight">1,429</div>
            <p className="text-[10px] text-[#7e8b9b]">+12.4% vs previous 24h</p>
          </TacticalFrame>

          <TacticalFrame variant="default" className="p-4 bg-[#080c10] border-white/10 space-y-1">
            <div className="flex items-center justify-between text-[#7e8b9b]">
              <span className="text-[10px] uppercase font-bold">LOCAL ML INFERENCE</span>
              <Zap className="w-4 h-4 text-[#00f0ff]" />
            </div>
            <div className="text-2xl font-black text-[#00f0ff] tracking-tight">9.4 MS</div>
            <p className="text-[10px] text-[#7e8b9b]">Sub-second on-device p99 latency</p>
          </TacticalFrame>

          <TacticalFrame variant="default" className="p-4 bg-[#080c10] border-white/10 space-y-1">
            <div className="flex items-center justify-between text-[#7e8b9b]">
              <span className="text-[10px] uppercase font-bold">FLEET ENDPOINT NODES</span>
              <Laptop className="w-4 h-4 text-[#ffb800]" />
            </div>
            <div className="text-2xl font-black text-[#f8fafc] tracking-tight">4 / 5</div>
            <p className="text-[10px] text-[#7e8b9b]">4 online, 1 awaiting daemon link</p>
          </TacticalFrame>

          <TacticalFrame variant="default" className="p-4 bg-[#080c10] border-white/10 space-y-1">
            <div className="flex items-center justify-between text-[#7e8b9b]">
              <span className="text-[10px] uppercase font-bold">CREDENTIAL EXPOSURE</span>
              <Activity className="w-4 h-4 text-[#00ff66]" />
            </div>
            <div className="text-2xl font-black text-[#00ff66] tracking-tight">0 LEAKS</div>
            <p className="text-[10px] text-[#7e8b9b]">18 aliases breach watch active</p>
          </TacticalFrame>
        </div>

        {/* 4. Hero Posture Score & Main Telemetry Ingestion Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-5 flex flex-col">
            <SecurityPostureHero data={MOCK_SECURITY_SCORE} className="flex-1" />
          </div>

          <div className="lg:col-span-7 flex flex-col">
            <TelemetryTrendChart />
          </div>
        </div>

        {/* 5. 10-Domain Synchronized Defense Grid */}
        <ProtectionDomainsGrid domains={MOCK_PROTECTION_DOMAINS} />

        {/* 6. Surface Posture Summaries (Fleet, Identity, Privacy, Data) */}
        <SurfacePostureCards />

        {/* 7. Bottom Core Grid: Activity Timeline & Incident / Threat Intel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left 7 cols: Scannable Activity Timeline with Explainability Drawer */}
          <div className="lg:col-span-7 space-y-4">
            <ActivityTimelineSection items={MOCK_ACTIVITY_FEED} />
          </div>

          {/* Right 5 cols: Active Incidents Table & Threat Intelligence Card */}
          <div className="lg:col-span-5 space-y-4">
            {/* Active Incidents Summary */}
            <TacticalFrame
              variant="panel"
              reticles={true}
              reticleColor="warning"
              className="p-5 space-y-3 border-white/15 bg-[#080c10] font-mono select-none"
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <AlertOctagon className="w-4 h-4 text-[#ffb800]" />
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#f8fafc]">
                    Security Incidents ({MOCK_INCIDENTS.length})
                  </h3>
                </div>
                <Link
                  href="/dashboard/incidents"
                  className="text-xs text-[#00ff66] hover:underline uppercase font-bold"
                >
                  [ VIEW ALL → ]
                </Link>
              </div>

              <DataTable
                data={MOCK_INCIDENTS}
                columns={incidentColumns}
                keyExtractor={(item) => item.id}
              />
            </TacticalFrame>

            {/* Global Threat Intelligence Architecture Card */}
            <ThreatIntelligenceCard data={MOCK_THREAT_INTELLIGENCE} />
          </div>
        </div>

        {/* 8. Recommendations Engine Section */}
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
