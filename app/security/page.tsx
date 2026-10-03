"use client"

import React from "react"
import Link from "next/link"
import { PublicShell } from "@/components/layout/public-shell"
import { Button } from "@/components/ui/button"
import {
  EditorialSection,
  EditorialHeading,
  EditorialRule,
  TechnicalLabel,
  SignalMarker,
  DataStrip,
} from "@/components/design-system/editorial-primitives"
import { SecuritySticker } from "@/components/design-system/pixel-art-system"
import { Lock, Key, ShieldCheck, ArrowRight, ShieldAlert } from "lucide-react"

const securityTenets = [
  {
    num: "01",
    title: "DATA MINIMIZATION (ZERO RETENTION)",
    tagline: "NO CLOUD LOGGING OF BROWSING",
    desc: "AgeIS-X extracts only mathematical signatures and n-gram vectors. Your personal messages, raw URLs, and host files never leave your hardware boundary.",
    icon: Lock,
  },
  {
    num: "02",
    title: "HARDWARE ROOT-OF-TRUST ENCRYPTION",
    tagline: "AES-256-GCM SEALED IN TPM 2.0",
    desc: "Local telemetry cache and credentials are encrypted using AES-256 GCM with keys bound to the platform Secure Enclave (Apple Silicon) or TPM 2.0 (Windows 11).",
    icon: Key,
  },
  {
    num: "03",
    title: "OFFICIAL OS SECURITY APIS ONLY",
    tagline: "NO INSECURE KERNEL HOOKING",
    desc: "Platform hooks utilize official operating system security APIs (Network Extensions on macOS, WFP on Windows) without brittle kernel driver modifications.",
    icon: ShieldCheck,
  },
]

export default function SecurityPage() {
  return (
    <PublicShell>
      {/* 1. HERO (MODE B - EDITORIAL BLACK) */}
      <EditorialSection mode="editorial-black" className="pt-10 pb-16 md:pt-16 md:pb-24">
        <div className="space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <SignalMarker status="active" label="TRUST & CRYPTOGRAPHIC ATTESTATION" />
              <span className="text-white/30 text-xs font-mono">/</span>
              <TechnicalLabel>ISO/IEC 27001 ALIGNED</TechnicalLabel>
            </div>
            <div className="flex items-center gap-3">
              <SecuritySticker type="trust_no_one" size="sm" />
              <SecuritySticker type="encryption_freedom" size="sm" />
            </div>
          </div>

          <div className="max-w-4xl space-y-6">
            <EditorialHeading level={1} className="leading-[0.92]">
              SECURITY ARCHITECTURE
              <br />
              <span className="text-[#A6A6A0]">&amp; PRIVACY ASSURANCES.</span>
            </EditorialHeading>

            <p className="text-base sm:text-lg text-[#A6A6A0] max-w-2xl leading-relaxed font-sans font-normal">
              A serious cybersecurity product earns trust through transparent engineering, provable data minimization, and mathematically verifiable zero-trust principles.
            </p>
          </div>
        </div>
      </EditorialSection>

      {/* 2. ZERO TRUST TENETS (MODE A - DARK LAB / CONTINUOUS ROWS) */}
      <EditorialSection mode="dark-lab" className="py-20 md:py-28 border-b border-white/10">
        <div className="space-y-12 font-mono">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
            <div className="space-y-2">
              <TechnicalLabel className="text-[#39FF14]">CORE TENETS</TechnicalLabel>
              <EditorialHeading level={2}>ZERO-TRUST ARCHITECTURAL FOUNDATION</EditorialHeading>
            </div>
            <span className="text-xs text-[#A6A6A0]">RFC-3986 / NIST 800-207</span>
          </div>

          <div className="divide-y divide-white/10 border-t border-b border-white/10">
            {securityTenets.map((t, idx) => {
              const Icon = t.icon
              return (
                <div
                  key={idx}
                  className="py-8 px-2 sm:px-4 grid grid-cols-1 md:grid-cols-12 gap-6 items-start hover:bg-white/[0.02] transition-colors group font-mono"
                >
                  <div className="md:col-span-1 text-base font-bold text-[#39FF14]">
                    {t.num}
                  </div>
                  <div className="md:col-span-4 space-y-1">
                    <span className="text-[10px] tracking-widest text-[#A6A6A0] uppercase block">
                      {t.tagline}
                    </span>
                    <h3 className="text-base font-bold text-[#F1F0EB] group-hover:text-[#39FF14] transition-colors flex items-center gap-2">
                      <Icon className="w-4 h-4 text-[#A6A6A0] group-hover:text-[#39FF14]" />
                      {t.title}
                    </h3>
                  </div>
                  <div className="md:col-span-7 text-xs sm:text-sm text-[#A6A6A0] leading-relaxed font-sans">
                    {t.desc}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </EditorialSection>

      {/* 3. DISCLOSURE & PGP (MODE C - OFF-WHITE PAPER TEXTURE) */}
      <EditorialSection mode="off-white-editorial" className="py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start font-mono">
          <div className="lg:col-span-4 space-y-3">
            <TechnicalLabel className="text-[#6F706D] font-bold">RESPONSIBLE DISCLOSURE</TechnicalLabel>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#050505] tracking-tight leading-tight uppercase">
              VULNERABILITY REPORTING POLICY.
            </h2>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <p className="text-sm sm:text-base text-[#242424] font-sans leading-relaxed">
              We welcome independent security researchers to inspect our public architecture and client binaries. If you discover a potential vulnerability, please report it directly using our PGP key.
            </p>

            <div className="p-4 bg-[#050505] text-[#F1F0EB] text-xs font-mono border border-black space-y-2">
              <div className="flex justify-between text-[#39FF14]">
                <span>PGP PUBLIC KEY FINGERPRINT</span>
                <span>RSA 4096-BIT</span>
              </div>
              <pre className="text-[#A6A6A0] overflow-x-auto text-[11px] leading-relaxed">
{`-----BEGIN PGP PUBLIC KEY BLOCK-----
mQINBF+1k7EBEADAgeISX9902049182390182309182039182039182309182309
Key Fingerprint: 4E9A 8F2D 1C09 3B7E 5A1F 0D6C 8B4E 2A19 7F03 9C4E
Contact: security@ageis-x.corp
-----END PGP PUBLIC KEY BLOCK-----`}
              </pre>
            </div>
          </div>
        </div>
      </EditorialSection>
    </PublicShell>
  )
}
