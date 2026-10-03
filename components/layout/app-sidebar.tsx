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
} from "lucide-react"
import { Logo } from "@/components/design-system/logo"
import { PixelBadge } from "@/components/ui/pixel-badge"
import { cn } from "@/lib/utils"

export const appNavItems = [
  { href: "/dashboard", label: "OVERVIEW", icon: LayoutDashboard },
  { href: "/dashboard/threats", label: "THREAT CENTER", icon: ShieldAlert, badge: "LIVE" },
  { href: "/dashboard/protection", label: "PROTECTION GRID", icon: ShieldCheck },
  { href: "/dashboard/analytics", label: "ANALYTICS & INTEL", icon: BarChart3 },
  { href: "/dashboard/incidents", label: "INCIDENTS", icon: AlertOctagon },
  { href: "/dashboard/devices", label: "DEVICES & NODES", icon: Laptop },
  { href: "/dashboard/identity", label: "IDENTITY DEFENSE", icon: Fingerprint },
  { href: "/dashboard/privacy", label: "PRIVACY SHIELD", icon: EyeOff },
  { href: "/dashboard/data", label: "DATA & QUARANTINE", icon: Database },
]

export const appSecondaryNavItems = [
  { href: "/dashboard/settings", label: "POLICY // SETTINGS", icon: Settings },
]

interface AppSidebarProps {
  className?: string
  onItemClick?: () => void
}

export function AppSidebar({ className = "", onItemClick }: AppSidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-[#040608] border-r border-white/10 w-64 select-none shrink-0 font-mono text-xs",
        className
      )}
    >
      {/* Sidebar Header with Brand */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-white/10 bg-[#080c10]">
        <Logo href="/dashboard" size="md" />
        <PixelBadge variant="phosphor" size="sm" dot>
          CORE
        </PixelBadge>
      </div>

      {/* Main Navigation Items */}
      <div className="flex-1 overflow-y-auto px-2.5 py-4 space-y-5">
        <div>
          <div className="px-2 mb-2 text-[10px] font-bold uppercase tracking-wider text-[#7e8b9b]">
            // SECURITY RUNTIME
          </div>
          <nav className="space-y-1" aria-label="Application Navigation">
            {appNavItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onItemClick}
                  className={cn(
                    "flex items-center justify-between px-2.5 py-2 border transition-all group",
                    isActive
                      ? "bg-[#0b1017] border-[#00ff66] text-[#00ff66] font-bold shadow-[0_0_10px_rgba(0,255,102,0.15)]"
                      : "bg-[#040608] border-transparent text-[#7e8b9b] hover:border-white/20 hover:text-[#f8fafc] hover:bg-[#080c10]"
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={cn(
                        "w-4 h-4 shrink-0 transition-colors",
                        isActive ? "text-[#00ff66]" : "text-[#7e8b9b] group-hover:text-[#f8fafc]"
                      )}
                    />
                    <span className="truncate tracking-wider text-[11px]">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={cn(
                        "text-[9px] px-1 py-0.2 font-bold uppercase border",
                        isActive
                          ? "bg-[#00ff66]/20 border-[#00ff66] text-[#00ff66]"
                          : "bg-white/5 border-white/10 text-white/40"
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

        <div>
          <div className="px-2 mb-2 text-[10px] font-bold uppercase tracking-wider text-[#7e8b9b]">
            // CONFIGURATION
          </div>
          <nav className="space-y-1">
            {appSecondaryNavItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onItemClick}
                  className={cn(
                    "flex items-center gap-2.5 px-2.5 py-2 border transition-all group",
                    isActive
                      ? "bg-[#0b1017] border-[#00ff66] text-[#00ff66] font-bold shadow-[0_0_10px_rgba(0,255,102,0.15)]"
                      : "bg-[#040608] border-transparent text-[#7e8b9b] hover:border-white/20 hover:text-[#f8fafc] hover:bg-[#080c10]"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4 shrink-0 transition-colors",
                      isActive ? "text-[#00ff66]" : "text-[#7e8b9b] group-hover:text-[#f8fafc]"
                    )}
                  />
                  <span className="truncate tracking-wider text-[11px]">{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Operator Section */}
      <div className="p-2.5 border-t border-white/10 bg-[#080c10]">
        <div className="p-2 border border-white/10 bg-[#040608] flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 border border-[#00ff66]/40 bg-[#00ff66]/10 text-[#00ff66] flex items-center justify-center font-bold text-[10px] shrink-0">
              AX
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-[#f8fafc] truncate">SECOPS_ADMIN</p>
              <p className="text-[9px] text-[#7e8b9b] truncate">TLS 1.3 // ONLINE</p>
            </div>
          </div>
          <Link
            href="/login"
            className="p-1 border border-white/10 hover:border-[#ff3b30] hover:text-[#ff3b30] text-[#7e8b9b] transition-colors"
            title="Terminate Session"
            aria-label="Terminate Session"
          >
            <LogOut className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </aside>
  )
}
