import React from "react"
import { PublicHeader } from "@/components/layout/public-header"
import { Footer } from "@/components/layout/footer"
import { TacticalAtmosphere } from "@/components/tactical/tactical-atmosphere"

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#04060A] text-[#f8fafc] flex flex-col font-sans antialiased selection:bg-emerald-500/20 selection:text-emerald-300 relative overflow-x-hidden">
      <TacticalAtmosphere variant="cinematic" />
      <PublicHeader />
      <main className="flex-1 pt-16 relative z-10">{children}</main>
      <Footer />
    </div>
  )
}
