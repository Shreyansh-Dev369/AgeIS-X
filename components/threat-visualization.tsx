"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Shield, 
  AlertTriangle, 
  Lock, 
  Eye, 
  Fingerprint, 
  Scan,
  Crosshair,
  Radio,
  Zap,
  Bug,
  Skull,
  ShieldCheck,
  Globe,
  Server
} from "lucide-react"

// Threat data types
interface ThreatData {
  id: number
  type: "malware" | "phishing" | "ransomware" | "ddos" | "safe"
  url: string
  risk: number
  blocked: boolean
}

const threatTypes = [
  { type: "malware", icon: Bug, color: "#dc2626", label: "Malware" },
  { type: "phishing", icon: Skull, color: "#f59e0b", label: "Phishing" },
  { type: "ransomware", icon: Lock, color: "#ef4444", label: "Ransomware" },
  { type: "ddos", icon: Radio, color: "#f97316", label: "DDoS" },
  { type: "safe", icon: ShieldCheck, color: "#22c55e", label: "Safe" },
]

const sampleUrls = [
  "secure-bank-login.net",
  "free-prize-winner.com",
  "paypal-verify.info",
  "microsoft-update.xyz",
  "amazon-refund.net",
  "crypto-wallet.io",
  "login-verify.com",
]

export function ThreatVisualization() {
  const [threats, setThreats] = useState<ThreatData[]>([])
  const [scanningUrl, setScanningUrl] = useState<string | null>(null)
  const [stats, setStats] = useState({ scanned: 0, blocked: 0, safe: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  // Simulate real-time threat detection
  useEffect(() => {
    const interval = setInterval(() => {
      const isThreat = Math.random() > 0.3
      const threatType = isThreat 
        ? threatTypes[Math.floor(Math.random() * 4)].type as ThreatData["type"]
        : "safe"
      
      const newThreat: ThreatData = {
        id: Date.now(),
        type: threatType,
        url: sampleUrls[Math.floor(Math.random() * sampleUrls.length)],
        risk: isThreat ? Math.floor(Math.random() * 40) + 60 : Math.floor(Math.random() * 20),
        blocked: isThreat,
      }

      setScanningUrl(newThreat.url)
      
      setTimeout(() => {
        setThreats(prev => [newThreat, ...prev].slice(0, 5))
        setStats(prev => ({
          scanned: prev.scanned + 1,
          blocked: prev.blocked + (isThreat ? 1 : 0),
          safe: prev.safe + (isThreat ? 0 : 1),
        }))
        setScanningUrl(null)
      }, 800)
    }, 2500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[500px] lg:h-[600px] flex items-center justify-center"
    >
      {/* Background glow effects */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(220, 38, 38, 0.15) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(245, 158, 11, 0.1) 0%, transparent 70%)" }}
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Orbital rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Outer ring */}
        <motion.div
          className="absolute w-[440px] h-[440px] rounded-full border border-primary/20"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {/* Ring nodes */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <motion.div
              key={angle}
              className="absolute w-2 h-2 rounded-full bg-primary/60"
              style={{
                top: "50%",
                left: "50%",
                transform: `rotate(${angle}deg) translateX(220px) translateY(-50%)`,
              }}
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>

        {/* Middle ring */}
        <motion.div
          className="absolute w-[340px] h-[340px] rounded-full border border-accent/30"
          animate={{ rotate: -360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {/* Data flow indicators */}
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <motion.div
              key={angle}
              className="absolute"
              style={{
                top: "50%",
                left: "50%",
                transform: `rotate(${angle}deg) translateX(170px) translateY(-50%)`,
              }}
            >
              <motion.div
                className="w-3 h-3 rounded-full bg-accent/70"
                animate={{ 
                  boxShadow: [
                    "0 0 5px rgba(245, 158, 11, 0.5)",
                    "0 0 15px rgba(245, 158, 11, 0.8)",
                    "0 0 5px rgba(245, 158, 11, 0.5)",
                  ]
                }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.25 }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Inner ring */}
        <motion.div
          className="absolute w-[240px] h-[240px] rounded-full border-2 border-primary/40"
          animate={{ rotate: 360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        >
          {/* Scanning beam */}
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-[120px] origin-bottom"
            style={{
              background: "linear-gradient(to top, rgba(220, 38, 38, 0.8), transparent)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>

        {/* Hexagon center piece */}
        <div className="absolute w-[180px] h-[180px] flex items-center justify-center">
          <motion.div
            className="relative w-full h-full"
            animate={{ rotate: [0, 60, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(220, 38, 38, 0.3)" />
                  <stop offset="100%" stopColor="rgba(245, 158, 11, 0.2)" />
                </linearGradient>
              </defs>
              <motion.polygon
                points="50,3 93,25 93,75 50,97 7,75 7,25"
                fill="url(#hexGradient)"
                stroke="rgba(220, 38, 38, 0.5)"
                strokeWidth="1"
                animate={{ 
                  strokeOpacity: [0.3, 0.8, 0.3],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.polygon
                points="50,15 80,32 80,68 50,85 20,68 20,32"
                fill="none"
                stroke="rgba(245, 158, 11, 0.4)"
                strokeWidth="0.5"
                animate={{ rotate: [0, -60, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "50px 50px" }}
              />
            </svg>
          </motion.div>

          {/* Center shield icon */}
          <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                  boxShadow: [
                    "0 0 30px rgba(220, 38, 38, 0.3)",
                    "0 0 50px rgba(220, 38, 38, 0.5)",
                    "0 0 30px rgba(220, 38, 38, 0.3)",
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <Shield className="w-16 h-16 text-primary relative z-10" />
              
              {/* Scanning effect on shield */}
              <motion.div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
              >
                <motion.div
                  className="w-full h-4 bg-gradient-to-b from-transparent via-primary/30 to-transparent"
                  animate={{ y: [-20, 80, -20] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating threat indicators */}
      <AnimatePresence mode="popLayout">
        {threats.slice(0, 4).map((threat, index) => {
          const threatInfo = threatTypes.find(t => t.type === threat.type)
          const Icon = threatInfo?.icon || AlertTriangle
          const positions = [
            { x: -180, y: -120 },
            { x: 180, y: -100 },
            { x: -160, y: 140 },
            { x: 170, y: 130 },
          ]
          const pos = positions[index]

          return (
            <motion.div
              key={threat.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="absolute glass-red rounded-xl px-3 py-2 flex items-center gap-2"
              style={{
                left: `calc(50% + ${pos.x}px)`,
                top: `calc(50% + ${pos.y}px)`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <Icon 
                className="w-4 h-4" 
                style={{ color: threatInfo?.color }} 
              />
              <span className="text-xs font-mono text-foreground/80 max-w-[100px] truncate">
                {threat.url}
              </span>
              {threat.blocked && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-[10px] font-bold text-primary uppercase"
                >
                  BLOCKED
                </motion.span>
              )}
            </motion.div>
          )
        })}
      </AnimatePresence>

      {/* Live scanning indicator */}
      <AnimatePresence>
        {scanningUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 glass rounded-lg px-4 py-2 flex items-center gap-3"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Scan className="w-4 h-4 text-primary" />
            </motion.div>
            <span className="text-xs font-mono text-muted-foreground">
              Scanning: <span className="text-foreground">{scanningUrl}</span>
            </span>
            <motion.div className="flex gap-0.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-primary"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats overlay */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        {[
          { label: "Scanned", value: stats.scanned, icon: Eye, color: "text-foreground" },
          { label: "Blocked", value: stats.blocked, icon: Shield, color: "text-primary" },
          { label: "Safe", value: stats.safe, icon: ShieldCheck, color: "text-green-500" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-lg px-3 py-1.5 flex items-center gap-2 min-w-[100px]"
          >
            <stat.icon className={`w-3 h-3 ${stat.color}`} />
            <span className="text-[10px] text-muted-foreground uppercase">{stat.label}</span>
            <span className={`text-sm font-mono font-bold ${stat.color} ml-auto`}>
              {stat.value}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-20 h-20 border-l-2 border-t-2 border-primary/30 rounded-tl-lg" />
      <div className="absolute top-0 right-0 w-20 h-20 border-r-2 border-t-2 border-primary/30 rounded-tr-lg" />
      <div className="absolute bottom-0 left-0 w-20 h-20 border-l-2 border-b-2 border-primary/30 rounded-bl-lg" />
      <div className="absolute bottom-0 right-0 w-20 h-20 border-r-2 border-b-2 border-primary/30 rounded-br-lg" />

      {/* Crosshair indicators */}
      <Crosshair className="absolute top-8 left-8 w-4 h-4 text-primary/40" />
      <Crosshair className="absolute bottom-8 right-8 w-4 h-4 text-primary/40" />

      {/* Floating particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/40"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}
    </div>
  )
}
