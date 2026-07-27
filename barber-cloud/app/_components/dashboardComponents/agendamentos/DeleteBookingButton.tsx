"use client"

import { useTransition } from "react"
import { deleteBooking } from "@/app/api/deleteBokings/delete-bookingBarber"
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
import { AlertTriangle, Ban } from "lucide-react"
import { toast } from "sonner"

export function DeleteBookingButton({ bookingId }: { bookingId: string }) {
  const [isPending, startTransition] = useTransition()

  const handleCancel = () => {
    startTransition(async () => {
      const result = await deleteBooking(bookingId)
      if (result.success) {
        toast.success("Agendamento cancelado e mantido no histórico.")
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          disabled={isPending}
          className="flex cursor-pointer items-center gap-2 rounded-lg border border-red-500/30 px-3 py-1.5 text-sm font-medium text-red-400 transition-colors hover:border-red-500 hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          title="Cancelar agendamento"
        >
          <Ban size={16} />
          <span>{isPending ? "Cancelando..." : "Cancelar"}</span>
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-[90vw] max-w-md rounded-2xl border border-white/10 p-6 shadow-2xl dark:bg-[#121212]">
        <AlertDialogHeader className="space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
            <AlertTriangle className="h-7 w-7 text-red-500" />
          </div>
          <div className="space-y-2 text-center">
            <AlertDialogTitle className="text-center text-xl font-bold dark:text-white">
              Confirmar cancelamento
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-sm text-zinc-400">
              O agendamento será cancelado, mas continuará salvo no histórico e
              nos relatórios mensais.
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6 flex flex-row gap-3 sm:justify-center sm:gap-3">
          <AlertDialogCancel className="mt-0 h-11 flex-1 cursor-pointer rounded-xl bg-white/5 dark:border-white/10 dark:text-white">
            Voltar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleCancel}
            className="h-11 flex-1 cursor-pointer rounded-xl bg-red-600 font-medium text-white hover:bg-red-700"
          >
            Cancelar agendamento
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
