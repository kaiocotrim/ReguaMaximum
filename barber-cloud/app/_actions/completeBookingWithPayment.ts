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
  amount: number
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return { success: false as const, error: "Não autorizado." }
  }
  if (!methods.includes(input.method)) {
    return { success: false as const, error: "Forma de pagamento inválida." }
  }
  if (
    !Number.isFinite(input.amount) ||
    input.amount < 0
  ) {
    return { success: false as const, error: "Valores de pagamento inválidos." }
  }

  const booking = await db.booking.findFirst({
    where: {
      id: input.bookingId,
      status: { not: "CANCELADO" },
      OR: [
        { barbershop: { ownerId: session.user.id } },
        { barber: { userId: session.user.id } },
      ],
    },
    select: { id: true },
  })
  if (!booking) {
    return { success: false as const, error: "Agendamento não encontrado." }
  }

  await db.$transaction([
    db.payment.upsert({
      where: { bookingId: booking.id },
      create: {
        bookingId: booking.id,
        method: input.method,
        amount: input.amount,
        receivedById: session.user.id,
      },
      update: {
        method: input.method,
        amount: input.amount,
        receivedById: session.user.id,
        paidAt: new Date(),
      },
    }),
    db.booking.update({
      where: { id: booking.id },
      data: { status: "CONCLUIDO", attendance: "COMPARECEU" },
    }),
  ])

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/agendamentos")
  revalidatePath("/dashboard/caixa")
  revalidatePath("/dashboard/relatorios")
  revalidatePath("/")
  return { success: true as const }
}
