"use client"

import React from "react"
import Link from "next/link"
import { ProtectionDomainItem } from "@/types/security"
import {
  Globe,
  Network,
  ShieldCheck,
  Fingerprint,
  Cloud,
  Mail,
  KeyRound,
  EyeOff,
  Database,
  Brain,
  ArrowRight,
} from "lucide-react"
import { TechnicalLabel, SignalMarker } from "@/components/design-system/editorial-primitives"

interface ProtectionDomainsGridProps {
  domains: ProtectionDomainItem[]
}

const DOMAIN_ICONS: Record<string, any> = {
  "web-phishing": Globe,
  "network-dns": Network,
  "endpoint-memory": ShieldCheck,
  "identity-credentials": Fingerprint,
  "cloud-perimeter": Cloud,
  "email-collab": Mail,
  "device-enclave": KeyRound,
  "privacy-sovereignty": EyeOff,
  "data-dlp": Database,
  "ai-runtime": Brain,
}

export function ProtectionDomainsGrid({ domains }: ProtectionDomainsGridProps) {
  return (
    <div className="space-y-4 font-mono select-none">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div>
          <TechnicalLabel className="text-[#6F706D]">DEFENSE MATRIX</TechnicalLabel>
          <h3 className="text-sm font-bold text-[#F1F0EB] uppercase mt-0.5">
            PROTECTION SUBSYSTEMS COVERAGE
          </h3>
        </div>
        <Link
          href="/dashboard/protection"
          className="text-xs text-[#39FF14] hover:underline font-mono inline-flex items-center gap-1 uppercase"
        >
          <span>CONFIGURE SUBSYSTEMS</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Dense Technical Grid with Razor Borders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-white/10 border border-white/10">
        {domains.map((domain) => {
          const Icon = DOMAIN_ICONS[domain.id] || ShieldCheck
          const isActive = domain.status === "ACTIVE" || domain.status === "READY" || domain.status === "CONFIGURED"

          return (
            <Link
              key={domain.id}
              href="/dashboard/protection"
              className="p-4 bg-[#050505] hover:bg-[#0c0c0c] transition-colors flex flex-col justify-between group min-h-[140px]"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Icon className="w-4 h-4 text-[#A6A6A0] group-hover:text-[#39FF14] transition-colors" />
                  <span className={`text-[9px] font-mono px-1.5 py-0.2 ${isActive ? "bg-[#39FF14]/10 text-[#39FF14] border border-[#39FF14]/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"}`}>
                    {isActive ? "ACTIVE" : "CONFIG"}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-[#F1F0EB] group-hover:text-[#39FF14] transition-colors uppercase">
                    {domain.name}
                  </h4>
                  <p className="text-[11px] text-[#A6A6A0] line-clamp-2 leading-tight mt-1 font-sans">
                    {domain.description}
                  </p>
                </div>
              </div>

              <div className="pt-2 mt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-[#6F706D] font-mono">
                <span>{domain.eventsCount24h > 0 ? `${domain.eventsCount24h} FILTERED` : "0 ANOMALIES"}</span>
                <span className="text-[#39FF14] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
