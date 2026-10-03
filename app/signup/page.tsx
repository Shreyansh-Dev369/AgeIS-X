"use client"

import React, { useState } from "react"
import Link from "next/link"
import { AuthLayout } from "@/components/auth/auth-layout"
import { GuestGuard } from "@/components/auth/auth-guard"
import { AuthErrorBanner } from "@/components/auth/auth-error-banner"
import { PasswordStrengthMeter, evaluatePassword } from "@/components/auth/password-strength-meter"
import { TerminalPrompt } from "@/components/ui/terminal-prompt"
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
        title="Initialize Security Identity"
        subtitle="Provision a zero-knowledge master account across your endpoints, identities, and network"
        footerPrompt={{
          text: "Already provisioned?",
          linkText: "[ AUTHENTICATE HERE ]",
          href: "/login",
        }}
      >
        <div className="space-y-4 font-mono text-xs">
          <AuthErrorBanner error={error} onDismiss={clearError} />

          {/* Terminal Command Header */}
          <div className="pb-2 border-b border-white/10">
            <TerminalPrompt command="provision.agent --register --entity=operator" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-[#7e8b9b] block">
                ENTITY_NAME // OPERATOR_HANDLE
              </label>
              <Input
                type="text"
                placeholder="Alex Mercer"
                value={name}
                onChange={(e) => setName(e.target.value)}
                icon={<User className="w-4 h-4 text-[#7e8b9b]" />}
                autoComplete="name"
                required
                className="bg-[#040608]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-[#7e8b9b] block">
                WORK_EMAIL // PRIMARY_ROUTING
              </label>
              <Input
                type="email"
                placeholder="alex@company.corp"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="w-4 h-4 text-[#7e8b9b]" />}
                autoComplete="email"
                required
                className="bg-[#040608]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-[#7e8b9b] block">
                PASSPHRASE // MASTER_KEY
              </label>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                autoComplete="new-password"
                required
                className="bg-[#040608]"
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
                className="text-[11px] text-[#7e8b9b] cursor-pointer leading-tight select-none"
              >
                I attest to the{" "}
                <Link href="/about" className="text-[#00ff66] hover:underline font-semibold">
                  Zero-Knowledge Privacy Policy
                </Link>{" "}
                and Security Attestation Terms.
              </label>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !email || !isPasswordValid || !agreedToTerms}
              className="w-full h-10 font-mono text-xs uppercase tracking-wider font-bold mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin text-[#040608]" />
                  PROVISIONING ACCOUNT...
                </>
              ) : (
                <>
                  [ INITIALIZE IDENTITY ]
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
