"use client"

import React, { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { AuthLayout } from "@/components/auth/auth-layout"
import { PasswordStrengthMeter } from "@/components/auth/password-strength-meter"
import { AuthErrorBanner } from "@/components/auth/auth-error-banner"
import { TerminalPrompt } from "@/components/ui/terminal-prompt"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { authService } from "@/lib/auth/auth-service"
import { KeyRound, CheckCircle2, ArrowRight, Lock, Eye, EyeOff, ShieldAlert, Loader2 } from "lucide-react"

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryToken = searchParams.get("token") || ""

  const [token, setToken] = useState(queryToken)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [tokenStatus, setTokenStatus] = useState<"checking" | "valid" | "invalid">("checking")
  const [tokenEmail, setTokenEmail] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    async function verifyToken() {
      if (!token) {
        setTokenStatus("valid")
        return
      }
      setIsLoading(true)
      const res = await authService.validateResetToken(token)
      setIsLoading(false)
      if (res.valid) {
        setTokenStatus("valid")
        if (res.email) setTokenEmail(res.email)
      } else {
        setTokenStatus("invalid")
        setErrorMessage(res.error?.message || "Password recovery token is invalid or has expired.")
      }
    }
    verifyToken()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!newPassword || newPassword.length < 8) {
      setErrorMessage("New password must contain at least 8 characters.")
      return
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please re-enter both passwords.")
      return
    }

    setIsLoading(true)
    try {
      const res = await authService.resetPassword(token || "manual_token", newPassword)
      if (res.success) {
        setIsSuccess(true)
      } else {
        setErrorMessage(res.error?.message || "Failed to reset password. Please try again.")
      }
    } catch {
      setErrorMessage("An unexpected error occurred. Please retry your request.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="space-y-5 text-center font-mono text-xs">
        <div className="w-12 h-12 bg-[#00ff66]/10 border border-[#00ff66]/30 text-[#00ff66] mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#00ff66]">
            [ PASSPHRASE REKEY SUCCESS ]
          </h2>
          <p className="text-xs text-[#7e8b9b] leading-relaxed max-w-sm mx-auto">
            Master security credential updated. All previous active sessions have been invalidated as a security precaution.
          </p>
        </div>
        <Button
          onClick={() => router.push("/login")}
          className="w-full h-10 font-mono text-xs uppercase tracking-wider font-bold mt-2"
        >
          <span>[ SIGN IN TO AGEIS-X ]</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    )
  }

  if (tokenStatus === "invalid") {
    return (
      <div className="space-y-5 text-center font-mono text-xs">
        <div className="w-12 h-12 bg-[#ff3b30]/10 border border-[#ff3b30]/30 text-[#ff3b30] mx-auto flex items-center justify-center">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#ff3b30]">
            [ INVALID OR EXPIRED TOKEN ]
          </h2>
          <p className="text-xs text-[#7e8b9b] leading-relaxed max-w-sm mx-auto">
            This password reset token has expired, is invalid, or was already consumed.
          </p>
        </div>
        <div className="flex flex-col gap-2 pt-2">
          <Button asChild className="w-full h-10 font-mono text-xs uppercase tracking-wider">
            <Link href="/forgot-password">[ REQUEST NEW RESET LINK ]</Link>
          </Button>
          <Button variant="outline" asChild className="w-full h-10 font-mono text-xs uppercase tracking-wider border-white/20">
            <Link href="/login">[ BACK TO SIGN IN ]</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 font-mono text-xs">
      <div className="pb-2 border-b border-white/10">
        <TerminalPrompt command="credential.rekey --token=active" />
      </div>

      {errorMessage && (
        <AuthErrorBanner
          error={{ code: "INVALID_CREDENTIALS", message: errorMessage }}
          onDismiss={() => setErrorMessage(null)}
        />
      )}

      {tokenEmail && (
        <div className="p-2.5 bg-[#040608] border border-white/10 text-[11px] text-[#7e8b9b]">
          REKEYING_ENTITY: <span className="font-bold text-[#00ff66]">{tokenEmail}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {!queryToken && (
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-[#7e8b9b] block">
              RECOVERY_TOKEN // INPUT
            </label>
            <Input
              type="text"
              required
              placeholder="Paste security token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="bg-[#040608]"
            />
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-[11px] uppercase tracking-wider text-[#7e8b9b] block">
            NEW_PASSPHRASE // MASTER
          </label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              required
              placeholder="Minimum 8 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              icon={<Lock className="w-4 h-4 text-[#7e8b9b]" />}
              className="bg-[#040608]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7e8b9b] hover:text-white focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <PasswordStrengthMeter password={newPassword} />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] uppercase tracking-wider text-[#7e8b9b] block">
            CONFIRM_PASSPHRASE // VERIFY
          </label>
          <Input
            type={showPassword ? "text" : "password"}
            required
            placeholder="Repeat new master password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            icon={<Lock className="w-4 h-4 text-[#7e8b9b]" />}
            className="bg-[#040608]"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-10 font-mono text-xs uppercase tracking-wider font-bold mt-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin text-[#040608]" />
              UPDATING CREDENTIALS...
            </>
          ) : (
            <>
              <KeyRound className="w-4 h-4 mr-2 text-[#040608]" />
              [ UPDATE MASTER PASSPHRASE ]
            </>
          )}
        </Button>
      </form>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Establish New Key"
      subtitle="Configure a new zero-knowledge master password for your AgeIS-X identity"
      footerPrompt={{
        text: "Cancel rekey operation?",
        linkText: "[ RETURN TO SIGN IN ]",
        href: "/login",
      }}
    >
      <Suspense
        fallback={
          <div className="h-40 flex items-center justify-center font-mono text-xs text-[#7e8b9b]">
            LOADING REKEY MODULE...
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  )
}
