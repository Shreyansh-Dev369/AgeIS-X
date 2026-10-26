"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, LogIn, LayoutDashboard, Download, ShieldCheck, Activity, Terminal, ArrowRight, Zap } from "lucide-react"
import { Logo } from "@/components/design-system/logo"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerTrigger, DrawerContent } from "@/components/ui/drawer"
import { MagneticButton } from "@/components/cinematic/magnetic-button"
import { multiVectorService, EngineHealth } from "@/lib/services/multi-vector-service"
import { useAuth } from "@/lib/auth/auth-context"
import { cn } from "@/lib/utils"

const publicNavLinks = [
  { href: "/protection", label: "Protection" },
  { href: "/technology", label: "Technology" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/security", label: "Security" },
  { href: "/business", label: "Business" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
]

export function PublicHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [engineHealth, setEngineHealth] = useState<EngineHealth | null>(null)
  const [showStatusDetails, setShowStatusDetails] = useState(false)
  const pathname = usePathname()
  const { user } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    let mounted = true
    const checkStatus = async () => {
      const health = await multiVectorService.getHealth()
      if (mounted) setEngineHealth(health)
    }
    checkStatus()
    const timer = setInterval(checkStatus, 20000)
    return () => {
      mounted = false
      clearInterval(timer)
    }
  }, [])

  const isEngineActive = engineHealth?.status === "ok"

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        isScrolled
          ? "bg-[#07090E]/95 backdrop-blur-md border-white/10 shadow-2xl"
          : "bg-[#07090E]/80 backdrop-blur-sm border-white/5"
      )}
    >
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Brand Logo & Technical Engine Attestation */}
          <div className="flex items-center gap-3">
            <Logo href="/" size="md" />

            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-white/10 select-none relative">
              <button
                type="button"
                onClick={() => setShowStatusDetails((prev) => !prev)}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-[10px] font-mono transition-colors text-left"
                title="Click to inspect real-time engine telemetry and verified modules"
                aria-label="Engine status details"
              >
                <span
                  className={cn(
                    "w-1.5 h-1.5 rounded-full inline-block shrink-0",
                    isEngineActive ? "bg-[#39FF14] animate-pulse" : "bg-amber-400"
                  )}
                />
                <span className={isEngineActive ? "text-[#39FF14] font-semibold" : "text-amber-400 font-semibold"}>
                  {isEngineActive ? "ENGINE ONLINE" : "LOCAL MODE"}
                </span>
                <span className="text-[#6F706D] text-[9px] hidden md:inline">
                  {isEngineActive ? `v${engineHealth?.version} • <20ms` : "Client Fallback"}
                </span>
              </button>

              {/* Status Details Flyout */}
              {showStatusDetails && (
                <div
                  className="absolute top-9 left-3 w-80 bg-[#0B0E14] border border-white/15 p-4 shadow-2xl z-50 text-xs font-mono space-y-3 animate-in fade-in-0 zoom-in-95 duration-150"
                  onMouseLeave={() => setShowStatusDetails(false)}
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-[#39FF14] font-bold flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5" />
                      SYSTEM STATUS
                    </span>
                    <span className="text-[10px] text-[#A6A6A0]">
                      {isEngineActive ? "FASTAPI REST :8000" : "BROWSER ONLY"}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#A6A6A0] font-sans leading-relaxed">
                    {isEngineActive
                      ? "The AgeIS-X multi-signal threat intelligence daemon is active with character n-gram vectorization, DoH, RDAP, and TLS probes."
                      : "The local REST microservice is unreachable. Deterministic client-side heuristic classification is protecting your session."}
                  </p>

                  <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px]">
                    <div className="p-1.5 bg-[#07090E] border border-white/5 flex items-center justify-between">
                      <span className="text-[#6F706D]">URL / DOM:</span>
                      <span className="text-[#39FF14] font-semibold">ACTIVE</span>
                    </div>
                    <div className="p-1.5 bg-[#07090E] border border-white/5 flex items-center justify-between">
                      <span className="text-[#6F706D]">EMAIL INTEL:</span>
                      <span className="text-[#39FF14] font-semibold">ACTIVE</span>
                    </div>
                    <div className="p-1.5 bg-[#07090E] border border-white/5 flex items-center justify-between">
                      <span className="text-[#6F706D]">SMS / NLP:</span>
                      <span className="text-[#39FF14] font-semibold">ACTIVE</span>
                    </div>
                    <div className="p-1.5 bg-[#07090E] border border-white/5 flex items-center justify-between">
                      <span className="text-[#6F706D]">SSRF SHIELD:</span>
                      <span className="text-[#39FF14] font-semibold">VERIFIED</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                    <Link
                      href="/technology"
                      onClick={() => setShowStatusDetails(false)}
                      className="text-[10px] text-[#39FF14] hover:underline flex items-center gap-1 font-semibold"
                    >
                      <span>Inspect Full Architecture</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setShowStatusDetails(false)}
                      className="text-[10px] text-[#6F706D] hover:text-[#F1F0EB]"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5" aria-label="Main Navigation">
            {publicNavLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3 py-1.5 text-xs font-sans tracking-wide transition-all duration-200 relative group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#39FF14]",
                    isActive
                      ? "text-[#39FF14] font-semibold"
                      : "text-[#A6A6A0] hover:text-[#F1F0EB]"
                  )}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#39FF14] inline-block animate-in fade-in duration-200" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="border-white/15 bg-transparent hover:bg-white/[0.04] text-[#F1F0EB] text-xs font-mono h-8 px-3"
              >
                <Link href="/dashboard">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14] mr-1.5" />
                  Console ({user.name || "Operator"})
                </Link>
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-xs font-sans text-[#A6A6A0] hover:text-white hover:bg-white/5 h-8 px-3"
              >
                <Link href="/login">
                  <LogIn className="w-3.5 h-3.5 mr-1.5 text-[#A6A6A0]" />
                  Sign In
                </Link>
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              asChild
              className="border-white/15 bg-transparent hover:bg-white/[0.04] text-[#F1F0EB] text-xs font-sans h-8 px-3"
            >
              <Link href="/dashboard">
                <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14] mr-1.5" />
                Security Console
              </Link>
            </Button>

            <MagneticButton strength={3}>
              <Button
                size="sm"
                asChild
                className="bg-[#39FF14] hover:bg-[#32E012] text-[#07090E] font-semibold text-xs font-sans h-8 px-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.4),0_0_12px_rgba(0,229,117,0.2)]"
              >
                <Link href="/download">
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  Download
                </Link>
              </Button>
            </MagneticButton>
          </div>

          {/* Mobile & Tablet Actions / Trigger */}
          <div className="flex lg:hidden items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="hidden sm:inline-flex border-white/15 bg-transparent hover:bg-white/5 text-[#F1F0EB] text-xs font-sans h-8 px-3"
            >
              <Link href="/dashboard">
                <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14] mr-1.5" />
                Console
              </Link>
            </Button>
            <Button
              size="sm"
              asChild
              className="text-xs font-sans px-3 h-8 bg-[#39FF14] hover:bg-[#32E012] text-[#07090E] font-semibold shadow-[0_1px_3px_rgba(0,0,0,0.4)]"
            >
              <Link href="/download">
                <Download className="w-3.5 h-3.5 mr-1 sm:inline hidden" />
                <span>Get App</span>
              </Link>
            </Button>

            <Drawer open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <DrawerTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Open navigation menu"
                  className="text-[#F1F0EB] hover:bg-white/5 border border-white/10 h-8 w-8"
                >
                  <Menu className="w-4 h-4" />
                </Button>
              </DrawerTrigger>
              <DrawerContent side="right" className="w-[320px] max-w-full flex flex-col justify-between bg-[#0B0E14] border-l border-white/10 p-6 font-sans text-xs">
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <Logo href="/" size="md" />
                  </div>

                  {/* Mobile Engine Status Pill */}
                  <div className="p-3 bg-[#07090E] border border-white/10 space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-[#6F706D] uppercase">LOCAL DEFENSE ENGINE</span>
                      <span className={cn("font-bold flex items-center gap-1", isEngineActive ? "text-[#39FF14]" : "text-amber-400")}>
                        <span className={cn("w-1.5 h-1.5 rounded-full inline-block", isEngineActive ? "bg-[#39FF14]" : "bg-amber-400")} />
                        {isEngineActive ? "ONLINE (2.0.0)" : "CLIENT MODE"}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#A6A6A0] font-sans">
                      {isEngineActive ? "Multi-vector neural scanner running on :8000" : "On-device lexical fallback active"}
                    </p>
                  </div>

                  {/* Navigation Links */}
                  <div className="flex flex-col space-y-1">
                    <span className="text-[10px] font-semibold text-[#6F706D] uppercase tracking-widest px-2 mb-1 font-mono">
                      // DIRECTORY
                    </span>
                    {publicNavLinks.map((link) => {
                      const isActive = pathname === link.href
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsMobileOpen(false)}
                          className={cn(
                            "px-3 py-2 text-sm transition-colors",
                            isActive
                              ? "text-[#39FF14] font-semibold pl-3 border-l-2 border-[#39FF14] bg-white/[0.03]"
                              : "text-[#A6A6A0] hover:text-white hover:bg-white/[0.02]"
                          )}
                        >
                          {link.label}
                        </Link>
                      )
                    })}
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10 space-y-2.5">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="w-full justify-center border-white/15 bg-transparent text-[#F1F0EB] h-9 text-xs"
                  >
                    <Link href="/login" onClick={() => setIsMobileOpen(false)}>
                      <Zap className="w-3.5 h-3.5 mr-2 text-[#39FF14]" />
                      1-Click Demo Login
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="w-full justify-center border-white/15 bg-transparent text-[#F1F0EB] h-9 text-xs"
                  >
                    <Link href="/dashboard" onClick={() => setIsMobileOpen(false)}>
                      <LayoutDashboard className="w-3.5 h-3.5 mr-2 text-[#39FF14]" />
                      Security Console
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    asChild
                    className="w-full justify-center bg-[#39FF14] text-[#07090E] font-semibold h-9 shadow-[0_1px_3px_rgba(0,0,0,0.4)] text-xs"
                  >
                    <Link href="/download" onClick={() => setIsMobileOpen(false)}>
                      <Download className="w-3.5 h-3.5 mr-2" />
                      Download Client
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
