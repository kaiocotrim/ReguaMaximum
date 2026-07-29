"use server"

import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"

import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/app/_lib/prisma"

export async function toggleFavoriteBarber(barberId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Faça login para salvar profissionais.")

  const barber = await db.barber.findUnique({
    where: { id: barberId },
    select: { id: true },
  })
  if (!barber) throw new Error("Profissional não encontrado.")

  const existing = await db.favoriteBarber.findUnique({
    where: {
      userId_barberId: { userId: session.user.id, barberId },
    },
    select: { id: true },
  })

  if (existing) {
    await db.favoriteBarber.delete({ where: { id: existing.id } })
  } else {
    await db.favoriteBarber.create({
      data: { userId: session.user.id, barberId },
    })
  }

  revalidatePath("/appointments")
  return { favorited: !existing }
}
