import * as React from "react"
import { Shield, ShieldCheck, Lock, Activity, Radio, Cpu, Key } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SecurityStatusProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  signalColor?: string
  title?: string
  subtitle?: string
  label?: string
  sublabel?: string
}

/**
 * Institutional Tactical Radar & Enclave Status.
 * Replaces gimmicky pixel stickers with a precision concentric sweep radar
 * displaying cryptographic perimeter integrity.
 */
export function TacticalRadarState({
  className,
  title,
  subtitle,
  label,
  sublabel,
  ...props
}: SecurityStatusProps) {
  const displayTitle = label || title || "PERIMETER SECURE // ZERO INCIDENTS"
  const displaySubtitle =
    sublabel ||
    subtitle ||
    "All monitored threat ingress surfaces are quiet. Deterministic inference engine active."

  return (
    <div
      className={cn(
        "py-10 px-4 flex flex-col items-center justify-center text-center select-none space-y-4",
        className
      )}
      {...props}
    >
      {/* Precision Concentric Vector Sweep Radar */}
      <div className="relative w-28 h-28 flex items-center justify-center">
        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border border-white/10 animate-pulse" />
        {/* Mid Ring with tick marks */}
        <div className="absolute inset-3 rounded-full border border-white/15" />
        {/* Core Ring */}
        <div className="absolute inset-7 rounded-full border border-[var(--primary)]/30" />
        
        {/* Axis Crosshairs */}
        <div className="absolute inset-x-0 top-1/2 h-px bg-white/10" />
        <div className="absolute inset-y-0 left-1/2 w-px bg-white/10" />

        {/* Center Node Pulse */}
        <div className="relative z-10 w-3 h-3 rounded-full bg-[var(--primary)] shadow-[0_0_12px_var(--primary)]" />

        {/* Subtle Conic Radar Sweep */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none opacity-40 animate-spin"
          style={{
            animationDuration: "6s",
            background:
              "conic-gradient(from 0deg, transparent 0deg, transparent 270deg, rgba(0, 229, 117, 0.25) 360deg)",
          }}
          aria-hidden="true"
        />
      </div>

      {/* Narrative Telemetry Label */}
      <div className="space-y-1.5 max-w-md">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-white/[0.04] border border-white/10 text-[10px] font-mono text-[var(--primary)] uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse" />
          <span>{displayTitle}</span>
        </div>
        {displaySubtitle && (
          <p className="text-xs text-[#A6A6A0] leading-relaxed font-sans max-w-sm mx-auto">
            {displaySubtitle}
          </p>
        )}
      </div>
    </div>
  )
}

/** Backward compatible alias for previously imported pixel sleeping cat */
export const PixelSleepingCatState = TacticalRadarState

export type AttestationType =
  | "access_granted"
  | "trust_no_one"
  | "encryption_freedom"
  | "stay_curious"
  | "lock_it_up"

/**
 * Institutional Attestation & Security Enclave Badges.
 * Replaces meme stickers with authoritative, mathematically grounded trust markers.
 */
export function SecuritySticker({
  type = "access_granted",
  size = "md",
  className,
}: {
  type: AttestationType
  size?: "sm" | "md" | "lg"
  className?: string
}) {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-[9px] gap-1.5",
    md: "px-2.5 py-1 text-[10px] gap-2",
    lg: "px-3 py-1.5 text-xs font-semibold gap-2.5",
  }

  switch (type) {
    case "access_granted":
      return (
        <div
          className={cn(
            "inline-flex items-center bg-[#07090E] border border-[var(--primary)]/30 text-[var(--primary)] font-mono tracking-wider uppercase select-none transition-colors hover:border-[var(--primary)]/60",
            sizeClasses[size],
            className
          )}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse" />
          <span>EAL6+ ATTESTED // VERIFIED</span>
        </div>
      )
    case "trust_no_one":
      return (
        <div
          className={cn(
            "inline-flex items-center bg-[#07090E] border border-white/15 text-[#F1F0EB] font-mono tracking-wider uppercase select-none hover:border-white/30",
            sizeClasses[size],
            className
          )}
        >
          <Shield className="w-3 h-3 text-[#00E5FF]" />
          <span>ZERO-TRUST // RFC 8446</span>
        </div>
      )
    case "encryption_freedom":
      return (
        <div
          className={cn(
            "inline-flex items-center bg-[#07090E] border border-white/15 text-[#A6A6A0] font-mono tracking-wider uppercase select-none hover:border-[var(--primary)]/40",
            sizeClasses[size],
            className
          )}
        >
          <Lock className="w-3 h-3 text-[var(--primary)]" />
          <span>AES-256-GCM HARDWARE BOUND</span>
        </div>
      )
    case "stay_curious":
      return (
        <div
          className={cn(
            "inline-flex items-center bg-[#07090E] border border-white/15 text-[#A6A6A0] font-mono tracking-wider uppercase select-none hover:border-white/30",
            sizeClasses[size],
            className
          )}
        >
          <Activity className="w-3 h-3 text-[#00E5FF]" />
          <span>HEURISTIC SIGNAL SCANNER</span>
        </div>
      )
    case "lock_it_up":
      return (
        <div
          className={cn(
            "inline-flex items-center bg-[#07090E] border border-white/15 text-[#A6A6A0] font-mono tracking-wider uppercase select-none hover:border-[var(--primary)]/40",
            sizeClasses[size],
            className
          )}
        >
          <Key className="w-3 h-3 text-[var(--primary)]" />
          <span>TPM 2.0 ENCLAVE ISOLATION</span>
        </div>
      )
  }
}
