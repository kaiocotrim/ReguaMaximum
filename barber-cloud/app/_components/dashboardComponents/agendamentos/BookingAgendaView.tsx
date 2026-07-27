import { CalendarX2 } from "lucide-react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/app/_lib/prisma"
import {
  bookingOrderBy,
  bookingWhere,
  type BookingFilters,
} from "@/app/_lib/booking-filters"
import { BookingCalendar } from "./BookingCalendar"

export async function BookingAgendaView({
  filters,
}: {
  filters: BookingFilters
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return null

  const [appointments, barbers, services] = await Promise.all([
    db.booking.findMany({
      where: bookingWhere(session.user.id, filters),
      select: {
        id: true,
        date: true,
        status: true,
        barberId: true,
        serviceId: true,
        user: { select: { name: true, telefone: true } },
        barber: { select: { nome: true, user: { select: { name: true } } } },
        barbershop: { select: { name: true } },
        service: { select: { name: true, duration: true, price: true } },
      },
      orderBy: bookingOrderBy(filters.sort),
    }),
    db.barber.findMany({
      where: { barbershop: { ownerId: session.user.id } },
      select: { id: true, nome: true, user: { select: { name: true } } },
      orderBy: { nome: "asc" },
    }),
    db.barbeshopService.findMany({
      where: { barbershop: { ownerId: session.user.id } },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ])

  if (appointments.length === 0) {
    return (
      <div className="mt-5 rounded-2xl border border-border bg-card p-6 md:p-10">
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-xl border border-border bg-muted">
            <CalendarX2 className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">Nenhum agendamento encontrado</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Limpe ou altere os filtros para ampliar a agenda.
          </p>
        </div>
      </div>
    )
  }

  const events = appointments.map((appointment) => ({
    id: appointment.id,
    title: appointment.user.name ?? "Cliente",
    start: appointment.date.toISOString(),
    end: new Date(
      appointment.date.getTime() + appointment.service.duration * 60_000,
    ).toISOString(),
    classNames: [`booking-event-${appointment.status.toLowerCase()}`],
    extendedProps: {
      client: appointment.user.name ?? "Cliente",
      phone: appointment.user.telefone,
      barberId: appointment.barberId,
      barber:
        appointment.barber.nome ?? appointment.barber.user.name ?? "Barbeiro",
      barbershop: appointment.barbershop.name,
      serviceId: appointment.serviceId,
      service: appointment.service.name,
      duration: appointment.service.duration,
      price: Number(appointment.service.price),
      status: appointment.status,
    },
  }))

  return (
    <section className="mt-5 rounded-2xl border border-border bg-card p-3 md:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold">Agenda de atendimentos</h2>
        <p className="text-sm text-muted-foreground">
          {appointments.length} agendamento{appointments.length === 1 ? "" : "s"} no
          período filtrado
        </p>
      </div>
      <BookingCalendar
        events={events}
        barbers={barbers.map((barber) => ({
          id: barber.id,
          name: barber.nome ?? barber.user.name ?? "Barbeiro sem nome",
        }))}
        services={services}
      />
    </section>
  )
}
