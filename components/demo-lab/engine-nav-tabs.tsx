"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Globe,
  Code,
  Mail,
  Laptop,
  Network,
  Fingerprint,
  CreditCard,
  FileCode,
  Eye,
  Radio,
  EyeOff,
  Bot,
  GitBranch,
  Layers,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"

export const ENGINES_LIST = [
  { id: "M-01", name: "URL & Domain", path: "/demo-lab/m01-url", icon: Globe, mode: "live" },
  { id: "M-02", name: "Web Content", path: "/demo-lab/m02-content", icon: Code, mode: "live" },
  { id: "M-03", name: "Email & Msg", path: "/demo-lab/m03-email", icon: Mail, mode: "live" },
  { id: "M-04", name: "Endpoint Lab", path: "/demo-lab/m04-endpoint", icon: Laptop, mode: "sim" },
  { id: "M-05", name: "Network Lab", path: "/demo-lab/m05-network", icon: Network, mode: "sim" },
  { id: "M-06", name: "Identity Lab", path: "/demo-lab/m06-identity", icon: Fingerprint, mode: "sim" },
  { id: "M-07", name: "Payment Scam", path: "/demo-lab/m07-payment-scam", icon: CreditCard, mode: "sim" },
  { id: "M-08", name: "File Malware", path: "/demo-lab/m08-file-malware", icon: FileCode, mode: "live" },
  { id: "M-09", name: "Visual Threat", path: "/demo-lab/m09-visual-threat", icon: Eye, mode: "live" },
  { id: "M-10", name: "Threat Intel", path: "/demo-lab/m10-threat-intel", icon: Radio, mode: "sim" },
  { id: "M-11", name: "Privacy Lab", path: "/demo-lab/m11-privacy", icon: EyeOff, mode: "sim" },
  { id: "M-12", name: "AI Security", path: "/demo-lab/m12-ai-security", icon: Bot, mode: "live" },
  { id: "M-13", name: "Behavioural", path: "/demo-lab/m13-behavioural", icon: GitBranch, mode: "sim" },
  { id: "M-14", name: "Unified Risk", path: "/demo-lab/m14-unified-risk", icon: Layers, mode: "live" },
]

export function EngineNavTabs() {
  const pathname = usePathname()

  return (
    <div className="bg-[#0B0E14] border-b border-white/10 px-4 py-2 font-mono text-xs overflow-x-auto select-none technical-grid">
      <div className="flex items-center gap-1.5 min-w-max">
        <Link
          href="/demo-lab/incident-workspace"
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded transition-all font-bold tracking-wider",
            pathname === "/demo-lab/incident-workspace"
              ? "bg-[#00E575] text-[#07090E] shadow-lg shadow-[#00E575]/20"
              : "bg-white/[0.05] text-[#00E575] hover:bg-[#00E575]/10 border border-[#00E575]/30"
          )}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>INCIDENT WORKSPACE</span>
        </Link>

        <div className="h-5 w-px bg-white/10 mx-1" />

        {ENGINES_LIST.map((eng) => {
          const Icon = eng.icon
          const isActive = pathname === eng.path

          return (
            <Link
              key={eng.id}
              href={eng.path}
              className={cn(
                "flex items-center gap-2 px-2.5 py-1.5 rounded border transition-colors",
                isActive
                  ? "bg-[#151922] text-[#00E575] border-[#00E575]/50 font-bold"
                  : "bg-transparent text-[#94A3B8] border-transparent hover:bg-white/[0.04] hover:text-[#F8FAFC]"
              )}
            >
              <Icon className={cn("w-3.5 h-3.5", isActive ? "text-[#00E575]" : "text-[#64748B]")} />
              <span>{eng.id}</span>
              <span className="hidden xl:inline text-[11px] font-sans text-[#64748B]">
                {eng.name}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
