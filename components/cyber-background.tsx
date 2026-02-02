"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

export function CyberBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -20%, rgba(220, 38, 38, 0.15), transparent),
            radial-gradient(ellipse 60% 40% at 80% 100%, rgba(245, 158, 11, 0.08), transparent),
            radial-gradient(ellipse 50% 30% at 20% 80%, rgba(220, 38, 38, 0.06), transparent)
          `
        }}
      />

      {/* Animated grid */}
      <div className="absolute inset-0 cyber-grid animate-grid-pulse" />

      {/* Matrix rain canvas */}
      <MatrixRain />

      {/* Floating orbs */}
      <FloatingOrbs />

      {/* Scan lines overlay */}
      <div className="absolute inset-0 scan-lines opacity-30" />

      {/* Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 30%, rgba(6, 6, 20, 0.8) 100%)"
        }}
      />

      {/* Noise texture */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
      }} />
    </div>
  )
}

function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resize()
    window.addEventListener("resize", resize)

    // Matrix characters - binary and special chars
    const chars = "01アイウエオカキクケコサシスセソタチツテト10".split("")
    const fontSize = 14
    const columns = Math.floor(canvas.width / fontSize)
    const drops: number[] = Array(columns).fill(1).map(() => Math.random() * -100)

    const draw = () => {
      // Semi-transparent black to create trail effect
      ctx.fillStyle = "rgba(6, 6, 20, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)]
        const x = i * fontSize
        const y = drops[i] * fontSize

        // Gradient effect - brighter at the head
        const brightness = Math.random() > 0.98 ? 1 : 0.3
        ctx.fillStyle = `rgba(220, 38, 38, ${brightness * 0.5})`
        ctx.fillText(char, x, y)

        // Reset drop randomly
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }

      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 opacity-20 pointer-events-none"
    />
  )
}

function FloatingOrbs() {
  const orbs = [
    { size: 300, x: "10%", y: "20%", color: "rgba(220, 38, 38, 0.08)", duration: 20 },
    { size: 200, x: "80%", y: "30%", color: "rgba(245, 158, 11, 0.06)", duration: 25 },
    { size: 250, x: "70%", y: "70%", color: "rgba(220, 38, 38, 0.05)", duration: 22 },
    { size: 180, x: "20%", y: "80%", color: "rgba(245, 158, 11, 0.04)", duration: 28 },
    { size: 150, x: "50%", y: "50%", color: "rgba(220, 38, 38, 0.06)", duration: 18 },
  ]

  return (
    <>
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl pointer-events-none"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: orb.color,
            transform: "translate(-50%, -50%)",
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -20, 30, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  )
}

// Grid lines component
export function GridLines() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Horizontal lines */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`h-${i}`}
          className="absolute w-full h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent"
          style={{ top: `${(i + 1) * 5}%` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
      
      {/* Vertical lines */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`v-${i}`}
          className="absolute h-full w-px bg-gradient-to-b from-transparent via-primary/10 to-transparent"
          style={{ left: `${(i + 1) * 5}%` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.2, 0] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
  )
}
