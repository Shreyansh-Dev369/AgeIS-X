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

  const scanURL = async () => {
    console.log("🔥 Scan triggered:", url)

    if (!url) return

    setIsScanning(true)
    setScanResult(null)

    const startTime = Date.now()

    try {
      const res = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      })

      console.log("📡 Response status:", res.status)

      if (!res.ok) {
        const text = await res.text()
        throw new Error(`API Error: ${res.status} - ${text}`)
      }

      const data = await res.json()
      console.log("✅ API Data:", data)

      const responseTime = Date.now() - startTime

      const probability = data.probability
      const riskScore = Math.round(probability * 100)

      let verdict: "safe" | "suspicious" | "malicious" = "safe"
      if (riskScore < 30) verdict = "safe"
      else if (riskScore < 70) verdict = "suspicious"
      else verdict = "malicious"

      setScanResult({
        url: data.url,
        riskScore,
        verdict,
        model: "Logistic Regression",
        responseTime,
        features: {
          hasHttps: data.url.startsWith("https"),
          domainAge: "Unknown",
          suspiciousKeywords: riskScore > 50,
          redirectCount: 0,
        },
      })

      setScansUsed((prev) => Math.min(prev + 1, maxFreeScans))
    } catch (err) {
      console.error("❌ FULL ERROR:", err)
      alert("Backend not connected OR CORS issue")
    }

    setIsScanning(false)
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
    <section ref={ref} className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 cyber-grid opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[150px] rounded-full" />

      <div className="relative z-10 page-container">
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
            Enter any URL to analyze its risk level using our ML model.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative rounded-2xl border border-border bg-card/50 backdrop-blur-xl p-6 sm:p-8"
        >
          <div className="flex justify-between mb-6 text-sm">
            <span>Free Scans:</span>
            <span>{scansUsed} / {maxFreeScans}</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="url"
                placeholder="Enter URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="pl-12 h-14"
                disabled={scansUsed >= maxFreeScans}
              />
            </div>

            <Button
              onClick={scanURL}
              disabled={!url || isScanning || scansUsed >= maxFreeScans}
              className="h-14 px-8"
            >
              {isScanning ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-5 w-5" />
                  Analyze
                </>
              )}
            </Button>
          </div>

          <AnimatePresence>
            {isScanning && (
              <motion.div className="text-center py-10">
                <Brain className="w-12 h-12 mx-auto text-primary animate-pulse" />
                <p className="mt-3 text-muted-foreground">
                  Running ML inference...
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {scanResult && !isScanning && (
              <motion.div className="p-6 border rounded-xl">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm truncate max-w-[300px]">{scanResult.url}</p>
                    <p className={`text-2xl font-bold ${getVerdictColor(scanResult.verdict)}`}>
                      {scanResult.verdict.toUpperCase()}
                    </p>
                  </div>

                  <div className="text-3xl font-bold">
                    {scanResult.riskScore}
                  </div>
                </div>

                <div className="grid grid-cols-2 mt-6 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Model</p>
                    <p>{scanResult.model}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Latency</p>
                    <p>{scanResult.responseTime} ms</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">HTTPS</p>
                    <p>{scanResult.features.hasHttps ? "Yes" : "No"}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Risk Flag</p>
                    <p>{scanResult.features.suspiciousKeywords ? "Yes" : "No"}</p>
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