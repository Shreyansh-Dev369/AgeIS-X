"use client"

import React, { useState } from "react"
import { EvidenceItem } from "@/lib/services/demo-lab-service"
import { Database, ChevronDown, ChevronRight, FileCode } from "lucide-react"

interface EvidencePanelProps {
  evidence: EvidenceItem[]
}

export function EvidencePanel({ evidence }: EvidencePanelProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  if (!evidence || evidence.length === 0) {
    return null
  }

  return (
    <div className="bg-[#0B0E14] border border-white/10 rounded-lg overflow-hidden font-mono">
      <div className="px-5 py-3.5 border-b border-white/10 bg-[#07090E] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-[#00F0FF]" />
          <span className="text-xs font-bold text-[#F8FAFC] tracking-wider uppercase">
            FORENSIC EVIDENCE & TELEMETRY LOGS ({evidence.length})
          </span>
        </div>
      </div>

      <div className="divide-y divide-white/5">
        {evidence.map((item, idx) => {
          const isExpanded = expandedIndex === idx
          const hasRaw = Boolean(item.raw_data)

          return (
            <div key={idx} className="p-3.5 hover:bg-white/[0.015] transition-colors">
              <div
                className="flex items-start justify-between gap-3 cursor-pointer"
                onClick={() => hasRaw && setExpandedIndex(isExpanded ? null : idx)}
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <span className="px-1.5 py-0.5 text-[9px] bg-white/[0.05] border border-white/10 text-[#00F0FF] rounded font-bold shrink-0 mt-0.5">
                    {item.source}
                  </span>
                  <div className="text-xs text-[#E2E8F0] leading-relaxed">
                    {item.description}
                  </div>
                </div>

                {hasRaw && (
                  <button
                    type="button"
                    className="flex items-center gap-1 text-[10px] text-[#64748B] hover:text-[#94A3B8] shrink-0"
                  >
                    <span>Raw</span>
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>

              {isExpanded && item.raw_data && (
                <div className="mt-2.5 p-3 bg-[#07090E] border border-white/5 rounded text-[11px] text-[#94A3B8] overflow-x-auto">
                  <div className="flex items-center gap-1.5 text-[10px] text-[#64748B] mb-1.5 uppercase font-semibold">
                    <FileCode className="w-3 h-3" />
                    Structured Payload
                  </div>
                  <pre className="text-[#38BDF8]">
                    {JSON.stringify(item.raw_data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
