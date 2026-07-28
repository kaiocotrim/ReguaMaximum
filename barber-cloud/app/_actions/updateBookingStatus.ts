"use server"

import { BookingStatus } from "@/app/generated/prisma/client"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth"

export async function updateBookingStatus(
  _bookingId: string,
  status: BookingStatus,
) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id || status !== "CONCLUIDO") {
    return { success: false as const, error: "Operação não autorizada." }
  }

  return {
    success: false as const,
    error:
      "Para concluir o atendimento, use a finalização com registro de pagamento.",
  }
}
