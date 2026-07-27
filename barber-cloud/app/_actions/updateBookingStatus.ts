"use server"

import { db } from "@/app/_lib/prisma"
import { BookingStatus } from "@/app/generated/prisma/client"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"

export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus,
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || status === "CANCELADO") {
      return { success: false as const, error: "Operação não autorizada." }
    }

    const result = await db.booking.updateMany({
      where: {
        id: bookingId,
        OR: [
          { barbershop: { ownerId: session.user.id } },
          { barber: { userId: session.user.id } },
        ],
        status: { not: "CANCELADO" },
      },
      data: { status },
    })

    if (result.count === 0) {
      return {
        success: false as const,
        error: "Agendamento não encontrado ou já cancelado.",
      }
    }

    revalidatePath("/dashboard/agendamentos")
    return { success: true as const, status }
  } catch (error) {
    console.error("Erro ao atualizar status do agendamento:", error)
    return {
      success: false as const,
      error: "Não foi possível atualizar o status.",
    }
  }
}
