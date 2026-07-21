// app/_components/dashboardComponents/agendamentos/total/Agendados.tsx
import { db } from "@/app/_lib/prisma"
import { AppointmentCard } from "@/app/_components/AppointmentCard"
import { CalendarX2, CalendarDays } from "lucide-react"

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

  const serializedAppointments = appointments.map((appointment) => ({
    id: appointment.id,
    date: appointment.date,
    status: appointment.status,
    user: {
      name: appointment.user.name,
      telefone: appointment.user.telefone,
    },
    barber: {
      nome: appointment.barber.nome,
    },
    service: {
      name: appointment.service.name,
    },
    barbershop: {
      name: appointment.barbershop.name,
    },
  }))

  if (serializedAppointments.length === 0) {
    return (
      <div className="mt-5 rounded-2xl border border-zinc-800/60 bg-zinc-950 p-6 md:p-10">
        <div className="flex flex-col items-center justify-center text-center py-16 px-6">
          <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-zinc-900 border border-zinc-800 mb-5">
            <CalendarX2 className="w-8 h-8 text-zinc-500" strokeWidth={1.5} />
          </div>
          <h3 className="text-lg font-semibold text-white tracking-tight">
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
    <div className="mt-5 rounded-2xl border border-zinc-800/60 bg-zinc-950 p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-white tracking-tight">
            Agendamentos
          </h2>
          <p className="text-sm text-zinc-500">
            {serializedAppointments.length}{" "}
            {serializedAppointments.length === 1
              ? "agendamento cadastrado"
              : "agendamentos cadastrados"}
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C3F32C] px-3 py-1 text-xs font-medium text-black">
          <CalendarDays className="w-3.5 h-3.5" />
          {serializedAppointments.length}{" "}
          {serializedAppointments.length === 1 ? "total" : "no total"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {serializedAppointments.map((appointment) => (
          <AppointmentCard key={appointment.id} appointment={appointment} />
        ))}
      </div>
    </div>
  )
}