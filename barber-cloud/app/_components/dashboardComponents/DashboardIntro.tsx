"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { useEffect, useState } from "react"

const INTRO_DURATION = 1800
const REDUCED_MOTION_DURATION = 700

export function DashboardIntro() {
  const [isVisible, setIsVisible] = useState(true)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const timeout = window.setTimeout(
      () => setIsVisible(false),
      shouldReduceMotion ? REDUCED_MOTION_DURATION : INTRO_DURATION,
    )

    return () => window.clearTimeout(timeout)
  }, [shouldReduceMotion])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          role="status"
          aria-live="polite"
          aria-label="Melhore o seu negócio com a Régua Máxima"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#f5f7f3] dark:bg-[#070908]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: shouldReduceMotion ? 0.15 : 0.4,
            ease: "easeOut",
          }}
        >
          <motion.div
            className="mx-auto flex max-w-3xl flex-col items-center px-6 text-center"
            initial={
              shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }
            }
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -6 }}
            transition={{
              duration: shouldReduceMotion ? 0.15 : 0.55,
              delay: shouldReduceMotion ? 0 : 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <p className="text-[clamp(1.5rem,3.5vw,3rem)] font-medium leading-[1.2] tracking-[-0.035em] text-[#244c4e] dark:text-white">
              Melhore o seu negócio
            </p>
            <p className="mt-1 text-[clamp(1.5rem,3.5vw,3rem)] font-medium leading-[1.2] tracking-[-0.035em] text-[#244c4e]/60 dark:text-white/65">
              com a{" "}
              <span className="text-[#71910d] dark:text-[#C3F32C]">
                Régua Máxima
              </span>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
