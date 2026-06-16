"use client"

// Importações de componentes de UI personalizados e ícones
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

// Importações para animações fluidas na interface
import { motion, AnimatePresence } from "framer-motion"

// Componentes que serão renderizados após a escolha do perfil
import CadastroBarbeiro from "@/app/_components/CadastroBarbeiro"
import CadastroCliente from "@/app/_components/CadastroCliente"

// --- CONFIGURAÇÕES DE ANIMAÇÃO (FRAMER MOTION) ---

// Variante para o container dos cards (controla o atraso em cascata dos filhos)
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15, // Cria o efeito de um card aparecer logo após o outro
    },
  },
}

// Variante para os cards individuais (efeito de surgir de baixo para cima)
const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
}

const Perfil = () => {
  // --- ESTADOS DA APLICAÇÃO ---
  const [erro, setErro] = useState("") // Armazena mensagens de validação
  const [nome, setNome] = useState("") // Armazena o nome digitado pelo usuário
  const [mostrarPergunta, setmostrarPergunta] = useState(false) // Controla a transição entre a tela de nome e a de seleção de perfil
  const [tipoPerfil, setTipoPerfil] = useState("") // Guarda o perfil selecionado ('cliente' ou 'barbeiro')
  const [mostrarCadastroBarbeiro, setMostrarCadastroBarbeiro] = useState(false) // Gatilho para renderizar tela final do Barbeiro
  const [mostrarCadastroCliente, setMostrarCadastroCliente] = useState(false) // Gatilho para renderizar tela final do Cliente

  // --- FUNÇÃO DE FLUXO E VALIDAÇÃO --- Antiga
  // const handleProsseguir = () => {
  //   // Passo 1: Se estiver na tela de digitar o nome
  //   if (!mostrarPergunta) {
  //     if (!nome.trim()) {
  //       setErro("Digite seu nome para continuar")
  //       return
  //     }
  //     setmostrarPergunta(true) // Avança para a próxima etapa (seleção de perfil)
  //     return
  //   }

  //   // Passo 2: Se já estiver na tela de seleção, valida se escolheu uma opção
  //   if (!tipoPerfil) {
  //     setErro("Selecione um perfil")
  //     return
  //   }

  //   // Passo 3: Direciona para o respectivo formulário final baseado na escolha
  //   if (tipoPerfil === "cliente") {
  //     setMostrarCadastroCliente(true)
  //     return
  //   }

  //   if (tipoPerfil === "barbeiro") {
  //     setMostrarCadastroBarbeiro(true)
  //     return
  //   }
  // }

  // --- RENDERIZAÇÕES CONDICIONAIS DE TELAS COMPLETAS ---
  if (mostrarCadastroBarbeiro) {
    return <CadastroBarbeiro nomeInicial={nome} />
  }

  if (mostrarCadastroCliente) {
    return <CadastroCliente nomeInicial={nome} />
  }

  const handleProsseguir = () => {
    setErro("")

    if (!mostrarPergunta) {
      if (!nome.trim()) {
        setErro("Digite seu nome para continuar")
        return
      }

      setmostrarPergunta(true)
      return
    }

    if (!tipoPerfil) {
      setErro("Selecione um perfil")
      return
    }

    if (tipoPerfil === "cliente") {
      setMostrarCadastroCliente(true)
      return
    }

    if (tipoPerfil === "barbeiro") {
      setMostrarCadastroBarbeiro(true)
      return
    }
  }

  // --- RENDERIZAÇÃO DO COMPONENTE PRINCIPAL ---
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-[#121212] p-6 md:p-10">
      <div className="w-full max-w-md space-y-8">
        {/* CABEÇALHO (Logo e títulos animados) */}
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

        {/* CAMPO DE ENTRADA DO NOME (Desaparece suavemente ao avançar) */}
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
                  setErro("") // Limpa o erro assim que o usuário volta a digitar
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* EXIBIÇÃO DE ERROS (Aparece de forma fluida se houver alguma mensagem) */}
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

        {/* CARDS DE SELEÇÃO DE PERFIL (Aparecem apenas após digitar o nome) */}
        <AnimatePresence>
          {mostrarPergunta && (
            <motion.div
              className="mt-6 grid grid-cols-2 gap-3 md:gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* CARD: CLIENTE */}
              <motion.div
                variants={cardVariants}
                onClick={() => setTipoPerfil("cliente")}
                // Classes dinâmicas baseadas no foco e seleção do card
                className={`flex cursor-pointer flex-col items-center rounded-2xl border p-3 text-center transition-all duration-300 hover:border-[#C3F32C] hover:bg-[#C3F32C]/10 md:p-6 ${
                  tipoPerfil === "cliente"
                    ? "z-10 scale-105 border-[#C3F32C] bg-[#C3F32C]/10 shadow-lg shadow-[#C3F32C]/20" // Selecionado
                    : tipoPerfil === "barbeiro"
                      ? "scale-95 border-zinc-700 bg-transparent opacity-40 blur-[2px]" // Não selecionado (o outro está ativo)
                      : "border-zinc-700 bg-transparent" // Estado neutro inicial
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
                    style={{ width: "auto", height: "auto" }}
                    className="h-[90px] w-[90px] object-contain md:h-[180px] md:w-[180px]"
                  />
                </div>
                {/* Accordion informativo (stopPropagation impede que o clique abra o FAQ selecione o card por acidente) */}
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

              {/* CARD: BARBEIRO */}
              <motion.div
                variants={cardVariants}
                onClick={() => setTipoPerfil("barbeiro")}
                // Classes dinâmicas idênticas à lógica do cliente, mas invertidas
                className={`flex cursor-pointer flex-col items-center rounded-2xl border p-3 text-center transition-all duration-300 hover:border-[#C3F32C] hover:bg-[#C3F32C]/10 md:p-6 ${
                  tipoPerfil === "barbeiro"
                    ? "z-10 scale-105 border-[#C3F32C] bg-[#C3F32C]/10 shadow-lg shadow-[#C3F32C]/20" // Selecionado
                    : tipoPerfil === "cliente"
                      ? "scale-95 border-zinc-700 bg-transparent opacity-40 blur-[2px]" // Não selecionado (o outro está ativo)
                      : "border-zinc-700 bg-transparent" // Estado neutro inicial
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
                    style={{ width: "auto", height: "auto" }}
                    className="h-[90px] w-[90px] object-contain md:h-[180px] md:w-[180px]"
                  />
                </div>
                {/* Accordion informativo */}
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

        {/* NAVEGAÇÃO (Botões estruturados na parte inferior da tela) */}
        <div className="flex items-center justify-between">
          {/* Botão Voltar (Renderiza apenas quando a pergunta for exibida) */}
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
                    setmostrarPergunta(false) // Volta para a tela de nome
                    setTipoPerfil("") // Reseta a escolha anterior do usuário
                  }}
                  className="flex cursor-pointer items-center gap-2 bg-transparent p-4 whitespace-nowrap text-white hover:bg-transparent hover:text-[#254F50]"
                >
                  <ChevronRight className="h-4 w-4 rotate-180" />
                  Voltar
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Botão Prosseguir (Altera sua cor dinamicamente com base no estado do fluxo) */}
          <AnimatePresence mode="popLayout">
            {!mostrarPergunta ? (
              // Botão Prosseguir na etapa inicial (Nome)
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
              // Botão Prosseguir na etapa final (Seleção de Perfil) com hover estilizado no tom verde-limão
              <motion.div
                key="prosseguir-perfil"
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
