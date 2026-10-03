import React from "react"
import Link from "next/link"
import { PublicShell } from "@/components/layout/public-shell"
import { Button } from "@/components/ui/button"
import { Terminal, Cpu, Database, Network, Lock, Zap, Code2, Server, CheckCircle2 } from "lucide-react"

export default function TechnologyPage() {
  return (
    <PublicShell>
      {/* Header */}
      <section className="py-16 md:py-20 border-b border-slate-800/80 bg-slate-950">
        <div className="page-container max-w-4xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-mono">
            <span>Engineering & Architecture</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-100">
            The AgeIS-X Technology Stack
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            A transparent architectural breakdown of what is running in production today, what is in active development, and our long-term research roadmap.
          </p>
        </div>
      </section>

      {/* Layer 1: CURRENT PRODUCTION IMPLEMENTATION */}
      <section className="py-16 bg-slate-900/40 border-b border-slate-800/80">
        <div className="page-container space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div>
              <span className="text-[11px] font-mono uppercase text-emerald-400 font-bold block">
                Tier 1 • Operational Baseline
              </span>
              <h2 className="text-xl font-bold text-slate-100 mt-0.5">
                Current Production Implementation
              </h2>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded">
              Active in Ingestion API
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-slate-800 bg-slate-950/80 space-y-3">
              <div className="p-2 w-fit rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <Cpu className="w-5 h-5 stroke-[1.75]" />
              </div>
              <h3 className="text-sm font-semibold text-slate-100">TF-IDF Character N-Gram Vectorizer</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tokenizes uniform resource identifiers into sliding 3-gram to 5-gram substrings, capturing subtle brand impersonations, character substitutions, and obfuscated subdomains.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-800 bg-slate-950/80 space-y-3">
              <div className="p-2 w-fit rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Server className="w-5 h-5 stroke-[1.75]" />
              </div>
              <h3 className="text-sm font-semibold text-slate-100">FastAPI Asynchronous Microservice</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                High-performance Python/Uvicorn REST daemon serving the <code className="text-blue-400 font-mono text-[11px]">/predict</code> endpoint with sub-30ms execution and non-blocking IO.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-800 bg-slate-950/80 space-y-3">
              <div className="p-2 w-fit rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Code2 className="w-5 h-5 stroke-[1.75]" />
              </div>
              <h3 className="text-sm font-semibold text-slate-100">Deterministic Feature Extractor</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Extracts lexical flags including HTTPS protocol presence, suspicious keyword density, domain entropy, and redirect count.
              </p>
            </div>
          </div>

          {/* Code Spec for Ingestion API */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 font-semibold">Live Microservice Ingestion Protocol</span>
              <span className="text-slate-500">POST /predict</span>
            </div>
            <pre className="text-xs font-mono text-slate-300 p-4 bg-slate-900/80 rounded-lg border border-slate-800 overflow-x-auto leading-relaxed">
{`# Sample cURL Request to local or cluster daemon:
curl -X POST "http://127.0.0.1:8000/predict" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://secure-portal-verify.cc/login"}'

# Structured JSON Verdict Payload:
{
  "url": "https://secure-portal-verify.cc/login",
  "prediction": "malicious",
  "probability": 0.942,
  "features": {
    "has_https": true,
    "suspicious_keywords": true,
    "domain_age_days": 1
  },
  "latency_ms": 28.4
}`}
            </pre>
          </div>
        </div>
      </section>

      {/* Layer 2: PLANNED ARCHITECTURE */}
      <section className="py-16 bg-slate-950 border-b border-slate-800/80">
        <div className="page-container space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div>
              <span className="text-[11px] font-mono uppercase text-blue-400 font-bold block">
                Tier 2 • In Active Development
              </span>
              <h2 className="text-xl font-bold text-slate-100 mt-0.5">
                Planned System Architecture
              </h2>
            </div>
            <span className="text-xs font-mono text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded">
              Engineering Prototype
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-semibold text-slate-100">Sandboxed eBPF Probes (Linux / macOS)</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                In-kernel programs attached to kprobes and tracepoints to intercept unauthorized memory manipulations, raw socket binds, and ransomware bulk encryption syscalls.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-semibold text-slate-100">Zero-Knowledge Hardware Vault</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Local SQLite database encrypted with AES-256 GCM using keys stored in the platform Secure Enclave (Apple Silicon) or TPM 2.0 (Windows).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Layer 3: RESEARCH / FUTURE CAPABILITY */}
      <section className="py-16 bg-slate-900/30 border-b border-slate-800/80">
        <div className="page-container space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div>
              <span className="text-[11px] font-mono uppercase text-purple-400 font-bold block">
                Tier 3 • Long-Term Roadmap
              </span>
              <h2 className="text-xl font-bold text-slate-100 mt-0.5">
                Research & Future Capabilities
              </h2>
            </div>
            <span className="text-xs font-mono text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded">
              Academic & Threat Research
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl border border-slate-800 bg-slate-950/60 space-y-3">
              <h3 className="text-sm font-semibold text-slate-200">Decentralized Threat Hash Consensus</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Researching zero-knowledge peer-to-peer gossip protocols to synchronize newly neutralized threat hashes across global instances without centralized metadata tracking.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-800 bg-slate-950/60 space-y-3">
              <h3 className="text-sm font-semibold text-slate-200">Multi-Modal Synthetic Voice & Deepfake Classifier</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Investigating acoustic artifact detection for incoming VOIP calls and video streams to flag generative AI social engineering attempts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Action Footer */}
      <section className="py-16 bg-slate-950 text-center">
        <div className="page-container max-w-xl space-y-4">
          <h3 className="text-2xl font-bold text-slate-100">Inspect the live vector inference</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Test how the current lexical model scores URLs in real-time.
          </p>
          <Button className="bg-blue-600 hover:bg-blue-500 text-white" asChild>
            <Link href="/#live-analyzer">Try Ingestion Analyzer</Link>
          </Button>
        </div>
      </section>
    </PublicShell>
  )
}
