"use client"

import React from "react"
import Link from "next/link"
import { PublicShell } from "@/components/layout/public-shell"
import { Button } from "@/components/ui/button"
import {
  EditorialSection,
  EditorialHeading,
  EditorialRule,
  TechnicalLabel,
  SignalMarker,
  DataStrip,
} from "@/components/design-system/editorial-primitives"
import { SecuritySticker } from "@/components/design-system/pixel-art-system"
import { Building2, Server, Key, ArrowRight, Check } from "lucide-react"

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
  return (
    <PublicShell>
      {/* 1. HERO (MODE B - EDITORIAL BLACK) */}
      <EditorialSection mode="editorial-black" className="pt-10 pb-16 md:pt-16 md:pb-24">
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
              <span className="text-[#A6A6A0]">ZERO AGENT FRICTION.</span>
            </EditorialHeading>

            <p className="text-base sm:text-lg text-[#A6A6A0] max-w-2xl leading-relaxed font-sans font-normal">
              The same zero-overhead autonomous security engine that protects personal workstations, scaled for fleet visibility, SIEM integration, and centralized policy enforcement.
            </p>
          </div>
        </div>
      </EditorialSection>

      {/* 2. FLEET CAPABILITIES (MODE A - DARK LAB / CONTINUOUS ROWS) */}
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

      {/* 3. DEPLOYMENT MODELS (MODE C - OFF-WHITE PAPER TEXTURE) */}
      <EditorialSection mode="off-white-editorial" className="py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start font-mono">
          <div className="lg:col-span-4 space-y-3">
            <TechnicalLabel className="text-[#6F706D] font-bold">SECTOR TARGETING</TechnicalLabel>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#050505] tracking-tight leading-tight uppercase">
              DESIGNED FOR HIGH-RISK ENVIRONMENTS.
            </h2>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 border border-[#242424]/20 bg-[#F1F0EB] space-y-4">
              <h3 className="text-base font-bold text-[#050505] uppercase">ENGINEERING ORGANIZATIONS</h3>
              <p className="text-xs text-[#6F706D] leading-relaxed font-sans">
                Developers frequently compile raw code and hold high-value cloud credentials. AgeIS-X protects API keys and shell sessions without compiler throttling.
              </p>
              <div className="space-y-1 text-xs text-[#050505]">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#050505]" />
                  <span>0% slowdown on C++ / Rust builds</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#050505]" />
                  <span>Enclave-isolated SSH keys</span>
                </div>
              </div>
            </div>

            <div className="p-6 border border-[#242424]/20 bg-[#F1F0EB] space-y-4">
              <h3 className="text-base font-bold text-[#050505] uppercase">DISTRIBUTED WORKFORCES</h3>
              <p className="text-xs text-[#6F706D] leading-relaxed font-sans">
                Equip remote personnel with autonomous phishing and credential harvesting defenses without routing all traffic through slow VPN bottlenecks.
              </p>
              <div className="space-y-1 text-xs text-[#050505]">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#050505]" />
                  <span>Silent MDM rollout</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#050505]" />
                  <span>SAML 2.0 / Okta directory sync</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </EditorialSection>

      {/* 4. CALL TO ACTION */}
      <EditorialSection mode="editorial-black" className="py-20 text-center border-t border-white/10">
        <div className="max-w-2xl mx-auto space-y-6 font-mono">
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
              asChild
              className="bg-[#39FF14] hover:bg-[#32e012] text-[#050505] font-mono font-bold text-xs uppercase tracking-wider rounded-none px-8 h-12"
            >
              <Link href="/pricing">
                <span>VIEW ENTERPRISE TIERS</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
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
    </PublicShell>
  )
}
