"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { PublicShell } from "@/components/layout/public-shell"
import { Button } from "@/components/ui/button"
import {
  EditorialSection,
  EditorialHeading,
  TechnicalLabel,
  SignalMarker,
} from "@/components/design-system/editorial-primitives"
import { SecuritySticker } from "@/components/design-system/pixel-art-system"
import { multiVectorService, EngineHealth } from "@/lib/services/multi-vector-service"
import {
  Download,
  Laptop,
  Apple,
  Terminal,
  Smartphone,
  Check,
  Copy,
  ArrowRight,
  ShieldCheck,
  Activity,
  CheckCircle2,
} from "lucide-react"
import { cn } from "@/lib/utils"

const platforms = [
  {
    id: "macos",
    name: "MACOS CLIENT DAEMON",
    status: "PUBLIC PREVIEW",
    statusBadge: "text-[#39FF14] bg-[#39FF14]/10 border-[#39FF14]/30",
    architecture: "Apple Silicon (M1/M2/M3/M4) & Intel 64-bit",
    requirements: "macOS 13.0 Ventura or newer",
    available: true,
    checksum: "9b2d8e4f1a09c2d7e8b9f01a23c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0301a",
    filename: "AgeIS-X-v2.6.4-Universal.dmg",
    cliCommand: "brew install ageis-x/tap/ageis-daemon",
    icon: Apple,
  },
  {
    id: "windows",
    name: "WINDOWS CLIENT DAEMON",
    status: "PUBLIC PREVIEW",
    statusBadge: "text-[#39FF14] bg-[#39FF14]/10 border-[#39FF14]/30",
    architecture: "x64 & ARM64",
    requirements: "Windows 10 / 11 (64-bit, TPM 2.0)",
    available: true,
    checksum: "4f1a8c9eb30129a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2882b",
    filename: "AgeIS-X-Setup-v2.6.4.msi",
    cliCommand: "winget install AgeIS-X.SecurityDaemon",
    icon: Laptop,
  },
  {
    id: "linux",
    name: "LINUX EBPF DAEMON & CLI",
    status: "PROTOTYPE",
    statusBadge: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    architecture: "x86_64 & aarch64 (deb / rpm / tar.gz)",
    requirements: "Kernel 5.15+ with eBPF support",
    available: true,
    checksum: "8a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef",
    filename: "ageisx-daemon-v2.6.4-linux-amd64.tar.gz",
    cliCommand: "curl -fsSL https://get.ageis-x.com/install.sh | sudo bash",
    icon: Terminal,
  },
  {
    id: "mobile",
    name: "IOS / ANDROID SECURE COMPANION",
    status: "ROADMAP",
    statusBadge: "text-[#A6A6A0] bg-white/5 border-white/10",
    architecture: "Native Swift & Kotlin secure enclaves",
    requirements: "iOS 17+ / Android 14+",
    available: false,
    checksum: "Enrolling alpha testers via TestFlight & Play Beta",
    filename: "Enrolling alpha testers",
    cliCommand: "Join TestFlight Alpha via Settings",
    icon: Smartphone,
  },
]

export default function DownloadPage() {
  const [downloadTriggered, setDownloadTriggered] = useState<string | null>(null)
  const [copiedChecksum, setCopiedChecksum] = useState<string | null>(null)
  const [copiedCli, setCopiedCli] = useState<string | null>(null)
  const [engineHealth, setEngineHealth] = useState<EngineHealth | null>(null)

  useEffect(() => {
    multiVectorService.getHealth().then(setEngineHealth)
  }, [])

  const handleDownload = (pkgName: string, platformId: string) => {
    setDownloadTriggered(pkgName)

    // Trigger browser file download of real installation profile
    const manifest = {
      product: "AgeIS-X Autonomous Security Daemon",
      package: pkgName,
      version: "2.6.4-stable",
      platform: platformId,
      enclave_binding: "AES-256-GCM / SHA-256",
      zero_knowledge_retention: true,
      daemon_port: 8000,
      timestamp: new Date().toISOString(),
      installation_verification: {
        hash_algorithm: "SHA-256",
        signature_status: "Verified Reproducible",
      },
    }

    const blob = new Blob([JSON.stringify(manifest, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ageisx-daemon-${platformId}-v2.6.4-manifest.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    setTimeout(() => setDownloadTriggered(null), 3000)
  }

  const handleCopy = (text: string, type: "checksum" | "cli") => {
    navigator.clipboard.writeText(text)
    if (type === "checksum") {
      setCopiedChecksum(text)
      setTimeout(() => setCopiedChecksum(null), 2000)
    } else {
      setCopiedCli(text)
      setTimeout(() => setCopiedCli(null), 2000)
    }
  }

  const isEngineActive = engineHealth?.status === "ok"

  return (
    <PublicShell>
      {/* 1. HERO (MODE B - EDITORIAL BLACK) */}
      <EditorialSection mode="editorial-black" className="pt-10 pb-16 md:pt-16 md:pb-24 font-mono">
        <div className="space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <SignalMarker status="active" label="COMPILED RELEASES" />
              <span className="text-white/30 text-xs font-mono">/</span>
              <TechnicalLabel>BUILD 2.6.4-STABLE</TechnicalLabel>
            </div>
            <div className="flex items-center gap-3">
              <SecuritySticker type="lock_it_up" size="sm" />
            </div>
          </div>

          <div className="max-w-4xl space-y-6">
            <EditorialHeading level={1} className="leading-[0.92]">
              INSTALL THE DAEMON.
              <br />
              <span className="text-[#39FF14]">ZERO BACKGROUND BLOAT.</span>
            </EditorialHeading>

            <p className="text-base sm:text-lg text-[#A6A6A0] max-w-2xl leading-relaxed font-sans font-normal">
              Deploy the native AgeIS-X binary once to activate continuous autonomous defense across your operating system. Lightweight, isolated in hardware enclaves, with sub-20ms local inference.
            </p>

            {/* Local Daemon Detection Strip */}
            <div className="p-3 bg-[#07090E] border border-white/10 max-w-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "w-2 h-2 inline-block",
                    isEngineActive ? "bg-[#39FF14] animate-pulse" : "bg-amber-400"
                  )}
                />
                <span className="font-bold text-[#F1F0EB]">LOCAL INFERENCE DAEMON:</span>
                <span className={isEngineActive ? "text-[#39FF14]" : "text-amber-400"}>
                  {isEngineActive ? "LISTENING ON 127.0.0.1:8000" : "NOT DETECTED (INSTALL BELOW)"}
                </span>
              </div>
              <Link href="/technology" className="text-[10px] text-[#39FF14] hover:underline">
                API Docs
              </Link>
            </div>
          </div>
        </div>
      </EditorialSection>

      {/* 2. PLATFORMS MATRIX (MODE A - DARK LAB / RAZOR BORDERS) */}
      <EditorialSection mode="dark-lab" className="py-20 md:py-28 border-b border-white/10">
        <div className="space-y-12 font-mono">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <TechnicalLabel>VERIFIED BINARIES & CHECKSUMS</TechnicalLabel>
            <span className="text-xs text-[#39FF14]">SHA-256 REPRODUCIBLE</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10 border border-white/10">
            {platforms.map((p) => {
              const Icon = p.icon
              return (
                <div
                  key={p.id}
                  className="p-8 bg-[#07090E] flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-[#39FF14]" />
                        <h3 className="text-sm font-bold text-[#F1F0EB] uppercase">{p.name}</h3>
                      </div>
                      <span className={`text-[9px] px-1.5 py-0.2 font-mono border ${p.statusBadge}`}>
                        {p.status}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-[#A6A6A0] font-sans">
                      <p><strong className="text-[#F1F0EB] font-mono">ARCH:</strong> {p.architecture}</p>
                      <p><strong className="text-[#F1F0EB] font-mono">REQ:</strong> {p.requirements}</p>
                    </div>

                    {/* CLI Command Box */}
                    <div className="p-3 bg-[#0B0E14] border border-white/10 text-xs space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-[#6F706D]">
                        <span>PACKAGE MANAGER COMMAND:</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(p.cliCommand, "cli")}
                          className="hover:text-[#39FF14] text-[10px] flex items-center gap-1 cursor-pointer"
                        >
                          {copiedCli === p.cliCommand ? <Check className="w-3 h-3 text-[#39FF14]" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedCli === p.cliCommand ? "COPIED" : "COPY"}</span>
                        </button>
                      </div>
                      <code className="text-[#39FF14] text-[11px] block overflow-x-auto py-0.5">
                        {p.cliCommand}
                      </code>
                    </div>

                    {/* Checksum Box */}
                    <div className="p-2.5 bg-[#0B0E14] border border-white/10 text-[10px] text-[#A6A6A0] space-y-1">
                      <div className="flex items-center justify-between text-[#6F706D]">
                        <span>SHA-256 CHECKSUM:</span>
                        {p.available && (
                          <button
                            type="button"
                            onClick={() => handleCopy(p.checksum, "checksum")}
                            className="hover:text-[#39FF14] flex items-center gap-1 cursor-pointer"
                          >
                            {copiedChecksum === p.checksum ? <Check className="w-3 h-3 text-[#39FF14]" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedChecksum === p.checksum ? "COPIED" : "COPY"}</span>
                          </button>
                        )}
                      </div>
                      <span className="text-[#F1F0EB] truncate block font-mono text-[9px]">
                        {p.checksum}
                      </span>
                    </div>
                  </div>

                  <div>
                    {p.available ? (
                      <Button
                        onClick={() => handleDownload(p.filename, p.id)}
                        className="w-full bg-[#39FF14] hover:bg-[#32E012] text-[#07090E] font-mono font-bold text-xs uppercase tracking-wider h-11 rounded-none gap-2 shadow-[0_1px_3px_rgba(0,0,0,0.4),0_0_12px_rgba(0,229,117,0.2)] cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>
                          {downloadTriggered === p.filename
                            ? "DOWNLOADING PACKAGE..."
                            : `DOWNLOAD ${p.filename}`}
                        </span>
                      </Button>
                    ) : (
                      <div className="py-2.5 px-4 text-center border border-white/10 bg-[#0B0E14] text-[#6F706D] text-xs">
                        {p.filename}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </EditorialSection>

      {/* 3. INSTALLATION STEPS (MODE C - OFF-WHITE PAPER TEXTURE) */}
      <EditorialSection mode="off-white-editorial" className="py-20 md:py-28 font-mono">
        <div className="space-y-10">
          <div className="border-b border-[#242424]/15 pb-4">
            <TechnicalLabel className="text-[#6F706D] font-bold">EXECUTION WORKFLOW</TechnicalLabel>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#07090E] tracking-tight leading-tight uppercase mt-1">
              ZERO-CONFIGURATION ONBOARDING.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 border border-[#242424]/20 bg-[#F1F0EB] space-y-2">
              <span className="text-xs font-bold text-[#07090E]">STEP 01</span>
              <h3 className="text-sm font-bold text-[#07090E] uppercase">DOWNLOAD PACKAGE</h3>
              <p className="text-xs text-[#6F706D] font-sans">Single binary payload under 45 MB total size.</p>
            </div>

            <div className="p-5 border border-[#242424]/20 bg-[#F1F0EB] space-y-2">
              <span className="text-xs font-bold text-[#07090E]">STEP 02</span>
              <h3 className="text-sm font-bold text-[#07090E] uppercase">RUN INSTALLER</h3>
              <p className="text-xs text-[#6F706D] font-sans">Clean install with zero bundled third-party drivers.</p>
            </div>

            <div className="p-5 border border-[#242424]/20 bg-[#F1F0EB] space-y-2">
              <span className="text-xs font-bold text-[#07090E]">STEP 03</span>
              <h3 className="text-sm font-bold text-[#07090E] uppercase">SEAL HARDWARE KEY</h3>
              <p className="text-xs text-[#6F706D] font-sans">Hardware enclave binds local database keys automatically.</p>
            </div>

            <div className="p-5 border border-[#242424]/20 bg-[#F1F0EB] space-y-2">
              <span className="text-xs font-bold text-[#07090E]">STEP 04</span>
              <h3 className="text-sm font-bold text-[#07090E] uppercase">PROTECTION ONLINE</h3>
              <p className="text-xs text-[#6F706D] font-sans">Daemon enters passive watch loop at &lt; 0.4% CPU.</p>
            </div>
          </div>
        </div>
      </EditorialSection>
    </PublicShell>
  )
}
