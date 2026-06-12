"use client"

import { Button } from "@/app/_components/ui/button"
import { ChevronRight } from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../_components/ui/accordion"
import { motion, AnimatePresence } from "framer-motion"

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
}

const Perfil = () => {
  const [erro, setErro] = useState("")
  const [nome, setNome] = useState("")
  const [mostrarPergunta, setmostrarPergunta] = useState(false)
  const [tipoPerfil, setTipoPerfil] = useState("")

  const handleProsseguir = () => {
    if (!nome.trim()) {
      setErro("Digite seu nome para continuar")
      return
    }
    setmostrarPergunta(true)
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-[#121212] p-6 md:p-10">
      <div className="w-full max-w-md space-y-8">
        {/* Cabeçalho */}
        <motion.div
          className="space-y-4 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#C3F32C] shadow-sm">
            <Image
              src="/logoPretoBrancoFundoOFF.png"
              alt="Logo"
              width={48}
              height={48}
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#C3F32C]">
              Crie seu perfil
            </h1>
            <p className="mt-2 text-sm text-white">
              Vamos conhecer você para personalizar sua experiência.
            </p>
          </div>
        </motion.div>

        {/* Campo Nome */}
        <AnimatePresence>
          {!mostrarPergunta && (
            <motion.div
              className="space-y-5"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
            >
              <input
                id="nome"
                type="text"
                placeholder="Digite seu nome"
                className="h-12 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 text-white transition outline-none focus:border-white"
                value={nome}
                onChange={(e) => {
                  setNome(e.target.value)
                  setErro("")
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Erro */}
        <AnimatePresence>
          {erro && (
            <motion.p
              className="text-sm text-red-500"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              {erro}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Cards */}
        <AnimatePresence>
          {mostrarPergunta && (
            <motion.div
              className="mt-6 grid grid-cols-2 gap-3 md:gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Card Cliente */}
              <motion.div
                variants={cardVariants}
                onClick={() => setTipoPerfil("cliente")}
                className={`flex cursor-pointer flex-col items-center rounded-2xl border p-3 text-center transition-all duration-300 hover:border-[#C3F32C] hover:bg-[#C3F32C]/10 md:p-6 ${
                  tipoPerfil === "cliente"
                    ? "z-10 scale-105 border-[#C3F32C] bg-[#C3F32C]/10 shadow-lg shadow-[#C3F32C]/20"
                    : tipoPerfil === "barbeiro"
                      ? "scale-95 border-zinc-700 bg-transparent opacity-40 blur-[2px]"
                      : "border-zinc-700 bg-transparent"
                }`}
              >
                <p className="text-xs font-semibold text-white md:text-lg">
                  Você é o cliente, <span className="shine-text">{nome}?</span>
                </p>
                <div className="mt-3">
                  <Image
                    src="/Cliente12.png"
                    alt="Cliente"
                    width={180}
                    height={180}
                    className="h-[90px] w-[90px] object-contain md:h-[180px] md:w-[180px]"
                  />
                </div>
                <div
                  className="mt-3 w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Accordion type="single" collapsible defaultValue="">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="text-xs text-zinc-400 md:text-sm">
                        Como funciona?
                      </AccordionTrigger>
                      <AccordionContent className="text-left text-xs text-zinc-400 md:text-sm">
                        Como cliente, você pode encontrar barbearias, agendar
                        horários e acompanhar seus cortes de forma rápida e
                        prática.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </motion.div>

              {/* Card Barbeiro */}
              <motion.div
                variants={cardVariants}
                onClick={() => setTipoPerfil("barbeiro")}
                className={`flex cursor-pointer flex-col items-center rounded-2xl border p-3 text-center transition-all duration-300 hover:border-[#C3F32C] hover:bg-[#C3F32C]/10 md:p-6 ${
                  tipoPerfil === "barbeiro"
                    ? "z-10 scale-105 border-[#C3F32C] bg-[#C3F32C]/10 shadow-lg shadow-[#C3F32C]/20"
                    : tipoPerfil === "cliente"
                      ? "scale-95 border-zinc-700 bg-transparent opacity-40 blur-[2px]"
                      : "border-zinc-700 bg-transparent"
                }`}
              >
                <p className="text-xs font-semibold text-white md:text-lg">
                  Você é o barbeiro, <span className="shine-text">{nome}?</span>
                </p>
                <div className="mt-3">
                  <Image
                    src="/dono2.png"
                    alt="Barbeiro"
                    width={180}
                    height={180}
                    className="h-[90px] w-[90px] object-contain md:h-[180px] md:w-[180px]"
                  />
                </div>
                <div
                  className="mt-3 w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Accordion type="single" collapsible defaultValue="">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="text-xs text-zinc-400 md:text-sm">
                        Como funciona?
                      </AccordionTrigger>
                      <AccordionContent className="text-left text-xs text-zinc-400 md:text-sm">
                        Como barbeiro, você pode gerenciar seus agendamentos,
                        clientes e horários, além de aumentar sua visibilidade
                        na plataforma.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Botões */}
        <div className="flex items-center justify-between">
          <AnimatePresence mode="popLayout">
            {mostrarPergunta && (
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <Button
                  onClick={() => {
                    setmostrarPergunta(false)
                    setTipoPerfil("")
                  }}
                  className="flex cursor-pointer items-center gap-2 bg-transparent p-4 whitespace-nowrap text-white hover:bg-transparent hover:text-[#254F50]"
                >
                  <ChevronRight className="h-4 w-4 rotate-180" />
                  Voltar
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="popLayout">
            {!mostrarPergunta ? (
              <motion.div
                key="prosseguir-inicio"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <Button
                  onClick={handleProsseguir}
                  className="flex cursor-pointer items-center gap-2 bg-transparent p-4 whitespace-nowrap text-white hover:bg-transparent hover:text-[#254F50]"
                >
                  Prosseguir
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </motion.div>
            ) : (
              <motion.div
                transition={{ duration: 0.4, ease: "easeOut" }}
                exit={{ opacity: 0, x: 40 }}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Button
                  onClick={handleProsseguir}
                  className="flex cursor-pointer items-center gap-2 bg-transparent p-4 whitespace-nowrap text-white hover:bg-transparent hover:text-[#C3F32C]"
                >
                  Prosseguir
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default Perfil