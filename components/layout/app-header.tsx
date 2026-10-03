"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  Menu,
  Bell,
  Search as SearchIcon,
  RefreshCw,
  LogOut,
  Sliders,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerTrigger, DrawerContent } from "@/components/ui/drawer"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { TechnicalLabel, SignalMarker } from "@/components/design-system/editorial-primitives"
import { MOCK_ACTIVITY_FEED } from "@/lib/mock/security-data"
import { useAuth } from "@/lib/auth/auth-context"
import { cn } from "@/lib/utils"

interface AppHeaderProps {
  title?: string
  breadcrumbs?: { label: string; href?: string }[]
  onScanClick?: () => void
  isScanning?: boolean
  onOpenSearch?: () => void
}

export function AppHeader({
  title = "SECURITY OVERVIEW",
  breadcrumbs = [],
  onScanClick,
  isScanning = false,
  onOpenSearch,
}: AppHeaderProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const { user, signOut } = useAuth()

  return (
    <header className="h-14 border-b border-white/10 bg-[#050505]/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30 select-none font-mono text-xs">
      {/* Left: Mobile Drawer Trigger + Breadcrumbs / Title */}
      <div className="flex items-center gap-3 min-w-0">
        <Drawer open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
          <DrawerTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="lg:hidden text-[#A6A6A0] hover:text-[#F1F0EB] border border-white/10 rounded-none h-8 w-8"
              aria-label="Open sidebar menu"
            >
              <Menu className="w-4 h-4" />
            </Button>
          </DrawerTrigger>
          <DrawerContent side="left" className="p-0 w-64 bg-[#050505] border-r border-white/10">
            <AppSidebar onItemClick={() => setMobileSidebarOpen(false)} />
          </DrawerContent>
        </Drawer>

        <div className="min-w-0 flex items-center gap-3">
          {breadcrumbs.length > 0 && (
            <div className="hidden sm:flex items-center gap-2 text-[#6F706D] text-[11px]">
              {breadcrumbs.map((b, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <span>/</span>}
                  {b.href ? (
                    <Link href={b.href} className="hover:text-[#F1F0EB]">{b.label}</Link>
                  ) : (
                    <span className="text-[#A6A6A0]">{b.label}</span>
                  )}
                </React.Fragment>
              ))}
              <span className="text-white/20">|</span>
            </div>
          )}
          <h1 className="text-xs font-bold text-[#F1F0EB] tracking-wider uppercase truncate">
            {title}
          </h1>
        </div>
      </div>

      {/* Middle: Quick Search trigger */}
      <div className="hidden md:flex flex-1 max-w-xs lg:max-w-md mx-2">
        <button
          type="button"
          onClick={onOpenSearch}
          className="w-full h-8 px-3 border border-white/10 bg-[#080808] hover:border-white/20 flex items-center justify-between text-[11px] text-[#A6A6A0] transition-colors group"
        >
          <div className="flex items-center gap-2">
            <SearchIcon className="w-3.5 h-3.5 text-[#6F706D] group-hover:text-[#F1F0EB]" />
            <span className="group-hover:text-[#F1F0EB] truncate">QUERY ENGINE [EVENTS / THREATS / ENCLAVES]</span>
          </div>
          <kbd className="hidden sm:inline-block text-[10px] font-mono border border-white/15 px-1 bg-white/5 text-[#A6A6A0]">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Telemetry Status, Sync Action, Notifications */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-[#080808] border border-white/10 text-[11px]">
          <SignalMarker status="active" label="DAEMON 14.8MS" />
        </div>

        {/* Sync Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onScanClick}
          disabled={isScanning}
          className="h-8 text-[11px] font-mono rounded-none border-white/20 bg-transparent hover:bg-white/5 text-[#F1F0EB]"
        >
          <RefreshCw className={cn("w-3 h-3 text-[#39FF14] mr-1.5", isScanning ? "animate-spin" : "")} />
          <span>{isScanning ? "EVALUATING..." : "SYNC REPO"}</span>
        </Button>

        {/* Notifications Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="relative text-[#A6A6A0] hover:text-[#F1F0EB] border border-white/10 rounded-none h-8 w-8"
              aria-label="View notifications"
            >
              <Bell className="w-3.5 h-3.5" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#39FF14]" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 sm:w-96 p-0 bg-[#080808] border border-white/15 shadow-2xl font-mono text-xs" align="end">
            <div className="flex items-center justify-between p-3 border-b border-white/10 bg-[#050505]">
              <TechnicalLabel>SYSTEM DISPATCHES</TechnicalLabel>
              <span className="text-[10px] px-1.5 py-0.5 bg-[#39FF14]/10 text-[#39FF14] border border-[#39FF14]/20">
                3 UNRESOLVED
              </span>
            </div>
            <div className="p-2 space-y-1 max-h-80 overflow-y-auto">
              {MOCK_ACTIVITY_FEED.slice(0, 4).map((item) => (
                <Link
                  key={item.id}
                  href="/dashboard/threats"
                  className="p-2.5 border border-white/5 bg-[#050505] hover:border-white/20 flex items-start justify-between gap-2 transition-colors block"
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={cn(
                        "font-bold text-[10px]",
                        item.severity === "critical" ? "text-rose-400" : item.severity === "high" ? "text-amber-400" : "text-[#39FF14]"
                      )}>
                        [{item.severity.toUpperCase()}]
                      </span>
                      <span className="font-medium text-[#F1F0EB] truncate text-xs">
                        {item.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#A6A6A0] truncate">{item.description}</p>
                  </div>
                  <span className="text-[10px] text-[#6F706D] shrink-0 font-mono">{item.timestamp}</span>
                </Link>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  )
}
