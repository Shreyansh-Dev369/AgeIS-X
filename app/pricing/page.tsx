import React from "react"
import Link from "next/link"
import { PublicShell } from "@/components/layout/public-shell"
import { Button } from "@/components/ui/button"
import { Check, ShieldCheck, HelpCircle } from "lucide-react"

const pricingTiers = [
  {
    name: "Community / Free",
    badge: "Available Now",
    price: "$0",
    period: "Free Forever",
    description: "Core real-time URL vector analyzer, link inspection, and browser companion for individuals.",
    features: [
      "Real-time URL & phishing vector scanner",
      "Interactive threat analysis diagnostics",
      "Browser security companion (Chrome/Brave)",
      "Local credential breach database checks",
      "Public community threat hash updates",
    ],
    cta: "Start Free",
    href: "/download",
    highlight: false,
  },
  {
    name: "Personal Pro",
    badge: "Public Beta",
    price: "$12",
    period: "per month ($99 billed annually)",
    description: "Full autonomous protection across personal workstations, mobile devices, and credential vaults.",
    features: [
      "Everything in Community",
      "Full desktop agent (macOS & Windows)",
      "Kernel-level memory and syscall defense",
      "Automated malicious socket & C2 traps",
      "Up to 5 protected personal devices",
      "Continuous dark web identity exposure watch",
      "Encrypted local vector cache",
    ],
    cta: "Join Pro Beta",
    href: "/signup",
    highlight: true,
  },
  {
    name: "Fleet & Enterprise",
    badge: "Custom Inquiry",
    price: "Custom",
    period: "tailored to fleet size",
    description: "Centralized policy delegation, SIEM log streaming, SAML SSO, and dedicated SLA response.",
    features: [
      "Everything in Personal Pro",
      "Centralized SecOps fleet posture console",
      "Real-time SIEM log streaming (JSON / Splunk)",
      "SAML 2.0 / Okta / Azure AD single sign-on",
      "Automated MDM deployment (Jamf / Intune)",
      "Dedicated sovereign tenant option",
      "Custom threat vector tuning & SLA",
    ],
    cta: "Contact Enterprise",
    href: "/business",
    highlight: false,
  },
]

export default function PricingPage() {
  return (
    <PublicShell>
      {/* Header */}
      <section className="py-16 md:py-20 border-b border-slate-800/80 bg-slate-950">
        <div className="page-container max-w-4xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-mono">
            <span>Transparent Licensing</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-100">
            Simple, Predictable Security Pricing
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Protect your digital perimeter with straightforward plans. No manipulative countdown timers, hidden add-ons, or surprise price hikes.
          </p>
        </div>
      </section>

      {/* Cards Grid */}
      <section className="py-16 bg-slate-900/40 border-b border-slate-800/80">
        <div className="page-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingTiers.map((tier, idx) => (
              <div
                key={idx}
                className={`rounded-xl border p-6 flex flex-col justify-between ${
                  tier.highlight
                    ? "border-blue-500/80 bg-slate-900/90 shadow-xl relative"
                    : "border-slate-800 bg-slate-950/80"
                }`}
              >
                {tier.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-blue-600 text-[10px] font-mono font-semibold uppercase tracking-wider text-white">
                    Recommended
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="text-base font-bold text-slate-100">{tier.name}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {tier.badge}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mb-5 leading-relaxed">{tier.description}</p>

                  <div className="mb-6 pb-4 border-b border-slate-800">
                    <span className="text-3xl font-bold font-mono text-slate-100">{tier.price}</span>
                    <span className="text-xs text-slate-400 ml-2 font-mono">{tier.period}</span>
                  </div>

                  <div className="space-y-2.5 mb-6 text-xs text-slate-300">
                    <span className="text-[11px] font-mono uppercase text-slate-500 block mb-2 font-semibold">
                      What&apos;s Included:
                    </span>
                    {tier.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80">
                  <Button
                    className={`w-full ${
                      tier.highlight
                        ? "bg-blue-600 hover:bg-blue-500 text-white"
                        : "border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200"
                    }`}
                    variant={tier.highlight ? "default" : "outline"}
                    asChild
                  >
                    <Link href={tier.href}>{tier.cta}</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Frequently Answered Questions */}
      <section className="py-16 bg-slate-950">
        <div className="page-container max-w-3xl space-y-8">
          <div className="text-center">
            <h2 className="text-xl font-bold text-slate-100">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 space-y-1.5">
              <h4 className="font-semibold text-slate-200">How does the Free tier work?</h4>
              <p className="text-slate-400 leading-relaxed">
                The Community Free tier gives you full access to the real-time URL threat vector analyzer, link inspections, and browser companion without credit card requirements.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 space-y-1.5">
              <h4 className="font-semibold text-slate-200">Can I deploy AgeIS-X across multiple operating systems on one plan?</h4>
              <p className="text-slate-400 leading-relaxed">
                Yes. Personal Pro licenses allow you to enroll up to 5 devices across macOS and Windows using a single unified security account.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 space-y-1.5">
              <h4 className="font-semibold text-slate-200">Does AgeIS-X sell or monetize telemetry data?</h4>
              <p className="text-slate-400 leading-relaxed">
                Never. AgeIS-X operates on a direct software license model. Our zero-knowledge architecture ensures your private browsing telemetry remains on your hardware.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  )
}
