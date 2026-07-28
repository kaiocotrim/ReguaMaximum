"use client"

import { useState, useTransition } from "react"
import { LogOut, Loader2, UserMinus } from "lucide-react"
import { useRouter } from "next/navigation"

import {
  leaveBarbershop,
  removeBarberFromBarbershop,
} from "@/app/_actions/barberMembership"
import { Button } from "@/app/_components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/_components/ui/alert-dialog"

type BarberMembershipButtonProps =
  | { mode: "leave"; barberId?: never; barberName?: never }
  | { mode: "remove"; barberId: string; barberName: string }

export function BarberMembershipButton(props: BarberMembershipButtonProps) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const isLeave = props.mode === "leave"

  const handleConfirm = () => {
    setError("")
    startTransition(async () => {
      try {
        if (isLeave) {
          await leaveBarbershop()
        } else {
          await removeBarberFromBarbershop(props.barberId)
        }
        setOpen(false)
        router.refresh()
      } catch (actionError) {
        setError(
          actionError instanceof Error
            ? actionError.message
            : "Não foi possível concluir a ação.",
        )
      }
    })
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (nextOpen) setError("")
      }}
    >
      <AlertDialogTrigger asChild>
        <Button
          variant={isLeave ? "destructive" : "ghost"}
          size={isLeave ? "default" : "sm"}
          className={
            isLeave
              ? "cursor-pointer rounded-xl"
              : "cursor-pointer text-red-500 hover:bg-red-500/10 hover:text-red-600"
          }
        >
          {isLeave ? (
            <LogOut className="mr-2 h-4 w-4" />
          ) : (
            <UserMinus className="mr-2 h-4 w-4" />
          )}
          {isLeave ? "Sair da barbearia" : "Remover"}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10">
            {isLeave ? (
              <LogOut className="h-5 w-5 text-red-500" />
            ) : (
              <UserMinus className="h-5 w-5 text-red-500" />
            )}
          </div>
          <AlertDialogTitle className="text-center">
            {isLeave
              ? "Sair desta barbearia?"
              : `Remover ${props.barberName}?`}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            {isLeave
              ? "Você deixará de aparecer na equipe e não receberá novos agendamentos desta barbearia. Seu perfil e histórico serão preservados."
              : "O barbeiro deixará de aparecer na equipe e não receberá novos agendamentos. O perfil e o histórico dele serão preservados."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error && (
          <p className="rounded-lg bg-red-500/10 px-3 py-2 text-center text-sm text-red-500">
            {error}
          </p>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={(event) => {
              event.preventDefault()
              handleConfirm()
            }}
            disabled={isPending}
            className="bg-red-500 text-white hover:bg-red-600"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending
              ? "Processando..."
              : isLeave
                ? "Confirmar saída"
                : "Confirmar remoção"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
