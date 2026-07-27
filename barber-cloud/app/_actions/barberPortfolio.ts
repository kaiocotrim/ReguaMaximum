"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/app/_lib/prisma"

async function ownBarber(userId: string) {
  return db.barber.findUnique({
    where: { userId },
    select: { id: true, _count: { select: { portfolioPhotos: true } } },
  })
}

export async function updateBarberPortfolio(input: {
  name: string
  bio: string
  city: string
  specialties: string[]
  image?: string
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return { success: false as const, error: "Não autorizado." }
  }

  const name = input.name.trim()
  const bio = input.bio.trim()
  const city = input.city.trim()
  const specialties = input.specialties
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 10)

  if (!name) {
    return { success: false as const, error: "Informe seu nome profissional." }
  }
  if (bio.length > 1000) {
    return { success: false as const, error: "A biografia aceita até 1.000 caracteres." }
  }
  if (input.image && !input.image.startsWith("https://")) {
    return { success: false as const, error: "Imagem inválida." }
  }

  const result = await db.$transaction(async (tx) => {
    const updated = await tx.barber.updateMany({
      where: { userId: session.user.id },
      data: {
        nome: name,
        bio: bio || null,
        cidade: city || null,
        especialidades: specialties,
        ...(input.image ? { avatar: input.image } : {}),
      },
    })
    if (input.image) {
      await tx.user.update({
        where: { id: session.user.id },
        data: { image: input.image },
      })
    }
    return updated
  })

  if (result.count === 0) {
    return { success: false as const, error: "Perfil de barbeiro não encontrado." }
  }

  revalidatePath("/portifolio")
  return { success: true as const }
}

export async function addBarberPortfolioPhoto(imageUrl: string) {
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

  const barber = await ownBarber(session.user.id)
  if (!barber) {
    return { success: false as const, error: "Perfil de barbeiro não encontrado." }
  }
  if (barber._count.portfolioPhotos >= 5) {
    return { success: false as const, error: "O portfólio aceita até 5 fotos." }
  }

  await db.barberPortfolioPhoto.create({
    data: {
      barberId: barber.id,
      imageUrl,
      position: barber._count.portfolioPhotos,
    },
  })

  revalidatePath("/portifolio")
  revalidatePath(`/barbers/${barber.id}`)
  return { success: true as const }
}

export async function deleteBarberPortfolioPhoto(photoId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return { success: false as const, error: "Não autorizado." }
  }

  const result = await db.barberPortfolioPhoto.deleteMany({
    where: { id: photoId, barber: { userId: session.user.id } },
  })

  if (result.count === 0) {
    return { success: false as const, error: "Foto não encontrada." }
  }

  revalidatePath("/portifolio")
  return { success: true as const }
}
