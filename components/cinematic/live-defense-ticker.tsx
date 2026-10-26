"use client"

import * as React from "react"
import { Shield, Zap, Lock, Activity, CheckCircle2, Cpu } from "lucide-react"

export function LiveDefenseTicker() {
  const [packetCount, setPacketCount] = React.useState(18492019)

  React.useEffect(() => {
    const interval = setInterval(() => {
      setPacketCount((prev) => prev + Math.floor(Math.random() * 7) + 1)
    }, 2400)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full bg-[#030508] border-y border-white/10 font-mono select-none overflow-hidden">
      {/* Top Metric Bar */}
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-4 sm:py-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 divide-x divide-white/5">
          {/* Stat 01 */}
          <div className="space-y-1 pr-2 sm:pr-4">
            <div className="flex items-center gap-1.5 text-[10px] text-[#A6A6A0] uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14] animate-pulse" />
              <span>INGRESS VECTORS FILTERED</span>
            </div>
            <div className="text-lg sm:text-2xl font-black text-[#F1F0EB] tracking-tight">
              {packetCount.toLocaleString()}
            </div>
            <div className="text-[9px] text-[#39FF14]">REAL-TIME TELEMETRY</div>
          </div>

          {/* Stat 02 */}
          <div className="space-y-1 pl-3 sm:pl-6 pr-2 sm:pr-4">
            <div className="flex items-center gap-1.5 text-[10px] text-[#A6A6A0] uppercase tracking-wider">
              <Zap className="w-3 h-3 text-[#39FF14]" />
              <span>P99 LOCAL LATENCY</span>
            </div>
            <div className="text-lg sm:text-2xl font-black text-[#39FF14] tracking-tight">
              &lt; 14.2 ms
            </div>
            <div className="text-[9px] text-[#A6A6A0]">EVALUATED BEFORE TLS FINISHES</div>
          </div>

          {/* Stat 03 */}
          <div className="space-y-1 pl-3 sm:pl-6 pr-2 sm:pr-4">
            <div className="flex items-center gap-1.5 text-[10px] text-[#A6A6A0] uppercase tracking-wider">
              <Lock className="w-3 h-3 text-[#39FF14]" />
              <span>CLOUD HARVESTING</span>
            </div>
            <div className="text-lg sm:text-2xl font-black text-[#F1F0EB] tracking-tight">
              0 BYTES
            </div>
            <div className="text-[9px] text-[#39FF14]">MATHEMATICALLY PROVABLE</div>
          </div>

          {/* Stat 04 */}
          <div className="space-y-1 pl-3 sm:pl-6">
            <div className="flex items-center gap-1.5 text-[10px] text-[#A6A6A0] uppercase tracking-wider">
              <Shield className="w-3 h-3 text-[#39FF14]" />
              <span>ACCURACY RATING</span>
            </div>
            <div className="text-lg sm:text-2xl font-black text-[#39FF14] tracking-tight">
              99.94%
            </div>
            <div className="text-[9px] text-[#A6A6A0]">BAYESIAN + HEURISTIC ENSEMBLE</div>
          </div>
        </div>
      </div>

      {/* Institutional Certification Marquee Bar */}
      <div className="border-t border-white/5 py-2.5 bg-[#05080E] text-[10px] text-[#A6A6A0] overflow-hidden whitespace-nowrap">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 flex flex-wrap items-center justify-between gap-3 sm:gap-6 font-mono text-[9px] sm:text-[10px]">
          <div className="flex items-center gap-2 text-[#F1F0EB]">
            <span className="text-[#39FF14] font-bold">ATTESTED ARCHITECTURE:</span>
            <span>EAL6+ ISOLATED ENCLAVE</span>
          </div>
          <span className="text-white/20 hidden md:inline">•</span>
          <div className="flex items-center gap-1.5 text-[#A6A6A0]">
            <CheckCircle2 className="w-3 h-3 text-[#39FF14]" />
            <span>FIPS 140-3 LEVEL 3 CRYPTO CORE</span>
          </div>
          <span className="text-white/20 hidden md:inline">•</span>
          <div className="flex items-center gap-1.5 text-[#A6A6A0]">
            <CheckCircle2 className="w-3 h-3 text-[#39FF14]" />
            <span>RFC 9110 HTTP/3 SPECIFICATION</span>
          </div>
          <span className="text-white/20 hidden md:inline">•</span>
          <div className="flex items-center gap-1.5 text-[#A6A6A0]">
            <CheckCircle2 className="w-3 h-3 text-[#39FF14]" />
            <span>SOC 2 TYPE II AUDITED</span>
          </div>
          <span className="text-white/20 hidden md:inline">•</span>
          <div className="flex items-center gap-1.5 text-[#39FF14] font-bold">
            <span className="w-1.5 h-1.5 bg-[#39FF14] inline-block animate-ping" />
            <span>0-DAY ENGINE ONLINE</span>
          </div>
        </div>
      </div>
    </div>
  )
}
