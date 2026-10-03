"use client"

import React, { useState } from "react"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { AppHeader } from "@/components/layout/app-header"
import { AuthGuard } from "@/components/auth/auth-guard"
import { GlobalCommandPalette } from "@/components/dashboard/global-command-palette"

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
    }, 1500)
  }

  return (
    <AuthGuard requireVerified={true} requireOnboarded={true}>
      <div className="min-h-screen bg-[#040608] text-[#f8fafc] flex font-mono antialiased relative selection:bg-[#00ff66]/30 selection:text-[#00ff66]">
        {/* Background Ambience / Grid Overlay */}
        <div className="fixed inset-0 bg-[linear-gradient(to_right,#00ff6606_1px,transparent_1px),linear-gradient(to_bottom,#00ff6606_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-40 z-0" />

        {/* Fixed Desktop Sidebar */}
        <div className="hidden lg:block h-screen sticky top-0 z-20">
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
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
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
