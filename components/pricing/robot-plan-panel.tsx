"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { RobotPlan, PlanId } from "./robot-plans-data"
import {
  PixelScoutGlyph,
  PixelGuardGlyph,
  PixelSentinelGlyph,
  PixelAegisGlyph,
  BarcodeGraphic,
  RegistrationMark,
} from "./robot-pixel-sprites"
import { Check, ArrowRight, ShieldCheck, Cpu, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface RobotPlanPanelProps {
  plan: RobotPlan
  isSelected: boolean
  onSelect: (id: PlanId) => void
  onOpenDossier?: (id: PlanId) => void
}

export function RobotPlanPanel({
  plan,
  isSelected,
  onSelect,
  onOpenDossier,
}: RobotPlanPanelProps) {
  const [isHovered, setIsHovered] = React.useState(false)

  const glyphMap = {
    scout: PixelScoutGlyph,
    guard: PixelGuardGlyph,
    sentinel: PixelSentinelGlyph,
    aegis: PixelAegisGlyph,
  }
  const GlyphComponent = glyphMap[plan.id]

  return (
    <div
      id={`plan-${plan.id}`}
      tabIndex={0}
      role="region"
      aria-label={`Plan ${plan.tierName} - Unit ${plan.robotName}`}
      aria-selected={isSelected}
      onClick={() => onSelect(plan.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onSelect(plan.id)
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative flex flex-col justify-between p-6 sm:p-7 md:p-8 font-mono transition-all duration-500 cursor-pointer outline-none select-none group border-t-2",
        plan.visualAttributes.bgStyle,
        isSelected
          ? "border-t-[#39FF14] bg-[#0A0A0A] shadow-[0_0_30px_rgba(57,255,20,0.08)] ring-1 ring-[#39FF14]/30"
          : "border-t-white/10 hover:border-t-white/40 hover:bg-[#070707]"
      )}
    >
      {/* Background Micro Grid Layer within Panel */}
      <div
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
        aria-hidden="true"
      />

      {/* Top Technical Header */}
      <div className="relative z-10 space-y-4">
        <div className="flex items-center justify-between text-xs border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-[#39FF14] font-bold">✛ AGEIS-X</span>
            <span className="text-white/20">/</span>
            <span className="text-[#A6A6A0] text-[10px] uppercase">UNIT {plan.index}</span>
          </div>
          <span className="text-[9px] text-[#A6A6A0] tracking-widest uppercase">
            {plan.systemCode}
          </span>
        </div>

        {/* Sub-header & Allocation */}
        <div className="flex items-center justify-between text-[9px] text-[#A6A6A0]">
          <span className="truncate max-w-[150px] uppercase font-mono">{plan.tagline}</span>
          <span className="shrink-0 font-bold text-[#F1F0EB]">{plan.devicesLabel}</span>
        </div>

        {/* Robot Portrait Visual Canvas with Oversized Typography Fragment */}
        <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] overflow-hidden bg-[#040404] border border-white/10 my-3">
          {/* Oversized Typography Backdrop (e.g. SCOUT, GUARD, SENTINEL, AEGIS) */}
          <div
            className={cn(
              "absolute inset-y-0 left-2 z-0 flex flex-col justify-center text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter uppercase text-white/[0.04] group-hover:text-white/[0.08] transition-colors duration-500 leading-none",
              isSelected && "text-[#39FF14]/[0.08]"
            )}
            aria-hidden="true"
          >
            {plan.visualAttributes.verticalTitleLetters.map((char, i) => (
              <span key={i} className="block">
                {char}
              </span>
            ))}
          </div>

          {/* Robot Photographic Art with subtle parallax transform */}
          <div
            className={cn(
              "relative w-full h-full transition-transform duration-700 ease-out",
              isHovered ? "scale-[1.03] translate-y-[-4px]" : "scale-100 translate-y-0"
            )}
          >
            <Image
              src={plan.images.robot}
              alt={`AgeIS-X ${plan.robotName} ${plan.role}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover object-top filter contrast-[1.05]"
            />
          </div>

          {/* Precision Crosshair Corner Accents */}
          <span className="absolute top-1 left-1 text-[8px] text-white/30" aria-hidden="true">+</span>
          <span className="absolute top-1 right-1 text-[8px] text-white/30" aria-hidden="true">+</span>
          <span className="absolute bottom-1 left-1 text-[8px] text-white/30" aria-hidden="true">+</span>
          <span className="absolute bottom-1 right-1 text-[8px] text-white/30" aria-hidden="true">+</span>

          {/* Live Sensor Blip Overlay */}
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2 py-0.5 bg-[#050505]/80 backdrop-blur-sm border border-white/10 text-[9px]">
            <span
              className={cn(
                "w-1.5 h-1.5 inline-block",
                isSelected || isHovered ? "bg-[#39FF14] animate-ping" : "bg-[#39FF14]"
              )}
            />
            <span className="text-[#F1F0EB] uppercase text-[8px] font-bold">
              {plan.actionVerb}
            </span>
          </div>

          {/* Unit Callout Ribbon at bottom of image */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent p-3 pt-6 z-10">
            <span className="text-[9px] text-[#39FF14] uppercase tracking-wider font-bold block">
              {plan.role}
            </span>
          </div>
        </div>

        {/* Plan Tier & Pricing Block */}
        <div className="space-y-3 pt-2">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[10px] text-[#A6A6A0] tracking-widest uppercase block">
                PLAN
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#F1F0EB] tracking-tight uppercase">
                {plan.tierName}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-2xl sm:text-3xl font-black text-[#39FF14] tracking-tight">
                {plan.priceFormatted}
              </span>
              <span className="text-[10px] text-[#A6A6A0] uppercase block">
                {plan.period}
              </span>
            </div>
          </div>

          {/* Device allocation & Monthly Equivalent */}
          <div className="flex items-center justify-between text-[10px] border-t border-b border-white/10 py-2 text-[#A6A6A0]">
            <span className="font-bold text-[#F1F0EB] tracking-wider">
              {plan.devicesLabel}
            </span>
            {plan.monthlyEquivalent && (
              <span className="text-[#6F706D] font-sans">
                {plan.monthlyEquivalent}
              </span>
            )}
          </div>
        </div>

        {/* Feature Capabilities Checklist */}
        <div className="space-y-2.5 pt-2 text-xs">
          <span className="text-[9px] text-[#6F706D] font-bold uppercase tracking-wider block">
            CORE CAPABILITIES:
          </span>
          <ul className="space-y-2">
            {plan.coreCapabilities.map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2 text-[#A6A6A0] text-[11px] leading-snug">
                <span className="text-[#39FF14] font-mono font-bold shrink-0 mt-0.5">
                  -
                </span>
                <span className="font-sans text-[#D4D4D0]">{feat.name}</span>
                {feat.status === "BETA" && (
                  <span className="text-[8px] font-mono px-1 py-0.2 bg-[#FFB800]/10 text-[#FFB800] border border-[#FFB800]/30 ml-auto shrink-0">
                    BETA
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Action Block with Unit Status & CTA */}
      <div className="relative z-10 pt-8 mt-6 border-t border-white/10 space-y-4">
        {/* Pixel Art Unit Online Badge */}
        <div className="flex items-center justify-between">
          <p className="text-[9px] text-[#6F706D] font-mono max-w-[130px] leading-tight uppercase">
            {plan.motto}
          </p>

          <div className="flex items-center gap-2">
            <GlyphComponent
              size={24}
              color={isSelected ? "#39FF14" : "#F1F0EB"}
            />
            <div className="text-right">
              <span className="text-[9px] text-[#F1F0EB] font-bold block uppercase tracking-wider">
                {plan.robotName}
              </span>
              <span className="inline-flex items-center gap-1 text-[8px] text-[#39FF14]">
                <span className="w-1 h-1 bg-[#39FF14] inline-block animate-pulse" />
                ONLINE
              </span>
            </div>
          </div>
        </div>

        {/* Barcode details */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <BarcodeGraphic code={`SX-AGEIS-${plan.index}`} />
          <RegistrationMark size={10} />
        </div>

        {/* Primary Commissioning CTA Button */}
        <div className="pt-2 space-y-2">
          <Button
            className={cn(
              "w-full font-mono text-xs uppercase tracking-wider h-11 rounded-none font-bold transition-all cursor-pointer",
              isSelected
                ? "bg-[#39FF14] hover:bg-[#32e012] text-[#050505] shadow-[0_0_15px_rgba(57,255,20,0.3)]"
                : "border border-white/20 bg-transparent hover:bg-white/10 text-[#F1F0EB]"
            )}
            asChild
          >
            <Link href={plan.cta.href}>
              <span>{plan.cta.label}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-2 shrink-0" />
            </Link>
          </Button>

          {/* Dossier inspection trigger */}
          {onOpenDossier && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onOpenDossier(plan.id)
              }}
              className="w-full text-center py-1 text-[9px] text-[#A6A6A0] hover:text-[#39FF14] uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1"
            >
              <Cpu className="w-3 h-3" />
              <span>INSPECT UNIT DOSSIER</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
