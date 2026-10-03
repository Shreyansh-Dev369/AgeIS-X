"use client"

import React, { useState, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { AuthLayout } from "@/components/auth/auth-layout"
import { GuestGuard } from "@/components/auth/auth-guard"
import { AuthErrorBanner } from "@/components/auth/auth-error-banner"
import { TerminalPrompt } from "@/components/ui/terminal-prompt"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/lib/auth/auth-context"
import { cyberAudio } from "@/lib/cyber-sound"
import { Mail, Loader2, ArrowRight, ShieldCheck, Zap, UserCheck, Key, Copy, Check } from "lucide-react"

const DEMO_ACCOUNTS = [
  {
    role: "SECOPS ANALYST",
    email: "analyst@ageis-x.corp",
    password: "Password@123",
    badge: "SOC OPERATOR",
    desc: "Full access to threat radar, telemetry charts, and incident response.",
  },
  {
    role: "PERSONAL USER",
    email: "alex.defense@gmail.com",
    password: "Password@123",
    badge: "FREE TIER",
    desc: "Personal device shield, dark web monitor, and password vault.",
  },
  {
    role: "ENTERPRISE CISO",
    email: "ciso@enterprise-mesh.io",
    password: "Password@123",
    badge: "ENTERPRISE",
    desc: "Fleet posture overview, SAML SSO, and compliance audit logs.",
  },
]

function LoginForm() {
  const searchParams = useSearchParams()
  const isSessionExpired = searchParams.get("expired") === "true"

  const { signIn, isLoading, error, clearError } = useAuth()
  const [email, setEmail] = useState("analyst@ageis-x.corp")
  const [password, setPassword] = useState("Password@123")
  const [rememberDevice, setRememberDevice] = useState(true)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    clearError()
    cyberAudio.playShield()
    await signIn({ email, password, rememberDevice })
  }

  const handleQuickDemoLogin = async (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail)
    setPassword(demoPass)
    clearError()
    cyberAudio.playShield()
    await signIn({ email: demoEmail, password: demoPass, rememberDevice: true })
  }

  return (
    <div className="space-y-5">
      {/* 1-CLICK DEMO ACCESS BOX (PROMINENT AT TOP) */}
      <div className="p-4 border-2 border-[#00ff66]/50 bg-[#00ff66]/10 text-xs font-mono space-y-3 relative shadow-[0_0_25px_rgba(0,255,102,0.15)]">
        <div className="flex items-center justify-between border-b border-[#00ff66]/30 pb-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#00ff66] animate-pulse" />
            <span className="font-bold text-[#f8fafc] text-xs uppercase tracking-wider">
              ⚡ 1-CLICK DEMO LOGIN (INSTANT ACCESS)
            </span>
          </div>
          <span className="text-[10px] px-1.5 py-0.2 bg-[#00ff66] text-[#040608] font-bold">
            READY
          </span>
        </div>

        <p className="text-[11px] text-[#94a3b8] font-sans">
          Click any persona below to immediately log into the AgeIS-X security console without registering:
        </p>

        {/* Demo Persona Buttons */}
        <div className="space-y-1.5">
          {DEMO_ACCOUNTS.map((acc) => (
            <button
              key={acc.email}
              type="button"
              onClick={() => handleQuickDemoLogin(acc.email, acc.password)}
              disabled={isLoading}
              className="w-full p-2.5 border border-[#00ff66]/30 bg-[#04080e] hover:bg-[#00ff66]/20 hover:border-[#00ff66] transition-all text-left flex items-center justify-between group min-h-[44px]"
            >
              <div className="min-w-0 pr-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-xs">{acc.role}</span>
                  <span className="text-[9px] px-1 border border-white/20 text-[#7e8b9b] font-mono">
                    {acc.badge}
                  </span>
                </div>
                <div className="text-[10px] text-[#00ff66] font-mono truncate">{acc.email}</div>
              </div>

              <span className="text-[11px] font-bold text-[#00ff66] group-hover:translate-x-1 transition-transform shrink-0 flex items-center gap-1 font-mono">
                [ LOG IN ] &rarr;
              </span>
            </button>
          ))}
        </div>

        {/* Pre-fill Credentials Info */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-[#7e8b9b]">
          <span>DEMO CREDENTIALS: <strong className="text-white">analyst@ageis-x.corp</strong> / <strong className="text-white">Password@123</strong></span>
          <button
            type="button"
            onClick={() => {
              setEmail("analyst@ageis-x.corp")
              setPassword("Password@123")
              setCopied(true)
              cyberAudio.playKeyClick()
              setTimeout(() => setCopied(false), 2000)
            }}
            className="text-[#00ff66] hover:underline flex items-center gap-1"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? "FILLED" : "AUTO-FILL"}</span>
          </button>
        </div>
      </div>

      {/* Session Expired Alert */}
      {isSessionExpired && (
        <div className="p-3 border border-[#ffb800]/40 bg-[#ffb800]/10 text-[#ffb800] font-mono text-xs space-y-0.5">
          <div className="font-bold uppercase tracking-wider text-[11px]">[ SESSION TIMEOUT ]</div>
          <p className="text-[#f8fafc]/90 text-[11px]">
            Previous security session expired. Please re-authenticate your identity.
          </p>
        </div>
      )}

      {/* Auth Error Banner */}
      <AuthErrorBanner error={error} onDismiss={clearError} />

      {/* Manual Credentials Form */}
      <div className="space-y-4 pt-2">
        <div className="text-[10px] text-[#7e8b9b] uppercase tracking-widest font-mono flex items-center gap-2">
          <span className="w-2 h-px bg-white/20" />
          <span>OR LOG IN MANUALLY</span>
          <span className="flex-1 h-px bg-white/20" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-[#7e8b9b] block">
              EMAIL ADDRESS
            </label>
            <Input
              type="email"
              placeholder="analyst@ageis-x.corp"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4 text-[#7e8b9b]" />}
              autoComplete="email"
              required
              className="bg-[#040608] min-h-[42px]"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] uppercase tracking-wider text-[#7e8b9b]">
                PASSPHRASE
              </label>
              <Link
                href="/forgot-password"
                className="text-[10px] text-[#00ff66] hover:text-[#39ff14] hover:underline uppercase tracking-wider"
              >
                [ RECOVER KEY ]
              </Link>
            </div>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password@123"
              autoComplete="current-password"
              required
              className="bg-[#040608] min-h-[42px]"
            />
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <Checkbox
              id="remember"
              checked={rememberDevice}
              onCheckedChange={(checked) => setRememberDevice(!!checked)}
            />
            <label
              htmlFor="remember"
              className="text-[11px] text-[#7e8b9b] cursor-pointer select-none tracking-tight"
            >
              Remember this device for 30 days
            </label>
          </div>

          <Button
            type="submit"
            disabled={isLoading || !email || !password}
            className="w-full h-11 font-mono text-xs uppercase tracking-wider font-bold mt-2 bg-[#00ff66] hover:bg-[#39ff14] text-[#040608] shadow-[0_0_15px_rgba(0,255,102,0.3)]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin text-[#040608]" />
                AUTHENTICATING IDENTITY...
              </>
            ) : (
              <>
                [ INITIALIZE ACCESS ]
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <GuestGuard>
      <AuthLayout
        title="Security Console Access"
        subtitle="Sign in or use 1-click demo access to enter the operations dashboard"
        footerPrompt={{
          text: "Want to create a new profile?",
          linkText: "[ SIGN UP FREE ]",
          href: "/signup",
        }}
      >
        <Suspense
          fallback={
            <div className="h-40 flex items-center justify-center font-mono text-xs text-[#7e8b9b]">
              INITIALIZING AUTH MODULE...
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </AuthLayout>
    </GuestGuard>
  )
}
