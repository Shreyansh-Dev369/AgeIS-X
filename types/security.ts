export type SecurityState =
  | "PROTECTED"
  | "PROTECTION ACTIVE"
  | "MONITORING"
  | "SCAN IN PROGRESS"
  | "ACTION REQUIRED"
  | "WARNING"
  | "HIGH RISK"
  | "CRITICAL"
  | "BLOCKED"
  | "QUARANTINED"
  | "ISOLATED"
  | "RESOLVED"
  | "OFFLINE"
  | "UNKNOWN"
  | "CONFIGURED"
  | "READY"
  | "SETUP REQUIRED"

export type CapabilityStatus =
  | "AVAILABLE"
  | "SIMULATED"
  | "DEMO"
  | "PREVIEW"
  | "IN DEVELOPMENT"
  | "PLANNED"

export type ThreatSeverity = "info" | "low" | "medium" | "high" | "critical"

export type ThreatCategory =
  | "protection"
  | "threat"
  | "phishing"
  | "malware"
  | "ransomware"
  | "scam"
  | "payment"
  | "identity"
  | "device"
  | "network"
  | "privacy"
  | "data"
  | "email"
  | "ai"

export type IncidentStatus =
  | "DETECTED"
  | "INVESTIGATING"
  | "CONTAINED"
  | "ACTION REQUIRED"
  | "RESOLVED"
  | "BLOCKED"

export interface SecurityScoreFactor {
  id: string
  name: string
  status: "Strong" | "Good" | "Needs Attention" | "Critical" | "Needs Setup"
  score: number
  weight: number
  reason: string
  action: string
  actionHref: string
}

export interface SecurityScoreData {
  score: number
  maxScore: number
  status: SecurityState
  statusLabel?: string
  trend: {
    direction: "up" | "down" | "neutral"
    delta: number
    period: string
  }
  breakdown: {
    category: string
    score: number
    status: SecurityState
    issuesCount: number
  }[]
  factors?: SecurityScoreFactor[]
  recommendation?: string
  lastEvaluated: string
}

export interface SecurityMetricItem {
  id: string
  label: string
  value: string | number
  change?: string
  trend?: "up" | "down" | "neutral"
  status?: SecurityState
  description?: string
  timeframe?: string
}

export interface CriticalAttentionItem {
  id: string
  title: string
  description: string
  severity: ThreatSeverity
  category: ThreatCategory
  source: string
  timestamp: string
  actionLabel: string
  actionHref: string
  status?: "NEW" | "INVESTIGATING" | "ACTION REQUIRED" | "RESOLVED"
  affectedAsset?: string
  dismissible?: boolean
}

export interface ProtectionDomainItem {
  id: string
  name: string
  description: string
  category: ThreatCategory
  status: "ACTIVE" | "MONITORING" | "PREVIEW" | "IN DEVELOPMENT" | "PLANNED" | "CONFIGURED" | "READY" | "SETUP REQUIRED"
  capability?: CapabilityStatus
  coverageLevel: "Full" | "Partial" | "Baseline" | "Unlinked"
  eventsCount24h: number
  blockedCount24h?: number
  riskLevel?: "Low" | "Medium" | "High" | "Critical"
  href: string
  details?: {
    engine: string
    latency: string
    signaturesLoaded: string
    activeRules: string[]
  }
}

export interface DetailedEventExplanation {
  whatHappened: string
  when: string
  where: string
  why: string
  whatAgeISXDid: string
  whatMayBeAffected: string
  whatShouldIDo: string
  currentStatus: string
  iocSignature?: string
  signals?: {
    id: string
    name: string
    confidence: number
    description: string
  }[]
}

export interface ActivityFeedItem {
  id: string
  timestamp: string
  title: string
  description: string
  category: ThreatCategory
  severity: ThreatSeverity
  status: SecurityState
  entity?: string
  actionTaken?: string
  explanation?: DetailedEventExplanation
}

export interface ThreatItem {
  id: string
  threatType: string
  category: ThreatCategory
  severity: ThreatSeverity
  detectedTime: string
  source: string
  affectedAsset: string
  status: "BLOCKED" | "QUARANTINED" | "INVESTIGATING" | "RESOLVED" | "MONITORED" | "ISOLATED"
  actionTaken: string
  confidence: number
  iocHash?: string
  explanation: DetailedEventExplanation
}

export interface SecurityIncident {
  id: string
  title: string
  target: string
  category: ThreatCategory
  severity: ThreatSeverity
  status: IncidentStatus
  detectedAt: string
  assignedTo?: string
  remediation?: string
  affectedDevices?: string[]
  affectedAccounts?: string[]
  threatIds?: string[]
  timeline?: {
    timestamp: string
    event: string
    actor: string
  }[]
  explanation?: DetailedEventExplanation
}

export interface ProtectedDevice {
  id: string
  name: string
  type: "desktop" | "mobile" | "server" | "browser_extension"
  os: string
  ip: string
  status: SecurityState
  securityScore?: number
  lastSeen: string
  agentVersion: string
  threatCount?: number
  applicationRisk?: "Low" | "Medium" | "High"
  networkStatus?: "Encrypted DNS Active" | "Direct Tunnel" | "Monitoring" | string
  capability?: CapabilityStatus
  hardwareSpecs?: {
    cpu: string
    memoryUsage: string
    quarantineVaultSize: string
  }
  threatHistory?: {
    id: string
    date: string
    threat: string
    outcome: string
  }[]
}

export interface IdentityAccount {
  id: string
  identifier: string
  service: string
  category: "work_email" | "personal_email" | "sso_provider" | "cloud_console" | "developer_key"
  mfaStatus: "Passkey Enforced" | "TOTP Active" | "SMS Fallback" | "Disabled"
  securityScore: number
  takeoverRisk: "Low" | "Medium" | "High" | "Critical"
  breachExposureCount: number
  suspiciousLoginsCount: number
  lastAudit: string
  status: "SECURE" | "NEEDS ATTENTION" | "EXPOSED" | "MONITORED"
  capability: CapabilityStatus
  recentLogins?: {
    timestamp: string
    ip: string
    location: string
    status: "ALLOWED" | "CHALLENGED" | "DENIED"
  }[]
}

export interface PrivacyEvent {
  id: string
  timestamp: string
  originDomain: string
  trackerType: "Cross-Site Canvas" | "Audio Fingerprinting" | "Supercookie Sync" | "CName Cloaking" | "Telemetry Beacon"
  riskLevel: "Low" | "Medium" | "High"
  actionTaken: "DEFANGED & NOISE INJECTED" | "BLOCKED" | "SANITIZED"
  affectedBrowser: string
  explanation: string
}

export interface DataAsset {
  id: string
  fileName: string
  fileType: string
  fileSize: string
  location: string
  riskScore: number
  status: "SAFE" | "QUARANTINED" | "SENSITIVE_DETECTED" | "MONITORED"
  detectionReason: string
  actionTaken: string
  timestamp: string
  hashes: {
    sha256: string
    md5: string
  }
}

export interface AIModelModule {
  id: string
  name: string
  pipelineStage: "INGESTION" | "ANALYSIS" | "ENSEMBLE" | "DECISION"
  description: string
  capability: CapabilityStatus
  modelLatency: string
  accuracyMetric: string
  activeSignals: string[]
  status: "ONLINE" | "STANDBY" | "TRAINING" | "EXPERIMENTAL"
}

export interface AIExplainabilityReport {
  id: string
  inputTarget: string
  module: string
  confidence: number
  riskScore: number
  classification: string
  decision: "ALLOW" | "WARN" | "BLOCK" | "QUARANTINE" | "ACTION REQUIRED"
  signals: {
    id: string
    signalName: string
    weight: number
    verdict: string
    description: string
  }[]
  summaryExplanation: string
}

export interface SecurityRecommendationItem {
  id: string
  title: string
  whyItMatters: string
  whatToDo: string
  impact: "High" | "Medium" | "Low"
  actionLabel: string
  actionHref: string
  category?: ThreatCategory
  assetAffected?: string
}

export interface SecurityReport {
  id: string
  period: string
  generatedAt: string
  overallScore: number
  threatsDetected: number
  threatsBlocked: number
  incidentsResolved: number
  fleetCompliance: string
  identityIntegrity: string
  privacyShieldingScore: number
  summary: string
  keyFindings: string[]
  capability: CapabilityStatus
}

export interface ThreatIntelligenceSummary {
  consensusNodesOnline: number
  signaturesSynchronized: string
  topEmergingVectors: { name: string; severity: ThreatSeverity; change: string }[]
  architectureStatus: "Decentralized IoC Consensus"
  feedMode: "Local Development Baseline"
}
