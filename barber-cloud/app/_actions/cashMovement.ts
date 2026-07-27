"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import type {
  CashMovementType,
  PaymentMethod,
} from "@/app/generated/prisma/client"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/app/_lib/prisma"

export async function createCashMovement(input: {
  type: CashMovementType
  amount: number
  description: string
  method?: PaymentMethod
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return { success: false as const, error: "Não autorizado." }
  }

  const description = input.description.trim()
  if (!description || description.length > 120) {
    return { success: false as const, error: "Informe uma descrição válida." }
  }
  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    return { success: false as const, error: "Informe um valor maior que zero." }
  }
  if (!["ENTRADA", "SAIDA"].includes(input.type)) {
    return { success: false as const, error: "Tipo de movimentação inválido." }
  }

  const barbershop = await db.barbershop.findFirst({
    where: { ownerId: session.user.id },
    select: { id: true },
  })
  if (!barbershop) {
    return { success: false as const, error: "Barbearia não encontrada." }
  }

  await db.cashMovement.create({
    data: {
      barbershopId: barbershop.id,
      type: input.type,
      amount: input.amount,
      description,
      method: input.method,
      createdById: session.user.id,
    },
  })

  revalidatePath("/dashboard/caixa")
  revalidatePath("/dashboard/relatorios")
  return { success: true as const }
}
