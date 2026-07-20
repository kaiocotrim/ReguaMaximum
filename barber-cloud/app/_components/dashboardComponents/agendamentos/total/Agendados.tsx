// app/_components/dashboardComponents/agendamentos/total/Agendados.tsx
import { db } from "@/app/_lib/prisma"
import { AppointmentCard } from "@/app/_components/AppointmentCard"
import { CalendarX2 } from "lucide-react"

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

  // Serializa os dados: Decimal, Date, etc. não podem ir direto pro Client Component
  const serializedAppointments = appointments.map((appointment) => ({
    id: appointment.id,
    date: appointment.date, // Date é serializável pelo Next, mas vamos manter explícito
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
          {serializedAppointments.length}{" "}
          {serializedAppointments.length === 1
            ? "agendamento cadastrado"
            : "agendamentos cadastrados"}
        </p>
      </div>

      <div className="relative grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {serializedAppointments.map((appointment) => (
          <AppointmentCard key={appointment.id} appointment={appointment} />
        ))}
      </div>
    </div>
  )
}