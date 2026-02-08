"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import {
  Shield,
  Zap,
  Brain,
  Lock,
  Database,
  History,
  Chrome,
  Building2,
} from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Real-Time Phishing Detection",
    description:
      "Instant threat analysis using advanced pattern recognition and ML classification.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Zap,
    title: "Low-Latency ML Inference",
    description:
      "Sub-50ms response times powered by optimized Logistic Regression models.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Brain,
    title: "AI-Based NLP Engineering",
    description:
      "TF-IDF vectorization and advanced NLP preprocessing for accurate feature extraction.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Lock,
    title: "Secure JWT Authentication",
    description:
      "Enterprise-grade security with encrypted tokens and secure session management.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Database,
    title: "Redis Rate Limiting",
    description:
      "Distributed rate limiting ensures fair usage and protects against abuse.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: History,
    title: "Persistent Search History",
    description:
      "Full scan history with filtering, search, and export capabilities.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Chrome,
    title: "Chrome Extension Protection",
    description:
      "Always-on browser protection with real-time URL scanning while you browse.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Building2,
    title: "Enterprise-Ready Architecture",
    description:
      "Scalable infrastructure designed for high-volume enterprise deployments.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
]

export function FeaturesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section
      id="features"
      ref={ref}
      className="relative py-24 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 cyber-grid opacity-20" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 blur-[150px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 blur-[120px] rounded-full" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-6"
          >
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Powerful Features
            </span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-foreground">Enterprise-Grade </span>
            <span className="text-primary text-glow-green">Security</span>
            <br />
            <span className="text-foreground">Built for </span>
            <span className="text-accent text-glow-cyan">Scale</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Every feature is designed with production-ready standards, 
            combining cutting-edge AI with enterprise security requirements.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <FeatureCard feature={feature} index={index} />
            </motion.div>
          ))}
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 p-8 rounded-2xl border border-border bg-card/30 backdrop-blur-xl"
        >
          {[
            { value: "99.7%", label: "Detection Accuracy" },
            { value: "<50ms", label: "Avg Response Time" },
            { value: "10M+", label: "URLs Analyzed" },
            { value: "24/7", label: "Uptime Monitoring" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl sm:text-4xl font-bold text-primary font-mono mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[0]
  index: number
}) {
  const Icon = feature.icon

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="group relative h-full p-6 rounded-2xl border border-border bg-card/30 backdrop-blur-xl hover:border-primary/30 transition-colors"
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative z-10">
        <motion.div
          whileHover={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.5 }}
          className={`inline-flex p-3 rounded-xl ${feature.bgColor} mb-4`}
        >
          <Icon className={`w-6 h-6 ${feature.color}`} />
        </motion.div>

        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
          {feature.title}
        </h3>

        <p className="text-sm text-muted-foreground leading-relaxed">
          {feature.description}
        </p>
      </div>

      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden rounded-tr-2xl">
        <div className={`absolute top-0 right-0 w-12 h-12 ${feature.bgColor} opacity-50 rotate-45 translate-x-6 -translate-y-6`} />
      </div>
    </motion.div>
  )
}
