"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export type Plan = {
  id: string
  name: string
  eyebrow: string
  description: string
  price: string
  features: string[]
  image: string
  rootBg: string
  cardBg: string
  overlayGradient: string
  textColor: string
  badgeBg: string
  badgeColor: string
  accentColor: string
  ctaBg: string
  ctaColor: string
  arrowBg: string
  arrowColor: string
  checkBg: string
  checkColor: string
  backColor: string
  cardHeight?: string
}

const plans: Plan[] = [
  {
    id: "basic",
    name: "Plano Básico",
    eyebrow: "Básico",
    description:
      "Perfeito para barbeiros autônomos que querem organizar agendamentos e ter presença digital.",
    price: "R$ 29",
    features: [
      "Agendamentos ilimitados",
      "Perfil na plataforma",
      "Suporte por e-mail",
      "Notificações para clientes",
    ],
    image: "/maquina2.png",
    rootBg: "#0d1500",
    cardBg: "#0d1a05",
    overlayGradient:
      "linear-gradient(to top, rgba(10,20,2,0.97) 0%, rgba(10,20,2,0.45) 60%, transparent 100%)",
    textColor: "#ffffff",
    badgeBg: "rgba(163,230,53,0.15)",
    badgeColor: "#a3e635",
    accentColor: "#a3e635",
    ctaBg: "#a3e635",
    ctaColor: "#0d1a05",
    arrowBg: "rgba(163,230,53,0.15)",
    arrowColor: "#a3e635",
    checkBg: "rgba(163,230,53,0.15)",
    checkColor: "#a3e635",
    backColor: "rgba(255,255,255,0.4)",
  },
  {
    id: "pro",
    name: "Plano Pro",
    eyebrow: "Pro — Mais popular",
    description:
      "Para barbeiros que querem crescer com dados, integrações e suporte ágil.",
    price: "R$ 59",
    features: [
      "Tudo do Básico",
      "Relatórios de desempenho",
      "Integração com redes sociais",
      "Suporte prioritário",
      "Dashboard de métricas",
    ],
    image: "/bannerPro.png",
    rootBg: "#111111",
    cardBg: "#0a0a0a",
    overlayGradient:
      "linear-gradient(to top, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.5) 55%, transparent 100%)",
    textColor: "#ffffff",
    badgeBg: "rgba(255,255,255,0.1)",
    badgeColor: "#ffffff",
    accentColor: "#ffffff",
    ctaBg: "#ffffff",
    ctaColor: "#111111",
    arrowBg: "rgba(255,255,255,0.1)",
    arrowColor: "#ffffff",
    checkBg: "rgba(255,255,255,0.1)",
    checkColor: "#ffffff",
    backColor: "rgba(255,255,255,0.4)",
    cardHeight: "340px",
  },
  {
    id: "premium",
    name: "Plano Premium",
    eyebrow: "Premium",
    description:
      "A solução completa para barbearias com múltiplos profissionais e alto volume.",
    price: "R$ 99",
    features: [
      "Tudo do Pro",
      "Múltiplos barbeiros",
      "Personalização completa",
      "Suporte 24/7",
      "Acesso antecipado a novidades",
      "Relatórios avançados",
    ],
    image: "/celular1.png",
    rootBg: "#f0f5ea",
    cardBg: "#ffffff",
    overlayGradient:
      "linear-gradient(to top, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.55) 55%, transparent 100%)",
    textColor: "#111111",
    badgeBg: "rgba(88,196,17,0.12)",
    badgeColor: "#3a8a0a",
    accentColor: "#58C411",
    ctaBg: "#58C411",
    ctaColor: "#ffffff",
    arrowBg: "rgba(88,196,17,0.12)",
    arrowColor: "#58C411",
    checkBg: "rgba(88,196,17,0.12)",
    checkColor: "#3a8a0a",
    backColor: "rgba(0,0,0,0.35)",
  },
]

const Planos = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [selected, setSelected] = useState<Plan | null>(null)

  useEffect(() => {
    if (status === "loading") return
    if (session?.user?.role !== "BARBER") {
      router.push("/")
    }
  }, [session, status, router])

  return (
    <motion.div
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-12"
      animate={{ backgroundColor: selected ? selected.rootBg : "#0a0a0a" }}
      transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Back to home */}
      <AnimatePresence>
        {!selected && (
          <motion.button
            onClick={() => router.push("/")}
            className="absolute top-5 left-5 z-50 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white/50 transition hover:text-white"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.25 }}
          >
            ← Início
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">

        {/* ── CARDS VIEW ── */}
        {!selected && (
          <motion.div
            key="cards"
            className="flex w-full max-w-2xl flex-col items-center gap-10"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Header */}
            <div className="mb-6">
              <p className="mb-2 text-xs font-medium uppercase tracking-widest text-[#C3F32C]">
                Mais Popular
              </p>
              <h1 className="text-3xl font-semibold text-white">
                Escolha o plano ideal
              </h1>
              <p className="mt-2 text-sm text-white/40">
                Sem fidelidade. Cancele quando quiser.
              </p>
            </div>

            {/* Cards */}
            <div className="flex w-full items-stretch gap-3 sm:gap-4">
              {plans.map((plan, i) => (
                <motion.div
                  key={plan.id}
                  onClick={() => setSelected(plan)}
                  className="relative flex flex-1 cursor-pointer flex-col justify-end overflow-hidden rounded-2xl"
                  style={{
                    minHeight: plan.cardHeight ?? "300px",
                    outline: "1.5px solid rgba(255,255,255,0.07)",
                  }}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: i * 0.08,
                    duration: 0.45,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  whileHover={{
                    y: -8,
                    scale: 1.025,
                    boxShadow: "0 24px 56px rgba(0,0,0,0.55)",
                    outline: "1.5px solid rgba(255,255,255,0.18)",
                  }}
                  whileTap={{ scale: 0.975 }}
                >
                  {/* Background image */}
                  <motion.div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${plan.image}')` }}
                    whileHover={{ scale: 1.04 }}
                    transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                  />

                  {/* Overlay */}
                  <div
                    className="absolute inset-0"
                    style={{ background: plan.overlayGradient }}
                  />

                  {/* Arrow */}
                  <div
                    className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full text-sm transition"
                    style={{
                      background: plan.arrowBg,
                      color: plan.arrowColor,
                    }}
                  >
                    ↗
                  </div>

                  {/* Content */}
                  <div className="relative z-10 p-5" style={{ color: plan.textColor }}>
                    <span
                      className="mb-2 inline-block rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider"
                      style={{
                        background: plan.badgeBg,
                        color: plan.badgeColor,
                      }}
                    >
                      {plan.eyebrow}
                    </span>
                    <h2 className="text-lg font-semibold leading-tight">
                      {plan.name}
                    </h2>
                    <p className="mb-3 mt-1 text-xs opacity-55">
                      {plan.description.split(".")[0]}.
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-semibold">{plan.price}</span>
                      <span className="text-xs opacity-45">/mês</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── DETAIL VIEW ── */}
        {selected && (
          <motion.div
            key={`detail-${selected.id}`}
            className="flex w-full max-w-sm flex-col"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -28 }}
            transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Back button */}
            <motion.button
              onClick={() => setSelected(null)}
              className="mb-5 flex items-center gap-1.5 self-start bg-transparent border-none p-0 text-sm font-medium transition cursor-pointer"
              style={{ color: selected.backColor, fontFamily: "inherit" }}
              whileHover={{ color: selected.textColor }}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              ← Voltar aos planos
            </motion.button>

            {/* Detail card */}
            <motion.div
              className="w-full overflow-hidden rounded-2xl"
              style={{ background: selected.cardBg }}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.08, duration: 0.4 }}
            >
              {/* Image */}
              <div className="relative h-52 w-full overflow-hidden">
                <img
                  src={selected.image}
                  alt={selected.name}
                  className="h-full w-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: selected.overlayGradient }}
                />
              </div>

              {/* Body */}
              <div className="flex flex-col gap-0 p-7">
                <motion.p
                  className="mb-1 text-[10px] font-medium uppercase tracking-widest"
                  style={{ color: selected.accentColor }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  {selected.eyebrow}
                </motion.p>

                <motion.h1
                  className="text-3xl font-semibold leading-tight"
                  style={{ color: selected.textColor }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 }}
                >
                  {selected.name}
                </motion.h1>

                <motion.p
                  className="mt-2 mb-5 text-sm leading-relaxed opacity-55"
                  style={{ color: selected.textColor }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22 }}
                >
                  {selected.description}
                </motion.p>

                <motion.div
                  className="mb-6 flex items-baseline gap-1.5"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.27 }}
                >
                  <span
                    className="text-4xl font-semibold"
                    style={{ color: selected.textColor }}
                  >
                    {selected.price}
                  </span>
                  <span
                    className="text-sm opacity-40"
                    style={{ color: selected.textColor }}
                  >
                    /mês
                  </span>
                </motion.div>

                {/* Features */}
                <motion.ul
                  className="mb-7 flex flex-col gap-2.5"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: {
                      transition: { staggerChildren: 0.06, delayChildren: 0.32 },
                    },
                  }}
                >
                  {selected.features.map((f) => (
                    <motion.li
                      key={f}
                      className="flex items-center gap-3 text-sm font-medium"
                      style={{ color: selected.textColor }}
                      variants={{
                        hidden: { opacity: 0, x: -10 },
                        visible: { opacity: 1, x: 0 },
                      }}
                    >
                      <span
                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold"
                        style={{
                          background: selected.checkBg,
                          color: selected.checkColor,
                        }}
                      >
                        ✓
                      </span>
                      {f}
                    </motion.li>
                  ))}
                </motion.ul>

                {/* CTA */}
                <motion.button
                  className="w-full rounded-xl py-4 text-sm font-semibold tracking-wide transition"
                  style={{
                    background: selected.ctaBg,
                    color: selected.ctaColor,
                    fontFamily: "inherit",
                    border: "none",
                    cursor: "pointer",
                  }}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ opacity: 0.88, scale: 0.998 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Assinar agora
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>
    </motion.div>
  )
}

export default Planos