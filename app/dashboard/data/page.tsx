"use client"

import React, { useState, useEffect } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { DataTable, Column } from "@/components/ui/data-table"
import { PixelBadge } from "@/components/ui/pixel-badge"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent } from "@/components/ui/drawer"
import { securityService } from "@/lib/services/security-service"
import { DataAsset } from "@/types/security"
import { Database, Download, HardDrive, FileCode, ArrowUpRight, X, ShieldAlert, CheckCircle2 } from "lucide-react"

export default function DataTelemetryPage() {
  const [dataAssets, setDataAssets] = useState<DataAsset[]>([])
  const [selectedAsset, setSelectedAsset] = useState<DataAsset | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [exported, setExported] = useState(false)

  useEffect(() => {
    securityService.getDataAssets().then((list) => setDataAssets(list))
  }, [])

  const handleInspect = (asset: DataAsset) => {
    setSelectedAsset(asset)
    setDrawerOpen(true)
  }

  const handleExportRawLogs = () => {
    const rawLogs = [
      { timestamp: "2026-10-02T11:15:32Z", component: "KERNEL_EBPF", syscall: "execve", target: "invoice_2026_q3.xlsm", verdict: "QUARANTINE" },
      { timestamp: "2026-10-02T10:48:10Z", component: "NEURAL_URL", uri: "login-auth-corp.ageis-sso.xyz", verdict: "DNS_SINKHOLE" },
      { timestamp: "2026-10-02T10:12:04Z", component: "SOCKET_TRAP", dest: "185.220.101.5:443", verdict: "TERMINATE_C2" },
    ]
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(rawLogs, null, 2))
    const downloadAnchor = document.createElement("a")
    downloadAnchor.setAttribute("href", dataStr)
    downloadAnchor.setAttribute("download", `ageis_x_audit_logs_${Date.now()}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
    setExported(true)
    setTimeout(() => setExported(false), 3000)
  }

  const columns: Column<DataAsset>[] = [
    {
      header: "File Asset",
      cell: (item) => (
        <button
          onClick={() => handleInspect(item)}
          className="text-left group focus:outline-none block py-0.5"
        >
          <span className="font-semibold text-slate-100 block text-xs group-hover:text-[#00e575] transition-colors">
            {item.fileName}
          </span>
          <span className="text-[11px] font-mono text-slate-400">{item.fileType}</span>
        </button>
      ),
    },
    {
      header: "Location Path",
      accessorKey: "location",
      className: "text-xs font-mono text-slate-400 truncate max-w-xs",
    },
    {
      header: "Risk Score",
      cell: (item) => (
        <span className={`font-semibold text-xs font-mono ${item.riskScore > 70 ? "text-[#ff4b4b]" : item.riskScore > 0 ? "text-[#ffb800]" : "text-[#00e575]"}`}>
          {item.riskScore}%
        </span>
      ),
    },
    {
      header: "Status",
      cell: (item) => (
        <PixelBadge
          variant={item.status === "QUARANTINED" ? "danger" : item.status === "SENSITIVE_DETECTED" ? "warning" : "phosphor"}
          size="sm"
        >
          {item.status === "QUARANTINED" ? "Quarantined" : item.status === "SENSITIVE_DETECTED" ? "Sensitive" : "Clean"}
        </PixelBadge>
      ),
    },
    {
      header: "Size",
      accessorKey: "fileSize",
      className: "text-[11px] font-mono text-[#00e5ff]",
    },
    {
      header: "Action",
      cell: (item) => (
        <button
          onClick={() => handleInspect(item)}
          className="text-xs font-medium text-[#00e575] hover:underline flex items-center gap-1"
        >
          <span>Inspect</span>
          <ArrowUpRight className="w-3 h-3" />
        </button>
      ),
    },
  ]

  const quarantinedCount = dataAssets.filter((d) => d.status === "QUARANTINED").length

  return (
    <AppShell
      title="Data Security & Quarantine"
      breadcrumbs={[{ label: "Overview", href: "/dashboard" }, { label: "Data Telemetry" }]}
    >
      <div className="space-y-6">
        {/* Header Summary */}
        <div className="p-5 rounded-lg border border-slate-800 bg-[#080d16] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <PixelBadge variant="warning" size="sm" dot>
                Local Quarantine Vault Active
              </PixelBadge>
              <span className="text-xs font-mono text-slate-400">
                Encrypted Sandbox Vault
              </span>
            </div>
            <h1 className="text-lg font-bold text-slate-100">
              Data Security, DLP & Local Artifact Quarantine
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Monitors sensitive credential exposures in developer files and manages isolated malware artifacts with revoked execution bits.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="p-3 bg-[#04070d] rounded border border-slate-800 text-center min-w-[120px]">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">Quarantined</span>
              <span className="text-sm font-bold text-[#ff4b4b]">{quarantinedCount} in Vault</span>
            </div>
            <div className="p-3 bg-[#04070d] rounded border border-slate-800 text-center min-w-[120px]">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">Vector Revision</span>
              <span className="text-sm font-bold text-[#00e5ff]">rev-9842.1</span>
            </div>
          </div>
        </div>

        {/* 2 Surface Telemetry Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-[#080d16] border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase text-slate-400 tracking-wider">Local Vector Store</p>
              <p className="text-2xl font-bold text-slate-100 mt-1">14.8 MB</p>
              <p className="text-xs text-[#00e575] mt-0.5">Encrypted SQLite on-device cache</p>
            </div>
            <HardDrive className="w-8 h-8 text-[#00e5ff]/40" />
          </div>

          <div className="p-4 rounded-lg bg-[#080d16] border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase text-slate-400 tracking-wider">Synchronized IoCs</p>
              <p className="text-2xl font-bold text-[#00e575] mt-1">98,420 IoCs</p>
              <p className="text-xs text-slate-400 mt-0.5">Synchronized 4 mins ago via cluster</p>
            </div>
            <Database className="w-8 h-8 text-[#00e575]/40" />
          </div>
        </div>

        {/* Data Assets Table */}
        <div className="p-4 rounded-lg border border-slate-800 bg-[#080d16] space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-sm font-bold text-slate-100">
              Audited File Assets & Quarantine Backlog
            </h2>
            <span className="text-xs text-slate-400 font-mono">{dataAssets.length} assets logged</span>
          </div>

          <DataTable
            data={dataAssets}
            columns={columns}
            keyExtractor={(item) => item.id}
          />
        </div>

        {/* Raw Audit Log Stream */}
        <div className="p-4 rounded-lg border border-slate-800 bg-[#080d16] space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-sm font-bold text-slate-100">
              Raw Audit Telemetry Stream
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportRawLogs}
              className="h-7 text-xs border-slate-700 bg-slate-900 gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-[#00e575]" />
              <span>{exported ? "Exported" : "Export JSON"}</span>
            </Button>
          </div>

          <pre className="text-xs font-mono text-[#00e575] p-3.5 rounded-md bg-[#04070d] border border-slate-800 overflow-x-auto leading-relaxed">
{`[2026-10-02T11:15:32Z] [KERNEL_EBPF] Probed execve syscall: pid=4921 comm="curl" status=ALLOW
[2026-10-02T11:18:24Z] [NEURAL_VEC] Ingested URI: host="secure-sso.internal" score=0.01 verdict=SAFE
[2026-10-02T11:21:55Z] [SOCKET_TRAP] Outbound syn to 185.220.101.5:443 flagged: C2_BEACON action=TERMINATE
[2026-10-02T11:22:01Z] [SYNC_ENGINE] Propagated vector hash e9b2...841f to cluster`}
          </pre>
        </div>
      </div>

      {/* Asset Detail Drawer */}
      {selectedAsset && (
        <Drawer open={drawerOpen} onOpenChange={(open) => !open && setDrawerOpen(false)}>
          <DrawerContent
            side="right"
            className="w-full sm:max-w-xl bg-[#04070d] border-l border-slate-800 p-0 text-slate-100 flex flex-col h-full"
          >
            <div className="p-5 border-b border-slate-800 bg-[#080d16] flex items-start justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <PixelBadge variant="danger" size="sm" dot>
                    Asset: {selectedAsset.id}
                  </PixelBadge>
                  <PixelBadge variant="cyan" size="sm">
                    {selectedAsset.fileType}
                  </PixelBadge>
                </div>
                <h2 className="text-base font-bold text-slate-100">
                  {selectedAsset.fileName}
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

            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              <div className="p-4 rounded-lg border border-slate-800 bg-[#080d16] space-y-1.5">
                <span className="text-[11px] font-semibold text-[#ff4b4b] uppercase tracking-wider block">
                  Detection Reason
                </span>
                <p className="text-slate-100 text-xs font-semibold">{selectedAsset.detectionReason}</p>
                <p className="text-slate-400 text-xs pt-1">
                  Location: <code className="text-slate-200 font-mono text-[11px]">{selectedAsset.location}</code>
                </p>
              </div>

              {/* Hashes */}
              <div className="p-4 rounded-lg border border-slate-800 bg-[#080d16] space-y-2.5">
                <span className="text-[11px] text-[#00e5ff] font-semibold uppercase tracking-wider block">
                  Cryptographic Checksums (Local Disk)
                </span>
                <div className="space-y-2">
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">SHA-256</span>
                    <code className="text-[11px] font-mono text-[#00e575] break-all select-all block bg-[#04070d] p-2 rounded border border-slate-800 mt-0.5">
                      {selectedAsset.hashes.sha256}
                    </code>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">MD5</span>
                    <code className="text-[11px] font-mono text-slate-300 break-all select-all block bg-[#04070d] p-2 rounded border border-slate-800 mt-0.5">
                      {selectedAsset.hashes.md5}
                    </code>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-[#ff4b4b]/30 bg-[#ff4b4b]/5 space-y-1 text-xs">
                <div className="flex items-center gap-2 text-[#ff4b4b] font-semibold">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Action Executed</span>
                </div>
                <p className="text-slate-200 font-semibold text-xs pt-0.5">{selectedAsset.actionTaken}</p>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-[#080d16] flex items-center justify-between">
              <PixelBadge variant="danger" size="sm">
                Status: {selectedAsset.status}
              </PixelBadge>
              <Button
                size="sm"
                onClick={() => setDrawerOpen(false)}
                className="text-xs font-medium h-8 px-4"
              >
                Close Audit
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </AppShell>
  )
}
