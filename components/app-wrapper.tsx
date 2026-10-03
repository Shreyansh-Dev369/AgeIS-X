"use client"

import React, { useState, useEffect } from "react"
import { AuthProvider } from "@/lib/auth/auth-context"
import { CyberThemeProvider } from "@/lib/cyber-theme"
import { MatrixBackground } from "@/components/cyber/matrix-background"

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <AuthProvider>
      <CyberThemeProvider>
        <MatrixBackground />
        <div className={`relative z-10 ${mounted ? "opacity-100 transition-opacity duration-300" : "opacity-95"}`}>
          {children}
        </div>
      </CyberThemeProvider>
    </AuthProvider>
  )
}
