"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  ShieldAlert,
  ShieldCheck,
  BarChart3,
  AlertOctagon,
  Laptop,
  Fingerprint,
  EyeOff,
  Database,
  Settings,
  LogOut,
  User,
} from "lucide-react"
import { Logo } from "@/components/design-system/logo"
import { TechnicalLabel } from "@/components/design-system/editorial-primitives"
import { SecuritySticker } from "@/components/design-system/pixel-art-system"
import { useAuth } from "@/lib/auth/auth-context"
import { cn } from "@/lib/utils"

export const primaryNavItems = [
  { href: "/dashboard", label: "OVERVIEW", icon: LayoutDashboard },
  { href: "/dashboard/threats", label: "THREAT CENTER", icon: ShieldAlert, badge: "LIVE" },
  { href: "/dashboard/protection", label: "PROTECTION GRID", icon: ShieldCheck },
  { href: "/dashboard/incidents", label: "INCIDENTS", icon: AlertOctagon },
  { href: "/dashboard/analytics", label: "ANALYTICS", icon: BarChart3 },
]

export const surfaceNavItems = [
  { href: "/dashboard/devices", label: "DEVICES & HOSTS", icon: Laptop },
  { href: "/dashboard/identity", label: "IDENTITY ENCLAVE", icon: Fingerprint },
  { href: "/dashboard/privacy", label: "PRIVACY SHIELD", icon: EyeOff },
  { href: "/dashboard/data", label: "DATA & QUARANTINE", icon: Database },
]

export const systemNavItems = [
  { href: "/dashboard/settings", label: "SETTINGS", icon: Settings },
]

interface AppSidebarProps {
  className?: string
  onItemClick?: () => void
}

export function AppSidebar({ className = "", onItemClick }: AppSidebarProps) {
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-[#050505] border-r border-white/10 w-64 select-none shrink-0 font-mono text-xs",
        className
      )}
    >
      {/* Sidebar Header with Brand */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-white/10 bg-[#080808]">
        <Logo href="/dashboard" size="md" />
        <span className="text-[10px] font-bold px-2 py-0.5 bg-[#39FF14]/10 text-[#39FF14] border border-[#39FF14]/20">
          CORE ACTIVE
        </span>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Core Ops Navigation */}
        <div>
          <div className="px-2 mb-2">
            <TechnicalLabel className="text-[#6F706D]">RUNTIME OPERATING SYSTEM</TechnicalLabel>
          </div>
          <nav className="space-y-0.5" aria-label="Primary Security Navigation">
            {primaryNavItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onItemClick}
                  className={cn(
                    "flex items-center justify-between px-2.5 py-2 transition-colors group text-xs",
                    isActive
                      ? "bg-[#151515] text-[#39FF14] font-bold border-l-2 border-[#39FF14]"
                      : "text-[#A6A6A0] hover:text-[#F1F0EB] hover:bg-white/[0.03]"
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={cn(
                        "w-4 h-4 shrink-0 transition-colors",
                        isActive ? "text-[#39FF14]" : "text-[#6F706D] group-hover:text-[#A6A6A0]"
                      )}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={cn(
                        "text-[9px] px-1.5 py-0.2 font-mono",
                        isActive
                          ? "bg-[#39FF14]/20 text-[#39FF14]"
                          : "bg-white/10 text-[#A6A6A0]"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Attack Surfaces */}
        <div>
          <div className="px-2 mb-2">
            <TechnicalLabel className="text-[#6F706D]">PROTECTED VECTORS</TechnicalLabel>
          </div>
          <nav className="space-y-0.5" aria-label="Surfaces Navigation">
            {surfaceNavItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onItemClick}
                  className={cn(
                    "flex items-center gap-2.5 px-2.5 py-2 transition-colors group text-xs",
                    isActive
                      ? "bg-[#151515] text-[#39FF14] font-bold border-l-2 border-[#39FF14]"
                      : "text-[#A6A6A0] hover:text-[#F1F0EB] hover:bg-white/[0.03]"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4 shrink-0 transition-colors",
                      isActive ? "text-[#39FF14]" : "text-[#6F706D] group-hover:text-[#A6A6A0]"
                    )}
                  />
                  <span className="truncate">{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* System Settings */}
        <div>
          <div className="px-2 mb-2">
            <TechnicalLabel className="text-[#6F706D]">SYSTEM CONTROLS</TechnicalLabel>
          </div>
          <nav className="space-y-0.5" aria-label="System Navigation">
            {systemNavItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onItemClick}
                  className={cn(
                    "flex items-center gap-2.5 px-2.5 py-2 transition-colors group text-xs",
                    isActive
                      ? "bg-[#151515] text-[#39FF14] font-bold border-l-2 border-[#39FF14]"
                      : "text-[#A6A6A0] hover:text-[#F1F0EB] hover:bg-white/[0.03]"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4 shrink-0 transition-colors",
                      isActive ? "text-[#39FF14]" : "text-[#6F706D] group-hover:text-[#A6A6A0]"
                    )}
                  />
                  <span className="truncate">{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Sidebar Footer with Sticker & User Info */}
      <div className="p-3 border-t border-white/10 bg-[#080808] space-y-3">
        <div className="flex justify-center">
          <SecuritySticker type="encryption_freedom" size="sm" />
        </div>
        <div className="flex items-center justify-between text-[11px] text-[#A6A6A0] pt-1">
          <div className="flex items-center gap-2 truncate">
            <User className="w-3.5 h-3.5 text-[#39FF14]" />
            <span className="truncate">{user?.email || "operator@local.host"}</span>
          </div>
          <button
            onClick={() => signOut()}
            title="Sign out"
            className="hover:text-rose-400 p-1 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  )
}
