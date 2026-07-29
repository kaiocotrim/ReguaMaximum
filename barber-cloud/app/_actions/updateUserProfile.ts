"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/app/_lib/prisma"
import { normalizeAllowedImageUrl } from "@/app/_lib/image-url"

export async function updateUserProfile(input: {
  name: string
  phone: string
  image?: string
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return { success: false as const, error: "Não autorizado." }
  }

  const name = input.name.trim()
  const phone = input.phone.replace(/\D/g, "")
  if (name.length < 2) {
    return { success: false as const, error: "Informe um nome válido." }
  }
  if (phone.length < 10) {
    return { success: false as const, error: "Informe um telefone válido." }
  }
  const image = input.image
    ? normalizeAllowedImageUrl(input.image)
    : undefined
  if (input.image && !image) {
    return { success: false as const, error: "Imagem inválida." }
  }

  await db.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: session.user.id },
      data: {
        name,
        telefone: phone,
        ...(image ? { image } : {}),
      },
    })
    await tx.client.updateMany({
      where: { userId: session.user.id },
      data: {
        nome: name,
        ...(image ? { avatar: image } : {}),
      },
    })
    await tx.barber.updateMany({
      where: { userId: session.user.id },
      data: {
        nome: name,
        ...(image ? { avatar: image } : {}),
      },
    })
  })

  revalidatePath("/")
  revalidatePath("/configuracoes")
  revalidatePath("/portifolio")
  return { success: true as const }
}
