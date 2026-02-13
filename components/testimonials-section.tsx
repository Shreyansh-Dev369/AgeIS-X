"use client"

import { useRef, useState, useEffect, useMemo } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import {
  Quote,
  ChevronLeft,
  ChevronRight,
  Star,
  Building2,
  Shield,
  TrendingUp,
  Clock,
  CheckCircle2,
  Verified,
  Target,
  Zap,
  Award,
  Globe,
  Users,
  BarChart3,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const testimonials = [
  {
    id: 1,
    quote:
      "AgeIS-X transformed our security posture completely. The real-time detection caught sophisticated phishing attempts that our previous enterprise solution missed. We've seen a 99.7% reduction in successful phishing attacks since implementation, saving us an estimated $2.3M in potential breach costs.",
    author: "Sarah Chen",
    role: "Chief Information Security Officer",
    company: "TechFlow Inc.",
    companySize: "5,000+ employees",
    companyLogo: "TF",
    rating: 5,
    metrics: { threatsBlocked: "47,832", responseTime: "23ms", accuracy: "99.8%" },
    avatar: "SC",
    verified: true,
    industry: "Technology",
    highlight: "Saved $2.3M in potential breach costs",
  },
  {
    id: 2,
    quote:
      "As a security engineer who's evaluated dozens of solutions, AgeIS-X stands out with its sub-50ms response times and clean API architecture. Our integration took just 2 hours. The ML models are incredibly accurate - we've had zero false negatives in 6 months of production use.",
    author: "Michael Rodriguez",
    role: "Principal Security Engineer",
    company: "DataSafe Corporation",
    companySize: "2,500+ employees",
    companyLogo: "DS",
    rating: 5,
    metrics: { threatsBlocked: "31,456", responseTime: "18ms", accuracy: "99.9%" },
    avatar: "MR",
    verified: true,
    industry: "Data Security",
    highlight: "Zero false negatives in 6 months",
  },
  {
    id: 3,
    quote:
      "The dashboard analytics and Chrome extension are absolute game-changers. Our employees actually use it daily now - engagement is up 340%. The human firewall we've built is our strongest defense layer, and it's all powered by AgeIS-X's intuitive UX and instant feedback.",
    author: "Emily Watson",
    role: "VP of Engineering",
    company: "CloudSecure Systems",
    companySize: "1,200+ employees",
    companyLogo: "CS",
    rating: 5,
    metrics: { threatsBlocked: "22,891", responseTime: "31ms", accuracy: "99.6%" },
    avatar: "EW",
    verified: true,
    industry: "Cloud Infrastructure",
    highlight: "340% increase in employee engagement",
  },
  {
    id: 4,
    quote:
      "We conducted a 90-day evaluation against CrowdStrike, Proofpoint, and Mimecast. AgeIS-X outperformed all three in detection accuracy while being 60% more cost-effective. The ROI was evident within the first month - zero successful phishing attempts and 15 executive-targeted attacks blocked.",
    author: "David Kim",
    role: "Chief Technology Officer",
    company: "SecureNet Labs",
    companySize: "800+ employees",
    companyLogo: "SN",
    rating: 5,
    metrics: { threatsBlocked: "15,234", responseTime: "27ms", accuracy: "99.7%" },
    avatar: "DK",
    verified: true,
    industry: "Cybersecurity",
    highlight: "60% more cost-effective than competitors",
  },
  {
    id: 5,
    quote:
      "The neural network accuracy is remarkable. AgeIS-X detected a coordinated spear-phishing campaign targeting our C-suite that bypassed our $500K email security stack. That single detection justified our entire annual investment. It's now our first line of defense.",
    author: "Jennifer Martinez",
    role: "Director of Security Operations",
    company: "FinanceGuard",
    companySize: "3,500+ employees",
    companyLogo: "FG",
    rating: 5,
    metrics: { threatsBlocked: "58,127", responseTime: "21ms", accuracy: "99.9%" },
    avatar: "JM",
    verified: true,
    industry: "Financial Services",
    highlight: "Caught attack that bypassed $500K solution",
  },
  {
    id: 6,
    quote:
      "Deploying AgeIS-X across our 47 healthcare facilities was seamless. HIPAA compliance was critical, and their SOC 2 Type II certification plus end-to-end encryption exceeded our requirements. Patient data protection has never been stronger - we've achieved 100% HIPAA audit scores.",
    author: "Dr. Robert Chang",
    role: "Chief Medical Information Officer",
    company: "MedSecure Health",
    companySize: "8,000+ employees",
    companyLogo: "MS",
    rating: 5,
    metrics: { threatsBlocked: "72,345", responseTime: "25ms", accuracy: "99.8%" },
    avatar: "RC",
    verified: true,
    industry: "Healthcare",
    highlight: "100% HIPAA audit compliance score",
  },
]

const stats = [
  { value: "500+", label: "Enterprise Clients", icon: Building2, color: "text-primary" },
  { value: "99.8%", label: "Detection Accuracy", icon: Target, color: "text-cyan-400" },
  { value: "<30ms", label: "Avg Response Time", icon: Zap, color: "text-amber-400" },
  { value: "10M+", label: "Threats Blocked", icon: Shield, color: "text-primary" },
]

const trustedBy = [
  { name: "Fortune 500 Tech", count: "127" },
  { name: "Global Banks", count: "89" },
  { name: "Healthcare Systems", count: "156" },
  { name: "Government Agencies", count: "43" },
]

function TestimonialCard({ testimonial, isActive }: { testimonial: typeof testimonials[0]; isActive: boolean }) {
  return (
    <div className="h-full p-6 sm:p-8 lg:p-10 rounded-2xl border border-border bg-card/80 backdrop-blur-xl overflow-hidden relative">
      {/* Background glows */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none" />
      
      {/* Animated border glow */}
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-2xl"
          animate={{
            boxShadow: [
              "inset 0 0 0 1px oklch(0.7 0.2 155 / 0.1)",
              "inset 0 0 0 1px oklch(0.7 0.2 155 / 0.3)",
              "inset 0 0 0 1px oklch(0.7 0.2 155 / 0.1)",
            ],
          }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        />
      )}

      <div className="relative z-10 h-full flex flex-col">
        {/* Top Row - Rating & Verification */}
        <div className="flex items-start justify-between mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Quote className="w-10 h-10 sm:w-12 sm:h-12 text-primary/30" />
          </motion.div>

          <div className="flex items-center gap-3">
            {/* Stars */}
            <div className="flex items-center gap-0.5">
              {[...Array(testimonial.rating)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400 text-amber-400" />
                </motion.div>
              ))}
            </div>
            
            {/* Verified Badge */}
            {testimonial.verified && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/30"
              >
                <Verified className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-semibold text-primary">Verified</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Quote Text */}
        <motion.blockquote
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-base sm:text-lg lg:text-xl text-foreground leading-relaxed mb-6 flex-grow"
        >
          &ldquo;{testimonial.quote}&rdquo;
        </motion.blockquote>

        {/* Highlight Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary/10 to-cyan-500/10 border border-primary/20">
            <Award className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">{testimonial.highlight}</span>
          </div>
        </motion.div>

        {/* Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-3 gap-2 sm:gap-4 mb-6"
        >
          <div className="p-3 sm:p-4 rounded-xl bg-primary/5 border border-primary/20 text-center group hover:border-primary/40 transition-colors">
            <div className="text-lg sm:text-2xl font-bold text-primary font-mono group-hover:scale-105 transition-transform">
              {testimonial.metrics.threatsBlocked}
            </div>
            <div className="text-[10px] sm:text-xs text-muted-foreground mt-1">Threats Blocked</div>
          </div>
          <div className="p-3 sm:p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20 text-center group hover:border-cyan-500/40 transition-colors">
            <div className="text-lg sm:text-2xl font-bold text-cyan-400 font-mono group-hover:scale-105 transition-transform">
              {testimonial.metrics.responseTime}
            </div>
            <div className="text-[10px] sm:text-xs text-muted-foreground mt-1">Avg Response</div>
          </div>
          <div className="p-3 sm:p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-center group hover:border-amber-500/40 transition-colors">
            <div className="text-lg sm:text-2xl font-bold text-amber-400 font-mono group-hover:scale-105 transition-transform">
              {testimonial.metrics.accuracy}
            </div>
            <div className="text-[10px] sm:text-xs text-muted-foreground mt-1">Accuracy</div>
          </div>
        </motion.div>

        {/* Author Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-between pt-6 border-t border-border/50"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Avatar */}
            <div className="relative">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-primary via-cyan-400 to-primary p-[2px]">
                <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                  <span className="text-base sm:text-lg font-bold bg-gradient-to-br from-primary to-cyan-400 bg-clip-text text-transparent">
                    {testimonial.avatar}
                  </span>
                </div>
              </div>
              <motion.div
                className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center border-2 border-background"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <CheckCircle2 className="w-3 h-3 text-background" />
              </motion.div>
            </div>
            
            <div>
              <div className="font-semibold text-foreground text-sm sm:text-base">{testimonial.author}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">{testimonial.role}</div>
            </div>
          </div>

          {/* Company Info */}
          <div className="hidden sm:block text-right">
            <div className="flex items-center justify-end gap-2 text-foreground font-medium">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                {testimonial.companyLogo}
              </div>
              <span className="text-sm">{testimonial.company}</span>
            </div>
            <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground mt-1">
              <Users className="w-3 h-3" />
              <span>{testimonial.companySize}</span>
              <span className="text-border">|</span>
              <BarChart3 className="w-3 h-3 text-primary" />
              <span>{testimonial.industry}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export function TestimonialsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const slideVariants = useMemo(() => ({
    enter: (dir: number) => ({
      x: dir > 0 ? 500 : -500,
      opacity: 0,
      scale: 0.9,
      rotateY: dir > 0 ? 15 : -15,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 500 : -500,
      opacity: 0,
      scale: 0.9,
      rotateY: dir < 0 ? 15 : -15,
    }),
  }), [])

  const paginate = (newDirection: number) => {
    setDirection(newDirection)
    setCurrentIndex((prev) => {
      if (newDirection === 1) {
        return prev === testimonials.length - 1 ? 0 : prev + 1
      }
      return prev === 0 ? testimonials.length - 1 : prev - 1
    })
  }

  useEffect(() => {
    if (isPaused) return
    const interval = setInterval(() => paginate(1), 6000)
    return () => clearInterval(interval)
  }, [currentIndex, isPaused])

  return (
    <section
      id="testimonials"
      ref={ref}
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/3 blur-[200px] rounded-full pointer-events-none" />

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(oklch(0.7 0.2 155) 1px, transparent 1px), linear-gradient(90deg, oklch(0.7 0.2 155) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-6"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              <Award className="w-4 h-4 text-primary" />
            </motion.div>
            <span className="text-sm font-medium text-primary">
              Customer Success Stories
            </span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-balance">
            <span className="text-foreground">Trusted by </span>
            <motion.span 
              className="text-primary inline-block"
              animate={{
                textShadow: [
                  "0 0 20px oklch(0.7 0.2 155 / 0.3)",
                  "0 0 40px oklch(0.7 0.2 155 / 0.5)",
                  "0 0 20px oklch(0.7 0.2 155 / 0.3)",
                ],
              }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            >
              Security Leaders
            </motion.span>
            <span className="text-foreground"> Worldwide</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Join 500+ enterprise organizations protecting their digital assets with AI-powered threat intelligence
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-12"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.15 + index * 0.08 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="group"
            >
              <div className="p-4 sm:p-6 rounded-xl border border-border bg-card/50 backdrop-blur-sm text-center hover:border-primary/30 transition-all duration-300">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, delay: index * 0.5 }}
                >
                  <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color} mx-auto mb-2`} />
                </motion.div>
                <motion.div 
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-1 font-mono"
                  animate={isInView ? { opacity: [0.5, 1] } : {}}
                  transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Trusted By Mini Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mb-12 py-4"
        >
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Trusted by:</span>
          {trustedBy.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="flex items-center gap-2 text-sm"
            >
              <Globe className="w-3 h-3 text-primary" />
              <span className="text-muted-foreground">{item.name}</span>
              <span className="font-mono text-primary font-semibold">{item.count}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Testimonial Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="relative min-h-[580px] sm:min-h-[520px] overflow-hidden" style={{ perspective: "1200px" }}>
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 250, damping: 30 },
                  opacity: { duration: 0.25 },
                  scale: { duration: 0.25 },
                  rotateY: { duration: 0.4 },
                }}
                className="absolute inset-0"
              >
                <TestimonialCard 
                  testimonial={testimonials[currentIndex]} 
                  isActive={true}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={() => paginate(-1)}
              className="rounded-full w-10 h-10 sm:w-12 sm:h-12 border-border hover:border-primary/50 hover:bg-primary/10 transition-all group"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            </Button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  type="button"
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1)
                    setCurrentIndex(index)
                  }}
                  className="relative p-1"
                >
                  <motion.div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? "w-8 bg-primary"
                        : "w-2 bg-border hover:bg-muted-foreground"
                    }`}
                  />
                  {index === currentIndex && (
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      initial={{ scale: 1, opacity: 0.5 }}
                      animate={{ scale: 2, opacity: 0 }}
                      transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                      style={{ background: "oklch(0.7 0.2 155 / 0.3)" }}
                    />
                  )}
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => paginate(1)}
              className="rounded-full w-10 h-10 sm:w-12 sm:h-12 border-border hover:border-primary/50 hover:bg-primary/10 transition-all group"
            >
              <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </div>

          {/* Auto-play indicator */}
          <motion.div 
            className="flex items-center justify-center gap-2 mt-4"
            animate={{ opacity: isPaused ? 0.5 : 1 }}
          >
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-primary"
              animate={isPaused ? {} : { scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
            />
            <span className="text-xs text-muted-foreground font-mono">
              {isPaused ? "Paused" : "Auto-playing"}
            </span>
          </motion.div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground mb-4">
            Ready to join industry leaders in cyber defense?
          </p>
          <Button size="lg" className="bg-primary text-background hover:bg-primary/90 group">
            <Shield className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
            Start Free Trial
            <motion.span
              className="ml-2"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            >
              →
            </motion.span>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}



