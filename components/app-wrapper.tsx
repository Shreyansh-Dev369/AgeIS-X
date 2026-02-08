"use client"

import React, { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Preloader } from "@/components/preloader"

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)

  const handleComplete = useCallback(() => {
    setIsLoading(false)
  }, [])

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <Preloader onComplete={handleComplete} duration={4500} />
        )}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ 
          opacity: isLoading ? 0 : 1, 
          y: isLoading ? 10 : 0,
        }}
        transition={{ 
          duration: 0.6, 
          ease: [0.22, 1, 0.36, 1],
          delay: isLoading ? 0 : 0.1
        }}
      >
        {children}
      </motion.div>
    </>
  )
}
