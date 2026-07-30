"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion"

import styles from "../landing.module.css"

export default function ScrollPhoneCta() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const phoneY = useTransform(scrollYProgress, [0, 0.5, 0.8], [210, 10, -20])
  const phoneScale = useTransform(
    scrollYProgress,
    [0, 0.48, 0.82],
    [0.74, 1, 1.04],
  )
  const phoneOpacity = useTransform(scrollYProgress, [0, 0.18], [0, 1])
  const copyY = useTransform(scrollYProgress, [0, 0.38], [45, 0])
  const copyOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1])

  return (
    <section ref={sectionRef} className={styles.scrollCta}>
      <motion.div
        className={styles.scrollCtaCopy}
        style={
          reduceMotion
            ? undefined
            : {
                y: copyY,
                opacity: copyOpacity,
              }
        }
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
        style={
          reduceMotion
            ? undefined
            : {
                y: phoneY,
                scale: phoneScale,
                opacity: phoneOpacity,
              }
        }
      >
        <div className={styles.scrollPhoneGlow} aria-hidden="true" />
        <Image
          src="/celular1451.png"
          alt="Tela inicial da Régua Máxima em um celular"
          width={1820}
          height={2048}
          sizes="(max-width: 700px) 95vw, 620px"
        />
      </motion.div>
    </section>
  )
}
