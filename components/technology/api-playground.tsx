"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { getApiBaseUrl } from "@/lib/config/api"
import { Terminal, Copy, Check, Play, Loader2, ArrowRight, Code2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function TechnologyApiPlayground() {
  const [activeEndpoint, setActiveEndpoint] = useState<"predict" | "email" | "message" | "health">("predict")
  const [isLoading, setIsLoading] = useState(false)
  const [responseJson, setResponseJson] = useState<any>(null)
  const [copied, setCopied] = useState(false)

  const baseUrl = getApiBaseUrl()

  const samplePayloads = {
    predict: {
      method: "POST",
      endpoint: "/predict",
      body: JSON.stringify({ url: "https://paypаl-verify.secure-update.xyz/login" }, null, 2),
      curl: `curl -X POST "${baseUrl}/predict" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://paypаl-verify.secure-update.xyz/login"}'`,
    },
    email: {
      method: "POST",
      endpoint: "/analyze/email",
      body: JSON.stringify({
        raw_email: "From: \"PayPal Security\" <security@paypa1-update.com>\nReply-To: phish-drop@offshore.cc\nTo: user@target.corp\nSubject: URGENT: Verify your account within 24 hours\n\nPlease click http://paypa1-update.com/restore to prevent suspension."
      }, null, 2),
      curl: `curl -X POST "${baseUrl}/analyze/email" \\
  -H "Content-Type: application/json" \\
  -d '{"raw_email": "From: \\"PayPal Security\\" <security@paypa1-update.com>\\nReply-To: phish-drop@offshore.cc\\nSubject: URGENT: Verify your account\\n\\nClick http://paypa1-update.com/restore"}'`,
    },
    message: {
      method: "POST",
      endpoint: "/analyze/message",
      body: JSON.stringify({
        message: "URGENT: Your Bank of America debit card has been locked. Click http://secure-bofa-verify.xyz to unlock immediately.",
        sender: "+1 (800) 432-1000 [Spoofed]"
      }, null, 2),
      curl: `curl -X POST "${baseUrl}/analyze/message" \\
  -H "Content-Type: application/json" \\
  -d '{"message": "URGENT: Your Bank of America debit card has been locked. Click http://secure-bofa-verify.xyz to unlock immediately.", "sender": "+1 (800) 432-1000"}'`,
    },
    health: {
      method: "GET",
      endpoint: "/health",
      body: "",
      curl: `curl -X GET "${baseUrl}/health"`,
    },
  }

  const [inputBody, setInputBody] = useState(samplePayloads.predict.body)

  const handleSelectEndpoint = (ep: "predict" | "email" | "message" | "health") => {
    setActiveEndpoint(ep)
    setInputBody(samplePayloads[ep].body)
    setResponseJson(null)
  }

  const handleExecuteRequest = async () => {
    setIsLoading(true)
    setResponseJson(null)
    const epConfig = samplePayloads[activeEndpoint]

    try {
      const options: RequestInit = {
        method: epConfig.method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
      if (epConfig.method === "POST" && inputBody.trim()) {
        options.body = inputBody
      }

      const res = await fetch(`${baseUrl}${epConfig.endpoint}`, options)
      const data = await res.json()
      setResponseJson(data)
    } catch (err: any) {
      setResponseJson({
        error: "Failed to connect to local microservice",
        message: err.message,
        hint: "Ensure FastAPI daemon is running on port 8000 via python -m uvicorn backend.main:app",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(samplePayloads[activeEndpoint].curl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="border border-white/15 bg-[#07090E] p-5 sm:p-7 space-y-6 font-mono text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <span className="text-[10px] text-[#00E575] uppercase tracking-widest block font-bold">
            // LIVE REST API WORKBENCH
          </span>
          <h3 className="text-sm sm:text-base font-bold text-[#F8FAFC] tracking-tight">
            Interactive Sub-20ms Microservice Ingestion Tester
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleCopyCurl}
            className="border-white/15 bg-transparent hover:bg-white/5 text-[#F8FAFC] text-[11px] h-8 px-2.5 rounded-none"
          >
            {copied ? <Check className="w-3.5 h-3.5 mr-1 text-[#00E575]" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
            <span>{copied ? "COPIED" : "COPY CURL"}</span>
          </Button>
        </div>
      </div>

      {/* Endpoint Selector Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => handleSelectEndpoint("predict")}
          className={cn(
            "px-3 py-1.5 border text-xs cursor-pointer transition-colors",
            activeEndpoint === "predict"
              ? "bg-[#00E575] text-[#07090E] font-bold border-[#00E575] shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
              : "border-white/10 bg-[#0B0E14] text-[#94A3B8] hover:text-[#F8FAFC]"
          )}
        >
          POST /predict (URL & DOM)
        </button>

        <button
          type="button"
          onClick={() => handleSelectEndpoint("email")}
          className={cn(
            "px-3 py-1.5 border text-xs cursor-pointer transition-colors",
            activeEndpoint === "email"
              ? "bg-[#00E575] text-[#07090E] font-bold border-[#00E575] shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
              : "border-white/10 bg-[#0B0E14] text-[#94A3B8] hover:text-[#F8FAFC]"
          )}
        >
          POST /analyze/email (MIME)
        </button>

        <button
          type="button"
          onClick={() => handleSelectEndpoint("message")}
          className={cn(
            "px-3 py-1.5 border text-xs cursor-pointer transition-colors",
            activeEndpoint === "message"
              ? "bg-[#00E575] text-[#07090E] font-bold border-[#00E575] shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
              : "border-white/10 bg-[#0B0E14] text-[#94A3B8] hover:text-[#F8FAFC]"
          )}
        >
          POST /analyze/message (SMS)
        </button>

        <button
          type="button"
          onClick={() => handleSelectEndpoint("health")}
          className={cn(
            "px-3 py-1.5 border text-xs cursor-pointer transition-colors",
            activeEndpoint === "health"
              ? "bg-[#00E575] text-[#07090E] font-bold border-[#00E575] shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
              : "border-white/10 bg-[#0B0E14] text-[#94A3B8] hover:text-[#F8FAFC]"
          )}
        >
          GET /health (Heartbeat)
        </button>
      </div>

      {/* Request & Response Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Request Configuration */}
        <div className="space-y-3 p-4 bg-[#0B0E14] border border-white/10">
          <div className="flex items-center justify-between text-[10px] text-[#94A3B8] border-b border-white/10 pb-2">
            <span className="font-bold text-[#F8FAFC]">INCOMING JSON PAYLOAD</span>
            <span className="text-[#00E575]">{samplePayloads[activeEndpoint].method} {samplePayloads[activeEndpoint].endpoint}</span>
          </div>

          {activeEndpoint !== "health" ? (
            <textarea
              rows={9}
              value={inputBody}
              onChange={(e) => setInputBody(e.target.value)}
              className="w-full bg-[#040608] border border-white/10 p-3 text-xs font-mono text-[#F8FAFC] focus:outline-none focus:border-[#00E575] leading-relaxed"
            />
          ) : (
            <div className="p-4 bg-[#040608] border border-white/10 text-xs text-[#94A3B8] min-h-[170px] flex items-center justify-center">
              <span>No payload required for health attestation</span>
            </div>
          )}

          <Button
            type="button"
            onClick={handleExecuteRequest}
            disabled={isLoading}
            className="w-full bg-[#00E575] hover:bg-[#00CC66] text-[#07090E] font-bold text-xs uppercase h-10 rounded-none shadow-[0_1px_3px_rgba(0,0,0,0.4),0_0_12px_rgba(0,229,117,0.2)] cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                <span>EXECUTING LIVE INFERENCE...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
                <span>SEND REQUEST TO LOCAL DAEMON</span>
              </>
            )}
          </Button>
        </div>

        {/* Right: Response Payload */}
        <div className="space-y-3 p-4 bg-[#0B0E14] border border-white/10">
          <div className="flex items-center justify-between text-[10px] text-[#94A3B8] border-b border-white/10 pb-2">
            <span className="font-bold text-[#F8FAFC]">DAEMON RESPONSE PAYLOAD</span>
            <span className="text-[#64748B]">HTTP 200 OK</span>
          </div>

          <pre className="p-3 bg-[#040608] border border-white/10 text-[11px] text-[#94A3B8] overflow-x-auto min-h-[220px] max-h-[300px] overflow-y-auto leading-relaxed select-all">
            {responseJson ? JSON.stringify(responseJson, null, 2) : `// Click "SEND REQUEST" to inspect the live multi-signal verdict,
// entropy score, RDAP domain lineage, and homoglyph detection output.`}
          </pre>
        </div>
      </div>
    </div>
  )
}
