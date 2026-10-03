"use client"

import React, { useState, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { AuthLayout } from "@/components/auth/auth-layout"
import { GuestGuard } from "@/components/auth/auth-guard"
import { AuthErrorBanner } from "@/components/auth/auth-error-banner"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/lib/auth/auth-context"
import { Mail, Loader2, ArrowRight, ShieldCheck, Zap, Copy, Check } from "lucide-react"

const DEMO_ACCOUNTS = [
  {
    role: "SecOps Analyst",
    email: "analyst@ageis-x.corp",
    password: "Password@123",
    badge: "SOC Operator",
    desc: "Full access to threat center, telemetry charts, and incident response.",
  },
  {
    role: "Personal User",
    email: "alex.defense@gmail.com",
    password: "Password@123",
    badge: "Free Tier",
    desc: "Personal device shield, dark web monitor, and password vault.",
  },
  {
    role: "Enterprise CISO",
    email: "ciso@enterprise-mesh.io",
    password: "Password@123",
    badge: "Enterprise",
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
    await signIn({ email, password, rememberDevice })
  }

  const handleQuickDemoLogin = async (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail)
    setPassword(demoPass)
    clearError()
    await signIn({ email: demoEmail, password: demoPass, rememberDevice: true })
  }

  return (
    <div className="space-y-5">
      {/* 1-CLICK DEMO ACCESS BOX */}
      <div className="p-4 rounded-lg border border-[#00e575]/40 bg-[#00e575]/10 text-xs space-y-3">
        <div className="flex items-center justify-between border-b border-[#00e575]/20 pb-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#00e575]" />
            <span className="font-semibold text-slate-100 text-xs">
              1-Click Demo Login (Instant Access)
            </span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-[#00e575] text-[#04070d] font-semibold">
            Ready
          </span>
        </div>

        <p className="text-[11px] text-slate-300">
          Click any persona below to immediately log into the AgeIS-X security console without registering:
        </p>

        {/* Demo Persona Buttons */}
        <div className="space-y-2">
          {DEMO_ACCOUNTS.map((acc) => (
            <button
              key={acc.email}
              type="button"
              onClick={() => handleQuickDemoLogin(acc.email, acc.password)}
              disabled={isLoading}
              className="w-full p-2.5 rounded-md border border-[#00e575]/30 bg-[#04070d] hover:bg-[#00e575]/15 hover:border-[#00e575] transition-all text-left flex items-center justify-between group min-h-[44px]"
            >
              <div className="min-w-0 pr-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-100 text-xs">{acc.role}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded border border-slate-700 bg-slate-800 text-slate-300">
                    {acc.badge}
                  </span>
                </div>
                <div className="text-[11px] text-[#00e575] font-mono truncate">{acc.email}</div>
              </div>

              <span className="text-xs font-semibold text-[#00e575] group-hover:translate-x-0.5 transition-transform shrink-0 flex items-center gap-1">
                Log In &rarr;
              </span>
            </button>
          ))}
        </div>

        {/* Pre-fill Info */}
        <div className="pt-2 border-t border-[#00e575]/20 flex items-center justify-between text-[11px] text-slate-400">
          <span>Demo: <strong className="text-slate-200">analyst@ageis-x.corp</strong> / <strong className="text-slate-200">Password@123</strong></span>
          <button
            type="button"
            onClick={() => {
              setEmail("analyst@ageis-x.corp")
              setPassword("Password@123")
              setCopied(true)
              setTimeout(() => setCopied(false), 2000)
            }}
            className="text-[#00e575] hover:underline flex items-center gap-1"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? "Filled" : "Auto-Fill"}</span>
          </button>
        </div>
      </div>

      {/* Session Expired Alert */}
      {isSessionExpired && (
        <div className="p-3.5 rounded-lg border border-[#ffb800]/40 bg-[#ffb800]/10 text-[#ffb800] text-xs space-y-0.5">
          <div className="font-semibold text-xs">Session Timed Out</div>
          <p className="text-slate-200 text-[11px]">
            Your previous security session expired. Please re-authenticate your identity.
          </p>
        </div>
      )}

      {/* Auth Error Banner */}
      <AuthErrorBanner error={error} onDismiss={clearError} />

      {/* Manual Credentials Form */}
      <div className="space-y-4 pt-1">
        <div className="text-[11px] text-slate-500 uppercase tracking-wider font-medium flex items-center gap-2">
          <span className="w-4 h-px bg-slate-800" />
          <span>Or sign in manually</span>
          <span className="flex-1 h-px bg-slate-800" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-medium block">
              Email Address
            </label>
            <Input
              type="email"
              placeholder="analyst@ageis-x.corp"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4 text-slate-400" />}
              autoComplete="email"
              required
              className="bg-[#04070d] min-h-[42px]"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs text-slate-400 font-medium">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-[#00e575] hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password@123"
              autoComplete="current-password"
              required
              className="bg-[#04070d] min-h-[42px]"
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
              className="text-xs text-slate-400 cursor-pointer select-none"
            >
              Remember this device for 30 days
            </label>
          </div>

          <Button
            type="submit"
            disabled={isLoading || !email || !password}
            className="w-full h-10 text-xs font-semibold mt-2 bg-[#00e575] text-[#04070d] hover:bg-[#00c966]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin text-[#04070d]" />
                Authenticating...
              </>
            ) : (
              <>
                Sign In to Console
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
          text: "Don't have an account?",
          linkText: "Sign up free",
          href: "/signup",
        }}
      >
        <Suspense
          fallback={
            <div className="h-40 flex items-center justify-center text-xs text-slate-400">
              Initializing...
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </AuthLayout>
    </GuestGuard>
  )
}
