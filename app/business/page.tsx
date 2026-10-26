"use client"

import React, { useState } from "react"
import Link from "next/link"
import { PublicShell } from "@/components/layout/public-shell"
import { Button } from "@/components/ui/button"
import {
  EditorialSection,
  EditorialHeading,
  TechnicalLabel,
  SignalMarker,
} from "@/components/design-system/editorial-primitives"
import { SecuritySticker } from "@/components/design-system/pixel-art-system"
import { EnterprisePilotModal } from "@/components/business/enterprise-pilot-modal"
import { Building2, Server, Key, ArrowRight, Check, ShieldCheck, Activity, Terminal } from "lucide-react"

const capabilities = [
  {
    num: "01",
    title: "CENTRALIZED SEC-OPS CONSOLE",
    tagline: "FLEET POSTURE SYNCHRONIZATION",
    desc: "Aggregates fleet security scores, pending OS updates, and anomalous process executions into a centralized high-signal console without privacy leakage.",
    icon: Building2,
  },
  {
    num: "02",
    title: "RAW SIEM & JSON AUDIT STREAMS",
    tagline: "HIGH-THROUGHPUT PIPELINES",
    desc: "Stream raw audit events directly to Splunk, Datadog, or Elasticsearch with standardized CEF and JSON log formats with sub-50ms dispatch latency.",
    icon: Server,
  },
  {
    num: "03",
    title: "SAML 2.0 / OIDC ENCLAVE INTEGRATION",
    tagline: "IDENTITY PROVIDER DELEGATION",
    desc: "Integrate with Okta, Azure AD, or Google Workspace to automate daemon provisioning and policy assignment per user group.",
    icon: Key,
  },
]

export default function BusinessPage() {
  const [isPilotModalOpen, setIsPilotModalOpen] = useState(false)
  const [fleetSizer, setFleetSizer] = useState(250)

  return (
    <PublicShell>
      {/* 1. HERO (MODE B - EDITORIAL BLACK) */}
      <EditorialSection mode="editorial-black" className="pt-10 pb-16 md:pt-16 md:pb-24 font-mono">
        <div className="space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <SignalMarker status="active" label="ORGANIZATION & ENCLAVES" />
              <span className="text-white/30 text-xs font-mono">/</span>
              <TechnicalLabel>ENTERPRISE SPECIFICATION</TechnicalLabel>
            </div>
            <div className="flex items-center gap-3">
              <SecuritySticker type="access_granted" size="sm" />
            </div>
          </div>

          <div className="max-w-4xl space-y-6">
            <EditorialHeading level={1} className="leading-[0.92]">
              FLEET SOVEREIGNTY.
              <br />
              <span className="text-[#39FF14]">ZERO AGENT FRICTION.</span>
            </EditorialHeading>

            <p className="text-base sm:text-lg text-[#A6A6A0] max-w-2xl leading-relaxed font-sans font-normal">
              The same zero-overhead autonomous security engine that protects personal workstations, scaled for fleet visibility, SIEM integration, and centralized policy enforcement.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <Button
                onClick={() => setIsPilotModalOpen(true)}
                className="bg-[#39FF14] hover:bg-[#32E012] text-[#07090E] font-mono font-bold text-xs uppercase tracking-wider rounded-none px-7 h-11 shadow-[0_1px_3px_rgba(0,0,0,0.4),0_0_12px_rgba(0,229,117,0.2)] cursor-pointer"
              >
                <span>INITIATE ENTERPRISE PILOT</span>
                <ArrowRight className="w-3.5 h-3.5 ml-2" />
              </Button>
              <Button
                variant="outline"
                asChild
                className="border-white/20 bg-transparent hover:bg-white/5 text-[#F1F0EB] text-xs font-mono rounded-none h-11 px-6"
              >
                <Link href="/dashboard">PREVIEW SEC-OPS CONSOLE</Link>
              </Button>
            </div>
          </div>
        </div>
      </EditorialSection>

      {/* 2. INTERACTIVE FLEET SIZER & METRICS BENCHMARK */}
      <EditorialSection mode="dark-lab" className="py-16 md:py-20 border-b border-white/10">
        <div className="space-y-8 font-mono">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <span className="text-xs font-bold text-[#39FF14] uppercase tracking-wider block">
                01 / FLEET SIZING ENGINE
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase text-[#F1F0EB] mt-1">
                RESOURCE & TELEMETRY CALCULATOR
              </h2>
            </div>
            <span className="text-xs text-[#A6A6A0]">REAL-TIME ENCLAVE ESTIMATES</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4 p-6 bg-[#07090E] border border-white/15">
              <span className="text-[10px] text-[#6F706D] uppercase block">
                SLIDE TO CONFIGURE MANAGED ENDPOINTS:
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black text-[#39FF14]">{fleetSizer.toLocaleString()}</span>
                <span className="text-xs text-[#A6A6A0] uppercase">NODES ALLOCATED</span>
              </div>
              <input
                type="range"
                min={50}
                max={5000}
                step={50}
                value={fleetSizer}
                onChange={(e) => setFleetSizer(Number(e.target.value))}
                className="w-full accent-[#39FF14] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#6F706D]">
                <span>50 SMALL TEAM</span>
                <span>1,000 MID-MARKET</span>
                <span>5,000+ GLOBAL CORP</span>
              </div>
              <Button
                onClick={() => setIsPilotModalOpen(true)}
                className="w-full bg-[#39FF14] hover:bg-[#32E012] text-[#07090E] font-bold text-xs uppercase h-10 rounded-none shadow-[0_1px_3px_rgba(0,0,0,0.4),0_0_12px_rgba(0,229,117,0.2)] mt-2 cursor-pointer"
              >
                REQUEST PILOT FOR {fleetSizer} NODES
              </Button>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-5 bg-[#07090E] border border-white/10 space-y-2">
                <span className="text-[10px] text-[#6F706D] block uppercase">DAEMON FOOTPRINT</span>
                <span className="text-xl font-bold text-[#F1F0EB]">{(fleetSizer * 0.035).toFixed(1)} GB</span>
                <p className="text-[11px] text-[#A6A6A0] font-sans">
                  Total RAM consumption across all {fleetSizer} nodes combined.
                </p>
              </div>

              <div className="p-5 bg-[#07090E] border border-white/10 space-y-2">
                <span className="text-[10px] text-[#6F706D] block uppercase">CLOUD EGRESS SAVINGS</span>
                <span className="text-xl font-bold text-[#39FF14]">0.00 TB</span>
                <p className="text-[11px] text-[#A6A6A0] font-sans">
                  Zero raw URLs or private messages siphoned to offshore cloud.
                </p>
              </div>

              <div className="p-5 bg-[#07090E] border border-white/10 space-y-2">
                <span className="text-[10px] text-[#6F706D] block uppercase">SIEM LATENCY</span>
                <span className="text-xl font-bold text-[#00E5FF]">&lt; 35ms</span>
                <p className="text-[11px] text-[#A6A6A0] font-sans">
                  Standardized JSON/CEF audit dispatch directly to Splunk/Datadog.
                </p>
              </div>
            </div>
          </div>
        </div>
      </EditorialSection>

      {/* 3. FLEET CAPABILITIES (MODE A - DARK LAB / CONTINUOUS ROWS) */}
      <EditorialSection mode="dark-lab" className="py-20 md:py-28 border-b border-white/10">
        <div className="space-y-12 font-mono">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
            <div className="space-y-2">
              <TechnicalLabel className="text-[#39FF14]">ORCHESTRATION LAYER</TechnicalLabel>
              <EditorialHeading level={2}>FLEET SECURITY ARCHITECTURE</EditorialHeading>
            </div>
            <span className="text-xs text-[#A6A6A0]">MDM READY (JAMF / INTUNE)</span>
          </div>

          <div className="divide-y divide-white/10 border-t border-b border-white/10">
            {capabilities.map((c, idx) => {
              const Icon = c.icon
              return (
                <div
                  key={idx}
                  className="py-8 px-2 sm:px-4 grid grid-cols-1 md:grid-cols-12 gap-6 items-start hover:bg-white/[0.02] transition-colors group font-mono"
                >
                  <div className="md:col-span-1 text-base font-bold text-[#39FF14]">
                    {c.num}
                  </div>
                  <div className="md:col-span-4 space-y-1">
                    <span className="text-[10px] tracking-widest text-[#A6A6A0] uppercase block">
                      {c.tagline}
                    </span>
                    <h3 className="text-base font-bold text-[#F1F0EB] group-hover:text-[#39FF14] transition-colors flex items-center gap-2">
                      <Icon className="w-4 h-4 text-[#A6A6A0] group-hover:text-[#39FF14]" />
                      {c.title}
                    </h3>
                  </div>
                  <div className="md:col-span-7 text-xs sm:text-sm text-[#A6A6A0] leading-relaxed font-sans">
                    {c.desc}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </EditorialSection>

      {/* 4. DEPLOYMENT MODELS (MODE C - OFF-WHITE PAPER TEXTURE) */}
      <EditorialSection mode="off-white-editorial" className="py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start font-mono">
          <div className="lg:col-span-4 space-y-3">
            <TechnicalLabel className="text-[#6F706D] font-bold">SECTOR TARGETING</TechnicalLabel>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#07090E] tracking-tight leading-tight uppercase">
              DESIGNED FOR HIGH-RISK ENVIRONMENTS.
            </h2>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 border border-[#242424]/20 bg-[#F1F0EB] space-y-4">
              <h3 className="text-base font-bold text-[#07090E] uppercase">ENGINEERING ORGANIZATIONS</h3>
              <p className="text-xs text-[#6F706D] leading-relaxed font-sans">
                Developers frequently compile raw code and hold high-value cloud credentials. AgeIS-X protects API keys and shell sessions without compiler throttling.
              </p>
              <div className="space-y-1 text-xs text-[#07090E]">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#07090E]" />
                  <span>0% slowdown on C++ / Rust builds</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#07090E]" />
                  <span>Enclave-isolated SSH keys</span>
                </div>
              </div>
            </div>

            <div className="p-6 border border-[#242424]/20 bg-[#F1F0EB] space-y-4">
              <h3 className="text-base font-bold text-[#07090E] uppercase">DISTRIBUTED WORKFORCES</h3>
              <p className="text-xs text-[#6F706D] leading-relaxed font-sans">
                Equip remote personnel with autonomous phishing and credential harvesting defenses without routing all traffic through slow VPN bottlenecks.
              </p>
              <div className="space-y-1 text-xs text-[#07090E]">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#07090E]" />
                  <span>Silent MDM rollout</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#07090E]" />
                  <span>SAML 2.0 / Okta directory sync</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </EditorialSection>

      {/* 5. CALL TO ACTION */}
      <EditorialSection mode="editorial-black" className="py-20 text-center border-t border-white/10 font-mono">
        <div className="max-w-2xl mx-auto space-y-6">
          <TechnicalLabel>ENTERPRISE ONBOARDING</TechnicalLabel>
          <EditorialHeading level={2}>
            SCHEDULE AN ARCHITECTURE PILOT.
          </EditorialHeading>
          <p className="text-sm text-[#A6A6A0] leading-relaxed font-sans">
            Deploy an isolated fleet sandbox or consult our security architects.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              onClick={() => setIsPilotModalOpen(true)}
              className="bg-[#39FF14] hover:bg-[#32E012] text-[#07090E] font-mono font-bold text-xs uppercase tracking-wider rounded-none px-8 h-12 shadow-[0_1px_3px_rgba(0,0,0,0.4),0_0_12px_rgba(0,229,117,0.2)] cursor-pointer"
            >
              <span>SCHEDULE PILOT BRIEFING</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white/20 bg-transparent hover:bg-white/5 text-[#F1F0EB] font-mono text-xs uppercase tracking-wider rounded-none h-12 px-6"
            >
              <Link href="/dashboard">
                OPEN SEC-OPS CONSOLE
              </Link>
            </Button>
          </div>
        </div>
      </EditorialSection>

      {/* Enterprise Pilot Modal */}
      <EnterprisePilotModal
        isOpen={isPilotModalOpen}
        onClose={() => setIsPilotModalOpen(false)}
        initialFleetSize={fleetSizer}
      />
    </PublicShell>
  )
}
