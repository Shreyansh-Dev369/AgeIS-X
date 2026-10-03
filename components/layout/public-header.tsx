"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ArrowRight, ShieldCheck, Download, LogIn, LayoutDashboard } from "lucide-react"
import { Logo } from "@/components/design-system/logo"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerTrigger, DrawerContent } from "@/components/ui/drawer"
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
  const pathname = usePathname()

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
        "fixed top-0 left-0 right-0 z-50 transition-all duration-200 border-b",
        isScrolled
          ? "bg-[#050505]/95 backdrop-blur-md border-white/10 shadow-2xl"
          : "bg-[#050505]/85 backdrop-blur-sm border-white/5"
      )}
    >
      <div className="page-container">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Brand Logo & Technical Stamp */}
          <div className="flex items-center gap-3">
            <Logo href="/" size="md" />
            <span className="hidden lg:inline text-[9px] font-mono text-[#6F706D] uppercase tracking-widest pl-2 border-l border-white/10">
              SYS.DEF // V2.4
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
                  className={cn(
                    "px-3 py-1 text-xs font-mono tracking-wide transition-colors",
                    isActive
                      ? "text-[#39FF14] font-bold border-b border-[#39FF14]"
                      : "text-[#A6A6A0] hover:text-[#F1F0EB]"
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-xs font-mono text-[#A6A6A0] hover:text-white hover:bg-white/5 h-8 px-3"
            >
              <Link href="/login">
                <LogIn className="w-3.5 h-3.5 mr-1.5 text-[#A6A6A0]" />
                Sign In
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="border-white/15 bg-transparent hover:bg-white/5 text-[#F1F0EB] text-xs font-mono h-8 px-3"
            >
              <Link href="/dashboard">
                <span className="w-1.5 h-1.5 rounded-none bg-[#39FF14] mr-1.5" />
                Console
              </Link>
            </Button>
            <Button
              size="sm"
              asChild
              className="bg-[#39FF14] hover:bg-[#32e012] text-[#050505] font-bold text-xs font-mono h-8 px-3.5 rounded-none shadow-[2px_2px_0px_#FFFFFF]"
            >
              <Link href="/download">
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Download
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex md:hidden items-center gap-2">
            <Button
              size="sm"
              asChild
              className="text-xs font-mono px-3 h-8 bg-[#39FF14] text-[#050505] font-bold rounded-none"
            >
              <Link href="/download">Get App</Link>
            </Button>
            <Drawer open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <DrawerTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Open navigation menu"
                  className="text-[#F1F0EB] hover:bg-white/5 border border-white/10 rounded-none h-8 w-8"
                >
                  <Menu className="w-4 h-4" />
                </Button>
              </DrawerTrigger>
              <DrawerContent side="right" className="w-[300px] flex flex-col justify-between bg-[#080808] border-l border-white/10 p-6 font-mono text-xs">
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <Logo href="/" size="md" />
                  </div>

                  <div className="flex flex-col space-y-2">
                    <span className="text-[10px] font-semibold text-[#6F706D] uppercase tracking-widest px-2 mb-1">
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
                            "px-2 py-2 text-sm transition-colors",
                            isActive
                              ? "text-[#39FF14] font-bold pl-3 border-l-2 border-[#39FF14]"
                              : "text-[#A6A6A0] hover:text-white"
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
                    className="w-full justify-center border-white/15 bg-transparent text-[#F1F0EB] rounded-none h-9"
                  >
                    <Link href="/dashboard" onClick={() => setIsMobileOpen(false)}>
                      <LayoutDashboard className="w-3.5 h-3.5 mr-2 text-[#39FF14]" />
                      Security Console
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    asChild
                    className="w-full justify-center bg-[#39FF14] text-[#050505] font-bold rounded-none h-9 shadow-[2px_2px_0px_#FFFFFF]"
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
