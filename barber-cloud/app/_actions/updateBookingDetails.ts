"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/app/_lib/prisma"

interface UpdateBookingDetailsInput {
  bookingId: string
  barberId: string
  serviceId: string
  date: string
  attendance: "PENDENTE" | "COMPARECEU" | "FALTOU"
  notes: string
}

export async function updateBookingDetails(input: UpdateBookingDetailsInput) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return { success: false as const, error: "Não autorizado." }
  }

  const date = new Date(input.date)
  if (Number.isNaN(date.getTime())) {
    return { success: false as const, error: "Data ou horário inválido." }
  }

  if (!["PENDENTE", "COMPARECEU", "FALTOU"].includes(input.attendance)) {
    return { success: false as const, error: "Situação de comparecimento inválida." }
  }

  const notes = input.notes.trim()
  if (notes.length > 500) {
    return {
      success: false as const,
      error: "As observações devem ter no máximo 500 caracteres.",
    }
  }

  let result:
    | { success: true }
    | { success: false; error: string }
    | undefined

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      result = await db.$transaction(
        async (tx) => {
          const booking = await tx.booking.findFirst({
            where: {
              id: input.bookingId,
              status: "EM_ANDAMENTO",
              barbershop: { ownerId: session.user.id },
            },
            select: { id: true, barbershopId: true },
          })

          if (!booking) {
            return {
              success: false as const,
              error:
                "Agendamento não encontrado ou não está em andamento.",
            }
          }

          const barber = await tx.barber.findFirst({
            where: {
              id: input.barberId,
              barbershopId: booking.barbershopId,
            },
            select: { id: true },
          })
          const service = await tx.barbeshopService.findFirst({
            where: {
              id: input.serviceId,
              barbershopId: booking.barbershopId,
            },
            select: { id: true, duration: true },
          })

          if (!barber || !service) {
            return {
              success: false as const,
              error:
                "O barbeiro ou serviço selecionado não pertence a esta barbearia.",
            }
          }

          const longestService = await tx.barbeshopService.aggregate({
            where: { barbershopId: booking.barbershopId },
            _max: { duration: true },
          })
          const desiredEnd = date.getTime() + service.duration * 60_000
          const conflictSearchStart = new Date(
            date.getTime() -
              (longestService._max.duration ?? service.duration) * 60_000,
          )

          const otherBookings = await tx.booking.findMany({
            where: {
              id: { not: booking.id },
              barberId: barber.id,
              status: { not: "CANCELADO" },
              date: {
                gte: conflictSearchStart,
                lt: new Date(desiredEnd),
              },
            },
            select: {
              date: true,
              service: { select: { duration: true } },
            },
          })

          const hasConflict = otherBookings.some((other) => {
            const otherStart = other.date.getTime()
            const otherEnd =
              otherStart + other.service.duration * 60_000
            return date.getTime() < otherEnd && desiredEnd > otherStart
          })

          if (hasConflict) {
            return {
              success: false as const,
              error: "Esse barbeiro já possui outro agendamento nesse horário.",
            }
          }

          const updated = await tx.booking.updateMany({
            where: {
              id: booking.id,
              status: "EM_ANDAMENTO",
              barbershop: { ownerId: session.user.id },
            },
            data: {
              barberId: barber.id,
              serviceId: service.id,
              date,
              attendance: input.attendance,
              notes: notes || null,
            },
          })

          if (updated.count !== 1) {
            return {
              success: false as const,
              error:
                "Agendamento não encontrado ou não está em andamento.",
            }
          }

          return { success: true as const }
        },
        { isolationLevel: "Serializable" },
      )
      break
    } catch (error) {
      const code = (error as { code?: string }).code
      if (code === "P2034" && attempt === 0) continue

      console.error("Erro ao atualizar detalhes do agendamento:", error)
      return {
        success: false as const,
        error: "Não foi possível atualizar o agendamento.",
      }
    }
  }

  if (!result) {
    return {
      success: false as const,
      error: "Não foi possível atualizar o agendamento.",
    }
  }

  if (!result.success) return result

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/agendamentos")
  return { success: true as const }
}
