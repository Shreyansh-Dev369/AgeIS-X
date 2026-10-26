"use client"

import React, { useState } from "react"
import { Mail, MessageSquare, Play, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { DemoLabHeader } from "@/components/demo-lab/demo-lab-header"
import { ResultCard } from "@/components/demo-lab/result-card"
import { TriggeredRulesTable } from "@/components/demo-lab/triggered-rules-table"
import { EvidencePanel } from "@/components/demo-lab/evidence-panel"
import { RecommendationsPanel } from "@/components/demo-lab/recommendations-panel"
import { demoLabService, StandardEngineResponse } from "@/lib/services/demo-lab-service"

export default function M03EmailPage() {
  const [rawEmail, setRawEmail] = useState(`From: "David Morrison (CEO)" <ceo.office.corp-exec@gmail.com>
Reply-To: <ceo-private-channel@finance-advisory.biz>
To: <accounting@enterprise.internal>
Subject: URGENT: Confidential Wire Transfer Required for Acquisition
Date: Fri, 25 Oct 2026 09:14:02 -0400
Message-ID: <847291048201.29104@gmail.com>

Are you at your desk?
I am currently in an all-day confidential M&A board meeting and cannot take calls.
We need an urgent wire transfer of $48,500 processed today to secure the preliminary acquisition agreement before the 5:00 PM EST deadline.
Please bypass the standard purchase order queue as this deal is strictly confidential under NDA.
Wiring details: Bank of Pacific Escrow, Routing: 121000358, Account: 9840291048.
Please verify immediately at: https://login-auth-corp.ageis-sso.xyz/wire/authorize`)

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<StandardEngineResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const presets = [
    {
      label: "CEO Wire Impersonation (BEC)",
      content: `From: "David Morrison (CEO)" <ceo.office.corp-exec@gmail.com>
Reply-To: <ceo-private-channel@finance-advisory.biz>
To: <accounting@enterprise.internal>
Subject: URGENT: Confidential Wire Transfer Required for Acquisition

Please bypass standard PO queue for confidential wire transfer of $48,500. Routing: 121000358. Confirm immediately.`,
    },
    {
      label: "IT Support Password Reset Lure",
      content: `From: "IT Support Helpdesk" <support@it-services-corp.xyz>
To: <employee@enterprise.internal>
Subject: Mandatory Password Renewal - Account Expiring in 2 Hours

Your Active Directory password will expire today. Click here to retain your credentials: https://login-auth-corp.ageis-sso.xyz/renew`,
    },
    {
      label: "Vendor Updated Bank Account",
      content: `From: "Accounts Receivable" <ar@vendor-invoicing-update.com>
To: <ap@enterprise.internal>
Subject: Updated Remittance Instructions for Invoice #9842

Please remit pending payment of $34,250 to our new offshore account at Offshore Commercial Bank Ltd.`,
    },
  ]

  const handleScan = async (contentToScan: string = rawEmail) => {
    setLoading(true)
    setError(null)
    try {
      const data = await demoLabService.m03AnalyzeEmail(contentToScan)
      setResult(data)
    } catch (err: any) {
      setError(`Email analysis failed: ${err.message || String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 font-mono">
      <DemoLabHeader
        engineId="M-03"
        engineName="Email & Messaging Intelligence"
        category="Communication & Social Engineering Defense"
        description="Parses RFC 5322 MIME headers, evaluates SPF/DKIM/DMARC alignment claims, detects display-name spoofing and Reply-To mismatches, and applies psychological NLP rules to flag coercive urgency, executive impersonation, and fraudulent payment solicitations."
        analysisMode="live"
        onReset={() => setResult(null)}
        isAnalyzing={loading}
      />

      <div className="bg-[#0B0E14] border border-white/10 rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#64748B]">
            <Mail className="w-4 h-4 text-[#00E575]" />
            <span>RAW EMAIL MIME HEADERS & BODY</span>
          </div>
          <div className="flex gap-2">
            {presets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setRawEmail(p.content)
                  handleScan(p.content)
                }}
                className="text-[11px] px-2.5 py-1 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 rounded text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <Textarea
          value={rawEmail}
          onChange={(e) => setRawEmail(e.target.value)}
          rows={8}
          className="bg-[#07090E] border-white/10 text-xs font-mono text-[#F8FAFC]"
        />

        <div className="flex justify-end pt-2">
          <Button
            onClick={() => handleScan(rawEmail)}
            disabled={loading}
            className="bg-[#00E575] hover:bg-[#00c966] text-[#07090E] font-bold text-xs"
          >
            <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
            {loading ? "Analyzing MIME Headers..." : "Analyse Email Telemetry"}
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
