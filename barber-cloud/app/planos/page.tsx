"use client"


import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  type Variants,
} from "framer-motion"
import { Check, Minus, MoveLeft } from "lucide-react"

type Feature = {
  label: string
  included: boolean
}

type Plan = {
  name: string
  description: string
  price: number
  highlighted?: boolean
  badge?: string
  features: Feature[]
  cta: string
  ctaVariant: "outline" | "solid"
}

const plans: Plan[] = [
  {
    name: "STARTER",
    description:
      "Ideal para quem está começando e quer sair do caderninho de vez.",
    price: 89,
    features: [
      { label: "Agendamento online ilimitado", included: true },
      { label: "Até 1 barbeiro cadastrado", included: true },
      { label: "Lembretes via WhatsApp", included: true },
      { label: "Relatórios básicos mensais", included: true },
      { label: "Comissões por barbeiro", included: false },
      { label: "Suporte prioritário", included: false },
    ],
    cta: "COMEÇAR GRÁTIS",
    ctaVariant: "outline",
  },
  {
    name: "PRO",
    description:
      "Para barbearias que crescem rápido e precisam de controle total.",
    price: 189,
    highlighted: true,
    badge: "+ MAIS POPULAR",
    features: [
      { label: "Agendamento online ilimitado", included: true },
      { label: "Até 5 barbeiros cadastrados", included: true },
      { label: "Lembretes via WhatsApp + push", included: true },
      { label: "Relatórios avançados em tempo real", included: true },
      { label: "Comissões por barbeiro automáticas", included: true },
      { label: "Múltiplas unidades", included: false },
    ],
    cta: "→ ASSINAR PRO",
    ctaVariant: "solid",
  },
  {
    name: "PREMIUM",
    description:
      "Para redes de barbearias que precisam de escala e controle centralizado.",
    price: 349,
    features: [
      { label: "Tudo do plano Pro", included: true },
      { label: "Barbeiros ilimitados", included: true },
      { label: "Múltiplas unidades (rede)", included: true },
      { label: "Dashboard centralizado", included: true },
      { label: "API e integrações personalizadas", included: true },
      { label: "Suporte prioritário 24/7", included: true },
    ],
    cta: "FALAR COM VENDAS",
    ctaVariant: "outline",
  },
]

// ---------------------------------------------------------------------------
// Botão de voltar — desliza a seta para a esquerda no hover, como se fosse
// puxada por um fio. Entra com leve atraso depois do resto do header.
// ---------------------------------------------------------------------------
const BackButton = () => {
  const router = useRouter()

  return (
    <motion.button
      type="button"
      onClick={() => router.push("/")}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      whileHover="hover"
      whileTap={{ scale: 0.94 }}
      className="group inline-flex items-center gap-2 text-sm font-medium text-neutral-400 transition-colors hover:text-lime-400 cursor-pointer"
    >
      <motion.span
        variants={{ hover: { x: -4 } }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="flex"
      >
        <MoveLeft size={18} />
      </motion.span>
      Voltar
    </motion.button>
  )
}

// ---------------------------------------------------------------------------
// Nome da marca — entra letra a letra com leve desfoque, depois um traço
// de navalha risca por baixo.
// ---------------------------------------------------------------------------
const BrandReveal = () => {
  const letters = "".split("")

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex">
        {letters.map((letter, i) => (
          <motion.span
            key={`${letter}-${i}`}
            initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: 0.4,
              delay: 1.5 + i * 0.035,
              ease: "easeOut",
            }}
            className="text-sm font-bold tracking-[0.25em] text-neutral-300"
          >
            {letter === " " ? "\u00A0\u00A0" : letter}
          </motion.span>
        ))}
      </div>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{
          duration: 0.6,
          delay: 1.5 + letters.length * 0.035,
          ease: "easeInOut",
        }}
        style={{ originX: 0 }}
        className="h-px w-40 bg-gradient-to-r from-lime-400 via-lime-400/60 to-transparent"
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Título — corte de navalha revela o texto da esquerda pra direita.
// ---------------------------------------------------------------------------
const RazorRevealTitle = () => {
  return (
    <div className="relative inline-block overflow-hidden">
      <motion.h1
        className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl"
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        animate={{ clipPath: "inset(0 0% 0 0)" }}
        transition={{ duration: 0.9, delay: 0.4, ease: [0.65, 0, 0.35, 1] }}
      >
        SIMPLES ASSIM.
      </motion.h1>
      <motion.div
        className="pointer-events-none absolute inset-y-0 left-0 w-1.5 bg-lime-300 shadow-[0_0_16px_4px_rgba(163,230,53,0.7)]"
        initial={{ x: "0%" }}
        animate={{ x: "100vw" }}
        transition={{ duration: 0.9, delay: 0.4, ease: [0.65, 0, 0.35, 1] }}
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Preço — conta de 0 até o valor final, tipo odômetro.
// ---------------------------------------------------------------------------
const AnimatedPrice = ({
  value,
  highlighted,
}: {
  value: number
  highlighted?: boolean
}) => {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => Math.round(v))
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 1.1,
      delay: 0.6,
      ease: "easeOut",
    })
    const unsub = rounded.on("change", (v) => setDisplay(v))
    return () => {
      controls.stop()
      unsub()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <span
      className={`text-5xl leading-none font-extrabold ${
        highlighted ? "text-lime-400" : "text-white"
      }`}
    >
      {display}
    </span>
  )
}

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 70, scale: 0.94, filter: "blur(6px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      delay: 0.15 * i,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
}

const featureVariants: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, delay: 0.9 + i * 0.08 },
  }),
}

const PlanCard = ({ plan, index }: { plan: Plan; index: number }) => {
  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      whileHover={{ y: -10, transition: { duration: 0.25, ease: "easeOut" } }}
      className={`relative flex flex-col rounded-2xl border p-8 ${
        plan.highlighted
          ? "border-lime-400 bg-neutral-950"
          : "border-neutral-800 bg-neutral-950/60 hover:border-neutral-600"
      } transition-colors`}
      style={
        plan.highlighted
          ? { boxShadow: "0 0 40px -12px rgba(163,230,53,0.35)" }
          : undefined
      }
    >
      {plan.highlighted && (
        <motion.div
          className="pointer-events-none absolute -inset-px -z-10 rounded-2xl"
          animate={{
            boxShadow: [
              "0 0 25px -8px rgba(163,230,53,0.4)",
              "0 0 55px -8px rgba(163,230,53,0.85)",
              "0 0 25px -8px rgba(163,230,53,0.4)",
            ],
          }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {plan.badge && (
        <motion.span
          initial={{ scale: 0, rotate: -8 }}
          animate={{ scale: 1, rotate: [-8, 6, -3, 0] }}
          transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
          className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-lime-400 px-3 py-1 text-[11px] font-bold tracking-wide text-black"
        >
          {plan.badge}
        </motion.span>
      )}

      <h3 className="text-lg font-extrabold tracking-wide text-white">
        {plan.name}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-neutral-400">
        {plan.description}
      </p>

      <div className="mt-6 flex items-end gap-1">
        <span
          className={`text-sm font-semibold ${
            plan.highlighted ? "text-lime-400" : "text-neutral-300"
          }`}
        >
          R$
        </span>
        <AnimatedPrice value={plan.price} highlighted={plan.highlighted} />
        <span className="pb-1 text-sm text-neutral-500">/mês</span>
      </div>

      <ul className="mt-8 flex flex-col gap-3">
        {plan.features.map((feature, i) => (
          <motion.li
            key={feature.label}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={featureVariants}
            className={`flex items-start gap-2.5 text-sm ${
              feature.included ? "text-neutral-200" : "text-neutral-600"
            }`}
          >
            {feature.included ? (
              <motion.span
                initial={{ rotate: -45, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.95 + i * 0.08 }}
                className="mt-0.5 shrink-0"
              >
                <Check size={16} strokeWidth={3} className="text-lime-400" />
              </motion.span>
            ) : (
              <Minus
                size={16}
                strokeWidth={3}
                className="mt-0.5 shrink-0 text-neutral-700"
              />
            )}
            <span>{feature.label}</span>
          </motion.li>
        ))}
      </ul>

      <motion.button
        type="button"
        whileHover="hover"
        initial="rest"
        animate="rest"
        whileTap={{ scale: 0.97 }}
        className={`relative mt-8 w-full overflow-hidden rounded-lg py-3 text-sm font-bold tracking-wide ${
          plan.ctaVariant === "solid"
            ? "bg-lime-400 text-black"
            : "border border-neutral-700 text-white"
        }`}
      >
        <motion.span
          variants={{
            rest: { x: "-110%" },
            hover: { x: "110%" },
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className={`pointer-events-none absolute inset-y-0 left-0 w-1/3 ${
            plan.ctaVariant === "solid" ? "bg-black/10" : "bg-lime-400/10"
          }`}
          style={{ skewX: -20 }}
        />
        <span className="relative">{plan.cta}</span>
      </motion.button>
    </motion.div>
  )
}

const Planos = () => {
  return (
    <div className="min-h-screen bg-black px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <BackButton />
      </div>

      <div className="mx-auto mt-10 max-w-5xl text-center">
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xs font-bold tracking-[0.2em] text-lime-400"
        >
          ESCOLHA SEU PLANO
        </motion.span>

        <div className="mt-4 flex justify-center">
          <RazorRevealTitle />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.1 }}
          className="mt-4 text-neutral-400"
        >
          Sem taxa de adesão. Cancele quando quiser.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 1.3 }}
          className="mt-8"
        >
          <BrandReveal />
        </motion.div>
      </div>

      <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-3">
        {plans.map((plan, i) => (
          <PlanCard key={plan.name} plan={plan} index={i} />
        ))}
      </div>
    </div>
  )
}

export default Planos
