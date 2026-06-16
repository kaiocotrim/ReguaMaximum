"use client"

import { motion } from "framer-motion"
import { MapPin, Scissors, Star, Share2, Phone, Clock, Sparkles } from "lucide-react"

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.08, ease: "easeOut" },
  }),
}

const fadeIn = {
  hidden: { opacity: 0 },
  show: (i: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.4, delay: i * 0.08 },
  }),
}

const quickTags = [
  { icon: <Scissors size={14} />, label: "Degradê" },
  { icon: <Scissors size={14} />, label: "Barba" },
  { icon: <Sparkles size={14} />, label: "Acabamento" },
  { icon: <Sparkles size={14} />, label: "Luzes" },
  { icon: <Star size={14} />, label: "Navalhado" },
]

const works = [
  {
    emoji: "✂️",
    title: "Degradê Perfeito",
    subtitle: "Corte moderno e preciso",
    tags: ["Tesoura", "Máquina"],
    bgColor: "bg-zinc-900",
    accentColor: "text-[#C3F32C]",
  },
  {
    emoji: "🪒",
    title: "Barba Modelada",
    subtitle: "Contorno e hidratação",
    tags: ["Navalha", "Toalha quente"],
    bgColor: "bg-[#0d1a00]",
    accentColor: "text-[#C3F32C]",
  },
  {
    emoji: "💈",
    title: "Corte + Barba",
    subtitle: "Combo completo",
    tags: ["Combo", "Premium"],
    bgColor: "bg-zinc-900",
    accentColor: "text-[#C3F32C]",
  },
]

const services = [
  "Degradê", "Barba", "Acabamento", "Sobrancelha",
  "Luzes", "Progressiva", "Social Clássico", "Afro Style",
  "Navalhado", "Hidratação",
]

const reviews = [
  {
    initials: "CM",
    name: "Carlos M.",
    role: "Cliente fiel · BarberCloud",
    text: '"Melhor barbearia da região! O Davi tem mão de artista, saí com o visual exatamente como queria."',
    rating: 5,
    bg: "bg-zinc-800",
    color: "text-[#C3F32C]",
  },
  {
    initials: "RS",
    name: "Rafael S.",
    role: "Cliente · BarberCloud",
    text: '"Atendimento impecável, ambiente top e corte perfeito. Com certeza voltarei sempre."',
    rating: 5,
    bg: "bg-[#0d1a00]",
    color: "text-[#C3F32C]",
  },
]

export default function BarberPortfolio() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
      <div className="space-y-6 px-5 py-7 max-w-lg mx-auto">

        {/* Data */}
        <motion.p
          className="text-xs text-zinc-500"
          variants={fadeIn}
          initial="hidden"
          animate="show"
          custom={0}
        >
          terça-feira, 16 de junho
        </motion.p>

        {/* Hero */}
        <motion.div
          className="flex items-start justify-between"
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0}
        >
          <div className="space-y-1">
            <h2 className="text-xl font-bold leading-snug">
              Olá,{" "}
              <span
                className="bg-gradient-to-r from-white via-[#C3F32C] to-white bg-[length:200%_auto] bg-clip-text text-transparent animate-[shine_3s_linear_infinite]"
                style={{
                  backgroundImage: "linear-gradient(90deg, #fff 0%, #C3F32C 50%, #fff 100%)",
                  backgroundSize: "200% auto",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                aqui é Davi Costa.
              </span>
            </h2>
            <p className="text-sm text-zinc-400">Master Barber · 8 anos de experiência</p>
          </div>

          {/* Avatar */}
          <div className="w-11 h-11 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center text-sm font-bold text-[#C3F32C] flex-shrink-0">
            DC
          </div>
        </motion.div>

        {/* Badges */}
        <motion.div
          className="flex flex-wrap gap-2"
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1}
        >
          <span className="text-xs font-bold bg-[#C3F32C] text-[#1a2e00] px-3 py-1 rounded-full">
            Disponível para agendamentos
          </span>
          <span className="text-xs text-zinc-400 border border-zinc-700 px-3 py-1 rounded-full flex items-center gap-1">
            <MapPin size={11} /> Pinheiros, SP
          </span>
          <span className="text-xs text-zinc-400 border border-zinc-700 px-3 py-1 rounded-full flex items-center gap-1">
            <Clock size={11} /> 8 anos exp.
          </span>
        </motion.div>

        {/* Quick tags */}
        <motion.div
          className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden"
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={2}
        >
          {quickTags.map(({ icon, label }) => (
            <motion.button
              key={label}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs px-3 py-2 rounded-full whitespace-nowrap hover:border-[#C3F32C]/50 hover:text-[#C3F32C] transition-colors"
            >
              {icon}
              {label}
            </motion.button>
          ))}
        </motion.div>

        {/* Bio card */}
        <motion.div
          className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4"
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={3}
        >
          <p className="text-sm text-zinc-400 leading-relaxed">
            Especialista em degradês, barbas modeladas e tratamentos capilares. Cada corte é feito com{" "}
            <span className="text-[#C3F32C] font-semibold">precisão e estilo único</span>, porque seu visual merece{" "}
            <span className="text-[#C3F32C] font-semibold">atenção de verdade</span>.{" "}
            Apaixonado por técnicas modernas e o clássico que nunca sai de moda.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-3 gap-3"
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={4}
        >
          {[
            { value: "1.2k+", label: "clientes atendidos" },
            { value: "8 anos", label: "de experiência" },
            { value: "4.9", label: "avaliação média" },
          ].map(({ value, label }) => (
            <div
              key={label}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col items-center justify-center gap-0.5"
            >
              <span className="text-xl font-bold">{value}</span>
              <span className="text-[10px] text-zinc-500 text-center leading-tight">{label}</span>
            </div>
          ))}
        </motion.div>

        {/* Trabalhos em destaque */}
        <div className="space-y-3">
          <motion.h2
            className="text-[10px] font-bold uppercase tracking-widest text-zinc-500"
            variants={fadeIn}
            initial="hidden"
            animate="show"
            custom={5}
          >
            Trabalhos em destaque
          </motion.h2>

          <motion.div
            className="grid grid-cols-2 gap-3"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={6}
          >
            {works.map((work, i) => (
              <motion.div
                key={work.title}
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={6 + i * 0.5}
                whileHover={{ y: -3, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className={`${work.bgColor} border border-zinc-800 rounded-2xl overflow-hidden cursor-pointer`}
              >
                <div className="h-24 flex items-center justify-center text-4xl border-b border-zinc-800">
                  {work.emoji}
                </div>
                <div className="p-3 space-y-1.5">
                  <p className="text-sm font-semibold leading-tight">{work.title}</p>
                  <p className="text-xs text-zinc-500">{work.subtitle}</p>
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {work.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] bg-zinc-800 border border-zinc-700 text-zinc-400 px-2 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Ver todos */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={7.5}
              whileHover={{ scale: 1.02 }}
              className="border border-dashed border-zinc-700 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer min-h-[140px] hover:border-[#C3F32C]/40 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500">
                +
              </div>
              <span className="text-xs text-zinc-500">Ver galeria</span>
            </motion.div>
          </motion.div>
        </div>

        {/* Serviços */}
        <div className="space-y-3">
          <motion.h2
            className="text-[10px] font-bold uppercase tracking-widest text-zinc-500"
            variants={fadeIn}
            initial="hidden"
            animate="show"
            custom={8}
          >
            Serviços
          </motion.h2>

          <motion.div
            className="flex flex-wrap gap-2"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={9}
          >
            {services.map((service) => (
              <span
                key={service}
                className="text-xs bg-zinc-900 border border-zinc-800 text-zinc-400 px-3 py-1.5 rounded-full hover:border-[#C3F32C]/40 hover:text-zinc-300 transition-colors cursor-pointer"
              >
                {service}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Divider */}
        <div className="h-px bg-zinc-800" />

        {/* Depoimentos */}
        <div className="space-y-3">
          <motion.h2
            className="text-[10px] font-bold uppercase tracking-widest text-zinc-500"
            variants={fadeIn}
            initial="hidden"
            animate="show"
            custom={10}
          >
            Depoimentos
          </motion.h2>

          <div className="space-y-3">
            {reviews.map((review, i) => (
              <motion.div
                key={review.name}
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={10 + i * 0.5}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${review.bg} border border-zinc-700 flex items-center justify-center text-xs font-bold ${review.color}`}>
                      {review.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{review.name}</p>
                      <p className="text-[10px] text-zinc-500">{review.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: review.rating }).map((_, s) => (
                      <Star key={s} size={11} className="text-[#C3F32C]" fill="#C3F32C" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">{review.text}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-zinc-800" />

        {/* CTA final */}
        <motion.div
          className="flex gap-3"
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={12}
        >
          <button className="flex-1 bg-[#C3F32C] text-[#1a2e00] font-bold py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform">
            <Clock size={16} /> Agendar agora
          </button>
          <button className="bg-zinc-900 border border-zinc-800 text-zinc-300 py-3.5 px-4 rounded-2xl flex items-center gap-2 hover:border-zinc-600 transition-colors">
            <Share2 size={18} />
          </button>
          <button className="bg-zinc-900 border border-zinc-800 text-zinc-300 py-3.5 px-4 rounded-2xl flex items-center gap-2 hover:border-zinc-600 transition-colors">
            <Phone size={18} />
          </button>
        </motion.div>

      </div>
    </div>
  )
}