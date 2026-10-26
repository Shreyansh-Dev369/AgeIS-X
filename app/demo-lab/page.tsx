"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  Sparkles,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Activity,
  Layers,
  Cpu,
  Lock,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ENGINES_LIST } from "@/components/demo-lab/engine-nav-tabs"

export default function DemoLabDirectoryPage() {
  const scenarios = [
    {
      code: "A",
      title: "Suspicious Link Investigation",
      category: "URL & Content Intelligence",
      engines: ["M-01", "M-02", "M-09"],
      desc: "Contrasts verified authentic domains against adversarial Cyrillic homoglyphs and off-domain credential harvesting.",
      path: "/demo-lab/incident-workspace?scenario=scenario_a",
    },
    {
      code: "B",
      title: "Endpoint & Network Intrusion",
      category: "Host & Egress Telemetry",
      engines: ["M-04", "M-05", "M-10"],
      desc: "Correlates Office macro spawning obfuscated PowerShell with periodic low-jitter C2 beaconing on port 8443.",
      path: "/demo-lab/incident-workspace?scenario=scenario_b",
    },
    {
      code: "C",
      title: "Account & Payment Scam",
      category: "Identity & Financial Defense",
      engines: ["M-06", "M-07", "M-08"],
      desc: "Analyzes impossible-travel login anomalies alongside urgent invoice diversion lures and masqueraded PE files.",
      path: "/demo-lab/incident-workspace?scenario=scenario_c",
    },
    {
      code: "D",
      title: "Multi-Stage Cyber Kill Chain",
      category: "Full Incident Workspace",
      engines: ["M-01", "M-02", "M-04", "M-05", "M-06", "M-10", "M-13", "M-14"],
      desc: "End-to-end incident reconstruction: Phishing email -> Credential compromise -> Process injection -> C2 -> Unified risk score.",
      path: "/demo-lab/incident-workspace?scenario=scenario_d",
      highlight: true,
    },
  ]

  return (
    <div className="space-y-10 font-mono">
      {/* Top Banner */}
      <div className="border border-white/10 bg-[#0B0E14] p-6 sm:p-8 rounded-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00E575]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00E575]/10 text-[#00E575] border border-[#00E575]/20 text-xs font-bold rounded mb-4">
            <Cpu className="w-3.5 h-3.5" />
            ACADEMIC CYBERSECURITY DEMO LAB — M-01 TO M-14
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#F8FAFC] tracking-tight">
            AgeIS-X Cyber Defense Demonstration Lab
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#94A3B8] font-sans leading-relaxed">
            A comprehensive, interactive demonstration suite containing 14 modular cybersecurity engines.
            Designed for transparent academic presentation: every module performs either real live inspection
            or deterministic, explainable rule analysis over clearly labelled synthetic telemetry.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild className="bg-[#00E575] hover:bg-[#00c966] text-[#07090E] font-bold text-xs">
              <Link href="/demo-lab/incident-workspace">
                <Sparkles className="w-4 h-4 mr-2" />
                Launch Incident Workspace (Scenario D)
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-white/10 hover:border-white/20 text-[#F8FAFC] text-xs">
              <Link href="/demo-lab/m01-url">
                Explore Engine M-01 (URL Intelligence)
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* 4 Presentation Scenarios */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-[#F8FAFC] flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#00E575]" />
              Presentation-Ready Scenarios
            </h2>
            <p className="text-xs text-[#64748B] font-sans mt-0.5">
              Four deterministic, reproducible scenarios tailored for classroom walkthroughs.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scenarios.map((sc) => (
            <div
              key={sc.code}
              className={`p-5 rounded-lg border transition-all ${
                sc.highlight
                  ? "bg-[#0B0E14] border-[#00E575]/40 shadow-lg shadow-[#00E575]/5"
                  : "bg-[#0B0E14] border-white/10 hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded bg-[#00E575]/10 text-[#00E575] border border-[#00E575]/30 flex items-center justify-center font-bold text-xs">
                    {sc.code}
                  </span>
                  <span className="text-xs text-[#64748B] uppercase">{sc.category}</span>
                </div>
                <div className="flex gap-1">
                  {sc.engines.map((e) => (
                    <span key={e} className="px-1.5 py-0.5 text-[10px] bg-white/[0.04] text-[#94A3B8] rounded">
                      {e}
                    </span>
                  ))}
                </div>
              </div>

              <h3 className="text-base font-bold text-[#F8FAFC] mt-1">{sc.title}</h3>
              <p className="text-xs text-[#94A3B8] font-sans mt-1.5 leading-relaxed">{sc.desc}</p>

              <div className="mt-4 pt-3 border-t border-white/5 flex justify-end">
                <Button asChild size="sm" variant="ghost" className="h-7 text-xs text-[#00E575] hover:text-[#00E575] hover:bg-[#00E575]/10">
                  <Link href={sc.path}>
                    Run Scenario {sc.code} <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 14 Engines Directory Grid */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-[#F8FAFC] flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#00F0FF]" />
            All 14 Security Intelligence Engines (M-01 — M-14)
          </h2>
          <p className="text-xs text-[#64748B] font-sans mt-0.5">
            Every module includes dedicated controls, explainable rules, findings, evidence, and honest scope boundaries.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {ENGINES_LIST.map((eng) => {
            const Icon = eng.icon
            return (
              <Link
                key={eng.id}
                href={eng.path}
                className="group p-4 bg-[#0B0E14] border border-white/10 hover:border-[#00E575]/40 rounded-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-[#00E575] px-2 py-0.5 bg-[#00E575]/10 border border-[#00E575]/20 rounded">
                      {eng.id}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        eng.mode === "live"
                          ? "bg-[#00E575]/10 text-[#00E575] border border-[#00E575]/20"
                          : "bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/20"
                      }`}
                    >
                      {eng.mode === "live" ? "Live" : "Simulated"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-[#94A3B8] group-hover:text-[#00E575] transition-colors" />
                    <h3 className="text-sm font-bold text-[#F8FAFC] group-hover:text-[#00E575] transition-colors">
                      {eng.name}
                    </h3>
                  </div>
                </div>

                <div className="mt-4 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-[#64748B] group-hover:text-[#94A3B8]">
                  <span>Launch Engine</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
