import React from "react"
import Link from "next/link"
import { Logo } from "@/components/design-system/logo"
import { TechnicalLabel, SignalMarker } from "@/components/design-system/editorial-primitives"
import { SecuritySticker } from "@/components/design-system/pixel-art-system"
import { Lock, ShieldCheck } from "lucide-react"

interface AuthLayoutProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  footerPrompt?: {
    text: string
    linkText: string
    href: string
  }
}

export function AuthLayout({
  title,
  subtitle,
  children,
  footerPrompt,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#050505] technical-grid text-[#F1F0EB] flex flex-col justify-between items-center p-4 sm:p-6 select-none relative font-mono text-xs">
      {/* Top Header */}
      <header className="w-full max-w-4xl flex items-center justify-between py-4 border-b border-white/10 text-xs relative z-10">
        <div className="flex items-center gap-3">
          <Logo href="/" size="sm" />
          <span className="text-white/20">|</span>
          <SignalMarker status="active" label="AUTH GATEWAY" />
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="hidden md:inline text-[#6F706D]">TLS 1.3 / AES-256-GCM</span>
          <SecuritySticker type="lock_it_up" size="sm" />
        </div>
      </header>

      {/* Center Auth Card */}
      <main className="w-full max-w-md my-auto py-8 relative z-10">
        <div className="text-center space-y-2 mb-6">
          <TechnicalLabel>IDENTITY ENCLAVE</TechnicalLabel>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F1F0EB] uppercase">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-[#A6A6A0] leading-relaxed max-w-sm mx-auto font-sans">
              {subtitle}
            </p>
          )}
        </div>

        <div className="p-6 sm:p-8 border border-white/10 bg-[#080808] space-y-5">
          {children}

          {footerPrompt && (
            <div className="pt-4 border-t border-white/10 text-center text-xs text-[#A6A6A0]">
              <span>{footerPrompt.text} </span>
              <Link
                href={footerPrompt.href}
                className="text-[#39FF14] hover:underline font-bold transition-colors uppercase ml-1"
              >
                {footerPrompt.linkText}
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-4xl pt-4 pb-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#6F706D] relative z-10 font-mono">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-[#39FF14]" />
            <span>AES-256 GCM ATTESTATION</span>
          </div>
          <span className="text-white/20">•</span>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3 text-[#39FF14]" />
            <span>ZERO-KNOWLEDGE CORE</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span>ISO/IEC 27001 POSTURE</span>
        </div>
      </footer>
    </div>
  )
}
