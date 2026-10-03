"use client"

import * as React from "react"
import { RegistrationMark } from "./robot-pixel-sprites"
import { ShieldCheck, HelpCircle, Lock, Cpu } from "lucide-react"

const FAQ_ITEMS = [
  {
    q: "Is the Free Scout security unit time-limited or requiring a credit card?",
    a: "No. Unit 01 (SCOUT) is free forever with no credit card required. You receive core real-time URL vector scanning, domain intelligence, and threat diagnostics indefinitely.",
  },
  {
    q: "How does device allocation work across different operating systems?",
    a: "Your unit quota (1, 2, 5, or 10 devices) applies interchangeably across Windows 11, macOS (Apple Silicon / Intel), Linux distributions, and Chromium-based browser extensions with single-pane telemetry sync.",
  },
  {
    q: "Can I upgrade or transition between security units at any time?",
    a: "Yes. When you upgrade (e.g. from Guard to Sentinel or Aegis), your remaining billing period is automatically prorated and extra device tokens activate immediately without reinstalling your security client.",
  },
  {
    q: "What does 'supported where available' mean regarding threat features?",
    a: "We practice radical technical transparency. While URL heuristics, email parsing, and domain reputation work universally, low-level OS memory interception requires specific platform kernel capabilities (Windows 11 / modern macOS).",
  },
  {
    q: "Is my personal data or decrypted network payload sent to cloud servers?",
    a: "No. AgeIS-X runs heuristic and cryptographic vector evaluations locally on your device whenever possible. Only anonymized cryptographic threat hashes are checked against our global intelligence ledger.",
  },
]

export function RobotFaqAssurances() {
  return (
    <section className="relative w-full py-16 md:py-24 font-mono">
      <div className="space-y-4 mb-12">
        <div className="flex items-center gap-2 text-xs text-[#39FF14]">
          <span>05</span>
          <span className="text-white/20">/</span>
          <span className="text-[#A6A6A0] uppercase tracking-widest">
            TRANSPARENCY & ASSURANCES
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[#F1F0EB]">
            FREQUENT INQUIRIES
          </h2>
          <p className="text-xs sm:text-sm text-[#A6A6A0] font-sans max-w-md">
            No dark patterns, no surprise renewal hikes, no fake countdowns. Just direct engineering answers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Guarantees badge card */}
        <div className="lg:col-span-4 p-6 sm:p-7 bg-[#070707] border border-white/15 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#39FF14] text-xs font-bold uppercase">
              <ShieldCheck className="w-4 h-4" />
              <span>AGEIS-X INTEGRITY PLEDGE</span>
            </div>
            <h3 className="text-xl font-bold uppercase tracking-tight text-[#F1F0EB]">
              HONEST ARCHITECTURE
            </h3>
            <p className="text-xs text-[#A6A6A0] font-sans leading-relaxed">
              We engineer cybersecurity units, not predatory sales funnels. Every capability listed on this page is technically audited and verified.
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-white/10 text-xs">
            <div className="flex items-center gap-2 text-[#D4D4D0]">
              <span className="w-1.5 h-1.5 bg-[#39FF14]" />
              <span className="font-sans">No manipulative discount timers</span>
            </div>
            <div className="flex items-center gap-2 text-[#D4D4D0]">
              <span className="w-1.5 h-1.5 bg-[#39FF14]" />
              <span className="font-sans">No fake urgency or false scarcity</span>
            </div>
            <div className="flex items-center gap-2 text-[#D4D4D0]">
              <span className="w-1.5 h-1.5 bg-[#39FF14]" />
              <span className="font-sans">Transparent annual pricing in INR (₹)</span>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[10px] text-[#6F706D]">
            <span>AUDIT SPEC: 2026.4</span>
            <RegistrationMark size={10} />
          </div>
        </div>

        {/* Right Side: Accordion list */}
        <div className="lg:col-span-8 divide-y divide-white/10 border-t border-b border-white/10">
          {FAQ_ITEMS.map((item, idx) => (
            <div key={idx} className="py-6 space-y-2.5">
              <h4 className="text-sm sm:text-base font-bold text-[#F1F0EB] uppercase tracking-tight flex items-start gap-3">
                <span className="text-[#39FF14] text-xs mt-0.5">0{idx + 1}.</span>
                <span>{item.q}</span>
              </h4>
              <p className="text-xs sm:text-sm text-[#A6A6A0] font-sans leading-relaxed pl-7">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
