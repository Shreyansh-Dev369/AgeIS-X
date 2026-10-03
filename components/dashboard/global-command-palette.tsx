"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { TerminalPrompt } from "@/components/ui/terminal-prompt"
import { PixelBadge } from "@/components/ui/pixel-badge"
import { TacticalFrame } from "@/components/ui/tactical-frame"
import { securityService } from "@/lib/services/security-service"
import {
  Search as SearchIcon,
  ShieldAlert,
  AlertOctagon,
  Laptop,
  Fingerprint,
  HardDrive,
  ArrowRight,
  X,
  CornerDownLeft,
} from "lucide-react"

interface GlobalCommandPaletteProps {
  isOpen: boolean
  onClose: () => void
}

export function GlobalCommandPalette({ isOpen, onClose }: GlobalCommandPaletteProps) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<{
    threats: any[]
    incidents: any[]
    devices: any[]
    accounts: any[]
    data: any[]
  }>({
    threats: [],
    incidents: [],
    devices: [],
    accounts: [],
    data: [],
  })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        if (isOpen) {
          onClose()
        } else {
          // Open triggered by parent state
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  useEffect(() => {
    if (!query.trim()) {
      setResults({ threats: [], incidents: [], devices: [], accounts: [], data: [] })
      return
    }

    securityService.searchGlobal(query).then((res) => {
      setResults(res)
    })
  }, [query])

  if (!isOpen) return null

  const hasResults =
    results.threats.length > 0 ||
    results.incidents.length > 0 ||
    results.devices.length > 0 ||
    results.accounts.length > 0 ||
    results.data.length > 0

  return (
    <div
      className="fixed inset-0 z-50 bg-[#040608]/80 backdrop-blur-sm flex items-start justify-center p-4 sm:p-6 md:p-12 animate-in fade-in-50 duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <TacticalFrame
          variant="panel"
          reticles={true}
          reticleColor="phosphor"
          className="shadow-[0_0_50px_rgba(0,0,0,0.9)] border-white/20 overflow-hidden"
        >
          {/* Top Search Input Box */}
          <div className="p-3.5 border-b border-white/10 bg-[#040608] flex items-center gap-3">
            <SearchIcon className="w-4 h-4 text-[#00ff66] shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Query telemetry, vectors, endpoints, accounts, files... (Esc to close)"
              className="w-full bg-transparent border-none text-xs font-mono text-[#f8fafc] placeholder:text-[#7e8b9b] focus:outline-none"
              autoFocus
            />
            <button
              onClick={onClose}
              className="text-[#7e8b9b] hover:text-white p-1 text-xs font-mono"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Prompt Header */}
          <div className="px-3.5 py-1.5 bg-[#080c10] border-b border-white/10 flex items-center justify-between text-[11px] font-mono text-[#7e8b9b]">
            <TerminalPrompt user="operator" host="ageis-x" command={`search "${query || "*"}"`} showCursor={false} />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-white/40">PRESS ESC TO CLOSE</span>
            </div>
          </div>

          {/* Results Area */}
          <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4 font-mono text-xs">
            {!query.trim() ? (
              <div className="py-8 text-center text-[#7e8b9b] space-y-2">
                <p className="text-xs uppercase tracking-wider text-white/70">
                  Global Security Telemetry Search
                </p>
                <p className="text-[11px] text-[#7e8b9b] max-w-sm mx-auto">
                  Type any threat ID, domain name, endpoint IP, file name, or operator account to query real-time indexed vectors.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <span className="text-[10px] text-[#00ff66] border border-[#00ff66]/30 px-2 py-0.5 bg-[#00ff66]/10">
                    TRY: "malware"
                  </span>
                  <span className="text-[10px] text-[#00f0ff] border border-[#00f0ff]/30 px-2 py-0.5 bg-[#00f0ff]/10">
                    TRY: "sso"
                  </span>
                  <span className="text-[10px] text-[#ffb800] border border-[#ffb800]/30 px-2 py-0.5 bg-[#ffb800]/10">
                    TRY: "macbook"
                  </span>
                </div>
              </div>
            ) : !hasResults ? (
              <div className="py-8 text-center text-[#7e8b9b]">
                <p className="text-xs uppercase tracking-wider text-[#ff3b30]">
                  [ NO VECTORS MATCHED QUERY: "{query}" ]
                </p>
                <p className="text-[11px] text-[#7e8b9b] mt-1">
                  Try broader keywords or verify target identifier formatting.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Threats */}
                {results.threats.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[10px] uppercase text-[#00ff66] font-bold flex items-center gap-1.5 pb-1 border-b border-white/10">
                      <ShieldAlert className="w-3 h-3" />
                      <span>THREAT INTELLIGENCE ({results.threats.length})</span>
                    </div>
                    {results.threats.map((t) => (
                      <Link
                        key={t.id}
                        href="/dashboard/threats"
                        onClick={onClose}
                        className="p-2 border border-white/10 bg-[#040608] hover:border-[#00ff66]/50 hover:bg-[#080c10] flex items-center justify-between transition-colors block"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-[#00ff66] font-bold">{t.id}</span>
                            <span className="text-[#f8fafc] font-semibold">{t.threatType}</span>
                          </div>
                          <p className="text-[10px] text-[#7e8b9b] truncate">{t.source}</p>
                        </div>
                        <PixelBadge variant="danger" size="sm">
                          {t.status}
                        </PixelBadge>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Incidents */}
                {results.incidents.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[10px] uppercase text-[#ffb800] font-bold flex items-center gap-1.5 pb-1 border-b border-white/10">
                      <AlertOctagon className="w-3 h-3" />
                      <span>INCIDENTS ({results.incidents.length})</span>
                    </div>
                    {results.incidents.map((inc) => (
                      <Link
                        key={inc.id}
                        href="/dashboard/incidents"
                        onClick={onClose}
                        className="p-2 border border-white/10 bg-[#040608] hover:border-[#ffb800]/50 hover:bg-[#080c10] flex items-center justify-between transition-colors block"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-[#ffb800] font-bold">{inc.id}</span>
                            <span className="text-[#f8fafc] font-semibold">{inc.title}</span>
                          </div>
                          <p className="text-[10px] text-[#7e8b9b] truncate">{inc.target}</p>
                        </div>
                        <PixelBadge variant="warning" size="sm">
                          {inc.status}
                        </PixelBadge>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Devices */}
                {results.devices.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[10px] uppercase text-[#00f0ff] font-bold flex items-center gap-1.5 pb-1 border-b border-white/10">
                      <Laptop className="w-3 h-3" />
                      <span>ENROLLED DEVICES ({results.devices.length})</span>
                    </div>
                    {results.devices.map((d) => (
                      <Link
                        key={d.id}
                        href="/dashboard/devices"
                        onClick={onClose}
                        className="p-2 border border-white/10 bg-[#040608] hover:border-[#00f0ff]/50 hover:bg-[#080c10] flex items-center justify-between transition-colors block"
                      >
                        <div className="space-y-0.5">
                          <span className="text-[#f8fafc] font-semibold">{d.name}</span>
                          <p className="text-[10px] text-[#7e8b9b]">{d.ip} // {d.os}</p>
                        </div>
                        <PixelBadge variant="cyan" size="sm">
                          {d.status}
                        </PixelBadge>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Accounts */}
                {results.accounts.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[10px] uppercase text-[#f8fafc] font-bold flex items-center gap-1.5 pb-1 border-b border-white/10">
                      <Fingerprint className="w-3 h-3 text-[#00ff66]" />
                      <span>MONITORED IDENTITIES ({results.accounts.length})</span>
                    </div>
                    {results.accounts.map((a) => (
                      <Link
                        key={a.id}
                        href="/dashboard/identity"
                        onClick={onClose}
                        className="p-2 border border-white/10 bg-[#040608] hover:border-white/30 hover:bg-[#080c10] flex items-center justify-between transition-colors block"
                      >
                        <div className="space-y-0.5">
                          <span className="text-[#f8fafc] font-semibold">{a.identifier}</span>
                          <p className="text-[10px] text-[#7e8b9b]">{a.service}</p>
                        </div>
                        <PixelBadge variant="phosphor" size="sm">
                          {a.mfaStatus}
                        </PixelBadge>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Data Assets */}
                {results.data.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[10px] uppercase text-[#7e8b9b] font-bold flex items-center gap-1.5 pb-1 border-b border-white/10">
                      <HardDrive className="w-3 h-3 text-[#00f0ff]" />
                      <span>DATA ASSETS & FILES ({results.data.length})</span>
                    </div>
                    {results.data.map((dat) => (
                      <Link
                        key={dat.id}
                        href="/dashboard/data"
                        onClick={onClose}
                        className="p-2 border border-white/10 bg-[#040608] hover:border-white/30 hover:bg-[#080c10] flex items-center justify-between transition-colors block"
                      >
                        <div className="space-y-0.5">
                          <span className="text-[#f8fafc] font-semibold">{dat.fileName}</span>
                          <p className="text-[10px] text-[#7e8b9b]">{dat.location}</p>
                        </div>
                        <PixelBadge variant={dat.status === "QUARANTINED" ? "danger" : "neutral"} size="sm">
                          {dat.status}
                        </PixelBadge>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Shortcuts */}
          <div className="p-2.5 bg-[#040608] border-t border-white/10 flex items-center justify-between text-[10px] text-[#7e8b9b] font-mono">
            <div className="flex items-center gap-3">
              <span>ENTER to navigate</span>
              <span>•</span>
              <span>ESC to dismiss</span>
            </div>
            <span className="text-[#00ff66]">INDEX: 5 VECTORS ACTIVE</span>
          </div>
        </TacticalFrame>
      </div>
    </div>
  )
}
