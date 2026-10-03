import React from "react"
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  XCircle,
  Activity,
  Radio,
  Lock,
  Unlock,
  Key,
  Fingerprint,
  Smartphone,
  Laptop,
  Server,
  Network,
  Globe,
  Database,
  Mail,
  Cpu,
  Settings,
  Bell,
  Search,
  Eye,
  EyeOff,
  Terminal,
  Zap,
  RefreshCw,
  Loader2,
  FileCheck,
  FileWarning,
  FileX,
  CreditCard,
  Ban,
  Clock,
  Layers,
  ArrowRight,
  ChevronRight,
  LucideIcon,
} from "lucide-react"
import { ThreatCategory, ThreatSeverity, SecurityState } from "@/types/security"

// Standardized Icon System (consistent stroke weight: 1.75, standard sizes)
export const SecurityIcons = {
  protection: ShieldCheck,
  threat: AlertTriangle,
  phishing: Mail,
  malware: ShieldAlert,
  ransomware: Lock,
  scam: AlertOctagon,
  payment: CreditCard,
  identity: Fingerprint,
  device: Laptop,
  mobile: Smartphone,
  server: Server,
  network: Network,
  privacy: EyeOff,
  data: Database,
  email: Mail,
  ai: Cpu,
  settings: Settings,
  notifications: Bell,
  search: Search,
  success: CheckCircle2,
  warning: AlertTriangle,
  critical: AlertOctagon,
  blocked: Ban,
  scanning: RefreshCw,
  loading: Loader2,
  terminal: Terminal,
  layers: Layers,
  arrowRight: ArrowRight,
  chevronRight: ChevronRight,
}

export function CategoryIcon({
  category,
  className = "w-4 h-4",
}: {
  category: ThreatCategory
  className?: string
}) {
  const IconComponent: LucideIcon = SecurityIcons[category] || Shield
  return <IconComponent className={className} strokeWidth={1.75} />
}

export function SecurityStateIcon({
  state,
  className = "w-4 h-4",
}: {
  state: SecurityState
  className?: string
}) {
  switch (state) {
    case "PROTECTED":
    case "PROTECTION ACTIVE":
    case "RESOLVED":
      return <ShieldCheck className={className} strokeWidth={1.75} />
    case "MONITORING":
      return <Activity className={className} strokeWidth={1.75} />
    case "SCAN IN PROGRESS":
      return <RefreshCw className={`${className} animate-spin`} strokeWidth={1.75} />
    case "ACTION REQUIRED":
    case "WARNING":
      return <AlertTriangle className={className} strokeWidth={1.75} />
    case "HIGH RISK":
    case "CRITICAL":
      return <AlertOctagon className={className} strokeWidth={1.75} />
    case "BLOCKED":
      return <Ban className={className} strokeWidth={1.75} />
    case "QUARANTINED":
    case "ISOLATED":
      return <Lock className={className} strokeWidth={1.75} />
    case "OFFLINE":
    case "UNKNOWN":
    default:
      return <Shield className={className} strokeWidth={1.75} />
  }
}

export function SeverityIcon({
  severity,
  className = "w-4 h-4",
}: {
  severity: ThreatSeverity
  className?: string
}) {
  switch (severity) {
    case "info":
      return <Activity className={className} strokeWidth={1.75} />
    case "low":
      return <CheckCircle2 className={className} strokeWidth={1.75} />
    case "medium":
      return <AlertTriangle className={className} strokeWidth={1.75} />
    case "high":
    case "critical":
      return <AlertOctagon className={className} strokeWidth={1.75} />
  }
}
