"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export function RobotBackgroundDossier({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "relative w-full min-h-screen bg-[#050505] text-[#F1F0EB] overflow-hidden selection:bg-[#39FF14] selection:text-[#050505]",
        className
      )}
    >
      {/* 1. Fine Technical Grid (32px x 32px razor grid) */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
        }}
        aria-hidden="true"
      />

      {/* 2. Micro Coordinate Grid Lines & Sub-divisions */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: "160px 160px",
        }}
        aria-hidden="true"
      />

      {/* 3. Very faint green atmospheric light at strategic coordinates */}
      <div
        className="pointer-events-none absolute -top-40 left-1/4 w-[600px] h-[500px] bg-[#39FF14]/[0.03] blur-[140px] rounded-full"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/3 -right-32 w-[500px] h-[500px] bg-[#00E5FF]/[0.02] blur-[160px] rounded-full"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-1/4 -left-20 w-[600px] h-[600px] bg-[#39FF14]/[0.025] blur-[150px] rounded-full"
        aria-hidden="true"
      />

      {/* 4. Technical Watermark / Classified Typography Fragments */}
      <div
        className="pointer-events-none absolute top-32 left-6 text-[110px] font-black font-mono tracking-tighter text-white/[0.015] select-none uppercase leading-none"
        aria-hidden="true"
      >
        AGEIS-X // 04-UNITS
      </div>
      <div
        className="pointer-events-none absolute top-[45%] right-4 text-[130px] font-black font-mono tracking-tighter text-white/[0.012] select-none uppercase leading-none rotate-90 origin-top-right"
        aria-hidden="true"
      >
        CLASSIFIED
      </div>

      {/* 5. Architectural Alignment Lines & Coordinate Markers */}
      <div className="pointer-events-none absolute top-0 left-8 bottom-0 w-px bg-white/[0.04] hidden lg:block" aria-hidden="true" />
      <div className="pointer-events-none absolute top-0 right-8 bottom-0 w-px bg-white/[0.04] hidden lg:block" aria-hidden="true" />

      {/* 6. Technical Registration Marks */}
      <div className="pointer-events-none absolute top-4 left-4 font-mono text-xs text-white/20 select-none hidden sm:block" aria-hidden="true">
        + SEC_DIV_01 // 51.5074° N
      </div>
      <div className="pointer-events-none absolute top-4 right-4 font-mono text-xs text-white/20 select-none hidden sm:block" aria-hidden="true">
        SPEC_VER_4.9 // RECON_ACTIVE +
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 w-full">{children}</div>
    </div>
  )
}
