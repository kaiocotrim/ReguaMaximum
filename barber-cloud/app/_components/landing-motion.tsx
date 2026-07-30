"use client"

import { useEffect, useState, type MouseEvent, type ReactNode } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createPortal } from "react-dom"
import {
  motion,
  useReducedMotion,
  type HTMLMotionProps,
} from "framer-motion"

import styles from "../landing.module.css"

const transition = {
  duration: 0.65,
  ease: [0.22, 1, 0.36, 1] as const,
}

function useReveal(delay = 0, distance = 28) {
  const reduceMotion = useReducedMotion()

  return {
    initial: reduceMotion ? false : { opacity: 0, y: distance },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.16 },
    transition: { ...transition, delay: reduceMotion ? 0 : delay },
  }
}

export function MotionSection({
  delay = 0,
  ...props
}: HTMLMotionProps<"section"> & { delay?: number }) {
  return <motion.section {...useReveal(delay)} {...props} />
}

export function MotionDiv({
  delay = 0,
  distance = 28,
  ...props
}: HTMLMotionProps<"div"> & { delay?: number; distance?: number }) {
  return <motion.div {...useReveal(delay, distance)} {...props} />
}

export function MotionArticle({
  delay = 0,
  ...props
}: HTMLMotionProps<"article"> & { delay?: number }) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.article
      {...useReveal(delay, 22)}
      whileHover={
        reduceMotion
          ? undefined
          : {
              y: -7,
              transition: { duration: 0.22, ease: "easeOut" },
            }
      }
      {...props}
    />
  )
}

export function MotionFooter(props: HTMLMotionProps<"footer">) {
  return <motion.footer {...useReveal(0, 16)} {...props} />
}

export function TransitionLink({
  href,
  className,
  children,
}: {
  href: string
  className?: string
  children: ReactNode
}) {
  const router = useRouter()
  const reduceMotion = useReducedMotion()
  const [transition, setTransition] = useState<{
    active: boolean
    x: number
    y: number
  }>({ active: false, x: 0, y: 0 })

  useEffect(() => {
    router.prefetch(href)
  }, [href, router])

  useEffect(() => {
    function resetTransition() {
      setTransition({ active: false, x: 0, y: 0 })
    }

    window.addEventListener("pageshow", resetTransition)
    return () => window.removeEventListener("pageshow", resetTransition)
  }, [])

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      reduceMotion
    ) {
      return
    }

    event.preventDefault()
    if (transition.active) return

    const buttonBounds = event.currentTarget.getBoundingClientRect()

    setTransition({
      active: true,
      x: buttonBounds.left + buttonBounds.width / 2,
      y: buttonBounds.top + buttonBounds.height / 2,
    })
  }

  return (
    <>
      <Link href={href} className={className} onClick={handleClick}>
        {children}
      </Link>
      {transition.active &&
        createPortal(
          <motion.div
            className={styles.pageTransition}
            aria-hidden="true"
            style={{
              left: transition.x - 18,
              top: transition.y - 18,
            }}
            initial={{ scale: 1 }}
            animate={{ scale: 160 }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
            onAnimationComplete={() => router.push(href)}
          />,
          document.body,
        )}
    </>
  )
}
