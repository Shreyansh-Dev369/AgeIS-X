"use client"

import React, { useState } from "react"
import Link from "next/link"
import { AuthLayout } from "@/components/auth/auth-layout"
import { AuthErrorBanner } from "@/components/auth/auth-error-banner"
import { TerminalPrompt } from "@/components/ui/terminal-prompt"
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
      title="Credential Recovery Protocol"
      subtitle="Input authorized security email to receive an encrypted zero-knowledge key reset token"
      footerPrompt={{
        text: "Recovered master key?",
        linkText: "[ RETURN TO LOGIN ]",
        href: "/login",
      }}
    >
      <div className="space-y-4 font-mono text-xs">
        <AuthErrorBanner error={error} onDismiss={clearError} />

        {/* Terminal Command Header */}
        <div className="pb-2 border-b border-white/10">
          <TerminalPrompt command="recovery.protocol --challenge=email" />
        </div>

        {isSubmitted ? (
          <div className="space-y-4 animate-in fade-in-50 duration-150">
            <div className="p-3.5 border border-[#00ff66]/40 bg-[#00ff66]/10 text-[#00ff66] space-y-2">
              <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[11px]">
                <CheckCircle2 className="w-4 h-4 text-[#00ff66] shrink-0" />
                <span>[ RECOVERY TOKEN DISPATCHED ]</span>
              </div>
              <p className="text-[#f8fafc]/90 leading-relaxed text-[11px]">
                If an AgeIS-X security identity exists for <strong className="text-white">{email}</strong>, an encrypted reset link has been transmitted.
              </p>
            </div>

            <div className="p-3 bg-[#040608] border border-white/10 text-[10px] text-[#7e8b9b] leading-relaxed">
              // TEST MODE: You can execute the password rekey workflow immediately via demo token.
            </div>

            <Button variant="outline" className="w-full text-xs font-mono uppercase tracking-wider h-10 border-white/20 hover:border-[#00ff66]" asChild>
              <Link href="/reset-password?token=demo_token">
                [ PROCEED TO KEY RESET (DEMO) ] →
              </Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-[#7e8b9b] block">
                REGISTERED_EMAIL // IDENTIFIER
              </label>
              <Input
                type="email"
                placeholder="secops@ageis-x.corp"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="w-4 h-4 text-[#7e8b9b]" />}
                autoComplete="email"
                required
                className="bg-[#040608]"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || !email}
              className="w-full h-10 font-mono text-xs uppercase tracking-wider font-bold mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin text-[#040608]" />
                  DISPATCHING TOKEN...
                </>
              ) : (
                <>
                  [ REQUEST RECOVERY LINK ]
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
