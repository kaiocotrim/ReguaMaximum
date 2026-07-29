import { getServerSession } from "next-auth"

import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/app/_lib/prisma"

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return Response.json({ message: "Não autorizado." }, { status: 401 })
  }

  const { id } = await params
  const booking = await db.booking.findFirst({
    where: {
      id,
      status: "EM_ANDAMENTO",
      OR: [
        { userId: session.user.id },
        { barbershop: { ownerId: session.user.id } },
      ],
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
    return Response.json(
      { message: "Agendamento não encontrado ou não está em andamento." },
      { status: 404 },
    )
  }

  await db.$transaction(async (tx) => {
    await tx.booking.update({
      where: { id: booking.id },
      data: { status: "CANCELADO", cancelledAt: new Date() },
    })

    if (session.user.id !== booking.userId) {
      await tx.userNotification.create({
        data: {
          userId: booking.userId,
          bookingId: booking.id,
          title: "Agendamento cancelado",
          message: `${booking.barbershop.name} cancelou seu agendamento de ${booking.service.name} em ${booking.date.toLocaleString("pt-BR")}.`,
        },
      })
    }

    await tx.auditLog.create({
      data: {
        barbershopId: booking.barbershopId,
        actorId: session.user.id,
        action: "BOOKING_CANCELLED",
        entityType: "Booking",
        entityId: booking.id,
        details: { cancelledBy: session.user.id },
      },
    })
  })

  return Response.json({
    message: "Agendamento cancelado e salvo no histórico.",
  })
}
