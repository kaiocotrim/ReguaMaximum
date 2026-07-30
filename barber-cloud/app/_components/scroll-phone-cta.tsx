"use client"

import { useRef } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import {
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion"

import styles from "../landing.module.css"
import LandingPhoneDemo from "./landing-phone-demo"

export default function ScrollPhoneCta() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const isInView = useInView(sectionRef, { once: true, amount: 0.18 })

  return (
    <section ref={sectionRef} className={styles.scrollCta}>
      <motion.div
        className={styles.scrollCtaCopy}
        initial={reduceMotion ? false : { opacity: 0, y: 26 }}
        animate={
          reduceMotion || isInView
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 26 }
        }
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <span>Régua Máxima</span>
        <h2>Sua barbearia mais organizada com a Régua Máxima</h2>
        <p>
          Crie sua conta e centralize sua rotina em um sistema simples de usar.
        </p>
        <Link href="/login" className={styles.primaryButton}>
          Criar minha conta
          <ArrowRight aria-hidden="true" />
        </Link>
      </motion.div>

      <motion.div
        className={styles.scrollPhone}
        initial={reduceMotion ? false : { opacity: 0, y: 150, scale: 0.94 }}
        animate={
          reduceMotion || isInView
            ? { opacity: 1, y: 0, scale: 1 }
            : { opacity: 0, y: 150, scale: 0.94 }
        }
        transition={{
          delay: reduceMotion ? 0 : 0.65,
          duration: 1.45,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <div className={styles.scrollPhoneGlow} aria-hidden="true" />
        <div
          className={styles.scrollIphone}
          aria-label="Demonstração animada do sistema Régua Máxima"
        >
          <span className={styles.volumeButtons} aria-hidden="true" />
          <span className={styles.powerButton} aria-hidden="true" />
          <span className={styles.dynamicIsland} aria-hidden="true">
            <i />
          </span>
          <LandingPhoneDemo />
        </div>
      </motion.div>
    </section>
  )
}
