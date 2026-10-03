"use client"

import React, { useEffect, useRef, useState } from "react"
import { Shield, ShieldAlert, Radio, Crosshair, Zap, Activity, AlertTriangle, CheckCircle2, RefreshCw, Volume2, Info, HelpCircle } from "lucide-react"
import { useCyberTheme } from "@/lib/cyber-theme"
import { cyberAudio } from "@/lib/cyber-sound"
import { Button } from "@/components/ui/button"

interface ThreatBlip {
  id: string
  name: string
  lat: number // angle in rad
  radius: number // distance from center 0 to 1
  ip: string
  type: "BOTNET_SYN_FLOOD" | "HOMOGLYPH_HARVESTER" | "KERNEL_EBPF_EXPLOIT" | "RANSOMWARE_DAEMON" | "BRUTE_FORCE_SSH" | "SQLI_PROBE"
  cve: string
  severity: "CRITICAL" | "HIGH" | "MEDIUM"
  intercepted: boolean
  packetCount: number
  origin: string
  simpleDesc: string
}

const GLOBAL_NODES: ThreatBlip[] = [
  {
    id: "NODE-01",
    name: "SHANGHAI_EDGE_CLUSTER",
    lat: 0.85,
    radius: 0.72,
    ip: "103.242.112.44",
    type: "BOTNET_SYN_FLOOD",
    cve: "CVE-2026-41902",
    severity: "CRITICAL",
    intercepted: true,
    packetCount: 1420800,
    origin: "CN-SHANGHAI",
    simpleDesc: "Overload attack trying to slow down the network. Blocked at edge.",
  },
  {
    id: "NODE-02",
    name: "FRANKFURT_HOSTING_HOP",
    lat: 3.42,
    radius: 0.58,
    ip: "185.220.101.9",
    type: "KERNEL_EBPF_EXPLOIT",
    cve: "CVE-2026-11883",
    severity: "CRITICAL",
    intercepted: true,
    packetCount: 89400,
    origin: "DE-HESSE",
    simpleDesc: "Background program trying to gain device permissions. Quarantined.",
  },
  {
    id: "NODE-03",
    name: "ST_PETERSBURG_C2_RELAY",
    lat: 2.15,
    radius: 0.84,
    ip: "91.240.118.52",
    type: "RANSOMWARE_DAEMON",
    cve: "CVE-2026-38291",
    severity: "CRITICAL",
    intercepted: true,
    packetCount: 23140,
    origin: "RU-LEN",
    simpleDesc: "Malicious file encryption attempt. Blocked and memory rolled back.",
  },
  {
    id: "NODE-04",
    name: "SILICON_VALLEY_PROBE",
    lat: 4.88,
    radius: 0.65,
    ip: "198.51.100.73",
    type: "HOMOGLYPH_HARVESTER",
    cve: "CVE-2026-09214",
    severity: "HIGH",
    intercepted: true,
    packetCount: 12050,
    origin: "US-CA",
    simpleDesc: "Fake lookalike website trying to steal passwords. Null-routed.",
  },
  {
    id: "NODE-05",
    name: "SÃO_PAULO_VPN_EXIT",
    lat: 5.62,
    radius: 0.78,
    ip: "177.12.90.11",
    type: "BRUTE_FORCE_SSH",
    cve: "CVE-2025-9941",
    severity: "MEDIUM",
    intercepted: true,
    packetCount: 4500,
    origin: "BR-SP",
    simpleDesc: "Repeated password guessing bot. IP banned permanently.",
  },
  {
    id: "NODE-06",
    name: "TOKYO_ROUTER_INFECT",
    lat: 1.35,
    radius: 0.48,
    ip: "202.214.194.1",
    type: "SQLI_PROBE",
    cve: "CVE-2026-1502",
    severity: "MEDIUM",
    intercepted: true,
    packetCount: 8900,
    origin: "JP-TYO",
    simpleDesc: "Database injection vulnerability scanner. Dropped silently.",
  },
]

export function GlobalThreatRadar() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { theme } = useCyberTheme()
  const [selectedNode, setSelectedNode] = useState<ThreatBlip | null>(GLOBAL_NODES[0])
  const [threatCount, setThreatCount] = useState(14829)
  const [blockedCount, setBlockedCount] = useState(14829)
  const [radarSpeed, setRadarSpeed] = useState(1)
  const [isAttacking, setIsAttacking] = useState(false)
  const [showHelper, setShowHelper] = useState(false)

  // Trigger simulated adversary wave
  const triggerAdversarySurge = () => {
    setIsAttacking(true)
    cyberAudio.playAlert()
    setThreatCount((prev) => prev + 1240)
    setTimeout(() => {
      setBlockedCount((prev) => prev + 1240)
      setIsAttacking(false)
      cyberAudio.playSuccess()
    }, 1800)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let angle = 0
    let animationId: number

    // Dynamic responsive size calculation
    const updateSize = () => {
      const containerWidth = containerRef.current?.clientWidth || 360
      const size = Math.max(260, Math.min(containerWidth - 20, 520))
      canvas.width = size * 2
      canvas.height = size * 2
      canvas.style.width = `${size}px`
      canvas.style.height = `${size}px`
    }

    updateSize()
    window.addEventListener("resize", updateSize)

    // Palette per theme
    const getColors = () => {
      if (theme === "cyberpunk") {
        return {
          primary: "#00f0ff",
          secondary: "#ff007f",
          glow: "rgba(0, 240, 255, 0.4)",
          sweep: "rgba(0, 240, 255, 0.15)",
          grid: "rgba(0, 240, 255, 0.12)",
          ring: "rgba(0, 240, 255, 0.25)",
        }
      }
      if (theme === "redteam") {
        return {
          primary: "#ff003c",
          secondary: "#ffaa00",
          glow: "rgba(255, 0, 60, 0.4)",
          sweep: "rgba(255, 0, 60, 0.18)",
          grid: "rgba(255, 0, 60, 0.12)",
          ring: "rgba(255, 0, 60, 0.25)",
        }
      }
      if (theme === "ghost") {
        return {
          primary: "#e2e8f0",
          secondary: "#38bdf8",
          glow: "rgba(226, 232, 240, 0.4)",
          sweep: "rgba(226, 232, 240, 0.12)",
          grid: "rgba(226, 232, 240, 0.10)",
          ring: "rgba(226, 232, 240, 0.22)",
        }
      }
      return {
        primary: "#00ff66",
        secondary: "#00f0ff",
        glow: "rgba(0, 255, 102, 0.4)",
        sweep: "rgba(0, 255, 102, 0.15)",
        grid: "rgba(0, 255, 102, 0.10)",
        ring: "rgba(0, 255, 102, 0.25)",
      }
    }

    const packetArcs: { progress: number; node: ThreatBlip; speed: number }[] = GLOBAL_NODES.map((n) => ({
      progress: Math.random(),
      node: n,
      speed: 0.008 + Math.random() * 0.006,
    }))

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const cx = canvas.width / 2
      const cy = canvas.height / 2
      const maxRadius = cx * 0.88
      const colors = getColors()

      // 1. Radar Circular Background
      ctx.save()
      ctx.beginPath()
      ctx.arc(cx, cy, maxRadius, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(4, 8, 14, 0.95)"
      ctx.fill()
      ctx.strokeStyle = colors.ring
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.restore()

      // 2. Concentric Range Rings
      const rings = [0.25, 0.5, 0.75, 1.0]
      rings.forEach((r) => {
        ctx.beginPath()
        ctx.arc(cx, cy, maxRadius * r, 0, Math.PI * 2)
        ctx.strokeStyle = colors.grid
        ctx.lineWidth = 1
        ctx.setLineDash(r === 1.0 ? [] : [4, 4])
        ctx.stroke()
        ctx.setLineDash([])

        // Distance text
        ctx.font = `${Math.max(12, Math.round(canvas.width / 35))}px 'JetBrains Mono', monospace`
        ctx.fillStyle = colors.primary
        ctx.globalAlpha = 0.5
        ctx.fillText(`${Math.round(r * 5000)}KM`, cx + maxRadius * r - 35, cy - 4)
        ctx.globalAlpha = 1.0
      })

      // 3. Crosshairs
      ctx.beginPath()
      ctx.moveTo(cx - maxRadius, cy)
      ctx.lineTo(cx + maxRadius, cy)
      ctx.moveTo(cx, cy - maxRadius)
      ctx.lineTo(cx, cy + maxRadius)
      ctx.strokeStyle = colors.grid
      ctx.lineWidth = 1
      ctx.stroke()

      // 4. Sweep Arc
      angle += 0.02 * radarSpeed
      if (angle >= Math.PI * 2) angle -= Math.PI * 2

      ctx.save()
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, maxRadius, angle - 0.4, angle)
      ctx.closePath()
      ctx.fillStyle = colors.sweep
      ctx.fill()

      // Leading beam line
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.lineTo(cx + Math.cos(angle) * maxRadius, cy + Math.sin(angle) * maxRadius)
      ctx.strokeStyle = colors.primary
      ctx.lineWidth = 2.5
      ctx.shadowColor = colors.glow
      ctx.shadowBlur = 10
      ctx.stroke()
      ctx.restore()

      // 5. Draw Animated Packet Intercept Arcs
      packetArcs.forEach((p) => {
        p.progress += p.speed * radarSpeed
        if (p.progress > 1) p.progress = 0

        const nodeX = cx + Math.cos(p.node.lat) * (maxRadius * p.node.radius)
        const nodeY = cy + Math.sin(p.node.lat) * (maxRadius * p.node.radius)

        ctx.beginPath()
        ctx.moveTo(nodeX, nodeY)
        ctx.lineTo(cx, cy)
        ctx.strokeStyle = isAttacking ? "#ff003c" : "rgba(255, 255, 255, 0.08)"
        ctx.lineWidth = 1
        ctx.setLineDash([2, 4])
        ctx.stroke()
        ctx.setLineDash([])

        const curX = nodeX + (cx - nodeX) * p.progress
        const curY = nodeY + (cy - nodeY) * p.progress
        const distFromCenter = Math.sqrt((curX - cx) ** 2 + (curY - cy) ** 2)
        const isNearShield = distFromCenter < maxRadius * 0.28

        ctx.beginPath()
        ctx.arc(curX, curY, isNearShield ? 5 : 3.5, 0, Math.PI * 2)
        ctx.fillStyle = isNearShield ? colors.primary : p.node.severity === "CRITICAL" ? "#ff003c" : "#ffb800"
        ctx.shadowColor = isNearShield ? colors.glow : "#ff003c"
        ctx.shadowBlur = 6
        ctx.fill()
        ctx.shadowBlur = 0
      })

      // 6. Center Defense Core (AgeIS-X Neural Sentinel)
      ctx.beginPath()
      ctx.arc(cx, cy, 20, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(4, 6, 8, 0.95)"
      ctx.fill()
      ctx.strokeStyle = colors.primary
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(cx, cy, 7, 0, Math.PI * 2)
      ctx.fillStyle = colors.primary
      ctx.shadowColor = colors.glow
      ctx.shadowBlur = 12
      ctx.fill()
      ctx.shadowBlur = 0

      // 7. Render Threat Blip Nodes
      GLOBAL_NODES.forEach((node) => {
        const nx = cx + Math.cos(node.lat) * (maxRadius * node.radius)
        const ny = cy + Math.sin(node.lat) * (maxRadius * node.radius)
        const isSelected = selectedNode?.id === node.id

        // Blip outer reticle
        ctx.beginPath()
        ctx.arc(nx, ny, isSelected ? 11 : 6.5, 0, Math.PI * 2)
        ctx.strokeStyle = node.severity === "CRITICAL" ? "#ff003c" : isSelected ? colors.primary : colors.secondary
        ctx.lineWidth = isSelected ? 2 : 1
        ctx.stroke()

        // Inner solid dot
        ctx.beginPath()
        ctx.arc(nx, ny, isSelected ? 4.5 : 3, 0, Math.PI * 2)
        ctx.fillStyle = node.severity === "CRITICAL" ? "#ff003c" : colors.primary
        ctx.fill()

        // Label on radar
        ctx.font = `${Math.max(10, Math.round(canvas.width / 42))}px 'JetBrains Mono', monospace`
        ctx.fillStyle = isSelected ? colors.primary : "#94a3b8"
        ctx.fillText(node.name.split("_")[0], nx + 10, ny + 3)
      })

      animationId = requestAnimationFrame(render)
    }

    render()

    // Handle canvas click / touch to select node
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect()
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY

      const clickX = ((clientX - rect.left) / rect.width) * canvas.width
      const clickY = ((clientY - rect.top) / rect.height) * canvas.height

      const cx = canvas.width / 2
      const cy = canvas.height / 2
      const maxRadius = cx * 0.88

      GLOBAL_NODES.forEach((node) => {
        const nx = cx + Math.cos(node.lat) * (maxRadius * node.radius)
        const ny = cy + Math.sin(node.lat) * (maxRadius * node.radius)
        const dist = Math.sqrt((clickX - nx) ** 2 + (clickY - ny) ** 2)
        if (dist < 40) {
          setSelectedNode(node)
          cyberAudio.playSonar()
        }
      })
    }

    canvas.addEventListener("click", handlePointerDown as any)
    canvas.addEventListener("touchstart", handlePointerDown as any, { passive: true })

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", updateSize)
      canvas.removeEventListener("click", handlePointerDown as any)
      canvas.removeEventListener("touchstart", handlePointerDown as any)
    }
  }, [theme, selectedNode, radarSpeed, isAttacking])

  return (
    <div className="w-full border border-white/15 bg-[#03060a] p-4 sm:p-6 font-mono relative overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.9)]">
      {/* Top Header Row with Plain-English Explanation Helper */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 bg-[#00ff66] animate-ping rounded-none shrink-0" />
            <h3 className="text-sm sm:text-base font-extrabold text-[#f8fafc] tracking-wider uppercase flex items-center gap-2">
              <span>SIMULATED THREAT RADAR</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30">
                DEMO TELEMETRY
              </span>
            </h3>
          </div>
          <p className="text-xs text-[#94a3b8] font-sans">
            Interactive visualization demonstrating how the AgeIS-X defense shield neutralizes multi-stage cyber threats.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Plain English Guide Trigger */}
          <button
            onClick={() => {
              setShowHelper(!showHelper)
              cyberAudio.playKeyClick()
            }}
            className="px-2 py-1 border border-white/15 hover:border-white/30 text-[#7e8b9b] hover:text-white text-xs flex items-center gap-1"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#00f0ff]" />
            <span className="hidden sm:inline">How this works</span>
          </button>

          {/* Interactive Simulation Button */}
          <Button
            size="sm"
            onClick={triggerAdversarySurge}
            disabled={isAttacking}
            className="bg-[#ff003c]/20 hover:bg-[#ff003c]/40 text-[#ff003c] border border-[#ff003c]/50 font-mono text-xs uppercase min-h-[36px]"
          >
            <Zap className="w-3.5 h-3.5 mr-1 text-[#ff003c]" />
            {isAttacking ? "BLOCKING SURGE..." : "[ TEST ATTACK DEFENSE ]"}
          </Button>
        </div>
      </div>

      {/* Plain English Helper Banner */}
      {showHelper && (
        <div className="mb-6 p-4 border border-[#00f0ff]/30 bg-[#00f0ff]/5 text-xs text-[#e2e8f0] font-sans space-y-2 animate-fade-in">
          <div className="font-bold text-[#00f0ff] font-mono flex items-center gap-1.5">
            <Info className="w-4 h-4" />
            WHAT THIS RADAR SHOWS IN SIMPLE WORDS:
          </div>
          <p>
            • The green rings represent global distances around your defense hub.
          </p>
          <p>
            • The blinking red/yellow dots are active cyber threats detected globally (like phishing links, botnet floods, and password stealers).
          </p>
          <p>
            • The moving rays show attacks flying toward your perimeter and getting instantly neutralized by the central AgeIS-X defense shield.
          </p>
          <p className="text-[#00ff66] font-mono text-[11px] font-bold">
            👉 Tap any threat dot or use the buttons below to inspect how AgeIS-X isolates each threat!
          </p>
        </div>
      )}

      {/* Main Grid: Radar Canvas + Live Tactical Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Radar Canvas */}
        <div ref={containerRef} className="lg:col-span-7 flex flex-col items-center justify-center relative w-full">
          <div className="relative group cursor-pointer max-w-full flex justify-center">
            <canvas ref={canvasRef} className="rounded-full shadow-[0_0_40px_rgba(0,255,102,0.1)] max-w-full block" />

            {/* Floating Tag */}
            <div className="absolute top-2 left-2 text-[9px] sm:text-[10px] text-[#7e8b9b] bg-[#020408]/90 border border-white/10 px-2 py-1 pointer-events-none">
              <span className="text-[#00ff66] font-bold">360° LIVE RADAR</span> | SWEEP SPEED: {radarSpeed}X
            </div>
          </div>

          {/* Radar Speed Controls */}
          <div className="flex items-center gap-3 mt-4 text-[11px] text-[#7e8b9b]">
            <span>SWEEP SPEED:</span>
            {[0.5, 1, 2].map((s) => (
              <button
                key={s}
                onClick={() => {
                  setRadarSpeed(s)
                  cyberAudio.playKeyClick()
                }}
                className={`px-2.5 py-1 border text-xs min-h-[32px] ${
                  radarSpeed === s
                    ? "border-[#00ff66] text-[#00ff66] bg-[#00ff66]/10 font-bold"
                    : "border-white/10 hover:text-white"
                }`}
              >
                {s}X
              </button>
            ))}
          </div>
        </div>

        {/* Right Node Inspector Dossier */}
        <div className="lg:col-span-5 space-y-4 w-full">
          {/* Quick Counter Badges */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div className="p-3 border border-white/10 bg-[#060a10]">
              <span className="text-[10px] text-[#7e8b9b] uppercase block">TOTAL THREATS DETECTED</span>
              <span className="text-lg sm:text-xl font-extrabold text-[#f8fafc] font-mono tracking-tight">
                {threatCount.toLocaleString()}
              </span>
            </div>
            <div className="p-3 border border-[#00ff66]/30 bg-[#00ff66]/5">
              <span className="text-[10px] text-[#00ff66] uppercase block">AUTO-BLOCKED</span>
              <span className="text-lg sm:text-xl font-extrabold text-[#00ff66] font-mono tracking-tight flex items-center gap-1.5">
                {blockedCount.toLocaleString()}
                <CheckCircle2 className="w-4 h-4 text-[#00ff66]" />
              </span>
            </div>
          </div>

          {/* Selected Threat Target Dossier */}
          {selectedNode && (
            <div className="border border-white/15 bg-[#080d14] p-4 space-y-3 relative">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Crosshair className="w-4 h-4 text-[#ff003c] animate-pulse shrink-0" />
                  <span className="text-xs font-bold text-[#f8fafc] truncate">{selectedNode.name}</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 bg-[#ff003c]/20 text-[#ff003c] border border-[#ff003c]/40 font-bold shrink-0">
                  {selectedNode.severity}
                </span>
              </div>

              {/* Plain English Explanation Box */}
              <div className="p-2.5 bg-[#020408] border border-white/10 text-xs font-sans text-[#f8fafc] leading-relaxed">
                <span className="text-[#00ff66] font-mono font-bold block text-[10px] uppercase mb-0.5">// WHAT THIS ATTACK DOES:</span>
                {selectedNode.simpleDesc}
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between py-0.5 border-b border-white/5">
                  <span className="text-[#7e8b9b]">ATTACK TYPE:</span>
                  <span className="text-[#f8fafc] font-bold">{selectedNode.type}</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-white/5">
                  <span className="text-[#7e8b9b]">ADVERSARY IP:</span>
                  <span className="text-[#00f0ff] font-mono">{selectedNode.ip}</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-white/5">
                  <span className="text-[#7e8b9b]">LOCATION:</span>
                  <span className="text-[#f8fafc]">{selectedNode.origin}</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-[#7e8b9b]">DEFENSE STATUS:</span>
                  <span className="text-[#00ff66] font-bold">[ AUTOMATICALLY BLOCKED ]</span>
                </div>
              </div>

              {/* Easy-Tap Select Buttons for All Devices */}
              <div className="pt-2 border-t border-white/10">
                <span className="text-[10px] text-[#7e8b9b] block mb-1.5 uppercase">// TAP TO INSPECT ANY TARGET:</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {GLOBAL_NODES.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => {
                        setSelectedNode(n)
                        cyberAudio.playSonar()
                      }}
                      className={`text-[11px] p-2 border text-center truncate min-h-[36px] font-mono ${
                        selectedNode.id === n.id
                          ? "border-[#00ff66] bg-[#00ff66]/15 text-[#00ff66] font-bold shadow-[0_0_10px_rgba(0,255,102,0.2)]"
                          : "border-white/10 bg-[#040608] text-[#7e8b9b] hover:text-white"
                      }`}
                    >
                      {n.name.split("_")[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
