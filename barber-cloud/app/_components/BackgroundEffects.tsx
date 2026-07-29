"use client"

import { memo, useMemo } from "react"
import { motion } from "framer-motion"

type Particle = {
  id: number
  side: "left" | "right"
  x: number
  y: number
  size: number
  opacity: number
  duration: number
  delay: number
  driftX: number
  driftY: number
}

const pseudoRandom = (value: number) => {
  const result = Math.sin(value * 12.9898 + 78.233) * 43758.5453
  return result - Math.floor(result)
}

function GlowLayer() {
  return (
    <div className="absolute inset-0 hidden lg:block">
      <div className="absolute inset-y-0 left-0 w-[clamp(250px,22vw,360px)] bg-[radial-gradient(ellipse_at_left,_rgba(195,243,44,0.9)_0%,_rgba(195,243,44,0.38)_38%,_rgba(195,243,44,0.1)_62%,_transparent_80%)] opacity-[0.24] blur-[42px] dark:opacity-[0.34] xl:opacity-[0.3] xl:dark:opacity-[0.42] 2xl:opacity-[0.36] 2xl:dark:opacity-[0.5]" />
      <div className="absolute inset-y-0 right-0 w-[clamp(250px,22vw,360px)] bg-[radial-gradient(ellipse_at_right,_rgba(195,243,44,0.9)_0%,_rgba(195,243,44,0.38)_38%,_rgba(195,243,44,0.1)_62%,_transparent_80%)] opacity-[0.24] blur-[42px] dark:opacity-[0.34] xl:opacity-[0.3] xl:dark:opacity-[0.42] 2xl:opacity-[0.36] 2xl:dark:opacity-[0.5]" />
    </div>
  )
}

function ParticlesLayer() {
  const particles = useMemo<Particle[]>(() => {
    const durations = [12, 18, 20, 24]

    return Array.from({ length: 48 }, (_, index) => {
      const value = (salt: number) => pseudoRandom(index * 11 + salt)

      return {
        id: index,
        side: index % 2 === 0 ? "left" : "right",
        x: 8 + value(1) * 76,
        y: 2 + value(2) * 96,
        size: 1.6 + value(3) * 3,
        opacity: 0.16 + value(4) * 0.16,
        duration: durations[index % durations.length],
        delay: value(5) * -24,
        driftX: -10 + value(6) * 20,
        driftY: 20 + value(7) * 24,
      }
    })
  }, [])

  return (
    <div className="absolute inset-0 hidden xl:block">
      {(["left", "right"] as const).map((side) => (
        <div
          key={side}
          className={`absolute inset-y-0 w-[7vw] 2xl:w-[9vw] ${
            side === "left" ? "left-0" : "right-0"
          }`}
        >
          {particles
            .filter((particle) => particle.side === side)
            .map((particle) => (
              <motion.span
                key={particle.id}
                className="absolute rounded-full bg-[#C3F32C] blur-[0.5px] will-change-transform"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  width: particle.size,
                  height: particle.size,
                }}
                initial={{ opacity: particle.opacity }}
                animate={{
                  x: [0, particle.driftX, -particle.driftX / 2, 0],
                  y: [0, -particle.driftY, particle.driftY / 3, 0],
                  scale: [1, 1.18, 0.92, 1],
                  opacity: [
                    particle.opacity * 0.7,
                    particle.opacity,
                    particle.opacity * 0.8,
                    particle.opacity * 0.7,
                  ],
                }}
                transition={{
                  duration: particle.duration,
                  delay: particle.delay,
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
              />
            ))}
        </div>
      ))}
    </div>
  )
}

export const BackgroundEffects = memo(function BackgroundEffects() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      <GlowLayer />
      <ParticlesLayer />
    </div>
  )
})
