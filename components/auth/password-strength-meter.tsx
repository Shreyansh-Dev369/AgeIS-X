import React from "react"
import { cn } from "@/lib/utils"

export interface PasswordStrength {
  score: number // 0 to 4
  label: "Weak" | "Fair" | "Good" | "Strong"
  colorClass: string
  bgClass: string
  requirements: {
    length: boolean
    hasUpper: boolean
    hasLower: boolean
    hasNumber: boolean
    hasSpecial: boolean
  }
}

export function evaluatePassword(password: string): PasswordStrength {
  const requirements = {
    length: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  }

  let metCount = 0
  if (requirements.length) metCount++
  if (requirements.hasUpper && requirements.hasLower) metCount++
  if (requirements.hasNumber) metCount++
  if (requirements.hasSpecial) metCount++

  if (password.length >= 12 && metCount === 4) {
    metCount = 4
  }

  let label: PasswordStrength["label"] = "Weak"
  let colorClass = "text-[#ff3b30]"
  let bgClass = "bg-[#ff3b30]"

  if (metCount === 2) {
    label = "Fair"
    colorClass = "text-[#ffb800]"
    bgClass = "bg-[#ffb800]"
  } else if (metCount === 3) {
    label = "Good"
    colorClass = "text-[#00f0ff]"
    bgClass = "bg-[#00f0ff]"
  } else if (metCount === 4) {
    label = "Strong"
    colorClass = "text-[#00ff66]"
    bgClass = "bg-[#00ff66]"
  }

  return {
    score: metCount,
    label,
    colorClass,
    bgClass,
    requirements,
  }
}

export function PasswordStrengthMeter({ password }: { password: string }) {
  if (!password) return null

  const strength = evaluatePassword(password)
  const percentage = Math.round((strength.score / 4) * 100)
  const totalBlocks = 10
  const filledBlocks = Math.round((strength.score / 4) * totalBlocks)
  const emptyBlocks = totalBlocks - filledBlocks

  return (
    <div className="space-y-2 pt-2 text-xs font-mono animate-in fade-in-50 duration-150 select-none" aria-live="polite">
      {/* Entropy Header & Status Bar */}
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-[#7e8b9b] uppercase">ENTROPY RATING:</span>
        <div className="flex items-center gap-2">
          <span className={cn("font-bold uppercase tracking-wider", strength.colorClass)}>
            [{strength.label}]
          </span>
          <span className="text-[#7e8b9b]">{percentage}%</span>
        </div>
      </div>

      {/* Retro Pixel Block Bar */}
      <div className="flex items-center gap-1 text-xs">
        <span className="text-white/30 font-bold">[</span>
        <span className={cn("font-mono font-black tracking-widest", strength.colorClass)}>
          {"■".repeat(filledBlocks)}
        </span>
        <span className="font-mono tracking-widest text-white/10">
          {"□".repeat(emptyBlocks)}
        </span>
        <span className="text-white/30 font-bold">]</span>
      </div>

      {/* Monospace Requirements Checklist */}
      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] text-[#7e8b9b] pt-1">
        <div className="flex items-center gap-1.5">
          <span className={strength.requirements.length ? "text-[#00ff66] font-bold" : "text-white/20"}>
            {strength.requirements.length ? "[✓]" : "[ ]"}
          </span>
          <span className={strength.requirements.length ? "text-[#f8fafc]" : ""}>8+ CHARACTERS</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span
            className={
              strength.requirements.hasUpper && strength.requirements.hasLower
                ? "text-[#00ff66] font-bold"
                : "text-white/20"
            }
          >
            {strength.requirements.hasUpper && strength.requirements.hasLower ? "[✓]" : "[ ]"}
          </span>
          <span
            className={
              strength.requirements.hasUpper && strength.requirements.hasLower ? "text-[#f8fafc]" : ""
            }
          >
            UPPER & LOWER
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className={strength.requirements.hasNumber ? "text-[#00ff66] font-bold" : "text-white/20"}>
            {strength.requirements.hasNumber ? "[✓]" : "[ ]"}
          </span>
          <span className={strength.requirements.hasNumber ? "text-[#f8fafc]" : ""}>1+ NUMERIC</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className={strength.requirements.hasSpecial ? "text-[#00ff66] font-bold" : "text-white/20"}>
            {strength.requirements.hasSpecial ? "[✓]" : "[ ]"}
          </span>
          <span className={strength.requirements.hasSpecial ? "text-[#f8fafc]" : ""}>SPECIAL SYMBOL</span>
        </div>
      </div>
    </div>
  )
}
