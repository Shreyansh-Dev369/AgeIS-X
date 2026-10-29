"use client"

import React, { useState } from "react"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { AppHeader } from "@/components/layout/app-header"
import { AuthGuard } from "@/components/auth/auth-guard"
import { GlobalCommandPalette } from "@/components/dashboard/global-command-palette"
import { TacticalAtmosphere } from "@/components/tactical/tactical-atmosphere"

interface AppShellProps {
  title?: string
  breadcrumbs?: { label: string; href?: string }[]
  children: React.ReactNode
}

export function AppShell({ title, breadcrumbs, children }: AppShellProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)

  const handleManualScan = () => {
    setIsScanning(true)
    setTimeout(() => {
      setIsScanning(false)
    }, 1200)
  }

  return (
    <AuthGuard requireVerified={true} requireOnboarded={true}>
      <div className="min-h-screen bg-[#04060A] text-[#F8FAFC] flex font-mono antialiased selection:bg-[#00E575]/20 selection:text-[#00E575] relative overflow-x-hidden">
        <TacticalAtmosphere variant="dashboard" />

        {/* Fixed Desktop Sidebar */}
        <div className="hidden lg:block h-screen sticky top-0 z-20 shrink-0">
          <AppSidebar />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 z-10 relative">
          <AppHeader
            title={title}
            breadcrumbs={breadcrumbs}
            onScanClick={handleManualScan}
            isScanning={isScanning}
            onOpenSearch={() => setCommandPaletteOpen(true)}
          />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8">
            {children}
          </main>
        </div>

        {/* Global Terminal Search / Command Palette */}
        <GlobalCommandPalette
          isOpen={commandPaletteOpen}
          onClose={() => setCommandPaletteOpen(false)}
        />
      </div>
    </AuthGuard>
  )
}
