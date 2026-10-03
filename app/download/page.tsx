"use client"

import React from "react"
import Link from "next/link"
import { PublicShell } from "@/components/layout/public-shell"
import { Button } from "@/components/ui/button"
import { Laptop, Apple, Terminal, Smartphone, Download, CheckCircle2, Clock, ShieldCheck, AlertCircle } from "lucide-react"

const platforms = [
  {
    id: "macos",
    name: "macOS Desktop Client",
    status: "PUBLIC PREVIEW",
    statusBadge: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    architecture: "Apple Silicon (M1/M2/M3/M4) & Intel 64-bit",
    requirements: "macOS 13.0 Ventura or newer",
    available: true,
    checksum: "SHA-256: 9b2d8e4f1a09c2...301a",
    filename: "AgeIS-X-v2.4.1-Universal.dmg",
  },
  {
    id: "windows",
    name: "Windows Desktop Client",
    status: "PUBLIC PREVIEW",
    statusBadge: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    architecture: "x64 & ARM64",
    requirements: "Windows 10 / 11 (64-bit)",
    available: true,
    checksum: "SHA-256: 4f1a8c9eb30129...882b",
    filename: "AgeIS-X-Setup-v2.4.1.msi",
  },
  {
    id: "linux",
    name: "Linux Daemon & CLI",
    status: "IN DEVELOPMENT",
    statusBadge: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    architecture: "x86_64 & aarch64 (deb / rpm / tar.gz)",
    requirements: "Kernel 5.8+ with eBPF support",
    available: false,
    checksum: "Preview builds via apt repository",
    filename: "In active development",
  },
  {
    id: "mobile",
    name: "iOS & Android Companion",
    status: "COMING SOON",
    statusBadge: "text-slate-400 bg-slate-800 border-slate-700",
    architecture: "Native Swift & Kotlin apps",
    requirements: "iOS 17+ / Android 14+",
    available: false,
    checksum: "Private TestFlight beta enrolling",
    filename: "Enrolling beta testers",
  },
]

export default function DownloadPage() {
  return (
    <PublicShell>
      {/* Header */}
      <section className="py-16 md:py-20 border-b border-slate-800/80 bg-slate-950">
        <div className="page-container max-w-4xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-mono">
            <span>One Unified Application</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-100">
            Download the AgeIS-X Client
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Install the native AgeIS-X application once on your workstation to activate continuous autonomous threat protection.
          </p>
        </div>
      </section>

      {/* Onboarding Steps: Choose -> Download -> Install -> Connect -> Protect */}
      <section className="py-12 bg-slate-900/30 border-b border-slate-800/80">
        <div className="page-container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-blue-400 font-bold block">STEP 01</span>
              <span className="font-semibold text-slate-200 block">Choose Platform</span>
              <p className="text-slate-400 text-[11px]">Select your native OS installer below.</p>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-blue-400 font-bold block">STEP 02</span>
              <span className="font-semibold text-slate-200 block">Download Client</span>
              <p className="text-slate-400 text-[11px]">Lightweight binary (&lt;45MB total).</p>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-blue-400 font-bold block">STEP 03</span>
              <span className="font-semibold text-slate-200 block">Run Installer</span>
              <p className="text-slate-400 text-[11px]">Clean install with zero bundled bloat.</p>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-blue-400 font-bold block">STEP 04</span>
              <span className="font-semibold text-slate-200 block">Connect Device</span>
              <p className="text-slate-400 text-[11px]">Sign in with your security account.</p>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-emerald-400 font-bold block">STEP 05</span>
              <span className="font-semibold text-slate-200 block">Protection Active</span>
              <p className="text-slate-400 text-[11px]">Autonomous kernel shielding begins.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Platforms Grid */}
      <section className="py-16 bg-slate-950 border-b border-slate-800/80">
        <div className="page-container space-y-8">
          <div className="max-w-2xl">
            <h2 className="text-xl font-bold text-slate-100">Select Platform Package</h2>
            <p className="text-xs text-slate-400 mt-1">
              Download packages with verified cryptographic SHA-256 checksums.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {platforms.map((p) => (
              <div
                key={p.id}
                className="p-6 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-100">{p.name}</h3>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${p.statusBadge}`}>
                      {p.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-400">
                    <p><span className="text-slate-300 font-medium">Architecture:</span> {p.architecture}</p>
                    <p><span className="text-slate-300 font-medium">Requirements:</span> {p.requirements}</p>
                  </div>

                  <div className="p-2.5 rounded bg-slate-950/80 border border-slate-800 font-mono text-[11px] text-slate-400">
                    <span className="text-slate-500 block text-[10px] uppercase">Package Verification</span>
                    <span className="text-slate-300 truncate block">{p.checksum}</span>
                  </div>
                </div>

                <div>
                  {p.available ? (
                    <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs gap-2" asChild>
                      <Link href="#download-triggered" onClick={(e) => {
                        e.preventDefault()
                        alert(`AgeIS-X Client Package (${p.filename}) download initiated for demonstration.`)
                      }}>
                        <Download className="w-4 h-4" />
                        Download {p.name.split(" ")[0]} Package
                      </Link>
                    </Button>
                  ) : (
                    <Button variant="outline" disabled className="w-full border-slate-800 text-slate-500 text-xs gap-2">
                      <Clock className="w-4 h-4" />
                      {p.status === "IN DEVELOPMENT" ? "In Development (Beta Coming Soon)" : "Coming Soon"}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Browser Companion Card */}
      <section className="py-16 bg-slate-900/30">
        <div className="page-container max-w-3xl">
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Browser Extension
                </span>
                <h3 className="text-base font-bold text-slate-100">AgeIS-X Browser Companion</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-md">
                Enables on-the-fly URL inspection and tracking parameter defanging in Chromium, Chrome, Brave, Edge, and Firefox.
              </p>
            </div>

            <Button variant="outline" className="border-slate-700 bg-slate-900 hover:bg-slate-800 shrink-0 text-xs" asChild>
              <Link href="#" onClick={(e) => {
                e.preventDefault()
                alert("Browser Companion Extension installation link.")
              }}>
                Add Extension to Browser
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </PublicShell>
  )
}
