"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { cyberAudio } from "./cyber-sound"

export type CyberThemeMode = "matrix" | "cyberpunk" | "redteam" | "ghost"
export type DefconLevel = 1 | 2 | 3 | 4 | 5

interface CyberThemeContextType {
  theme: CyberThemeMode
  setTheme: (theme: CyberThemeMode) => void
  crtScanlines: boolean
  setCrtScanlines: (enabled: boolean) => void
  toggleCrt: () => void
  matrixRain: boolean
  setMatrixRain: (enabled: boolean) => void
  toggleMatrixRain: () => void
  audioEnabled: boolean
  toggleAudio: () => void
  defconLevel: DefconLevel
  setDefconLevel: (level: DefconLevel) => void
  isGlitching: boolean
  triggerGlitch: (durationMs?: number) => void
}

const CyberThemeContext = createContext<CyberThemeContextType | undefined>(undefined)

export function CyberThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<CyberThemeMode>("matrix")
  const [crtScanlines, setCrtScanlinesState] = useState<boolean>(true)
  const [matrixRain, setMatrixRainState] = useState<boolean>(true)
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true)
  const [defconLevel, setDefconLevelState] = useState<DefconLevel>(5)
  const [isGlitching, setIsGlitching] = useState<boolean>(false)

  // Initialize from localStorage
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("ageisx_cyber_theme") as CyberThemeMode
      if (savedTheme && ["matrix", "cyberpunk", "redteam", "ghost"].includes(savedTheme)) {
        setThemeState(savedTheme)
        applyThemeClass(savedTheme)
      } else {
        applyThemeClass("matrix")
      }

      const savedCrt = localStorage.getItem("ageisx_crt_scanlines")
      if (savedCrt !== null) {
        setCrtScanlinesState(savedCrt === "true")
      }

      const savedMatrix = localStorage.getItem("ageisx_matrix_rain")
      if (savedMatrix !== null) {
        setMatrixRainState(savedMatrix === "true")
      }

      setAudioEnabled(cyberAudio.isEnabled())
    } catch {}
  }, [])

  const applyThemeClass = (newTheme: CyberThemeMode) => {
    if (typeof document === "undefined") return
    const root = document.documentElement
    root.classList.remove("theme-matrix", "theme-cyberpunk", "theme-redteam", "theme-ghost")
    root.classList.add(`theme-${newTheme}`)
  }

  const setTheme = (newTheme: CyberThemeMode) => {
    setThemeState(newTheme)
    applyThemeClass(newTheme)
    try {
      localStorage.setItem("ageisx_cyber_theme", newTheme)
    } catch {}
    cyberAudio.playShield()
  }

  const setCrtScanlines = (enabled: boolean) => {
    setCrtScanlinesState(enabled)
    try {
      localStorage.setItem("ageisx_crt_scanlines", enabled ? "true" : "false")
    } catch {}
    cyberAudio.playKeyClick()
  }

  const toggleCrt = () => {
    setCrtScanlines(!crtScanlines)
  }

  const setMatrixRain = (enabled: boolean) => {
    setMatrixRainState(enabled)
    try {
      localStorage.setItem("ageisx_matrix_rain", enabled ? "true" : "false")
    } catch {}
    cyberAudio.playKeyClick()
  }

  const toggleMatrixRain = () => {
    setMatrixRain(!matrixRain)
  }

  const toggleAudio = () => {
    const next = cyberAudio.toggleAudio()
    setAudioEnabled(next)
  }

  const setDefconLevel = (level: DefconLevel) => {
    setDefconLevelState(level)
    if (level <= 2) {
      cyberAudio.playAlert()
      triggerGlitch(800)
    } else {
      cyberAudio.playSonar()
    }
  }

  const triggerGlitch = (durationMs = 400) => {
    setIsGlitching(true)
    setTimeout(() => {
      setIsGlitching(false)
    }, durationMs)
  }

  return (
    <CyberThemeContext.Provider
      value={{
        theme,
        setTheme,
        crtScanlines,
        setCrtScanlines,
        toggleCrt,
        matrixRain,
        setMatrixRain,
        toggleMatrixRain,
        audioEnabled,
        toggleAudio,
        defconLevel,
        setDefconLevel,
        isGlitching,
        triggerGlitch,
      }}
    >
      <div className={`cyber-wrapper theme-${theme} ${crtScanlines ? "has-scanlines" : ""} ${isGlitching ? "cyber-screen-glitch" : ""}`}>
        {children}
      </div>
    </CyberThemeContext.Provider>
  )
}

export function useCyberTheme() {
  const context = useContext(CyberThemeContext)
  if (!context) {
    throw new Error("useCyberTheme must be used within a CyberThemeProvider")
  }
  return context
}
