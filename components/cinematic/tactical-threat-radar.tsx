"use client"

import * as React from "react"
import { Shield, AlertTriangle, AlertOctagon, CheckCircle2, Radio, Crosshair, Zap, Activity } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ThreatBlip {
  id: string
  name: string
  vector: string
  riskScore: number
  severity: "low" | "medium" | "critical"
  x: number // percentage 0-100
  y: number // percentage 0-100
  latLong: string
  technique: string
  status: "INTERCEPTED" | "QUARANTINED" | "DEFANGED"
}

const THREAT_BLIPS: ThreatBlip[] = [
  {
    id: "THREAT-01",
    name: "paypаl-verify.secure-update.xyz",
    vector: "Cyrillic Homoglyph Injection",
    riskScore: 98,
    severity: "critical",
    x: 68,
    y: 28,
    latLong: "185.220.101.9:443",
    technique: "T1566.002 // Spearphishing Link",
    status: "QUARANTINED",
  },
  {
    id: "THREAT-02",
    name: "Executive BEC Wire Scam",
    vector: "DMARC/SPF Header Spoofing",
    riskScore: 88,
    severity: "critical",
    x: 28,
    y: 72,
    latLong: "94.102.61.12:25",
    technique: "T1534 // Internal Spearphishing",
    status: "DEFANGED",
  },
  {
    id: "THREAT-03",
    name: "login.micros0ft-auth.cloud",
    vector: "Typosquat Token Harvester",
    riskScore: 74,
    severity: "medium",
    x: 82,
    y: 64,
    latLong: "45.154.255.80:8443",
    technique: "T1556 // Modify Auth Process",
    status: "INTERCEPTED",
  },
  {
    id: "THREAT-04",
    name: "Raw ELF Dropper via Tor Exit",
    vector: "Socket Ingress Bypass Attempt",
    riskScore: 95,
    severity: "critical",
    x: 22,
    y: 35,
    latLong: "192.42.116.16:8080",
    technique: "T1105 // Ingress Tool Transfer",
    status: "QUARANTINED",
  },
  {
    id: "THREAT-05",
    name: "Canvas Fingerprinting Probe",
    vector: "Anti-Profiling Canvas Micro-Noise",
    riskScore: 35,
    severity: "low",
    x: 42,
    y: 22,
    latLong: "Local Browser DOM",
    technique: "T1056.001 // Keylogging/Fingerprinting",
    status: "DEFANGED",
  },
]

export function TacticalThreatRadar({ className }: { className?: string }) {
  const [activeBlip, setActiveBlip] = React.useState<ThreatBlip>(THREAT_BLIPS[0])
  const [isScanning, setIsScanning] = React.useState(true)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = React.useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1
    setTilt({ x: -y * 6, y: x * 6 })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative rounded-none border border-white/15 bg-[#04060A] p-6 lg:p-8 font-mono select-none overflow-hidden shadow-2xl transition-transform duration-300 ease-out",
        className
      )}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x.toFixed(2)}deg) rotateY(${tilt.y.toFixed(2)}deg)`,
        willChange: "transform",
      }}
    >
      {/* Background Matrix Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(57, 255, 20, 0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(57, 255, 20, 0.12) 1px, transparent 1px)
          `,
          backgroundSize: "28px 28px",
        }}
        aria-hidden="true"
      />

      {/* Top Telemetry Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-[#39FF14] animate-ping opacity-75" />
            <span className="w-2 h-2 rounded-full bg-[#39FF14] absolute" />
          </div>
          <div>
            <span className="text-xs font-black uppercase text-[#F1F0EB] tracking-wider block">
              REAL-TIME ATTACK SURFACE RADAR
            </span>
            <span className="text-[10px] text-[#A6A6A0] tracking-widest uppercase">
              DEFCON 5 // MULTI-VECTOR INTERCEPTION GRID
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsScanning((prev) => !prev)}
            className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/15 text-[10px] text-[#39FF14] uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Activity className="w-3 h-3 text-[#39FF14]" />
            <span>{isScanning ? "SWEEP ACTIVE" : "RADAR PAUSED"}</span>
          </button>
          <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#39FF14]/10 border border-[#39FF14]/30 text-[10px] text-[#39FF14] uppercase font-bold">
            <Shield className="w-3 h-3" />
            <span>5/5 VECTORS GUARDED</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Radar Circular Display Canvas (7 cols on lg) */}
        <div className="lg:col-span-7 flex justify-center items-center py-4">
          <div className="relative w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] md:w-[440px] md:h-[440px] flex items-center justify-center">
            {/* Concentric Rings */}
            <div className="absolute inset-0 rounded-full border border-white/10" />
            <div className="absolute inset-8 sm:inset-12 rounded-full border border-white/10 border-dashed" />
            <div className="absolute inset-16 sm:inset-24 rounded-full border border-[#39FF14]/25" />
            <div className="absolute inset-24 sm:inset-36 rounded-full border border-white/10" />
            
            {/* Range distance markings */}
            <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] text-[#A6A6A0]/60">100ms PERIMETER</span>
            <span className="absolute top-10 sm:top-14 left-1/2 -translate-x-1/2 text-[9px] text-[#A6A6A0]/60">50ms</span>
            <span className="absolute top-20 sm:top-28 left-1/2 -translate-x-1/2 text-[9px] text-[#39FF14]/70">20ms ENCLAVE</span>

            {/* Crosshair Axes */}
            <div className="absolute inset-x-0 top-1/2 h-px bg-white/10" />
            <div className="absolute inset-y-0 left-1/2 w-px bg-white/10" />
            {/* 45-degree diagonal lines */}
            <div className="absolute w-full h-px top-1/2 left-0 bg-white/5 rotate-45" />
            <div className="absolute w-full h-px top-1/2 left-0 bg-white/5 -rotate-45" />

            {/* Center Core Node */}
            <div className="relative z-20 w-4 h-4 rounded-full bg-[#04060A] border-2 border-[#39FF14] flex items-center justify-center shadow-[0_0_15px_#39FF14]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14]" />
            </div>

            {/* 360-Degree Rotating Radar Sweep Beam */}
            {isScanning && (
              <div
                className="absolute inset-0 rounded-full pointer-events-none animate-spin"
                style={{
                  animationDuration: "5s",
                  background:
                    "conic-gradient(from 0deg, transparent 0deg, transparent 270deg, rgba(57, 255, 20, 0.05) 320deg, rgba(57, 255, 20, 0.40) 360deg)",
                }}
                aria-hidden="true"
              />
            )}

            {/* Threat Blips */}
            {THREAT_BLIPS.map((blip) => {
              const isSelected = activeBlip.id === blip.id
              const colorClass =
                blip.severity === "critical"
                  ? "bg-[#FF4545] text-[#FF4545]"
                  : blip.severity === "medium"
                  ? "bg-[#FFB800] text-[#FFB800]"
                  : "bg-[#39FF14] text-[#39FF14]"

              return (
                <button
                  key={blip.id}
                  type="button"
                  onClick={() => setActiveBlip(blip)}
                  style={{
                    left: `${blip.x}%`,
                    top: `${blip.y}%`,
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-30 group cursor-pointer p-2 focus:outline-none"
                  aria-label={`Inspect ${blip.name}`}
                >
                  <div className="relative flex items-center justify-center">
                    {/* Pulsing ring */}
                    <span
                      className={cn(
                        "w-5 h-5 rounded-full absolute opacity-75 animate-ping",
                        colorClass
                      )}
                    />
                    {/* Core node */}
                    <span
                      className={cn(
                        "w-2.5 h-2.5 rounded-full transition-transform duration-200",
                        colorClass,
                        isSelected ? "scale-150 ring-2 ring-white shadow-[0_0_15px_#39FF14]" : "group-hover:scale-125"
                      )}
                    />

                    {/* Miniature Target Tag */}
                    <span
                      className={cn(
                        "absolute top-4 left-1/2 -translate-x-1/2 px-1.5 py-0.5 text-[8px] whitespace-nowrap bg-[#04060A]/90 border font-mono tracking-wider transition-all duration-200",
                        isSelected
                          ? "border-[#39FF14] text-[#39FF14] opacity-100"
                          : "border-white/10 text-[#A6A6A0] opacity-0 group-hover:opacity-100"
                      )}
                    >
                      {blip.id}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Selected Threat Live Diagnostic Panel (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-4 bg-[#080D14] border border-white/15 p-5 sm:p-6 shadow-2xl relative">
          {/* Subtle Ambient Rim Light */}
          <div
            className="pointer-events-none absolute -top-12 -right-12 w-40 h-40 bg-[#39FF14]/[0.06] blur-[60px] rounded-full"
            aria-hidden="true"
          />

          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-[#39FF14]" />
              <span className="text-xs font-bold text-[#F1F0EB] tracking-wider uppercase">
                {activeBlip.id} // THREAT DOSSIER
              </span>
            </div>
            <span
              className={cn(
                "px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase border",
                activeBlip.severity === "critical"
                  ? "bg-[#FF4545]/10 text-[#FF4545] border-[#FF4545]/30"
                  : activeBlip.severity === "medium"
                  ? "bg-[#FFB800]/10 text-[#FFB800] border-[#FFB800]/30"
                  : "bg-[#39FF14]/10 text-[#39FF14] border-[#39FF14]/30"
              )}
            >
              {activeBlip.status}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-[#A6A6A0] uppercase tracking-wider block">TARGET SIGNATURE</span>
            <h4 className="text-sm sm:text-base font-bold text-[#F1F0EB] font-mono break-all text-[#39FF14]">
              {activeBlip.name}
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 text-[10px]">
            <div className="p-2.5 bg-[#04060A] border border-white/5 space-y-1">
              <span className="text-[#6F706D] block uppercase">ATTACK VECTOR</span>
              <span className="text-[#F1F0EB] font-bold block">{activeBlip.vector}</span>
            </div>
            <div className="p-2.5 bg-[#04060A] border border-white/5 space-y-1">
              <span className="text-[#6F706D] block uppercase">RISK SCORE</span>
              <span className="text-lg font-black text-[#FF4545] block font-mono">
                {activeBlip.riskScore}/100
              </span>
            </div>
          </div>

          <div className="p-2.5 bg-[#04060A] border border-white/5 space-y-1 text-[10px]">
            <span className="text-[#6F706D] block uppercase">MITRE ATT&amp;CK TECHNIQUE</span>
            <span className="text-[#39FF14] font-bold block">{activeBlip.technique}</span>
          </div>

          <div className="flex items-center justify-between text-[10px] text-[#A6A6A0] pt-2 border-t border-white/10">
            <span>ORIGIN: {activeBlip.latLong}</span>
            <span className="text-[#39FF14] flex items-center gap-1 font-bold">
              <CheckCircle2 className="w-3 h-3 text-[#39FF14]" />
              <span>ENCLAVE MITIGATED</span>
            </span>
          </div>

          {/* Quick Select Blip Bar */}
          <div className="pt-2 border-t border-white/5 flex flex-wrap gap-1.5 text-[9px]">
            <span className="text-[#6F706D] uppercase self-center mr-1">TARGETS:</span>
            {THREAT_BLIPS.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setActiveBlip(b)}
                className={cn(
                  "px-2 py-0.5 border font-mono transition-colors cursor-pointer",
                  activeBlip.id === b.id
                    ? "bg-[#39FF14] text-[#04060A] font-bold border-[#39FF14]"
                    : "bg-white/5 text-[#A6A6A0] border-white/10 hover:text-white"
                )}
              >
                {b.id}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
