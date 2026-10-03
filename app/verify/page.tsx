"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AuthLayout } from "@/components/auth/auth-layout"
import { AuthErrorBanner } from "@/components/auth/auth-error-banner"
import { TerminalPrompt } from "@/components/ui/terminal-prompt"
import { PixelBadge } from "@/components/ui/pixel-badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth/auth-context"
import { CheckCircle2, Loader2, ArrowRight, ShieldCheck } from "lucide-react"

export default function VerifyPage() {
  const router = useRouter()
  const { user, verifyIdentity, resendVerification, isLoading, error, clearError } = useAuth()
  const [code, setCode] = useState("")
  const [isResending, setIsResending] = useState(false)
  const [cooldown, setCooldown] = useState(30)
  const [resendSuccess, setResendSuccess] = useState(false)

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    await verifyIdentity(code)
  }

  const handleResend = async () => {
    if (cooldown > 0 || isResending) return
    setIsResending(true)
    clearError()
    const res = await resendVerification()
    setIsResending(false)
    if (res.success) {
      setResendSuccess(true)
      setCooldown(45)
      setTimeout(() => setResendSuccess(false), 4000)
    }
  }

  const emailDisplay = user?.email || "your registered email"

  return (
    <AuthLayout
      title="Verify Security Identity"
      subtitle={`Cryptographic verification challenge dispatched to ${emailDisplay}`}
      footerPrompt={{
        text: "Switch operator context?",
        linkText: "[ RETURN TO LOGIN ]",
        href: "/login",
      }}
    >
      <div className="space-y-4 font-mono text-xs">
        <AuthErrorBanner error={error} onDismiss={clearError} />

        {/* Terminal Command Header */}
        <div className="pb-2 border-b border-white/10 flex items-center justify-between">
          <TerminalPrompt command="identity.verify --challenge=2FA" />
          <PixelBadge variant={code.length === 6 ? "phosphor" : "cyan"} size="sm">
            {code.length === 6 ? "READY" : "AWAITING CODE"}
          </PixelBadge>
        </div>

        {resendSuccess && (
          <div className="p-3 border border-[#00ff66]/40 bg-[#00ff66]/10 text-[#00ff66] text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#00ff66] shrink-0" />
            <span>[ SUCCESS ]: Fresh verification code token dispatched.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2 text-center">
            <label className="text-[11px] uppercase tracking-wider text-[#7e8b9b] block">
              ENTER 6-DIGIT VERIFICATION TOKEN
            </label>
            <div className="relative">
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                placeholder="• • • • • •"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="text-center font-mono text-2xl tracking-[0.5em] h-14 bg-[#040608] border-white/20 text-[#00ff66] focus-visible:border-[#00ff66]"
                autoFocus
                required
              />
            </div>
            <span className="text-[10px] text-[#7e8b9b] block">
              // TEST MODE: Enter any 6 digits (e.g. 123456)
            </span>
          </div>

          <Button
            type="submit"
            disabled={isLoading || code.length < 6}
            className="w-full h-10 font-mono text-xs uppercase tracking-wider font-bold"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin text-[#040608]" />
                VALIDATING CHALLENGE...
              </>
            ) : (
              <>
                [ VERIFY & PROCEED TO ONBOARDING ]
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={handleResend}
              disabled={cooldown > 0 || isResending}
              className="text-xs text-[#7e8b9b] hover:text-[#00ff66] disabled:text-white/20 font-mono transition-colors uppercase tracking-wider"
            >
              {cooldown > 0 ? (
                <span>[ RESEND TOKEN IN {cooldown}S ]</span>
              ) : isResending ? (
                <span>[ DISPATCHING TOKEN... ]</span>
              ) : (
                <span className="text-[#00ff66] hover:underline">[ DISPATCH NEW TOKEN ]</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </AuthLayout>
  )
}
