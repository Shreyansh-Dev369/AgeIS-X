export type PlanId = "scout" | "guard" | "sentinel" | "aegis"

export type FeatureStatus = "AVAILABLE" | "BETA" | "PROTOTYPE" | "PLANNED" | "NOT_INCLUDED"

export interface PlanFeature {
  name: string
  status: FeatureStatus
  note?: string
}

export interface RobotPlan {
  id: PlanId
  index: "01" | "02" | "03" | "04"
  tierName: string
  robotName: string
  role: string
  actionVerb: string
  tagline: string
  motto: string
  priceAnnual: number
  priceFormatted: string
  period: string
  monthlyEquivalent: string | null
  devicesCount: number
  devicesLabel: string
  badgeLabel: string
  systemCode: string
  status: "AVAILABLE" | "BETA"
  images: {
    panel: string
    robot: string
    avatar: string
  }
  visualAttributes: {
    bgStyle: string
    accentClass: string
    verticalTitleLetters: string[]
    splitLetters: [string, string]
    contrastTier: "minimal" | "balanced" | "tactical" | "apex"
  }
  coreCapabilities: PlanFeature[]
  dossier: {
    chassis: string
    opticsSensor: string
    defenseEngine: string
    telemetryRate: string
    deploymentTarget: string
    operationalProtocol: string
  }
  decisionScenario: string
  cta: {
    label: string
    href: string
  }
}

export const AGEIS_ROBOT_PLANS: RobotPlan[] = [
  {
    id: "scout",
    index: "01",
    tierName: "FREE",
    robotName: "SCOUT",
    role: "RECONNAISSANCE UNIT",
    actionVerb: "Detect.",
    tagline: "SMALL FORM. BIG AWARENESS.",
    motto: "Lightweight. Focused. Always on.",
    priceAnnual: 0,
    priceFormatted: "₹0",
    period: "/ year",
    monthlyEquivalent: "Free forever",
    devicesCount: 1,
    devicesLabel: "1 DEVICE",
    badgeLabel: "SCOUT ONLINE",
    systemCode: "UNIT-01-RECON",
    status: "AVAILABLE",
    images: {
      panel: "/robots/scout-panel.webp",
      robot: "/robots/scout-robot.webp",
      avatar: "/robots/scout-avatar.webp",
    },
    visualAttributes: {
      bgStyle: "bg-[#050505]",
      accentClass: "text-[#39FF14]",
      verticalTitleLetters: ["S", "C", "O", "U", "T"],
      splitLetters: ["SCO", "UT"],
      contrastTier: "minimal",
    },
    coreCapabilities: [
      { name: "URL & phishing scanner", status: "AVAILABLE" },
      { name: "Basic domain intelligence", status: "AVAILABLE" },
      { name: "Threat analysis engine", status: "AVAILABLE" },
      { name: "Security telemetry dashboard", status: "AVAILABLE" },
      { name: "Manual vector scans", status: "AVAILABLE" },
    ],
    dossier: {
      chassis: "Ultra-compact mono-chassis with agile articulated tripod base",
      opticsSensor: "Single wide-spectrum primary optical sensor with high-FPS packet tracking",
      defenseEngine: "AgeIS-X Light Recon Heuristic Engine",
      telemetryRate: "< 25ms local token scoring",
      deploymentTarget: "Single primary workstation or personal browser",
      operationalProtocol: "Passive vector surveillance and manual diagnostic requests",
    },
    decisionScenario: "I just want basic security intelligence.",
    cta: {
      label: "START FREE",
      href: "/signup",
    },
  },
  {
    id: "guard",
    index: "02",
    tierName: "CORE",
    robotName: "GUARD",
    role: "PERSONAL DEFENSE UNIT",
    actionVerb: "Protect.",
    tagline: "PERSONAL PROTECTION. REAL INTELLIGENCE.",
    motto: "Your digital life. Better protected.",
    priceAnnual: 999,
    priceFormatted: "₹999",
    period: "/ year",
    monthlyEquivalent: "≈ ₹83 / month",
    devicesCount: 2,
    devicesLabel: "2 DEVICES",
    badgeLabel: "GUARD ONLINE",
    systemCode: "UNIT-02-DEFENSE",
    status: "AVAILABLE",
    images: {
      panel: "/robots/guard-panel.webp",
      robot: "/robots/guard-robot.webp",
      avatar: "/robots/guard-avatar.webp",
    },
    visualAttributes: {
      bgStyle: "bg-[#080808]",
      accentClass: "text-[#39FF14]",
      verticalTitleLetters: ["G", "U", "A", "R", "D"],
      splitLetters: ["GUA", "RD"],
      contrastTier: "balanced",
    },
    coreCapabilities: [
      { name: "Continuous web protection where supported", status: "AVAILABLE" },
      { name: "Phishing & scam detection", status: "AVAILABLE" },
      { name: "Email / message analysis", status: "AVAILABLE" },
      { name: "Supported file analysis", status: "AVAILABLE" },
      { name: "Privacy monitoring", status: "AVAILABLE" },
      { name: "Security event history", status: "AVAILABLE" },
    ],
    dossier: {
      chassis: "Reinforced composite tactical frame with armored torso and field-harness mount",
      opticsSensor: "Dual-layer polarized visor with direct threat vector classification",
      defenseEngine: "AgeIS-X Real-Time Active Shield Core",
      telemetryRate: "< 20ms active stream scoring",
      deploymentTarget: "Dual device setup (e.g. laptop + mobile endpoint)",
      operationalProtocol: "Continuous autonomous web and message perimeter protection",
    },
    decisionScenario: "I want everyday protection across my devices.",
    cta: {
      label: "GET CORE",
      href: "/signup?plan=core",
    },
  },
  {
    id: "sentinel",
    index: "03",
    tierName: "PRO",
    robotName: "SENTINEL",
    role: "ADVANCED THREAT INTELLIGENCE",
    actionVerb: "Analyze.",
    tagline: "ADVANCED THREAT INTELLIGENCE. COMPLETE PROTECTION.",
    motto: "More intelligence. More control.",
    priceAnnual: 1999,
    priceFormatted: "₹1,999",
    period: "/ year",
    monthlyEquivalent: "≈ ₹167 / month",
    devicesCount: 5,
    devicesLabel: "5 DEVICES",
    badgeLabel: "SENTINEL ONLINE",
    systemCode: "UNIT-03-INTEL",
    status: "AVAILABLE",
    images: {
      panel: "/robots/sentinel-panel.webp",
      robot: "/robots/sentinel-robot.webp",
      avatar: "/robots/sentinel-avatar.webp",
    },
    visualAttributes: {
      bgStyle: "bg-[#060606]",
      accentClass: "text-[#39FF14]",
      verticalTitleLetters: ["S", "E", "N", "T", "I", "N", "E", "L"],
      splitLetters: ["SENTI", "NEL"],
      contrastTier: "tactical",
    },
    coreCapabilities: [
      { name: "Advanced web protection", status: "AVAILABLE" },
      { name: "Phishing & scam detection", status: "AVAILABLE" },
      { name: "Email / message intelligence", status: "AVAILABLE" },
      { name: "Malicious file analysis where supported", status: "AVAILABLE" },
      { name: "Identity & privacy protection", status: "AVAILABLE" },
      { name: "Device security posture", status: "AVAILABLE" },
      { name: "Global threat intelligence feeds", status: "AVAILABLE" },
      { name: "Tactical security recommendations", status: "AVAILABLE" },
      { name: "Advanced security analytics", status: "AVAILABLE" },
    ],
    dossier: {
      chassis: "Heavy exoskeleton with modular sensor shoulder mounts and tactical chest battery",
      opticsSensor: "Multi-aperture neural array with darknet vector correlation",
      defenseEngine: "AgeIS-X Neural Forensic Intelligence Engine",
      telemetryRate: "< 15ms forensic tokenization",
      deploymentTarget: "Power user fleet up to 5 multi-OS endpoints",
      operationalProtocol: "Deep forensic packet dissection, identity watch, and proactive defense",
    },
    decisionScenario: "I want comprehensive protection for my digital life.",
    cta: {
      label: "GET PRO",
      href: "/signup?plan=pro",
    },
  },
  {
    id: "aegis",
    index: "04",
    tierName: "SENTINEL",
    robotName: "AEGIS",
    role: "ULTIMATE DIGITAL GUARDIAN",
    actionVerb: "Defend.",
    tagline: "THE ULTIMATE GUARDIAN FOR YOUR DIGITAL WORLD.",
    motto: "One security brain. For your entire world.",
    priceAnnual: 3499,
    priceFormatted: "₹3,499",
    period: "/ year",
    monthlyEquivalent: "≈ ₹292 / month",
    devicesCount: 10,
    devicesLabel: "10 DEVICES",
    badgeLabel: "AEGIS ONLINE",
    systemCode: "UNIT-04-APEX",
    status: "AVAILABLE",
    images: {
      panel: "/robots/aegis-panel.webp",
      robot: "/robots/aegis-robot.webp",
      avatar: "/robots/aegis-avatar.webp",
    },
    visualAttributes: {
      bgStyle: "bg-[#040404]",
      accentClass: "text-[#39FF14]",
      verticalTitleLetters: ["A", "E", "G", "I", "S"],
      splitLetters: ["AEG", "IS"],
      contrastTier: "apex",
    },
    coreCapabilities: [
      { name: "Full protection suite", status: "AVAILABLE" },
      { name: "Advanced threat intelligence", status: "AVAILABLE" },
      { name: "Identity monitoring where implemented", status: "AVAILABLE" },
      { name: "Advanced privacy controls where implemented", status: "AVAILABLE" },
      { name: "Family / multi-device protection where implemented", status: "AVAILABLE" },
      { name: "Priority support where actually available", status: "AVAILABLE" },
    ],
    dossier: {
      chassis: "Apex ceremonial ballistic shroud with high-strength carbon lattice core",
      opticsSensor: "Full-spectrum omni-directional tactical visor with green indicator halo",
      defenseEngine: "AgeIS-X Full Sovereign Protection Enclave",
      telemetryRate: "< 10ms multi-device orchestration",
      deploymentTarget: "Whole family, high-profile individual, or distributed studio (10 devices)",
      operationalProtocol: "Total perimeter lockdown, cross-device threat orchestration, priority routing",
    },
    decisionScenario: "I need broader protection across people and devices.",
    cta: {
      label: "GET SENTINEL",
      href: "/signup?plan=sentinel",
    },
  },
]

export interface ComparisonCategory {
  categoryName: string
  features: {
    name: string
    description: string
    scout: FeatureStatus | string
    guard: FeatureStatus | string
    sentinel: FeatureStatus | string
    aegis: FeatureStatus | string
  }[]
}

export const PROTECTION_COMPARISON_MATRIX: ComparisonCategory[] = [
  {
    categoryName: "01 / WEB & THREAT INTELLIGENCE",
    features: [
      {
        name: "URL & Phishing Vector Scanner",
        description: "Real-time inspection of suspect URLs, link redirection chains, and phishing heuristics",
        scout: "AVAILABLE",
        guard: "AVAILABLE",
        sentinel: "AVAILABLE",
        aegis: "AVAILABLE",
      },
      {
        name: "Basic Domain Intelligence",
        description: "WHOIS / RDAP lookup, domain age evaluation, registrant reputation score",
        scout: "AVAILABLE",
        guard: "AVAILABLE",
        sentinel: "AVAILABLE",
        aegis: "AVAILABLE",
      },
      {
        name: "Continuous Web Protection",
        description: "Live background interception and DNS-level blocking where supported",
        scout: "NOT_INCLUDED",
        guard: "AVAILABLE",
        sentinel: "AVAILABLE",
        aegis: "AVAILABLE",
      },
      {
        name: "Deep Neural Threat Analysis",
        description: "Zero-day attack surface modeling and obfuscated JavaScript dissection",
        scout: "PROTOTYPE",
        guard: "BETA",
        sentinel: "AVAILABLE",
        aegis: "AVAILABLE",
      },
      {
        name: "Global Threat Intelligence Feeds",
        description: "Continuous synchronization with global malicious hash and IP feeds",
        scout: "NOT_INCLUDED",
        guard: "NOT_INCLUDED",
        sentinel: "AVAILABLE",
        aegis: "AVAILABLE",
      },
    ],
  },
  {
    categoryName: "02 / EMAIL & MESSAGE FORENSICS",
    features: [
      {
        name: "Phishing & Scam Header Detection",
        description: "Authentication verification (SPF, DKIM, DMARC) and sender spoof analysis",
        scout: "NOT_INCLUDED",
        guard: "AVAILABLE",
        sentinel: "AVAILABLE",
        aegis: "AVAILABLE",
      },
      {
        name: "Email & Message Intelligence",
        description: "Linguistic urgency scoring and social engineering payload detection",
        scout: "NOT_INCLUDED",
        guard: "AVAILABLE",
        sentinel: "AVAILABLE",
        aegis: "AVAILABLE",
      },
      {
        name: "Malicious Attachment Dissection",
        description: "Safe sandbox parsing of supported attachments and archive vectors",
        scout: "NOT_INCLUDED",
        guard: "BETA",
        sentinel: "AVAILABLE",
        aegis: "AVAILABLE",
      },
    ],
  },
  {
    categoryName: "03 / DEVICE & ENDPOINT SECURITY",
    features: [
      {
        name: "Protected Devices Allocation",
        description: "Number of concurrently synchronized devices and operating systems",
        scout: "1 Device",
        guard: "2 Devices",
        sentinel: "5 Devices",
        aegis: "10 Devices",
      },
      {
        name: "Device Security Posture Dashboard",
        description: "Unified overview of endpoint health, risk score, and system baseline",
        scout: "AVAILABLE",
        guard: "AVAILABLE",
        sentinel: "AVAILABLE",
        aegis: "AVAILABLE",
      },
      {
        name: "Multi-Device Security Orchestration",
        description: "Centralized policy management and status sync across family/team devices",
        scout: "NOT_INCLUDED",
        guard: "NOT_INCLUDED",
        sentinel: "BETA",
        aegis: "AVAILABLE",
      },
    ],
  },
  {
    categoryName: "04 / IDENTITY, PRIVACY & BREACH WATCH",
    features: [
      {
        name: "Local Credential Breach Check",
        description: "Fast offline verification against known public security dumps",
        scout: "AVAILABLE",
        guard: "AVAILABLE",
        sentinel: "AVAILABLE",
        aegis: "AVAILABLE",
      },
      {
        name: "Continuous Privacy Monitoring",
        description: "Surveillance of exposed personal identifiers, emails, and phone metadata",
        scout: "NOT_INCLUDED",
        guard: "AVAILABLE",
        sentinel: "AVAILABLE",
        aegis: "AVAILABLE",
      },
      {
        name: "Identity & Data Exposure Controls",
        description: "Automated data-broker removal guidance and privacy posture scoring",
        scout: "NOT_INCLUDED",
        guard: "NOT_INCLUDED",
        sentinel: "AVAILABLE",
        aegis: "AVAILABLE",
      },
    ],
  },
  {
    categoryName: "05 / ANALYTICS, RECOMMENDATIONS & SUPPORT",
    features: [
      {
        name: "Tactical Security Recommendations",
        description: "Explainable remediation steps prioritized by CVSS exploitability",
        scout: "NOT_INCLUDED",
        guard: "NOT_INCLUDED",
        sentinel: "AVAILABLE",
        aegis: "AVAILABLE",
      },
      {
        name: "Advanced Security Analytics & Trends",
        description: "Telemetry timelines, historical vector trends, and posture progression",
        scout: "NOT_INCLUDED",
        guard: "AVAILABLE",
        sentinel: "AVAILABLE",
        aegis: "AVAILABLE",
      },
      {
        name: "Priority Support Channel",
        description: "Direct response from AgeIS-X security engineering team where available",
        scout: "Community",
        guard: "Standard",
        sentinel: "Standard",
        aegis: "Priority Channel",
      },
    ],
  },
]
