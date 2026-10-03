import React from "react"
import { Download, ShieldCheck, Check, Settings, Activity, Lock, Terminal } from "lucide-react"
import { TacticalFrame } from "@/components/ui/tactical-frame"
import { PixelBadge } from "@/components/ui/pixel-badge"

const steps = [
  {
    step: "01",
    tag: "INSTALLATION",
    title: "INSTALL AGEIS-X CLIENT",
    desc: "Single lightweight binary built in native Rust/C++ with zero background bloatware or high CPU drag.",
  },
  {
    step: "02",
    tag: "AUTHENTICATION",
    title: "LINK PASSKEY VAULT",
    desc: "Authenticate once with your cryptographic hardware token or FIDO2 passkey to bind your endpoints.",
  },
  {
    step: "03",
    tag: "PERMISSIONS",
    title: "GRANT OS EXTENSIONS",
    desc: "Enable platform-approved system network filters and security extensions with full local attestation.",
  },
  {
    step: "04",
    tag: "AUTONOMOUS MESH",
    title: "CONTINUOUS DEFENSE",
    desc: "Runs silently, inspecting telemetry vectors locally and alerting only when malicious behavior is verified.",
  },
]

export function DeviceOnboardingFlow() {
  return (
    <TacticalFrame variant="panel" reticles className="p-5 sm:p-7 font-mono">
      <div className="max-w-2xl mb-6">
        <div className="text-[10px] uppercase tracking-widest text-[#00ff66] mb-1 flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5" />
          <span>DEPLOYMENT_GUIDE // ZERO-FRICTION SETUP</span>
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-[#f8fafc]">
          One App. One Security Account. Universal Protection.
        </h3>
        <p className="text-xs text-[#7e8b9b] font-sans mt-2 leading-relaxed">
          You should not need five disconnected browser extensions, separate spam blockers, antivirus pop-ups, and three different password monitors. AgeIS-X converges your entire defense posture into one cohesive system.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {steps.map((s, idx) => (
          <div
            key={idx}
            className="p-4 rounded-none bg-[#040608] border border-white/10 flex flex-col justify-between hover:border-[#00ff66]/40 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                <span className="text-xs font-bold text-[#00ff66]">
                  [{s.step}]
                </span>
                <span className="text-[9px] text-[#7e8b9b] border border-white/10 px-1 py-0.2">
                  {s.tag}
                </span>
              </div>
              <h4 className="text-xs font-bold text-[#f8fafc] mb-1.5">{s.title}</h4>
              <p className="text-xs text-[#7e8b9b] font-sans leading-relaxed">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </TacticalFrame>
  )
}
