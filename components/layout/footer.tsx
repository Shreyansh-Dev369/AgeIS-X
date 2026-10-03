import React from "react"
import Link from "next/link"
import { Logo } from "@/components/design-system/logo"
import { ShieldCheck, Lock, Globe, Terminal, Activity, Cpu } from "lucide-react"
import { PixelBadge } from "@/components/ui/pixel-badge"

const footerSections = [
  {
    title: "01 // PLATFORM",
    links: [
      { label: "CONSOLE OVERVIEW", href: "/dashboard" },
      { label: "THREAT INTELLIGENCE", href: "/dashboard/threats" },
      { label: "PROTECTION ARCHITECTURE", href: "/protection" },
      { label: "URL THREAT ANALYZER", href: "/technology" },
      { label: "DEVICE INTEGRITY", href: "/dashboard/devices" },
    ],
  },
  {
    title: "02 // SECURITY & AI",
    links: [
      { label: "HOW IT WORKS", href: "/how-it-works" },
      { label: "SECURITY & COMPLIANCE", href: "/security" },
      { label: "ZERO-TRUST FRAMEWORK", href: "/security" },
      { label: "VULNERABILITY POLICY", href: "/security" },
      { label: "INCIDENT AUDIT TRAIL", href: "/dashboard/incidents" },
    ],
  },
  {
    title: "03 // ARCHITECTURE",
    links: [
      { label: "ENTERPRISE SECURITY", href: "/business" },
      { label: "PERSONAL DEFENSE", href: "/pricing" },
      { label: "DEVSECOPS & EBPF", href: "/business" },
      { label: "TELEMETRY API / REST", href: "/technology" },
      { label: "TIERS & PRICING", href: "/pricing" },
    ],
  },
  {
    title: "04 // ORGANIZATIONAL",
    links: [
      { label: "ABOUT AGEIS-X", href: "/about" },
      { label: "DOWNLOAD CLIENT", href: "/download" },
      { label: "CONSOLE LOGIN", href: "/login" },
      { label: "PRIVACY POLICY", href: "/dashboard/privacy" },
      { label: "TERMS OF SERVICE", href: "/about" },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#040608] text-[#7e8b9b] text-xs font-mono">
      {/* Top Banner Bar */}
      <div className="border-b border-white/5 bg-[#080c10]/40 py-2">
        <div className="page-container flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="text-[#00ff66] font-bold">AGEIS-X://END_OF_SESSION</span>
            <span className="text-white/20">•</span>
            <span className="text-white/60">AUTONOMOUS DIGITAL DEFENSE OPERATING SYSTEM</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-none bg-[#00ff66] animate-pulse" />
            <span className="text-[#00ff66]">10/10 SURFACES SYNCHRONIZED</span>
          </div>
        </div>
      </div>

      <div className="page-container py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand & System Profile Column */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="md" />
            <p className="text-xs text-[#7e8b9b] font-sans leading-relaxed max-w-sm">
              Unified security intelligence platform engineered to analyze, monitor, and defend personal and enterprise digital surfaces through autonomous, on-device telemetry.
            </p>
            
            {/* System Specs Box */}
            <div className="p-3 border border-white/10 bg-[#080c10] space-y-1.5 text-[10px]">
              <div className="flex items-center justify-between">
                <span className="text-[#7e8b9b]">BUILD:</span>
                <span className="text-[#f8fafc]">PUBLIC PREVIEW</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#7e8b9b]">NODE:</span>
                <span className="text-[#00f0ff]">GLOBAL-MESH-01</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#7e8b9b]">ATTESTATION:</span>
                <span className="text-[#00ff66]">DETERMINISTIC</span>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          {footerSections.map((section, idx) => (
            <div key={idx} className="space-y-3">
              <h4 className="text-xs font-bold text-[#f8fafc] tracking-wider">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link
                      href={link.href}
                      className="text-[11px] text-[#7e8b9b] hover:text-[#00ff66] transition-colors block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#7e8b9b]">
          <p>© {new Date().getFullYear()} AGEIS-X SECURITY SYSTEMS INC. ALL RIGHTS RESERVED.</p>
          <div className="flex flex-wrap items-center gap-5">
            <span className="flex items-center gap-1.5 text-white/80">
              <Lock className="w-3.5 h-3.5 text-[#00ff66]" />
              ZERO-KNOWLEDGE TELEMETRY
            </span>
            <span className="flex items-center gap-1.5 text-white/80">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00f0ff]" />
              CRYPTOGRAPHIC ATTESTATION
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
