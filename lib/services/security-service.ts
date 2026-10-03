import {
  SecurityScoreData,
  SecurityMetricItem,
  CriticalAttentionItem,
  ProtectionDomainItem,
  ActivityFeedItem,
  ThreatItem,
  SecurityIncident,
  ProtectedDevice,
  IdentityAccount,
  PrivacyEvent,
  DataAsset,
  AIModelModule,
  AIExplainabilityReport,
  SecurityRecommendationItem,
  SecurityReport,
  ThreatIntelligenceSummary,
} from "@/types/security"

import {
  MOCK_SECURITY_SCORE,
  MOCK_CRITICAL_ATTENTION_ITEMS,
  MOCK_PROTECTION_DOMAINS,
  MOCK_ACTIVITY_FEED,
  MOCK_INCIDENTS,
  MOCK_DEVICES,
  MOCK_RECOMMENDATIONS,
  MOCK_THREAT_INTELLIGENCE,
  MOCK_TELEMETRY_CHART_DATA,
} from "@/lib/mock/security-data"

export const MOCK_THREAT_ITEMS: ThreatItem[] = [
  {
    id: "THR-9842",
    threatType: "Obfuscated PowerShell & Macro Dropper",
    category: "malware",
    severity: "critical",
    detectedTime: "14 mins ago",
    source: "Browser Download // invoice_2026_q3.xlsm",
    affectedAsset: "Alex Workstation (macOS Node)",
    status: "QUARANTINED",
    actionTaken: "Isolated in local sandbox vault; Execution bit revoked.",
    confidence: 0.98,
    iocHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    explanation: {
      whatHappened: "A weaponized Excel document containing multi-stage VBA macro dropped an obfuscated PowerShell payload.",
      when: "2026-10-02 11:15:32 UTC",
      where: "~/Downloads/invoice_2026_q3.xlsm",
      why: "Pattern matched known CVE-2026 memory execution heuristics with dynamic AMSI bypass hooks.",
      whatAgeISXDid: "Quarantined the file immediately upon disk flush, severed network socket, and revoked execution privileges.",
      whatMayBeAffected: "Local filesystem ~/Downloads; No lateral process privilege escalation occurred.",
      whatShouldIDo: "Confirm quarantine disposal in Data Security Center or submit for sandbox review.",
      currentStatus: "QUARANTINED",
      iocSignature: "HEUR:Trojan-Downloader.MSOffice.MacroDropper.gen",
      signals: [
        { id: "sig-1", name: "High Entropy Macro Code", confidence: 0.99, description: "Base64 encoded string blocks detected inside Excel Workbook streams." },
        { id: "sig-2", name: "AMSI Hook Tampering", confidence: 0.94, description: "Syscall sequence matches AmsiScanBuffer memory patching patterns." },
        { id: "sig-3", name: "Non-Standard Outbound Port", confidence: 0.91, description: "Payload attempted direct socket initiation to port 8443 on untrusted ASN." },
      ],
    },
  },
  {
    id: "THR-9841",
    threatType: "Spoofed SSO Authentication Credential Harvester",
    category: "phishing",
    severity: "critical",
    detectedTime: "42 mins ago",
    source: "Web Request // login-auth-corp.ageis-sso.xyz",
    affectedAsset: "SecOps Lead (Identity Alias)",
    status: "BLOCKED",
    actionTaken: "DNS sinkholed; In-flight HTTP POST request terminated.",
    confidence: 0.99,
    iocHash: "8f481a539b9776d655f2b604bc4de1a8fdcb9ffb0d7a0c102a0a256a4fae3c3b",
    explanation: {
      whatHappened: "Operator navigated to an artificial corporate SSO login clone designed to capture zero-knowledge session tokens.",
      when: "2026-10-02 10:48:10 UTC",
      where: "https://login-auth-corp.ageis-sso.xyz/oauth/authorize",
      why: "Domain registered < 4 hours ago on suspicious registrar with 14-dimensional lexical brand mimicry.",
      whatAgeISXDid: "Intercepted TLS handshake, injected zero-latency DNS sinkhole, and alerted identity monitor.",
      whatMayBeAffected: "Browser session state; No credentials transmitted.",
      whatShouldIDo: "Verify primary SSO bookmark in Settings.",
      currentStatus: "BLOCKED",
      iocSignature: "NET:Phish.SSO.BrandImpersonation.Clone",
      signals: [
        { id: "sig-1", name: "Newly Registered Domain (NRD)", confidence: 1.0, description: "Domain registration age is under 4 hours." },
        { id: "sig-2", name: "Visual DOM Similarity", confidence: 0.97, description: "Logo and form layout match Okta/AgeIS-X SSO portal with 97% vector match." },
        { id: "sig-3", name: "Untrusted SSL Certificate Authority", confidence: 0.89, description: "Free short-lived wildcard certificate." },
      ],
    },
  },
  {
    id: "THR-9840",
    threatType: "Rogue C2 Outbound Beacon Connection",
    category: "network",
    severity: "high",
    detectedTime: "1 hour ago",
    source: "Socket Trap // 185.220.101.5:443",
    affectedAsset: "Dev Cluster Node (Linux Ubuntu)",
    status: "BLOCKED",
    actionTaken: "Socket terminated; Remote IP banned in host firewall.",
    confidence: 0.95,
    iocHash: "3a52f5c1d3b841e2a09c2e4860b0f9c2d1b7a4e6f8a3c2e1b4a6d8c0e2f4a6b8",
    explanation: {
      whatHappened: "An unauthorized daemon child process initiated periodic heartbeat packets to a known Tor exit node IP.",
      when: "2026-10-02 10:12:04 UTC",
      where: "Node: linux-dev-node-02 -> 185.220.101.5:443",
      why: "IP matches decentralized threat intelligence consensus for active Cobalt Strike team server beaconing.",
      whatAgeISXDid: "Rogue socket closed within 1.2ms; Host firewall rule deployed across fleet.",
      whatMayBeAffected: "Node socket pool; Outbound data egress blocked.",
      whatShouldIDo: "Review running container processes on linux-dev-node-02.",
      currentStatus: "BLOCKED",
      iocSignature: "NET:C2.CobaltStrike.Beacon.TorExit",
      signals: [
        { id: "sig-1", name: "Jittered Periodicity", confidence: 0.96, description: "Heartbeat interval mathematically matches 60s sleep with 10% jitter." },
        { id: "sig-2", name: "Tor Exit Relay Match", confidence: 0.99, description: "Destination IPv4 matches Tor active directory." },
      ],
    },
  },
  {
    id: "THR-9839",
    threatType: "Infostealer Keychain Memory Scraper",
    category: "identity",
    severity: "critical",
    detectedTime: "3 hours ago",
    source: "Process // suspicious_helper.bin",
    affectedAsset: "Engineering MacBook Pro",
    status: "ISOLATED",
    actionTaken: "Process killed; Memory dump captured for forensic analysis.",
    confidence: 0.97,
    iocHash: "7b1c4e2a8f0d3a5b6c9e1f2a4b8d0c2e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b3c",
    explanation: {
      whatHappened: "A rogue binary attempted to attach ptrace / task_for_pid to browser processes to read cookies and tokens.",
      when: "2026-10-02 08:34:20 UTC",
      where: "PID 89412 (suspicious_helper.bin)",
      why: "Unauthorized memory inspection targeting Chrome User Data / Default / Cookies SQLite store.",
      whatAgeISXDid: "Invoked anti-tamper signal, killed PID 89412, and locked browser keychain.",
      whatMayBeAffected: "Volatile memory; Zero credential tokens extracted.",
      whatShouldIDo: "Execute full endpoint sweep on Engineering MacBook Pro.",
      currentStatus: "ISOLATED",
      iocSignature: "MEM:Infostealer.Redline.CookieDumper",
      signals: [
        { id: "sig-1", name: "Unauthorized Process Tracing", confidence: 0.98, description: "task_for_pid API call made without codesign entitlement." },
        { id: "sig-2", name: "Targeted SQLite Open", confidence: 0.95, description: "Direct file handle requested on locked browser credentials directory." },
      ],
    },
  },
  {
    id: "THR-9838",
    threatType: "Canvas Supercookie & Audio Fingerprinter",
    category: "privacy",
    severity: "low",
    detectedTime: "4 hours ago",
    source: "Tracker Script // analytics-cdn-track.org",
    affectedAsset: "Firefox Primary Browser",
    status: "RESOLVED",
    actionTaken: "Synthetic random noise injected into HTML5 canvas return buffer.",
    confidence: 0.99,
    iocHash: "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
    explanation: {
      whatHappened: "Third-party tracker script attempted to render off-screen 2D canvas shapes to calculate hardware GPU fingerprint.",
      when: "2026-10-02 07:18:49 UTC",
      where: "https://marketing-site.example/checkout",
      why: "Canvas toDataURL / getImageData call sequence with invisible dimensions.",
      whatAgeISXDid: "Perturbed pixel RGB values by +/- 1 bit, destroying device fingerprint uniqueness.",
      whatMayBeAffected: "Cross-site tracking profile rendered completely invalid.",
      whatShouldIDo: "No action required. Privacy shields active.",
      currentStatus: "RESOLVED",
      iocSignature: "PRIV:Fingerprint.Canvas.HardwareID",
    },
  },
]

export const MOCK_IDENTITY_ACCOUNTS: IdentityAccount[] = [
  {
    id: "acc-01",
    identifier: "secops-lead@ageis-x.corp",
    service: "AgeIS-X Master Administration",
    category: "work_email",
    mfaStatus: "Passkey Enforced",
    securityScore: 98,
    takeoverRisk: "Low",
    breachExposureCount: 0,
    suspiciousLoginsCount: 0,
    lastAudit: "Today at 08:30 UTC",
    status: "SECURE",
    capability: "AVAILABLE",
    recentLogins: [
      { timestamp: "10 mins ago", ip: "192.168.1.104", location: "US-East (Authorized)", status: "ALLOWED" },
      { timestamp: "Yesterday 18:22", ip: "192.168.1.104", location: "US-East (Authorized)", status: "ALLOWED" },
    ],
  },
  {
    id: "acc-02",
    identifier: "alex.mercer@gmail.com",
    service: "Google Workspace & Personal Identity",
    category: "personal_email",
    mfaStatus: "Passkey Enforced",
    securityScore: 94,
    takeoverRisk: "Low",
    breachExposureCount: 0,
    suspiciousLoginsCount: 0,
    lastAudit: "Yesterday",
    status: "SECURE",
    capability: "SIMULATED",
    recentLogins: [
      { timestamp: "3 hours ago", ip: "192.168.1.104", location: "US-East", status: "ALLOWED" },
    ],
  },
  {
    id: "acc-03",
    identifier: "infra-root@aws-cloud.corp",
    service: "Amazon Web Services Root Console",
    category: "cloud_console",
    mfaStatus: "TOTP Active",
    securityScore: 86,
    takeoverRisk: "Medium",
    breachExposureCount: 0,
    suspiciousLoginsCount: 1,
    lastAudit: "3 days ago",
    status: "NEEDS ATTENTION",
    capability: "SIMULATED",
    recentLogins: [
      { timestamp: "2 days ago", ip: "203.0.113.19", location: "Unknown Geo Spike", status: "CHALLENGED" },
    ],
  },
  {
    id: "acc-04",
    identifier: "gh_pat_98f420194812a",
    service: "GitHub Corporate Developer Token",
    category: "developer_key",
    mfaStatus: "Passkey Enforced",
    securityScore: 92,
    takeoverRisk: "Low",
    breachExposureCount: 0,
    suspiciousLoginsCount: 0,
    lastAudit: "4 days ago",
    status: "MONITORED",
    capability: "PREVIEW",
  },
]

export const MOCK_PRIVACY_EVENTS: PrivacyEvent[] = [
  {
    id: "prv-101",
    timestamp: "18 mins ago",
    originDomain: "ad-network-telemetry.biz",
    trackerType: "Cross-Site Canvas",
    riskLevel: "Medium",
    actionTaken: "DEFANGED & NOISE INJECTED",
    affectedBrowser: "Chrome 124 (macOS)",
    explanation: "Tracker queried WebGL render buffer strings to correlate identity across financial sites.",
  },
  {
    id: "prv-102",
    timestamp: "45 mins ago",
    originDomain: "audiotag-beacon.net",
    trackerType: "Audio Fingerprinting",
    riskLevel: "Medium",
    actionTaken: "DEFANGED & NOISE INJECTED",
    affectedBrowser: "Safari 17.4",
    explanation: "AudioContext oscillator frequency response probed to fingerprint sound hardware.",
  },
  {
    id: "prv-103",
    timestamp: "2 hours ago",
    originDomain: "metrics-collector.cloud",
    trackerType: "Supercookie Sync",
    riskLevel: "High",
    actionTaken: "BLOCKED",
    affectedBrowser: "Firefox Primary",
    explanation: "HSTS header abuse attempted to store 32-bit unique identifier in local cache.",
  },
]

export const MOCK_DATA_ASSETS: DataAsset[] = [
  {
    id: "dat-01",
    fileName: "invoice_2026_q3.xlsm",
    fileType: "Microsoft Excel Macro-Enabled",
    fileSize: "1.4 MB",
    location: "~/Downloads/invoice_2026_q3.xlsm",
    riskScore: 98,
    status: "QUARANTINED",
    detectionReason: "Obfuscated PowerShell dropper in Workbook_Open event.",
    actionTaken: "Quarantined to encrypted local vault.",
    timestamp: "14 mins ago",
    hashes: {
      sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      md5: "d41d8cd98f00b204e9800998ecf8427e",
    },
  },
  {
    id: "dat-02",
    fileName: "internal_api_keys.env.bak",
    fileType: "Environment Config File",
    fileSize: "4.2 KB",
    location: "~/Projects/backend/internal_api_keys.env.bak",
    riskScore: 78,
    status: "SENSITIVE_DETECTED",
    detectionReason: "Exposed Stripe and AWS secret keys in unencrypted file.",
    actionTaken: "Masked in memory; Recommended .gitignore update.",
    timestamp: "Yesterday",
    hashes: {
      sha256: "f4b81a2938102938102938102938102938102938102938102938102938102938",
      md5: "c4ca4238a0b923820dcc509a6f75849b",
    },
  },
  {
    id: "dat-03",
    fileName: "ageis_runtime_daemon",
    fileType: "Mach-O 64-bit Executable",
    fileSize: "18.2 MB",
    location: "/usr/local/bin/ageis_runtime_daemon",
    riskScore: 0,
    status: "SAFE",
    detectionReason: "Digitally signed AgeIS-X binary with valid hardware certificate.",
    actionTaken: "Verified integrity checksum.",
    timestamp: "3 days ago",
    hashes: {
      sha256: "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
      md5: "9b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e",
    },
  },
]

export const MOCK_AI_MODULES: AIModelModule[] = [
  {
    id: "mod-url",
    name: "Lexical URL Intelligence Engine",
    pipelineStage: "INGESTION",
    description: "14-dimensional character entropy and path anomaly model executing in < 9.4ms.",
    capability: "AVAILABLE",
    modelLatency: "8.2 ms",
    accuracyMetric: "99.8% F1",
    activeSignals: ["Entropy score", "Punycode check", "Subdomain depth", "Path length", "TLD reputation"],
    status: "ONLINE",
  },
  {
    id: "mod-dom",
    name: "Domain & DNS Posture Classifier",
    pipelineStage: "ANALYSIS",
    description: "Evaluates WHOIS registration age, nameserver topology, and BGP ASN routing anomalies.",
    capability: "AVAILABLE",
    modelLatency: "14.1 ms",
    accuracyMetric: "99.4% F1",
    activeSignals: ["Domain age < 24h", "Fast-flux DNS", "Dynamic DNS provider", "Registrar lock"],
    status: "ONLINE",
  },
  {
    id: "mod-html",
    name: "DOM & JavaScript Heuristic Parser",
    pipelineStage: "ANALYSIS",
    description: "Headless AST parser detecting obfuscated eval(), unescaped shellcode, and credential harvesting hooks.",
    capability: "PREVIEW",
    modelLatency: "32.0 ms",
    accuracyMetric: "98.9% F1",
    activeSignals: ["Obfuscated JS strings", "Fake password inputs", "Anti-debugging hooks"],
    status: "ONLINE",
  },
  {
    id: "mod-vision",
    name: "Vision-Based Brand Impersonation CNN",
    pipelineStage: "ANALYSIS",
    description: "Deep convolutional neural net comparing target favicon and page layout vectors against top 500 brands.",
    capability: "IN DEVELOPMENT",
    modelLatency: "85.0 ms",
    accuracyMetric: "97.6% Top-1",
    activeSignals: ["Logo vector similarity", "Color palette correlation", "DOM screenshot embedding"],
    status: "STANDBY",
  },
  {
    id: "mod-file",
    name: "Static Bytecode & PE/Mach-O Analyzer",
    pipelineStage: "ANALYSIS",
    description: "Local structural parser detecting shellcode droppers and corrupted header segments.",
    capability: "AVAILABLE",
    modelLatency: "22.4 ms",
    accuracyMetric: "99.2% F1",
    activeSignals: ["Section entropy", "Import table anomalies", "VBA macro presence"],
    status: "ONLINE",
  },
  {
    id: "mod-ensemble",
    name: "Multi-Signal Ensemble Decision Layer",
    pipelineStage: "ENSEMBLE",
    description: "Calibrated Bayesian classifier synthesizing 10 domain signals into deterministic verdicts.",
    capability: "AVAILABLE",
    modelLatency: "2.1 ms",
    accuracyMetric: "99.9% Calibration",
    activeSignals: ["Bayesian probability weighting", "False-positive suppression", "Operator threshold tuning"],
    status: "ONLINE",
  },
]

export const MOCK_SECURITY_REPORTS: SecurityReport[] = [
  {
    id: "REP-2026-Q3",
    period: "Past 30 Days (September 2026)",
    generatedAt: "2026-10-01 00:00:00 UTC",
    overallScore: 94,
    threatsDetected: 1429,
    threatsBlocked: 1428,
    incidentsResolved: 5,
    fleetCompliance: "100% Enrolled & Verified",
    identityIntegrity: "0 Breaches Found",
    privacyShieldingScore: 98,
    summary: "The AgeIS-X defense grid maintained optimal zero-trust posture across all 5 endpoints and 4 monitored identity providers with zero breaches or payload executions.",
    keyFindings: [
      "1,428 malicious URLs and phishing lures blocked prior to socket handshake.",
      "1 macro-dropper malware payload quarantined with zero lateral memory contamination.",
      "Zero credential dumps matched against darknet breach monitoring indices.",
      "100% of telemetry processed locally via user-space heuristics with zero kernel panic incidents.",
    ],
    capability: "AVAILABLE",
  },
]

// Centralized Frontend Security Data Service Layer
export const securityService = {
  getSecurityScore: async (): Promise<SecurityScoreData> => {
    return MOCK_SECURITY_SCORE
  },

  getCriticalAttentionItems: async (): Promise<CriticalAttentionItem[]> => {
    return MOCK_CRITICAL_ATTENTION_ITEMS
  },

  getProtectionDomains: async (): Promise<ProtectionDomainItem[]> => {
    return MOCK_PROTECTION_DOMAINS
  },

  getThreats: async (filter?: { category?: string; severity?: string; status?: string; query?: string }): Promise<ThreatItem[]> => {
    let list = [...MOCK_THREAT_ITEMS]
    if (filter?.query) {
      const q = filter.query.toLowerCase()
      list = list.filter((t) => t.threatType.toLowerCase().includes(q) || t.source.toLowerCase().includes(q) || t.id.toLowerCase().includes(q))
    }
    if (filter?.severity) {
      list = list.filter((t) => t.severity === filter.severity)
    }
    if (filter?.category) {
      list = list.filter((t) => t.category === filter.category)
    }
    if (filter?.status) {
      list = list.filter((t) => t.status === filter.status)
    }
    return list
  },

  getThreatById: async (id: string): Promise<ThreatItem | null> => {
    return MOCK_THREAT_ITEMS.find((t) => t.id === id) || null
  },

  getIncidents: async (): Promise<SecurityIncident[]> => {
    return MOCK_INCIDENTS
  },

  getIncidentById: async (id: string): Promise<SecurityIncident | null> => {
    return MOCK_INCIDENTS.find((i) => i.id === id) || null
  },

  getDevices: async (): Promise<ProtectedDevice[]> => {
    return MOCK_DEVICES
  },

  getDeviceById: async (id: string): Promise<ProtectedDevice | null> => {
    return MOCK_DEVICES.find((d) => d.id === id) || null
  },

  getIdentityAccounts: async (): Promise<IdentityAccount[]> => {
    return MOCK_IDENTITY_ACCOUNTS
  },

  getPrivacyEvents: async (): Promise<PrivacyEvent[]> => {
    return MOCK_PRIVACY_EVENTS
  },

  getDataAssets: async (): Promise<DataAsset[]> => {
    return MOCK_DATA_ASSETS
  },

  getAIModules: async (): Promise<AIModelModule[]> => {
    return MOCK_AI_MODULES
  },

  getSecurityRecommendations: async (): Promise<SecurityRecommendationItem[]> => {
    return MOCK_RECOMMENDATIONS
  },

  getReports: async (): Promise<SecurityReport[]> => {
    return MOCK_SECURITY_REPORTS
  },

  getThreatIntelligence: async (): Promise<ThreatIntelligenceSummary> => {
    return MOCK_THREAT_INTELLIGENCE
  },

  searchGlobal: async (query: string) => {
    const q = query.toLowerCase().trim()
    if (!q) return { threats: [], incidents: [], devices: [], accounts: [], data: [] }

    const threats = MOCK_THREAT_ITEMS.filter((t) => t.threatType.toLowerCase().includes(q) || t.source.toLowerCase().includes(q) || t.id.toLowerCase().includes(q))
    const incidents = MOCK_INCIDENTS.filter((i) => i.title.toLowerCase().includes(q) || i.target.toLowerCase().includes(q) || i.id.toLowerCase().includes(q))
    const devices = MOCK_DEVICES.filter((d) => d.name.toLowerCase().includes(q) || d.ip.includes(q) || d.os.toLowerCase().includes(q))
    const accounts = MOCK_IDENTITY_ACCOUNTS.filter((a) => a.identifier.toLowerCase().includes(q) || a.service.toLowerCase().includes(q))
    const data = MOCK_DATA_ASSETS.filter((f) => f.fileName.toLowerCase().includes(q) || f.location.toLowerCase().includes(q))

    return { threats, incidents, devices, accounts, data }
  },
}
