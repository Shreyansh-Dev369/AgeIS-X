"use client"

import React, { useState, useEffect } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { DataTable, Column } from "@/components/ui/data-table"
import { PixelBadge } from "@/components/ui/pixel-badge"
import { TacticalFrame } from "@/components/ui/tactical-frame"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent } from "@/components/ui/drawer"
import { securityService } from "@/lib/services/security-service"
import { DataAsset } from "@/types/security"
import { Database, Download, HardDrive, FileCode, ArrowRight, X, ShieldAlert, CheckCircle2 } from "lucide-react"

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
      header: "FILE ASSET // IDENTIFIER",
      cell: (item) => (
        <button
          onClick={() => handleInspect(item)}
          className="text-left group focus:outline-none"
        >
          <span className="font-bold text-[#f8fafc] block text-xs group-hover:text-[#00ff66] transition-colors">
            {item.fileName}
          </span>
          <span className="text-[10px] font-mono text-[#7e8b9b]">{item.fileType}</span>
        </button>
      ),
    },
    {
      header: "LOCATION PATH",
      accessorKey: "location",
      className: "text-xs font-mono text-[#7e8b9b] truncate max-w-xs",
    },
    {
      header: "RISK SCORE",
      cell: (item) => (
        <span className={`font-bold text-xs font-mono ${item.riskScore > 70 ? "text-[#ff3b30]" : item.riskScore > 0 ? "text-[#ffb800]" : "text-[#00ff66]"}`}>
          {item.riskScore}%
        </span>
      ),
    },
    {
      header: "STATUS",
      cell: (item) => (
        <PixelBadge
          variant={item.status === "QUARANTINED" ? "danger" : item.status === "SENSITIVE_DETECTED" ? "warning" : "phosphor"}
          size="sm"
        >
          {item.status}
        </PixelBadge>
      ),
    },
    {
      header: "SIZE",
      accessorKey: "fileSize",
      className: "text-[10px] font-mono text-[#00f0ff]",
    },
    {
      header: "ACTION",
      cell: (item) => (
        <button
          onClick={() => handleInspect(item)}
          className="text-[10px] font-mono text-[#00ff66] hover:underline uppercase font-bold"
        >
          [ INSPECT ]
        </button>
      ),
    },
  ]

  const quarantinedCount = dataAssets.filter((d) => d.status === "QUARANTINED").length

  return (
    <AppShell
      title="Data Security & Quarantine Center"
      breadcrumbs={[{ label: "Overview", href: "/dashboard" }, { label: "Data Telemetry" }]}
    >
      <div className="space-y-6 font-mono select-none">
        {/* Header Summary */}
        <TacticalFrame
          variant="panel"
          reticles={true}
          reticleColor="warning"
          className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-white/15 bg-[#080c10]"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <PixelBadge variant="warning" size="sm" dot>
                LOCAL QUARANTINE VAULT ACTIVE
              </PixelBadge>
              <span className="text-[11px] text-[#00ff66]">
                [ENCRYPTED SANDBOX VAULT]
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider text-[#f8fafc] font-sans">
              Data Security, DLP & Quarantine Center
            </h2>
            <p className="text-xs text-[#7e8b9b] max-w-2xl leading-relaxed">
              Monitors sensitive credential exposures in developer files and manages isolated malware artifacts with revoked execution bits.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#040608] border border-white/10 text-center">
              <span className="text-[9px] uppercase text-[#7e8b9b] block">QUARANTINED ARTIFACTS</span>
              <span className="text-sm font-bold text-[#ff3b30]">{quarantinedCount} IN VAULT</span>
            </div>
            <div className="p-3 bg-[#040608] border border-white/10 text-center">
              <span className="text-[9px] uppercase text-[#7e8b9b] block">VECTOR DB REVISION</span>
              <span className="text-sm font-bold text-[#00f0ff]">rev-9842.1</span>
            </div>
          </div>
        </TacticalFrame>

        {/* 2 Surface Telemetry Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TacticalFrame variant="default" className="p-4 bg-[#080c10] border-white/10 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-[#7e8b9b]">LOCAL VECTOR STORE INGESTION</p>
              <p className="text-2xl font-black text-[#f8fafc] mt-1">14.8 MB</p>
              <p className="text-[10px] text-[#00ff66] mt-0.5">Encrypted SQLite on-device cache</p>
            </div>
            <HardDrive className="w-8 h-8 text-[#00f0ff]/30" />
          </TacticalFrame>

          <TacticalFrame variant="default" className="p-4 bg-[#080c10] border-white/10 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-[#7e8b9b]">DECENTRALIZED IOC REVISION</p>
              <p className="text-2xl font-black text-[#00ff66] mt-1">98,420 IOCs</p>
              <p className="text-[10px] text-[#7e8b9b] mt-0.5">Synchronized 4 mins ago via cluster</p>
            </div>
            <Database className="w-8 h-8 text-[#00ff66]/30" />
          </TacticalFrame>
        </div>

        {/* Data Assets Table */}
        <TacticalFrame variant="panel" className="p-4 border-white/15 bg-[#080c10]">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#f8fafc]">
              Audited File Assets & Quarantine Backlog
            </span>
            <span className="text-[10px] text-[#7e8b9b]">{dataAssets.length} ASSETS LOGGED</span>
          </div>

          <DataTable
            data={dataAssets}
            columns={columns}
            keyExtractor={(item) => item.id}
          />
        </TacticalFrame>

        {/* Raw Audit Log Stream */}
        <TacticalFrame variant="panel" className="p-4 border-white/15 bg-[#080c10] space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#f8fafc]">
              Raw Deterministic Audit Telemetry Stream
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportRawLogs}
              className="h-7 text-xs font-mono uppercase tracking-wider gap-1.5 border-white/20"
            >
              <Download className="w-3.5 h-3.5 text-[#00ff66]" />
              <span>{exported ? "[ EXPORTED ]" : "[ EXPORT JSON ]"}</span>
            </Button>
          </div>

          <pre className="text-xs font-mono text-[#00ff66] p-3 bg-[#040608] border border-white/10 overflow-x-auto leading-relaxed">
{`[2026-10-02T11:15:32Z] [KERNEL_EBPF] Probed execve syscall: pid=4921 comm="curl" status=ALLOW
[2026-10-02T11:18:24Z] [NEURAL_VEC] Ingested URI: host="secure-sso.internal" score=0.01 verdict=SAFE
[2026-10-02T11:21:55Z] [SOCKET_TRAP] Outbound syn to 185.220.101.5:443 flagged: C2_BEACON action=TERMINATE
[2026-10-02T11:22:01Z] [SYNC_ENGINE] Propagated vector hash e9b2...841f to cluster`}
          </pre>
        </TacticalFrame>
      </div>

      {/* Asset Detail Drawer */}
      {selectedAsset && (
        <Drawer open={drawerOpen} onOpenChange={(open) => !open && setDrawerOpen(false)}>
          <DrawerContent
            side="right"
            className="w-full sm:max-w-xl bg-[#040608] border-l border-white/15 p-0 text-[#f8fafc] flex flex-col h-full font-mono select-none"
          >
            <div className="p-4 sm:p-5 border-b border-white/10 bg-[#080c10] flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <PixelBadge variant="danger" size="sm" dot>
                    DATA ASSET // {selectedAsset.id.toUpperCase()}
                  </PixelBadge>
                  <PixelBadge variant="cyan" size="sm">
                    {selectedAsset.fileType}
                  </PixelBadge>
                </div>
                <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-[#f8fafc] pt-1">
                  {selectedAsset.fileName}
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
              <TacticalFrame variant="default" className="p-3.5 border-white/10 bg-[#080c10] space-y-1">
                <span className="text-[10px] text-[#ff3b30] font-bold uppercase block">
                  DETECTION REASON // HEURISTIC
                </span>
                <p className="text-[#f8fafc] text-xs font-bold">{selectedAsset.detectionReason}</p>
                <p className="text-[#7e8b9b] text-[11px] pt-1">
                  Path: <code className="text-white">{selectedAsset.location}</code>
                </p>
              </TacticalFrame>

              {/* Hashes */}
              <div className="p-3.5 border border-white/10 bg-[#080c10] space-y-2">
                <span className="text-[10px] text-[#00f0ff] font-bold uppercase block">
                  CRYPTOGRAPHIC CHECKSUMS (LOCAL DISK)
                </span>
                <div className="space-y-1">
                  <div>
                    <span className="text-[10px] text-white/40 block">SHA-256</span>
                    <code className="text-[10px] text-[#00ff66] break-all select-all block">
                      {selectedAsset.hashes.sha256}
                    </code>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/40 block">MD5</span>
                    <code className="text-[10px] text-white/70 break-all select-all block">
                      {selectedAsset.hashes.md5}
                    </code>
                  </div>
                </div>
              </div>

              <div className="p-3.5 border border-[#ff3b30]/30 bg-[#ff3b30]/5 space-y-1">
                <div className="flex items-center gap-2 text-[#ff3b30] font-bold uppercase text-[11px]">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>ACTION EXECUTED</span>
                </div>
                <p className="text-[#f8fafc] font-bold text-xs pt-0.5">{selectedAsset.actionTaken}</p>
              </div>
            </div>

            <div className="p-4 border-t border-white/10 bg-[#080c10] flex items-center justify-between">
              <PixelBadge variant="danger" size="sm">
                STATUS: {selectedAsset.status}
              </PixelBadge>
              <Button
                size="sm"
                onClick={() => setDrawerOpen(false)}
                className="text-xs font-mono uppercase tracking-wider font-bold h-8 px-4"
              >
                [ CLOSE ASSET AUDIT ]
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </AppShell>
  )
}
