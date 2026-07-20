// app/_components/dashboardComponents/agendamentos/total/AppointmentCard.tsx
"use client"

import { useState, useTransition } from "react"
import { Card } from "@/app/_components/ui/card"
import { Button } from "@/app/_components/ui/button"
import { Badge } from "@/app/_components/ui/badge"
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
    const newStatus: BookingStatus = isDone ? "EM_ANDAMENTO" : "CONCLUIDO"
    setStatus(newStatus) // update otimista
    startTransition(async () => {
      await updateBookingStatus(appointment.id, newStatus)
    })
  }

  return (
    <Card
      className={`group relative border rounded-2xl p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 ${
        isDone
          ? "border-emerald-500/30 bg-emerald-950/10 hover:border-emerald-500/50 hover:shadow-[0_8px_30px_rgba(16,185,129,0.08)]"
          : "border-zinc-800/80 bg-zinc-950/60 hover:border-[#C3F32C]/30 hover:bg-zinc-900/60 hover:shadow-[0_8px_30px_rgba(195,243,44,0.06)]"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 shrink-0">
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

        <Badge
          variant="outline"
          className={`shrink-0 font-medium text-xs px-2.5 py-0.5 transition-colors ${
            isDone
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
          }`}
        >
          {isDone ? "Concluído" : "Em andamento"}
        </Badge>
      </div>

      {/* Details */}
      <div className="space-y-2.5 mb-5">
        <div className="flex items-center gap-2 text-sm text-zinc-300">
          <Scissors className="w-3.5 h-3.5 text-[#C3F32C]/70 shrink-0" />
          <span className="truncate">{appointment.service.name}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-zinc-300">
          <User2 className="w-3.5 h-3.5 text-[#C3F32C]/70 shrink-0" />
          <span className="truncate">{appointment.barber.nome ?? "Barbeiro"}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-zinc-300">
          <Clock className="w-3.5 h-3.5 text-[#C3F32C]/70 shrink-0" />
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
        className={`w-full mb-4 font-medium transition-all ${
          isDone
            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25"
            : "bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/25"
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