"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  User,
  UserSession,
  AuthState,
  AuthResult,
  AuthError,
  OnboardingProgress,
  SecurityPreferences,
  ConsentPreferences,
} from "@/types/auth"
import { authService } from "@/lib/auth/auth-service"

interface AuthContextValue {
  user: User | null
  session: UserSession | null
  authState: AuthState
  isLoading: boolean
  error: AuthError | null
  onboardingProgress: OnboardingProgress | null
  signIn: (data: { email: string; password?: string; rememberDevice?: boolean }) => Promise<AuthResult>
  signUp: (data: { name: string; email: string; password?: string }) => Promise<AuthResult>
  signOut: () => Promise<void>
  verifyIdentity: (code: string) => Promise<AuthResult>
  resendVerification: () => Promise<{ success: boolean; error?: AuthError }>
  requestPasswordReset: (email: string) => Promise<{ success: boolean; error?: AuthError }>
  resetPassword: (token: string, newPass: string) => Promise<{ success: boolean; error?: AuthError }>
  updateOnboarding: (progress: Partial<OnboardingProgress>) => Promise<OnboardingProgress>
  completeOnboarding: () => Promise<AuthResult>
  refreshSession: () => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<UserSession | null>(null)
  const [authState, setAuthState] = useState<AuthState>("authenticating")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<AuthError | null>(null)
  const [onboardingProgress, setOnboardingProgress] = useState<OnboardingProgress | null>(null)

  const clearError = useCallback(() => setError(null), [])

  const refreshSession = useCallback(async () => {
    try {
      const { user: u, session: s, authState: state } = await authService.getSession()
      setUser(u)
      setSession(s)
      setAuthState(state)
      const progress = await authService.getOnboardingProgress()
      setOnboardingProgress(progress)
    } catch {
      setAuthState("anonymous")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshSession()
  }, [refreshSession])

  const signIn = async (data: { email: string; password?: string; rememberDevice?: boolean }): Promise<AuthResult> => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await authService.signIn(data)
      if (res.success && res.user) {
        setUser(res.user)
        setSession(res.session || null)
        setAuthState(res.authState)
        const progress = await authService.getOnboardingProgress()
        setOnboardingProgress(progress)
        if (res.nextRoute) {
          router.push(res.nextRoute)
        }
      } else if (res.error) {
        setError(res.error)
      }
      return res
    } catch (e: any) {
      const err: AuthError = {
        code: "UNKNOWN_ERROR",
        message: "An unexpected authentication error occurred. Please try again.",
      }
      setError(err)
      return { success: false, authState: "error", error: err }
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (data: { name: string; email: string; password?: string }): Promise<AuthResult> => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await authService.signUp(data)
      if (res.success && res.user) {
        setUser(res.user)
        setSession(res.session || null)
        setAuthState(res.authState)
        const progress = await authService.getOnboardingProgress()
        setOnboardingProgress(progress)
        if (res.nextRoute) {
          router.push(res.nextRoute)
        }
      } else if (res.error) {
        setError(res.error)
      }
      return res
    } catch (e: any) {
      const err: AuthError = {
        code: "UNKNOWN_ERROR",
        message: "Failed to provision account. Please check your network and retry.",
      }
      setError(err)
      return { success: false, authState: "error", error: err }
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async (): Promise<void> => {
    setIsLoading(true)
    try {
      await authService.signOut()
      setUser(null)
      setSession(null)
      setAuthState("anonymous")
      router.push("/login")
    } finally {
      setIsLoading(false)
    }
  }

  const verifyIdentity = async (code: string): Promise<AuthResult> => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await authService.verifyIdentity(code)
      if (res.success) {
        if (res.user) setUser(res.user)
        setAuthState(res.authState)
        if (res.nextRoute) {
          router.push(res.nextRoute)
        }
      } else if (res.error) {
        setError(res.error)
      }
      return res
    } finally {
      setIsLoading(false)
    }
  }

  const resendVerification = async () => {
    setError(null)
    return await authService.resendVerification()
  }

  const requestPasswordReset = async (email: string) => {
    setError(null)
    return await authService.requestPasswordReset(email)
  }

  const resetPassword = async (token: string, newPass: string) => {
    setError(null)
    return await authService.resetPassword(token, newPass)
  }

  const updateOnboarding = async (progress: Partial<OnboardingProgress>): Promise<OnboardingProgress> => {
    const updated = await authService.saveOnboardingProgress(progress)
    setOnboardingProgress(updated)
    return updated
  }

  const completeOnboarding = async (): Promise<AuthResult> => {
    setIsLoading(true)
    try {
      const res = await authService.completeOnboarding()
      if (res.success) {
        setAuthState(res.authState)
        const progress = await authService.getOnboardingProgress()
        setOnboardingProgress(progress)
        router.push("/dashboard")
      }
      return res
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        authState,
        isLoading,
        error,
        onboardingProgress,
        signIn,
        signUp,
        signOut,
        verifyIdentity,
        resendVerification,
        requestPasswordReset,
        resetPassword,
        updateOnboarding,
        completeOnboarding,
        refreshSession,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
