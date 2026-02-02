"use client"

import React from "react"

import { motion } from "framer-motion"
import { Shield, Wifi, Activity, Lock } from "lucide-react"

export function AnimatedShield() {
  return (
    <div className="relative w-[400px] h-[400px] lg:w-[500px] lg:h-[500px]">
      {/* Outer Ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-full border border-primary/20"
      >
        {[0, 60, 120, 180, 240, 300].map((rotation) => (
          <motion.div
            key={rotation}
            className="absolute w-3 h-3 bg-primary/40 rounded-full"
            style={{
              top: "50%",
              left: "50%",
              transform: `rotate(${rotation}deg) translateX(200px) translateY(-50%)`,
            }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, delay: rotation / 360 }}
          />
        ))}
      </motion.div>

      {/* Middle Ring */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute inset-[60px] rounded-full border border-accent/20"
      >
        {[0, 90, 180, 270].map((rotation) => (
          <motion.div
            key={rotation}
            className="absolute w-2 h-2 bg-accent/50 rounded-full"
            style={{
              top: "50%",
              left: "50%",
              transform: `rotate(${rotation}deg) translateX(140px) translateY(-50%)`,
            }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: rotation / 360 }}
          />
        ))}
      </motion.div>

      {/* Inner Ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute inset-[120px] rounded-full border border-primary/30"
      />

      {/* Center Shield */}
      <div className="absolute inset-[150px] flex items-center justify-center">
        <motion.div
          animate={{ 
            boxShadow: [
              "0 0 30px rgba(0,255,136,0.3), 0 0 60px rgba(0,255,136,0.2)",
              "0 0 50px rgba(0,255,136,0.5), 0 0 100px rgba(0,255,136,0.3)",
              "0 0 30px rgba(0,255,136,0.3), 0 0 60px rgba(0,255,136,0.2)",
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="relative w-full h-full rounded-full bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center"
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Shield className="w-24 h-24 text-primary" />
          </motion.div>
          
          {/* Scan Line */}
          <motion.div
            className="absolute inset-0 overflow-hidden rounded-full"
          >
            <motion.div
              animate={{ y: ["-100%", "200%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-full h-1/3 bg-gradient-to-b from-transparent via-primary/20 to-transparent"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Data Points */}
      <FloatingIcon
        icon={<Wifi className="w-5 h-5" />}
        position={{ top: "10%", left: "20%" }}
        delay={0}
      />
      <FloatingIcon
        icon={<Activity className="w-5 h-5" />}
        position={{ top: "20%", right: "15%" }}
        delay={0.5}
      />
      <FloatingIcon
        icon={<Lock className="w-5 h-5" />}
        position={{ bottom: "15%", left: "10%" }}
        delay={1}
      />
      <FloatingIcon
        icon={<Shield className="w-5 h-5" />}
        position={{ bottom: "25%", right: "10%" }}
        delay={1.5}
      />

      {/* Data Streams */}
      <DataStream angle={45} delay={0} />
      <DataStream angle={135} delay={0.5} />
      <DataStream angle={225} delay={1} />
      <DataStream angle={315} delay={1.5} />
    </div>
  )
}

function FloatingIcon({
  icon,
  position,
  delay,
}: {
  icon: React.ReactNode
  position: React.CSSProperties
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: [0.5, 1, 0.5],
        scale: 1,
        y: [0, -10, 0]
      }}
      transition={{ 
        opacity: { duration: 3, repeat: Infinity, delay },
        scale: { duration: 0.5, delay },
        y: { duration: 3, repeat: Infinity, delay }
      }}
      className="absolute p-3 rounded-xl bg-card/80 border border-primary/20 text-primary backdrop-blur-sm"
      style={position}
    >
      {icon}
    </motion.div>
  )
}

function DataStream({ angle, delay }: { angle: number; delay: number }) {
  return (
    <motion.div
      className="absolute top-1/2 left-1/2 w-1 h-20"
      style={{
        transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-150px)`,
      }}
    >
      <motion.div
        animate={{ opacity: [0, 1, 0], y: [0, 60, 120] }}
        transition={{ duration: 2, repeat: Infinity, delay }}
        className="w-full h-4 bg-gradient-to-b from-primary/50 to-transparent rounded-full"
      />
    </motion.div>
  )
}
