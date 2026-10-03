import * as React from "react"
import { cn } from "@/lib/utils"

export interface PixelIconProps extends React.SVGAttributes<SVGElement> {
  className?: string
  size?: number
  color?: string
}

// 1-Bit Pixel Shield Icon
export function PixelShield({ className, size = 16, color = "currentColor", ...props }: PixelIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      shapeRendering="crispEdges"
      className={cn("shrink-0", className)}
      {...props}
    >
      <rect x="2" y="2" width="12" height="2" fill={color} />
      <rect x="1" y="4" width="14" height="2" fill={color} />
      <rect x="1" y="6" width="14" height="4" fill={color} />
      <rect x="2" y="10" width="12" height="2" fill={color} />
      <rect x="4" y="12" width="8" height="2" fill={color} />
      <rect x="7" y="14" width="2" height="2" fill={color} />
      {/* Inner core notch */}
      <rect x="7" y="5" width="2" height="4" fill="#040608" />
    </svg>
  )
}

// 1-Bit Pixel Lock Icon
export function PixelLock({ className, size = 16, color = "currentColor", ...props }: PixelIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      shapeRendering="crispEdges"
      className={cn("shrink-0", className)}
      {...props}
    >
      <rect x="5" y="2" width="6" height="2" fill={color} />
      <rect x="3" y="4" width="2" height="4" fill={color} />
      <rect x="11" y="4" width="2" height="4" fill={color} />
      <rect x="2" y="7" width="12" height="7" fill={color} />
      <rect x="7" y="9" width="2" height="2" fill="#040608" />
      <rect x="7.5" y="11" width="1" height="2" fill="#040608" />
    </svg>
  )
}

// 1-Bit Pixel Terminal Prompt Icon
export function PixelTerminal({ className, size = 16, color = "currentColor", ...props }: PixelIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      shapeRendering="crispEdges"
      className={cn("shrink-0", className)}
      {...props}
    >
      <rect x="1" y="2" width="14" height="12" fill={color} />
      <rect x="2" y="3" width="12" height="10" fill="#040608" />
      {/* > prompt */}
      <rect x="4" y="5" width="1" height="1" fill={color} />
      <rect x="5" y="6" width="1" height="1" fill={color} />
      <rect x="6" y="7" width="1" height="1" fill={color} />
      <rect x="5" y="8" width="1" height="1" fill={color} />
      <rect x="4" y="9" width="1" height="1" fill={color} />
      {/* _ cursor */}
      <rect x="8" y="9" width="3" height="1" fill={color} />
    </svg>
  )
}

// 1-Bit Pixel Radar / Scanner Icon
export function PixelRadar({ className, size = 16, color = "currentColor", ...props }: PixelIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      shapeRendering="crispEdges"
      className={cn("shrink-0", className)}
      {...props}
    >
      <rect x="4" y="1" width="8" height="1" fill={color} />
      <rect x="2" y="2" width="2" height="2" fill={color} />
      <rect x="12" y="2" width="2" height="2" fill={color} />
      <rect x="1" y="4" width="1" height="8" fill={color} />
      <rect x="14" y="4" width="1" height="8" fill={color} />
      <rect x="2" y="12" width="2" height="2" fill={color} />
      <rect x="12" y="12" width="2" height="2" fill={color} />
      <rect x="4" y="14" width="8" height="1" fill={color} />
      {/* Center blip */}
      <rect x="7" y="7" width="2" height="2" fill={color} />
      <rect x="9" y="5" width="2" height="2" fill={color} />
    </svg>
  )
}

// 1-Bit Pixel Network Node Icon
export function PixelNetwork({ className, size = 16, color = "currentColor", ...props }: PixelIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      shapeRendering="crispEdges"
      className={cn("shrink-0", className)}
      {...props}
    >
      <rect x="6" y="2" width="4" height="3" fill={color} />
      <rect x="1" y="11" width="4" height="3" fill={color} />
      <rect x="11" y="11" width="4" height="3" fill={color} />
      <rect x="7.5" y="5" width="1" height="4" fill={color} />
      <rect x="3" y="8.5" width="10" height="1" fill={color} />
      <rect x="3" y="9" width="1" height="2" fill={color} />
      <rect x="12" y="9" width="1" height="2" fill={color} />
    </svg>
  )
}

// 1-Bit Pixel Device / Terminal Endpoint Icon
export function PixelDevice({ className, size = 16, color = "currentColor", ...props }: PixelIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      shapeRendering="crispEdges"
      className={cn("shrink-0", className)}
      {...props}
    >
      <rect x="3" y="2" width="10" height="8" fill={color} />
      <rect x="4" y="3" width="8" height="6" fill="#040608" />
      <rect x="1" y="11" width="14" height="2" fill={color} />
      <rect x="6" y="13" width="4" height="1" fill={color} />
    </svg>
  )
}

// 1-Bit Pixel Identity / Fingerprint Icon
export function PixelIdentity({ className, size = 16, color = "currentColor", ...props }: PixelIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      shapeRendering="crispEdges"
      className={cn("shrink-0", className)}
      {...props}
    >
      <rect x="6" y="2" width="4" height="1" fill={color} />
      <rect x="4" y="3" width="2" height="1" fill={color} />
      <rect x="10" y="3" width="2" height="1" fill={color} />
      <rect x="3" y="5" width="1" height="6" fill={color} />
      <rect x="12" y="5" width="1" height="6" fill={color} />
      <rect x="5" y="6" width="1" height="4" fill={color} />
      <rect x="10" y="6" width="1" height="4" fill={color} />
      <rect x="7" y="7" width="2" height="5" fill={color} />
      <rect x="4" y="12" width="2" height="1" fill={color} />
      <rect x="10" y="12" width="2" height="1" fill={color} />
    </svg>
  )
}

// 1-Bit Pixel Threat / Warning Triangle Icon
export function PixelThreat({ className, size = 16, color = "#ff3b30", ...props }: PixelIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      shapeRendering="crispEdges"
      className={cn("shrink-0", className)}
      {...props}
    >
      <rect x="7" y="2" width="2" height="2" fill={color} />
      <rect x="6" y="4" width="4" height="2" fill={color} />
      <rect x="5" y="6" width="6" height="2" fill={color} />
      <rect x="4" y="8" width="8" height="2" fill={color} />
      <rect x="2" y="10" width="12" height="2" fill={color} />
      <rect x="1" y="12" width="14" height="2" fill={color} />
      {/* Exclamation point */}
      <rect x="7" y="5" width="2" height="4" fill="#040608" />
      <rect x="7" y="10" width="2" height="2" fill="#040608" />
    </svg>
  )
}

// 1-Bit Pixel Intelligence / AI Node Matrix Icon
export function PixelIntelligence({ className, size = 16, color = "currentColor", ...props }: PixelIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      shapeRendering="crispEdges"
      className={cn("shrink-0", className)}
      {...props}
    >
      <rect x="4" y="4" width="8" height="8" fill={color} />
      <rect x="6" y="6" width="4" height="4" fill="#040608" />
      <rect x="7" y="7" width="2" height="2" fill={color} />
      {/* Pins */}
      <rect x="6" y="1" width="1" height="2" fill={color} />
      <rect x="9" y="1" width="1" height="2" fill={color} />
      <rect x="6" y="13" width="1" height="2" fill={color} />
      <rect x="9" y="13" width="1" height="2" fill={color} />
      <rect x="1" y="6" width="2" height="1" fill={color} />
      <rect x="1" y="9" width="2" height="1" fill={color} />
      <rect x="13" y="6" width="2" height="1" fill={color} />
      <rect x="13" y="9" width="2" height="1" fill={color} />
    </svg>
  )
}

// 1-Bit Pixel Key Icon
export function PixelKey({ className, size = 16, color = "currentColor", ...props }: PixelIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      shapeRendering="crispEdges"
      className={cn("shrink-0", className)}
      {...props}
    >
      <rect x="2" y="4" width="5" height="5" fill={color} />
      <rect x="3.5" y="5.5" width="2" height="2" fill="#040608" />
      <rect x="7" y="6" width="7" height="2" fill={color} />
      <rect x="10" y="8" width="2" height="2" fill={color} />
      <rect x="13" y="8" width="1" height="2" fill={color} />
    </svg>
  )
}
