"use client"

import React from "react"

export type AtmosphereVariant = "cinematic" | "dashboard" | "demolab" | "auth" | "minimal"

interface TacticalAtmosphereProps {
  variant?: AtmosphereVariant
  className?: string
}

export function TacticalAtmosphere({
  variant = "cinematic",
  className = "",
}: TacticalAtmosphereProps) {
  const isDashboard = variant === "dashboard"
  const isDemoLab = variant === "demolab"
  const isAuth = variant === "auth"
  const isCinematic = variant === "cinematic"

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden select-none ${className}`}
      aria-hidden="true"
    >
      {/* ======================================================================
          LAYER 1: DEEP OBSIDIAN FOUNDATION & TONAL ELEVATION
          ====================================================================== */}
      <div
        className="absolute inset-0 bg-[#04060A]"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 90% 60% at 50% -10%, #070C16 0%, transparent 80%),
            radial-gradient(ellipse 70% 50% at 50% 110%, #020306 0%, transparent 80%)
          `,
        }}
      />

      {/* ======================================================================
          LAYER 2: ATMOSPHERIC VOLUMETRIC ILLUMINATION (DIFFUSED & RESTYLED)
          ====================================================================== */}
      {isCinematic && (
        <>
          {/* Primary Emerald Signal Glow (Hero focal area) */}
          <div
            className="absolute -top-[10%] right-[10%] w-[680px] h-[680px] rounded-full animate-ambient-drift"
            style={{
              background: "radial-gradient(circle, rgba(57, 255, 20, 0.04) 0%, rgba(57, 255, 20, 0.01) 45%, transparent 70%)",
            }}
          />
          {/* Secondary Sapphire / Cyan Vector Glow (Left periphery) */}
          <div
            className="absolute top-[28%] -left-[8%] w-[540px] h-[540px] rounded-full animate-ambient-drift"
            style={{
              background: "radial-gradient(circle, rgba(0, 229, 255, 0.025) 0%, rgba(0, 229, 255, 0.008) 45%, transparent 70%)",
              animationDelay: "-8s",
            }}
          />
          {/* Ambient Core Mid-Depth Glow */}
          <div
            className="absolute bottom-[10%] right-[25%] w-[480px] h-[480px] rounded-full animate-ambient-drift"
            style={{
              background: "radial-gradient(circle, rgba(57, 255, 20, 0.02) 0%, transparent 65%)",
              animationDelay: "-14s",
            }}
          />
        </>
      )}

      {isDashboard && (
        <>
          {/* Restrained Status Bar Illumination */}
          <div
            className="absolute -top-[15%] left-1/2 -translate-x-1/2 w-[900px] h-[450px] rounded-full"
            style={{
              background: "radial-gradient(ellipse at center, rgba(57, 255, 20, 0.028) 0%, transparent 70%)",
            }}
          />
          {/* Very Faint Lateral Cyan Telemetry Glow */}
          <div
            className="absolute top-[40%] -right-[10%] w-[420px] h-[420px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(0, 229, 255, 0.018) 0%, transparent 65%)",
            }}
          />
        </>
      )}

      {isDemoLab && (
        <>
          {/* Security Terminal Dual Glow */}
          <div
            className="absolute -top-[8%] left-[20%] w-[550px] h-[550px] rounded-full animate-ambient-drift"
            style={{
              background: "radial-gradient(circle, rgba(0, 229, 255, 0.03) 0%, transparent 65%)",
            }}
          />
          <div
            className="absolute top-[15%] right-[15%] w-[550px] h-[550px] rounded-full animate-ambient-drift"
            style={{
              background: "radial-gradient(circle, rgba(57, 255, 20, 0.035) 0%, transparent 65%)",
              animationDelay: "-10s",
            }}
          />
        </>
      )}

      {isAuth && (
        <>
          {/* Secure Enclave Center Spotlight */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(57, 255, 20, 0.035) 0%, rgba(0, 229, 255, 0.015) 40%, transparent 70%)",
            }}
          />
        </>
      )}

      {/* ======================================================================
          LAYER 3: HIGH-PRECISION TECHNICAL VECTOR GEOMETRY & GRID
          ====================================================================== */}
      <svg
        className="absolute inset-0 w-full h-full opacity-60"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          {/* Micro 48px × 48px Tactical Cell */}
          <pattern
            id="tactical-grid-pattern"
            width="48"
            height="48"
            patternUnits="userSpaceOnUse"
          >
            {/* Fine Hairline Grid */}
            <path
              d="M 48 0 L 0 0 0 48"
              fill="none"
              stroke="rgba(255, 255, 255, 0.022)"
              strokeWidth="0.8"
            />
          </pattern>

          {/* Major 192px × 192px Sector Grid with Corner Intersections */}
          <pattern
            id="tactical-sector-pattern"
            width="192"
            height="192"
            patternUnits="userSpaceOnUse"
          >
            {/* Sector Border */}
            <path
              d="M 192 0 L 0 0 0 192"
              fill="none"
              stroke="rgba(255, 255, 255, 0.04)"
              strokeWidth="1"
            />
            {/* Center Crosshair Intersection + */}
            <path
              d="M 96 90 L 96 102 M 90 96 L 102 96"
              fill="none"
              stroke="rgba(57, 255, 20, 0.18)"
              strokeWidth="1"
            />
            {/* Sector Origin Corner Crosshair + */}
            <path
              d="M 0 5 L 0 -5 M -5 0 L 5 0"
              fill="none"
              stroke="rgba(57, 255, 20, 0.22)"
              strokeWidth="1"
            />
            {/* Subtle Coordinate Watermark */}
            <text
              x="6"
              y="16"
              fill="rgba(255, 255, 255, 0.08)"
              fontSize="7"
              fontFamily="monospace"
              letterSpacing="0.08em"
            >
              +SEC
            </text>
          </pattern>
        </defs>

        {/* 48px Base Grid Layer */}
        <rect width="100%" height="100%" fill="url(#tactical-grid-pattern)" />
        {/* 192px Sector Overlay */}
        <rect width="100%" height="100%" fill="url(#tactical-sector-pattern)" />

        {/* Sparse Network Constellation Nodes (Cinematic & DemoLab only) */}
        {(isCinematic || isDemoLab) && (
          <g className="transition-opacity duration-1000">
            {/* Node Alpha (Top Right Periphery) */}
            <circle cx="84%" cy="16%" r="2" fill="#39FF14" fillOpacity="0.45" />
            <circle
              cx="84%"
              cy="16%"
              r="7"
              fill="none"
              stroke="#39FF14"
              strokeWidth="0.75"
              strokeOpacity="0.25"
              className="animate-beacon-pulse"
            />
            <line
              x1="84%"
              y1="16%"
              x2="92%"
              y2="28%"
              stroke="rgba(57, 255, 20, 0.14)"
              strokeWidth="0.75"
              strokeDasharray="3 4"
            />
            <circle cx="92%" cy="28%" r="1.5" fill="#00E5FF" fillOpacity="0.4" />

            {/* Node Beta (Left Mid Periphery) */}
            <circle cx="9%" cy="44%" r="2" fill="#00E5FF" fillOpacity="0.35" />
            <line
              x1="9%"
              y1="44%"
              x2="15%"
              y2="56%"
              stroke="rgba(0, 229, 255, 0.12)"
              strokeWidth="0.75"
              strokeDasharray="4 5"
            />
            <circle cx="15%" cy="56%" r="1.5" fill="#39FF14" fillOpacity="0.3" />

            {/* Node Gamma (Bottom Right) */}
            <circle cx="89%" cy="78%" r="2" fill="#39FF14" fillOpacity="0.35" />
            <line
              x1="89%"
              y1="78%"
              x2="78%"
              y2="88%"
              stroke="rgba(57, 255, 20, 0.10)"
              strokeWidth="0.75"
              strokeDasharray="3 4"
            />
            <circle cx="78%" cy="88%" r="1.5" fill="#39FF14" fillOpacity="0.3" />
          </g>
        )}
      </svg>

      {/* ======================================================================
          LAYER 4: AMBIENT RADAR SCANNING SWEEP (LOW AMPLITUDE & TIMED)
          ====================================================================== */}
      <div
        className="absolute inset-x-0 h-[1.5px] pointer-events-none animate-tactical-sweep"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(57, 255, 20, 0.04) 20%, rgba(57, 255, 20, 0.22) 50%, rgba(0, 229, 255, 0.18) 75%, transparent 100%)",
          boxShadow: "0 0 16px rgba(57, 255, 20, 0.12)",
        }}
      />

      {/* ======================================================================
          LAYER 5: TACTICAL PERIMETER HUD ANCHORS & COORDINATE MARKS (DESKTOP)
          ====================================================================== */}
      <div className="hidden md:block absolute inset-0 pointer-events-none p-4 lg:p-6 font-mono text-[9px] text-white/20 select-none">
        {/* Top-Left Corner Anchor */}
        <div className="absolute top-4 left-4 lg:top-6 lg:left-6 flex flex-col gap-0.5 border-l border-t border-white/10 pl-2 pt-1.5">
          <div className="flex items-center gap-1.5 text-white/35 font-semibold tracking-wider">
            <span>⌜ AGEIS-X // SEC.CORE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14] animate-pulse" />
          </div>
          <span className="text-[8px] text-white/20 tracking-widest">LAT 37.7749° N // ZERO-TRUST</span>
        </div>

        {/* Top-Right Corner Anchor */}
        <div className="absolute top-4 right-4 lg:top-6 lg:right-6 flex flex-col items-end gap-0.5 border-r border-t border-white/10 pr-2 pt-1.5">
          <div className="flex items-center gap-1.5 text-white/35 font-semibold tracking-wider">
            <span>DEFCON 5 // ENCLAVE</span>
            <span>⌝</span>
          </div>
          <span className="text-[8px] text-white/20 tracking-widest">LON 122.4194° W // ACTIVE</span>
        </div>

        {/* Bottom-Left Corner Anchor */}
        <div className="absolute bottom-4 left-4 lg:bottom-6 lg:left-6 flex flex-col gap-0.5 border-l border-b border-white/10 pl-2 pb-1.5">
          <span className="text-[8px] text-white/20 tracking-widest">KERNEL: DUAL-ENCLAVE V2.0</span>
          <div className="text-white/30 font-semibold tracking-wider">
            <span>⌞ TLS 1.3 // AES-256-GCM</span>
          </div>
        </div>

        {/* Bottom-Right Corner Anchor */}
        <div className="absolute bottom-4 right-4 lg:bottom-6 lg:right-6 flex flex-col items-end gap-0.5 border-r border-b border-white/10 pr-2 pb-1.5">
          <span className="text-[8px] text-white/20 tracking-widest">40,000 N-GRAM TF-IDF</span>
          <div className="text-white/30 font-semibold tracking-wider">
            <span>SIG.HEURISTIC // MULTI-SIGNAL ⌟</span>
          </div>
        </div>
      </div>

      {/* ======================================================================
          LAYER 6: SURFACE DEPTH & PERIMETER VIGNETTE
          ====================================================================== */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 95% 85% at 50% 50%, transparent 55%, rgba(4, 6, 10, 0.78) 100%)",
        }}
      />
    </div>
  )
}
