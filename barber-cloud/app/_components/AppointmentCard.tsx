// app/_components/dashboardComponents/agendamentos/total/AppointmentCard.tsx
"use client"

import { useState, useTransition } from "react"
import { Card } from "@/app/_components/ui/card"
import { Button } from "@/app/_components/ui/button"
import { Clock, Scissors, User2, Store, CheckCircle2, Loader2 } from "lucide-react"
import { WhatsAppButton } from "@/app/_components/dashboardComponents/agendamentos/WhatsAppButton"
import { DeleteBookingButton } from "@/app/_components/dashboardComponents/agendamentos/DeleteBookingButton"
import { updateBookingStatus } from "@/app/_actions/updateBookingStatus"
import { BookingStatus } from "@/app/generated/prisma"

interface AppointmentCardProps {
  appointment: {
    id: string
    date: Date
    status: BookingStatus
    user: { name: string | null; telefone: string | null }
    barber: { nome: string | null }
    service: { name: string }
    barbershop: { name: string }
  }
}

export function AppointmentCard({ appointment }: AppointmentCardProps) {
  const [status, setStatus] = useState<BookingStatus>(appointment.status)
  const [isPending, startTransition] = useTransition()

  const isDone = status === "CONCLUIDO"

  const toggleStatus = () => {
    const previousStatus = status
    const newStatus: BookingStatus = isDone ? "EM_ANDAMENTO" : "CONCLUIDO"
    setStatus(newStatus) // update otimista
    startTransition(async () => {
      const result = await updateBookingStatus(appointment.id, newStatus)
      if (!result.success) {
        setStatus(previousStatus) // rollback
      }
    })
  }

  return (
    <Card className="border border-zinc-800/60 rounded-2xl bg-zinc-950 p-5 transition-colors hover:border-zinc-700">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 shrink-0">
            <User2 className="w-4 h-4" strokeWidth={1.75} />
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-white truncate">
              {appointment.user.name ?? "Cliente"}
            </h3>
            <p className="text-xs text-zinc-500 flex items-center gap-1 truncate">
              <Store className="w-3 h-3 shrink-0" />
              {appointment.barbershop.name}
            </p>
          </div>
        </div>

        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
            isDone
              ? "bg-[#C3F32C] text-black"
              : "bg-zinc-900 text-zinc-400 border border-zinc-800"
          }`}
        >
          {isDone ? "Concluído" : "Em andamento"}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-2.5 mb-5">
        <div className="flex items-center gap-2 text-sm text-zinc-300">
          <Scissors className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
          <span className="truncate">{appointment.service.name}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-zinc-300">
          <User2 className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
          <span className="truncate">{appointment.barber.nome ?? "Barbeiro"}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-zinc-300">
          <Clock className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
          <span>
            {appointment.date.toLocaleString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>

      {/* Status toggle button */}
      <Button
        onClick={toggleStatus}
        disabled={isPending}
        variant="ghost"
        className={`w-full mb-4 font-medium transition-colors ${
          isDone
            ? "bg-[#C3F32C] text-black hover:bg-[#b3e023]"
            : "bg-zinc-900 text-zinc-300 border border-zinc-800 hover:bg-zinc-800"
        }`}
      >
        {isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isDone ? (
          <>
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Corte concluído
          </>
        ) : (
          "Marcar como concluído"
        )}
      </Button>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-zinc-800/60">
        <DeleteBookingButton bookingId={appointment.id} />
        {appointment.user.telefone && (
          <WhatsAppButton
            telefone={appointment.user.telefone}
            nomeCliente={appointment.user.name ?? "Cliente"}
          />
        )}
      </div>
    </Card>
  )
}