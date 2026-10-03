"use client"

import React, { useState, useEffect } from "react"
import { Volume2, VolumeX, Tv, Terminal, Shield, Activity, Sparkles, RefreshCw, Zap, SlidersHorizontal, ChevronDown } from "lucide-react"
import { useCyberTheme, CyberThemeMode, DefconLevel } from "@/lib/cyber-theme"
import { cyberAudio } from "@/lib/cyber-sound"

export function TacticalHudBar() {
  const {
    theme,
    setTheme,
    crtScanlines,
    toggleCrt,
    matrixRain,
    toggleMatrixRain,
    audioEnabled,
    toggleAudio,
    defconLevel,
    setDefconLevel,
  } = useCyberTheme()

  const timeRef = React.useRef<HTMLSpanElement>(null)
  const [mobileHudOpen, setMobileHudOpen] = useState(false)

  useEffect(() => {
    let animationFrameId: number
    const updateTime = () => {
      if (timeRef.current) {
        const now = new Date()
        const utc = now.toUTCString().split(" ")[4] || "00:00:00"
        const ms = String(now.getUTCMilliseconds()).padStart(3, "0")
        timeRef.current.textContent = `${utc}.${ms} UTC`
      }
      animationFrameId = requestAnimationFrame(updateTime)
    }
    animationFrameId = requestAnimationFrame(updateTime)
    return () => cancelAnimationFrame(animationFrameId)
  }, [])

  const themes: { id: CyberThemeMode; label: string; name: string; color: string }[] = [
    { id: "matrix", label: "MATRIX", name: "Phosphor Green", color: "#00ff66" },
    { id: "cyberpunk", label: "CYBER", name: "Neon Cyan", color: "#00f0ff" },
    { id: "redteam", label: "REDTEAM", name: "Alert Red", color: "#ff003c" },
    { id: "ghost", label: "GHOST", name: "Stealth Silver", color: "#e2e8f0" },
  ]

  const defcons: { lvl: DefconLevel; label: string; desc: string }[] = [
    { lvl: 5, label: "D5", desc: "Nominal Defense (Standard Security)" },
    { lvl: 4, label: "D4", desc: "Elevated Watch (Active Scanning)" },
    { lvl: 3, label: "D3", desc: "Heightened Alert (Strict Isolation)" },
    { lvl: 2, label: "D2", desc: "Armed Quarantine (Suspicious Vectors Blocked)" },
    { lvl: 1, label: "D1", desc: "War Room Lockdown (Max Zero-Trust)" },
  ]

  return (
    <div className="w-full bg-[#020407] border-b border-white/15 py-1.5 px-3 sm:px-6 font-mono text-[11px] select-none text-[#7e8b9b] relative z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Left: System Attestation & Time */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="flex items-center gap-1.5 shrink-0">
            <span
              className={`w-2 h-2 rounded-none animate-pulse shrink-0 ${
                defconLevel <= 2 ? "bg-[#ff003c]" : "bg-[#00ff66]"
              }`}
            />
            <span className="text-[#f8fafc] font-bold tracking-wider text-[10px] sm:text-xs truncate">
              AGEIS-X
            </span>
            <span className="hidden sm:inline text-[#00ff66] text-[10px] px-1 py-0.2 border border-[#00ff66]/30 bg-[#00ff66]/10">
              SHIELDS ARMED
            </span>
          </div>
          <span className="text-white/20 hidden md:inline">|</span>
          <span ref={timeRef} className="text-[#00f0ff] font-mono text-[10px] sm:text-[11px] hidden xs:inline truncate">
            00:00:00.000 UTC
          </span>
        </div>

        {/* Center Desktop: DEFCON Readiness Selector with Explanatory Tooltip */}
        <div className="hidden lg:flex items-center gap-2">
          <span className="uppercase text-[#7e8b9b] text-[10px]">DEFCON:</span>
          <div className="flex items-center gap-1">
            {defcons.map(({ lvl, label, desc }) => {
              const isSelected = defconLevel === lvl
              let colorClass = "border-white/10 text-[#7e8b9b] hover:text-white"
              if (isSelected) {
                if (lvl === 1) colorClass = "border-[#ff003c] bg-[#ff003c] text-black font-extrabold shadow-[0_0_10px_#ff003c]"
                else if (lvl === 2) colorClass = "border-[#ff6b00] bg-[#ff6b00] text-black font-extrabold"
                else if (lvl === 3) colorClass = "border-[#ffb800] bg-[#ffb800] text-black font-extrabold"
                else colorClass = "border-[#00ff66] bg-[#00ff66] text-black font-extrabold"
              }
              return (
                <button
                  key={lvl}
                  onClick={() => setDefconLevel(lvl)}
                  title={`DEFCON ${lvl}: ${desc}`}
                  className={`px-1.5 py-0.5 border text-[10px] transition-all min-w-[24px] ${colorClass}`}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Right Desktop: Theme + CRT + Audio + Matrix controls */}
        <div className="hidden md:flex items-center gap-2">
          {/* Theme switcher */}
          <div className="flex items-center gap-1">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                title={`Switch visual theme to ${t.name}`}
                className={`px-1.5 py-0.5 border transition-all text-[10px] ${
                  theme === t.id
                    ? "border-white/50 text-white font-bold bg-white/10"
                    : "border-white/10 text-[#7e8b9b] hover:text-white"
                }`}
                style={{
                  borderColor: theme === t.id ? t.color : undefined,
                  color: theme === t.id ? t.color : undefined,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          <span className="text-white/20">|</span>

          {/* CRT Toggle */}
          <button
            onClick={toggleCrt}
            title={crtScanlines ? "Turn OFF Retro Scanlines" : "Turn ON Retro Scanlines"}
            className={`px-1.5 py-0.5 border text-[10px] flex items-center gap-1 ${
              crtScanlines
                ? "border-[#00ff66] text-[#00ff66] bg-[#00ff66]/10"
                : "border-white/10 text-[#7e8b9b] hover:text-white"
            }`}
          >
            <Tv className="w-2.5 h-2.5" />
            <span>CRT</span>
          </button>

          {/* Matrix Toggle */}
          <button
            onClick={toggleMatrixRain}
            title={matrixRain ? "Turn OFF Matrix Rain" : "Turn ON Matrix Rain"}
            className={`px-1.5 py-0.5 border text-[10px] flex items-center gap-1 ${
              matrixRain
                ? "border-[#00ff66] text-[#00ff66] bg-[#00ff66]/10"
                : "border-white/10 text-[#7e8b9b] hover:text-white"
            }`}
          >
            <Sparkles className="w-2.5 h-2.5" />
            <span>RAIN</span>
          </button>

          {/* Audio Toggle */}
          <button
            onClick={toggleAudio}
            title={audioEnabled ? "Mute Cyber Audio Feedback" : "Enable Cyber Audio Feedback"}
            className={`px-1.5 py-0.5 border text-[10px] flex items-center gap-1 ${
              audioEnabled
                ? "border-[#00ff66] text-[#00ff66] bg-[#00ff66]/10"
                : "border-white/10 text-[#7e8b9b] hover:text-white"
            }`}
          >
            {audioEnabled ? (
              <>
                <Volume2 className="w-2.5 h-2.5" />
                <span>AUDIO</span>
              </>
            ) : (
              <>
                <VolumeX className="w-2.5 h-2.5" />
                <span>MUTE</span>
              </>
            )}
          </button>
        </div>

        {/* Mobile / Tablet Quick HUD Controls Trigger */}
        <div className="flex md:hidden items-center gap-1.5">
          {/* Quick Sound Toggle for Mobile */}
          <button
            onClick={toggleAudio}
            className={`p-1.5 border text-[10px] flex items-center justify-center ${
              audioEnabled ? "border-[#00ff66] text-[#00ff66] bg-[#00ff66]/10" : "border-white/15 text-[#7e8b9b]"
            }`}
            title="Toggle Sound"
          >
            {audioEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
          </button>

          {/* Mobile HUD Options Dropdown Trigger */}
          <button
            onClick={() => {
              setMobileHudOpen(!mobileHudOpen)
              cyberAudio.playKeyClick()
            }}
            className="px-2 py-1 border border-white/20 bg-[#060a10] text-[#f8fafc] text-[10px] flex items-center gap-1 font-bold"
          >
            <SlidersHorizontal className="w-2.5 h-2.5 text-[#00ff66]" />
            <span>HUD SETTINGS</span>
            <ChevronDown className={`w-2.5 h-2.5 transition-transform ${mobileHudOpen ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile HUD Expanded Control Drawer */}
      {mobileHudOpen && (
        <div className="md:hidden mt-2 pt-2 border-t border-white/10 space-y-3 animate-fade-in text-[11px] pb-1">
          {/* Mobile Theme Selection */}
          <div>
            <span className="text-[10px] text-[#7e8b9b] uppercase block mb-1">THEME STYLE:</span>
            <div className="grid grid-cols-4 gap-1">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id)
                    cyberAudio.playKeyClick()
                  }}
                  className={`py-1 px-1 border text-center text-[10px] font-bold ${
                    theme === t.id
                      ? "border-white text-white bg-white/15"
                      : "border-white/10 text-[#7e8b9b]"
                  }`}
                  style={{
                    borderColor: theme === t.id ? t.color : undefined,
                    color: theme === t.id ? t.color : undefined,
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile DEFCON Selection */}
          <div>
            <span className="text-[10px] text-[#7e8b9b] uppercase block mb-1">SECURITY LEVEL (DEFCON):</span>
            <div className="grid grid-cols-5 gap-1">
              {defcons.map(({ lvl, label }) => {
                const isSelected = defconLevel === lvl
                return (
                  <button
                    key={lvl}
                    onClick={() => {
                      setDefconLevel(lvl)
                      cyberAudio.playKeyClick()
                    }}
                    className={`py-1 border text-center text-[10px] font-bold ${
                      isSelected
                        ? lvl <= 2
                          ? "border-[#ff003c] bg-[#ff003c] text-black"
                          : "border-[#00ff66] bg-[#00ff66] text-black"
                        : "border-white/10 text-[#7e8b9b]"
                    }`}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Mobile Visual FX Toggles */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              onClick={toggleCrt}
              className={`flex-1 py-1 border text-center text-[10px] flex items-center justify-center gap-1 ${
                crtScanlines ? "border-[#00ff66] text-[#00ff66] bg-[#00ff66]/10" : "border-white/10 text-[#7e8b9b]"
              }`}
            >
              <Tv className="w-2.5 h-2.5" />
              <span>SCANLINES: {crtScanlines ? "ON" : "OFF"}</span>
            </button>

            <button
              onClick={toggleMatrixRain}
              className={`flex-1 py-1 border text-center text-[10px] flex items-center justify-center gap-1 ${
                matrixRain ? "border-[#00ff66] text-[#00ff66] bg-[#00ff66]/10" : "border-white/10 text-[#7e8b9b]"
              }`}
            >
              <Sparkles className="w-2.5 h-2.5" />
              <span>MATRIX: {matrixRain ? "ON" : "OFF"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
