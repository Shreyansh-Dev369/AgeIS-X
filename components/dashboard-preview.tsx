"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import {
  Shield,
  AlertTriangle,
  TrendingUp,
  Activity,
  Search,
  Filter,
  ChevronDown,
  ExternalLink,
  CheckCircle,
  XCircle,
  BarChart3,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const mockHistory = [
  {
    id: 1,
    url: "https://secure-banking.com/login",
    riskScore: 12,
    verdict: "safe",
    date: "2024-01-15 14:32",
  },
  {
    id: 2,
    url: "https://paypa1-verify.net/account",
    riskScore: 89,
    verdict: "malicious",
    date: "2024-01-15 13:45",
  },
  {
    id: 3,
    url: "https://docs.google.com/document",
    riskScore: 8,
    verdict: "safe",
    date: "2024-01-15 12:20",
  },
  {
    id: 4,
    url: "https://amaz0n-deals.info/promo",
    riskScore: 76,
    verdict: "suspicious",
    date: "2024-01-15 11:55",
  },
  {
    id: 5,
    url: "https://github.com/vercel/next.js",
    riskScore: 5,
    verdict: "safe",
    date: "2024-01-15 10:30",
  },
]

const stats = [
  {
    label: "URLs Scanned",
    value: "1,247",
    change: "+12%",
    icon: Activity,
    color: "text-primary",
  },
  {
    label: "Threats Detected",
    value: "23",
    change: "+3",
    icon: AlertTriangle,
    color: "text-destructive",
  },
  {
    label: "Safe URLs",
    value: "1,224",
    change: "+11%",
    icon: CheckCircle,
    color: "text-primary",
  },
  {
    label: "Avg Risk Score",
    value: "18.4",
    change: "-2.1",
    icon: BarChart3,
    color: "text-accent",
  },
]

export function DashboardPreview() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <section
      id="dashboard"
      ref={ref}
      className="relative py-24 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 cyber-grid opacity-20" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[150px] rounded-full" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-6"
          >
            <BarChart3 className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Analytics Dashboard
            </span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-foreground">Powerful </span>
            <span className="text-primary text-glow-green">Dashboard</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Track your scans, monitor threats, and analyze patterns with our 
            comprehensive analytics dashboard.
          </p>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          {/* Browser Frame */}
          <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-xl overflow-hidden shadow-2xl">
            {/* Browser Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-card/80">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-primary/60" />
              </div>
              <div className="flex-1 mx-4">
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-background/50 border border-border max-w-md mx-auto">
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground font-mono">
                    app.ageis-x.com/dashboard
                  </span>
                </div>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="p-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                    className="p-4 rounded-xl border border-border bg-background/50"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      <span
                        className={`text-xs font-mono ${
                          stat.change.startsWith("+")
                            ? "text-primary"
                            : "text-destructive"
                        }`}
                      >
                        {stat.change}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-foreground font-mono">
                      {stat.value}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* History Table */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="rounded-xl border border-border bg-background/30 overflow-hidden"
              >
                {/* Table Header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <h3 className="font-semibold text-foreground">
                    Scan History
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search URLs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-9 w-48 bg-background/50"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 bg-transparent"
                    >
                      <Filter className="w-4 h-4" />
                      Filter
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-card/30">
                        <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          URL
                        </th>
                        <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Risk Score
                        </th>
                        <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Verdict
                        </th>
                        <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {mockHistory.map((item, index) => (
                        <motion.tr
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={isInView ? { opacity: 1, x: 0 } : {}}
                          transition={{
                            duration: 0.3,
                            delay: 1 + index * 0.1,
                          }}
                          className="hover:bg-card/30 transition-colors"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-mono text-foreground truncate max-w-[200px] lg:max-w-[300px]">
                                {item.url}
                              </span>
                              <ExternalLink className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span
                              className={`font-mono font-bold ${
                                item.riskScore < 30
                                  ? "text-primary"
                                  : item.riskScore < 70
                                  ? "text-yellow-500"
                                  : "text-destructive"
                              }`}
                            >
                              {item.riskScore}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                                item.verdict === "safe"
                                  ? "bg-primary/10 text-primary"
                                  : item.verdict === "suspicious"
                                  ? "bg-yellow-500/10 text-yellow-500"
                                  : "bg-destructive/10 text-destructive"
                              }`}
                            >
                              {item.verdict === "safe" ? (
                                <CheckCircle className="w-3 h-3" />
                              ) : item.verdict === "suspicious" ? (
                                <AlertTriangle className="w-3 h-3" />
                              ) : (
                                <XCircle className="w-3 h-3" />
                              )}
                              {item.verdict}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className="text-sm text-muted-foreground font-mono">
                              {item.date}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-border">
                  <span className="text-sm text-muted-foreground">
                    Showing 1-5 of 1,247 results
                  </span>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm">
                      Next
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Floating elements */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 1.5 }}
            className="absolute -top-4 -right-4 p-3 rounded-xl bg-primary/10 border border-primary/30 backdrop-blur-xl"
          >
            <TrendingUp className="w-6 h-6 text-primary" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 1.7 }}
            className="absolute -bottom-4 -left-4 p-3 rounded-xl bg-accent/10 border border-accent/30 backdrop-blur-xl"
          >
            <Shield className="w-6 h-6 text-accent" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
