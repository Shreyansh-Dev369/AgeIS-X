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
      title="Threat Ingestion & Telemetry Stream"
      subtitle="Clean traffic volume vs blocked threat vectors over time"
      action={
        <div className="flex items-center gap-1 bg-[#040608] p-0.5 border border-white/10 font-mono">
          {(["24h", "7d", "30d", "90d"] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-2 py-0.5 text-[10px] font-bold uppercase transition-colors ${
                timeRange === range
                  ? "bg-[#00ff66]/10 border border-[#00ff66] text-[#00ff66]"
                  : "text-[#7e8b9b] hover:text-[#f8fafc]"
              }`}
            >
              {range.toUpperCase()}
            </button>
          ))}
        </div>
      }
    >
      <div className="space-y-4 font-mono select-none">
        {/* Visual Chart */}
        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#00f0ff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff3b30" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#ff3b30" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 2" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="time"
                stroke="#7e8b9b"
                fontSize={10}
                tickLine={false}
                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              />
              <YAxis
                stroke="#7e8b9b"
                fontSize={10}
                tickLine={false}
                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#040608",
                  borderColor: "rgba(255,255,255,0.15)",
                  borderRadius: "0px",
                  fontSize: "11px",
                  fontFamily: "monospace",
                  color: "#f8fafc",
                }}
              />
              <Area
                type="monotone"
                dataKey="cleanRequests"
                name="Clean Telemetry"
                stroke="#00f0ff"
                strokeWidth={1.5}
                fillOpacity={1}
                fill="url(#colorRequests)"
              />
              <Area
                type="monotone"
                dataKey="threatsBlocked"
                name="Threats Blocked"
                stroke="#ff3b30"
                strokeWidth={1.5}
                fillOpacity={1}
                fill="url(#colorThreats)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Tactical Counters Row */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center text-xs">
          <div className="p-2 bg-[#040608] border border-white/10">
            <span className="text-[10px] text-[#7e8b9b] uppercase block">TOTAL VOLUME</span>
            <span className="text-xs sm:text-sm font-bold text-[#00f0ff]">{totalClean.toLocaleString()}</span>
          </div>
          <div className="p-2 bg-[#040608] border border-white/10">
            <span className="text-[10px] text-[#7e8b9b] uppercase block">THREATS BLOCKED</span>
            <span className="text-xs sm:text-sm font-bold text-[#00ff66]">{totalThreats.toLocaleString()}</span>
          </div>
          <div className="p-2 bg-[#040608] border border-white/10">
            <span className="text-[10px] text-[#7e8b9b] uppercase block">ANOMALIES</span>
            <span className="text-xs sm:text-sm font-bold text-[#ffb800]">{totalAnomalies.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </ChartContainer>
  )
}
