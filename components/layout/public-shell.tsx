import React from "react"
import { PublicHeader } from "@/components/layout/public-header"
import { Footer } from "@/components/layout/footer"

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#040608] text-[#f8fafc] flex flex-col font-sans antialiased selection:bg-[#00ff66]/20 selection:text-[#00ff66]">
      <PublicHeader />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
    </div>
  )
}
