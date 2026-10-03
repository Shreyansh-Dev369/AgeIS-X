"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  Menu,
  Bell,
  Search as SearchIcon,
  ShieldCheck,
  RefreshCw,
  User,
  Settings,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { PixelBadge } from "@/components/ui/pixel-badge"
import { Drawer, DrawerTrigger, DrawerContent } from "@/components/ui/drawer"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { MOCK_ACTIVITY_FEED } from "@/lib/mock/security-data"
import { cn } from "@/lib/utils"

interface AppHeaderProps {
  title?: string
  breadcrumbs?: { label: string; href?: string }[]
  onScanClick?: () => void
  isScanning?: boolean
  onOpenSearch?: () => void
}

export function AppHeader({
  title = "Security Overview",
  breadcrumbs = [],
  onScanClick,
  isScanning = false,
  onOpenSearch,
}: AppHeaderProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  return (
    <header className="h-14 border-b border-white/10 bg-[#080c10]/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30 select-none font-mono">
      {/* Left: Mobile Drawer Trigger + Breadcrumbs / Title */}
      <div className="flex items-center gap-3 min-w-0">
        <Drawer open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
          <DrawerTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="lg:hidden text-[#7e8b9b] hover:text-[#f8fafc] border border-white/10"
              aria-label="Open sidebar menu"
            >
              <Menu className="w-4 h-4" />
            </Button>
          </DrawerTrigger>
          <DrawerContent side="left" className="p-0 w-64 bg-[#040608] border-r border-white/10">
            <AppSidebar onItemClick={() => setMobileSidebarOpen(false)} />
          </DrawerContent>
        </Drawer>

        <div className="min-w-0">
          {breadcrumbs.length > 0 && (
            <Breadcrumbs items={breadcrumbs} className="hidden sm:flex mb-0.5 text-[10px]" />
          )}
          <h1 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#f8fafc] truncate">
            {title}
          </h1>
        </div>
      </div>

      {/* Middle: Search Prompt Button */}
      <div className="hidden md:flex flex-1 max-w-sm lg:max-w-md mx-2">
        <button
          type="button"
          onClick={onOpenSearch}
          className="w-full h-8 px-3 rounded-none border border-white/10 bg-[#040608] hover:border-[#00ff66]/50 flex items-center justify-between text-xs text-[#7e8b9b] transition-colors group"
        >
          <div className="flex items-center gap-2">
            <SearchIcon className="w-3.5 h-3.5 text-[#00ff66]" />
            <span className="group-hover:text-[#f8fafc] truncate">Search telemetry, vectors, assets...</span>
          </div>
          <kbd className="hidden sm:inline-block text-[10px] font-mono border border-white/15 px-1 py-0.2 bg-white/5 text-white/50">
            ⌘K / Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right: Status, Actions, Notifications, Profile */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Protection Status Live Badge */}
        <div className="hidden sm:block">
          <PixelBadge variant="phosphor" size="sm" dot>
            PROTECTED
          </PixelBadge>
        </div>

        {/* Manual Quick Scan Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onScanClick}
          disabled={isScanning}
          className="h-8 text-[11px] font-mono uppercase tracking-wider border-white/15 bg-[#040608] hover:border-[#00ff66]/50"
        >
          <RefreshCw className={cn("w-3 h-3 text-[#00ff66] mr-1.5", isScanning ? "animate-spin" : "")} />
          <span>{isScanning ? "SYNCING..." : "SYNC"}</span>
        </Button>

        {/* Notifications Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="relative text-[#7e8b9b] hover:text-[#f8fafc] border border-white/10 h-8 w-8"
              aria-label="View security notifications"
            >
              <Bell className="w-3.5 h-3.5" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#00ff66]" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 sm:w-96 p-0 bg-[#080c10] border border-white/15 shadow-[0_0_30px_rgba(0,0,0,0.8)] font-mono text-xs" align="end">
            <div className="flex items-center justify-between p-3 border-b border-white/10 bg-[#040608]">
              <span className="font-bold uppercase tracking-wider text-white">
                SECURITY NOTIFICATIONS
              </span>
              <PixelBadge variant="cyan" size="sm">
                3 NEW
              </PixelBadge>
            </div>
            <div className="p-2 space-y-1.5 max-h-80 overflow-y-auto">
              {MOCK_ACTIVITY_FEED.slice(0, 4).map((item) => (
                <Link
                  key={item.id}
                  href="/dashboard/threats"
                  className="p-2.5 border border-white/5 bg-[#040608] hover:border-[#00ff66]/40 hover:bg-[#0b1017] flex items-start justify-between gap-2 transition-colors block"
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={cn(
                        "font-bold text-[11px]",
                        item.severity === "critical" ? "text-[#ff3b30]" : item.severity === "high" ? "text-[#ffb800]" : "text-[#00f0ff]"
                      )}>
                        [{item.severity.toUpperCase()}]
                      </span>
                      <span className="font-semibold text-[#f8fafc] truncate text-[11px]">
                        {item.title}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#7e8b9b] line-clamp-1">{item.description}</p>
                    <span className="text-[9px] text-white/40 block">{item.timestamp}</span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="p-2 border-t border-white/10 text-center bg-[#040608]">
              <Link
                href="/dashboard/incidents"
                className="text-[11px] text-[#00ff66] hover:underline uppercase font-bold"
              >
                [ VIEW ALL LOGGED INCIDENTS → ]
              </Link>
            </div>
          </PopoverContent>
        </Popover>

        {/* Profile Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="bg-[#040608] border border-white/15 text-[#7e8b9b] hover:text-[#f8fafc] h-8 w-8"
              aria-label="User profile menu"
            >
              <User className="w-3.5 h-3.5 text-[#00ff66]" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-1.5 bg-[#080c10] border border-white/15 shadow-xl font-mono text-xs" align="end">
            <div className="p-2 border-b border-white/10 mb-1">
              <p className="font-bold text-[#f8fafc] uppercase text-[11px]">SECOPS_ADMIN</p>
              <p className="text-[10px] text-[#7e8b9b] truncate">lead@ageis-x.corp</p>
            </div>
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-[#7e8b9b] hover:text-[#f8fafc] hover:bg-white/5 transition-colors"
            >
              <Settings className="w-3.5 h-3.5 text-[#00f0ff]" />
              <span>SETTINGS // POLICY</span>
            </Link>
            <Link
              href="/security"
              className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-[#7e8b9b] hover:text-[#f8fafc] hover:bg-white/5 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#00ff66]" />
              <span>ARCHITECTURE</span>
            </Link>
            <div className="my-1 border-t border-white/10" />
            <Link
              href="/login"
              className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-[#ff3b30] hover:bg-[#ff3b30]/10 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>TERMINATE SESSION</span>
            </Link>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  )
}
