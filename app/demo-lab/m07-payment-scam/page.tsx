"use client"

import React, { useState } from "react"
import { CreditCard, Play, DollarSign, AlertOctagon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DemoLabHeader } from "@/components/demo-lab/demo-lab-header"
import { ResultCard } from "@/components/demo-lab/result-card"
import { TriggeredRulesTable } from "@/components/demo-lab/triggered-rules-table"
import { EvidencePanel } from "@/components/demo-lab/evidence-panel"
import { RecommendationsPanel } from "@/components/demo-lab/recommendations-panel"
import { demoLabService, StandardEngineResponse } from "@/lib/services/demo-lab-service"

export default function M07PaymentScamPage() {
  const [content, setContent] = useState(`URGENT: Updated Banking Information for Outstanding Invoice #INV-88291.
Please be advised that due to our recent corporate banking restructuring, our primary ACH / wire receiving account has changed effective immediately.
Do NOT send funds to our previous Wells Fargo account.
Please remit the outstanding balance of $34,250.00 by close of business tomorrow to avoid account suspension:
Beneficiary: Apex International Logistics LLC
Bank: Offshore Commercial Bank Ltd
Routing / Swift: OCBLUS33
Account Number: 8840-2910-4491
Please reply with wire remittance confirmation receipt.`)
  const [sender, setSender] = useState("Accounts Receivable <ar-vendor@supplier-acct-update.xyz>")
  const [amount, setAmount] = useState("$34,250.00")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<StandardEngineResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const presets = [
    {
      id: "invoice_bank_switch",
      label: "Vendor Bank Switch (BEC)",
      sender: "Accounts Receivable <ar-vendor@supplier-acct-update.xyz>",
      amount: "$34,250.00",
      content: `URGENT: Updated Banking Information for Outstanding Invoice #INV-88291.
Do NOT send funds to our previous account. Remit $34,250.00 immediately to Offshore Commercial Bank Ltd, Account: 8840-2910-4491 to avoid contract termination.`,
    },
    {
      id: "crypto_investment_scam",
      label: "Guaranteed Crypto Yield (HYIP)",
      sender: "VIP Crypto Advisor <advisor@quantum-crypto.biz>",
      amount: "0.15 BTC / $5,000",
      content: `Guaranteed 250% daily returns with our Quantum AI trading pool! Zero risk, 100% principal protection. Send 0.15 BTC to escrow: bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq. Offer expires in 3 hours!`,
    },
    {
      id: "ceo_wire_urgency",
      label: "CEO Urgent Wire Demand",
      sender: "David Morrison <ceo.office.corp-exec@gmail.com>",
      amount: "$48,500.00",
      content: `Are you at your desk? In a confidential M&A meeting. Need urgent wire of $48,500 today. Bypass standard purchase order queue. Wire to Bank of Pacific Escrow, Routing: 121000358.`,
    },
    {
      id: "legitimate_invoice",
      label: "Legitimate SaaS Invoice",
      sender: "billing@cloudflare.com",
      amount: "$20.00",
      content: `Thank you for your payment. Your monthly invoice for Cloudflare Pro Plan is available. Payment method: Visa ending in 4102. Terms: Net 30. No action required.`,
    },
  ]

  const handleScan = async (c: string = content, s: string = sender, a: string = amount) => {
    setLoading(true)
    setError(null)
    try {
      const data = await demoLabService.m07AnalyzeScam({
        content: c,
        sender: s,
      })
      setResult(data)
    } catch (err: any) {
      setError(`Payment scam analysis failed: ${err.message || String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 font-mono">
      <DemoLabHeader
        engineId="M-07"
        engineName="Payment & Scam Intelligence"
        category="Financial Fraud & Psychological Manipulation"
        description="Scans messages, invoices, and investment solicitations for Business Email Compromise (BEC) account diversion patterns, unregulated cryptocurrency escrow demands, gift card extortion, and coercive urgency heuristics."
        analysisMode="live"
        onReset={() => setResult(null)}
        isAnalyzing={loading}
      />

      <div className="bg-[#0B0E14] border border-white/10 rounded-lg p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/5">
          <span className="text-xs font-bold text-[#F8FAFC]">PAYMENT REQUEST / INVOICE CONTENT</span>
          <div className="flex flex-wrap gap-1.5">
            {presets.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setContent(p.content)
                  setSender(p.sender)
                  setAmount(p.amount)
                  handleScan(p.content, p.sender, p.amount)
                }}
                className="text-[11px] px-2.5 py-1 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 rounded text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] text-[#64748B] block mb-1">CLAIMED SENDER IDENTITY</label>
            <Input
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              className="bg-[#07090E] border-white/10 text-xs font-mono text-[#F8FAFC]"
            />
          </div>
          <div>
            <label className="text-[11px] text-[#64748B] block mb-1">TRANSACTION AMOUNT</label>
            <Input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-[#07090E] border-white/10 text-xs font-mono text-[#F8FAFC]"
            />
          </div>
        </div>

        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          className="bg-[#07090E] border-white/10 text-xs font-mono text-[#F8FAFC]"
        />

        <div className="flex justify-end pt-2">
          <Button
            onClick={() => handleScan(content, sender, amount)}
            disabled={loading}
            className="bg-[#00E575] hover:bg-[#00c966] text-[#07090E] font-bold text-xs"
          >
            <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
            {loading ? "Evaluating Rules..." : "Analyse Payment Lure"}
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
