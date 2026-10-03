"use client"

import React, { useState } from "react"
import Link from "next/link"
import { AuthLayout } from "@/components/auth/auth-layout"
import { AuthErrorBanner } from "@/components/auth/auth-error-banner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth/auth-context"
import { Mail, CheckCircle2, ArrowRight, Loader2 } from "lucide-react"

export default function ForgotPasswordPage() {
  const { requestPasswordReset, isLoading, error, clearError } = useAuth()
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    await requestPasswordReset(email)
    setIsSubmitted(true)
  }

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Enter your email address to receive password reset instructions"
      footerPrompt={{
        text: "Remembered your password?",
        linkText: "Return to sign in",
        href: "/login",
      }}
    >
      <div className="space-y-4 text-xs">
        <AuthErrorBanner error={error} onDismiss={clearError} />

        {isSubmitted ? (
          <div className="space-y-4">
            <div className="p-4 rounded-lg border border-[#00e575]/40 bg-[#00e575]/10 text-[#00e575] space-y-1.5">
              <div className="flex items-center gap-2 font-semibold text-xs">
                <CheckCircle2 className="w-4 h-4 text-[#00e575] shrink-0" />
                <span>Reset link sent</span>
              </div>
              <p className="text-slate-200 leading-relaxed text-xs">
                If an account exists for <strong className="text-white font-medium">{email}</strong>, you will receive an email with reset instructions shortly.
              </p>
            </div>

            <div className="p-3 bg-[#04070d] rounded-lg border border-slate-800 text-[11px] text-slate-400">
              Demo mode: You can proceed directly to the password reset form using the demo link below.
            </div>

            <Button variant="outline" className="w-full text-xs h-10 border-slate-700 bg-slate-900 hover:bg-slate-800" asChild>
              <Link href="/reset-password?token=demo_token">
                Proceed to Reset Password (Demo) &rarr;
              </Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium block">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="secops@ageis-x.corp"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="w-4 h-4 text-slate-400" />}
                autoComplete="email"
                required
                className="bg-[#04070d]"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || !email}
              className="w-full h-10 text-xs font-semibold mt-2 bg-[#00e575] text-[#04070d] hover:bg-[#00c966]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin text-[#04070d]" />
                  Sending Link...
                </>
              ) : (
                <>
                  Send Reset Link
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>
        )}
      </div>
    </AuthLayout>
  )
}
