"use client"

import React, { useState } from "react"
import Link from "next/link"
import { AuthLayout } from "@/components/auth/auth-layout"
import { GuestGuard } from "@/components/auth/auth-guard"
import { AuthErrorBanner } from "@/components/auth/auth-error-banner"
import { PasswordStrengthMeter, evaluatePassword } from "@/components/auth/password-strength-meter"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/lib/auth/auth-context"
import { Mail, User, Loader2, ArrowRight } from "lucide-react"

export default function SignupPage() {
  const { signUp, isLoading, error, clearError } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [agreedToTerms, setAgreedToTerms] = useState(true)

  const passwordStrength = evaluatePassword(password)
  const isPasswordValid = passwordStrength.requirements.length

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isPasswordValid || !agreedToTerms) return
    clearError()
    await signUp({ name, email, password })
  }

  return (
    <GuestGuard>
      <AuthLayout
        title="Create Security Account"
        subtitle="Provision zero-knowledge protection across your devices, identities, and network"
        footerPrompt={{
          text: "Already have an account?",
          linkText: "Sign in here",
          href: "/login",
        }}
      >
        <div className="space-y-4 text-xs">
          <AuthErrorBanner error={error} onDismiss={clearError} />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium block">
                Full Name
              </label>
              <Input
                type="text"
                placeholder="Alex Mercer"
                value={name}
                onChange={(e) => setName(e.target.value)}
                icon={<User className="w-4 h-4 text-slate-400" />}
                autoComplete="name"
                required
                className="bg-[#04070d]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium block">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="alex@company.corp"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="w-4 h-4 text-slate-400" />}
                autoComplete="email"
                required
                className="bg-[#04070d]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium block">
                Master Password
              </label>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                autoComplete="new-password"
                required
                className="bg-[#04070d]"
              />
              <PasswordStrengthMeter password={password} />
            </div>

            <div className="flex items-start space-x-2 pt-2">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(!!checked)}
                required
              />
              <label
                htmlFor="terms"
                className="text-xs text-slate-400 cursor-pointer leading-tight select-none"
              >
                I agree to the{" "}
                <Link href="/about" className="text-[#00e575] hover:underline font-medium">
                  Zero-Knowledge Privacy Policy
                </Link>{" "}
                and Terms of Service.
              </label>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !email || !isPasswordValid || !agreedToTerms}
              className="w-full h-10 text-xs font-semibold mt-2 bg-[#00e575] text-[#04070d] hover:bg-[#00c966]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin text-[#04070d]" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>
        </div>
      </AuthLayout>
    </GuestGuard>
  )
}
