"use client"

import * as React from "react"
import Image from "next/image"
import { AGEIS_ROBOT_PLANS, PlanId } from "./robot-plans-data"
import { PixelScoutGlyph, PixelGuardGlyph, PixelSentinelGlyph, PixelAegisGlyph, BarcodeGraphic, RegistrationMark } from "./robot-pixel-sprites"
import { MaskedHeading } from "@/components/cinematic/typography-choreography"
import { cn } from "@/lib/utils"

export interface RobotHeroProps {
  selectedPlan: PlanId
  onSelectPlan: (id: PlanId) => void
}

export function RobotHero({ selectedPlan, onSelectPlan }: RobotHeroProps) {
  return (
    <section className="relative w-full pt-10 pb-16 md:pt-16 md:pb-20 border-b border-white/10 font-mono">
      {/* Top Technical Metadata Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 mb-10 text-xs">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 bg-[#39FF14] inline-block animate-pulse" />
          <span className="font-bold text-[#F1F0EB] tracking-wider uppercase">
            AGEIS-X SECURITY SYSTEMS
          </span>
          <span className="text-white/20">//</span>
          <span className="text-[#A6A6A0]">SELECT YOUR SECURITY UNIT</span>
        </div>
        <div className="flex items-center gap-4 text-[#A6A6A0]">
          <span className="hidden sm:inline-block">CATALOG SPEC: 2026.4</span>
          <span className="hidden sm:inline-block text-white/20">|</span>
          <span className="text-[#39FF14]">ANNUAL EDITIONS</span>
          <RegistrationMark />
        </div>
      </div>

      {/* Main Editorial Headline */}
      <div className="space-y-6 max-w-5xl mb-12">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-white/5 border border-white/10 text-[10px] text-[#A6A6A0] tracking-widest uppercase">
          <span className="text-[#39FF14] font-bold">04 ROLES</span>
          <span>/</span>
          <span>AUTONOMOUS CYBERSECURITY FLEET</span>
        </div>

        <MaskedHeading
          level={1}
          lines={["YOUR DIGITAL LIFE", "NEEDS A GUARDIAN."]}
          accentLineIndex={1}
          accentClassName="text-[#A6A6A0]"
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter text-[#F1F0EB] leading-[0.88]"
        />

        <p className="text-sm sm:text-base md:text-lg text-[#A6A6A0] max-w-2xl font-sans font-normal leading-relaxed">
          You are not simply purchasing a software subscription. You are commissioning an AgeIS-X security unit engineered to guard your endpoints, identity, and network surface.
        </p>
      </div>

      {/* Panoramic Robot Lineup Banner with Interactive Unit Selectors */}
      <div className="relative border border-white/15 bg-[#080808] overflow-hidden group shadow-2xl">
        {/* Banner image with priority loading */}
        <div className="relative w-full aspect-[21/9] sm:aspect-[24/9] md:aspect-[32/10] bg-[#050505]">
          <Image
            src="/robots/lineup-hero.webp"
            alt="AgeIS-X Security Units: Scout, Guard, Sentinel, and Aegis in art-directed lineup"
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1240px"
            className="object-cover object-center opacity-90 transition-transform duration-700 ease-out group-hover:scale-[1.01]"
          />
          {/* Subtle vignette gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/60 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/80 via-transparent to-[#050505]/80 pointer-events-none" />
        </div>

        {/* Floating Technical Overlay */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex items-center gap-2 bg-[#050505]/85 backdrop-blur-md px-3 py-1.5 border border-white/10 text-[10px] text-[#F1F0EB]">
          <span className="w-1.5 h-1.5 bg-[#39FF14] inline-block animate-pulse" />
          <span className="font-bold">UNIT ARCHIVE // 2026-X</span>
          <span className="text-[#A6A6A0]">| 4 ACTIVE ARCHETYPES</span>
        </div>

        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 hidden sm:block">
          <BarcodeGraphic code="AGEIS-X-FLEET-ROBOTIC" className="bg-[#050505]/80 p-1.5 border border-white/10" />
        </div>

        {/* 4 Unit Quick Switcher bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/10 border-t border-white/10 bg-[#050505]/95 backdrop-blur-md">
          {AGEIS_ROBOT_PLANS.map((plan) => {
            const isSelected = plan.id === selectedPlan
            return (
              <button
                key={plan.id}
                onClick={() => {
                  onSelectPlan(plan.id)
                  const el = document.getElementById(`plan-${plan.id}`)
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "center" })
                  }
                }}
                className={cn(
                  "p-3 sm:p-4 text-left transition-all duration-200 flex items-center justify-between group/btn cursor-pointer relative",
                  isSelected
                    ? "bg-[#39FF14]/10 border-b-2 md:border-b-0 md:border-t-2 md:border-t-[#39FF14]"
                    : "hover:bg-white/5"
                )}
                aria-pressed={isSelected}
                aria-label={`Select unit ${plan.robotName}`}
              >
                <div className="flex items-center gap-3">
                  <div className="shrink-0 transition-transform duration-200 group-hover/btn:scale-110">
                    {plan.id === "scout" && (
                      <PixelScoutGlyph size={22} color={isSelected ? "#39FF14" : "#A6A6A0"} />
                    )}
                    {plan.id === "guard" && (
                      <PixelGuardGlyph size={22} color={isSelected ? "#39FF14" : "#A6A6A0"} />
                    )}
                    {plan.id === "sentinel" && (
                      <PixelSentinelGlyph size={22} color={isSelected ? "#39FF14" : "#A6A6A0"} />
                    )}
                    {plan.id === "aegis" && (
                      <PixelAegisGlyph size={22} color={isSelected ? "#39FF14" : "#A6A6A0"} />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-[#A6A6A0]">{plan.index}</span>
                      <span
                        className={cn(
                          "text-xs sm:text-sm font-bold tracking-tight uppercase transition-colors",
                          isSelected ? "text-[#39FF14]" : "text-[#F1F0EB]"
                        )}
                      >
                        {plan.robotName}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#A6A6A0] block truncate">
                      {plan.priceFormatted} {plan.period}
                    </span>
                  </div>
                </div>

                <span
                  className={cn(
                    "text-[10px] uppercase font-bold shrink-0 hidden lg:block transition-colors",
                    isSelected ? "text-[#39FF14]" : "text-white/30 group-hover/btn:text-white/70"
                  )}
                >
                  {plan.actionVerb}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Section Transition Hook */}
      <div className="mt-14 sm:mt-20 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#39FF14] mb-2">
            <span>01</span>
            <span className="text-white/20">/</span>
            <span className="text-[#A6A6A0] uppercase tracking-widest">COMMISSIONING STAGE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[#F1F0EB]">
            CHOOSE YOUR
            <br />
            SECURITY UNIT
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-[#A6A6A0] max-w-md font-sans leading-relaxed">
          One security brain. One place to protect your digital life. Select a unit below to commission immediate defense across your devices.
        </p>
      </div>
    </section>
  )
}
