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
import { AGEIS_ROBOT_PLANS, PlanId } from "@/components/pricing/robot-plans-data"

export default function PricingPage() {
  const [selectedPlanId, setSelectedPlanId] = React.useState<PlanId>("sentinel")

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

  return (
    <PublicShell>
      <RobotBackgroundDossier>
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-4 sm:py-8">
          {/* 1. EDITORIAL HERO WITH FULL ROSTER BANNER */}
          <RobotHero
            selectedPlan={selectedPlanId}
            onSelectPlan={handleSelectPlan}
          />

          {/* 2. MAIN 4-COLUMN ART-DIRECTED ROBOT LINEUP */}
          <section className="py-12 sm:py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/15 shadow-2xl">
              {AGEIS_ROBOT_PLANS.map((plan) => (
                <RobotPlanPanel
                  key={plan.id}
                  plan={plan}
                  isSelected={plan.id === selectedPlanId}
                  onSelect={handleSelectPlan}
                  onOpenDossier={handleOpenDossier}
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
    </PublicShell>
  )
}
