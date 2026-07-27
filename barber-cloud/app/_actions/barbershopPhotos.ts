"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/app/_lib/prisma"

async function ownedBarbershop(userId: string) {
  return db.barbershop.findFirst({
    where: { ownerId: userId },
    select: { id: true, _count: { select: { photos: true } } },
  })
}

export async function addBarbershopPhoto(imageUrl: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return { success: false as const, error: "Não autorizado." }
  }

  try {
    const url = new URL(imageUrl)
    if (url.protocol !== "https:") throw new Error()
  } catch {
    return { success: false as const, error: "URL da imagem inválida." }
  }

  const barbershop = await ownedBarbershop(session.user.id)
  if (!barbershop) {
    return { success: false as const, error: "Barbearia não encontrada." }
  }
  if (barbershop._count.photos >= 10) {
    return { success: false as const, error: "O carrossel aceita até 10 fotos." }
  }

  await db.barbershopPhoto.create({
    data: {
      barbershopId: barbershop.id,
      imageUrl,
      position: barbershop._count.photos,
    },
  })

  revalidatePath("/dashboard/perfil")
  revalidatePath(`/barbershops/${barbershop.id}`)
  return { success: true as const }
}

export async function deleteBarbershopPhoto(photoId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return { success: false as const, error: "Não autorizado." }
  }

  const result = await db.barbershopPhoto.deleteMany({
    where: {
      id: photoId,
      barbershop: { ownerId: session.user.id },
    },
  })

  if (result.count === 0) {
    return { success: false as const, error: "Foto não encontrada." }
  }

  revalidatePath("/dashboard/perfil")
  return { success: true as const }
}
