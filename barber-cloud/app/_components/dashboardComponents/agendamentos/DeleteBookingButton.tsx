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
import { AlertTriangle, Trash2 } from "lucide-react"

interface DeleteBookingButtonProps {
  bookingId: string
}

export function DeleteBookingButton({ bookingId }: DeleteBookingButtonProps) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {
      await deleteBooking(bookingId)
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          disabled={isPending}
          className="flex items-center gap-2 text-red-400 cursor-pointer hover:text-white hover:bg-red-500 border border-red-500/30 hover:border-red-500 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Excluir Agendamento"
        >
          <Trash2 size={16} />
          <span>{isPending ? "Excluindo..." : "Excluir"}</span>
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent className="w-[90vw] max-w-md bg-[#121212] border border-white/10 rounded-2xl p-6 shadow-2xl">
        <AlertDialogHeader className="space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
            <AlertTriangle className="h-7 w-7 text-red-500" />
          </div>
          <div className="space-y-2 text-center">
            <AlertDialogTitle className="text-xl font-bold text-white text-center">
              Confirmar exclusão
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-zinc-400 text-center">
              Tem certeza de que deseja excluir este agendamento? Esta ação não
              poderá ser desfeita.
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-6 flex flex-row gap-3 sm:gap-3 sm:justify-center">
          <AlertDialogCancel className="flex-1 mt-0 h-11 border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors shadow-lg shadow-red-900/20"
          >
            Excluir Agendamento
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
