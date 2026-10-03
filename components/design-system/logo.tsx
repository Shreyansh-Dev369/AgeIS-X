import React from "react"
import Link from "next/link"

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  showText?: boolean
  className?: string
  href?: string
}

export function Logo({
  size = "md",
  showText = true,
  className = "",
  href,
}: LogoProps) {
  const iconSizes = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-10 h-10",
  }

  const textSizes = {
    sm: "text-sm",
    md: "text-base font-semibold",
    lg: "text-lg font-semibold",
    xl: "text-xl font-bold",
  }

  const svgDimensions = {
    sm: 20,
    md: 24,
    lg: 32,
    xl: 40,
  }

  const content = (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Precision Geometric Security Crest */}
      <div className="relative flex items-center justify-center shrink-0">
        <svg
          width={svgDimensions[size]}
          height={svgDimensions[size]}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={iconSizes[size]}
        >
          {/* Hexagonal shield polygon with precision chamfers */}
          <path
            d="M16 3L27 8.5V16.5C27 23.2 22.3 29.3 16 31C9.7 29.3 5 23.2 5 16.5V8.5L16 3Z"
            fill="#080c10"
            stroke="#00ff66"
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
          {/* Inner core glyph - Aegis-X structural cross */}
          <path
            d="M16 9V23M10 13.5L22 18.5M22 13.5L10 18.5"
            stroke="#f8fafc"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Central security node */}
          <circle cx="16" cy="16" r="2" fill="#00ff66" />
        </svg>
      </div>

      {showText && (
        <div className="flex items-center tracking-tight font-sans">
          <span className={`text-[#f8fafc] font-bold ${textSizes[size]}`}>AgeIS</span>
          <span className={`text-[#00ff66] font-mono font-bold ml-0.5 ${textSizes[size]}`}>-X</span>
        </div>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center focus:outline-none focus-visible:ring-1 focus-visible:ring-[#00ff66] rounded">
        {content}
      </Link>
    )
  }

  return content
}
