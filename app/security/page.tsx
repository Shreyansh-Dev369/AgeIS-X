import React from "react"
import Link from "next/link"
import { PublicShell } from "@/components/layout/public-shell"
import { Button } from "@/components/ui/button"
import { ShieldCheck, Lock, Key, FileCheck, EyeOff, CheckCircle2, Shield, AlertCircle } from "lucide-react"

export default function SecurityPage() {
  return (
    <PublicShell>
      {/* Header */}
      <section className="py-16 md:py-20 border-b border-slate-800/80 bg-slate-950">
        <div className="page-container max-w-4xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-mono">
            <span>Trust, Privacy & Architecture</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-100">
            Security Architecture & Principles
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            A serious security company earns trust through transparent engineering, provable data minimization, and mathematically verifiable zero-trust principles.
          </p>
        </div>
      </section>

      {/* Zero Trust Principles */}
      <section className="py-16 bg-slate-900/40 border-b border-slate-800/80">
        <div className="page-container space-y-8">
          <div className="max-w-2xl">
            <h2 className="text-xl font-bold text-slate-100">Core Zero-Trust Tenets</h2>
            <p className="text-xs text-slate-400 mt-1">
              Every incoming vector, background daemon, and network packet is treated as untrusted until verified.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-slate-800 bg-slate-950/80 space-y-3">
              <div className="p-2 w-fit rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <Lock className="w-5 h-5 stroke-[1.75]" />
              </div>
              <h3 className="text-sm font-semibold text-slate-100">Data Minimization</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                AgeIS-X extracts only mathematical signatures and n-gram vectors. Your personal messages, browsing history, and private files never leave your device.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-800 bg-slate-950/80 space-y-3">
              <div className="p-2 w-fit rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Key className="w-5 h-5 stroke-[1.75]" />
              </div>
              <h3 className="text-sm font-semibold text-slate-100">Local Enclave Encryption</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Local telemetry cache and credentials are encrypted using AES-256 GCM with keys bound to the host hardware root-of-trust (Secure Enclave / TPM).
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-800 bg-slate-950/80 space-y-3">
              <div className="p-2 w-fit rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <ShieldCheck className="w-5 h-5 stroke-[1.75]" />
              </div>
              <h3 className="text-sm font-semibold text-slate-100">Least Privilege Hooks</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Platform hooks utilize official operating system security APIs (Network Extensions on macOS, WFP on Windows) without insecure kernel patching.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance & Standards Status */}
      <section className="py-16 bg-slate-950 border-b border-slate-800/80">
        <div className="page-container space-y-6">
          <div className="max-w-2xl">
            <h2 className="text-xl font-bold text-slate-100">Compliance & Security Standards</h2>
            <p className="text-xs text-slate-400 mt-1">
              Transparent reporting on current alignment and audit readiness.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200">SOC 2 Type II Alignment</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Controls Implemented
                </span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                System access controls, immutable logging, and change management procedures designed in adherence with AICPA Trust Services Criteria.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200">GDPR & CCPA Zero-Knowledge</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Compliant by Architecture
                </span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Because no personal browsing history or unhashed communications are stored on servers, user privacy is safeguarded mathematically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Responsible Vulnerability Disclosure */}
      <section className="py-16 bg-slate-900/30">
        <div className="page-container max-w-3xl space-y-6">
          <div className="p-6 rounded-xl border border-slate-800 bg-slate-950 space-y-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-400" />
              <h3 className="text-base font-semibold text-slate-100">Responsible Disclosure Policy</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              We welcome independent security researchers to inspect our public architecture and client binaries. If you discover a potential vulnerability, please report it directly to <code className="text-blue-400 font-mono">security@ageis-x.corp</code> using our PGP public key. We provide coordinated disclosure timelines and bug bounties for verified findings.
            </p>
          </div>
        </div>
      </section>
    </PublicShell>
  )
}
