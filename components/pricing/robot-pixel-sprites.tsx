"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface GlyphProps extends React.SVGAttributes<SVGElement> {
  className?: string
  size?: number
  color?: string
}

/**
 * 1-Bit Pixel Scout Droid Glyph (Compact, single-lens, tripod posture)
 */
export function PixelScoutGlyph({
  className,
  size = 28,
  color = "#39FF14",
  ...props
}: GlyphProps) {
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
      {/* Top Antenna */}
      <rect x="7" y="1" width="2" height="1" fill={color} />
      <rect x="7" y="2" width="2" height="1" fill={color} />
      {/* Head dome */}
      <rect x="5" y="3" width="6" height="1" fill={color} />
      <rect x="4" y="4" width="8" height="3" fill={color} />
      {/* Central eye sensor (dark pupil with bright center) */}
      <rect x="6" y="5" width="4" height="2" fill="#050505" />
      <rect x="7" y="5" width="2" height="1" fill={color} />
      {/* Neck mount */}
      <rect x="7" y="7" width="2" height="1" fill={color} />
      {/* Upper Torso */}
      <rect x="5" y="8" width="6" height="2" fill={color} />
      {/* Tripod Legs */}
      <rect x="4" y="10" width="2" height="2" fill={color} />
      <rect x="7" y="10" width="2" height="3" fill={color} />
      <rect x="10" y="10" width="2" height="2" fill={color} />
      {/* Footpads */}
      <rect x="3" y="12" width="2" height="2" fill={color} />
      <rect x="11" y="12" width="2" height="2" fill={color} />
      <rect x="7" y="13" width="2" height="1" fill={color} />
    </svg>
  )
}

/**
 * 1-Bit Pixel Guard Droid Glyph (Compact humanoid, visor helmet, tactical vest)
 */
export function PixelGuardGlyph({
  className,
  size = 28,
  color = "#39FF14",
  ...props
}: GlyphProps) {
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
      {/* Helmet crest */}
      <rect x="5" y="1" width="6" height="1" fill={color} />
      <rect x="4" y="2" width="8" height="2" fill={color} />
      {/* Visor slit */}
      <rect x="5" y="4" width="6" height="2" fill="#050505" />
      <rect x="6" y="4" width="4" height="1" fill={color} />
      {/* Jaw / neck */}
      <rect x="5" y="6" width="6" height="1" fill={color} />
      {/* Shoulders & Chest harness */}
      <rect x="2" y="7" width="12" height="2" fill={color} />
      <rect x="3" y="9" width="10" height="3" fill={color} />
      {/* Center chest badge */}
      <rect x="7" y="9" width="2" height="2" fill="#050505" />
      {/* Tactical Belt & Pouches */}
      <rect x="3" y="12" width="3" height="2" fill={color} />
      <rect x="7" y="12" width="2" height="2" fill={color} />
      <rect x="10" y="12" width="3" height="2" fill={color} />
      {/* Base stance */}
      <rect x="4" y="14" width="3" height="2" fill={color} />
      <rect x="9" y="14" width="3" height="2" fill={color} />
    </svg>
  )
}

/**
 * 1-Bit Pixel Sentinel Droid Glyph (Intricate tactical humanoid, multi-sensors, shoulder pods)
 */
export function PixelSentinelGlyph({
  className,
  size = 28,
  color = "#39FF14",
  ...props
}: GlyphProps) {
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
      {/* Sensor horn/antennae */}
      <rect x="3" y="1" width="2" height="2" fill={color} />
      <rect x="11" y="1" width="2" height="2" fill={color} />
      {/* Helmet skull */}
      <rect x="5" y="2" width="6" height="3" fill={color} />
      {/* Asymmetric optics array */}
      <rect x="6" y="4" width="2" height="1" fill="#050505" />
      <rect x="9" y="4" width="2" height="2" fill="#050505" />
      <rect x="9" y="4" width="1" height="1" fill={color} />
      {/* Heavy Shoulder Pauldrons */}
      <rect x="1" y="6" width="4" height="3" fill={color} />
      <rect x="11" y="6" width="4" height="3" fill={color} />
      <rect x="5" y="6" width="6" height="3" fill={color} />
      {/* Reinforced Exoskeleton Torso */}
      <rect x="3" y="9" width="10" height="3" fill={color} />
      <rect x="6" y="9" width="4" height="2" fill="#050505" />
      <rect x="7" y="10" width="2" height="1" fill={color} />
      {/* Waist & Modular Leg Assembly */}
      <rect x="4" y="12" width="8" height="2" fill={color} />
      <rect x="3" y="14" width="3" height="2" fill={color} />
      <rect x="10" y="14" width="3" height="2" fill={color} />
    </svg>
  )
}

/**
 * 1-Bit Pixel Aegis Droid Glyph (Flagship Shrouded Apex Guardian, Horned Crown, Elegant Mantle)
 */
export function PixelAegisGlyph({
  className,
  size = 28,
  color = "#39FF14",
  ...props
}: GlyphProps) {
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
      {/* Crown Crest */}
      <rect x="7" y="0" width="2" height="2" fill={color} />
      <rect x="4" y="1" width="2" height="2" fill={color} />
      <rect x="10" y="1" width="2" height="2" fill={color} />
      {/* Sleek Helmet Visor */}
      <rect x="5" y="2" width="6" height="4" fill={color} />
      <rect x="6" y="3" width="4" height="2" fill="#050505" />
      <rect x="7" y="3" width="3" height="1" fill={color} />
      {/* Flowing Mantle / Armor Collar */}
      <rect x="2" y="6" width="12" height="3" fill={color} />
      <rect x="3" y="7" width="10" height="1" fill="#050505" />
      {/* Armored Chest Apex Plate */}
      <rect x="3" y="9" width="10" height="3" fill={color} />
      <rect x="7" y="9" width="2" height="2" fill="#050505" />
      {/* Flowing Cape & Lower Lattice */}
      <rect x="2" y="12" width="4" height="4" fill={color} />
      <rect x="10" y="12" width="4" height="4" fill={color} />
      <rect x="6" y="12" width="4" height="3" fill={color} />
      <rect x="7" y="14" width="2" height="2" fill="#050505" />
    </svg>
  )
}

/**
 * Authentic Barcode Graphic
 */
export function BarcodeGraphic({
  code = "SX-AGEIS-9920",
  className,
}: {
  code?: string
  className?: string
}) {
  return (
    <div className={cn("inline-flex flex-col gap-1 select-none font-mono", className)}>
      <div className="flex items-center gap-[2px] h-6">
        {[2, 1, 3, 1, 1, 2, 4, 1, 2, 1, 3, 1, 2, 3, 1, 1, 2, 1, 4, 2, 1, 2, 1, 3, 2].map(
          (w, i) => (
            <span
              key={i}
              className="h-full bg-white/70 block"
              style={{ width: `${w}px` }}
            />
          )
        )}
      </div>
      <span className="text-[8px] text-[#A6A6A0] tracking-widest uppercase">{code}</span>
    </div>
  )
}

/**
 * Editorial Registration Marks (+)
 */
export function RegistrationMark({
  className,
  size = 14,
}: {
  className?: string
  size?: number
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center font-mono text-white/40 select-none",
        className
      )}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      +
    </span>
  )
}
