import React from "react"
import Link from "next/link"
import { Logo } from "@/components/design-system/logo"
import { TacticalFrame } from "@/components/ui/tactical-frame"
import { TerminalPrompt } from "@/components/ui/terminal-prompt"
import { PixelBadge } from "@/components/ui/pixel-badge"
import { ShieldCheck, Lock, Terminal, Cpu } from "lucide-react"

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
    <div className="min-h-screen bg-[#040608] text-[#f8fafc] flex flex-col justify-between items-center p-4 sm:p-6 select-none relative overflow-hidden">
      {/* Background Ambience / Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00ff6608_1px,transparent_1px),linear-gradient(to_bottom,#00ff6608_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-40" />
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none opacity-60" />

      {/* Top Protocol Status Bar */}
      <header className="w-full max-w-4xl flex items-center justify-between py-3 border-b border-white/10 font-mono text-[11px] text-[#7e8b9b] relative z-10">
        <div className="flex items-center gap-3">
          <span className="text-[#00ff66] font-bold">AGEIS-X</span>
          <span className="text-white/20">|</span>
          <span className="hidden sm:inline text-white/60">SYS_AUTH_GATEWAY_V2.4</span>
          <PixelBadge variant="phosphor" size="sm" dot>
            ONLINE
          </PixelBadge>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden md:inline text-white/40">TLS 1.3 / AES-256-GCM</span>
          <div className="flex items-center gap-1.5 text-[#00f0ff]">
            <Lock className="w-3 h-3" />
            <span className="text-[10px]">ENCRYPTED PORT 443</span>
          </div>
        </div>
      </header>

      {/* Center Auth Console */}
      <main className="w-full max-w-md my-auto py-8 relative z-10">
        {/* Brand Terminal Header */}
        <div className="text-center space-y-3 mb-6">
          <div className="flex justify-center">
            <Logo href="/" size="lg" />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#f8fafc] uppercase font-mono">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-[#7e8b9b] leading-relaxed max-w-sm mx-auto font-mono">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Tactical Auth Container */}
        <TacticalFrame
          variant="panel"
          reticles={true}
          reticleColor="phosphor"
          className="p-6 sm:p-7 shadow-[0_0_30px_rgba(0,0,0,0.8)] border-white/15 space-y-5"
        >
          {children}

          {footerPrompt && (
            <div className="pt-4 border-t border-white/10 text-center font-mono text-xs text-[#7e8b9b]">
              <span>{footerPrompt.text} </span>
              <Link
                href={footerPrompt.href}
                className="text-[#00ff66] hover:text-[#39ff14] hover:underline font-semibold transition-colors"
              >
                {footerPrompt.linkText}
              </Link>
            </div>
          )}
        </TacticalFrame>
      </main>

      {/* Security & Cryptographic Reassurance Footer */}
      <footer className="w-full max-w-4xl pt-3 pb-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-[10px] text-[#7e8b9b] font-mono relative z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-[#00ff66]" />
            <span>AES-256 GCM ATTESTATION</span>
          </div>
          <span className="text-white/20">•</span>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3 text-[#00f0ff]" />
            <span>ZERO-KNOWLEDGE CORE</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span>ISO/IEC 27001 POSTURE</span>
          <span className="text-white/20">•</span>
          <span className="text-white/40">NODE CLUSTER US-EAST-01</span>
        </div>
      </footer>
    </div>
  )
}
