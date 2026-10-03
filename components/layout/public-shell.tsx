import React from "react"
import { PublicHeader } from "@/components/layout/public-header"
import { Footer } from "@/components/layout/footer"

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#04070d] text-[#f8fafc] flex flex-col font-sans antialiased selection:bg-emerald-500/20 selection:text-emerald-300">
      <PublicHeader />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
    </div>
  )
}
