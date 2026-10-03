"use client"

import React, { useState } from "react"
import { ChartContainer } from "@/components/ui/chart-container"
import { MOCK_TELEMETRY_SERIES } from "@/lib/mock/security-data"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts"

type TimeRange = "24h" | "7d" | "30d" | "90d"

export function TelemetryTrendChart() {
  const [timeRange, setTimeRange] = useState<TimeRange>("24h")

  const data = MOCK_TELEMETRY_SERIES[timeRange] || MOCK_TELEMETRY_SERIES["24h"]

  const totalClean = data.reduce((acc, curr) => acc + curr.cleanRequests, 0)
  const totalThreats = data.reduce((acc, curr) => acc + curr.threatsBlocked, 0)
  const totalAnomalies = data.reduce((acc, curr) => acc + curr.anomalies, 0)

  return (
    <ChartContainer
      title="INGRESS TELEMETRY & VECTOR MITIGATION"
      subtitle="Clean socket streams vs isolated threat payloads"
      action={
        <div className="flex items-center gap-1 bg-[#050505] p-0.5 border border-white/10 font-mono text-[11px]">
          {(["24h", "7d", "30d", "90d"] as TimeRange[]).map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => setTimeRange(range)}
              className={`px-2.5 py-1 text-[11px] font-mono transition-colors uppercase ${
                timeRange === range
                  ? "bg-[#39FF14]/15 text-[#39FF14] font-bold"
                  : "text-[#A6A6A0] hover:text-[#F1F0EB]"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      }
    >
      <div className="space-y-4 font-mono select-none">
        {/* Visual Chart */}
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#39FF14" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#39FF14" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 2" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="time"
                stroke="#6F706D"
                fontSize={10}
                tickLine={false}
                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              />
              <YAxis
                stroke="#6F706D"
                fontSize={10}
                tickLine={false}
                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#080808",
                  borderColor: "rgba(255,255,255,0.2)",
                  borderRadius: "0px",
                  fontSize: "11px",
                  fontFamily: "monospace",
                  color: "#F1F0EB",
                }}
              />
              <Area
                type="monotone"
                dataKey="cleanRequests"
                name="Clean Telemetry"
                stroke="#39FF14"
                strokeWidth={1.5}
                fillOpacity={1}
                fill="url(#colorRequests)"
              />
              <Area
                type="monotone"
                dataKey="threatsBlocked"
                name="Threats Blocked"
                stroke="#ef4444"
                strokeWidth={1.5}
                fillOpacity={1}
                fill="url(#colorThreats)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Clean Metrics Summary */}
        <div className="grid grid-cols-3 gap-px bg-white/10 border border-white/10 text-center text-xs">
          <div className="p-2.5 bg-[#050505]">
            <span className="text-[10px] text-[#6F706D] block uppercase">TOTAL INGRESS</span>
            <span className="text-xs sm:text-sm font-bold text-[#F1F0EB] mt-0.5 block">{totalClean.toLocaleString()}</span>
          </div>
          <div className="p-2.5 bg-[#050505]">
            <span className="text-[10px] text-[#6F706D] block uppercase">ISOLATED VECTORS</span>
            <span className="text-xs sm:text-sm font-bold text-[#39FF14] mt-0.5 block">{totalThreats.toLocaleString()}</span>
          </div>
          <div className="p-2.5 bg-[#050505]">
            <span className="text-[10px] text-[#6F706D] block uppercase">ANOMALIES</span>
            <span className="text-xs sm:text-sm font-bold text-amber-400 mt-0.5 block">{totalAnomalies.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </ChartContainer>
  )
}
