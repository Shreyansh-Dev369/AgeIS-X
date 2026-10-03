import React from "react"
import Link from "next/link"
import { PublicShell } from "@/components/layout/public-shell"
import { Button } from "@/components/ui/button"
import { ShieldCheck, Target, Cpu, Lock, Globe, Code2, HeartHandshake } from "lucide-react"

export default function AboutPage() {
  return (
    <PublicShell>
      {/* Header */}
      <section className="py-16 md:py-20 border-b border-slate-800/80 bg-slate-950">
        <div className="page-container max-w-4xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-mono">
            <span>Engineering Philosophy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-100">
            About AgeIS-X
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Our mission is to build an autonomous, zero-overhead defense operating system that protects a person&apos;s complete digital life without compromising personal privacy.
          </p>
        </div>
      </section>

      {/* Core Principles */}
      <section className="py-16 bg-slate-900/40 border-b border-slate-800/80">
        <div className="page-container space-y-8">
          <div className="max-w-2xl">
            <h2 className="text-xl font-bold text-slate-100">Why We Are Building AgeIS-X</h2>
            <p className="text-xs text-slate-400 mt-1">
              Traditional consumer cybersecurity is broken, bloated, and intrusive.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl border border-slate-800 bg-slate-950/80 space-y-3">
              <div className="flex items-center gap-2.5">
                <Target className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-semibold text-slate-100">Unified Over Fragmented</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Users should not have to manage five different point tools, four browser extensions, and three password alerts. Security must function as a coherent, unified layer that operates quietly across all digital surfaces.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-800 bg-slate-950/80 space-y-3">
              <div className="flex items-center gap-2.5">
                <Lock className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-semibold text-slate-100">Zero-Knowledge Trust</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Security software must never become spyware. We design AgeIS-X so that private browsing history, unencrypted emails, and sensitive documents remain on your device and are never harvested for centralized profiling.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-800 bg-slate-950/80 space-y-3">
              <div className="flex items-center gap-2.5">
                <Cpu className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-semibold text-slate-100">Sub-28ms Mathematical Precision</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Protection decisions must be near-instantaneous. We use lightweight character n-gram tokenization and local inference rather than sending slow queries across the internet during every click.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-800 bg-slate-950/80 space-y-3">
              <div className="flex items-center gap-2.5">
                <Globe className="w-5 h-5 text-teal-400" />
                <h3 className="text-base font-semibold text-slate-100">Open & Transparent Engineering</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                We believe in truthful claims. We clearly document what is operational today versus what is in research, and welcome community security researchers to audit our threat classification models.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-16 bg-slate-950 text-center">
        <div className="page-container max-w-xl space-y-4">
          <h3 className="text-2xl font-bold text-slate-100">Explore the Platform</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Read our technical architecture specs or test the live URL analyzer.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Button className="bg-blue-600 hover:bg-blue-500 text-white" asChild>
              <Link href="/technology">View Technology Specs</Link>
            </Button>
            <Button variant="outline" className="border-slate-700 bg-slate-900" asChild>
              <Link href="/#live-analyzer">Try Ingestion Analyzer</Link>
            </Button>
          </div>
        </div>
      </section>
    </PublicShell>
  )
}
