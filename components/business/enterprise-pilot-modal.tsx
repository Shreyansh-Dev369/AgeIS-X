"use client"

import React, { useState } from "react"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
} from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import {
  Building2,
  CheckCircle2,
  Download,
  ArrowRight,
  Shield,
  Layers,
  Server,
  Lock,
  Mail,
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"

export interface EnterprisePilotModalProps {
  isOpen: boolean
  onClose: () => void
  initialFleetSize?: number
}

export function EnterprisePilotModal({
  isOpen,
  onClose,
  initialFleetSize = 500,
}: EnterprisePilotModalProps) {
  const [fleetSize, setFleetSize] = useState(initialFleetSize)
  const [orgName, setOrgName] = useState("")
  const [workEmail, setWorkEmail] = useState("")
  const [leadRole, setLeadRole] = useState("CISO / Security Director")
  const [selectedSiem, setSelectedSiem] = useState<string>("Splunk")
  const [selectedFramework, setSelectedFramework] = useState<string>("NIST 800-207 (Zero Trust)")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [pilotToken, setPilotToken] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orgName.trim() || !workEmail.trim()) return

    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 1200))

    const token = `PILOT-${Math.random().toString(36).substring(2, 8).toUpperCase()}-2026`
    setPilotToken(token)

    try {
      localStorage.setItem("ageis_enterprise_pilot", JSON.stringify({
        orgName,
        workEmail,
        leadRole,
        fleetSize,
        siem: selectedSiem,
        framework: selectedFramework,
        token,
        submittedAt: new Date().toISOString(),
      }))
    } catch {}

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const handleDownloadDossier = () => {
    const payload = {
      title: "AgeIS-X Enterprise Architecture Dossier & Pilot Manifest",
      pilot_token: pilotToken,
      organization: orgName,
      contact: workEmail,
      lead_role: leadRole,
      fleet_allocation: `${fleetSize} Managed Workstations`,
      target_siem: selectedSiem,
      compliance_baseline: selectedFramework,
      architecture_notes: [
        "Zero raw URL/MIME payload egress to offshore cloud telemetry brokers",
        "Official macOS Network Extension and Windows Filtering Platform (WFP) hooks",
        "Encrypted local database sealed via TPM 2.0 / Apple Silicon Secure Enclave",
      ],
      timestamp: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `AgeIS-X-Enterprise-Pilot-Dossier-${pilotToken}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleResetAndClose = () => {
    setIsSubmitted(false)
    setIsSubmitting(false)
    onClose()
  }

  return (
    <Modal open={isOpen} onOpenChange={(open: boolean) => !open && handleResetAndClose()}>
      <ModalContent className="max-w-xl w-full bg-[#0B0E14] border border-white/20 text-[#F8FAFC] font-mono p-6 sm:p-8 rounded-none shadow-2xl">
        <ModalHeader className="space-y-2 border-b border-white/10 pb-4 text-left">
          <div className="flex items-center justify-between">
            <span className="text-[#00E575] text-xs font-bold uppercase tracking-wider">
              ENTERPRISE PILOT INITIATION
            </span>
            <span className="text-[10px] text-[#94A3B8] uppercase">
              CONFIDENTIAL // NDA READY
            </span>
          </div>

          <ModalTitle className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#F8FAFC] flex items-center gap-3">
            <Building2 className="w-6 h-6 text-[#00E575]" />
            <span>COMMISSION FLEET PILOT</span>
          </ModalTitle>

          <ModalDescription className="text-xs text-[#94A3B8] font-sans">
            Deploy an isolated fleet sandbox with zero-overhead on-device heuristics and centralized SecOps logging.
          </ModalDescription>
        </ModalHeader>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-5 pt-4 text-xs">
            {/* Fleet Sizer Slider */}
            <div className="p-4 bg-[#07090E] border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#64748B] uppercase">FLEET TARGET ALLOCATION:</span>
                <span className="text-sm font-bold text-[#00E575]">{fleetSize.toLocaleString()} WORKSTATIONS</span>
              </div>
              <input
                type="range"
                min={50}
                max={5000}
                step={50}
                value={fleetSize}
                onChange={(e) => setFleetSize(Number(e.target.value))}
                className="w-full accent-[#00E575] cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-[#64748B]">
                <span>50 NODES</span>
                <span>1,000 NODES</span>
                <span>5,000+ FLEET</span>
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] text-[#64748B] uppercase block">ORGANIZATION NAME:</label>
                <input
                  type="text"
                  required
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="Acme Financial Corp"
                  className="w-full bg-[#07090E] border border-white/15 p-2.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#00E575] rounded-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-[#64748B] uppercase block">ENTERPRISE WORK EMAIL:</label>
                <input
                  type="email"
                  required
                  value={workEmail}
                  onChange={(e) => setWorkEmail(e.target.value)}
                  placeholder="ciso@acmefinancial.com"
                  className="w-full bg-[#07090E] border border-white/15 p-2.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#00E575] rounded-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-[#64748B] uppercase block">SECURITY ROLE:</label>
                <select
                  value={leadRole}
                  onChange={(e) => setLeadRole(e.target.value)}
                  className="w-full bg-[#07090E] border border-white/15 p-2.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#00E575] rounded-none"
                >
                  <option value="CISO / Security Director">CISO / Security Director</option>
                  <option value="SecOps / SOC Lead">SecOps / SOC Lead</option>
                  <option value="Enterprise IT Architect">Enterprise IT Architect</option>
                  <option value="Security Engineer">Security Engineer</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-[#64748B] uppercase block">TARGET SIEM CONNECTOR:</label>
                <select
                  value={selectedSiem}
                  onChange={(e) => setSelectedSiem(e.target.value)}
                  className="w-full bg-[#07090E] border border-white/15 p-2.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#00E575] rounded-none"
                >
                  <option value="Splunk Enterprise / Cloud">Splunk Enterprise / Cloud</option>
                  <option value="Datadog Cloud SIEM">Datadog Cloud SIEM</option>
                  <option value="Microsoft Sentinel">Microsoft Sentinel</option>
                  <option value="Elastic Security">Elastic Security</option>
                  <option value="Sumo Logic / Custom Syslog">Sumo Logic / Custom Syslog</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <Button
                type="button"
                variant="outline"
                onClick={handleResetAndClose}
                className="border-white/20 bg-transparent hover:bg-white/5 text-[#94A3B8] text-xs h-10 px-4 rounded-none"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !orgName.trim() || !workEmail.trim()}
                className="bg-[#00E575] hover:bg-[#00CC66] text-[#07090E] font-bold text-xs uppercase px-6 h-10 rounded-none shadow-[0_1px_3px_rgba(0,0,0,0.4),0_0_12px_rgba(0,229,117,0.2)] cursor-pointer"
              >
                <span>{isSubmitting ? "PROVISIONING SANDBOX..." : "REQUEST PILOT DOSSIER"}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-5 pt-4 text-xs animate-in fade-in-0 duration-200">
            <div className="p-4 bg-[#00E575]/10 border border-[#00E575]/30 space-y-2">
              <div className="flex items-center gap-2 text-[#00E575]">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span className="font-bold text-sm uppercase">
                  ENTERPRISE PILOT PROVISIONED
                </span>
              </div>
              <p className="text-xs text-[#CBD5E1] font-sans">
                Your pilot token for <strong>{orgName}</strong> ({fleetSize} endpoints) has been generated. Our engineering team will synchronize your SIEM bridge ({selectedSiem}).
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-[#64748B] uppercase block">
                ASSIGNED PILOT TRACKING TOKEN:
              </label>
              <div className="p-2.5 bg-[#07090E] border border-white/15 text-[11px] text-[#00E575] font-mono select-all flex items-center justify-between">
                <span>{pilotToken}</span>
                <span className="text-[9px] text-[#64748B] uppercase">APPROVED</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <Button
                type="button"
                onClick={handleDownloadDossier}
                variant="outline"
                className="flex-1 border-white/20 bg-transparent hover:bg-white/5 text-[#F8FAFC] text-xs h-10 rounded-none cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 mr-1.5 text-[#00E575]" />
                <span>DOWNLOAD ARCHITECTURE DOSSIER</span>
              </Button>

              <Button
                type="button"
                onClick={handleResetAndClose}
                className="flex-1 bg-[#00E575] hover:bg-[#00CC66] text-[#07090E] font-bold text-xs uppercase h-10 rounded-none shadow-[0_1px_3px_rgba(0,0,0,0.4),0_0_12px_rgba(0,229,117,0.2)] cursor-pointer"
              >
                <span>DONE</span>
              </Button>
            </div>
          </div>
        )}
      </ModalContent>
    </Modal>
  )
}
