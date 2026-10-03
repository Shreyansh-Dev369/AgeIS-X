"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-none border border-white/20 bg-[#080c10] text-[#040608] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00ff66] focus-visible:ring-offset-1 focus-visible:ring-offset-[#040608] disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[#00ff66] data-[state=checked]:border-[#00ff66] transition-all",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-[#040608] font-bold")}
    >
      <Check className="h-3 w-3 stroke-[3]" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
