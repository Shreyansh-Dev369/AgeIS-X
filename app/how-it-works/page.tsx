import React from "react"
import Link from "next/link"
import { PublicShell } from "@/components/layout/public-shell"
import { HowItWorksPipeline } from "@/components/marketing/how-it-works-pipeline"
import { AIEngineBreakdown } from "@/components/marketing/ai-engine-breakdown"
import { Button } from "@/components/ui/button"
import { ArrowRight, Terminal, ShieldCheck, Zap } from "lucide-react"

export default function HowItWorksPage() {
  return (
    <PublicShell>
      {/* Page Header */}
      <section className="py-16 md:py-20 border-b border-slate-800/80 bg-slate-950">
        <div className="page-container max-w-4xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-mono">
            <span>Autonomous Intelligence Pipeline</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-100">
            How AgeIS-X Analyzes and Neutralizes Threats
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            From the moment a network request is initiated or a background process executes, AgeIS-X evaluates signals in parallel to make deterministic, sub-28ms security decisions.
          </p>
        </div>
      </section>

      {/* Complete Lifecycle Pipeline */}
      <section className="py-16 bg-slate-900/40 border-b border-slate-800/80">
        <div className="page-container space-y-8">
          <div className="max-w-2xl">
            <h2 className="text-xl font-bold text-slate-100">The 6-Stage Autonomous Lifecycle</h2>
            <p className="text-xs text-slate-400 mt-1">
              Detailed step-by-step breakdown from passive sensor capture to transparent human context.
            </p>
          </div>

          <HowItWorksPipeline />
        </div>
      </section>

      {/* Multi-Model Classification Architecture */}
      <section className="py-16 bg-slate-950 border-b border-slate-800/80">
        <div className="page-container">
          <AIEngineBreakdown />
        </div>
      </section>

      {/* Real-World Scenario Walkthrough */}
      <section className="py-16 bg-slate-900/30 border-b border-slate-800/80">
        <div className="page-container space-y-8">
          <div className="max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">
              Concrete Example
            </span>
            <h2 className="text-xl font-bold text-slate-100 mt-1">
              Case Study: Intercepting a Credential Phishing Link
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              See what happens under the hood when a user clicks a deceptively crafted banking login link.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl border border-slate-800 bg-slate-950 space-y-2">
              <span className="text-[11px] font-mono text-slate-500">Stage 1 • Intercept</span>
              <h4 className="text-sm font-semibold text-slate-200">Deceptive Link Clicked</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                User clicks <code className="text-rose-400 font-mono text-[11px]">https://auth-portal-verify.cc</code> in an email. AgeIS-X network hook pauses socket connection before DNS resolution.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-800 bg-slate-950 space-y-2">
              <span className="text-[11px] font-mono text-slate-500">Stage 2 • Inference</span>
              <h4 className="text-sm font-semibold text-slate-200">Neural Scoring (14ms)</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                The lexical model tokenizes n-grams, noting <code className="text-amber-400 font-mono text-[11px]">verify</code> keyword and <code className="text-amber-400 font-mono text-[11px]">.cc</code> TLD registered &lt; 48 hours ago. Risk score calculated at 94/100.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-800 bg-slate-950 space-y-2">
              <span className="text-[11px] font-mono text-slate-500">Stage 3 • Action</span>
              <h4 className="text-sm font-semibold text-slate-200">Blocked & Explained</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                The connection is dropped. The user sees a clear modal explaining the brand impersonation without fear-mongering jargon.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-slate-950 text-center">
        <div className="page-container max-w-xl space-y-4">
          <h3 className="text-2xl font-bold text-slate-100">Experience autonomous defense in action</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Test the live URL classifier with any suspicious link or explore the management console.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Button className="bg-blue-600 hover:bg-blue-500 text-white" asChild>
              <Link href="/#live-analyzer">Try Live URL Analyzer</Link>
            </Button>
            <Button variant="outline" className="border-slate-700 bg-slate-900/60" asChild>
              <Link href="/dashboard">View Dashboard</Link>
            </Button>
          </div>
        </div>
      </section>
    </PublicShell>
  )
}
