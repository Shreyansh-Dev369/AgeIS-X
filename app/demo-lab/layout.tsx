import React from "react"
import { EngineNavTabs } from "@/components/demo-lab/engine-nav-tabs"

export default function DemoLabLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#07090E] text-[#F8FAFC] flex flex-col font-mono selection:bg-[#00E575]/20 selection:text-[#00E575]">
      {/* Sticky Top Ribbon for all 14 Engines */}
      <div className="sticky top-0 z-30 shadow-md">
        <EngineNavTabs />
      </div>
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  )
}
