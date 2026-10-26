import { getApiBaseUrl } from "@/lib/config/api"

export interface EngineHealth {
  status: "ok" | "unhealthy" | "offline"
  service?: string
  ml_model_loaded: boolean
  model_architecture?: string
  version: string
  latencyMs?: number
  features?: {
    rdap_intelligence?: boolean
    dns_doh_intelligence?: boolean
    tls_x509_intelligence?: boolean
    http_dom_analysis?: boolean
    ssrf_protection?: boolean
    email_intelligence?: boolean
    messaging_intelligence?: boolean
    ml_v2_pipeline?: boolean
  }
}

export interface EmailAnalysisResult {
  status: string
  subject: string
  sender: {
    display_name?: string
    address?: string
    domain?: string
    reply_to_address?: string
    reply_to_domain?: string
    is_reply_to_mismatch: boolean
    is_display_name_spoofing: boolean
    impersonation_target?: string
  }
  auth: {
    source?: string
    verification_status?: string
    spf_status: string
    dkim_status: string
    dmarc_status: string
    has_auth_failure: boolean
  }
  headers: {
    subject?: string
    message_id?: string
    date?: string
    received_hops_count: number
    has_valid_message_id: boolean
    anomalies: string[]
  }
  social_engineering: {
    urgency_score: number
    has_urgency_language: boolean
    has_credential_request: boolean
    has_payment_or_wire_request: boolean
    has_crypto_request: boolean
    has_gift_card_request: boolean
    has_executive_impersonation: boolean
    has_account_suspension_threat: boolean
    detected_phrases: string[]
  }
  attachments: Array<{
    filename: string
    extension: string
    is_executable_or_script: boolean
    is_macro_enabled: boolean
    risk_level: string
  }>
  links: Array<{
    url: string
    display_text?: string
    is_mismatched_anchor: boolean
    is_suspicious: boolean
    risk_score: number
    verdict: string
    reasons: string[]
  }>
  risk_score: number
  verdict: "safe" | "suspicious" | "malicious" | string
  evidence: string[]
  limitations: string[]
  observed_at: number
  backendOnline: boolean
  responseTimeMs: number
}

export interface MessageAnalysisResult {
  status: string
  sender?: string
  social_engineering: {
    urgency_score: number
    has_urgency_language: boolean
    has_credential_request: boolean
    has_payment_or_wire_request: boolean
    has_crypto_request?: boolean
    has_gift_card_request?: boolean
    has_account_suspension_threat?: boolean
    detected_phrases: string[]
  }
  links: Array<{
    url: string
    is_suspicious: boolean
    risk_score: number
    verdict: string
    reasons: string[]
  }>
  risk_score: number
  verdict: "safe" | "suspicious" | "malicious" | string
  evidence: string[]
  limitations: string[]
  observed_at: number
  backendOnline: boolean
  responseTimeMs: number
}

export const multiVectorService = {
  async getHealth(): Promise<EngineHealth> {
    const start = Date.now()
    try {
      const res = await fetch(`${getApiBaseUrl()}/health`, {
        method: "GET",
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(3000),
      })
      const latencyMs = Date.now() - start
      if (res.ok) {
        const data = await res.json()
        return {
          status: "ok",
          service: data.service,
          ml_model_loaded: Boolean(data.ml_model_loaded),
          model_architecture: data.model_architecture,
          version: data.version || "2.0.0",
          features: data.features,
          latencyMs,
        }
      }
      return {
        status: "unhealthy",
        ml_model_loaded: false,
        version: "2.0.0",
        latencyMs,
      }
    } catch {
      return {
        status: "offline",
        ml_model_loaded: false,
        version: "2.0.0-client-fallback",
        latencyMs: Date.now() - start,
      }
    }
  },

  async analyzeEmail(rawEmail: string): Promise<EmailAnalysisResult> {
    const start = Date.now()
    try {
      const res = await fetch(`${getApiBaseUrl()}/analyze/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ raw_email: rawEmail }),
        signal: AbortSignal.timeout(6000),
      })
      const responseTimeMs = Date.now() - start

      if (res.ok) {
        const data = await res.json()
        return {
          ...data,
          backendOnline: true,
          responseTimeMs,
        }
      }
      throw new Error(`HTTP ${res.status}`)
    } catch {
      const responseTimeMs = Date.now() - start
      return this.localFallbackEmailAnalysis(rawEmail, responseTimeMs)
    }
  },

  async analyzeMessage(messageText: string, sender?: string): Promise<MessageAnalysisResult> {
    const start = Date.now()
    try {
      const res = await fetch(`${getApiBaseUrl()}/analyze/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText, sender: sender || "" }),
        signal: AbortSignal.timeout(6000),
      })
      const responseTimeMs = Date.now() - start

      if (res.ok) {
        const data = await res.json()
        return {
          ...data,
          backendOnline: true,
          responseTimeMs,
        }
      }
      throw new Error(`HTTP ${res.status}`)
    } catch {
      const responseTimeMs = Date.now() - start
      return this.localFallbackMessageAnalysis(messageText, sender, responseTimeMs)
    }
  },

  localFallbackEmailAnalysis(rawEmail: string, responseTimeMs: number): EmailAnalysisResult {
    const lower = rawEmail.toLowerCase()
    const evidence: string[] = ["[Client Fallback] Analyzed with on-device deterministic heuristics."]
    let risk_score = 10
    const detected_phrases: string[] = []

    const urgencyPatterns = ["urgent", "immediately", "account suspended", "24 hours", "verify your account", "unauthorized access", "wire transfer"]
    for (const pat of urgencyPatterns) {
      if (lower.includes(pat)) {
        detected_phrases.push(pat)
        evidence.push(`Urgent social engineering token detected: "${pat}"`)
        risk_score += 20
      }
    }

    const hasAttachmentMacros = lower.includes(".xlsm") || lower.includes(".docm") || lower.includes(".vbs")
    if (hasAttachmentMacros) {
      evidence.push("Suspicious macro-enabled attachment detected.")
      risk_score += 35
    }

    const hasReplyMismatch = lower.includes("reply-to:") && lower.includes("from:") && !lower.includes("@paypal.com") && lower.includes("paypal")
    if (hasReplyMismatch) {
      evidence.push("Display name impersonation or reply-to mismatch pattern detected.")
      risk_score += 30
    }

    risk_score = Math.min(100, Math.max(5, risk_score))
    const verdict = risk_score >= 70 ? "malicious" : risk_score >= 35 ? "suspicious" : "safe"

    return {
      status: "analyzed",
      subject: (rawEmail.match(/Subject:\s*(.*)/i) || [])[1] || "Parsed Email Content",
      sender: {
        address: (rawEmail.match(/From:\s*<?([^>]+)>?/i) || [])[1] || "unknown@envelope.local",
        domain: "parsed.local",
        is_reply_to_mismatch: hasReplyMismatch,
        is_display_name_spoofing: hasReplyMismatch,
      },
      auth: {
        spf_status: "unverified",
        dkim_status: "unverified",
        dmarc_status: "unverified",
        has_auth_failure: false,
      },
      headers: {
        received_hops_count: 1,
        has_valid_message_id: lower.includes("message-id:"),
        anomalies: !lower.includes("date:") ? ["Missing RFC 5322 Date header"] : [],
      },
      social_engineering: {
        urgency_score: detected_phrases.length * 15,
        has_urgency_language: detected_phrases.length > 0,
        has_credential_request: lower.includes("password") || lower.includes("login") || lower.includes("verify"),
        has_payment_or_wire_request: lower.includes("invoice") || lower.includes("wire") || lower.includes("bank"),
        has_crypto_request: lower.includes("btc") || lower.includes("bitcoin") || lower.includes("wallet"),
        has_gift_card_request: lower.includes("gift card") || lower.includes("apple card"),
        has_executive_impersonation: lower.includes("ceo") || lower.includes("cfo") || lower.includes("director"),
        has_account_suspension_threat: lower.includes("suspend") || lower.includes("locked") || lower.includes("terminate"),
        detected_phrases,
      },
      attachments: [],
      links: [],
      risk_score,
      verdict,
      evidence,
      limitations: [
        "Backend ML service offline; analysis executed on client heuristic parser.",
        "DKIM signature public key not verified against authoritative DNS.",
      ],
      observed_at: Date.now() / 1000,
      backendOnline: false,
      responseTimeMs,
    }
  },

  localFallbackMessageAnalysis(messageText: string, sender: string | undefined, responseTimeMs: number): MessageAnalysisResult {
    const lower = messageText.toLowerCase()
    const evidence: string[] = ["[Client Fallback] Scored via deterministic SMS lexical engine."]
    let risk_score = 10
    const detected_phrases: string[] = []

    const highRiskPhrases = [
      "card locked",
      "account suspended",
      "click here to unlock",
      "unrecognized login",
      "verify immediately",
      "call immediately",
      "otp code",
      "bank of america",
      "chase alert",
      "wells fargo notice"
    ]

    for (const phrase of highRiskPhrases) {
      if (lower.includes(phrase)) {
        detected_phrases.push(phrase)
        evidence.push(`High-urgency smishing keyword matched: "${phrase}"`)
        risk_score += 25
      }
    }

    const hasUrl = /https?:\/\/[^\s]+/i.test(messageText)
    if (hasUrl) {
      evidence.push("Embedded actionable URL detected inside SMS payload.")
      risk_score += 20
    }

    risk_score = Math.min(100, Math.max(5, risk_score))
    const verdict = risk_score >= 70 ? "malicious" : risk_score >= 35 ? "suspicious" : "safe"

    return {
      status: "analyzed",
      sender: sender || "SMS Transport",
      social_engineering: {
        urgency_score: detected_phrases.length * 20,
        has_urgency_language: detected_phrases.length > 0,
        has_credential_request: lower.includes("verify") || lower.includes("login") || lower.includes("password"),
        has_payment_or_wire_request: lower.includes("card") || lower.includes("bank") || lower.includes("charge"),
        detected_phrases,
      },
      links: hasUrl
        ? [
            {
              url: (messageText.match(/https?:\/\/[^\s]+/i) || [""])[0],
              is_suspicious: risk_score > 35,
              risk_score,
              verdict,
              reasons: ["Extracted from plain SMS stream"],
            },
          ]
        : [],
      risk_score,
      verdict,
      evidence,
      limitations: [
        "Analyzed using client-side lexical heuristics while backend daemon is offline.",
      ],
      observed_at: Date.now() / 1000,
      backendOnline: false,
      responseTimeMs,
    }
  },
}
