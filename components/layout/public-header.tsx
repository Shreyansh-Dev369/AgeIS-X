"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ArrowRight, ShieldCheck, Download, LogIn, LayoutDashboard, Terminal, Activity, Radio, Cpu, Lock } from "lucide-react"
import { Logo } from "@/components/design-system/logo"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerTrigger, DrawerContent } from "@/components/ui/drawer"
import { PixelBadge } from "@/components/ui/pixel-badge"
import { TacticalHudBar } from "@/components/cyber/tactical-hud-bar"
import { cyberAudio } from "@/lib/cyber-sound"
import { useCyberTheme } from "@/lib/cyber-theme"
import { cn } from "@/lib/utils"

const publicNavLinks = [
  { href: "/protection", label: "PROTECTION" },
  { href: "/technology", label: "TECHNOLOGY" },
  { href: "/how-it-works", label: "HOW IT WORKS" },
  { href: "/security", label: "SECURITY" },
  { href: "/business", label: "BUSINESS" },
  { href: "/pricing", label: "PRICING" },
]

export function PublicHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()
  const { theme } = useCyberTheme()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-150 border-b",
        isScrolled
          ? "bg-[#020407]/95 backdrop-blur-md border-white/15 shadow-[0_4px_30px_rgba(0,0,0,0.95)]"
          : "bg-[#020407]/85 backdrop-blur-sm border-white/10"
      )}
    >
      {/* Top Persistent Military Tactical Cyber HUD */}
      <TacticalHudBar />

      <div className="page-container">
        <div className="flex h-14 md:h-15 items-center justify-between">
          {/* Brand Logo & Protocol Identifier */}
          <div className="flex items-center gap-3">
            <Logo href="/" size="md" />
            <span className="hidden xl:inline-block text-[10px] font-mono px-2 py-0.5 border border-[#00ff66]/30 text-[#00ff66] bg-[#00ff66]/10 uppercase tracking-widest font-bold">
              AUTONOMOUS_DEFENSE
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
            {publicNavLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => cyberAudio.playKeyClick()}
                  className={cn(
                    "px-3 py-1 text-xs font-mono tracking-wider uppercase transition-all rounded-none border",
                    isActive
                      ? "text-[#00ff66] bg-[#00ff66]/10 border-[#00ff66]/50 font-bold shadow-[0_0_10px_rgba(0,255,102,0.2)]"
                      : "text-[#7e8b9b] border-transparent hover:text-[#f8fafc] hover:bg-white/5 hover:border-white/15"
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-2 font-mono">
            <Button
              variant="ghost"
              size="sm"
              asChild
              onClick={() => cyberAudio.playKeyClick()}
              className="text-xs hover:text-[#00ff66] border border-transparent hover:border-white/15"
            >
              <Link href="/login">
                <LogIn className="w-3.5 h-3.5 mr-1.5 text-[#7e8b9b]" />
                SIGN IN
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
              onClick={() => cyberAudio.playKeyClick()}
              className="border-white/15 bg-[#060a10] hover:border-[#00f0ff]/50 hover:text-[#00f0ff]"
            >
              <Link href="/dashboard">
                <LayoutDashboard className="w-3.5 h-3.5 mr-1.5 text-[#00f0ff]" />
                CONSOLE
              </Link>
            </Button>
            <Button
              size="sm"
              asChild
              onClick={() => cyberAudio.playShield()}
              className="bg-[#00ff66] hover:bg-[#39ff14] text-[#040608] font-bold border border-[#00ff66] shadow-[0_0_15px_rgba(0,255,102,0.3)] tracking-wider text-xs uppercase"
            >
              <Link href="/download">
                <Download className="w-3.5 h-3.5 mr-1.5" />
                DOWNLOAD CLIENT
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex md:hidden items-center gap-2">
            <Button
              size="sm"
              asChild
              onClick={() => cyberAudio.playShield()}
              className="text-[11px] px-2.5 h-7 font-mono font-bold bg-[#00ff66] text-[#040608]"
            >
              <Link href="/download">GET APP</Link>
            </Button>
            <Drawer open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <DrawerTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Open mobile navigation menu"
                  onClick={() => cyberAudio.playKeyClick()}
                  className="text-[#f8fafc] hover:bg-white/5 border border-white/15"
                >
                  <Menu className="w-4 h-4" />
                </Button>
              </DrawerTrigger>
              <DrawerContent side="right" className="w-[290px] sm:w-[320px] flex flex-col justify-between bg-[#04070c] border-l border-white/15">
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 font-mono">
                    <Logo href="/" size="md" />
                    <PixelBadge variant="phosphor" size="sm">ONLINE</PixelBadge>
                  </div>

                  <div className="flex flex-col space-y-1">
                    <span className="text-[10px] font-mono text-[#7e8b9b] uppercase tracking-widest px-2 mb-1">
                      // PLATFORM SECTIONS
                    </span>
                    {publicNavLinks.map((link) => {
                      const isActive = pathname === link.href
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => {
                            setIsMobileOpen(false)
                            cyberAudio.playKeyClick()
                          }}
                          className={cn(
                            "px-3 py-2 text-xs font-mono tracking-wider uppercase transition-colors rounded-none border border-transparent",
                            isActive
                              ? "text-[#00ff66] bg-[#00ff66]/10 border-[#00ff66]/40 font-bold"
                              : "text-[#7e8b9b] hover:text-[#f8fafc] hover:bg-white/5"
                          )}
                        >
                          {link.label}
                        </Link>
                      )
                    })}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-2 font-mono">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="w-full justify-center border-white/15 bg-[#080c10]"
                  >
                    <Link href="/dashboard" onClick={() => setIsMobileOpen(false)}>
                      <LayoutDashboard className="w-3.5 h-3.5 mr-2 text-[#00f0ff]" />
                      OPERATIONS CONSOLE
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    asChild
                    className="w-full justify-center bg-[#00ff66] text-[#040608] font-bold border border-[#00ff66]"
                  >
                    <Link href="/download" onClick={() => setIsMobileOpen(false)}>
                      <Download className="w-3.5 h-3.5 mr-2" />
                      DOWNLOAD CLIENT
                    </Link>
                  </Button>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
    </header>
  )
}
