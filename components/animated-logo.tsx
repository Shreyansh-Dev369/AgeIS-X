"use client"

import { motion } from "framer-motion"
import { Shield } from "lucide-react"

interface AnimatedLogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
  className?: string
}

export function AnimatedLogo({ size = "md", showText = true, className = "" }: AnimatedLogoProps) {
  const sizeClasses = {
    sm: "h-5 w-5",
    md: "h-7 w-7",
    lg: "h-10 w-10",
  }

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        {/* Animated Shield with Color Cycle */}
        <motion.div
          animate={{
            color: [
              "oklch(0.85 0.25 145)", // Green (primary)
              "oklch(0.75 0.18 195)", // Cyan (accent)
              "oklch(0.7 0.2 60)",    // Amber (warning)
              "oklch(0.85 0.25 145)", // Back to green
            ],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <Shield className={sizeClasses[size]} />
        </motion.div>

        {/* Animated Glow Effect */}
        <motion.div
          className={`absolute inset-0 ${sizeClasses[size]} rounded-full blur-md pointer-events-none`}
          animate={{
            backgroundColor: [
              "oklch(0.85 0.25 145 / 0.4)",
              "oklch(0.75 0.18 195 / 0.4)",
              "oklch(0.7 0.2 60 / 0.4)",
              "oklch(0.85 0.25 145 / 0.4)",
            ],
            scale: [1, 1.4, 1.2, 1],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        {/* Pulse Ring */}
        <motion.div
          className={`absolute inset-0 ${sizeClasses[size]} rounded-full border-2 pointer-events-none`}
          animate={{
            borderColor: [
              "oklch(0.85 0.25 145 / 0.6)",
              "oklch(0.75 0.18 195 / 0.6)",
              "oklch(0.7 0.2 60 / 0.6)",
              "oklch(0.85 0.25 145 / 0.6)",
            ],
            scale: [1, 1.6, 1.6, 1],
            opacity: [0.8, 0, 0, 0.8],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      {showText && (
        <span className={`${textSizes[size]} font-bold tracking-tight`}>
          <span className="text-foreground">Age</span>
          <motion.span
            animate={{
              color: [
                "oklch(0.85 0.25 145)",
                "oklch(0.75 0.18 195)",
                "oklch(0.7 0.2 60)",
                "oklch(0.85 0.25 145)",
              ],
              textShadow: [
                "0 0 10px oklch(0.85 0.25 145 / 0.5)",
                "0 0 15px oklch(0.75 0.18 195 / 0.5)",
                "0 0 10px oklch(0.7 0.2 60 / 0.5)",
                "0 0 10px oklch(0.85 0.25 145 / 0.5)",
              ],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            IS-X
          </motion.span>
        </span>
      )}
    </div>
  )
}
