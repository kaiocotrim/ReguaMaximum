"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/app/_lib/prisma"

export async function submitBookingReview(input: {
  bookingId: string
  rating: number
  comment: string
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return { success: false as const, error: "Faça login para avaliar." }
  }

  if (!Number.isInteger(input.rating) || input.rating < 0 || input.rating > 5) {
    return { success: false as const, error: "Selecione uma nota entre 0 e 5." }
  }

  const comment = input.comment.trim()
  if (comment.length > 500) {
    return {
      success: false as const,
      error: "O comentário deve ter no máximo 500 caracteres.",
    }
  }

  const booking = await db.booking.findFirst({
    where: {
      id: input.bookingId,
      userId: session.user.id,
      status: "CONCLUIDO",
      review: null,
    },
    select: { id: true, barberId: true },
  })

  if (!booking) {
    return {
      success: false as const,
      error: "Esta avaliação não está disponível ou já foi enviada.",
    }
  }

  try {
    await db.review.create({
      data: {
        bookingId: booking.id,
        barberId: booking.barberId,
        userId: session.user.id,
        rating: input.rating,
        comment: comment || null,
      },
    })
  } catch {
    return {
      success: false as const,
      error: "Esta avaliação já foi enviada.",
    }
  }

  revalidatePath("/")
  revalidatePath("/appointments")
  return { success: true as const }
}
