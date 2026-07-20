import { Card } from "@/app/_components/ui/card"
import { db } from "@/app/_lib/prisma"
import { WhatsAppButton } from "../WhatsAppButton"
import { DeleteBookingButton } from "../DeleteBookingButton"
import { CalendarX2, Clock, Scissors, User2, Store } from "lucide-react"

export default async function Agendados() {
  const appointments = await db.booking.findMany({
    include: {
      user: true,
      barber: true,
      service: true,
      barbershop: true,
    },
    orderBy: {
      date: "asc",
    },
  })

  if (appointments.length === 0) {
    return (
      <div className="relative mt-5 rounded-3xl border border-zinc-800/60 bg-gradient-to-b from-zinc-950 via-black to-zinc-950 p-6 md:p-10 overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#C3F32C]/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-[#C3F32C]/5 blur-3xl" />

        <div className="relative flex flex-col items-center justify-center text-center py-20 px-6">
          <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-zinc-900/80 border border-zinc-800 mb-6">
            <CalendarX2 className="w-9 h-9 text-zinc-500" strokeWidth={1.5} />
          </div>
          <h3 className="text-xl font-semibold text-white tracking-tight">
            Nenhum agendamento no sistema
          </h3>
          <p className="mt-2 max-w-sm text-sm text-zinc-500 leading-relaxed">
            Ainda não há agendamentos cadastrados. Quando um cliente realizar
            um agendamento, ele aparecerá aqui.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative mt-5 rounded-3xl bg-gradient-to-b from-zinc-950 via-black to-zinc-950 p-4 md:p-8 overflow-hidden">
      <div className="pointer-events-none absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#C3F32C]/5 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-72 h-72 rounded-full bg-zinc-800/20 blur-3xl" />

      <div className="relative mb-6">
        <h2 className="text-lg font-semibold text-white tracking-tight">
          Agendamentos
        </h2>
        <p className="text-sm text-zinc-500">
          {appointments.length}{" "}
          {appointments.length === 1
            ? "agendamento cadastrado"
            : "agendamentos cadastrados"}
        </p>
      </div>

      <div className="relative grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {appointments.map((appointment) => (
          <Card
            key={appointment.id}
            className="group relative border border-zinc-800/80 bg-zinc-950/60 backdrop-blur-xl rounded-2xl p-5 transition-all duration-300 hover:border-[#C3F32C]/30 hover:bg-zinc-900/60 hover:shadow-[0_8px_30px_rgba(195,243,44,0.06)] hover:-translate-y-1"
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 shrink-0">
                <User2 className="w-4 h-4" strokeWidth={1.75} />
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-semibold text-white truncate">
                  {appointment.user.name}
                </h3>
                <p className="text-xs text-zinc-500 flex items-center gap-1 truncate">
                  <Store className="w-3 h-3 shrink-0" />
                  {appointment.barbershop.name}
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-2.5 mb-5">
              <div className="flex items-center gap-2 text-sm text-zinc-300">
                <Scissors className="w-3.5 h-3.5 text-[#C3F32C]/70 shrink-0" />
                <span className="truncate">{appointment.service.name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-300">
                <User2 className="w-3.5 h-3.5 text-[#C3F32C]/70 shrink-0" />
                <span className="truncate">{appointment.barber.nome}</span>
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

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-zinc-800/60">
              <DeleteBookingButton bookingId={appointment.id} />
              <WhatsAppButton
                telefone={appointment.user.telefone}
                nomeCliente={appointment.user.name}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}