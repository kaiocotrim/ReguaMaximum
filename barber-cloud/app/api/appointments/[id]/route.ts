import { db } from "@/app/_lib/prisma"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth"

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
      OR: [
        { userId: session.user.id },
        { barbershop: { ownerId: session.user.id } },
      ],
    },
  })

  if (!booking) {
    return Response.json({ message: "Agendamento não encontrado." }, { status: 404 })
  }

  await db.booking.update({
    where: { id },
    data: { status: "CANCELADO", cancelledAt: new Date() },
  })

  return Response.json({ message: "Agendamento cancelado e salvo no histórico." })
}
