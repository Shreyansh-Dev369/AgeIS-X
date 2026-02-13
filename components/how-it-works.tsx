"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Link2, FileCode, Brain, BarChart3, Server, CheckCircle } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: Link2,
    title: "URL Ingestion",
    description:
      "Your URL is securely received and sanitized through our API gateway with rate limiting and validation.",
    details: ["Input sanitization", "Rate limiting", "SSL verification"],
  },
  {
    number: "02",
    icon: FileCode,
    title: "NLP Preprocessing",
    description:
      "Advanced text processing extracts key features using TF-IDF vectorization and custom tokenizers.",
    details: ["TF-IDF vectorization", "Token extraction", "Feature engineering"],
  },
  {
    number: "03",
    icon: Brain,
    title: "ML Inference",
    description:
      "Multiple models analyze the URL simultaneously for comprehensive threat assessment.",
    details: [
      "Logistic Regression (Primary)",
      "LSTM Benchmark",
      "BiLSTM Benchmark",
    ],
  },
  {
    number: "04",
    icon: BarChart3,
    title: "Risk Scoring",
    description:
      "Ensemble scoring combines model outputs into a single risk score with confidence intervals.",
    details: ["0-100 risk scale", "Confidence scoring", "Threat classification"],
  },
  {
    number: "05",
    icon: Server,
    title: "FastAPI Response",
    description:
      "Results are returned via our high-performance FastAPI backend with sub-50ms latency.",
    details: ["<50ms response", "JSON response", "Audit logging"],
  },
]

export function HowItWorks() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section
      id="how-it-works"
      ref={ref}
      className="relative py-24 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 cyber-grid opacity-20" />
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[400px] h-[800px] bg-primary/5 blur-[150px]" />

      <div className="relative z-10 page-container">
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent/5 mb-6"
          >
            <Brain className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">
              Under the Hood
            </span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-foreground">How </span>
            <span className="text-primary text-glow-green">AgeIS-X</span>
            <span className="text-foreground"> Works</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            From URL input to risk score — follow the journey of a URL through our 
            ML-powered analysis pipeline.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 lg:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-accent to-primary/20" />

          {/* Steps */}
          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className={`relative flex items-center gap-8 ${
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}
              >
                {/* Content Card */}
                <div className={`flex-1 ml-20 lg:ml-0 ${index % 2 === 0 ? "lg:pr-16" : "lg:pl-16"}`}>
                  <StepCard step={step} index={index} isInView={isInView} />
                </div>

                {/* Center Icon */}
                <div className="absolute left-8 lg:left-1/2 -translate-x-1/2 z-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: index * 0.15 + 0.3 }}
                    className="relative"
                  >
                    <div className="w-16 h-16 rounded-full bg-card border-2 border-primary flex items-center justify-center">
                      <step.icon className="w-7 h-7 text-primary" />
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                      className="absolute inset-0 rounded-full border-2 border-primary/30"
                    />
                  </motion.div>
                </div>

                {/* Empty space for alternating layout */}
                <div className="hidden lg:block flex-1" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-20 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-primary/30 bg-primary/5">
            <CheckCircle className="w-5 h-5 text-primary" />
            <span className="text-foreground font-medium">
              Average processing time: <span className="text-primary font-mono">47ms</span>
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function StepCard({
  step,
  index,
  isInView,
}: {
  step: (typeof steps)[0]
  index: number
  isInView: boolean
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="group relative p-6 rounded-2xl border border-border bg-card/30 backdrop-blur-xl hover:border-primary/30 transition-colors"
    >
      {/* Step Number */}
      <div className="absolute -top-3 -right-3 px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-mono font-bold">
        {step.number}
      </div>

      <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
        {step.title}
      </h3>

      <p className="text-muted-foreground mb-4 leading-relaxed">
        {step.description}
      </p>

      {/* Details */}
      <div className="flex flex-wrap gap-2">
        {step.details.map((detail, i) => (
          <motion.span
            key={detail}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.3, delay: index * 0.15 + 0.5 + i * 0.1 }}
            className="px-3 py-1 rounded-full text-xs font-mono bg-secondary text-secondary-foreground border border-border"
          >
            {detail}
          </motion.span>
        ))}
      </div>

      {/* Glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </motion.div>
  )
}



