"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AuthLayout } from "@/components/auth/auth-layout"
import { AuthErrorBanner } from "@/components/auth/auth-error-banner"
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
      title="Verify Your Identity"
      subtitle={`Enter the 6-digit verification code sent to ${emailDisplay}`}
      footerPrompt={{
        text: "Switch account?",
        linkText: "Return to sign in",
        href: "/login",
      }}
    >
      <div className="space-y-4 text-xs">
        <AuthErrorBanner error={error} onDismiss={clearError} />

        {resendSuccess && (
          <div className="p-3.5 rounded-lg border border-[#00e575]/40 bg-[#00e575]/10 text-[#00e575] text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#00e575] shrink-0" />
            <span>A fresh verification code has been dispatched.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2 text-center">
            <label className="text-xs text-slate-400 font-medium block">
              6-Digit Verification Code
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
                className="text-center font-mono text-2xl tracking-[0.4em] h-14 bg-[#04070d] border-slate-800 text-[#00e575] focus-visible:border-[#00e575]"
                autoFocus
                required
              />
            </div>
            <span className="text-[11px] text-slate-500 block">
              Demo mode: Enter any 6 digits (e.g. 123456)
            </span>
          </div>

          <Button
            type="submit"
            disabled={isLoading || code.length < 6}
            className="w-full h-10 text-xs font-semibold bg-[#00e575] text-[#04070d] hover:bg-[#00c966]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin text-[#04070d]" />
                Verifying...
              </>
            ) : (
              <>
                Verify & Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={handleResend}
              disabled={cooldown > 0 || isResending}
              className="text-xs text-slate-400 hover:text-[#00e575] disabled:text-slate-600 transition-colors"
            >
              {cooldown > 0 ? (
                <span>Resend code in {cooldown}s</span>
              ) : isResending ? (
                <span>Sending new code...</span>
              ) : (
                <span className="text-[#00e575] hover:underline">Resend verification code</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </AuthLayout>
  )
}
