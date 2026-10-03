"use client"

import React, { useState, useEffect } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { PixelBadge } from "@/components/ui/pixel-badge"
import { useAuth } from "@/lib/auth/auth-context"
import { authService } from "@/lib/auth/auth-service"
import { UserSession } from "@/types/auth"
import {
  User,
  KeyRound,
  Shield,
  Laptop,
  Smartphone,
  Globe,
  Bell,
  Save,
  Lock,
  EyeOff,
  Trash2,
  CheckCircle2,
  RefreshCw,
  LogOut,
  SlidersHorizontal,
} from "lucide-react"

export default function SettingsPage() {
  const { user, onboardingProgress, updateOnboarding, signOut } = useAuth()

  const [activeTab, setActiveTab] = useState<"account" | "mfa" | "sessions" | "privacy" | "daemon">("account")
  const [sessions, setSessions] = useState<UserSession[]>([])
  const [loadingSessions, setLoadingSessions] = useState(false)
  const [saved, setSaved] = useState(false)
  const [revokingId, setRevokingId] = useState<string | null>(null)
  const [notification, setNotification] = useState<string | null>(null)

  const [privacyPrefs, setPrivacyPrefs] = useState({
    localProcessingOnly: true,
    anonymousThreatHashSharing: true,
    optionalCrashTelemetry: false,
    automaticQuarantinePrompt: true,
  })

  const [secPrefs, setSecPrefs] = useState({
    mfaMethod: "passkey" as "passkey" | "authenticator" | "sms" | "none",
    mfaEnrolled: true,
    trustedDeviceName: "Primary Workstation",
    sessionTimeoutMinutes: 60,
  })

  useEffect(() => {
    if (onboardingProgress) {
      if (onboardingProgress.consentPreferences) {
        setPrivacyPrefs(onboardingProgress.consentPreferences)
      }
      if (onboardingProgress.securityPreferences) {
        setSecPrefs(onboardingProgress.securityPreferences)
      }
    }
  }, [onboardingProgress])

  useEffect(() => {
    async function loadSessions() {
      setLoadingSessions(true)
      try {
        const list = await authService.getSessions()
        setSessions(list)
      } finally {
        setLoadingSessions(false)
      }
    }
    loadSessions()
  }, [])

  const handleRevokeSession = async (sessionId: string) => {
    setRevokingId(sessionId)
    try {
      await authService.revokeSession(sessionId)
      setSessions((prev) => prev.filter((s) => s.id !== sessionId))
      setNotification("Session revoked successfully.")
      setTimeout(() => setNotification(null), 3000)
    } finally {
      setRevokingId(null)
    }
  }

  const handleRevokeAllOther = async () => {
    setRevokingId("all")
    try {
      setSessions((prev) => prev.filter((s) => s.device.isCurrent))
      setNotification("All other remote sessions have been revoked.")
      setTimeout(() => setNotification(null), 3000)
    } finally {
      setRevokingId(null)
    }
  }

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateOnboarding({
      consentPreferences: privacyPrefs,
      securityPreferences: secPrefs,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <AppShell
      title="Settings & Policies"
      breadcrumbs={[{ label: "Overview", href: "/dashboard" }, { label: "Settings" }]}
    >
      <div className="space-y-6 max-w-4xl">
        {notification && (
          <div className="p-3.5 rounded-lg border border-[#00e575]/40 bg-[#00e575]/10 text-[#00e575] text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{notification}</span>
            </div>
            <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-white text-xs">
              Dismiss
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 border-b border-slate-800 pb-px overflow-x-auto text-xs">
          {[
            { id: "account" as const, label: "Identity Profile", icon: User },
            { id: "mfa" as const, label: "MFA & Passkeys", icon: KeyRound },
            { id: "sessions" as const, label: `Active Sessions (${sessions.length})`, icon: Laptop },
            { id: "privacy" as const, label: "Privacy Controls", icon: EyeOff },
            { id: "daemon" as const, label: "Engine & Daemon", icon: Shield },
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-t-lg font-medium transition-all flex items-center gap-2 shrink-0 border-t border-x ${
                  isActive
                    ? "bg-[#080d16] border-slate-800 text-[#00e575]"
                    : "bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#080d16]/50"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Tab 1: Master Identity Profile */}
        {activeTab === "account" && (
          <div className="space-y-4">
            <div className="p-6 rounded-lg space-y-5 border border-slate-800 bg-[#080d16]">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4 text-[#00e575]" />
                  <h2 className="text-sm font-bold text-slate-100">Master Security Identity</h2>
                </div>
                <PixelBadge variant="phosphor" size="sm">
                  Active
                </PixelBadge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-medium block">Full Name / Handle</label>
                  <Input
                    defaultValue={user?.name || "SecOps Administrator"}
                    readOnly
                    className="bg-[#04070d]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-medium block">Registered Email</label>
                  <Input
                    defaultValue={user?.email || "admin@ageis-x.corp"}
                    readOnly
                    className="bg-[#04070d]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-medium block">Permission Tier</label>
                  <Input
                    defaultValue={user?.role?.toUpperCase() || "SECOPS LEAD"}
                    readOnly
                    className="bg-[#04070d] text-[#00e5ff] font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-medium block">Account Identifier</label>
                  <Input
                    defaultValue={user?.id || "usr_core_894f2"}
                    readOnly
                    className="bg-[#04070d] text-slate-400 font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#080d16] border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-200">Sign Out of All Sessions</p>
                <p className="text-[11px] text-slate-400">Terminates all operator sessions and purges local cryptographic cache.</p>
              </div>
              <Button
                variant="outline"
                onClick={() => signOut()}
                className="border-[#ff4b4b]/40 text-[#ff4b4b] hover:bg-[#ff4b4b]/10 text-xs h-8"
              >
                <LogOut className="w-3.5 h-3.5 mr-1.5" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        )}

        {/* Tab 2: MFA & Passkeys */}
        {activeTab === "mfa" && (
          <div className="space-y-4">
            <div className="p-6 rounded-lg space-y-5 border border-slate-800 bg-[#080d16]">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <KeyRound className="w-4 h-4 text-[#00e575]" />
                  <h2 className="text-sm font-bold text-slate-100">Multi-Factor Credentials</h2>
                </div>
                <PixelBadge variant="phosphor" size="sm">
                  Enforced
                </PixelBadge>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-4 bg-[#04070d] rounded-lg border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg border border-[#00e575]/30 bg-[#00e575]/10 text-[#00e575] flex items-center justify-center">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-100">FIDO2 WebAuthn Passkey</p>
                      <p className="text-[11px] text-slate-400">Biometric Secure Enclave / Hardware Token YubiKey</p>
                    </div>
                  </div>
                  <PixelBadge variant="phosphor" size="sm">
                    Primary Factor
                  </PixelBadge>
                </div>

                <div className="p-4 bg-[#04070d] rounded-lg border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg border border-slate-800 bg-[#080d16] text-slate-400 flex items-center justify-center">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-100">TOTP Authenticator App</p>
                      <p className="text-[11px] text-slate-400">1Password / Google Authenticator Dynamic 6-Digit Code</p>
                    </div>
                  </div>
                  <Button variant="outline" className="text-xs h-8 border-slate-700 bg-slate-900">
                    Configure
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Active Sessions */}
        {activeTab === "sessions" && (
          <div className="space-y-4">
            <div className="p-6 rounded-lg space-y-5 border border-slate-800 bg-[#080d16]">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h2 className="text-sm font-bold text-slate-100">Authenticated Device Sessions</h2>
                  <p className="text-xs text-slate-400">Manage endpoints authorized to access your security telemetry.</p>
                </div>
                {sessions.length > 1 && (
                  <Button
                    variant="outline"
                    onClick={handleRevokeAllOther}
                    disabled={revokingId === "all"}
                    className="border-[#ff4b4b]/40 text-[#ff4b4b] hover:bg-[#ff4b4b]/10 text-xs h-8 gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Revoke Other Sessions</span>
                  </Button>
                )}
              </div>

              {loadingSessions ? (
                <div className="py-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#00e575]" />
                  <span>Loading active sessions...</span>
                </div>
              ) : (
                <div className="space-y-2.5 text-xs">
                  {sessions.map((ses) => (
                    <div
                      key={ses.id}
                      className="p-4 bg-[#04070d] rounded-lg border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-lg border flex items-center justify-center ${
                            ses.device.isCurrent
                              ? "bg-[#00e575]/10 border-[#00e575]/40 text-[#00e575]"
                              : "bg-[#080d16] border-slate-800 text-slate-400"
                          }`}
                        >
                          {ses.device.platform === "iOS" || ses.device.platform === "Android" ? (
                            <Smartphone className="w-4 h-4" />
                          ) : (
                            <Laptop className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-100">{ses.device.name}</span>
                            {ses.device.isCurrent && (
                              <PixelBadge variant="phosphor" size="sm">
                                This Device
                              </PixelBadge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                            <span>{ses.device.browser}</span>
                            <span>•</span>
                            <span className="font-mono">{ses.device.ip}</span>
                            <span>•</span>
                            <span>{ses.device.location || "Local"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                        <span className="text-[11px] font-mono text-slate-400">{ses.device.lastActive}</span>
                        {!ses.device.isCurrent && (
                          <Button
                            variant="outline"
                            onClick={() => handleRevokeSession(ses.id)}
                            disabled={revokingId === ses.id}
                            className="border-slate-800 hover:border-[#ff4b4b] hover:text-[#ff4b4b] text-xs h-7 px-2.5"
                          >
                            {revokingId === ses.id ? "Revoking..." : "Revoke"}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Privacy & Telemetry */}
        {activeTab === "privacy" && (
          <form onSubmit={handleSavePreferences} className="space-y-4">
            <div className="p-6 rounded-lg space-y-5 border border-slate-800 bg-[#080d16]">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
                <EyeOff className="w-4 h-4 text-[#00e575]" />
                <h2 className="text-sm font-bold text-slate-100">Zero-Knowledge Privacy Controls</h2>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="p-4 bg-[#04070d] rounded-lg border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-100">Local Heuristic Execution</p>
                    <p className="text-xs text-slate-400 mt-0.5">Execute threat models locally without raw payload egress.</p>
                  </div>
                  <Toggle
                    checked={privacyPrefs.localProcessingOnly}
                    onCheckedChange={(c) => setPrivacyPrefs((p) => ({ ...p, localProcessingOnly: c }))}
                    aria-label="Toggle local processing"
                  />
                </div>

                <div className="p-4 bg-[#04070d] rounded-lg border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-100">Anonymous Threat-Hash Sharing</p>
                    <p className="text-xs text-slate-400 mt-0.5">Contribute one-way SHA-256 signatures to the threat intelligence network.</p>
                  </div>
                  <Toggle
                    checked={privacyPrefs.anonymousThreatHashSharing}
                    onCheckedChange={(c) => setPrivacyPrefs((p) => ({ ...p, anonymousThreatHashSharing: c }))}
                    aria-label="Toggle anonymous hash sharing"
                  />
                </div>

                <div className="p-4 bg-[#04070d] rounded-lg border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-100">Autonomous Quarantine Prompts</p>
                    <p className="text-xs text-slate-400 mt-0.5">Prompt operator before isolating newly flagged suspicious binaries.</p>
                  </div>
                  <Toggle
                    checked={privacyPrefs.automaticQuarantinePrompt}
                    onCheckedChange={(c) => setPrivacyPrefs((p) => ({ ...p, automaticQuarantinePrompt: c }))}
                    aria-label="Toggle quarantine prompt"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button type="submit" className="text-xs font-medium h-9 px-4 gap-2 bg-[#00e575] text-[#04070d] hover:bg-[#00c966]">
                <Save className="w-4 h-4" />
                <span>Save Privacy Settings</span>
              </Button>
              {saved && (
                <PixelBadge variant="phosphor" size="sm">
                  Saved Successfully
                </PixelBadge>
              )}
            </div>
          </form>
        )}

        {/* Tab 5: Local Daemon & Engine Settings */}
        {activeTab === "daemon" && (
          <form onSubmit={handleSavePreferences} className="space-y-4">
            <div className="p-6 rounded-lg space-y-5 border border-slate-800 bg-[#080d16]">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
                <Bell className="w-4 h-4 text-[#00e5ff]" />
                <h2 className="text-sm font-bold text-slate-100">Engine Sensitivity & Local Daemon</h2>
              </div>

              <div className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-medium block">Inference Sensitivity Threshold</label>
                  <Select defaultValue="strict">
                    <SelectTrigger className="w-full sm:w-72 bg-[#04070d] border-slate-800 text-xs">
                      <SelectValue placeholder="Select threshold" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#080d16] border-slate-800 text-xs text-slate-100">
                      <SelectItem value="aggressive">Aggressive (Block &gt; 50% probability)</SelectItem>
                      <SelectItem value="strict">Standard Strict (Block &gt; 70% probability)</SelectItem>
                      <SelectItem value="permissive">Passive Logging Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-medium block">Local Daemon Ingestion URL</label>
                  <Input
                    defaultValue="http://127.0.0.1:8000"
                    className="font-mono bg-[#04070d]"
                  />
                  <p className="text-[11px] text-slate-400">Localhost inference daemon port for `/predict` calls.</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button type="submit" className="text-xs font-medium h-9 px-4 gap-2 bg-[#00e575] text-[#04070d] hover:bg-[#00c966]">
                <Save className="w-4 h-4" />
                <span>Save Daemon Configuration</span>
              </Button>
              {saved && (
                <PixelBadge variant="phosphor" size="sm">
                  Saved Successfully
                </PixelBadge>
              )}
            </div>
          </form>
        )}
      </div>
    </AppShell>
  )
}
