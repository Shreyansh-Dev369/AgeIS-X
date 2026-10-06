"use client"

import React, { useState, useEffect } from "react"
import { AuthProvider } from "@/lib/auth/auth-context"
import { CyberThemeProvider } from "@/lib/cyber-theme"
import { MatrixBackground } from "@/components/cyber/matrix-background"
import { Preloader } from "@/components/preloader"

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [showPreloader, setShowPreloader] = useState(true)

  useEffect(() => {
    setMounted(true)
    // Allow query parameter ?preloader=1 to force replay anytime
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      if (params.has("preloader")) {
        setShowPreloader(true)
        return
      }
    }
    // Check if upgraded preloader v2 has already run in this session
    const hasLoaded = sessionStorage.getItem("ageis_preloader_seen_v2")
    if (hasLoaded === "true") {
      setShowPreloader(false)
    }

    const handleReplayShortcut = (e: KeyboardEvent) => {
      if (e.shiftKey && (e.key === "P" || e.key === "p")) {
        setShowPreloader(true)
      }
    }
    window.addEventListener("keydown", handleReplayShortcut)
    ;(window as any).__replayPreloader = () => setShowPreloader(true)
    return () => window.removeEventListener("keydown", handleReplayShortcut)
  }, [])

  const handlePreloaderComplete = () => {
    setShowPreloader(false)
    try {
      sessionStorage.setItem("ageis_preloader_seen_v2", "true")
    } catch {}
  }

  return (
    <AuthProvider>
      <CyberThemeProvider>
        {showPreloader && (
          <Preloader onComplete={handlePreloaderComplete} duration={2200} />
        )}
        <MatrixBackground />
        <div className={`relative z-10 ${mounted ? "opacity-100 transition-opacity duration-500" : "opacity-95"}`}>
          {children}
        </div>
      </CyberThemeProvider>
    </AuthProvider>
  )
}
