import { getApiBaseUrl, buildApiUrl } from "@/lib/config/api"
import { analyzeUrlStructure } from "@/lib/utils/url-analyzer"

export type AnalysisMode = "live" | "simulated"
export type Verdict = "safe" | "suspicious" | "malicious" | "inconclusive"
export type Severity = "info" | "low" | "medium" | "high" | "critical"

export interface EvidenceItem {
  source: string
  type: string
  description: string
  raw_data?: any
}

export interface TriggeredRule {
  rule_id: string
  name: string
  severity: Severity
  points: number
  description: string
  mitre_id?: string
}

export interface Finding {
  id: string
  title: string
  severity: Severity
  description: string
  mitre_id?: string
  evidence?: string
}

export interface StandardEngineResponse {
  engine_id: string
  engine_name: string
  analysis_id: string
  analysis_mode: AnalysisMode
  verdict: Verdict
  risk_score: number
  confidence?: number | null
  summary: string
  findings: Finding[]
  evidence: EvidenceItem[]
  triggered_rules: TriggeredRule[]
  recommendations: string[]
  timestamp: number
  limitations: string[]
  metadata: Record<string, any>
}

export interface ScenarioMetadata {
  scenario_id: string
  code: string
  title: string
  category: string
  target_engines: string[]
  description: string
  expected_verdict: string
  key_learning_objective: string
}

export interface ScenarioExecutionResult {
  scenario: ScenarioMetadata
  execution_time_ms: number
  engine_results: StandardEngineResponse[]
  unified_assessment: StandardEngineResponse
}

// Helper to wrap POST requests to backend with timeout and JSON headers
async function postJson<T>(path: string, body: any): Promise<T> {
  const url = buildApiUrl(path)
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(10000),
  })
  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(`API error ${res.status}: ${errorText}`)
  }
  return res.json() as Promise<T>
}

export const demoLabService = {
  // M-01: Predict URL (Wrapped into Standard Response)
  async m01PredictUrl(urlToScan: string): Promise<StandardEngineResponse> {
    try {
      const res = await fetch(buildApiUrl("/predict"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlToScan }),
        signal: AbortSignal.timeout(12000),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()

      const findings: Finding[] = []
      if (data.features.has_homoglyphs) {
        findings.push({
          id: "F-M01-HOMOGLYPH",
          title: "Unicode Homoglyph Typosquat Detected",
          severity: "critical",
          description: "Domain contains lookalike Cyrillic/Greek characters mimicking a trusted brand.",
          mitre_id: "T1566.002",
          evidence: data.features.homoglyph_details,
        })
      }
      if (data.features.is_ip_literal) {
        findings.push({
          id: "F-M01-IP-LITERAL",
          title: "Direct IP Address Navigation (No Hostname)",
          severity: "high",
          description: "URL points directly to an IP literal rather than a registered domain.",
          mitre_id: "T1566.002",
        })
      }
      if (data.rdap && data.rdap.domain_age_days !== null && data.rdap.domain_age_days < 30) {
        findings.push({
          id: "F-M01-NRD",
          title: "Newly Registered Domain (<30 days)",
          severity: "high",
          description: `Domain registration age is ${data.rdap.domain_age_days} days old.`,
        })
      }

      return {
        engine_id: "M-01",
        engine_name: "URL & Domain Intelligence",
        analysis_id: `AGEIS-M01-${Date.now().toString(36).toUpperCase()}`,
        analysis_mode: "live",
        verdict: (data.verdict as Verdict) || "suspicious",
        risk_score: data.risk_score,
        confidence: data.confidence ?? 0.94,
        summary: `Domain and lexical analysis completed for '${data.url}'. ML Probability: ${(data.probability * 100).toFixed(1)}%. Risk Score: ${data.risk_score}/100 (${data.verdict_state || data.verdict.toUpperCase()}).`,
        findings,
        evidence: (data.evidence || []).map((ev: string) => ({
          source: "DomainEngine",
          type: "lexical_signal",
          description: ev,
        })),
        triggered_rules: [
          {
            rule_id: "RULE-M01-ML-V2",
            name: "Hybrid Logistic Regression & TF-IDF Vectorizer",
            severity: data.risk_score > 70 ? "critical" : data.risk_score > 30 ? "medium" : "low",
            points: data.risk_score,
            description: "Calibrated multi-ngram lexical probability classifier.",
          },
        ],
        recommendations:
          data.risk_score > 70
            ? ["Block domain at gateway resolver", "Purge any browser credentials entered on this host"]
            : ["Standard browsing permitted"],
        timestamp: data.timestamp || Date.now() / 1000,
        limitations: data.limitations || ["Authoritative live RDAP/DNS query"],
        metadata: {
          ml_probability: data.probability,
          model_architecture: data.model_info?.architecture,
          rdap_age_days: data.rdap?.domain_age_days,
          dns_status: data.dns?.status,
          tls_verified: data.tls?.verified,
        },
      }
    } catch {
      // Local fallback for M-01 using deterministic structural analyzer
      const local = analyzeUrlStructure(urlToScan)
      let fallbackVerdict: Verdict = "inconclusive"
      let fallbackRisk = 30
      let fallbackConfidence = 0.50

      if (local.isKnownBenign) {
        fallbackVerdict = "safe"
        fallbackRisk = 5
        fallbackConfidence = 0.85
      } else if (
        local.hasHomoglyphs ||
        local.hasUserinfo ||
        local.isTyposquatPattern ||
        local.brandImpersonation ||
        local.hasExecutableExtension ||
        local.hasOpenRedirect
      ) {
        fallbackVerdict = "malicious"
        fallbackRisk = Math.max(75, Math.min(100, local.structuralRiskPoints + 20))
        fallbackConfidence = 0.88
      } else if (
        local.suspiciousKeywords.length > 0 ||
        local.isSuspiciousTld ||
        local.isIpLiteral ||
        local.subdomainDepth >= 3
      ) {
        fallbackVerdict = "suspicious"
        fallbackRisk = Math.max(45, local.structuralRiskPoints + 15)
        fallbackConfidence = 0.70
      }

      return {
        engine_id: "M-01",
        engine_name: "URL & Domain Intelligence",
        analysis_id: `AGEIS-M01-FALLBACK`,
        analysis_mode: "simulated",
        verdict: fallbackVerdict,
        risk_score: fallbackRisk,
        confidence: fallbackConfidence,
        summary: `Local client fallback analysis for '${urlToScan}'. Backend currently offline; evaluated via deterministic structural heuristics.`,
        findings: local.evidence.map((ev, idx) => ({
          id: `F-M01-FALLBACK-${idx}`,
          title: "Structural Heuristic Signal",
          severity: fallbackRisk > 70 ? "high" : fallbackRisk > 30 ? "medium" : "info",
          description: ev,
        })),
        evidence: local.evidence.map((ev) => ({
          source: "ClientStructuralAnalyzer",
          type: "structural_signal",
          description: ev,
        })),
        triggered_rules: [],
        recommendations: fallbackRisk > 70
          ? ["Block access until authoritative backend inspection confirms"]
          : ["Ensure FastAPI backend service is running for live RDAP/TLS intelligence"],
        timestamp: Date.now() / 1000,
        limitations: ["Backend offline. Result calculated locally via deterministic lexical parser."],
        metadata: { url: urlToScan, structural: local },
      }
    }
  },

  // M-02: Web Content Intelligence
  async m02AnalyzeContent(req: { url?: string; raw_html?: string; sample_scenario?: string }): Promise<StandardEngineResponse> {
    return postJson<StandardEngineResponse>("/api/m02/content", req)
  },

  // M-03: Email / Message Intelligence
  async m03AnalyzeEmail(rawEmail: string): Promise<StandardEngineResponse> {
    try {
      const res = await postJson<any>("/analyze/email", { raw_email: rawEmail })
      return {
        engine_id: "M-03",
        engine_name: "Email Intelligence",
        analysis_id: `AGEIS-M03-${Date.now().toString(36).toUpperCase()}`,
        analysis_mode: "live",
        verdict: (res.verdict as Verdict) || "suspicious",
        risk_score: res.risk_score || 0,
        confidence: 0.95,
        summary: `Email MIME analysis completed. Subject: '${res.subject || "No Subject"}'. Sender: '${res.sender?.address || "Unknown"}'. Urgency Score: ${res.social_engineering?.urgency_score || 0}.`,
        findings: (res.evidence || []).map((ev: string, idx: number) => ({
          id: `F-M03-${idx}`,
          title: "Email Forensic Signal",
          severity: res.risk_score > 70 ? "critical" : "medium",
          description: ev,
        })),
        evidence: (res.evidence || []).map((ev: string) => ({
          source: "EmailParser",
          type: "mime_signal",
          description: ev,
        })),
        triggered_rules: [
          {
            rule_id: "RULE-M03-EMAIL-AUTH",
            name: "MIME Authentication & Spoofing Heuristics",
            severity: res.sender?.is_display_name_spoofing ? "high" : "low",
            points: res.risk_score,
            description: "Checks Return-Path, Reply-To mismatches and social engineering language.",
          },
        ],
        recommendations:
          res.risk_score > 60
            ? ["Do not click links or open attachments in this message", "Report message to SecOps"]
            : ["Normal email handling"],
        timestamp: res.observed_at || Date.now() / 1000,
        limitations: res.limitations || ["Header-based evaluation; live DKIM DNS verification disabled"],
        metadata: res,
      }
    } catch {
      const hasUrgentKeywords = /urgent|wire transfer|immediately|restricted|suspended|password|bank|credit card|pay/i.test(rawEmail)
      return {
        engine_id: "M-03",
        engine_name: "Email Intelligence",
        analysis_id: "AGEIS-M03-FALLBACK",
        analysis_mode: "simulated",
        verdict: hasUrgentKeywords ? "suspicious" : "inconclusive",
        risk_score: hasUrgentKeywords ? 55 : 20,
        confidence: 0.50,
        summary: "Local client fallback evaluation. Live FastAPI backend unreachable; applied local keyword heuristics.",
        findings: hasUrgentKeywords ? [
          {
            id: "F-M03-FALLBACK-URGENT",
            title: "Urgency / Financial Keywords Observed",
            severity: "medium",
            description: "Lexical tokens indicate financial transfer, suspension, or urgency requests.",
          },
        ] : [],
        evidence: [
          {
            source: "ClientHeuristic",
            type: "offline_notice",
            description: "Backend offline. Live MIME headers and DKIM/SPF DNS records were not verified.",
          },
        ],
        triggered_rules: [],
        recommendations: ["Ensure Python backend service is running for live MIME and DKIM/SPF verification."],
        timestamp: Date.now() / 1000,
        limitations: ["Backend offline. Result calculated locally via static heuristic."],
        metadata: {},
      }
    }
  },

  // M-04: Endpoint Security
  async m04AnalyzeEndpoint(req: { scenario_preset?: string; events?: any[] }): Promise<StandardEngineResponse> {
    return postJson<StandardEngineResponse>("/api/m04/endpoint", req)
  },

  // M-05: Network Intelligence
  async m05AnalyzeNetwork(req: { scenario_preset?: string; connections?: any[] }): Promise<StandardEngineResponse> {
    return postJson<StandardEngineResponse>("/api/m05/network", req)
  },

  // M-06: Identity Security
  async m06AnalyzeIdentity(req: { scenario_preset?: string; events?: any[] }): Promise<StandardEngineResponse> {
    return postJson<StandardEngineResponse>("/api/m06/identity", req)
  },

  // M-07: Payment & Scam Intelligence
  async m07AnalyzeScam(req: { content?: string; sender?: string; scenario_preset?: string }): Promise<StandardEngineResponse> {
    return postJson<StandardEngineResponse>("/api/m07/scam", req)
  },

  // M-08: File & Malware Analysis
  async m08AnalyzeFile(req: { filename?: string; sample_preset?: string; file_bytes_base64?: string }): Promise<StandardEngineResponse> {
    return postJson<StandardEngineResponse>("/api/m08/file", req)
  },

  async m08UploadFile(file: File): Promise<StandardEngineResponse> {
    const formData = new FormData()
    formData.append("file", file)
    const res = await fetch(buildApiUrl("/api/m08/upload"), {
      method: "POST",
      body: formData,
      signal: AbortSignal.timeout(15000),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
  },

  // M-09: Visual Threat Intelligence
  async m09AnalyzeVisual(req: { scenario_preset?: string; image_base64?: string; filename?: string }): Promise<StandardEngineResponse> {
    return postJson<StandardEngineResponse>("/api/m09/visual", req)
  },

  async m09UploadScreenshot(file: File): Promise<StandardEngineResponse> {
    const formData = new FormData()
    formData.append("file", file)
    const res = await fetch(buildApiUrl("/api/m09/upload"), {
      method: "POST",
      body: formData,
      signal: AbortSignal.timeout(15000),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
  },

  // M-10: Threat Intelligence
  async m10LookupThreatIntel(req: { query?: string; scenario_preset?: string }): Promise<StandardEngineResponse> {
    return postJson<StandardEngineResponse>("/api/m10/threat-intel", req)
  },

  // M-11: Privacy Intelligence
  async m11AnalyzePrivacy(req: { scenario_preset?: string; report?: any }): Promise<StandardEngineResponse> {
    return postJson<StandardEngineResponse>("/api/m11/privacy", req)
  },

  // M-12: AI Security Lab
  async m12AnalyzeAISecurity(req: { prompt_text?: string; scenario_preset?: string }): Promise<StandardEngineResponse> {
    return postJson<StandardEngineResponse>("/api/m12/ai-security", req)
  },

  // M-13: Behavioural Analysis
  async m13AnalyzeBehavioural(req: { scenario_preset?: string; events?: any[] }): Promise<StandardEngineResponse> {
    return postJson<StandardEngineResponse>("/api/m13/behavioural", req)
  },

  // M-14: Unified Risk & Meta Decision
  async m14AnalyzeUnifiedRisk(req: { scenario_preset?: string; engine_results?: any[] }): Promise<StandardEngineResponse> {
    return postJson<StandardEngineResponse>("/api/m14/unified-risk", req)
  },

  // Presentation Scenarios
  async listScenarios(): Promise<Record<string, ScenarioMetadata>> {
    const res = await fetch(buildApiUrl("/api/scenarios"), {
      method: "GET",
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
  },

  async runScenario(scenarioId: string): Promise<ScenarioExecutionResult> {
    return postJson<ScenarioExecutionResult>("/api/scenarios/run", { scenario_id: scenarioId })
  },
}
