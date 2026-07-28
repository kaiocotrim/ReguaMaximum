"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"

import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/app/_lib/prisma"

export async function updateBarbershopBookingAvailability(enabled: boolean) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return { success: false as const, error: "Não autorizado." }
  }

  if (typeof enabled !== "boolean") {
    return { success: false as const, error: "Estado inválido." }
  }

  const result = await db.barbershop.updateMany({
    where: { ownerId: session.user.id },
    data: { acceptsBookings: enabled },
  })

  if (result.count !== 1) {
    return {
      success: false as const,
      error: "Barbearia não encontrada ou acesso não permitido.",
    }
  }

  const barbershop = await db.barbershop.findFirst({
    where: { ownerId: session.user.id },
    select: { id: true },
  })

  revalidatePath("/dashboard/configuracoes")
  revalidatePath("/")
  revalidatePath("/barbershops")
  if (barbershop) {
    revalidatePath(`/barbershops/${barbershop.id}`)
  }

  return { success: true as const, enabled }
}
