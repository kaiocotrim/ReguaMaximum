
"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/_components/ui/alert-dialog"

import InviteBarber from "../InviteBarber"
import { Button } from "@/app/_components/ui/button"
import { Loader2, Plus, UserPlus } from "lucide-react"
import { inviteBarber } from "@/app/_actions/inviteBarber"
import { AnimatePresence, motion } from "framer-motion"

interface ResultadoBusca {
  id: string
  userId: string
  nome: string
  user: {
    email: string
  }
}

interface GetBarberProps {
  barbershopId: string
  barbershopName: string
}

const createWelcomeMessage = (barberName: string, barbershopName: string) =>
  `Olá, ${barberName}! 👋\n\nGostaríamos de convidar você para fazer parte da equipe da ${barbershopName} na Régua Máxima. Será um prazer ter você com a gente!\n\nAcesse sua conta para visualizar e responder ao convite.`

export default function GetBarber({
  barbershopId,
  barbershopName,
}: GetBarberProps) {
  const [barberSelecionado, setBarberSelecionado] =
    useState<ResultadoBusca | null>(null)
  const [open, setOpen] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [mensagem, setMensagem] = useState("")

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (nextOpen) {
      setErro(null)
      setBarberSelecionado(null)
      setMensagem("")
    }
  }

  const handleConvidar = async () => {
    if (!barberSelecionado || !barbershopId) return

    setEnviando(true)
    setErro(null)

    try {
      await inviteBarber(barberSelecionado.userId, barbershopId, mensagem)
      setBarberSelecionado(null)
      setOpen(false)
    } catch (err) {
      console.error(err)
      setErro("Não foi possível enviar o convite. Tente novamente.")
    } finally {
      setEnviando(false)
    }
  }

  const handleSelectBarber = (barber: ResultadoBusca | null) => {
    setBarberSelecionado(barber)
    setMensagem(
      barber ? createWelcomeMessage(barber.nome, barbershopName) : "",
    )
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button
          size="icon"
          variant="secondary"
          className="cursor-pointer dark:bg-zinc-800 dark:text-[#C3F32C] dark:hover:bg-zinc-700"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>

      {/* 
        Não uso AlertDialogHeader/AlertDialogFooter aqui de propósito:
        esses componentes do shadcn vêm com gap/space-y padrão que estava
        criando o espaço vazio. Substituí por divs simples com controle
        manual total do espaçamento.
      */}
      <AlertDialogContent
        className="max-h-[90vh] !w-[calc(100%_-_2rem)] !max-w-lg !grid-rows-none !gap-0 !space-y-0 overflow-hidden rounded-3xl border-border bg-card p-0 shadow-2xl dark:border-zinc-800 dark:bg-[#0d0d0d] data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95"
      >
        <div className="flex shrink-0 flex-col border-b border-border px-6 py-5 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C3F32C]/10">
              <UserPlus className="h-4 w-4 dark:text-[#C3F32C] text-blac"/>
            </div>
            <AlertDialogTitle className="text-lg font-semibold dark:text-gray-100">
              Convidar barbeiro
            </AlertDialogTitle>
          </div>

          <AlertDialogDescription asChild>
            <p className="mt-2 text-sm text-zinc-500 ">
              Busque um usuário cadastrado pelo e-mail para adicioná-lo à sua barbearia.
            </p>
          </AlertDialogDescription>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 py-5">
          <InviteBarber onSelect={handleSelectBarber} />

          <AnimatePresence initial={false}>
          {barberSelecionado && (
            <motion.div
              key={`selected-${barberSelecionado.id}`}
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="mt-3 flex items-center justify-between rounded-lg border border-[#C3F32C]/30 bg-[#C3F32C]/5 px-3 py-2"
            >
              <div>
                <p className="text-sm font-medium text-foreground">
                  {barberSelecionado.nome}
                </p>
                <p className="text-xs text-zinc-500">
                  {barberSelecionado.user.email}
                </p>
              </div>
              <button
                onClick={() => handleSelectBarber(null)}
                className="text-xs text-zinc-500 hover:text-zinc-300"
              >
                remover
              </button>
            </motion.div>
          )}
          </AnimatePresence>

          <AnimatePresence initial={false}>
          {barberSelecionado && (
            <motion.div
              key={`message-${barberSelecionado.id}`}
              initial={{ opacity: 0, height: 0, y: 10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -6 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="mt-4 overflow-hidden"
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <label
                  htmlFor="invite-message"
                  className="text-sm font-medium text-foreground"
                >
                  Mensagem de boas-vindas
                </label>
                <span className="text-xs text-muted-foreground">
                  {mensagem.length}/500
                </span>
              </div>
              <textarea
                id="invite-message"
                value={mensagem}
                onChange={(event) => setMensagem(event.target.value)}
                maxLength={500}
                rows={7}
                className="w-full resize-none rounded-xl border border-border bg-background px-3 py-2.5 text-sm leading-relaxed text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[#C3F32C] focus:ring-2 focus:ring-[#C3F32C]/20"
                placeholder="Escreva uma mensagem para acompanhar o convite..."
              />
              <p className="mt-1.5 text-xs text-muted-foreground">
                Esta mensagem aparecerá junto ao convite do barbeiro.
              </p>
            </motion.div>
          )}
          </AnimatePresence>

          <AnimatePresence>
            {erro && (
              <motion.p
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                className="mt-3 text-xs text-red-400"
              >
                {erro}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="flex shrink-0 items-center justify-end gap-2 border-t border-border bg-card px-6 py-4 dark:border-zinc-800 dark:bg-[#0d0d0d]">
          <AlertDialogCancel className="mt-0 dark:border-zinc-700 bg-transparent dark:text-zinc-300 hover:bg-zinc-800 hover:text-white">
            Cancelar
          </AlertDialogCancel>
          <Button
            disabled={!barberSelecionado || !mensagem.trim() || enviando}
            onClick={handleConvidar}
            className="bg-[#C3F32C] font-medium text-black hover:bg-[#b3e025] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {enviando && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {enviando ? "Enviando..." : "Convidar"}
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
