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
  const cancelled = await db.booking.updateMany({
    where: {
      id,
      status: "EM_ANDAMENTO",
      OR: [
        { userId: session.user.id },
        { barbershop: { ownerId: session.user.id } },
      ],
    },
    data: { status: "CANCELADO", cancelledAt: new Date() },
  })

  if (cancelled.count === 0) {
    return Response.json(
      { message: "Agendamento não encontrado ou não está em andamento." },
      { status: 404 },
    )
  }

  return Response.json({ message: "Agendamento cancelado e salvo no histórico." })
}
