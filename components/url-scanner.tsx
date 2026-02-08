"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import {
  Search,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
  Zap,
  Clock,
  Brain,
  Lock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type ScanResult = {
  url: string
  riskScore: number
  verdict: "safe" | "suspicious" | "malicious"
  model: string
  responseTime: number
  features: {
    hasHttps: boolean
    domainAge: string
    suspiciousKeywords: boolean
    redirectCount: number
  }
} | null

export function URLScanner() {
  const [url, setUrl] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<ScanResult>(null)
  const [scansUsed, setScansUsed] = useState(1)
  const maxFreeScans = 3

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const simulateScan = async () => {
    if (!url) return
    
    setIsScanning(true)
    setScanResult(null)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2500))

    // Generate random result for demo
    const riskScore = Math.floor(Math.random() * 100)
    const verdict: "safe" | "suspicious" | "malicious" =
      riskScore < 30 ? "safe" : riskScore < 70 ? "suspicious" : "malicious"

    setScanResult({
      url,
      riskScore,
      verdict,
      model: "Logistic Regression v2.1",
      responseTime: Math.floor(Math.random() * 30) + 15,
      features: {
        hasHttps: url.startsWith("https"),
        domainAge: Math.random() > 0.5 ? "2+ years" : "< 30 days",
        suspiciousKeywords: riskScore > 50,
        redirectCount: Math.floor(Math.random() * 3),
      },
    })

    setIsScanning(false)
    setScansUsed((prev) => Math.min(prev + 1, maxFreeScans))
  }

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case "safe":
        return "text-primary"
      case "suspicious":
        return "text-yellow-500"
      case "malicious":
        return "text-destructive"
      default:
        return "text-muted-foreground"
    }
  }

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case "safe":
        return <CheckCircle className="w-8 h-8" />
      case "suspicious":
        return <AlertTriangle className="w-8 h-8" />
      case "malicious":
        return <XCircle className="w-8 h-8" />
      default:
        return <Shield className="w-8 h-8" />
    }
  }

  return (
    <section
      ref={ref}
      className="relative py-24 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 cyber-grid opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[150px] rounded-full" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="text-foreground">Live URL </span>
            <span className="text-primary text-glow-green">Scanner</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Enter any URL to analyze its risk level using our advanced ML models.
            Free users get {maxFreeScans} scans.
          </p>
        </motion.div>

        {/* Scanner Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative rounded-2xl border border-border bg-card/50 backdrop-blur-xl p-6 sm:p-8"
        >
          {/* Usage Counter */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4 text-primary" />
              <span>Free Scans Used:</span>
              <span className="font-mono text-primary">
                {scansUsed} / {maxFreeScans}
              </span>
            </div>
            {scansUsed >= maxFreeScans && (
              <Button size="sm" className="bg-primary text-primary-foreground">
                Upgrade Plan
              </Button>
            )}
          </div>

          {/* Input Section */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="url"
                placeholder="Enter URL to scan (e.g., https://example.com)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="pl-12 h-14 bg-background/50 border-border focus:border-primary text-foreground"
                disabled={scansUsed >= maxFreeScans}
              />
            </div>
            <Button
              onClick={simulateScan}
              disabled={!url || isScanning || scansUsed >= maxFreeScans}
              className="h-14 px-8 bg-primary text-primary-foreground hover:bg-primary/90 glow-green"
            >
              {isScanning ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-5 w-5" />
                  Analyze URL
                </>
              )}
            </Button>
          </div>

          {/* Scanning Animation */}
          <AnimatePresence mode="wait">
            {isScanning && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8"
              >
                <div className="relative h-32 rounded-xl bg-background/30 border border-primary/20 overflow-hidden">
                  {/* Scan lines */}
                  <motion.div
                    animate={{ y: ["-100%", "200%"] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-x-0 h-8 bg-gradient-to-b from-transparent via-primary/20 to-transparent"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                      >
                        <Brain className="w-12 h-12 text-primary mx-auto mb-3" />
                      </motion.div>
                      <p className="text-sm text-muted-foreground font-mono">
                        Running ML inference...
                      </p>
                    </div>
                  </div>
                  {/* Data streams */}
                  <div className="absolute inset-0 flex justify-around">
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent"
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          delay: i * 0.1,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Result Card */}
          <AnimatePresence mode="wait">
            {scanResult && !isScanning && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="rounded-xl border border-border bg-background/50 overflow-hidden"
              >
                {/* Header */}
                <div className="p-6 border-b border-border">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-xl ${
                          scanResult.verdict === "safe"
                            ? "bg-primary/10"
                            : scanResult.verdict === "suspicious"
                            ? "bg-yellow-500/10"
                            : "bg-destructive/10"
                        } ${getVerdictColor(scanResult.verdict)}`}
                      >
                        {getVerdictIcon(scanResult.verdict)}
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1 font-mono truncate max-w-[300px]">
                          {scanResult.url}
                        </p>
                        <p
                          className={`text-2xl font-bold uppercase tracking-wide ${getVerdictColor(
                            scanResult.verdict
                          )}`}
                        >
                          {scanResult.verdict}
                        </p>
                      </div>
                    </div>

                    {/* Risk Score Gauge */}
                    <div className="text-center">
                      <div
                        className={`text-4xl font-bold font-mono ${getVerdictColor(
                          scanResult.verdict
                        )}`}
                      >
                        {scanResult.riskScore}
                      </div>
                      <p className="text-xs text-muted-foreground">Risk Score</p>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6">
                  <div className="text-center p-4 rounded-lg bg-card/50">
                    <Brain className="w-5 h-5 text-primary mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground mb-1">Model</p>
                    <p className="text-sm font-mono text-foreground">
                      {scanResult.model.split(" ")[0]}
                    </p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-card/50">
                    <Clock className="w-5 h-5 text-accent mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground mb-1">Latency</p>
                    <p className="text-sm font-mono text-foreground">
                      {scanResult.responseTime}ms
                    </p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-card/50">
                    <Lock className="w-5 h-5 text-primary mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground mb-1">HTTPS</p>
                    <p className="text-sm font-mono text-foreground">
                      {scanResult.features.hasHttps ? "Yes" : "No"}
                    </p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-card/50">
                    <Shield className="w-5 h-5 text-primary mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground mb-1">Domain Age</p>
                    <p className="text-sm font-mono text-foreground">
                      {scanResult.features.domainAge}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
