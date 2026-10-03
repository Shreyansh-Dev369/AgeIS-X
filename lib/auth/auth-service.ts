import {
  User,
  UserSession,
  AuthState,
  AuthResult,
  AuthError,
  OnboardingProgress,
  ConsentPreferences,
  SecurityPreferences,
  BaselineReadiness,
} from "@/types/auth"

export interface IAuthService {
  signUp(data: { name: string; email: string; password?: string }): Promise<AuthResult>
  signIn(data: { email: string; password?: string; rememberDevice?: boolean }): Promise<AuthResult>
  signOut(): Promise<void>
  getSession(): Promise<{ user: User | null; session: UserSession | null; authState: AuthState }>
  verifyIdentity(code: string): Promise<AuthResult>
  resendVerification(): Promise<{ success: boolean; error?: AuthError }>
  requestPasswordReset(email: string): Promise<{ success: boolean; error?: AuthError }>
  validateResetToken(token: string): Promise<{ valid: boolean; email?: string; error?: AuthError }>
  resetPassword(token: string, newPassword: string): Promise<{ success: boolean; error?: AuthError }>
  getOnboardingProgress(): Promise<OnboardingProgress>
  saveOnboardingProgress(progress: Partial<OnboardingProgress>): Promise<OnboardingProgress>
  completeOnboarding(): Promise<AuthResult>
  getSessions(): Promise<UserSession[]>
  revokeSession(sessionId: string): Promise<{ success: boolean }>
  updateSecurityPreferences(prefs: Partial<SecurityPreferences>): Promise<SecurityPreferences>
  updateConsentPreferences(prefs: Partial<ConsentPreferences>): Promise<ConsentPreferences>
}

// Default Baseline Calculation helper (deterministic, zero fake scans)
export function calculateBaselineReadiness(
  user: User | null,
  progress: Partial<OnboardingProgress>
): BaselineReadiness {
  let accountScore = 20
  let authScore = 20
  let deviceScore = 15
  let privacyScore = 20

  const recommendations: string[] = []

  if (user?.emailVerified || progress?.completedSteps?.includes(2)) {
    accountScore += 10
  } else {
    recommendations.push("Complete email identity verification.")
  }

  if (progress?.securityPreferences?.mfaEnrolled) {
    authScore += 15
  } else {
    recommendations.push("Enroll hardware passkey or authenticator MFA.")
  }

  if (progress?.selectedPlatform) {
    deviceScore += 15
  } else {
    recommendations.push("Select primary endpoint operating system.")
  }

  if (progress?.consentPreferences?.localProcessingOnly) {
    privacyScore += 10
  }

  const overallReadiness = Math.min(100, accountScore + authScore + deviceScore + privacyScore)
  const status =
    overallReadiness >= 85 ? "OPTIMAL" : overallReadiness >= 65 ? "BASELINE_READY" : "ACTION_REQUIRED"

  return {
    accountScore,
    authScore,
    deviceScore,
    privacyScore,
    overallReadiness,
    status,
    recommendations,
  }
}

const DEFAULT_ONBOARDING: OnboardingProgress = {
  currentStep: 1,
  completedSteps: [],
  skippedSteps: [],
  consentPreferences: {
    localProcessingOnly: true,
    anonymousThreatHashSharing: true,
    optionalCrashTelemetry: false,
    automaticQuarantinePrompt: true,
  },
  securityPreferences: {
    mfaMethod: "none",
    mfaEnrolled: false,
    trustedDeviceName: "Primary Workstation",
    sessionTimeoutMinutes: 60,
  },
  baselineReadiness: {
    accountScore: 20,
    authScore: 20,
    deviceScore: 15,
    privacyScore: 20,
    overallReadiness: 75,
    status: "BASELINE_READY",
    recommendations: ["Enroll hardware passkey MFA."],
  },
  isCompleted: false,
}

// Storage Keys for Dev Session State (NEVER stores plaintext credentials)
const STORAGE_KEYS = {
  SESSION_TOKEN: "ageisx_auth_token_dev",
  USER_DATA: "ageisx_user_dev",
  ONBOARDING: "ageisx_onboarding_dev",
  SESSIONS_LIST: "ageisx_sessions_dev",
}

class DevAuthService implements IAuthService {
  private isBrowser(): boolean {
    return typeof window !== "undefined"
  }

  private getStoredUser(): User | null {
    if (!this.isBrowser()) return null
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_DATA)
      return data ? JSON.parse(data) : null
    } catch {
      return null
    }
  }

  private setStoredUser(user: User | null): void {
    if (!this.isBrowser()) return
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user))
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER_DATA)
      }
    } catch {}
  }

  async signUp(data: { name: string; email: string; password?: string }): Promise<AuthResult> {
    await new Promise((r) => setTimeout(r, 500))

    if (!data.email || !data.email.includes("@")) {
      return {
        success: false,
        authState: "error",
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Please enter a valid email address.",
        },
      }
    }

    if (data.password && data.password.length < 8) {
      return {
        success: false,
        authState: "error",
        error: {
          code: "PASSWORD_WEAK",
          message: "Password must be at least 8 characters with numbers and symbols.",
        },
      }
    }

    const newUser: User = {
      id: `usr_${Date.now().toString(36)}`,
      email: data.email.toLowerCase().trim(),
      name: data.name.trim() || "SecOps Administrator",
      role: "secops_lead",
      emailVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const session: UserSession = {
      id: `ses_${Date.now().toString(36)}`,
      userId: newUser.id,
      token: `tok_${Math.random().toString(36).substring(2)}`,
      device: {
        name: "Current Device",
        platform: "Web",
        browser: "Chrome / Safari",
        ip: "127.0.0.1",
        isCurrent: true,
        lastActive: "Just now",
        location: "Local Session",
      },
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(),
      status: "active",
    }

    this.setStoredUser(newUser)
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.SESSION_TOKEN, session.token)
      localStorage.setItem(
        STORAGE_KEYS.ONBOARDING,
        JSON.stringify({ ...DEFAULT_ONBOARDING, currentStep: 1 })
      )
    }

    return {
      success: true,
      user: newUser,
      session,
      authState: "verification_required",
      nextRoute: "/verify",
    }
  }

  async signIn(data: { email: string; password?: string; rememberDevice?: boolean }): Promise<AuthResult> {
    await new Promise((r) => setTimeout(r, 600))

    const cleanEmail = (data.email || "").toLowerCase().trim()

    if (!cleanEmail || !cleanEmail.includes("@")) {
      return {
        success: false,
        authState: "error",
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Invalid email or authentication credential.",
        },
      }
    }

    let existingUser = this.getStoredUser()

    if (!existingUser || existingUser.email !== cleanEmail) {
      existingUser = {
        id: `usr_demo_${Date.now().toString(36)}`,
        email: cleanEmail,
        name: cleanEmail.split("@")[0],
        role: "secops_lead",
        emailVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      this.setStoredUser(existingUser)
    }

    const session: UserSession = {
      id: `ses_${Date.now().toString(36)}`,
      userId: existingUser.id,
      token: `tok_${Math.random().toString(36).substring(2)}`,
      device: {
        name: "Current Browser",
        platform: "Web",
        browser: "Modern Browser",
        ip: "127.0.0.1",
        isCurrent: true,
        lastActive: "Just now",
        location: "Local Session",
      },
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + (data.rememberDevice ? 30 : 7) * 86400000).toISOString(),
      status: "active",
    }

    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.SESSION_TOKEN, session.token)
    }

    const onboarding = await this.getOnboardingProgress()

    if (!existingUser.emailVerified) {
      return {
        success: true,
        user: existingUser,
        session,
        authState: "verification_required",
        nextRoute: "/verify",
      }
    }

    if (!onboarding.isCompleted) {
      return {
        success: true,
        user: existingUser,
        session,
        authState: "onboarding_required",
        nextRoute: "/onboarding",
      }
    }

    return {
      success: true,
      user: existingUser,
      session,
      authState: "authenticated",
      nextRoute: "/dashboard",
    }
  }

  async signOut(): Promise<void> {
    if (this.isBrowser()) {
      localStorage.removeItem(STORAGE_KEYS.SESSION_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER_DATA)
    }
  }

  async getSession(): Promise<{ user: User | null; session: UserSession | null; authState: AuthState }> {
    if (!this.isBrowser()) {
      return { user: null, session: null, authState: "anonymous" }
    }

    const token = localStorage.getItem(STORAGE_KEYS.SESSION_TOKEN)
    const user = this.getStoredUser()

    if (!token || !user) {
      return { user: null, session: null, authState: "anonymous" }
    }

    const session: UserSession = {
      id: "ses_active",
      userId: user.id,
      token,
      device: {
        name: "Local Workstation",
        platform: "macOS",
        browser: "Current Browser",
        ip: "127.0.0.1",
        isCurrent: true,
        lastActive: "Active now",
        location: "Protected Node",
      },
      createdAt: user.createdAt,
      expiresAt: new Date(Date.now() + 86400000 * 7).toISOString(),
      status: "active",
    }

    if (!user.emailVerified) {
      return { user, session, authState: "verification_required" }
    }

    const onboarding = await this.getOnboardingProgress()
    if (!onboarding.isCompleted) {
      return { user, session, authState: "onboarding_required" }
    }

    return { user, session, authState: "authenticated" }
  }

  async verifyIdentity(code: string): Promise<AuthResult> {
    await new Promise((r) => setTimeout(r, 400))

    if (code.length < 6) {
      return {
        success: false,
        authState: "error",
        error: {
          code: "VERIFICATION_INVALID",
          message: "Please enter the complete 6-digit verification code.",
        },
      }
    }

    const user = this.getStoredUser()
    if (user) {
      user.emailVerified = true
      user.updatedAt = new Date().toISOString()
      this.setStoredUser(user)
    }

    return {
      success: true,
      user: user || undefined,
      authState: "onboarding_required",
      nextRoute: "/onboarding",
    }
  }

  async resendVerification(): Promise<{ success: boolean; error?: AuthError }> {
    await new Promise((r) => setTimeout(r, 300))
    return { success: true }
  }

  async requestPasswordReset(email: string): Promise<{ success: boolean; error?: AuthError }> {
    await new Promise((r) => setTimeout(r, 500))
    // Neutral response to prevent account enumeration
    return { success: true }
  }

  async validateResetToken(token: string): Promise<{ valid: boolean; email?: string; error?: AuthError }> {
    await new Promise((r) => setTimeout(r, 300))
    if (!token || token === "invalid" || token === "expired") {
      return {
        valid: false,
        error: {
          code: "RECOVERY_TOKEN_EXPIRED",
          message: "This password recovery token has expired or is invalid.",
        },
      }
    }
    return { valid: true, email: "user@example.com" }
  }

  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; error?: AuthError }> {
    await new Promise((r) => setTimeout(r, 500))
    if (newPassword.length < 8) {
      return {
        success: false,
        error: {
          code: "PASSWORD_WEAK",
          message: "New password must be at least 8 characters.",
        },
      }
    }
    return { success: true }
  }

  async getOnboardingProgress(): Promise<OnboardingProgress> {
    if (!this.isBrowser()) return DEFAULT_ONBOARDING
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ONBOARDING)
      if (data) return JSON.parse(data)
    } catch {}
    return DEFAULT_ONBOARDING
  }

  async saveOnboardingProgress(progress: Partial<OnboardingProgress>): Promise<OnboardingProgress> {
    const current = await this.getOnboardingProgress()
    const updated: OnboardingProgress = {
      ...current,
      ...progress,
      consentPreferences: {
        ...current.consentPreferences,
        ...(progress.consentPreferences || {}),
      },
      securityPreferences: {
        ...current.securityPreferences,
        ...(progress.securityPreferences || {}),
      },
      baselineReadiness: calculateBaselineReadiness(this.getStoredUser(), {
        ...current,
        ...progress,
      }),
    }

    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.ONBOARDING, JSON.stringify(updated))
    }

    return updated
  }

  async completeOnboarding(): Promise<AuthResult> {
    const progress = await this.saveOnboardingProgress({
      isCompleted: true,
      completedAt: new Date().toISOString(),
    })

    const user = this.getStoredUser()

    return {
      success: true,
      user: user || undefined,
      authState: "authenticated",
      nextRoute: "/dashboard",
    }
  }

  async getSessions(): Promise<UserSession[]> {
    const user = this.getStoredUser()
    const now = new Date()

    return [
      {
        id: "ses_curr",
        userId: user?.id || "usr_1",
        token: "tok_current",
        device: {
          name: "MacBook Pro 16 (Current)",
          platform: "macOS",
          browser: "Chrome 128.0",
          ip: "192.168.1.42",
          isCurrent: true,
          lastActive: "Active now",
          location: "San Francisco, US",
        },
        createdAt: new Date(now.getTime() - 3600000 * 2).toISOString(),
        expiresAt: new Date(now.getTime() + 86400000 * 28).toISOString(),
        status: "active",
      },
      {
        id: "ses_2",
        userId: user?.id || "usr_1",
        token: "tok_mobile",
        device: {
          name: "iPhone 15 Pro",
          platform: "iOS",
          browser: "Mobile Safari 17.5",
          ip: "10.0.12.8",
          isCurrent: false,
          lastActive: "45 mins ago",
          location: "San Francisco, US",
        },
        createdAt: new Date(now.getTime() - 86400000 * 3).toISOString(),
        expiresAt: new Date(now.getTime() + 86400000 * 25).toISOString(),
        status: "active",
      },
      {
        id: "ses_3",
        userId: user?.id || "usr_1",
        token: "tok_linux",
        device: {
          name: "Linux Dev Workstation",
          platform: "Linux",
          browser: "Firefox 130.0",
          ip: "10.0.4.15",
          isCurrent: false,
          lastActive: "2 days ago",
          location: "Internal Cluster",
        },
        createdAt: new Date(now.getTime() - 86400000 * 6).toISOString(),
        expiresAt: new Date(now.getTime() + 86400000 * 22).toISOString(),
        status: "active",
      },
    ]
  }

  async revokeSession(sessionId: string): Promise<{ success: boolean }> {
    await new Promise((r) => setTimeout(r, 300))
    return { success: true }
  }

  async updateSecurityPreferences(prefs: Partial<SecurityPreferences>): Promise<SecurityPreferences> {
    const onboarding = await this.getOnboardingProgress()
    const updated = { ...onboarding.securityPreferences, ...prefs }
    await this.saveOnboardingProgress({ securityPreferences: updated })
    return updated
  }

  async updateConsentPreferences(prefs: Partial<ConsentPreferences>): Promise<ConsentPreferences> {
    const onboarding = await this.getOnboardingProgress()
    const updated = { ...onboarding.consentPreferences, ...prefs }
    await this.saveOnboardingProgress({ consentPreferences: updated })
    return updated
  }
}

export const authService: IAuthService = new DevAuthService()
