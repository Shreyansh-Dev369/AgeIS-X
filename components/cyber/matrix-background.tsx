"use client"

import React, { useEffect, useRef } from "react"
import { useCyberTheme } from "@/lib/cyber-theme"

export function MatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { matrixRain, theme } = useCyberTheme()

  useEffect(() => {
    if (!matrixRain) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
      initDrops()
    }

    window.addEventListener("resize", handleResize)

    // Character set: Katakana + Hex + Cyber runes
    const chars = "0123456789ABCDEF010101ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ<>/{}$#~λψΣΩΞΔ"
    const fontSize = 14
    let columns = Math.floor(width / fontSize)
    let drops: number[] = []
    let speeds: number[] = []

    const initDrops = () => {
      columns = Math.floor(width / fontSize)
      drops = []
      speeds = []
      for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * -height / fontSize)
        speeds[i] = Math.random() * 0.8 + 0.5
      }
    }

    initDrops()

    // Mouse interaction
    let mouseX = -9999
    let mouseY = -9999
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }
    window.addEventListener("mousemove", handleMouseMove)

    // Colors according to current theme
    const getThemeColors = () => {
      switch (theme) {
        case "cyberpunk":
          return {
            trail: "#00f0ff",
            lead: "#ffffff",
            glow: "rgba(0, 240, 255, 0.4)",
            accent: "#ff007f",
          }
        case "redteam":
          return {
            trail: "#ff003c",
            lead: "#ffffff",
            glow: "rgba(255, 0, 60, 0.4)",
            accent: "#ffaa00",
          }
        case "ghost":
          return {
            trail: "#94a3b8",
            lead: "#ffffff",
            glow: "rgba(148, 163, 184, 0.4)",
            accent: "#38bdf8",
          }
        case "matrix":
        default:
          return {
            trail: "#00ff66",
            lead: "#f0fff4",
            glow: "rgba(0, 255, 102, 0.5)",
            accent: "#39ff14",
          }
      }
    }

    let lastDraw = performance.now()
    const fpsInterval = 1000 / 30 // Smooth 30fps for authentic terminal render

    const draw = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(draw)

      const elapsed = currentTime - lastDraw
      if (elapsed < fpsInterval) return
      lastDraw = currentTime - (elapsed % fpsInterval)

      // Fade out screen
      ctx.fillStyle = "rgba(2, 4, 8, 0.12)"
      ctx.fillRect(0, 0, width, height)

      const colors = getThemeColors()
      ctx.font = `${fontSize}px 'JetBrains Mono', monospace`

      for (let i = 0; i < drops.length; i++) {
        const x = i * fontSize
        const y = drops[i] * fontSize

        // Check distance to mouse for interactive repulsion
        const dx = x - mouseX
        const dy = y - mouseY
        const dist = Math.sqrt(dx * dx + dy * dy)
        const isNearMouse = dist < 120

        const char = chars[Math.floor(Math.random() * chars.length)]

        if (isNearMouse) {
          // Intense pulse when hovered
          ctx.fillStyle = colors.accent
          ctx.shadowBlur = 10
          ctx.shadowColor = colors.accent
          ctx.fillText(char, x + (Math.random() - 0.5) * 4, y)
        } else {
          // Leading bright character
          ctx.fillStyle = colors.lead
          ctx.shadowBlur = 8
          ctx.shadowColor = colors.glow
          ctx.fillText(char, x, y)

          // Dim trailing character above
          if (drops[i] > 1) {
            const trailChar = chars[Math.floor(Math.random() * chars.length)]
            ctx.shadowBlur = 0
            ctx.fillStyle = colors.trail
            ctx.fillText(trailChar, x, y - fontSize)
          }
        }

        ctx.shadowBlur = 0

        // Reset drop at bottom or randomly
        if (y > height && Math.random() > 0.975) {
          drops[i] = 0
        }

        drops[i] += speeds[i]
      }
    }

    animationFrameId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [matrixRain, theme])

  if (!matrixRain) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-35 mix-blend-screen transition-opacity duration-700">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  )
}
