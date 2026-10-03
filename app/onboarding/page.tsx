"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth/auth-context"
import { AuthGuard } from "@/components/auth/auth-guard"
import { Logo } from "@/components/design-system/logo"
import { PixelBadge } from "@/components/ui/pixel-badge"
import { OnboardingProgress } from "@/components/onboarding/onboarding-progress"
import { StepWelcome } from "@/components/onboarding/steps/step-welcome"
import { StepProtectionOverview } from "@/components/onboarding/steps/step-protection-overview"
import { StepPlatformSelection } from "@/components/onboarding/steps/step-platform-selection"
import { StepProtectionSetup } from "@/components/onboarding/steps/step-protection-setup"
import { StepPrivacyPreferences } from "@/components/onboarding/steps/step-privacy-preferences"
import { StepAccountSecurity } from "@/components/onboarding/steps/step-account-security"
import { StepSecurityBaseline } from "@/components/onboarding/steps/step-security-baseline"
import { StepCompletion } from "@/components/onboarding/steps/step-completion"
import { Shield, Lock } from "lucide-react"

const STEP_TITLES = [
  "Welcome",
  "Protection Scope",
  "Primary Device",
  "Runtime Posture",
  "Privacy Rules",
  "MFA & Credentials",
  "Security Baseline",
  "Workspace Ready",
]

function OnboardingContent() {
  const { user, onboardingProgress, updateOnboarding, completeOnboarding } = useAuth()

  const [currentStep, setCurrentStep] = useState<number>(1)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  // Sync state from context on mount if already progressed
  useEffect(() => {
    if (onboardingProgress?.currentStep) {
      setCurrentStep(onboardingProgress.currentStep)
    }
  }, [onboardingProgress?.currentStep])

  const goToStep = async (stepNum: number) => {
    setCurrentStep(stepNum)
    const completed = Array.from(
      new Set([...(onboardingProgress?.completedSteps || []), currentStep])
    )
    await updateOnboarding({
      currentStep: stepNum,
      completedSteps: completed,
    })
  }

  const handleNext = () => {
    if (currentStep < 8) {
      goToStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    setIsSubmitting(true)
    try {
      await completeOnboarding()
    } finally {
      setIsSubmitting(false)
    }
  }

  // Fallback defaults if not yet hydrated
  const platform = onboardingProgress?.selectedPlatform || "macos"
  const consentPrefs = onboardingProgress?.consentPreferences || {
    localProcessingOnly: true,
    anonymousThreatHashSharing: true,
    optionalCrashTelemetry: false,
    automaticQuarantinePrompt: true,
  }
  const secPrefs = onboardingProgress?.securityPreferences || {
    mfaMethod: "passkey",
    mfaEnrolled: true,
    trustedDeviceName: "Primary Workstation",
    sessionTimeoutMinutes: 60,
  }
  const baseline = onboardingProgress?.baselineReadiness || {
    accountScore: 98,
    authScore: 90,
    deviceScore: 94,
    privacyScore: 95,
    overallReadiness: 94,
    status: "OPTIMAL",
    recommendations: [
      "Master identity verified with cryptographically secure session storage",
      "Local-first zero-knowledge inference heuristics active",
      "User-space process and network socket isolation verified",
      "Autonomous quarantine encrypted vault initialized",
    ],
  }

  return (
    <div className="min-h-screen bg-[#04070d] text-slate-100 flex flex-col justify-between relative overflow-hidden">
      {/* Background Subtle Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-40" />

      {/* Top Header */}
      <header className="border-b border-slate-800 bg-[#080d16]/90 backdrop-blur-md px-4 sm:px-6 py-3 relative z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo href="/" size="sm" />
            <span className="text-slate-700">|</span>
            <PixelBadge variant="phosphor" size="sm" dot>
              Device Setup
            </PixelBadge>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <div className="hidden sm:flex items-center gap-1.5 text-[#00e5ff]">
              <Lock className="w-3.5 h-3.5" />
              <span className="text-[11px]">Encrypted Setup</span>
            </div>
            <span className="hidden sm:inline text-slate-700">•</span>
            <span className="text-[11px] text-slate-300 font-mono">Platform: {platform.toUpperCase()}</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col justify-center relative z-10">
        {/* Progress Tracker */}
        <div className="mb-6">
          <OnboardingProgress
            currentStep={currentStep}
            totalSteps={8}
            stepTitles={STEP_TITLES}
            completedSteps={onboardingProgress?.completedSteps || []}
            onStepClick={(step) => goToStep(step)}
          />
        </div>

        {/* Dynamic Step View Container */}
        <div className="p-6 sm:p-8 rounded-xl border border-slate-800 bg-[#080d16] shadow-2xl">
          {currentStep === 1 && (
            <StepWelcome onNext={handleNext} userEmail={user?.email} />
          )}

          {currentStep === 2 && (
            <StepProtectionOverview onNext={handleNext} onBack={handleBack} />
          )}

          {currentStep === 3 && (
            <StepPlatformSelection
              selectedPlatform={platform}
              onSelectPlatform={(p) => updateOnboarding({ selectedPlatform: p })}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 4 && (
            <StepProtectionSetup platform={platform} onNext={handleNext} onBack={handleBack} />
          )}

          {currentStep === 5 && (
            <StepPrivacyPreferences
              preferences={consentPrefs}
              onChange={(prefs) =>
                updateOnboarding({ consentPreferences: { ...consentPrefs, ...prefs } })
              }
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 6 && (
            <StepAccountSecurity
              preferences={secPrefs}
              onChange={(prefs) =>
                updateOnboarding({ securityPreferences: { ...secPrefs, ...prefs } })
              }
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 7 && (
            <StepSecurityBaseline
              baseline={baseline}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 8 && (
            <StepCompletion
              progress={
                onboardingProgress || {
                  currentStep: 8,
                  completedSteps: [1, 2, 3, 4, 5, 6, 7, 8],
                  skippedSteps: [],
                  selectedPlatform: platform,
                  consentPreferences: consentPrefs,
                  securityPreferences: secPrefs,
                  baselineReadiness: baseline,
                  isCompleted: false,
                }
              }
              onComplete={handleComplete}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 px-4 sm:px-6 py-3 text-center text-[11px] text-slate-500 font-mono bg-[#080d16]/80 relative z-10">
        AgeIS-X Security Operating System • Zero-Knowledge Core • Hardware Enclave Attestation
      </footer>
    </div>
  )
}

export default function OnboardingPage() {
  return (
    <AuthGuard requireVerified={true} requireOnboarded={false}>
      <OnboardingContent />
    </AuthGuard>
  )
}
