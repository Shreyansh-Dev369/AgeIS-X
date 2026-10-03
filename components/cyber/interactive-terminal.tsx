"use client"

import React, { useState, useRef, useEffect } from "react"
import { Terminal, Send, CheckCircle2, AlertTriangle, ShieldCheck, Zap, CornerDownLeft, Sparkles, Copy, HelpCircle } from "lucide-react"
import { useCyberTheme } from "@/lib/cyber-theme"
import { cyberAudio } from "@/lib/cyber-sound"
import { Button } from "@/components/ui/button"

interface TerminalLine {
  id: string
  type: "input" | "output" | "error" | "success" | "warning" | "system"
  text: string
  timestamp: string
}

const DEFAULT_HISTORY: TerminalLine[] = [
  {
    id: "init-1",
    type: "system",
    text: "AGEIS-X SECURITY INTELLIGENCE OS [KERNEL v6.12-SEC-RT]",
    timestamp: "00:00:01",
  },
  {
    id: "init-2",
    type: "system",
    text: "AUTONOMOUS THREAT INGESTION & DEFENSE DAEMON INITIALIZED. ALL ENCLAVES ATTESTED.",
    timestamp: "00:00:02",
  },
  {
    id: "init-3",
    type: "output",
    text: "💡 Tip: Tap any of the 1-click command buttons below or type 'help' to run security commands.",
    timestamp: "00:00:03",
  },
]

export function InteractiveTerminal() {
  const { theme, setTheme, toggleCrt, toggleMatrixRain, toggleAudio, setDefconLevel } = useCyberTheme()
  const [history, setHistory] = useState<TerminalLine[]>(DEFAULT_HISTORY)
  const [inputVal, setInputVal] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const getTimestamp = () => {
    const d = new Date()
    return d.toTimeString().split(" ")[0]
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [history])

  const executeCommand = async (rawCmd: string) => {
    const cmd = rawCmd.trim()
    if (!cmd) return

    cyberAudio.playKeyClick()
    const ts = getTimestamp()

    const userLine: TerminalLine = {
      id: `in-${Date.now()}`,
      type: "input",
      text: `ageis-x@sentinel:~$ ${cmd}`,
      timestamp: ts,
    }

    setHistory((prev) => [...prev, userLine])
    setInputVal("")
    setIsProcessing(true)

    const parts = cmd.split(" ")
    const command = parts[0].toLowerCase()
    const args = parts.slice(1).join(" ")

    await new Promise((r) => setTimeout(r, 100))

    let outputLines: TerminalLine[] = []

    switch (command) {
      case "help":
        outputLines = [
          {
            id: `out-${Date.now()}-1`,
            type: "output",
            text: "--- AGEIS-X TACTICAL COMMAND REFERENCE ---",
            timestamp: ts,
          },
          {
            id: `out-${Date.now()}-2`,
            type: "output",
            text: "  scan <target>     : Run deep neural threat analysis on a link/domain",
            timestamp: ts,
          },
          {
            id: `out-${Date.now()}-3`,
            type: "output",
            text: "  decrypt <hash>    : Quantum-resistant cryptographic hash decryption test",
            timestamp: ts,
          },
          {
            id: `out-${Date.now()}-4`,
            type: "output",
            text: "  trace <ip>        : Multi-hop internet route & threat isolation check",
            timestamp: ts,
          },
          {
            id: `out-${Date.now()}-5`,
            type: "output",
            text: "  exploit-db        : Live Zero-Day threat signatures & automated patch status",
            timestamp: ts,
          },
          {
            id: `out-${Date.now()}-6`,
            type: "output",
            text: "  posture           : Check device security health & active defense shields",
            timestamp: ts,
          },
          {
            id: `out-${Date.now()}-7`,
            type: "output",
            text: "  theme <mode>      : Switch theme: 'matrix' | 'cyberpunk' | 'redteam' | 'ghost'",
            timestamp: ts,
          },
          {
            id: `out-${Date.now()}-8`,
            type: "output",
            text: "  matrix            : Toggle Katakana matrix rain background",
            timestamp: ts,
          },
          {
            id: `out-${Date.now()}-9`,
            type: "output",
            text: "  crt               : Toggle retro CRT scanline filter",
            timestamp: ts,
          },
          {
            id: `out-${Date.now()}-10`,
            type: "output",
            text: "  clear             : Clear terminal screen",
            timestamp: ts,
          },
        ]
        break

      case "scan":
        const target = args || "secure-bank-login.xyz"
        outputLines = [
          {
            id: `out-${Date.now()}-1`,
            type: "warning",
            text: `[!] INGESTING TARGET: ${target}`,
            timestamp: ts,
          },
          {
            id: `out-${Date.now()}-2`,
            type: "output",
            text: `[*] Resolving DoH records & BGP ASNs... 185.220.101.9 (Flagged Server)`,
            timestamp: ts,
          },
          {
            id: `out-${Date.now()}-3`,
            type: "output",
            text: `[*] Fake Character Match: 4.82/5.00 [Russian Cyrillic 'а' substituted for Latin 'a']`,
            timestamp: ts,
          },
          {
            id: `out-${Date.now()}-4`,
            type: "error",
            text: `[ALERT] RESULT: MALICIOUS PHISHING LINK (99.4% Confidence)`,
            timestamp: ts,
          },
          {
            id: `out-${Date.now()}-5`,
            type: "success",
            text: `[DEFENSE ACTION] Connection terminated. Local DNS null-routed. Threat neutralized in 24ms.`,
            timestamp: ts,
          },
        ]
        cyberAudio.playAlert()
        break

      case "decrypt":
        const hash = args || "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8"
        outputLines = [
          {
            id: `out-${Date.now()}-1`,
            type: "output",
            text: `[+] TARGET HASH (SHA-256): ${hash.slice(0, 32)}...`,
            timestamp: ts,
          },
          {
            id: `out-${Date.now()}-2`,
            type: "output",
            text: `[*] Initializing Quantum-Resistant Rainbow Array [GPU Threads: 16,384]`,
            timestamp: ts,
          },
          {
            id: `out-${Date.now()}-3`,
            type: "output",
            text: `[*] Entropy matching byte block 0x7FFF... Completed in 38ms`,
            timestamp: ts,
          },
          {
            id: `out-${Date.now()}-4`,
            type: "success",
            text: `[+] PLAINTEXT DECRYPTED: "AgeIS-X//ZeroKnowledgeSec2026!"`,
            timestamp: ts,
          },
        ]
        cyberAudio.playSuccess()
        break

      case "trace":
        const ip = args || "198.51.100.24"
        outputLines = [
          {
            id: `out-${Date.now()}-1`,
            type: "output",
            text: `traceroute to ${ip}, 30 hops max, 52 byte packets:`,
            timestamp: ts,
          },
          {
            id: `out-${Date.now()}-2`,
            type: "output",
            text: "  1  gateway.ageis-mesh.local (10.0.0.1)    0.41 ms  (CLEAN)",
            timestamp: ts,
          },
          {
            id: `out-${Date.now()}-3`,
            type: "output",
            text: "  2  core-rtr01.ix-frankfurt.de (80.81.192.1) 4.28 ms  (TLS PINNED)",
            timestamp: ts,
          },
          {
            id: `out-${Date.now()}-4`,
            type: "warning",
            text: `  3  ${ip} [MALICIOUS SCAM HOST] 14.22 ms [ISOLATED BY AGEIS-X SHIELD]`,
            timestamp: ts,
          },
        ]
        cyberAudio.playSonar()
        break

      case "exploit-db":
        outputLines = [
          {
            id: `out-${Date.now()}-1`,
            type: "system",
            text: "=== LIVE ZERO-DAY & CVE THREAT INTELLIGENCE ===",
            timestamp: ts,
          },
          {
            id: `out-${Date.now()}-2`,
            type: "error",
            text: "[CRITICAL] CVE-2026-41902: Linux Kernel NetFilter eBPF Exploit -> AUTO-PATCHED",
            timestamp: ts,
          },
          {
            id: `out-${Date.now()}-3`,
            type: "warning",
            text: "[HIGH] CVE-2026-11883: Browser Cookie Memory Stealer -> CLOAKED (Enclave Protected)",
            timestamp: ts,
          },
          {
            id: `out-${Date.now()}-4`,
            type: "success",
            text: "[RESOLVED] CVE-2026-09214: Unicode Lookalike Phishing Campaign -> AUTO-BLOCKED",
            timestamp: ts,
          },
        ]
        cyberAudio.playSonar()
        break

      case "posture":
        outputLines = [
          {
            id: `out-${Date.now()}-1`,
            type: "success",
            text: "OVERALL SECURITY SCORE: 98 / 100 [MAXIMUM SECURITY LEVEL]",
            timestamp: ts,
          },
          {
            id: `out-${Date.now()}-2`,
            type: "output",
            text: "  [✓] Zero-Trust Web Shield        : ACTIVE (Phishing & scam links blocked)",
            timestamp: ts,
          },
          {
            id: `out-${Date.now()}-3`,
            type: "output",
            text: "  [✓] Hardware Enclave Keystore    : ACTIVE (Passwords & tokens encrypted)",
            timestamp: ts,
          },
          {
            id: `out-${Date.now()}-4`,
            type: "output",
            text: "  [✓] Endpoint System Guard        : ACTIVE (Malware background processes killed)",
            timestamp: ts,
          },
        ]
        cyberAudio.playSuccess()
        break

      case "theme":
        const validThemes = ["matrix", "cyberpunk", "redteam", "ghost"]
        const targetTheme = args.toLowerCase() as any
        if (validThemes.includes(targetTheme)) {
          setTheme(targetTheme)
          outputLines = [
            {
              id: `out-${Date.now()}-1`,
              type: "success",
              text: `[+] THEME SWITCHED TO: [ ${targetTheme.toUpperCase()} ]`,
              timestamp: ts,
            },
          ]
        } else {
          outputLines = [
            {
              id: `out-${Date.now()}-1`,
              type: "error",
              text: "Available themes: 'matrix', 'cyberpunk', 'redteam', 'ghost'",
              timestamp: ts,
            },
          ]
        }
        break

      case "matrix":
        toggleMatrixRain()
        outputLines = [
          {
            id: `out-${Date.now()}-1`,
            type: "output",
            text: "[*] Matrix rain background toggled.",
            timestamp: ts,
          },
        ]
        break

      case "crt":
        toggleCrt()
        outputLines = [
          {
            id: `out-${Date.now()}-1`,
            type: "output",
            text: "[*] CRT scanline effect toggled.",
            timestamp: ts,
          },
        ]
        break

      case "clear":
        setHistory([])
        setIsProcessing(false)
        return

      default:
        outputLines = [
          {
            id: `out-${Date.now()}-1`,
            type: "error",
            text: `Command not recognized: '${command}'. Type 'help' or tap the buttons below.`,
            timestamp: ts,
          },
        ]
        break
    }

    setHistory((prev) => [...prev, ...outputLines])
    setIsProcessing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeCommand(inputVal)
    }
  }

  const quickCommands = [
    { label: "🔍 Scan Fake Link", cmd: "scan paypal-update.xyz" },
    { label: "🛡️ Check Security Posture", cmd: "posture" },
    { label: "⚡ Live Threat Intel", cmd: "exploit-db" },
    { label: "🔓 Decrypt Hash", cmd: "decrypt 5e884898" },
    { label: "🌐 Trace Network Route", cmd: "trace 198.51.100.24" },
    { label: "🎨 Neon Theme", cmd: "theme cyberpunk" },
    { label: "❓ Help Menu", cmd: "help" },
  ]

  return (
    <div className="w-full border border-white/15 bg-[#020408] p-4 sm:p-6 font-mono relative overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.9)]">
      {/* Top Terminal Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff003c]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffb800]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#00ff66]" />
          </div>
          <Terminal className="w-4 h-4 text-[#00ff66]" />
          <span className="text-xs sm:text-sm font-bold text-[#f8fafc] tracking-wider uppercase">
            AGEIS-X TACTICAL COMMAND SHELL
          </span>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-[#7e8b9b]">
          <span className="px-1.5 py-0.5 border border-[#00ff66]/30 text-[#00ff66] bg-[#00ff66]/10">
            SECURE SANDBOX
          </span>
          <button
            onClick={() => {
              setHistory([])
              cyberAudio.playKeyClick()
            }}
            className="px-2 py-0.5 border border-white/10 hover:border-white/30 text-[#7e8b9b] hover:text-white"
          >
            CLEAR
          </button>
        </div>
      </div>

      {/* 1-Tap Command Buttons for Touchscreens & Mobile Users */}
      <div className="mb-3 space-y-1">
        <span className="text-[10px] text-[#7e8b9b] uppercase block font-bold">// 1-TAP EXECUTIONS (MOBILE &amp; DESKTOP):</span>
        <div className="flex flex-wrap gap-1.5">
          {quickCommands.map((item) => (
            <button
              key={item.cmd}
              onClick={() => executeCommand(item.cmd)}
              className="px-2.5 py-1.5 border border-white/15 bg-[#060a10] hover:border-[#00ff66]/60 hover:text-[#00ff66] text-[#e2e8f0] text-xs transition-colors min-h-[34px] flex items-center gap-1 font-mono"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Terminal Output Stream */}
      <div className="h-64 sm:h-72 overflow-y-auto space-y-1.5 text-xs p-3 bg-[#010204] border border-white/10 font-mono scrollbar-thin">
        {history.map((line) => {
          let colorClass = "text-[#f8fafc]"
          if (line.type === "input") colorClass = "text-[#00f0ff] font-bold"
          else if (line.type === "system") colorClass = "text-[#ffb800]"
          else if (line.type === "error") colorClass = "text-[#ff003c] font-bold"
          else if (line.type === "success") colorClass = "text-[#00ff66] font-bold"
          else if (line.type === "warning") colorClass = "text-[#ff9900]"

          return (
            <div key={line.id} className={`flex items-start gap-2 leading-relaxed ${colorClass}`}>
              <span className="text-[#7e8b9b] text-[10px] select-none opacity-50 shrink-0">
                [{line.timestamp}]
              </span>
              <span className="break-all whitespace-pre-wrap">{line.text}</span>
            </div>
          )
        })}
        {isProcessing && (
          <div className="flex items-center gap-2 text-[#00ff66] text-xs">
            <span className="animate-spin text-xs">⠋</span>
            <span>Executing command...</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Command Input Row */}
      <div className="flex items-center gap-2 mt-3 pt-2 border-t border-white/10">
        <span className="text-[#00ff66] font-bold text-xs select-none shrink-0 hidden xs:inline">
          ageis-x@sentinel:~$
        </span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type command or tap a button above..."
          className="flex-1 bg-transparent text-[#f8fafc] text-xs font-mono outline-none border border-white/10 px-2 py-1.5 placeholder:text-[#7e8b9b]/50 min-h-[38px] focus:border-[#00ff66]"
        />
        <Button
          size="sm"
          onClick={() => executeCommand(inputVal)}
          className="bg-[#00ff66] hover:bg-[#39ff14] text-[#040608] font-bold text-xs px-4 min-h-[38px] uppercase font-mono shrink-0"
        >
          <Send className="w-3.5 h-3.5 mr-1" />
          EXEC
        </Button>
      </div>
    </div>
  )
}
