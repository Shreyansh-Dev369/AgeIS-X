import { SecurityState, ThreatSeverity } from "@/types/security"

export const SECURITY_STATES: Record<
  SecurityState,
  {
    label: string
    color: string
    bgColor: string
    borderColor: string
    textClass: string
    bgClass: string
    borderClass: string
    badgeVariant: "protected" | "monitoring" | "warning" | "danger" | "critical" | "neutral" | "purple"
    accessibleDescription: string
  }
> = {
  PROTECTED: {
    label: "Protected",
    color: "#00ff66",
    bgColor: "rgba(0, 255, 102, 0.10)",
    borderColor: "rgba(0, 255, 102, 0.30)",
    textClass: "text-[#00ff66]",
    bgClass: "bg-[#00ff66]/10",
    borderClass: "border-[#00ff66]/30",
    badgeVariant: "protected",
    accessibleDescription: "System is fully secure. All defenses active.",
  },
  "PROTECTION ACTIVE": {
    label: "Protection Active",
    color: "#00ff66",
    bgColor: "rgba(0, 255, 102, 0.10)",
    borderColor: "rgba(0, 255, 102, 0.30)",
    textClass: "text-[#00ff66]",
    bgClass: "bg-[#00ff66]/10",
    borderClass: "border-[#00ff66]/30",
    badgeVariant: "protected",
    accessibleDescription: "Real-time AI behavioral shielding is actively running.",
  },
  MONITORING: {
    label: "Monitoring",
    color: "#00f0ff",
    bgColor: "rgba(0, 240, 255, 0.10)",
    borderColor: "rgba(0, 240, 255, 0.30)",
    textClass: "text-[#00f0ff]",
    bgClass: "bg-[#00f0ff]/10",
    borderClass: "border-[#00f0ff]/30",
    badgeVariant: "monitoring",
    accessibleDescription: "Continuous telemetry surveillance in progress.",
  },
  "SCAN IN PROGRESS": {
    label: "Scan in Progress",
    color: "#00f0ff",
    bgColor: "rgba(0, 240, 255, 0.10)",
    borderColor: "rgba(0, 240, 255, 0.30)",
    textClass: "text-[#00f0ff]",
    bgClass: "bg-[#00f0ff]/10",
    borderClass: "border-[#00f0ff]/30",
    badgeVariant: "monitoring",
    accessibleDescription: "Evaluating endpoints and network traffic.",
  },
  "ACTION REQUIRED": {
    label: "Action Required",
    color: "#ffb800",
    bgColor: "rgba(255, 184, 0, 0.10)",
    borderColor: "rgba(255, 184, 0, 0.30)",
    textClass: "text-[#ffb800]",
    bgClass: "bg-[#ffb800]/10",
    borderClass: "border-[#ffb800]/30",
    badgeVariant: "warning",
    accessibleDescription: "Configuration or manual remediation required.",
  },
  WARNING: {
    label: "Warning",
    color: "#ffb800",
    bgColor: "rgba(255, 184, 0, 0.10)",
    borderColor: "rgba(255, 184, 0, 0.30)",
    textClass: "text-[#ffb800]",
    bgClass: "bg-[#ffb800]/10",
    borderClass: "border-[#ffb800]/30",
    badgeVariant: "warning",
    accessibleDescription: "Potential anomaly detected. Review suggested.",
  },
  "HIGH RISK": {
    label: "High Risk",
    color: "#ff6b00",
    bgColor: "rgba(255, 107, 0, 0.12)",
    borderColor: "rgba(255, 107, 0, 0.30)",
    textClass: "text-[#ff6b00]",
    bgClass: "bg-[#ff6b00]/10",
    borderClass: "border-[#ff6b00]/30",
    badgeVariant: "danger",
    accessibleDescription: "Elevated threat detected. Immediate attention recommended.",
  },
  CRITICAL: {
    label: "Critical",
    color: "#ff3b30",
    bgColor: "rgba(255, 59, 48, 0.14)",
    borderColor: "rgba(255, 59, 48, 0.35)",
    textClass: "text-[#ff3b30]",
    bgClass: "bg-[#ff3b30]/10",
    borderClass: "border-[#ff3b30]/30",
    badgeVariant: "critical",
    accessibleDescription: "Critical security incident detected. Immediate isolation required.",
  },
  BLOCKED: {
    label: "Blocked",
    color: "#ff3b30",
    bgColor: "rgba(255, 59, 48, 0.14)",
    borderColor: "rgba(255, 59, 48, 0.35)",
    textClass: "text-[#ff3b30]",
    bgClass: "bg-[#ff3b30]/10",
    borderClass: "border-[#ff3b30]/30",
    badgeVariant: "critical",
    accessibleDescription: "Malicious transaction or vector blocked by AgeIS-X engine.",
  },
  QUARANTINED: {
    label: "Quarantined",
    color: "#b356ff",
    bgColor: "rgba(179, 86, 255, 0.12)",
    borderColor: "rgba(179, 86, 255, 0.30)",
    textClass: "text-[#b356ff]",
    bgClass: "bg-[#b356ff]/10",
    borderClass: "border-[#b356ff]/30",
    badgeVariant: "purple",
    accessibleDescription: "Suspicious file or process placed in secure containment.",
  },
  ISOLATED: {
    label: "Isolated",
    color: "#8b5cf6",
    bgColor: "rgba(139, 92, 246, 0.12)",
    borderColor: "rgba(139, 92, 246, 0.30)",
    textClass: "text-violet-400",
    bgClass: "bg-violet-500/10",
    borderClass: "border-violet-500/30",
    badgeVariant: "purple",
    accessibleDescription: "Host network interface disconnected to prevent lateral movement.",
  },
  RESOLVED: {
    label: "Resolved",
    color: "#00ff66",
    bgColor: "rgba(0, 255, 102, 0.10)",
    borderColor: "rgba(0, 255, 102, 0.30)",
    textClass: "text-[#00ff66]",
    bgClass: "bg-[#00ff66]/10",
    borderClass: "border-[#00ff66]/30",
    badgeVariant: "protected",
    accessibleDescription: "Threat has been remediated and verified clear.",
  },
  OFFLINE: {
    label: "Offline",
    color: "#7e8b9b",
    bgColor: "rgba(126, 139, 155, 0.10)",
    borderColor: "rgba(126, 139, 155, 0.25)",
    textClass: "text-[#7e8b9b]",
    bgClass: "bg-[#7e8b9b]/10",
    borderClass: "border-[#7e8b9b]/30",
    badgeVariant: "neutral",
    accessibleDescription: "Sensor or agent is currently disconnected.",
  },
  UNKNOWN: {
    label: "Unknown",
    color: "#7e8b9b",
    bgColor: "rgba(126, 139, 155, 0.10)",
    borderColor: "rgba(126, 139, 155, 0.25)",
    textClass: "text-[#7e8b9b]",
    bgClass: "bg-[#7e8b9b]/10",
    borderClass: "border-[#7e8b9b]/30",
    badgeVariant: "neutral",
    accessibleDescription: "Status pending telemetry acquisition.",
  },
  CONFIGURED: {
    label: "Configured",
    color: "#00ff66",
    bgColor: "rgba(0, 255, 102, 0.10)",
    borderColor: "rgba(0, 255, 102, 0.30)",
    textClass: "text-[#00ff66]",
    bgClass: "bg-[#00ff66]/10",
    borderClass: "border-[#00ff66]/30",
    badgeVariant: "protected",
    accessibleDescription: "Protection domain is configured and active.",
  },
  READY: {
    label: "Ready",
    color: "#00f0ff",
    bgColor: "rgba(0, 240, 255, 0.10)",
    borderColor: "rgba(0, 240, 255, 0.30)",
    textClass: "text-[#00f0ff]",
    bgClass: "bg-[#00f0ff]/10",
    borderClass: "border-[#00f0ff]/30",
    badgeVariant: "monitoring",
    accessibleDescription: "Domain is ready and operating on baseline.",
  },
  "SETUP REQUIRED": {
    label: "Setup Required",
    color: "#ffb800",
    bgColor: "rgba(255, 184, 0, 0.10)",
    borderColor: "rgba(255, 184, 0, 0.30)",
    textClass: "text-[#ffb800]",
    bgClass: "bg-[#ffb800]/10",
    borderClass: "border-[#ffb800]/30",
    badgeVariant: "warning",
    accessibleDescription: "Domain requires initial setup or linking.",
  },
}

export const SEVERITY_CONFIG: Record<
  ThreatSeverity,
  {
    label: string
    color: string
    badgeVariant: "neutral" | "monitoring" | "warning" | "danger" | "critical"
    borderClass: string
    textClass: string
  }
> = {
  info: {
    label: "Info",
    color: "#00f0ff",
    badgeVariant: "monitoring",
    borderClass: "border-[#00f0ff]/30",
    textClass: "text-[#00f0ff]",
  },
  low: {
    label: "Low",
    color: "#00ff66",
    badgeVariant: "neutral",
    borderClass: "border-[#00ff66]/30",
    textClass: "text-[#00ff66]",
  },
  medium: {
    label: "Medium",
    color: "#ffb800",
    badgeVariant: "warning",
    borderClass: "border-[#ffb800]/30",
    textClass: "text-[#ffb800]",
  },
  high: {
    label: "High",
    color: "#ff6b00",
    badgeVariant: "danger",
    borderClass: "border-[#ff6b00]/30",
    textClass: "text-[#ff6b00]",
  },
  critical: {
    label: "Critical",
    color: "#ff3b30",
    badgeVariant: "critical",
    borderClass: "border-[#ff3b30]/30",
    textClass: "text-[#ff3b30]",
  },
}

export const SURFACE_LEVELS = {
  0: "bg-[#040608]", // Canvas (#040608)
  1: "bg-[#080c10] border border-white/5", // Section (#080c10)
  2: "bg-[#0b1017] border border-white/10", // Panel (#0b1017)
  3: "bg-[#101722] border border-[#00ff66]/20 shadow-lg", // Elevated
  4: "bg-[#162030] border border-[#00ff66]/40 shadow-2xl", // Modal
} as const
