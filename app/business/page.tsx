import React from "react"
import Link from "next/link"
import { PublicShell } from "@/components/layout/public-shell"
import { Button } from "@/components/ui/button"
import { Building2, ShieldCheck, Users, Server, HardDrive, Key, ArrowRight, CheckCircle2 } from "lucide-react"

export default function BusinessPage() {
  return (
    <PublicShell>
      {/* Header */}
      <section className="py-16 md:py-20 border-b border-slate-800/80 bg-slate-950">
        <div className="page-container max-w-4xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-mono">
            <span>Enterprise & Fleet Orchestration</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-100">
            AgeIS-X for Organizations & Teams
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            The same zero-overhead autonomous security engine that protects personal workstations, scaled for fleet visibility, SIEM integration, and centralized policy enforcement.
          </p>
        </div>
      </section>

      {/* Fleet Capabilities Grid */}
      <section className="py-16 bg-slate-900/40 border-b border-slate-800/80">
        <div className="page-container space-y-8">
          <div className="max-w-2xl">
            <h2 className="text-xl font-bold text-slate-100">Fleet Security Architecture</h2>
            <p className="text-xs text-slate-400 mt-1">
              Engineered to fit into existing SecOps workflows without requiring heavy agent deployments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-slate-800 bg-slate-950/80 space-y-3">
              <div className="p-2 w-fit rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <Building2 className="w-5 h-5 stroke-[1.75]" />
              </div>
              <h3 className="text-sm font-semibold text-slate-100">Unified Posture Dashboard</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Aggregates fleet security scores, pending OS updates, and anomalous process executions into a centralized single-pane console.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-800 bg-slate-950/80 space-y-3">
              <div className="p-2 w-fit rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Server className="w-5 h-5 stroke-[1.75]" />
              </div>
              <h3 className="text-sm font-semibold text-slate-100">Real-Time SIEM & JSON Logs</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Stream raw audit events directly to Splunk, Datadog, or Elasticsearch with standardized CEF and JSON log formats.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-800 bg-slate-950/80 space-y-3">
              <div className="p-2 w-fit rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Key className="w-5 h-5 stroke-[1.75]" />
              </div>
              <h3 className="text-sm font-semibold text-slate-100">SAML 2.0 / OIDC Single Sign-On</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Integrate with Okta, Azure AD, or Google Workspace to automate agent provisioning and policy assignment per user group.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audiences */}
      <section className="py-16 bg-slate-950 border-b border-slate-800/80">
        <div className="page-container space-y-8">
          <div className="max-w-2xl">
            <h2 className="text-xl font-bold text-slate-100">Scalable Deployment Models</h2>
            <p className="text-xs text-slate-400 mt-1">
              Deployable across small developer teams to enterprise IT fleets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
              <h3 className="text-base font-semibold text-slate-100">Engineering & Tech Teams</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Developers frequently run raw code and interact with cloud APIs. AgeIS-X protects API credentials and shell environments without degrading compiler performance.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-300 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Zero CPU throttling on builds and tests</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Local credential vault and SSH key shielding</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
              <h3 className="text-base font-semibold text-slate-100">Enterprise & Distributed Fleets</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Equip remote and hybrid workforces with autonomous phishing, malicious link, and C2 malware protection without complicated VPN bottlenecks.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-300 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Silent MDM rollout via Jamf, Intune, or Ansible</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Role-based access delegation for tier-1 helpdesk</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-slate-900/30 text-center">
        <div className="page-container max-w-xl space-y-4">
          <h3 className="text-2xl font-bold text-slate-100">Inquire About Enterprise Pilot Deployment</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Speak with our engineering team to evaluate AgeIS-X for your organization.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Button className="bg-blue-600 hover:bg-blue-500 text-white" asChild>
              <Link href="/pricing">View Enterprise Tiers</Link>
            </Button>
            <Button variant="outline" className="border-slate-700 bg-slate-950" asChild>
              <Link href="/dashboard">View SecOps Console</Link>
            </Button>
          </div>
        </div>
      </section>
    </PublicShell>
  )
}
