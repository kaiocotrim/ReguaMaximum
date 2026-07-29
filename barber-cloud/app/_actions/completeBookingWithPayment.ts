"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import type { PaymentMethod } from "@/app/generated/prisma/client"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/app/_lib/prisma"

const methods: PaymentMethod[] = [
  "DINHEIRO",
  "PIX",
  "CARTAO_CREDITO",
  "CARTAO_DEBITO",
  "OUTRO",
]

export async function completeBookingWithPayment(input: {
  bookingId: string
  method: PaymentMethod
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return { success: false as const, error: "Não autorizado." }
  }
  if (!methods.includes(input.method)) {
    return { success: false as const, error: "Forma de pagamento inválida." }
  }
  try {
    let completed = false

    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        completed = await db.$transaction(
          async (tx) => {
            const booking = await tx.booking.findUnique({
              where: { id: input.bookingId },
              select: {
                id: true,
                barbershopId: true,
                agreedPrice: true,
                service: { select: { price: true } },
              },
            })

            if (!booking) return false

            const updated = await tx.booking.updateMany({
              where: {
                id: booking.id,
                barbershopId: booking.barbershopId,
                status: "EM_ANDAMENTO",
                payment: null,
                OR: [
                  { barbershop: { ownerId: session.user.id } },
                  {
                    barber: {
                      userId: session.user.id,
                      barbershopId: booking.barbershopId,
                    },
                  },
                ],
              },
              data: {
                status: "CONCLUIDO",
                attendance: "COMPARECEU",
              },
            })

            if (updated.count !== 1) return false

            await tx.payment.create({
              data: {
                bookingId: booking.id,
                method: input.method,
                amount: booking.agreedPrice ?? booking.service.price,
                receivedById: session.user.id,
              },
            })

            return true
          },
          { isolationLevel: "Serializable" },
        )
        break
      } catch (error) {
        const code = (error as { code?: string }).code
        if (code === "P2034" && attempt === 0) continue
        throw error
      }
    }

    if (!completed) {
      return {
        success: false as const,
        error: "Agendamento não encontrado, sem acesso ou já finalizado.",
      }
    }
  } catch (error) {
    console.error("Erro ao finalizar agendamento com pagamento:", error)
    return {
      success: false as const,
      error: "Não foi possível finalizar o atendimento.",
    }
  }

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/agendamentos")
  revalidatePath("/dashboard/caixa")
  revalidatePath("/dashboard/relatorios")
  revalidatePath("/")
  return { success: true as const }
}
