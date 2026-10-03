"use client"

import React, { useState, useEffect } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { DataTable, Column } from "@/components/ui/data-table"
import { PixelBadge } from "@/components/ui/pixel-badge"
import { TacticalFrame } from "@/components/ui/tactical-frame"
import { PixelStatusBar } from "@/components/ui/pixel-status-bar"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent } from "@/components/ui/drawer"
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription } from "@/components/ui/modal"
import { securityService } from "@/lib/services/security-service"
import { ProtectedDevice } from "@/types/security"
import {
  Laptop,
  Smartphone,
  Server,
  Plus,
  ArrowRight,
  X,
  ShieldCheck,
  Cpu,
  Activity,
  CheckCircle2,
  Copy,
} from "lucide-react"

export default function DevicesPage() {
  const [devices, setDevices] = useState<ProtectedDevice[]>([])
  const [selectedDevice, setSelectedDevice] = useState<ProtectedDevice | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [enrollModalOpen, setEnrollModalOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    securityService.getDevices().then((list) => setDevices(list))
  }, [])

  const handleDeviceClick = (device: ProtectedDevice) => {
    setSelectedDevice(device)
    setDrawerOpen(true)
  }

  const handleCopyCommand = () => {
    navigator.clipboard.writeText("curl -sSL https://get.ageis-x.corp/install.sh | bash")
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  const columns: Column<ProtectedDevice>[] = [
    {
      header: "ENDPOINT // NODE",
      cell: (item) => (
        <button
          onClick={() => handleDeviceClick(item)}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          <div className="w-7 h-7 border border-[#00ff66]/30 bg-[#00ff66]/10 text-[#00ff66] flex items-center justify-center shrink-0">
            {item.type === "mobile" ? (
              <Smartphone className="w-3.5 h-3.5" />
            ) : item.type === "server" ? (
              <Server className="w-3.5 h-3.5" />
            ) : (
              <Laptop className="w-3.5 h-3.5" />
            )}
          </div>
          <div>
            <span className="font-bold text-[#f8fafc] block text-xs group-hover:text-[#00ff66] transition-colors">
              {item.name}
            </span>
            <span className="text-[10px] font-mono text-[#7e8b9b]">{item.os}</span>
          </div>
        </button>
      ),
    },
    {
      header: "INTERNAL IP",
      accessorKey: "ip",
      className: "font-mono text-xs text-[#00f0ff]",
    },
    {
      header: "SECURITY SCORE",
      cell: (item) => (
        <span className="font-bold text-xs font-mono text-[#00ff66]">
          {item.securityScore || 94}%
        </span>
      ),
    },
    {
      header: "DEFENSE STATE",
      cell: (item) => (
        <PixelBadge variant={item.status === "PROTECTED" ? "phosphor" : "warning"} size="sm">
          {item.status}
        </PixelBadge>
      ),
    },
    {
      header: "AGENT VERSION",
      accessorKey: "agentVersion",
      className: "font-mono text-[10px] text-[#7e8b9b]",
    },
    {
      header: "HEARTBEAT",
      accessorKey: "lastSeen",
      className: "font-mono text-[10px] text-[#7e8b9b]",
    },
    {
      header: "ACTION",
      cell: (item) => (
        <button
          onClick={() => handleDeviceClick(item)}
          className="text-[10px] font-mono text-[#00ff66] hover:underline uppercase font-bold"
        >
          [ TELEMETRY ]
        </button>
      ),
    },
  ]

  const onlineCount = devices.filter((d) => d.status === "PROTECTED").length

  return (
    <AppShell
      title="Fleet & Device Security Center"
      breadcrumbs={[{ label: "Overview", href: "/dashboard" }, { label: "Devices & Nodes" }]}
    >
      <div className="space-y-6 font-mono select-none">
        {/* Device Fleet Header */}
        <TacticalFrame
          variant="panel"
          reticles={true}
          reticleColor="phosphor"
          className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-white/15 bg-[#080c10]"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <PixelBadge variant="phosphor" size="sm" dot>
                FLEET INTEGRITY ATTESTED
              </PixelBadge>
              <span className="text-[11px] text-[#00f0ff]">
                [{onlineCount} / {devices.length} ONLINE]
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider text-[#f8fafc] font-sans">
              Protected Endpoints & Hardware Fleet
            </h2>
            <p className="text-xs text-[#7e8b9b] max-w-2xl leading-relaxed">
              Continuous zero-kernel-panic integrity verification across workstations, developer containers, and mobile nodes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => setEnrollModalOpen(true)}
              className="text-xs font-mono uppercase tracking-wider font-bold h-9 px-3 gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>[ ENROLL NEW NODE ]</span>
            </Button>
          </div>
        </TacticalFrame>

        {/* Devices Table */}
        <TacticalFrame variant="panel" className="p-4 border-white/15 bg-[#080c10]">
          <DataTable
            data={devices}
            columns={columns}
            keyExtractor={(item) => item.id}
          />
        </TacticalFrame>
      </div>

      {/* Device Detail Inspector Drawer */}
      {selectedDevice && (
        <Drawer open={drawerOpen} onOpenChange={(open) => !open && setDrawerOpen(false)}>
          <DrawerContent
            side="right"
            className="w-full sm:max-w-xl bg-[#040608] border-l border-white/15 p-0 text-[#f8fafc] flex flex-col h-full font-mono select-none"
          >
            <div className="p-4 sm:p-5 border-b border-white/10 bg-[#080c10] flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <PixelBadge variant="phosphor" size="sm" dot>
                    NODE // {selectedDevice.id.toUpperCase()}
                  </PixelBadge>
                  <PixelBadge variant="cyan" size="sm">
                    {selectedDevice.os}
                  </PixelBadge>
                </div>
                <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-[#f8fafc] pt-1">
                  {selectedDevice.name}
                </h2>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1 border border-white/10 hover:border-white/30 text-[#7e8b9b] hover:text-white transition-colors"
                aria-label="Close inspector"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs">
              {/* Score & Posture */}
              <TacticalFrame variant="default" className="p-3.5 border-white/10 bg-[#080c10] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#7e8b9b] uppercase">ENDPOINT INTEGRITY SCORE</span>
                  <span className="text-base font-bold text-[#00ff66]">{selectedDevice.securityScore || 94}%</span>
                </div>
                <PixelStatusBar value={selectedDevice.securityScore || 94} variant="phosphor" showPercentage={false} />
              </TacticalFrame>

              {/* Hardware & Daemon Specs */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 border border-white/10 bg-[#080c10] space-y-1">
                  <span className="text-[10px] text-[#7e8b9b] uppercase block">AGENT VERSION</span>
                  <span className="text-[#00f0ff] font-bold text-xs">{selectedDevice.agentVersion}</span>
                </div>
                <div className="p-3 border border-white/10 bg-[#080c10] space-y-1">
                  <span className="text-[10px] text-[#7e8b9b] uppercase block">LOCAL IP ROUTE</span>
                  <span className="text-[#f8fafc] font-bold text-xs">{selectedDevice.ip}</span>
                </div>
              </div>

              {/* Threat History on this Node */}
              <div className="p-3.5 border border-white/10 bg-[#080c10] space-y-2">
                <span className="text-[10px] text-[#00ff66] font-bold uppercase block">
                  RECENT THREAT INTERCEPTIONS ON THIS NODE
                </span>
                <div className="space-y-1.5">
                  <div className="p-2 bg-[#040608] border border-white/5 flex items-center justify-between text-[11px]">
                    <span className="text-[#f8fafc]">Malicious Macro Dropper (invoice.xlsm)</span>
                    <PixelBadge variant="danger" size="sm">QUARANTINED</PixelBadge>
                  </div>
                  <div className="p-2 bg-[#040608] border border-white/5 flex items-center justify-between text-[11px]">
                    <span className="text-[#f8fafc]">Spoofed SSO Phishing Handshake</span>
                    <PixelBadge variant="phosphor" size="sm">BLOCKED</PixelBadge>
                  </div>
                </div>
              </div>

              {/* Node Recommendations */}
              <div className="p-3.5 border border-[#00ff66]/30 bg-[#00ff66]/5 space-y-1 text-[11px]">
                <span className="font-bold text-[#00ff66] uppercase block">
                  RECOMMENDED NODE HARDENING
                </span>
                <p className="text-[#f8fafc]/90 leading-relaxed">
                  Enable automatic local quarantine vault rotation every 7 days in Node Settings.
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-white/10 bg-[#080c10] flex items-center justify-between">
              <PixelBadge variant="phosphor" size="sm">
                HEARTBEAT: {selectedDevice.lastSeen}
              </PixelBadge>
              <Button
                size="sm"
                onClick={() => setDrawerOpen(false)}
                className="text-xs font-mono uppercase tracking-wider font-bold h-8 px-4"
              >
                [ CLOSE TELEMETRY ]
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
      )}

      {/* Enroll Node Modal */}
      <Modal open={enrollModalOpen} onOpenChange={setEnrollModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>ENROLL NEW ENDPOINT NODE</ModalTitle>
            <ModalDescription>Run the zero-dependency user-space daemon installer on your target host.</ModalDescription>
          </ModalHeader>
          <div className="space-y-4 font-mono text-xs">
            <div className="p-3 bg-[#040608] border border-white/10 space-y-1.5">
              <span className="text-[10px] text-[#7e8b9b] uppercase block">QUICK INSTALL COMMAND</span>
              <div className="p-2 bg-black border border-white/10 text-[#00ff66] text-xs font-mono select-all break-all">
                curl -sSL https://get.ageis-x.corp/install.sh | bash
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-[#7e8b9b]">Supports macOS, Linux, and Windows WFP</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyCommand}
                  className="text-xs h-7 px-2.5 border-white/20"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  <span>{copied ? "[ COPIED ]" : "[ COPY ]"}</span>
                </Button>
              </div>
            </div>

            <div className="p-2.5 bg-[#00ff66]/5 border border-[#00ff66]/30 text-[11px] text-[#7e8b9b] space-y-1">
              <p className="text-[#00ff66] font-bold uppercase">CAPABILITY: [AVAILABLE IN PREVIEW]</p>
              <p>Daemon binary operates entirely in unprivileged user-space with hardware enclave keys.</p>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                size="sm"
                onClick={() => setEnrollModalOpen(false)}
                className="text-xs font-mono uppercase tracking-wider font-bold"
              >
                [ DONE ]
              </Button>
            </div>
          </div>
        </ModalContent>
      </Modal>
    </AppShell>
  )
}
