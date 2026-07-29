"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { useEffect, useState } from "react"

const INTRO_DURATION = 2600
const REDUCED_MOTION_DURATION = 900

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
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#050706]"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            filter: shouldReduceMotion ? "blur(0px)" : "blur(8px)",
          }}
          transition={{
            duration: shouldReduceMotion ? 0.2 : 0.75,
            ease: [0.76, 0, 0.24, 1],
          }}
        >
          <div
            className="absolute inset-0 opacity-80"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(195,243,44,0.10) 0%, rgba(37,79,80,0.08) 28%, transparent 62%)",
            }}
          />

          <motion.div
            aria-hidden="true"
            className="absolute h-[34rem] w-[34rem] rounded-full bg-[#C3F32C]/5 blur-[110px]"
            initial={{ opacity: 0, scale: 0.65 }}
            animate={
              shouldReduceMotion
                ? { opacity: 0.55 }
                : { opacity: [0, 0.8, 0.35], scale: [0.65, 1, 1.1] }
            }
            transition={{ duration: 2.4, ease: "easeOut" }}
          />

          <motion.div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-[12vh] bg-black"
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
          />
          <motion.div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-[12vh] bg-black"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
          />

          <motion.div
            className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 text-center"
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.96, filter: "blur(14px)" }
            }
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 1.025, filter: "blur(6px)" }
            }
            transition={{
              duration: shouldReduceMotion ? 0.2 : 1.15,
              delay: shouldReduceMotion ? 0 : 0.25,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <motion.div
              aria-hidden="true"
              className="mb-7 h-px w-24 origin-center bg-gradient-to-r from-transparent via-[#C3F32C] to-transparent"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.35, ease: "easeOut" }}
            />

            <p className="text-[clamp(1.65rem,4vw,3.6rem)] font-light leading-[1.15] tracking-[-0.035em] text-white">
              Melhore o seu negócio
            </p>
            <p className="mt-2 text-[clamp(1.65rem,4vw,3.6rem)] font-semibold leading-[1.15] tracking-[-0.035em] text-white">
              com a{" "}
              <span className="text-[#C3F32C] drop-shadow-[0_0_24px_rgba(195,243,44,0.18)]">
                Régua Máxima
              </span>
            </p>

            <motion.p
              className="mt-7 text-[10px] font-medium uppercase tracking-[0.42em] text-white/35 sm:text-xs"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.95 }}
            >
              Gestão que impulsiona
            </motion.p>
          </motion.div>

          {!shouldReduceMotion && (
            <motion.div
              aria-hidden="true"
              className="absolute inset-y-0 w-28 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.035] to-transparent blur-xl"
              initial={{ left: "-20%" }}
              animate={{ left: "120%" }}
              transition={{ duration: 1.8, delay: 0.45, ease: "easeInOut" }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
