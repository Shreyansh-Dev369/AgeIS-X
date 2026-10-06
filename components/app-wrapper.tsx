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
    // Check if preloader has already run in this session
    const hasLoaded = sessionStorage.getItem("ageis_preloader_seen")
    if (hasLoaded === "true") {
      setShowPreloader(false)
    }
  }, [])

  const handlePreloaderComplete = () => {
    setShowPreloader(false)
    try {
      sessionStorage.setItem("ageis_preloader_seen", "true")
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
