"use client"

import * as React from "react"
import Image from "next/image"
import { AGEIS_ROBOT_PLANS, PlanId, RobotPlan } from "./robot-plans-data"
import {
  PixelScoutGlyph,
  PixelGuardGlyph,
  PixelSentinelGlyph,
  PixelAegisGlyph,
  BarcodeGraphic,
  RegistrationMark,
} from "./robot-pixel-sprites"
import { Cpu, Shield, Activity, Radio, Database, Terminal, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface RobotDossierProps {
  activePlanId: PlanId
  onSelectPlan: (id: PlanId) => void
}

export function RobotDossier({ activePlanId, onSelectPlan }: RobotDossierProps) {
  const [activeTab, setActiveTab] = React.useState<PlanId>(activePlanId)

  React.useEffect(() => {
    setActiveTab(activePlanId)
  }, [activePlanId])

  const plan = AGEIS_ROBOT_PLANS.find((p) => p.id === activeTab) || AGEIS_ROBOT_PLANS[0]

  const glyphMap = {
    scout: PixelScoutGlyph,
    guard: PixelGuardGlyph,
    sentinel: PixelSentinelGlyph,
    aegis: PixelAegisGlyph,
  }
  const ActiveGlyph = glyphMap[plan.id]

  return (
    <section className="relative w-full py-16 md:py-24 border-b border-white/10 font-mono">
      {/* Section Header */}
      <div className="space-y-4 mb-10">
        <div className="flex items-center gap-2 text-xs text-[#39FF14]">
          <span>04</span>
          <span className="text-white/20">/</span>
          <span className="text-[#A6A6A0] uppercase tracking-widest">
            UNIT ARCHIVE SPECIFICATIONS
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[#F1F0EB]">
              AGEIS-X / UNIT DATABASE
            </h2>
            <p className="text-xs sm:text-sm text-[#A6A6A0] font-sans mt-2 max-w-xl">
              Hardware specifications, sensor payload envelopes, and defense heuristic engines powering each security unit.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] text-[#39FF14] bg-[#39FF14]/10 border border-[#39FF14]/30 px-2 py-1 uppercase">
              SPECIFICATION // RELEASE 2026.4
            </span>
          </div>
        </div>
      </div>

      {/* 4 Unit Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/10 border border-white/15 mb-6">
        {AGEIS_ROBOT_PLANS.map((p) => {
          const isTabActive = p.id === activeTab
          const TabGlyph = glyphMap[p.id]
          return (
            <button
              key={p.id}
              onClick={() => {
                setActiveTab(p.id)
                onSelectPlan(p.id)
              }}
              className={cn(
                "p-3.5 sm:p-4 text-left transition-all flex items-center gap-3 cursor-pointer",
                isTabActive
                  ? "bg-[#0A0A0A] border-t-2 border-t-[#39FF14] text-[#39FF14]"
                  : "bg-[#050505] hover:bg-[#080808] text-[#A6A6A0]"
              )}
            >
              <TabGlyph size={20} color={isTabActive ? "#39FF14" : "#A6A6A0"} />
              <div>
                <span className="text-[9px] text-[#6F706D] block uppercase">
                  UNIT {p.index}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider block text-[#F1F0EB]">
                  {p.robotName}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Detailed Classified Dossier Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-white/15 border border-white/15">
        {/* Left Column: Robot Profile Image & Visual Specs */}
        <div className="lg:col-span-5 bg-[#050505] p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Top Badge */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#39FF14] inline-block" />
                <span className="font-bold text-[#F1F0EB] uppercase">
                  {plan.robotName}
                </span>
              </div>
              <span className="text-[10px] text-[#A6A6A0] uppercase font-mono">
                {plan.devicesLabel}
              </span>
            </div>

            {/* High Resolution Robot Visual with Annotation Grid */}
            <div className="relative w-full aspect-[4/5] bg-[#080808] border border-white/10 overflow-hidden group">
              <Image
                src={plan.images.robot}
                alt={plan.robotName}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center filter contrast-[1.08] transition-transform duration-700 group-hover:scale-105"
              />

              {/* Technical HUD Grid Overlay */}
              <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />

              <div className="absolute top-3 left-3 bg-[#050505]/90 border border-white/10 px-2 py-1 text-[9px] text-[#39FF14]">
                <span>ARCHETYPE // {plan.systemCode}</span>
              </div>

              <div className="absolute bottom-3 right-3 bg-[#050505]/90 border border-white/10 px-2 py-1 text-[9px] text-[#F1F0EB]">
                <span>LATENCY: {plan.dossier.telemetryRate}</span>
              </div>
            </div>

            {/* Sub-text quote */}
            <p className="text-xs text-[#A6A6A0] font-sans italic border-l-2 border-[#39FF14] pl-3 py-1">
              &ldquo;{plan.tagline}&rdquo; — {plan.motto}
            </p>
          </div>

          <div className="flex items-center justify-between border-t border-white/10 pt-4">
            <BarcodeGraphic code={`DOSSIER-${plan.id.toUpperCase()}-9902`} />
            <span className="text-[9px] text-[#39FF14] uppercase font-bold">
              STATUS: {plan.status}
            </span>
          </div>
        </div>

        {/* Right Column: Deep-Dive Technical Specifications Grid */}
        <div className="lg:col-span-7 bg-[#070707] p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="border-b border-white/10 pb-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#39FF14] uppercase tracking-wider font-bold">
                  SPECIFICATION DOSSIER // UNIT {plan.index}
                </span>
                <span className="text-xs font-mono font-bold text-[#F1F0EB]">
                  {plan.priceFormatted} {plan.period}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#F1F0EB] mt-1">
                {plan.robotName} // {plan.role}
              </h3>
            </div>

            {/* Spec Matrix List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Spec Item: Chassis */}
              <div className="p-3.5 bg-[#050505] border border-white/10 space-y-1.5">
                <div className="flex items-center gap-2 text-[#39FF14] text-[10px] uppercase font-bold">
                  <Shield className="w-3.5 h-3.5" />
                  <span>CHASSIS & ARMOR</span>
                </div>
                <p className="text-[11px] text-[#D4D4D0] font-sans leading-relaxed">
                  {plan.dossier.chassis}
                </p>
              </div>

              {/* Spec Item: Optics */}
              <div className="p-3.5 bg-[#050505] border border-white/10 space-y-1.5">
                <div className="flex items-center gap-2 text-[#39FF14] text-[10px] uppercase font-bold">
                  <Radio className="w-3.5 h-3.5" />
                  <span>OPTICS & SENSORS</span>
                </div>
                <p className="text-[11px] text-[#D4D4D0] font-sans leading-relaxed">
                  {plan.dossier.opticsSensor}
                </p>
              </div>

              {/* Spec Item: Defense Core */}
              <div className="p-3.5 bg-[#050505] border border-white/10 space-y-1.5">
                <div className="flex items-center gap-2 text-[#39FF14] text-[10px] uppercase font-bold">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>DEFENSE ENGINE</span>
                </div>
                <p className="text-[11px] text-[#D4D4D0] font-sans leading-relaxed">
                  {plan.dossier.defenseEngine}
                </p>
              </div>

              {/* Spec Item: Deployment Target */}
              <div className="p-3.5 bg-[#050505] border border-white/10 space-y-1.5">
                <div className="flex items-center gap-2 text-[#39FF14] text-[10px] uppercase font-bold">
                  <Database className="w-3.5 h-3.5" />
                  <span>DEVICE ALLOCATION</span>
                </div>
                <p className="text-[11px] text-[#D4D4D0] font-sans leading-relaxed">
                  {plan.dossier.deploymentTarget} ({plan.devicesLabel})
                </p>
              </div>
            </div>

            {/* Operational Protocol Callout */}
            <div className="p-4 bg-[#0A0A0A] border-l-2 border-[#39FF14] border-t border-r border-b border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-[10px] text-[#39FF14] uppercase font-bold">
                <Activity className="w-3.5 h-3.5" />
                <span>OPERATIONAL PROTOCOL</span>
              </div>
              <p className="text-xs text-[#A6A6A0] font-sans leading-relaxed">
                {plan.dossier.operationalProtocol}
              </p>
            </div>
          </div>

          {/* Direct CTA commission */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[10px] text-[#6F706D] block uppercase">
                COMMISSIONING FEE
              </span>
              <span className="text-lg font-black text-[#F1F0EB]">
                {plan.priceFormatted}{" "}
                <span className="text-xs font-normal text-[#A6A6A0]">
                  {plan.period}
                </span>
              </span>
            </div>

            <Button
              className="w-full sm:w-auto font-mono text-xs uppercase tracking-wider h-11 px-8 rounded-none font-bold bg-[#39FF14] hover:bg-[#32e012] text-[#050505] shadow-[0_0_15px_rgba(57,255,20,0.2)]"
              asChild
            >
              <a href={plan.cta.href}>
                <span>COMMISSION {plan.robotName} UNIT</span>
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
