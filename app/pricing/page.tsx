"use client"

import * as React from "react"
import { PublicShell } from "@/components/layout/public-shell"
import { RobotBackgroundDossier } from "@/components/pricing/robot-background-dossier"
import { RobotHero } from "@/components/pricing/robot-hero"
import { RobotPlanPanel } from "@/components/pricing/robot-plan-panel"
import { ProtectionMatrixTable } from "@/components/pricing/protection-matrix-table"
import { WhichUnitGuide } from "@/components/pricing/which-unit-guide"
import { RobotDossier } from "@/components/pricing/robot-dossier"
import { RobotFaqAssurances } from "@/components/pricing/robot-faq-assurances"
import { CommissioningModal } from "@/components/pricing/commissioning-modal"
import { AGEIS_ROBOT_PLANS, PlanId, RobotPlan } from "@/components/pricing/robot-plans-data"
import { Sparkles, Shield, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export default function PricingPage() {
  const [selectedPlanId, setSelectedPlanId] = React.useState<PlanId>("sentinel")
  const [billingCycle, setBillingCycle] = React.useState<"annual" | "monthly">("annual")
  const [commissioningPlan, setCommissioningPlan] = React.useState<RobotPlan | null>(null)
  const [isCommissionModalOpen, setIsCommissionModalOpen] = React.useState(false)

  const handleSelectPlan = (id: PlanId) => {
    setSelectedPlanId(id)
  }

  const handleOpenDossier = (id: PlanId) => {
    setSelectedPlanId(id)
    const el = document.getElementById("dossier-section")
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const handleCommission = (plan: RobotPlan) => {
    setCommissioningPlan(plan)
    setIsCommissionModalOpen(true)
  }

  return (
    <PublicShell>
      <RobotBackgroundDossier>
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-4 sm:py-8 font-mono">
          {/* 1. EDITORIAL HERO WITH FULL ROSTER BANNER */}
          <RobotHero
            selectedPlan={selectedPlanId}
            onSelectPlan={handleSelectPlan}
          />

          {/* Billing Cadence Selector Bar */}
          <div className="pt-8 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 font-mono">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#39FF14] font-semibold">BILLING CYCLE:</span>
              <div className="inline-flex p-1 bg-[#0B0E14] border border-white/15">
                <button
                  type="button"
                  onClick={() => setBillingCycle("annual")}
                  className={cn(
                    "px-3 py-1.5 text-xs font-mono transition-all cursor-pointer rounded-sm",
                    billingCycle === "annual"
                      ? "bg-[#39FF14] text-[#07090E] font-bold shadow-[0_1px_3px_rgba(0,0,0,0.5),0_0_10px_rgba(0,229,117,0.2)]"
                      : "text-[#A6A6A0] hover:text-[#F1F0EB]"
                  )}
                >
                  ANNUAL PREPAID (SAVE 20%)
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle("monthly")}
                  className={cn(
                    "px-3 py-1.5 text-xs font-mono transition-all cursor-pointer rounded-sm",
                    billingCycle === "monthly"
                      ? "bg-[#39FF14] text-[#07090E] font-bold shadow-[0_1px_3px_rgba(0,0,0,0.5),0_0_10px_rgba(0,229,117,0.2)]"
                      : "text-[#A6A6A0] hover:text-[#F1F0EB]"
                  )}
                >
                  MONTHLY
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 text-[11px] text-[#A6A6A0]">
              <span className="flex items-center gap-1.5 text-[#39FF14]">
                <Check className="w-3.5 h-3.5" />
                <span>30-Day Sovereign Guarantee</span>
              </span>
              <span className="text-white/20">|</span>
              <span>Zero-Knowledge Local Storage</span>
            </div>
          </div>

          {/* 2. MAIN 4-COLUMN ART-DIRECTED ROBOT LINEUP */}
          <section className="py-8 sm:py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/15 shadow-2xl">
              {AGEIS_ROBOT_PLANS.map((plan) => (
                <RobotPlanPanel
                  key={plan.id}
                  plan={plan}
                  isSelected={plan.id === selectedPlanId}
                  onSelect={handleSelectPlan}
                  onOpenDossier={handleOpenDossier}
                  onCommission={handleCommission}
                  billingCycle={billingCycle}
                />
              ))}
            </div>
          </section>

          {/* 3. DETAILED PROTECTION COMPARISON MATRIX */}
          <ProtectionMatrixTable
            selectedPlan={selectedPlanId}
            onSelectPlan={handleSelectPlan}
          />

          {/* 4. WHICH UNIT DO YOU NEED? EDITORIAL ADVISORY */}
          <WhichUnitGuide
            selectedPlan={selectedPlanId}
            onSelectPlan={handleSelectPlan}
          />

          {/* 5. CLASSIFIED PRODUCT DOSSIER DATABASE */}
          <div id="dossier-section">
            <RobotDossier
              activePlanId={selectedPlanId}
              onSelectPlan={handleSelectPlan}
            />
          </div>

          {/* 6. TRANSPARENCY ASSURANCES & ENGINEERING FAQ */}
          <RobotFaqAssurances />
        </div>
      </RobotBackgroundDossier>

      {/* Interactive Unit Commissioning Modal */}
      <CommissioningModal
        plan={commissioningPlan}
        isOpen={isCommissionModalOpen}
        onClose={() => setIsCommissionModalOpen(false)}
        billingCycle={billingCycle}
      />
    </PublicShell>
  )
}
