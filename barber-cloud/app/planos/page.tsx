"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

type Plan = {
  id: string
  name: string
  description: string
  color: string
  textColor: string
  price: string
  features: string[]
  image: string
  // ↓ Direção do degradê: "to top" (baixo→cima) ou "to bottom" (cima→baixo)
  gradientDirection: "to top" | "to bottom"
  // ↓ Cor do TOPO do degradê — ex: "#000000", "transparent"
  gradientTop: string
  // ↓ Cor do RODAPÉ do degradê — ex: "#a3e635", "transparent"
  gradientBottom: string
  // ↓ Cor de fundo do card (aparece atrás da imagem)
  backgroundColor: string
}

const plans: Plan[] = [
  {
    id: "basic",
    name: "Plano Básico",
    description: "Ideal para quem está começando.",
    color: "#a3e635",
    textColor: "black",
    price: "R$ 29/mês",
    features: [
      "Agendamentos ilimitados",
      "Perfil na plataforma",
      "Suporte por e-mail",
    ],
    image: "/maquina2.png",
    gradientDirection: "to top",
    gradientTop: "#77BE11",
    gradientBottom: "transparent",
    backgroundColor: "transparent",
  },
  {
    id: "pro",
    name: "Plano Pro",
    description: "Recursos avançados para profissionais.",
    color: "#000000",
    textColor: "white",
    price: "R$ 59/mês",
    features: [
      "Tudo do Básico",
      "Relatórios de desempenho",
      "Integração com redes sociais",
      "Suporte prioritário",
    ],
    image: "/bannerPro.png",
    gradientDirection: "to top",
    gradientTop: "#000000",
    gradientBottom: "transparent",
    backgroundColor: "#000000",
  },
  {
    id: "premium",
    name: "Plano Premium",
    description: "Todos os recursos disponíveis.",
    color: "#ffffff",
    textColor: "#58C411",
    price: "R$ 99/mês",
    features: [
      "Tudo do Pro",
      "Múltiplos barbeiros",
      "Personalização completa",
      "Suporte 24/7",
      "Acesso antecipado a novidades",
    ],
    image: "/mobile2.png",
    gradientDirection: "to top",
    gradientTop: "transparent",
    gradientBottom: "transparent",
    backgroundColor: "#ffffff",
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
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10"
      animate={{ backgroundColor: selected ? selected.color : "#000000" }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <AnimatePresence mode="wait">

        {/* VIEW: Cards */}
        {!selected && (
          <motion.div
            key="cards"
            // mobile: coluna única / tablet: 3 colunas
            className="flex w-full max-w-3xl flex-col items-center gap-4 sm:flex-row sm:items-stretch sm:justify-center sm:gap-6"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {plans.map((plan) => (
              <motion.div
                key={plan.id}
                onClick={() => setSelected(plan)}
                // mobile: largura quase cheia / sm+: largura fixa
                className="relative flex h-72 w-full cursor-pointer flex-col overflow-hidden rounded-xl sm:h-80 sm:w-64"
                style={{
                  color: plan.textColor,
                  backgroundColor: plan.backgroundColor,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
                }}
                whileHover={{
                  scale: 1.03,
                  y: -6,
                  boxShadow: "0 20px 48px rgba(0,0,0,0.38)",
                }}
                whileTap={{ scale: 0.98 }}
                transition={{
                  duration: 0.45,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
              >
                {/* Imagem de fundo */}
                <div className="absolute inset-0">
                  <img
                    src={plan.image}
                    alt={plan.name}
                    className="h-full w-full object-cover"
                  />
                  {/* Degradê — edite gradientTop, gradientBottom e gradientDirection no objeto do plano */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(${plan.gradientDirection}, ${plan.gradientTop} 0%, ${plan.gradientBottom} 100%)`,
                    }}
                  />
                </div>

                {/* Conteúdo sobre a imagem */}
                <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-1 p-5">
                  <h2 className="text-xl font-bold leading-tight">{plan.name}</h2>
                  <p className="mb-2 text-sm opacity-70">{plan.description}</p>
                  <button
                    className="rounded-lg bg-black/20 py-2 text-sm font-semibold backdrop-blur-sm transition hover:bg-black/35"
                    style={{ color: plan.textColor }}
                  >
                    Assinar
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* VIEW: Detalhe do plano */}
        {selected && (
          <motion.div
            key={`detail-${selected.id}`}
            className="flex w-full max-w-sm flex-col items-center px-4 text-center"
            style={{ color: selected.textColor }}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <motion.h1
              className="text-4xl font-extrabold sm:text-5xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
            >
              {selected.name}
            </motion.h1>

            <motion.p
              className="mt-3 text-base opacity-70 sm:text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.4 }}
            >
              {selected.description}
            </motion.p>

            <motion.p
              className="mt-6 text-3xl font-bold sm:text-4xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              {selected.price}
            </motion.p>

            <motion.ul
              className="mt-8 flex w-full flex-col gap-3"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.07, delayChildren: 0.35 },
                },
              }}
            >
              {selected.features.map((feature) => (
                <motion.li
                  key={feature}
                  className="flex items-center gap-2 rounded-lg bg-black/10 px-5 py-3 text-sm font-medium"
                  variants={{
                    hidden: { opacity: 0, y: 14 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <span className="text-base">✓</span>
                  {feature}
                </motion.li>
              ))}
            </motion.ul>

            <motion.div
              className="mt-10 flex w-full flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <button
                onClick={() => setSelected(null)}
                className="w-full rounded-lg bg-black/15 px-6 py-3 text-sm font-semibold transition hover:bg-black/25 sm:w-auto"
                style={{ color: selected.textColor }}
              >
                ← Voltar
              </button>
              <button
                className="w-full rounded-lg bg-black/30 px-8 py-3 text-sm font-bold transition hover:bg-black/40 sm:w-auto"
                style={{ color: selected.textColor }}
              >
                Assinar agora
              </button>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>
    </motion.div>
  )
}

export default Planos