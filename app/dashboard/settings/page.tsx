"use client"

import React, { useState, useEffect } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { PixelBadge } from "@/components/ui/pixel-badge"
import { TacticalFrame } from "@/components/ui/tactical-frame"
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
      title="Security Policy & System Settings"
      breadcrumbs={[{ label: "Overview", href: "/dashboard" }, { label: "Settings // Policy" }]}
    >
      <div className="space-y-6 max-w-5xl font-mono select-none">
        {notification && (
          <div className="p-3 border border-[#00ff66]/40 bg-[#00ff66]/10 text-[#00ff66] text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{notification}</span>
            </div>
            <button onClick={() => setNotification(null)} className="text-[#7e8b9b] hover:text-white text-xs">
              [ DISMISS ]
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 border-b border-white/10 pb-px overflow-x-auto text-xs">
          {[
            { id: "account" as const, label: "MASTER IDENTITY", icon: User },
            { id: "mfa" as const, label: "MFA // PASSKEYS", icon: KeyRound },
            { id: "sessions" as const, label: `SESSIONS (${sessions.length})`, icon: Laptop },
            { id: "privacy" as const, label: "PRIVACY // TELEMETRY", icon: EyeOff },
            { id: "daemon" as const, label: "ENGINE // DAEMON", icon: Shield },
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 uppercase font-bold transition-all flex items-center gap-2 shrink-0 border-t border-x ${
                  isActive
                    ? "bg-[#080c10] border-white/20 text-[#00ff66] shadow-[0_0_8px_rgba(0,255,102,0.15)]"
                    : "bg-[#040608] border-transparent text-[#7e8b9b] hover:text-[#f8fafc] hover:bg-[#080c10]"
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
            <TacticalFrame variant="panel" className="p-6 space-y-4 border-white/15 bg-[#080c10]">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#00ff66]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#f8fafc]">Master Security Identity</h3>
                </div>
                <PixelBadge variant="phosphor" size="sm">
                  IDENTITY ACTIVE
                </PixelBadge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-[11px] text-[#7e8b9b] uppercase block">OPERATOR_HANDLE</label>
                  <Input
                    defaultValue={user?.name || "SecOps Administrator"}
                    readOnly
                    className="bg-[#040608]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] text-[#7e8b9b] uppercase block">MASTER_EMAIL</label>
                  <Input
                    defaultValue={user?.email || "admin@ageis-x.corp"}
                    readOnly
                    className="bg-[#040608]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] text-[#7e8b9b] uppercase block">PERMISSION_TIER</label>
                  <Input
                    defaultValue={user?.role?.toUpperCase() || "SECOPS_LEAD"}
                    readOnly
                    className="bg-[#040608] text-[#00f0ff]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] text-[#7e8b9b] uppercase block">ACCOUNT_UUID</label>
                  <Input
                    defaultValue={user?.id || "usr_core_894f2"}
                    readOnly
                    className="bg-[#040608] text-[#7e8b9b]"
                  />
                </div>
              </div>
            </TacticalFrame>

            <TacticalFrame variant="default" className="p-4 bg-[#080c10] border-white/10 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase text-[#f8fafc]">TERMINATE ALL ACTIVE SESSIONS</p>
                <p className="text-[10px] text-[#7e8b9b]">Terminates all operator sessions and purges local cryptographic cache.</p>
              </div>
              <Button
                variant="outline"
                onClick={() => signOut()}
                className="border-[#ff3b30]/40 text-[#ff3b30] hover:bg-[#ff3b30]/10 text-xs font-mono uppercase tracking-wider h-8"
              >
                <LogOut className="w-3.5 h-3.5 mr-1" />
                <span>[ SIGN OUT ]</span>
              </Button>
            </TacticalFrame>
          </div>
        )}

        {/* Tab 2: MFA & Passkeys */}
        {activeTab === "mfa" && (
          <div className="space-y-4">
            <TacticalFrame variant="panel" className="p-6 space-y-4 border-white/15 bg-[#080c10]">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-[#00ff66]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#f8fafc]">Multi-Factor Credentials</h3>
                </div>
                <PixelBadge variant="phosphor" size="sm">
                  ENFORCED
                </PixelBadge>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-[#040608] border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 border border-[#00ff66]/30 bg-[#00ff66]/10 text-[#00ff66] flex items-center justify-center">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold uppercase text-[#f8fafc]">FIDO2 WEBAUTHN PASSKEY</p>
                      <p className="text-[10px] text-[#7e8b9b]">Biometric Secure Enclave / Hardware Token YubiKey</p>
                    </div>
                  </div>
                  <PixelBadge variant="phosphor" size="sm">
                    PRIMARY FACTOR
                  </PixelBadge>
                </div>

                <div className="p-3.5 bg-[#040608] border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 border border-white/10 bg-[#080c10] text-[#7e8b9b] flex items-center justify-center">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold uppercase text-[#f8fafc]">TOTP AUTHENTICATOR APP</p>
                      <p className="text-[10px] text-[#7e8b9b]">1Password / Google Authenticator Dynamic 6-Digit Code</p>
                    </div>
                  </div>
                  <Button variant="outline" className="text-xs font-mono uppercase tracking-wider h-8 border-white/20">
                    [ CONFIGURE ]
                  </Button>
                </div>
              </div>
            </TacticalFrame>
          </div>
        )}

        {/* Tab 3: Active Sessions */}
        {activeTab === "sessions" && (
          <div className="space-y-4">
            <TacticalFrame variant="panel" className="p-6 space-y-4 border-white/15 bg-[#080c10]">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#f8fafc]">Authenticated Hardware Sessions</h3>
                  <p className="text-[10px] text-[#7e8b9b]">Manage endpoints authorized to access your security telemetry.</p>
                </div>
                {sessions.length > 1 && (
                  <Button
                    variant="outline"
                    onClick={handleRevokeAllOther}
                    disabled={revokingId === "all"}
                    className="border-[#ff3b30]/40 text-[#ff3b30] hover:bg-[#ff3b30]/10 text-xs font-mono uppercase tracking-wider h-8 gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>[ REVOKE OTHER SESSIONS ]</span>
                  </Button>
                )}
              </div>

              {loadingSessions ? (
                <div className="py-8 text-center text-xs text-[#7e8b9b] flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#00ff66]" />
                  <span>LOADING SESSION CACHE...</span>
                </div>
              ) : (
                <div className="space-y-2 text-xs">
                  {sessions.map((ses) => (
                    <div
                      key={ses.id}
                      className="p-3.5 bg-[#040608] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 border flex items-center justify-center ${
                            ses.device.isCurrent
                              ? "bg-[#00ff66]/10 border-[#00ff66] text-[#00ff66]"
                              : "bg-[#080c10] border-white/10 text-[#7e8b9b]"
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
                            <span className="font-bold text-[#f8fafc]">{ses.device.name}</span>
                            {ses.device.isCurrent && (
                              <PixelBadge variant="phosphor" size="sm">
                                THIS DEVICE
                              </PixelBadge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-[#7e8b9b] mt-0.5">
                            <span>{ses.device.browser}</span>
                            <span>•</span>
                            <span>{ses.device.ip}</span>
                            <span>•</span>
                            <span>{ses.device.location || "Local"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                        <span className="text-[10px] text-[#7e8b9b]">{ses.device.lastActive}</span>
                        {!ses.device.isCurrent && (
                          <Button
                            variant="outline"
                            onClick={() => handleRevokeSession(ses.id)}
                            disabled={revokingId === ses.id}
                            className="border-white/10 hover:border-[#ff3b30] hover:text-[#ff3b30] text-xs h-7 px-2"
                          >
                            {revokingId === ses.id ? "REVOKING..." : "[ REVOKE ]"}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TacticalFrame>
          </div>
        )}

        {/* Tab 4: Privacy & Telemetry */}
        {activeTab === "privacy" && (
          <form onSubmit={handleSavePreferences} className="space-y-4">
            <TacticalFrame variant="panel" className="p-6 space-y-4 border-white/15 bg-[#080c10]">
              <div className="flex items-center gap-2 pb-3 border-b border-white/10">
                <EyeOff className="w-4 h-4 text-[#00ff66]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#f8fafc]">Zero-Knowledge Privacy Controls</h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-[#040608] border border-white/10 flex items-center justify-between">
                  <div>
                    <p className="font-bold uppercase text-[#f8fafc]">LOCAL MACHINE LEARNING INGESTION</p>
                    <p className="text-[10px] text-[#7e8b9b]">Execute heuristics locally without raw telemetry egress.</p>
                  </div>
                  <Toggle
                    checked={privacyPrefs.localProcessingOnly}
                    onCheckedChange={(c) => setPrivacyPrefs((p) => ({ ...p, localProcessingOnly: c }))}
                    aria-label="Toggle local processing"
                  />
                </div>

                <div className="p-3.5 bg-[#040608] border border-white/10 flex items-center justify-between">
                  <div>
                    <p className="font-bold uppercase text-[#f8fafc]">ANONYMOUS THREAT-HASH TELEMETRY</p>
                    <p className="text-[10px] text-[#7e8b9b]">Contribute one-way SHA-256 signatures to consensus network.</p>
                  </div>
                  <Toggle
                    checked={privacyPrefs.anonymousThreatHashSharing}
                    onCheckedChange={(c) => setPrivacyPrefs((p) => ({ ...p, anonymousThreatHashSharing: c }))}
                    aria-label="Toggle anonymous hash sharing"
                  />
                </div>

                <div className="p-3.5 bg-[#040608] border border-white/10 flex items-center justify-between">
                  <div>
                    <p className="font-bold uppercase text-[#f8fafc]">AUTONOMOUS QUARANTINE PROMPTS</p>
                    <p className="text-[10px] text-[#7e8b9b]">Prompt operator before auto-isolating suspect binaries.</p>
                  </div>
                  <Toggle
                    checked={privacyPrefs.automaticQuarantinePrompt}
                    onCheckedChange={(c) => setPrivacyPrefs((p) => ({ ...p, automaticQuarantinePrompt: c }))}
                    aria-label="Toggle quarantine prompt"
                  />
                </div>
              </div>
            </TacticalFrame>

            <div className="flex items-center justify-between pt-2">
              <Button type="submit" className="text-xs font-mono uppercase tracking-wider font-bold h-9 px-4 gap-2">
                <Save className="w-3.5 h-3.5" />
                <span>[ SAVE PRIVACY SETTINGS ]</span>
              </Button>
              {saved && (
                <PixelBadge variant="phosphor" size="sm">
                  SAVED
                </PixelBadge>
              )}
            </div>
          </form>
        )}

        {/* Tab 5: Local Daemon & Engine Settings */}
        {activeTab === "daemon" && (
          <form onSubmit={handleSavePreferences} className="space-y-4">
            <TacticalFrame variant="panel" className="p-6 space-y-4 border-white/15 bg-[#080c10]">
              <div className="flex items-center gap-2 pb-3 border-b border-white/10">
                <Bell className="w-4 h-4 text-[#00f0ff]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#f8fafc]">Engine Sensitivity & Local Daemon</h3>
              </div>

              <div className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase text-[#7e8b9b] block">INFERENCE ALERT THRESHOLD</label>
                  <Select defaultValue="strict">
                    <SelectTrigger className="w-full sm:w-72 bg-[#040608] border-white/15 text-xs font-mono">
                      <SelectValue placeholder="Select threshold" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#080c10] border-white/15 text-xs font-mono text-[#f8fafc]">
                      <SelectItem value="aggressive">Aggressive (Block &gt; 50% probability)</SelectItem>
                      <SelectItem value="strict">Standard Strict (Block &gt; 70% probability)</SelectItem>
                      <SelectItem value="permissive">Passive Logging Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase text-[#7e8b9b] block">LOCAL DAEMON INGESTION URL</label>
                  <Input
                    defaultValue="http://127.0.0.1:8000"
                    className="font-mono bg-[#040608]"
                  />
                  <p className="text-[10px] text-[#7e8b9b]">Localhost inference daemon port for `/predict` calls.</p>
                </div>
              </div>
            </TacticalFrame>

            <div className="flex items-center justify-between pt-2">
              <Button type="submit" className="text-xs font-mono uppercase tracking-wider font-bold h-9 px-4 gap-2">
                <Save className="w-3.5 h-3.5" />
                <span>[ SAVE DAEMON CONFIGURATION ]</span>
              </Button>
              {saved && (
                <PixelBadge variant="phosphor" size="sm">
                  SAVED
                </PixelBadge>
              )}
            </div>
          </form>
        )}
      </div>
    </AppShell>
  )
}
