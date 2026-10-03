"use client"

import React from "react"
import { Monitor, Apple, Terminal, Smartphone, Globe, ArrowRight, ArrowLeft, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PixelBadge } from "@/components/ui/pixel-badge"
import { TacticalFrame } from "@/components/ui/tactical-frame"

interface StepPlatformSelectionProps {
  selectedPlatform: "macos" | "windows" | "linux" | "android" | "ios" | "browser"
  onSelectPlatform: (platform: "macos" | "windows" | "linux" | "android" | "ios" | "browser") => void
  onNext: () => void
  onBack: () => void
}

const PLATFORMS = [
  {
    id: "macos" as const,
    name: "macOS",
    subtitle: "Universal (Apple Silicon & Intel)",
    icon: Apple,
    badge: "Native Daemon",
    desc: "Endpoint agent with system extension, transparent socket filtering, and keychain hardware enclave integration.",
  },
  {
    id: "windows" as const,
    name: "Windows",
    subtitle: "Windows 10 / 11 (x64 & ARM64)",
    icon: Monitor,
    badge: "Native Service",
    desc: "Low-overhead user-space daemon with Windows Filtering Platform (WFP) integration and process heuristics.",
  },
  {
    id: "linux" as const,
    name: "Linux",
    subtitle: "Debian, Ubuntu, Fedora, Arch, Alpine",
    icon: Terminal,
    badge: "systemd Service",
    desc: "Minimal zero-dependency CLI daemon with eBPF runtime socket tracing and systemd automation.",
  },
  {
    id: "android" as const,
    name: "Android",
    subtitle: "Android 10+",
    icon: Smartphone,
    badge: "Sandboxed VpnService",
    desc: "On-device encrypted DNS and heuristic app scanning with zero background battery impact.",
  },
  {
    id: "ios" as const,
    name: "iOS / iPadOS",
    subtitle: "iOS 16+",
    icon: Smartphone,
    badge: "Encrypted Profile",
    desc: "Zero-configuration encrypted DNS profile and zero-trust perimeter tunnel via Secure Enclave.",
  },
  {
    id: "browser" as const,
    name: "Browser & Cloud Only",
    subtitle: "Chrome, Brave, Edge, Firefox, Safari",
    icon: Globe,
    badge: "Web Extension / API",
    desc: "Lightweight zero-install browser security, live phishing interception, and REST API access.",
  },
]

export function StepPlatformSelection({
  selectedPlatform,
  onSelectPlatform,
  onNext,
  onBack,
}: StepPlatformSelectionProps) {
  return (
    <div className="space-y-6 font-mono select-none">
      {/* Step Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <PixelBadge variant="phosphor" size="sm" dot>
            NODE_SELECT // PLATFORM
          </PixelBadge>
          <span className="text-[11px] text-[#7e8b9b]">PRIMARY ENDPOINT</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#f8fafc] uppercase font-sans">
          Select Your Primary Protection Node
        </h2>
        <p className="text-xs text-[#7e8b9b] leading-relaxed max-w-xl">
          Choose the primary workstation or host node you want AgeIS-X to configure first. Additional devices can be provisioned at any time.
        </p>
      </div>

      {/* Platform Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {PLATFORMS.map((platform) => {
          const Icon = platform.icon
          const isSelected = selectedPlatform === platform.id

          return (
            <div
              key={platform.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelectPlatform(platform.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  onSelectPlatform(platform.id)
                }
              }}
              className={`p-4 border text-left transition-all relative flex flex-col justify-between cursor-pointer focus:outline-none ${
                isSelected
                  ? "bg-[#0b1017] border-[#00ff66] text-[#f8fafc] shadow-[0_0_12px_rgba(0,255,102,0.2)]"
                  : "bg-[#040608] border-white/10 text-[#7e8b9b] hover:border-white/30 hover:text-[#f8fafc]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-9 h-9 border flex items-center justify-center ${
                      isSelected
                        ? "bg-[#00ff66]/10 border-[#00ff66] text-[#00ff66]"
                        : "bg-[#080c10] border-white/10 text-[#7e8b9b]"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <PixelBadge variant={isSelected ? "phosphor" : "neutral"} size="sm">
                    {platform.badge}
                  </PixelBadge>
                </div>

                <h3 className="text-sm font-bold uppercase tracking-wider text-[#f8fafc]">{platform.name}</h3>
                <p className="text-[10px] text-[#00f0ff] font-mono mb-2">{platform.subtitle}</p>
                <p className="text-[11px] text-[#7e8b9b] leading-relaxed">{platform.desc}</p>
              </div>

              <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between text-[11px]">
                <span className={isSelected ? "text-[#00ff66] font-bold" : "text-[#7e8b9b]"}>
                  {isSelected ? "[ SELECTED NODE ]" : "[ CLICK TO SELECT ]"}
                </span>
                {isSelected && (
                  <span className="text-[#00ff66] font-bold">[✓]</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <Button
          variant="outline"
          onClick={onBack}
          className="text-xs font-mono uppercase tracking-wider h-9 px-4 border-white/20"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
          <span>[ BACK ]</span>
        </Button>
        <Button
          onClick={onNext}
          className="h-9 px-5 text-xs font-mono uppercase tracking-wider font-bold"
        >
          <span>[ CONFIGURE {selectedPlatform.toUpperCase()} NODE ]</span>
          <ArrowRight className="w-3.5 h-3.5 ml-2" />
        </Button>
      </div>
    </div>
  )
}
