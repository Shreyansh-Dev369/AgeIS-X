"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"

const Toggle = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    className={cn(
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-none border border-white/20 bg-[#080c10] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00ff66] focus-visible:ring-offset-1 focus-visible:ring-offset-[#040608] disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[#00ff66]/20 data-[state=checked]:border-[#00ff66]",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitive.Thumb
      className={cn(
        "pointer-events-none block h-3.5 w-3.5 rounded-none bg-white/60 transition-transform data-[state=checked]:translate-x-4 data-[state=checked]:bg-[#00ff66] data-[state=unchecked]:translate-x-0.5"
      )}
    />
  </SwitchPrimitive.Root>
))
Toggle.displayName = SwitchPrimitive.Root.displayName

export { Toggle, Toggle as Switch }
