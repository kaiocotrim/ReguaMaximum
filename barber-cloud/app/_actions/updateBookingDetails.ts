"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/app/_lib/prisma"

interface UpdateBookingDetailsInput {
  bookingId: string
  barberId: string
  serviceId: string
  date: string
}

export async function updateBookingDetails(input: UpdateBookingDetailsInput) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return { success: false as const, error: "Não autorizado." }
  }

  const date = new Date(input.date)
  if (Number.isNaN(date.getTime())) {
    return { success: false as const, error: "Data ou horário inválido." }
  }

  const booking = await db.booking.findFirst({
    where: {
      id: input.bookingId,
      barbershop: { ownerId: session.user.id },
    },
    select: { id: true, barbershopId: true },
  })

  if (!booking) {
    return { success: false as const, error: "Agendamento não encontrado." }
  }

  const [barber, service] = await Promise.all([
    db.barber.findFirst({
      where: { id: input.barberId, barbershopId: booking.barbershopId },
      select: { id: true },
    }),
    db.barbeshopService.findFirst({
      where: { id: input.serviceId, barbershopId: booking.barbershopId },
      select: { id: true, duration: true },
    }),
  ])

  if (!barber || !service) {
    return {
      success: false as const,
      error: "O barbeiro ou serviço selecionado não pertence a esta barbearia.",
    }
  }

  const dayStart = new Date(date)
  dayStart.setHours(0, 0, 0, 0)
  const dayEnd = new Date(dayStart)
  dayEnd.setDate(dayEnd.getDate() + 1)

  const otherBookings = await db.booking.findMany({
    where: {
      id: { not: booking.id },
      barberId: barber.id,
      status: { not: "CANCELADO" },
      date: { gte: dayStart, lt: dayEnd },
    },
    select: {
      date: true,
      service: { select: { duration: true } },
    },
  })

  const desiredEnd = date.getTime() + service.duration * 60_000
  const hasConflict = otherBookings.some((other) => {
    const otherStart = other.date.getTime()
    const otherEnd = otherStart + other.service.duration * 60_000
    return date.getTime() < otherEnd && desiredEnd > otherStart
  })

  if (hasConflict) {
    return {
      success: false as const,
      error: "Esse barbeiro já possui outro agendamento nesse horário.",
    }
  }

  await db.booking.update({
    where: { id: booking.id },
    data: {
      barberId: barber.id,
      serviceId: service.id,
      date,
    },
  })

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/agendamentos")
  return { success: true as const }
}
