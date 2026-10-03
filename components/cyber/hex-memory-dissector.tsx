"use client"

import React, { useState, useEffect } from "react"
import { Cpu, Binary, Eye, ShieldCheck, Database, Layers, RefreshCw } from "lucide-react"
import { cyberAudio } from "@/lib/cyber-sound"

interface MemoryRow {
  offset: string
  hex: string[]
  ascii: string
  asm: string
  isHooked?: boolean
}

const SAMPLE_MEMORY: MemoryRow[] = [
  {
    offset: "0x7FFF5F00",
    hex: ["48", "83", "EC", "28", "48", "8D", "0D", "35"],
    ascii: "H..(.H..",
    asm: "SUB RSP, 0x28 ; stack align",
  },
  {
    offset: "0x7FFF5F08",
    hex: ["48", "89", "5C", "24", "20", "48", "89", "6C"],
    ascii: "H.\\$ H.l",
    asm: "MOV [RSP+0x20], RBX",
  },
  {
    offset: "0x7FFF5F10",
    hex: ["48", "31", "C0", "48", "89", "C7", "0F", "05"],
    ascii: "H1.H....",
    asm: "XOR RAX, RAX ; eBPF syscall safe",
    isHooked: true,
  },
  {
    offset: "0x7FFF5F18",
    hex: ["48", "85", "C0", "74", "1A", "48", "8B", "44"],
    ascii: "H..t.H.D",
    asm: "TEST RAX, RAX ; branch attest",
  },
  {
    offset: "0x7FFF5F20",
    hex: ["E8", "4F", "01", "00", "00", "48", "8B", "5C"],
    ascii: ".O...H.\\",
    asm: "CALL ageis_enclave_verify()",
    isHooked: true,
  },
  {
    offset: "0x7FFF5F28",
    hex: ["48", "83", "C4", "28", "C3", "90", "90", "90"],
    ascii: "H..(....",
    asm: "ADD RSP, 0x28 ; RET",
  },
]

export function HexMemoryDissector() {
  const [rows, setRows] = useState<MemoryRow[]>(SAMPLE_MEMORY)
  const [hoveredByte, setHoveredByte] = useState<{ hex: string; ascii: string; offset: string } | null>(null)
  const [isLiveStreaming, setIsLiveStreaming] = useState(true)

  useEffect(() => {
    if (!isLiveStreaming) return
    const interval = setInterval(() => {
      // Subtle byte entropy jitter for live feeling
      setRows((prev) =>
        prev.map((r) => {
          if (Math.random() > 0.6) {
            const newHex = [...r.hex]
            const idx = Math.floor(Math.random() * newHex.length)
            const randomByte = Math.floor(Math.random() * 256)
              .toString(16)
              .padStart(2, "0")
              .toUpperCase()
            newHex[idx] = randomByte
            return { ...r, hex: newHex }
          }
          return r
        })
      )
    }, 1200)

    return () => clearInterval(interval)
  }, [isLiveStreaming])

  return (
    <div className="w-full border border-white/10 bg-[#020408] p-4 sm:p-5 font-mono text-xs relative shadow-[0_0_30px_rgba(0,0,0,0.8)]">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Binary className="w-4 h-4 text-[#00ff66]" />
          <span className="font-bold text-[#f8fafc] uppercase tracking-wider text-xs">
            LIVE HARDWARE ENCLAVE MEMORY DISSECTOR
          </span>
          <span className="text-[10px] px-1.5 py-0.2 border border-[#00ff66]/30 text-[#00ff66] bg-[#00ff66]/10">
            PROTECTED HEAP
          </span>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-[#7e8b9b]">
          <button
            onClick={() => {
              setIsLiveStreaming(!isLiveStreaming)
              cyberAudio.playKeyClick()
            }}
            className="px-2 py-0.5 border border-white/10 hover:border-white/30 text-[#7e8b9b] hover:text-white"
          >
            {isLiveStreaming ? "[ PAUSE FEED ]" : "[ RESUME FEED ]"}
          </button>
        </div>
      </div>

      {/* Memory Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-[11px] border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-[#7e8b9b]">
              <th className="py-1 px-2 font-normal">OFFSET</th>
              <th className="py-1 px-2 font-normal">RAW HEX BYTES</th>
              <th className="py-1 px-2 font-normal hidden sm:table-cell">ASCII</th>
              <th className="py-1 px-2 font-normal">DISASSEMBLED INSTRUCTION</th>
              <th className="py-1 px-2 font-normal text-right">GUARD</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-white/5 transition-colors">
                <td className="py-1.5 px-2 text-[#7e8b9b] whitespace-nowrap">{row.offset}</td>
                <td className="py-1.5 px-2 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    {row.hex.map((b, bi) => (
                      <span
                        key={bi}
                        onMouseEnter={() => {
                          setHoveredByte({
                            hex: b,
                            ascii: row.ascii[bi] || ".",
                            offset: `${row.offset}+0x${bi.toString(16)}`,
                          })
                          cyberAudio.playByteTick()
                        }}
                        className={`cursor-pointer px-1 py-0.2 rounded-none transition-colors ${
                          row.isHooked
                            ? "text-[#00ff66] bg-[#00ff66]/10 hover:bg-[#00ff66] hover:text-[#040608]"
                            : "text-[#f8fafc] hover:bg-white/20"
                        }`}
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-1.5 px-2 text-[#00f0ff] hidden sm:table-cell whitespace-nowrap">
                  {row.ascii}
                </td>
                <td className="py-1.5 px-2 text-[#e2e8f0] whitespace-nowrap">
                  {row.asm}
                </td>
                <td className="py-1.5 px-2 text-right whitespace-nowrap">
                  {row.isHooked ? (
                    <span className="text-[10px] text-[#00ff66] font-bold">[ ENCLAVE HOOK ]</span>
                  ) : (
                    <span className="text-[10px] text-[#7e8b9b]">[ VERIFIED ]</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Hovered Byte Inspector Tag */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-white/10 text-[10px] text-[#7e8b9b]">
        <div className="flex items-center gap-3">
          <span>
            INSPECTED BYTE:{" "}
            <span className="text-[#00ff66] font-bold">
              {hoveredByte ? `${hoveredByte.offset} [0x${hoveredByte.hex}] '${hoveredByte.ascii}'` : "HOVER OVER BYTE"}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span>ENTROPY: 0.84 (CLEAN)</span>
          <span>•</span>
          <span>HEAP CORRUPTION: 0.00%</span>
        </div>
      </div>
    </div>
  )
}
