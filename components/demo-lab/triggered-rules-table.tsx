"use client"

import React from "react"
import { TriggeredRule, Severity } from "@/lib/services/demo-lab-service"
import { ShieldAlert, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

interface TriggeredRulesTableProps {
  rules: TriggeredRule[]
}

export function TriggeredRulesTable({ rules }: TriggeredRulesTableProps) {
  const severityBadge = (sev: Severity) => {
    const config = {
      critical: "bg-[#FF0055]/10 text-[#FF0055] border-[#FF0055]/30",
      high: "bg-[#FF8800]/10 text-[#FF8800] border-[#FF8800]/30",
      medium: "bg-[#FFB800]/10 text-[#FFB800] border-[#FFB800]/30",
      low: "bg-[#00E575]/10 text-[#00E575] border-[#00E575]/30",
      info: "bg-[#94A3B8]/10 text-[#94A3B8] border-[#94A3B8]/30",
    }
    return (
      <span className={cn("px-2 py-0.5 text-[10px] font-mono font-bold uppercase border rounded", config[sev] || config.info)}>
        {sev}
      </span>
    )
  }

  if (!rules || rules.length === 0) {
    return (
      <div className="bg-[#0B0E14] border border-white/10 rounded-lg p-6 text-center">
        <ShieldCheck className="w-8 h-8 text-[#00E575] mx-auto mb-2 opacity-70" />
        <div className="text-xs font-mono text-[#F8FAFC]">No Malicious or Suspicious Heuristic Rules Triggered</div>
        <p className="text-[11px] text-[#64748B] mt-1 font-sans">
          All evaluated patterns remained within nominal baseline parameters.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-[#0B0E14] border border-white/10 rounded-lg overflow-hidden font-mono">
      <div className="px-5 py-3.5 border-b border-white/10 bg-[#07090E] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-[#00E575]" />
          <span className="text-xs font-bold text-[#F8FAFC] tracking-wider uppercase">
            TRIGGERED DEFENSIVE RULES ({rules.length})
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#0B0E14] text-[#64748B] text-[10px] uppercase border-b border-white/5">
            <tr>
              <th className="py-2.5 px-4 font-semibold">Severity</th>
              <th className="py-2.5 px-4 font-semibold">Rule ID</th>
              <th className="py-2.5 px-4 font-semibold">Rule Name & Details</th>
              <th className="py-2.5 px-4 font-semibold">MITRE ATT&CK</th>
              <th className="py-2.5 px-4 font-semibold text-right">Points</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-[#94A3B8]">
            {rules.map((rule, idx) => (
              <tr key={`${rule.rule_id}-${idx}`} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-3 px-4 whitespace-nowrap">
                  {severityBadge(rule.severity)}
                </td>
                <td className="py-3 px-4 font-bold text-[#F8FAFC] whitespace-nowrap">
                  {rule.rule_id}
                </td>
                <td className="py-3 px-4 max-w-md">
                  <div className="font-semibold text-[#F8FAFC]">{rule.name}</div>
                  <div className="text-[11px] text-[#64748B] mt-0.5 font-sans leading-normal">
                    {rule.description}
                  </div>
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  {rule.mitre_id ? (
                    <span className="px-2 py-0.5 bg-white/[0.04] text-[#00F0FF] border border-white/10 text-[10px] rounded">
                      {rule.mitre_id}
                    </span>
                  ) : (
                    <span className="text-[#475569] text-[10px]">N/A</span>
                  )}
                </td>
                <td className="py-3 px-4 text-right font-bold text-[#F8FAFC] whitespace-nowrap">
                  +{rule.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
