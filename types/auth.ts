export type AuthState =
  | "anonymous"
  | "authenticating"
  | "authenticated"
  | "verification_required"
  | "security_setup_required"
  | "onboarding_required"
  | "session_expired"
  | "session_revoked"
  | "account_locked"
  | "recovery_in_progress"
  | "error"

export type VerificationStatus =
  | "pending"
  | "sent"
  | "verifying"
  | "verified"
  | "expired"
  | "failed"

export type RecoveryStatus =
  | "idle"
  | "requesting"
  | "sent"
  | "validating_token"
  | "resetting"
  | "success"
  | "expired"
  | "invalid"
  | "error"

export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "secops_lead" | "developer" | "member"
  emailVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface UserSession {
  id: string
  userId: string
  token: string
  device: {
    name: string
    platform: "macOS" | "Windows" | "Linux" | "iOS" | "Android" | "Web"
    browser: string
    ip: string
    isCurrent: boolean
    lastActive: string
    location?: string
  }
  createdAt: string
  expiresAt: string
  status: "active" | "expired" | "revoked"
}

export interface ConsentPreferences {
  localProcessingOnly: boolean
  anonymousThreatHashSharing: boolean
  optionalCrashTelemetry: boolean
  automaticQuarantinePrompt: boolean
}

export interface SecurityPreferences {
  mfaMethod: "passkey" | "authenticator" | "sms" | "none"
  mfaEnrolled: boolean
  trustedDeviceName: string
  sessionTimeoutMinutes: number
}

export interface BaselineReadiness {
  accountScore: number
  authScore: number
  deviceScore: number
  privacyScore: number
  overallReadiness: number
  status: "OPTIMAL" | "ACTION_REQUIRED" | "BASELINE_READY"
  recommendations: string[]
}

export interface OnboardingProgress {
  currentStep: number // 1 to 8
  completedSteps: number[]
  skippedSteps: number[]
  selectedPlatform?: "macos" | "windows" | "linux" | "android" | "ios" | "browser"
  consentPreferences: ConsentPreferences
  securityPreferences: SecurityPreferences
  baselineReadiness: BaselineReadiness
  isCompleted: boolean
  completedAt?: string
}

export interface AuthResult {
  success: boolean
  user?: User
  session?: UserSession
  authState: AuthState
  nextRoute?: string
  error?: AuthError
}

export interface AuthError {
  code:
    | "INVALID_CREDENTIALS"
    | "USER_EXISTS"
    | "PASSWORD_WEAK"
    | "VERIFICATION_REQUIRED"
    | "VERIFICATION_EXPIRED"
    | "VERIFICATION_INVALID"
    | "RECOVERY_TOKEN_INVALID"
    | "RECOVERY_TOKEN_EXPIRED"
    | "SESSION_EXPIRED"
    | "SESSION_REVOKED"
    | "RATE_LIMITED"
    | "ACCOUNT_LOCKED"
    | "NETWORK_ERROR"
    | "UNKNOWN_ERROR"
  message: string
  retryAfterSeconds?: number
}
