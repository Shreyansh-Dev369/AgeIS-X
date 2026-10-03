"use client"

import React, { useState, useEffect } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { DataTable, Column } from "@/components/ui/data-table"
import { PixelBadge } from "@/components/ui/pixel-badge"
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
  ArrowUpRight,
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
      header: "Device Name & OS",
      cell: (item) => (
        <button
          onClick={() => handleDeviceClick(item)}
          className="flex items-center gap-3 text-left group focus:outline-none py-0.5"
        >
          <div className="w-8 h-8 rounded-lg border border-[#00e575]/30 bg-[#00e575]/10 text-[#00e575] flex items-center justify-center shrink-0">
            {item.type === "mobile" ? (
              <Smartphone className="w-4 h-4" />
            ) : item.type === "server" ? (
              <Server className="w-4 h-4" />
            ) : (
              <Laptop className="w-4 h-4" />
            )}
          </div>
          <div>
            <span className="font-semibold text-slate-100 block text-xs group-hover:text-[#00e575] transition-colors">
              {item.name}
            </span>
            <span className="text-[11px] font-mono text-slate-400">{item.os}</span>
          </div>
        </button>
      ),
    },
    {
      header: "Network IP",
      accessorKey: "ip",
      className: "font-mono text-xs text-[#00e5ff]",
    },
    {
      header: "Security Score",
      cell: (item) => (
        <span className="font-semibold text-xs font-mono text-[#00e575]">
          {item.securityScore || 94}%
        </span>
      ),
    },
    {
      header: "Defense State",
      cell: (item) => (
        <PixelBadge variant={item.status === "PROTECTED" ? "phosphor" : "warning"} size="sm">
          {item.status === "PROTECTED" ? "Protected" : item.status}
        </PixelBadge>
      ),
    },
    {
      header: "Agent Version",
      accessorKey: "agentVersion",
      className: "font-mono text-[11px] text-slate-400",
    },
    {
      header: "Last Active",
      accessorKey: "lastSeen",
      className: "font-mono text-[11px] text-slate-400",
    },
    {
      header: "Action",
      cell: (item) => (
        <button
          onClick={() => handleDeviceClick(item)}
          className="text-xs font-medium text-[#00e575] hover:underline flex items-center gap-1"
        >
          <span>Telemetry</span>
          <ArrowUpRight className="w-3 h-3" />
        </button>
      ),
    },
  ]

  const onlineCount = devices.filter((d) => d.status === "PROTECTED").length

  return (
    <AppShell
      title="Fleet & Devices"
      breadcrumbs={[{ label: "Overview", href: "/dashboard" }, { label: "Devices" }]}
    >
      <div className="space-y-6">
        {/* Device Fleet Header */}
        <div className="p-5 rounded-lg border border-slate-800 bg-[#080d16] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <PixelBadge variant="phosphor" size="sm" dot>
                Fleet Integrity Verified
              </PixelBadge>
              <span className="text-xs font-mono text-slate-400">
                {onlineCount} of {devices.length} endpoints online
              </span>
            </div>
            <h1 className="text-lg font-bold text-slate-100">
              Protected Endpoints & Hardware Fleet
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Continuous zero-kernel-panic integrity verification across workstations, developer containers, and mobile devices.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              onClick={() => setEnrollModalOpen(true)}
              className="text-xs font-semibold h-9 px-3.5 gap-1.5 bg-[#00e575] text-[#04070d] hover:bg-[#00c966]"
            >
              <Plus className="w-4 h-4" />
              <span>Enroll New Device</span>
            </Button>
          </div>
        </div>

        {/* Devices Table */}
        <div className="p-4 rounded-lg border border-slate-800 bg-[#080d16]">
          <DataTable
            data={devices}
            columns={columns}
            keyExtractor={(item) => item.id}
          />
        </div>
      </div>

      {/* Device Detail Inspector Drawer */}
      {selectedDevice && (
        <Drawer open={drawerOpen} onOpenChange={(open) => !open && setDrawerOpen(false)}>
          <DrawerContent
            side="right"
            className="w-full sm:max-w-xl bg-[#04070d] border-l border-slate-800 p-0 text-slate-100 flex flex-col h-full"
          >
            <div className="p-5 border-b border-slate-800 bg-[#080d16] flex items-start justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <PixelBadge variant="phosphor" size="sm" dot>
                    Device: {selectedDevice.id}
                  </PixelBadge>
                  <PixelBadge variant="cyan" size="sm">
                    {selectedDevice.os}
                  </PixelBadge>
                </div>
                <h2 className="text-base font-bold text-slate-100">
                  {selectedDevice.name}
                </h2>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1 rounded border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors"
                aria-label="Close inspector"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
              {/* Score & Posture */}
              <div className="p-4 rounded-lg border border-slate-800 bg-[#080d16] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Endpoint Integrity Score</span>
                  <span className="text-base font-bold text-[#00e575] font-mono">{selectedDevice.securityScore || 94}%</span>
                </div>
                <PixelStatusBar value={selectedDevice.securityScore || 94} variant="phosphor" showPercentage={false} />
              </div>

              {/* Hardware Specs */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-lg border border-slate-800 bg-[#080d16] space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Agent Version</span>
                  <span className="text-[#00e5ff] font-semibold text-xs font-mono">{selectedDevice.agentVersion}</span>
                </div>
                <div className="p-3.5 rounded-lg border border-slate-800 bg-[#080d16] space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Local IP Route</span>
                  <span className="text-slate-200 font-semibold text-xs font-mono">{selectedDevice.ip}</span>
                </div>
              </div>

              {/* Threat History on this Node */}
              <div className="p-4 rounded-lg border border-slate-800 bg-[#080d16] space-y-3">
                <span className="text-[11px] text-[#00e575] font-semibold uppercase tracking-wider block">
                  Recent Threat Interceptions on this Device
                </span>
                <div className="space-y-2">
                  <div className="p-2.5 rounded bg-[#04070d] border border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-200">Suspicious Macro Script (invoice.xlsm)</span>
                    <PixelBadge variant="danger" size="sm">Quarantined</PixelBadge>
                  </div>
                  <div className="p-2.5 rounded bg-[#04070d] border border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-200">Spoofed SSO Phishing Handshake</span>
                    <PixelBadge variant="phosphor" size="sm">Blocked</PixelBadge>
                  </div>
                </div>
              </div>

              {/* Node Recommendations */}
              <div className="p-4 rounded-lg border border-[#00e575]/30 bg-[#00e575]/5 space-y-1 text-xs">
                <span className="font-semibold text-[#00e575] block">
                  Recommended Hardening
                </span>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  Automatic local quarantine vault rotation every 7 days is active.
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-[#080d16] flex items-center justify-between">
              <PixelBadge variant="phosphor" size="sm">
                Heartbeat: {selectedDevice.lastSeen}
              </PixelBadge>
              <Button
                size="sm"
                onClick={() => setDrawerOpen(false)}
                className="text-xs font-medium h-8 px-4"
              >
                Close Telemetry
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
      )}

      {/* Enroll Node Modal */}
      <Modal open={enrollModalOpen} onOpenChange={setEnrollModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Enroll New Device</ModalTitle>
            <ModalDescription>Run the zero-dependency user-space daemon installer on your target host.</ModalDescription>
          </ModalHeader>
          <div className="space-y-4 text-xs pt-2">
            <div className="p-3.5 bg-[#04070d] rounded-lg border border-slate-800 space-y-2">
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Quick Install Command</span>
              <div className="p-2.5 bg-black rounded border border-slate-800 text-[#00e575] text-xs font-mono select-all break-all">
                curl -sSL https://get.ageis-x.corp/install.sh | bash
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-400">Supports macOS, Linux, and Windows</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyCommand}
                  className="text-xs h-7 px-2.5 border-slate-700 bg-slate-900"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  <span>{copied ? "Copied" : "Copy"}</span>
                </Button>
              </div>
            </div>

            <div className="p-3 bg-[#00e575]/5 rounded-lg border border-[#00e575]/20 text-xs text-slate-300 space-y-1">
              <p className="text-[#00e575] font-semibold">User-Space Isolation</p>
              <p className="text-[11px] text-slate-400">Daemon binary operates entirely in unprivileged user-space with hardware enclave attestation.</p>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                size="sm"
                onClick={() => setEnrollModalOpen(false)}
                className="text-xs font-medium"
              >
                Done
              </Button>
            </div>
          </div>
        </ModalContent>
      </Modal>
    </AppShell>
  )
}
