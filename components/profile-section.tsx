"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import {
  User,
  Mail,
  Crown,
  Shield,
  Download,
  Chrome,
  Settings,
  LogOut,
  Check,
  Sparkles,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    features: ["3 URL scans", "Basic risk scoring", "Email support"],
    current: true,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    features: [
      "Unlimited scans",
      "Advanced analytics",
      "API access",
      "Priority support",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    features: [
      "Everything in Pro",
      "Custom models",
      "Dedicated support",
      "SLA guarantee",
    ],
  },
]

export function ProfileSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [selectedPlan, setSelectedPlan] = useState("Free")

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 cyber-grid opacity-20" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-accent/5 blur-[150px] rounded-full" />

      <div className="relative z-10 page-container">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Profile Card */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent/5 mb-6"
            >
              <User className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">
                User Profile
              </span>
            </motion.div>

            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              <span className="text-foreground">Manage Your </span>
              <span className="text-accent text-glow-cyan">Account</span>
            </h2>

            <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-xl overflow-hidden">
              {/* Profile Header */}
              <div className="p-6 border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
                <div className="flex items-start gap-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative"
                  >
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent p-0.5">
                      <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                        <User className="w-8 h-8 text-primary" />
                      </div>
                    </div>
                    <button
                      type="button"
                      className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      <Settings className="w-3 h-3" />
                    </button>
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground">
                      Alex Johnson
                    </h3>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
                      <Mail className="w-4 h-4" />
                      alex@company.com
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        <Crown className="w-3 h-3" />
                        Free Plan
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Usage Stats */}
              <div className="p-6 border-b border-border">
                <h4 className="text-sm font-medium text-foreground mb-4">
                  Usage This Month
                </h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">
                        URL Scans
                      </span>
                      <span className="text-sm font-mono text-primary">
                        2 / 3
                      </span>
                    </div>
                    <Progress value={66} className="h-2" />
                  </div>
                  <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Running low on scans
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Upgrade to Pro for unlimited URL scanning
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 bg-transparent"
                >
                  <Chrome className="w-4 h-4 text-primary" />
                  Download Chrome Extension
                  <Download className="w-4 h-4 ml-auto" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 bg-transparent"
                >
                  <Settings className="w-4 h-4" />
                  Account Settings
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 text-destructive hover:text-destructive bg-transparent"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Pricing Plans */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-6"
            >
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Upgrade Plan
              </span>
            </motion.div>

            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              <span className="text-foreground">Choose Your </span>
              <span className="text-primary text-glow-green">Plan</span>
            </h2>

            <div className="space-y-4">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedPlan(plan.name)}
                  className={`relative p-6 rounded-2xl border cursor-pointer transition-all ${
                    selectedPlan === plan.name
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card/50 hover:border-primary/30"
                  } ${plan.popular ? "ring-2 ring-primary/20" : ""}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                      Most Popular
                    </div>
                  )}

                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {plan.name}
                      </h3>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-3xl font-bold text-foreground">
                          {plan.price}
                        </span>
                        <span className="text-muted-foreground">
                          {plan.period}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedPlan === plan.name
                          ? "border-primary bg-primary"
                          : "border-border"
                      }`}
                    >
                      {selectedPlan === plan.name && (
                        <Check className="w-4 h-4 text-primary-foreground" />
                      )}
                    </div>
                  </div>

                  <ul className="mt-4 space-y-2">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {plan.current && (
                    <div className="mt-4 px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-sm text-center">
                      Current Plan
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mt-6"
            >
              <Button
                size="lg"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow-green"
                disabled={selectedPlan === "Free"}
              >
                {selectedPlan === "Free"
                  ? "Select a plan to upgrade"
                  : `Upgrade to ${selectedPlan}`}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}



