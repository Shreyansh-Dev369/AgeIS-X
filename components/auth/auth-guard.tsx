"use client"

import React, { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth/auth-context"
import { LoadingState } from "@/components/ui/loading-state"

interface AuthGuardProps {
  children: React.ReactNode
  requireVerified?: boolean
  requireOnboarded?: boolean
}

export function AuthGuard({
  children,
  requireVerified = true,
  requireOnboarded = true,
}: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { authState, isLoading } = useAuth()

  useEffect(() => {
    if (isLoading) return

    if (authState === "anonymous" || authState === "session_expired" || authState === "session_revoked") {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`)
      return
    }

    if (requireVerified && authState === "verification_required") {
      router.push("/verify")
      return
    }

    if (requireOnboarded && authState === "onboarding_required") {
      router.push("/onboarding")
      return
    }
  }, [authState, isLoading, pathname, requireVerified, requireOnboarded, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#080c14] flex items-center justify-center p-6">
        <LoadingState
          title="Authenticating Security Session..."
          description="Verifying zero-trust cryptographic credentials."
        />
      </div>
    )
  }

  if (authState === "anonymous" || (requireVerified && authState === "verification_required") || (requireOnboarded && authState === "onboarding_required")) {
    return (
      <div className="min-h-screen bg-[#080c14] flex items-center justify-center p-6">
        <LoadingState
          title="Redirecting to Security Flow..."
          description="Routing to required authentication or verification stage."
        />
      </div>
    )
  }

  return <>{children}</>
}

export function GuestGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { authState, isLoading } = useAuth()

  useEffect(() => {
    if (isLoading) return

    if (authState === "authenticated") {
      router.push("/dashboard")
    } else if (authState === "verification_required") {
      router.push("/verify")
    } else if (authState === "onboarding_required") {
      router.push("/onboarding")
    }
  }, [authState, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#080c14] flex items-center justify-center p-6">
        <LoadingState
          title="Verifying Security State..."
          description="Checking local device session."
        />
      </div>
    )
  }

  return <>{children}</>
}
