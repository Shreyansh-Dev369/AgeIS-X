// High-Performance Tactical Web Audio Synthesizer (Zero external dependencies)
"use client"

class CyberAudioEngine {
  private ctx: AudioContext | null = null
  private enabled: boolean = true

  constructor() {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ageisx_audio_enabled")
      this.enabled = saved !== null ? saved === "true" : true
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume()
    }
  }

  public isEnabled(): boolean {
    return this.enabled
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled
    if (typeof window !== "undefined") {
      localStorage.setItem("ageisx_audio_enabled", enabled ? "true" : "false")
    }
  }

  public toggleAudio(): boolean {
    this.setEnabled(!this.enabled)
    if (this.enabled) {
      this.playKeyClick()
    }
    return this.enabled
  }

  // Tactical keyboard keystroke click
  public playKeyClick() {
    if (!this.enabled) return
    try {
      this.initCtx()
      if (!this.ctx) return

      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      const filter = this.ctx.createBiquadFilter()

      filter.type = "highpass"
      filter.frequency.setValueAtTime(1200, this.ctx.currentTime)

      osc.type = "sine"
      const freq = 1600 + (Math.random() - 0.5) * 400
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.03)

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.03)

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start()
      osc.stop(this.ctx.currentTime + 0.035)
    } catch {
      // Audio autoplay policy fallback
    }
  }

  // Futuristic radar blip / sonar chirp
  public playSonar() {
    if (!this.enabled) return
    try {
      this.initCtx()
      if (!this.ctx) return

      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = "sine"
      osc.frequency.setValueAtTime(920, this.ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(1840, this.ctx.currentTime + 0.12)

      gain.gain.setValueAtTime(0.05, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.15)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start()
      osc.stop(this.ctx.currentTime + 0.16)
    } catch {}
  }

  // Tactical threat alert chime
  public playAlert() {
    if (!this.enabled) return
    try {
      this.initCtx()
      if (!this.ctx) return

      const now = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = "sawtooth"
      osc.frequency.setValueAtTime(440, now)
      osc.frequency.setValueAtTime(880, now + 0.06)
      osc.frequency.setValueAtTime(440, now + 0.12)

      gain.gain.setValueAtTime(0.06, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start()
      osc.stop(now + 0.23)
    } catch {}
  }

  // Defensive Shield activation harmonic hum
  public playShield() {
    if (!this.enabled) return
    try {
      this.initCtx()
      if (!this.ctx) return

      const now = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = "triangle"
      osc.frequency.setValueAtTime(220, now)
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.25)

      gain.gain.setValueAtTime(0.08, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start()
      osc.stop(now + 0.32)
    } catch {}
  }

  // Decryption byte lock click
  public playByteTick() {
    if (!this.enabled) return
    try {
      this.initCtx()
      if (!this.ctx) return

      const now = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = "square"
      osc.frequency.setValueAtTime(2400 + Math.random() * 800, now)

      gain.gain.setValueAtTime(0.02, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start()
      osc.stop(now + 0.02)
    } catch {}
  }

  // Threat mitigation success tone
  public playSuccess() {
    if (!this.enabled) return
    try {
      this.initCtx()
      if (!this.ctx) return

      const now = this.ctx.currentTime
      const freqs = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6 chord

      freqs.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator()
        const gain = this.ctx!.createGain()

        osc.type = "sine"
        osc.frequency.setValueAtTime(freq, now + idx * 0.05)

        gain.gain.setValueAtTime(0.03, now + idx * 0.05)
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 0.25)

        osc.connect(gain)
        gain.connect(this.ctx!.destination)

        osc.start(now + idx * 0.05)
        osc.stop(now + idx * 0.05 + 0.26)
      })
    } catch {}
  }
}

export const cyberAudio = typeof window !== "undefined" ? new CyberAudioEngine() : ({
  isEnabled: () => true,
  setEnabled: () => {},
  toggleAudio: () => true,
  playKeyClick: () => {},
  playSonar: () => {},
  playAlert: () => {},
  playShield: () => {},
  playByteTick: () => {},
  playSuccess: () => {},
} as any as CyberAudioEngine)
