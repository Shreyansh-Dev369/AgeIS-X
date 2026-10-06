import React from "react"
import Link from "next/link"
import { Logo } from "@/components/design-system/logo"
import { TechnicalLabel } from "@/components/design-system/editorial-primitives"
import { SecuritySticker } from "@/components/design-system/pixel-art-system"
import { Lock, Terminal, ShieldAlert } from "lucide-react"

const footerSections = [
  {
    title: "OPERATING ENGINE",
    links: [
      { label: "Security Console", href: "/dashboard" },
      { label: "Threat Center", href: "/dashboard/threats" },
      { label: "Incident Workflows", href: "/dashboard/incidents" },
      { label: "Protection Grid", href: "/protection" },
      { label: "Fleet & Devices", href: "/dashboard/devices" },
    ],
  },
  {
    title: "RESEARCH & INTEL",
    links: [
      { label: "Technology Specs", href: "/technology" },
      { label: "How It Works", href: "/how-it-works" },
      { label: "Security Architecture", href: "/security" },
      { label: "Zero-Knowledge Proofs", href: "/security" },
      { label: "Vulnerability Disclosure", href: "/security" },
    ],
  },
  {
    title: "DEPLOYMENTS",
    links: [
      { label: "Enterprise & Enclaves", href: "/business" },
      { label: "Personal Defense", href: "/pricing" },
      { label: "Pricing & Plans", href: "/pricing" },
      { label: "Daemon Downloads", href: "/download" },
    ],
  },
  {
    title: "ORGANIZATION",
    links: [
      { label: "About AgeIS-X", href: "/about" },
      { label: "Sign In", href: "/login" },
      { label: "Initialize Account", href: "/signup" },
      { label: "Privacy Enclaves", href: "/dashboard/privacy" },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#050505] text-[#A6A6A0] text-xs font-mono">
      {/* Top Editorial Rule & Status Header */}
      <div className="border-b border-white/10 py-4 px-4 sm:px-6 lg:px-10 xl:px-12 flex flex-wrap items-center justify-between gap-4 max-w-[1600px] mx-auto">
        <div className="flex items-center gap-4">
          <span className="w-2 h-2 bg-[#39FF14] inline-block" />
          <span className="text-[#F1F0EB] font-bold uppercase tracking-wider text-[11px]">
            CORE AUTONOMOUS ENGINE: ONLINE & STABLE
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-[10px] sm:text-[11px] text-[#A6A6A0]">
          <span>LATENCY: 14.8MS</span>
          <span className="text-white/20">|</span>
          <span>MEMORY: 34.2 MB</span>
          <span className="text-white/20">|</span>
          <span>TPM 2.0 SEALED</span>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 mb-12">
          {/* Brand & Editorial Column */}
          <div className="lg:col-span-4 space-y-4 pr-4">
            <Logo size="md" />
            <p className="text-xs text-[#A6A6A0] leading-relaxed font-sans font-normal pt-2">
              Autonomous cybersecurity operating layer. Defending web ingress, communications, identity, endpoints, and local secrets with zero-knowledge on-device inference.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <SecuritySticker type="encryption_freedom" size="sm" />
              <SecuritySticker type="lock_it_up" size="sm" />
            </div>
          </div>

          {/* Nav Sections */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {footerSections.map((section, idx) => (
              <div key={idx} className="space-y-3">
                <h4 className="text-[11px] font-bold text-[#F1F0EB] tracking-wider uppercase border-b border-white/10 pb-2">
                  {section.title}
                </h4>
                <ul className="space-y-2">
                  {section.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <Link
                        href={link.href}
                        className="text-xs text-[#A6A6A0] hover:text-[#39FF14] transition-colors block py-0.5"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Technical Bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#6F706D]">
          <p>© {new Date().getFullYear()} AGEIS-X AUTONOMOUS SYSTEMS. ZERO-KNOWLEDGE SPEC 2.6.</p>
          <div className="flex flex-wrap items-center gap-6 font-mono">
            <span>RFC-3986 COMPLIANT</span>
            <span>AES-256-GCM QUARANTINE</span>
            <span>SHA-256 REPRODUCIBLE</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
