"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Shield, Radio, Activity, Cpu, ArrowRight, Crosshair, Check, Zap, Eye } from "lucide-react"
import { MagneticButton } from "./magnetic-button"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface UnitHotspot {
  id: string
  name: string
  code: string
  tier: string
  role: string
  price: string
  x: number // percentage across width
  devices: string
  stats: {
    latency: string
    memory: string
    detectionRate: string
  }
}

const FLEET_UNITS: UnitHotspot[] = [
  {
    id: "scout",
    name: "SCOUT",
    code: "SX-01",
    tier: "FREE",
    role: "RECONNAISSANCE UNIT",
    price: "₹0 / year",
    x: 18,
    devices: "1 Device",
    stats: { latency: "< 18ms", memory: "18 MB", detectionRate: "99.4%" },
  },
  {
    id: "guard",
    name: "GUARD",
    code: "SX-02",
    tier: "CORE",
    role: "TACTICAL DEFENSE UNIT",
    price: "₹999 / year",
    x: 42,
    devices: "2 Devices",
    stats: { latency: "< 16ms", memory: "24 MB", detectionRate: "99.8%" },
  },
  {
    id: "sentinel",
    name: "SENTINEL",
    code: "SX-03",
    tier: "PRO",
    role: "ADVANCED THREAT INTELLIGENCE",
    price: "₹1,999 / year",
    x: 64,
    devices: "5 Devices",
    stats: { latency: "< 14ms", memory: "32 MB", detectionRate: "99.94%" },
  },
  {
    id: "aegis",
    name: "AEGIS",
    code: "SX-04",
    tier: "SENTINEL",
    role: "FLAGSHIP SOVEREIGN GUARDIAN",
    price: "₹3,499 / year",
    x: 85,
    devices: "10 Devices",
    stats: { latency: "< 12ms", memory: "38 MB", detectionRate: "99.99%" },
  },
]

export function PanoramicLineupTheater({ className }: { className?: string }) {
  const [selectedUnit, setSelectedUnit] = React.useState<UnitHotspot>(FLEET_UNITS[2])
  const [hoveredUnit, setHoveredUnit] = React.useState<UnitHotspot | null>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = React.useState({ x: 0, y: 0 })

  const active = hoveredUnit || selectedUnit

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1
    setTilt({ x: -y * 4, y: x * 4 })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
    setHoveredUnit(null)
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative rounded-none border border-white/15 bg-[#04060A] font-mono select-none overflow-hidden shadow-2xl transition-transform duration-300 ease-out",
        className
      )}
      style={{
        transform: `perspective(1200px) rotateX(${tilt.x.toFixed(2)}deg) rotateY(${tilt.y.toFixed(2)}deg)`,
        willChange: "transform",
      }}
    >
      {/* Laser Scan Horizon Beam */}
      <div
        className="pointer-events-none absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#39FF14] to-transparent opacity-60 animate-laser-sweep z-20"
        aria-hidden="true"
      />

      {/* Top Telemetry Header */}
      <div className="relative z-20 p-5 sm:p-6 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 bg-[#080D14]/90 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 bg-[#39FF14] inline-block animate-pulse" />
          <span className="text-xs font-black uppercase text-[#F1F0EB] tracking-wider font-mono">
            FLEET ARCHITECTURE // 4 ACTIVE AUTONOMOUS ARCHETYPES
          </span>
          <span className="text-white/20 hidden sm:inline">|</span>
          <span className="text-[10px] text-[#A6A6A0] hidden sm:inline uppercase">
            3D SPATIAL TELEMETRY THEATER
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-[10px] text-[#39FF14] font-bold border border-[#39FF14]/30 px-2 py-0.5 bg-[#39FF14]/10">
            EAL6+ VERIFIED FLEET
          </span>
          <Link
            href="/pricing"
            className="text-[10px] text-[#F1F0EB] hover:text-[#39FF14] flex items-center gap-1 transition-colors"
          >
            <span>Full Unit Dossiers</span>
            <ArrowRight className="w-3 h-3 text-[#39FF14]" />
          </Link>
        </div>
      </div>

      {/* Panoramic Artwork Stage Canvas */}
      <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] md:aspect-[32/11] bg-[#07090E] overflow-hidden group">
        {/* Background panoramic line-up image */}
        <Image
          src="/robots/lineup-hero.webp"
          alt="AgeIS-X Autonomous Fleet Lineup: Scout, Guard, Sentinel, Aegis"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 1500px"
          className="object-cover object-center filter contrast-[1.08] brightness-[0.95] transition-transform duration-700 ease-out group-hover:scale-[1.015]"
        />

        {/* Ambient atmospheric lighting overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#04060A] via-transparent to-[#04060A]/70 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#04060A]/85 via-transparent to-[#04060A]/85 pointer-events-none" />

        {/* Dynamic target reticle for the currently active unit */}
        <div
          className="pointer-events-none absolute bottom-12 transition-all duration-300 ease-out z-10 flex flex-col items-center"
          style={{
            left: `${active.x}%`,
            transform: "translateX(-50%)",
          }}
        >
          {/* Target Reticle Ring */}
          <div className="relative flex items-center justify-center">
            <span className="w-12 h-12 rounded-full border border-[#39FF14]/50 animate-ping opacity-60 absolute" />
            <div className="w-8 h-8 rounded-full border-2 border-[#39FF14] flex items-center justify-center bg-[#04060A]/60 backdrop-blur-sm shadow-[0_0_20px_#39FF14]">
              <Crosshair className="w-4 h-4 text-[#39FF14]" />
            </div>
          </div>

          {/* Floating Unit Mini Badge */}
          <div className="mt-2 px-2.5 py-1 bg-[#04060A]/95 border border-[#39FF14] text-center shadow-xl">
            <span className="text-[10px] font-black text-[#39FF14] block tracking-wider">
              {active.name} // {active.code}
            </span>
            <span className="text-[8px] text-[#A6A6A0] block uppercase">
              {active.role}
            </span>
          </div>
        </div>

        {/* Interactive Unit Click Hit-Areas Across the Stage */}
        <div className="absolute inset-0 z-20 flex">
          {FLEET_UNITS.map((unit) => {
            const isCurrent = active.id === unit.id
            return (
              <button
                key={unit.id}
                type="button"
                onClick={() => setSelectedUnit(unit)}
                onMouseEnter={() => setHoveredUnit(unit)}
                onMouseLeave={() => setHoveredUnit(null)}
                className="flex-1 h-full cursor-pointer relative group/zone focus:outline-none"
                aria-label={`Select unit ${unit.name}`}
              >
                {/* Zone vertical boundary guide */}
                <div className="absolute inset-y-0 right-0 w-px bg-white/5 group-hover/zone:bg-[#39FF14]/30 transition-colors" />

                {/* Floating bottom label */}
                <div
                  className={cn(
                    "absolute bottom-3 inset-x-2 text-center py-1 transition-all duration-200",
                    isCurrent
                      ? "bg-[#39FF14] text-[#04060A] font-bold shadow-[0_0_15px_#39FF14]"
                      : "bg-[#04060A]/80 text-[#A6A6A0] hover:text-[#F1F0EB] hover:bg-[#04060A]"
                  )}
                >
                  <span className="text-[10px] uppercase font-bold tracking-wider">
                    UNIT {unit.code} • {unit.name}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Selected Unit Telemetry Readout Deck */}
      <div className="relative z-20 p-5 sm:p-6 bg-[#080D14] border-t border-white/10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Unit Identity & Role */}
        <div className="md:col-span-5 space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#39FF14] font-black uppercase tracking-wider">
              {active.code} // {active.name}
            </span>
            <span className="text-white/20">/</span>
            <span className="text-[10px] text-[#A6A6A0] uppercase font-bold">
              PLAN {active.tier}
            </span>
          </div>

          <h4 className="text-lg sm:text-xl font-black text-[#F1F0EB] uppercase tracking-tight">
            {active.role}
          </h4>

          <div className="flex items-center gap-3 text-xs pt-1">
            <span className="text-xl font-black text-[#39FF14] font-mono">
              {active.price}
            </span>
            <span className="text-white/20">|</span>
            <span className="text-[#F1F0EB] font-bold">{active.devices}</span>
          </div>
        </div>

        {/* Center: Live Performance Benchmarks */}
        <div className="md:col-span-4 grid grid-cols-3 gap-2 border-y md:border-y-0 md:border-x border-white/10 py-3 md:py-0 md:px-4 text-center">
          <div className="space-y-0.5">
            <span className="text-[9px] text-[#A6A6A0] uppercase block">LATENCY</span>
            <span className="text-sm font-black text-[#F1F0EB] font-mono block">
              {active.stats.latency}
            </span>
          </div>
          <div className="space-y-0.5 border-x border-white/10">
            <span className="text-[9px] text-[#A6A6A0] uppercase block">RAM</span>
            <span className="text-sm font-black text-[#39FF14] font-mono block">
              {active.stats.memory}
            </span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[9px] text-[#A6A6A0] uppercase block">DETECTION</span>
            <span className="text-sm font-black text-[#F1F0EB] font-mono block">
              {active.stats.detectionRate}
            </span>
          </div>
        </div>

        {/* Right: Commissioning Action Button */}
        <div className="md:col-span-3 flex flex-col gap-2">
          <MagneticButton strength={4} className="w-full">
            <Button
              size="lg"
              className="w-full bg-[#39FF14] hover:bg-[#32E012] text-[#04060A] font-mono font-black text-xs uppercase tracking-wider rounded-none h-11 shadow-[0_0_20px_rgba(57,255,20,0.3)]"
              asChild
            >
              <Link href="/pricing">
                <span>COMMISSION {active.name}</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </Button>
          </MagneticButton>

          <Link
            href="/pricing"
            className="text-[9px] text-center text-[#A6A6A0] hover:text-[#39FF14] uppercase tracking-wider transition-colors"
          >
            Inspect Technical Sensor Dossier &rarr;
          </Link>
        </div>
      </div>
    </div>
  )
}
