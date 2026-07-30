"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle } from "lucide-react"

export type Plan = {
  id: string
  name: string
  eyebrow: string
  description: string
  price: string
  features: string[]
  image: string
  cardHeight?: string
  visual: {
    pageBg: string
    accentText: string
    softAccent: string
    cta: string
    coverOverlay: string
    coverText: string
    coverBadge: string
    coverArrow: string
  }
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
    visual: {
      pageBg: "bg-[#f3f7ec] dark:bg-[#0d1500]",
      accentText: "text-[#567500] dark:text-[#C3F32C]",
      softAccent:
        "bg-[#C3F32C]/25 text-[#254F50] dark:bg-[#C3F32C]/15 dark:text-[#C3F32C]",
      cta:
        "bg-[#C3F32C] text-[#254F50] hover:bg-[#b8e82a] dark:text-[#111111]",
      coverOverlay:
        "bg-gradient-to-t from-[#0a1402]/95 via-[#0a1402]/50 to-transparent",
      coverText: "text-white",
      coverBadge: "bg-[#C3F32C]/15 text-[#C3F32C]",
      coverArrow: "bg-[#C3F32C]/15 text-[#C3F32C]",
    },
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
    cardHeight: "340px",
    visual: {
      pageBg: "bg-[#f1f4f2] dark:bg-[#111111]",
      accentText: "text-[#254F50] dark:text-white",
      softAccent:
        "bg-[#254F50]/10 text-[#254F50] dark:bg-white/10 dark:text-white",
      cta:
        "bg-[#254F50] text-white hover:bg-[#1f4546] dark:bg-white dark:text-[#111111] dark:hover:bg-white/90",
      coverOverlay:
        "bg-gradient-to-t from-black/95 via-black/50 to-transparent",
      coverText: "text-white",
      coverBadge: "bg-white/10 text-white",
      coverArrow: "bg-white/10 text-white",
    },
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
    visual: {
      pageBg: "bg-[#f0f5ea] dark:bg-[#10150d]",
      accentText: "text-[#567500] dark:text-[#C3F32C]",
      softAccent:
        "bg-[#C3F32C]/25 text-[#254F50] dark:bg-[#C3F32C]/15 dark:text-[#C3F32C]",
      cta:
        "bg-[#C3F32C] text-[#254F50] hover:bg-[#b8e82a] dark:text-[#111111]",
      coverOverlay:
        "bg-gradient-to-t from-white/95 via-white/55 to-transparent dark:from-[#0d120a]/95 dark:via-[#0d120a]/55",
      coverText: "text-[#111111] dark:text-white",
      coverBadge:
        "bg-[#58C411]/12 text-[#315f0c] dark:bg-[#C3F32C]/15 dark:text-[#C3F32C]",
      coverArrow:
        "bg-[#58C411]/12 text-[#315f0c] dark:bg-[#C3F32C]/15 dark:text-[#C3F32C]",
    },
  },
]

const PLAN_RELEASE_WHATSAPP = "5511932075075"

const getPlanReleaseUrl = (plan: Plan) => {
  const message = [
    "Olá! Tenho interesse em assinar um plano da Régua Máxima.",
    "",
    `Plano escolhido: ${plan.name}`,
    `Valor: ${plan.price}/mês`,
    "",
    "Gostaria de falar com o setor de liberação para concluir a assinatura e receber minha chave de acesso.",
  ].join("\n")

  return `https://wa.me/${PLAN_RELEASE_WHATSAPP}?text=${encodeURIComponent(message)}`
}

const Planos = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [selected, setSelected] = useState<Plan | null>(null)

  useEffect(() => {
    if (status === "loading") return
    if (session?.user?.role !== "BARBER") {
      router.push("/inicio")
    }
  }, [session, status, router])

  return (
    <motion.div
      className={`relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-12 text-foreground transition-colors duration-700 ${
        selected ? selected.visual.pageBg : "bg-background"
      }`}
    >
      {/* Back to home */}
      <AnimatePresence>
        {!selected && (
          <motion.button
            onClick={() => router.push("/inicio")}
            className="absolute top-5 left-5 z-50 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
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
              <p className="mb-2 text-xs font-medium uppercase tracking-widest text-[#567500] dark:text-[#C3F32C]">
                Mais Popular
              </p>
              <h1 className="text-3xl font-semibold text-foreground">
                Escolha o plano ideal
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Sem fidelidade. Cancele quando quiser.
              </p>
            </div>

            {/* Cards */}
            <div className="flex w-full items-stretch gap-3 sm:gap-4">
              {plans.map((plan, i) => (
                <motion.div
                  key={plan.id}
                  onClick={() => setSelected(plan)}
                  className="relative flex flex-1 cursor-pointer flex-col justify-end overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition-[border-color,box-shadow] hover:border-[#254F50]/25 hover:shadow-[0_24px_56px_rgba(37,79,80,0.16)] dark:hover:border-white/20 dark:hover:shadow-[0_24px_56px_rgba(0,0,0,0.55)]"
                  style={{
                    minHeight: plan.cardHeight ?? "300px",
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
                  <div className={`absolute inset-0 ${plan.visual.coverOverlay}`} />

                  {/* Arrow */}
                  <div
                    className={`absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full text-sm transition ${plan.visual.coverArrow}`}
                  >
                    ↗
                  </div>

                  {/* Content */}
                  <div
                    className={`relative z-10 p-5 ${plan.visual.coverText}`}
                  >
                    <span
                      className={`mb-2 inline-block rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider ${plan.visual.coverBadge}`}
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
              className="mb-5 flex cursor-pointer items-center gap-1.5 self-start border-none bg-transparent p-0 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              ← Voltar aos planos
            </motion.button>

            {/* Detail card */}
            <motion.div
              className="w-full overflow-hidden rounded-2xl border border-border/70 bg-card text-card-foreground shadow-[0_24px_70px_rgba(37,79,80,0.12)] dark:shadow-[0_24px_70px_rgba(0,0,0,0.4)]"
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
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/55 to-transparent" />
              </div>

              {/* Body */}
              <div className="flex flex-col gap-0 p-7">
                <motion.p
                  className={`mb-1 text-[10px] font-medium uppercase tracking-widest ${selected.visual.accentText}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  {selected.eyebrow}
                </motion.p>

                <motion.h1
                  className="text-3xl font-semibold leading-tight text-card-foreground"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 }}
                >
                  {selected.name}
                </motion.h1>

                <motion.p
                  className="mb-5 mt-2 text-sm leading-relaxed text-muted-foreground"
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
                  <span className="text-4xl font-semibold text-card-foreground">
                    {selected.price}
                  </span>
                  <span className="text-sm text-muted-foreground">
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
                      className="flex items-center gap-3 text-sm font-medium text-card-foreground"
                      variants={{
                        hidden: { opacity: 0, x: -10 },
                        visible: { opacity: 1, x: 0 },
                      }}
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${selected.visual.softAccent}`}
                      >
                        ✓
                      </span>
                      {f}
                    </motion.li>
                  ))}
                </motion.ul>

                {/* CTA */}
                <motion.a
                  href={getPlanReleaseUrl(selected)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Assinar ${selected.name} pelo WhatsApp`}
                  className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-none py-4 text-sm font-semibold tracking-wide transition-colors ${selected.visual.cta}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 0.998 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  Assinar pelo WhatsApp
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>
    </motion.div>
  )
}

export default Planos
