"use client"

import React, { useState } from "react"
import { Shield, Lock, Terminal, Cpu, Zap, Eye, Crosshair, ArrowUpRight, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react"
import { cyberAudio } from "@/lib/cyber-sound"
import { useCyberTheme } from "@/lib/cyber-theme"

const HACKER_BADGES = [
  {
    id: "access",
    title: "> ACCESS GRANTED",
    subtitle: "Hardware Enclave Auth",
    plainText: "Only your biometric fingerprint or face can unlock your private passwords.",
    tag: "AUTH_PASS",
    icon: "🔓",
    color: "#00ff66",
    code: "200_OK_ATTESTED",
  },
  {
    id: "nmap",
    title: "nmap -sS -O target",
    subtitle: "Stealth Port Shield",
    plainText: "Closes all open network ports so hackers cannot find your device online.",
    tag: "STEALTH",
    icon: "📡",
    color: "#00f0ff",
    code: "0_PORTS_EXPOSED",
  },
  {
    id: "encryption",
    title: "ENCRYPTION IS FREEDOM",
    subtitle: "Military-Grade Cipher",
    plainText: "Your private files are locked with AES-256 encryption that even supercomputers cannot crack.",
    tag: "ENCRYPTION",
    icon: "🔒",
    color: "#00ff66",
    code: "QUANTUM_RESISTANT",
  },
  {
    id: "zerotrust",
    title: "TRUST NO ONE",
    subtitle: "Zero-Trust Architecture",
    plainText: "Never assumes any program or link is safe until it is cryptographically verified.",
    tag: "SECURITY",
    icon: "🛡️",
    color: "#ffb800",
    code: "NEVER_TRUST_ALWAYS_VERIFY",
  },
  {
    id: "lockup",
    title: "KEEP YOUR DATA. LOCK IT UP.",
    subtitle: "Zero-Knowledge Storage",
    plainText: "Your personal photos and browsing history are never uploaded to any cloud servers.",
    tag: "PRIVACY",
    icon: "💚",
    color: "#00ff66",
    code: "NO_TELEMETRY_EXFIL",
  },
  {
    id: "ducky",
    title: "STAY CURIOUS // USB SHIELD",
    subtitle: "BadUSB & Hardware Guard",
    plainText: "Blocks infected USB cables or flash drives from running keystroke injection scripts.",
    tag: "HARDWARE",
    icon: "🦆",
    color: "#ff003c",
    code: "BADUSB_NEUTRALIZED",
  },
]

export function TacticalArsenalShowcase() {
  const [activeBadge, setActiveBadge] = useState<string>("access")
  const [isFaceTracked, setIsFaceTracked] = useState(true)
  const [isLightOn, setIsLightOn] = useState(true)
  const { triggerGlitch } = useCyberTheme()

  const currentBadgeData = HACKER_BADGES.find((b) => b.id === activeBadge) || HACKER_BADGES[0]

  return (
    <div className="w-full space-y-8 sm:space-y-12 font-mono text-xs">
      {/* 1. TECHWEAR OPERATOR // TACTICAL SPECIFICATION */}
      <div className="border border-white/15 bg-[#020408] p-4 sm:p-8 relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.9)]">
        {/* Top Barcode Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-6">
          <span className="text-[10px] text-[#00ff66] font-bold tracking-wider">
            [ SOVEREIGN HARDWARE DEFENSE ]
          </span>
          <span className="text-[10px] text-[#7e8b9b] hidden xs:inline">
            ║▌║▌║█│▌║ AGEIS-X TACTICAL
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          {/* Left Operator Image with Dynamic Target HUD */}
          <div className="lg:col-span-6 relative group w-full">
            <div className="relative border border-white/20 bg-[#000000] overflow-hidden aspect-[4/5] sm:max-h-[460px] w-full flex items-center justify-center">
              <img
                src="/assets/cyber/techwear-soldier.jpg"
                alt="Tactical Cyber Security Guard"
                className="w-full h-full object-cover object-center filter contrast-125 brightness-90 grayscale group-hover:grayscale-0 transition-all duration-700"
              />

              {/* Barcode & Header Label */}
              <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-20 pointer-events-none">
                <div className="text-2xl sm:text-4xl font-extrabold text-white tracking-tighter uppercase leading-none">
                  GRID<br />
                  <span className="text-[#00ff66]">PACK_</span>
                </div>
                <div className="text-[9px] sm:text-[10px] text-[#7e8b9b] tracking-widest mt-1">
                  SOVEREIGN HARDWARE INTEGRITY
                </div>
              </div>

              {/* Interactive Target Reticle Box */}
              {isFaceTracked && (
                <div className="absolute top-[22%] right-[26%] w-24 h-28 sm:w-32 sm:h-36 border-2 border-[#00ff66] shadow-[0_0_20px_rgba(0,255,102,0.4)] pointer-events-none animate-pulse">
                  <div className="absolute -top-3.5 -left-1 text-[8px] sm:text-[9px] bg-[#00ff66] text-black px-1 font-bold">
                    SYSTEM LOCKED
                  </div>
                  <div className="absolute -bottom-4.5 -right-1 text-[8px] sm:text-[9px] bg-black/80 text-[#00ff66] border border-[#00ff66] px-1">
                    ATTESTED
                  </div>
                  <div className="absolute inset-0 bg-[#00ff66]/5" />
                </div>
              )}
            </div>

            {/* Reticle Toggle Button */}
            <div className="flex items-center justify-between mt-2.5 text-[11px] text-[#7e8b9b]">
              <span>STATUS: <span className="text-[#00ff66] font-bold">DEFENSES ACTIVE</span></span>
              <button
                onClick={() => {
                  setIsFaceTracked(!isFaceTracked)
                  cyberAudio.playSonar()
                }}
                className="px-2.5 py-1 border border-white/15 hover:border-[#00ff66] hover:text-[#00ff66] text-[10px] min-h-[30px]"
              >
                {isFaceTracked ? "[ HIDE TARGET BOX ]" : "[ SHOW TARGET BOX ]"}
              </button>
            </div>
          </div>

          {/* Right Plain English Technical Specifications */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-5">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 text-[11px] text-[#00ff66] font-bold uppercase tracking-widest">
                <span>* WHAT MAKES AGEIS-X DIFFERENT</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#f8fafc] tracking-tight uppercase leading-[1.08]">
                BUILT LIKE BODY ARMOR.<br />
                <span className="text-[#00ff66]">FOR YOUR DIGITAL LIFE.</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#94a3b8] font-sans leading-relaxed">
                Most antivirus apps slow down your device and upload your private browsing history. AgeIS-X runs locally in your device&apos;s secure hardware enclave with zero lag and zero surveillance.
              </p>
            </div>

            {/* Easy-to-understand Spec Sheet */}
            <div className="space-y-2 border-t border-b border-white/10 py-3.5 font-sans">
              <div className="flex items-center justify-between text-xs py-1 border-b border-white/5">
                <span className="text-[#7e8b9b]">DEVICE SPEED IMPACT</span>
                <span className="text-[#00ff66] font-mono font-bold">0.0% (Zero Lag)</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1 border-b border-white/5">
                <span className="text-[#7e8b9b]">ENCRYPTION STRENGTH</span>
                <span className="text-[#00ff66] font-mono font-bold">Military AES-256 GCM</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1 border-b border-white/5">
                <span className="text-[#7e8b9b]">CLOUD DATA COLLECTION</span>
                <span className="text-[#00f0ff] font-mono font-bold">0% (Zero Logs)</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1">
                <span className="text-[#7e8b9b]">SUPPORTED DEVICES</span>
                <span className="text-[#f8fafc] font-mono font-bold">iOS, Android, Mac, Windows, Linux</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. HACKER CULTURE ARSENAL // INTERACTIVE TACTICAL STICKERS */}
      <div className="border border-white/15 bg-[#03060a] p-4 sm:p-8 space-y-4 sm:space-y-6 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-[#00ff66] uppercase font-bold mb-0.5">
              <Terminal className="w-3.5 h-3.5" />
              <span>THE SECURITY MANIFESTO</span>
            </div>
            <h3 className="text-sm sm:text-base font-extrabold text-[#f8fafc] uppercase">
              Tap Any Security Pillar to Explore
            </h3>
          </div>

          <div className="text-[10px] text-[#00ff66] bg-[#00ff66]/10 border border-[#00ff66]/30 px-2 py-0.5 font-bold self-start sm:self-auto">
            INTERACTIVE
          </div>
        </div>

        {/* Responsive Grid for All Devices */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {HACKER_BADGES.map((badge) => {
            const isSelected = activeBadge === badge.id
            return (
              <button
                key={badge.id}
                onClick={() => {
                  setActiveBadge(badge.id)
                  cyberAudio.playByteTick()
                  triggerGlitch(300)
                }}
                className={`p-3.5 sm:p-4 border text-left transition-all relative overflow-hidden min-h-[90px] ${
                  isSelected
                    ? "border-[#00ff66] bg-[#00ff66]/15 shadow-[0_0_20px_rgba(0,255,102,0.15)]"
                    : "border-white/10 bg-[#010306] hover:border-white/30 text-[#7e8b9b]"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xl">{badge.icon}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 border font-mono font-bold ${
                      isSelected
                        ? "border-[#00ff66] text-[#00ff66] bg-[#00ff66]/20"
                        : "border-white/10 text-[#7e8b9b]"
                    }`}
                  >
                    {badge.tag}
                  </span>
                </div>

                <div className={`text-xs font-bold font-mono ${isSelected ? "text-white" : "text-[#f8fafc]"}`}>
                  {badge.title}
                </div>
                <p className="text-[11px] text-[#94a3b8] font-sans mt-1 leading-relaxed">
                  {badge.plainText}
                </p>
              </button>
            )
          })}
        </div>

        {/* Active Badge Status Banner */}
        <div className="p-3 border border-[#00ff66]/40 bg-[#00ff66]/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#00ff66] shrink-0" />
            <span className="text-[#f8fafc] font-bold">
              SELECTED: <span className="text-[#00ff66]">{currentBadgeData.title}</span>
            </span>
          </div>
          <span className="text-[11px] text-[#7e8b9b] font-sans">
            {currentBadgeData.plainText}
          </span>
        </div>
      </div>

      {/* 3. RETRO "WAITING FOR SOMETHING TO HAPPEN?" IDLE STATE */}
      <div className="border border-white/15 bg-[#000000] p-6 sm:p-8 text-center space-y-3 relative overflow-hidden">
        <div className="max-w-md mx-auto space-y-3">
          {/* Lightbulb & Pixel Cat Display */}
          <div className="relative py-2 flex flex-col items-center justify-center">
            {/* Hanging Pixel Lightbulb */}
            <button
              onClick={() => {
                setIsLightOn(!isLightOn)
                cyberAudio.playKeyClick()
              }}
              className="group focus:outline-none min-h-[44px] flex flex-col items-center justify-center"
              title="Tap to turn light on/off"
            >
              <div className={`text-2xl transition-all duration-300 ${isLightOn ? "text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.9)] scale-110" : "text-[#7e8b9b] opacity-40"}`}>
                💡
              </div>
              <div className="w-px h-5 bg-white/30 mx-auto" />
            </button>

            {/* Pixel Cat Graphic */}
            <div className={`mt-2 p-2 transition-opacity duration-500 ${isLightOn ? "opacity-100" : "opacity-30"}`}>
              <img
                src="/assets/cyber/pixel-idle.jpg"
                alt="Waiting for something to happen?"
                className="w-40 sm:w-52 mx-auto rounded-none border border-white/20 filter contrast-125"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs sm:text-sm font-bold text-white tracking-widest uppercase">
              waiting for something to happen?
            </div>
            <p className="text-xs text-[#94a3b8] font-sans max-w-sm mx-auto">
              Your device stays quiet, fast, and protected. AgeIS-X only springs into action when a real cyber threat is detected.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
