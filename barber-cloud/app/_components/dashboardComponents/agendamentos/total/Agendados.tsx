import { db } from "@/app/_lib/prisma"
import { AppointmentCard } from "@/app/_components/AppointmentCard"
import { CalendarX2, CalendarDays } from "lucide-react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import {
  bookingOrderBy,
  bookingWhere,
  type BookingFilters,
} from "@/app/_lib/booking-filters"

export default async function Agendados({
  filters,
}: {
  filters: BookingFilters
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return null

  const appointments = await db.booking.findMany({
    where: bookingWhere(session.user.id, filters),
    include: {
      user: true,
      barber: true,
      service: true,
      barbershop: true,
    },
    orderBy: bookingOrderBy(filters.sort),
  })

  if (appointments.length === 0) {
    return (
      <div className="mt-5 rounded-2xl border border-border bg-card p-6 md:p-10">
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-xl border border-border bg-muted">
            <CalendarX2 className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">Nenhum agendamento encontrado</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Limpe ou altere os filtros para ampliar a pesquisa.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-5 rounded-2xl border border-border bg-card p-4 md:p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Resultados da pesquisa</h2>
          <p className="text-sm text-muted-foreground">
            {appointments.length} registro{appointments.length === 1 ? "" : "s"} salvo
            {appointments.length === 1 ? "" : "s"}
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C3F32C] px-3 py-1 text-xs font-medium text-black">
          <CalendarDays className="h-3.5 w-3.5" />
          {appointments.length} no total
        </span>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {appointments.map((appointment) => (
          <AppointmentCard
            key={appointment.id}
            appointment={{
              id: appointment.id,
              date: appointment.date,
              status: appointment.status,
              user: {
                name: appointment.user.name,
                telefone: appointment.user.telefone,
              },
              barber: { nome: appointment.barber.nome },
              service: {
                name: appointment.service.name,
                price: Number(appointment.service.price),
              },
              barbershop: { name: appointment.barbershop.name },
            }}
          />
        ))}
      </div>
    </div>
  )
}
