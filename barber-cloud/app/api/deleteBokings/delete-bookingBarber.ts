"use server"

import { db } from "@/app/_lib/prisma"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"

async function findOwnedBooking(id: string, ownerId: string) {
  return db.booking.findFirst({
    where: {
      id,
      barbershop: { ownerId },
    },
    select: { id: true },
  })
}

export async function cancelBooking(id: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return { success: false as const, error: "Não autorizado." }
  }

  const booking = await db.booking.findFirst({
    where: {
      id,
      status: "EM_ANDAMENTO",
      barbershop: { ownerId: session.user.id },
    },
    select: {
      id: true,
      userId: true,
      date: true,
      barbershopId: true,
      barbershop: { select: { name: true } },
      service: { select: { name: true } },
    },
  })

  if (!booking) {
    return {
      success: false as const,
      error: "Agendamento não encontrado ou não está em andamento.",
    }
  }

  await db.$transaction([
    db.booking.update({
      where: { id: booking.id },
      data: { status: "CANCELADO", cancelledAt: new Date() },
    }),
    db.userNotification.create({
      data: {
        userId: booking.userId,
        bookingId: booking.id,
        title: "Agendamento cancelado",
        message: `${booking.barbershop.name} cancelou seu agendamento de ${booking.service.name} em ${booking.date.toLocaleString("pt-BR")}.`,
      },
    }),
    db.auditLog.create({
      data: {
        barbershopId: booking.barbershopId,
        actorId: session.user.id,
        action: "BOOKING_CANCELLED",
        entityType: "Booking",
        entityId: booking.id,
      },
    }),
  ])

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/agendamentos")
  return { success: true as const }
}

export async function deleteBooking(id: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return { success: false as const, error: "Não autorizado." }
  }

  const booking = await findOwnedBooking(id, session.user.id)

  if (!booking) {
    return { success: false as const, error: "Agendamento não encontrado." }
  }

  await db.booking.delete({ where: { id: booking.id } })

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/agendamentos")
  return { success: true as const }
}
