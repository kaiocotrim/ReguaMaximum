"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ArrowRight, Check, Scissors } from "lucide-react"

import styles from "../landing.module.css"

const days = [
  ["SEG", "08"],
  ["TER", "09"],
  ["QUA", "10"],
  ["QUI", "11"],
  ["SEX", "12"],
]

const times = ["09:00", "10:30", "13:00", "14:30", "16:00", "17:30"]

export default function LandingPhoneDemo() {
  const [scene, setScene] = useState(0)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (reduceMotion) return

    const timer = window.setInterval(() => {
      setScene((current) => (current + 1) % 4)
    }, 2100)

    return () => window.clearInterval(timer)
  }, [reduceMotion])

  const selectedDay = scene >= 1 ? 2 : -1
  const selectedTime = scene >= 2 ? 3 : -1

  return (
    <div className={styles.phoneScreen}>
      <AnimatePresence mode="wait">
        {scene === 3 ? (
          <motion.div
            key="advertisement"
            className={styles.phoneAdvertisement}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.03 }}
            transition={{ duration: 0.45 }}
          >
            <div className={styles.advertisementGlow} aria-hidden="true" />
            <Image
              src="/LogoMComBorder3.png"
              alt="Logo da Régua Máxima"
              width={120}
              height={78}
              priority
            />
            <span>Gestão para barbearias</span>
            <h3>Sua barbearia pode faturar mais.</h3>
            <p>Agenda, clientes, equipe e finanças em um único lugar.</p>
            <div>
              Conheça a Régua Máxima
              <ArrowRight aria-hidden="true" />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="booking"
            className={styles.bookingDemo}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className={styles.phoneTop}>
              <Image
                src="/LogoMComBorder3.png"
                alt="Logo da Régua Máxima"
                width={58}
                height={38}
                priority
              />
              <span>9:41</span>
            </div>

            <div className={styles.phoneHeading}>
              <p>Agendamento</p>
              <span>
                {scene === 0
                  ? "Escolha o melhor dia"
                  : scene === 1
                    ? "Agora escolha um horário"
                    : "Revise e confirme"}
              </span>
            </div>

            <div className={styles.calendar}>
              <div className={styles.calendarLabel}>
                <strong>Junho</strong>
                <span>2026</span>
              </div>
              <div className={styles.days}>
                {days.map(([label, day], index) => (
                  <motion.div
                    key={day}
                    className={index === selectedDay ? styles.activeDay : undefined}
                    animate={index === selectedDay ? { scale: [1, 1.12, 1] } : {}}
                  >
                    <span>{label}</span>
                    <strong>{day}</strong>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className={styles.phoneSectionLabel}>Horários disponíveis</div>
            <div className={styles.times}>
              {times.map((time, index) => (
                <motion.span
                  key={time}
                  className={index === selectedTime ? styles.activeTime : undefined}
                  animate={index === selectedTime ? { scale: [1, 1.1, 1] } : {}}
                >
                  {time}
                </motion.span>
              ))}
            </div>

            <div className={styles.serviceCard}>
              <div>
                <Scissors aria-hidden="true" />
              </div>
              <p>
                <strong>Corte + Barba</strong>
                <span>45 minutos</span>
              </p>
              <strong>R$ 65</strong>
            </div>

            <motion.div
              className={styles.confirmButton}
              animate={
                scene === 2
                  ? {
                      scale: [1, 0.96, 1],
                      backgroundColor: ["#c3f32c", "#9ac20f", "#c3f32c"],
                    }
                  : {}
              }
            >
              {scene === 2 ? (
                <>
                  <Check aria-hidden="true" />
                  Agendamento confirmado
                </>
              ) : (
                "Confirmar agendamento"
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
