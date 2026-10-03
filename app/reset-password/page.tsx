"use client"

import React, { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { AuthLayout } from "@/components/auth/auth-layout"
import { PasswordStrengthMeter } from "@/components/auth/password-strength-meter"
import { AuthErrorBanner } from "@/components/auth/auth-error-banner"
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
      <div className="space-y-4 text-center text-xs">
        <div className="w-12 h-12 bg-[#00e575]/10 border border-[#00e575]/30 text-[#00e575] mx-auto rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-sm font-bold text-[#00e575]">
            Password Reset Successfully
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
            Your master password has been updated. You can now sign in with your new credentials.
          </p>
        </div>
        <Button
          onClick={() => router.push("/login")}
          className="w-full h-10 text-xs font-semibold mt-2 bg-[#00e575] text-[#04070d] hover:bg-[#00c966]"
        >
          <span>Sign In to Console</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    )
  }

  if (tokenStatus === "invalid") {
    return (
      <div className="space-y-4 text-center text-xs">
        <div className="w-12 h-12 bg-[#ff4b4b]/10 border border-[#ff4b4b]/30 text-[#ff4b4b] mx-auto rounded-full flex items-center justify-center">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-sm font-bold text-[#ff4b4b]">
            Invalid or Expired Link
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
            This password reset link has expired or has already been used.
          </p>
        </div>
        <div className="flex flex-col gap-2 pt-2">
          <Button asChild className="w-full h-10 text-xs font-semibold bg-[#00e575] text-[#04070d] hover:bg-[#00c966]">
            <Link href="/forgot-password">Request New Reset Link</Link>
          </Button>
          <Button variant="outline" asChild className="w-full h-10 text-xs border-slate-700 bg-slate-900">
            <Link href="/login">Back to Sign In</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 text-xs">
      {errorMessage && (
        <AuthErrorBanner
          error={{ code: "INVALID_CREDENTIALS", message: errorMessage }}
          onDismiss={() => setErrorMessage(null)}
        />
      )}

      {tokenEmail && (
        <div className="p-3 bg-[#04070d] rounded-lg border border-slate-800 text-xs text-slate-400">
          Resetting password for: <span className="font-semibold text-slate-200">{tokenEmail}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {!queryToken && (
          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-medium block">
              Reset Token
            </label>
            <Input
              type="text"
              required
              placeholder="Paste your reset token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="bg-[#04070d]"
            />
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs text-slate-400 font-medium block">
            New Password
          </label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              required
              placeholder="Minimum 8 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              icon={<Lock className="w-4 h-4 text-slate-400" />}
              className="bg-[#04070d]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <PasswordStrengthMeter password={newPassword} />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-slate-400 font-medium block">
            Confirm Password
          </label>
          <Input
            type={showPassword ? "text" : "password"}
            required
            placeholder="Re-enter your new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            icon={<Lock className="w-4 h-4 text-slate-400" />}
            className="bg-[#04070d]"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-10 text-xs font-semibold mt-2 bg-[#00e575] text-[#04070d] hover:bg-[#00c966]"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin text-[#04070d]" />
              Updating Password...
            </>
          ) : (
            <>
              <KeyRound className="w-4 h-4 mr-2" />
              Update Password
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
      title="Create New Password"
      subtitle="Configure a new master password for your AgeIS-X account"
      footerPrompt={{
        text: "Cancel password reset?",
        linkText: "Return to sign in",
        href: "/login",
      }}
    >
      <Suspense
        fallback={
          <div className="h-40 flex items-center justify-center text-xs text-slate-400">
            Loading...
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  )
}
