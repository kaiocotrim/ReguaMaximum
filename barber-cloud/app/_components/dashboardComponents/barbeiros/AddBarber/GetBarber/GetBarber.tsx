
"use client"

import { useEffect, useState } from "react"
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
}

export default function GetBarber({ barbershopId }: GetBarberProps) {
  const [barberSelecionado, setBarberSelecionado] =
    useState<ResultadoBusca | null>(null)
  const [open, setOpen] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setErro(null)
      setBarberSelecionado(null)
    }
  }, [open])

  const handleConvidar = async () => {
    if (!barberSelecionado || !barbershopId) return

    setEnviando(true)
    setErro(null)

    try {
      await inviteBarber(barberSelecionado.userId, barbershopId)
      setBarberSelecionado(null)
      setOpen(false)
    } catch (err) {
      console.error(err)
      setErro("Não foi possível enviar o convite. Tente novamente.")
    } finally {
      setEnviando(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          size="icon"
          variant="secondary"
          className="cursor-pointer bg-zinc-800 text-[#C3F32C] hover:bg-zinc-700"
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
        className="!grid-rows-none !gap-0 !space-y-0 w-full max-w-md overflow-hidden border border-zinc-800 bg-[#0d0d0d] p-0 data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95"
      >
        <div className="flex flex-col border-b border-zinc-800 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C3F32C]/10">
              <UserPlus className="h-4 w-4 text-[#C3F32C]" />
            </div>
            <AlertDialogTitle className="text-lg font-semibold text-gray-100">
              Convidar barbeiro
            </AlertDialogTitle>
          </div>

          <AlertDialogDescription asChild>
            <p className="mt-2 text-sm text-zinc-500">
              Busque um usuário cadastrado pelo e-mail para adicioná-lo à sua barbearia.
            </p>
          </AlertDialogDescription>
        </div>

        <div className="flex flex-col px-6 py-4">
          <InviteBarber
            onSelect={setBarberSelecionado}
            barbershopId={barbershopId}
          />

          {barberSelecionado && (
            <div className="mt-3 flex items-center justify-between rounded-lg border border-[#C3F32C]/30 bg-[#C3F32C]/5 px-3 py-2">
              <div>
                <p className="text-sm font-medium text-gray-100">
                  {barberSelecionado.nome}
                </p>
                <p className="text-xs text-zinc-500">
                  {barberSelecionado.user.email}
                </p>
              </div>
              <button
                onClick={() => setBarberSelecionado(null)}
                className="text-xs text-zinc-500 hover:text-zinc-300"
              >
                remover
              </button>
            </div>
          )}

          {erro && <p className="mt-3 text-xs text-red-400">{erro}</p>}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-zinc-800 px-6 py-4">
          <AlertDialogCancel className="mt-0 border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-white">
            Cancelar
          </AlertDialogCancel>
          <Button
            disabled={!barberSelecionado || enviando}
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