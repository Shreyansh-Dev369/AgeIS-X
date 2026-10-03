"use client"

import React from "react"
import Link from "next/link"
import { ProtectionDomainItem } from "@/types/security"
import { PixelBadge } from "@/components/ui/pixel-badge"
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
    <div className="space-y-3 font-mono select-none">
      <div className="flex items-center justify-between pb-1 border-b border-white/10">
        <div>
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#f8fafc]">
            10-Domain Synchronized Defense Grid
          </h3>
          <p className="text-[11px] text-[#7e8b9b]">
            Continuous posture evaluation synchronized across all vectors via single security brain.
          </p>
        </div>
        <Link
          href="/dashboard/protection"
          className="text-xs text-[#00ff66] hover:underline uppercase font-bold inline-flex items-center gap-1"
        >
          <span>[ VIEW MATRIX ]</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {domains.map((domain) => {
          const Icon = DOMAIN_ICONS[domain.id] || ShieldCheck
          const isActive = domain.status === "ACTIVE" || domain.status === "READY" || domain.status === "CONFIGURED"

          return (
            <Link
              key={domain.id}
              href="/dashboard/protection"
              className="p-3.5 border border-white/10 bg-[#040608] hover:border-[#00ff66]/50 hover:bg-[#080c10] transition-all flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-7 h-7 border border-[#00ff66]/30 bg-[#00ff66]/10 text-[#00ff66] flex items-center justify-center group-hover:bg-[#00ff66] group-hover:text-[#040608] transition-colors">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <PixelBadge variant={isActive ? "phosphor" : "warning"} size="sm">
                    {domain.status}
                  </PixelBadge>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#f8fafc] group-hover:text-[#00ff66] transition-colors">
                    {domain.name}
                  </h4>
                  <p className="text-[10px] text-[#7e8b9b] line-clamp-2 leading-tight mt-1">
                    {domain.description}
                  </p>
                </div>
              </div>

              <div className="pt-2.5 mt-2.5 border-t border-white/10 flex items-center justify-between text-[10px] text-[#7e8b9b]">
                <span className="text-[#00f0ff]">{domain.eventsCount24h > 0 ? `${domain.eventsCount24h} filtered (24h)` : "Clean State"}</span>
                <ArrowRight className="w-3 h-3 text-white/40 group-hover:text-[#00ff66] group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
