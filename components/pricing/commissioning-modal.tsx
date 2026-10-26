"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
} from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { RobotPlan } from "./robot-plans-data"
import {
  PixelScoutGlyph,
  PixelGuardGlyph,
  PixelSentinelGlyph,
  PixelAegisGlyph,
} from "./robot-pixel-sprites"
import {
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Laptop,
  Terminal,
  Key,
  Download,
  ArrowRight,
  Loader2,
  ExternalLink,
  ShieldAlert,
} from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { cn } from "@/lib/utils"

export interface CommissioningModalProps {
  plan: RobotPlan | null
  isOpen: boolean
  onClose: () => void
  billingCycle: "annual" | "monthly"
}

export function CommissioningModal({
  plan,
  isOpen,
  onClose,
  billingCycle,
}: CommissioningModalProps) {
  const router = useRouter()
  const { user, signIn } = useAuth()

  const [step, setStep] = useState<"platform" | "generating" | "activated">("platform")
  const [selectedPlatform, setSelectedPlatform] = useState<"macos" | "windows" | "linux">("macos")
  const [deviceToken, setDeviceToken] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)

  if (!plan) return null

  const glyphMap = {
    scout: PixelScoutGlyph,
    guard: PixelGuardGlyph,
    sentinel: PixelSentinelGlyph,
    aegis: PixelAegisGlyph,
  }
  const GlyphComponent = glyphMap[plan.id]

  const calculatedPrice =
    billingCycle === "annual"
      ? plan.priceFormatted
      : plan.priceAnnual === 0
      ? "₹0"
      : `₹${Math.round((plan.priceAnnual * 1.25) / 12)} / mo`

  const handleStartCommissioning = async () => {
    setIsGenerating(true)
    setStep("generating")

    // Simulate cryptographic key generation loop
    await new Promise((r) => setTimeout(r, 1400))

    const mockKey = `AGEIS-${plan.robotName}-${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}-${Date.now().toString(36).toUpperCase()}`
    setDeviceToken(mockKey)

    // Store in browser session
    try {
      localStorage.setItem("ageis_active_commission", JSON.stringify({
        planId: plan.id,
        robotName: plan.robotName,
        platform: selectedPlatform,
        token: mockKey,
        billingCycle,
        activatedAt: new Date().toISOString(),
      }))
    } catch {}

    setIsGenerating(false)
    setStep("activated")
  }

  const handleDownloadConfig = () => {
    const configPayload = {
      client_name: `AgeIS-X Daemon (${plan.robotName} Unit)`,
      unit_archetype: plan.robotName,
      unit_tier: plan.tierName,
      license_key: deviceToken,
      platform_target: selectedPlatform,
      enclave_binding: "AES-256-GCM / SHA-256",
      max_devices: plan.devicesCount,
      local_daemon_port: 8000,
      timestamp: new Date().toISOString(),
      policy: {
        zero_knowledge_retention: true,
        local_heuristics: true,
        mitre_attck_correlation: true,
      },
    }

    const blob = new Blob([JSON.stringify(configPayload, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ageisx-${plan.id}-enclave-config.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleProceedToConsole = async () => {
    // If not signed in, auto sign-in with personal demo persona so the user lands seamlessly in dashboard
    if (!user) {
      await signIn({
        email: "alex.defense@gmail.com",
        password: "Password@123",
        rememberDevice: true,
      })
    }
    onClose()
    router.push("/dashboard")
  }

  const handleResetAndClose = () => {
    setStep("platform")
    setIsGenerating(false)
    onClose()
  }

  return (
    <Modal open={isOpen} onOpenChange={(open: boolean) => !open && handleResetAndClose()}>
      <ModalContent className="max-w-lg w-full bg-[#0B0E14] border border-white/20 text-[#F8FAFC] font-mono p-6 sm:p-8 rounded-none shadow-2xl">
        <ModalHeader className="space-y-2 border-b border-white/10 pb-4 text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[#00E575] text-xs font-bold uppercase tracking-wider">
                UNIT COMMISSIONING // ENCLAVE SEEDING
              </span>
            </div>
            <span className="text-[10px] text-[#94A3B8] uppercase">
              SPEC: 2026.4
            </span>
          </div>

          <ModalTitle className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#F8FAFC] flex items-center gap-3">
            <GlyphComponent size={28} color="#00E575" />
            <span>COMMISSION {plan.robotName} UNIT</span>
          </ModalTitle>

          <ModalDescription className="text-xs text-[#94A3B8] font-sans">
            {plan.tagline} — {plan.role}. Bound to {plan.devicesLabel} with zero cloud telemetry.
          </ModalDescription>
        </ModalHeader>

        {/* STEP 1: PLATFORM SELECTION */}
        {step === "platform" && (
          <div className="space-y-6 pt-4 text-xs">
            <div className="p-3 bg-[#07090E] border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[#94A3B8] text-[10px] uppercase block">SELECTED PLAN & CADENCE</span>
                <span className="text-sm font-bold text-[#00E575]">{plan.tierName} • {calculatedPrice}</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 bg-white/10 text-[#F8FAFC] uppercase">
                {billingCycle} billing
              </span>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-[#64748B] uppercase block">
                SELECT PRIMARY HOST ARCHITECTURE:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPlatform("macos")}
                  className={cn(
                    "p-3 border text-left space-y-1 transition-colors cursor-pointer",
                    selectedPlatform === "macos"
                      ? "border-[#00E575] bg-[#00E575]/10 text-[#00E575]"
                      : "border-white/10 bg-[#07090E] text-[#94A3B8] hover:border-white/20"
                  )}
                >
                  <Cpu className="w-4 h-4 mb-1" />
                  <span className="font-bold block text-xs">macOS</span>
                  <span className="text-[9px] block text-[#64748B]">Apple Silicon M1-M4</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPlatform("windows")}
                  className={cn(
                    "p-3 border text-left space-y-1 transition-colors cursor-pointer",
                    selectedPlatform === "windows"
                      ? "border-[#00E575] bg-[#00E575]/10 text-[#00E575]"
                      : "border-white/10 bg-[#07090E] text-[#94A3B8] hover:border-white/20"
                  )}
                >
                  <Laptop className="w-4 h-4 mb-1" />
                  <span className="font-bold block text-xs">Windows</span>
                  <span className="text-[9px] block text-[#64748B]">Win 11 / TPM 2.0</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPlatform("linux")}
                  className={cn(
                    "p-3 border text-left space-y-1 transition-colors cursor-pointer",
                    selectedPlatform === "linux"
                      ? "border-[#00E575] bg-[#00E575]/10 text-[#00E575]"
                      : "border-white/10 bg-[#07090E] text-[#94A3B8] hover:border-white/20"
                  )}
                >
                  <Terminal className="w-4 h-4 mb-1" />
                  <span className="font-bold block text-xs">Linux</span>
                  <span className="text-[9px] block text-[#64748B]">eBPF Daemon</span>
                </button>
              </div>
            </div>

            <div className="p-3 bg-[#07090E] border border-white/10 text-[11px] text-[#94A3B8] font-sans space-y-1">
              <span className="text-[#00E575] font-mono text-[10px] block font-bold uppercase">
                // ZERO SURVEILLANCE GUARANTEE
              </span>
              <p>
                AgeIS-X binds keys to your platform hardware enclave. Private browsing strings and file contents never transmit to any server.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={handleResetAndClose}
                className="border-white/20 bg-transparent hover:bg-white/5 text-[#94A3B8] text-xs h-10 px-4 rounded-none"
              >
                Cancel
              </Button>
              <Button
                onClick={handleStartCommissioning}
                className="bg-[#00E575] hover:bg-[#00CC66] text-[#07090E] font-bold text-xs uppercase px-6 h-10 rounded-none shadow-[0_1px_3px_rgba(0,0,0,0.4),0_0_12px_rgba(0,229,117,0.2)] cursor-pointer"
              >
                <span>GENERATE ENCLAVE KEY</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: GENERATING KEYS */}
        {step === "generating" && (
          <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
            <Loader2 className="w-8 h-8 text-[#00E575] animate-spin" />
            <div className="space-y-1">
              <span className="text-sm font-bold text-[#F8FAFC] uppercase">
                PROVISIONING {plan.robotName} HARDWARE KEYS
              </span>
              <p className="text-xs text-[#94A3B8] font-sans">
                Binding device entropy seeds to local platform enclave...
              </p>
            </div>
            <div className="w-48 h-1 bg-white/10 overflow-hidden">
              <div className="w-full h-full bg-[#00E575] animate-pulse" />
            </div>
          </div>
        )}

        {/* STEP 3: ACTIVATION COMPLETED */}
        {step === "activated" && (
          <div className="space-y-5 pt-4 text-xs animate-in fade-in-0 duration-200">
            <div className="p-4 bg-[#00E575]/10 border border-[#00E575]/30 space-y-2">
              <div className="flex items-center gap-2 text-[#00E575]">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span className="font-bold text-sm uppercase">
                  UNIT {plan.robotName} COMMISSIONED SUCCESSFULLY
                </span>
              </div>
              <p className="text-xs text-[#CBD5E1] font-sans">
                Your sovereign license and configuration are now primed. You can now launch the Security Console or save the local daemon configuration file.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-[#64748B] uppercase block">
                DEVICE PROVISIONING TOKEN:
              </label>
              <div className="p-2.5 bg-[#07090E] border border-white/15 text-[11px] text-[#00E575] font-mono select-all flex items-center justify-between">
                <span className="truncate">{deviceToken}</span>
                <span className="text-[9px] text-[#64748B] uppercase shrink-0 pl-2">VALIDATED</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <Button
                onClick={handleDownloadConfig}
                variant="outline"
                className="flex-1 border-white/20 bg-transparent hover:bg-white/5 text-[#F8FAFC] text-xs h-10 rounded-none cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 mr-1.5 text-[#00E575]" />
                <span>SAVE CONFIG JSON</span>
              </Button>

              <Button
                onClick={handleProceedToConsole}
                className="flex-1 bg-[#00E575] hover:bg-[#00CC66] text-[#07090E] font-bold text-xs uppercase h-10 rounded-none shadow-[0_1px_3px_rgba(0,0,0,0.4),0_0_12px_rgba(0,229,117,0.2)] cursor-pointer"
              >
                <span>OPEN SECURITY CONSOLE</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </div>
          </div>
        )}
      </ModalContent>
    </Modal>
  )
}
