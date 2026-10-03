"use client"

import React from "react"
import Link from "next/link"
import { Laptop, Fingerprint, EyeOff, Database, ArrowRight } from "lucide-react"
import { PixelBadge } from "@/components/ui/pixel-badge"

export function SurfacePostureCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono select-none">
      {/* 1. Device Fleet Card */}
      <Link
        href="/dashboard/devices"
        className="p-4 border border-white/10 bg-[#040608] hover:border-[#00ff66]/50 hover:bg-[#080c10] transition-all flex flex-col justify-between group"
      >
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 border border-[#00f0ff]/30 bg-[#00f0ff]/10 text-[#00f0ff] flex items-center justify-center group-hover:bg-[#00f0ff] group-hover:text-[#040608] transition-colors">
              <Laptop className="w-4 h-4" />
            </div>
            <PixelBadge variant="cyan" size="sm">
              4 / 5 ONLINE
            </PixelBadge>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#f8fafc] group-hover:text-[#00ff66]">
              ENDPOINT FLEET
            </h4>
            <p className="text-[10px] text-[#7e8b9b] leading-relaxed mt-1">
              4 workstations attested. 1 Linux node requires daemon synchronization.
            </p>
          </div>
        </div>

        <div className="pt-2.5 mt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-[#00f0ff] font-bold">
          <span>[ MANAGE FLEET ]</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-[#00ff66]" />
        </div>
      </Link>

      {/* 2. Identity Card */}
      <Link
        href="/dashboard/identity"
        className="p-4 border border-white/10 bg-[#040608] hover:border-[#00ff66]/50 hover:bg-[#080c10] transition-all flex flex-col justify-between group"
      >
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 border border-[#00ff66]/30 bg-[#00ff66]/10 text-[#00ff66] flex items-center justify-center group-hover:bg-[#00ff66] group-hover:text-[#040608] transition-colors">
              <Fingerprint className="w-4 h-4" />
            </div>
            <PixelBadge variant="phosphor" size="sm">
              0 LEAKS FOUND
            </PixelBadge>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#f8fafc] group-hover:text-[#00ff66]">
              IDENTITY DEFENSE
            </h4>
            <p className="text-[10px] text-[#7e8b9b] leading-relaxed mt-1">
              18 corporate email aliases monitored against darknet dumps. Passkeys enrolled.
            </p>
          </div>
        </div>

        <div className="pt-2.5 mt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-[#00ff66] font-bold">
          <span>[ IDENTITY VAULT ]</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-[#00ff66]" />
        </div>
      </Link>

      {/* 3. Privacy Sovereignty Card */}
      <Link
        href="/dashboard/privacy"
        className="p-4 border border-white/10 bg-[#040608] hover:border-[#00ff66]/50 hover:bg-[#080c10] transition-all flex flex-col justify-between group"
      >
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 border border-[#00f0ff]/30 bg-[#00f0ff]/10 text-[#00f0ff] flex items-center justify-center group-hover:bg-[#00f0ff] group-hover:text-[#040608] transition-colors">
              <EyeOff className="w-4 h-4" />
            </div>
            <PixelBadge variant="cyan" size="sm">
              STRICT LOCAL
            </PixelBadge>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#f8fafc] group-hover:text-[#00ff66]">
              PRIVACY SHIELD
            </h4>
            <p className="text-[10px] text-[#7e8b9b] leading-relaxed mt-1">
              Zero outbound payload transmission. On-device lexical inference active.
            </p>
          </div>
        </div>

        <div className="pt-2.5 mt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-[#00f0ff] font-bold">
          <span>[ PRIVACY BOUNDS ]</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-[#00ff66]" />
        </div>
      </Link>

      {/* 4. Data & DLP Card */}
      <Link
        href="/dashboard/data"
        className="p-4 border border-white/10 bg-[#040608] hover:border-[#00ff66]/50 hover:bg-[#080c10] transition-all flex flex-col justify-between group"
      >
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 border border-[#ffb800]/30 bg-[#ffb800]/10 text-[#ffb800] flex items-center justify-center group-hover:bg-[#ffb800] group-hover:text-[#040608] transition-colors">
              <Database className="w-4 h-4" />
            </div>
            <PixelBadge variant="warning" size="sm">
              1 IN VAULT
            </PixelBadge>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#f8fafc] group-hover:text-[#00ff66]">
              DATA & QUARANTINE
            </h4>
            <p className="text-[10px] text-[#7e8b9b] leading-relaxed mt-1">
              1 quarantined VBA macro payload awaiting review. Secret token DLP active.
            </p>
          </div>
        </div>

        <div className="pt-2.5 mt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-[#ffb800] font-bold">
          <span>[ QUARANTINE VAULT ]</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-[#00ff66]" />
        </div>
      </Link>
    </div>
  )
}
