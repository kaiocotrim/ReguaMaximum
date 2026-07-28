"use server"

import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"

import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/app/_lib/prisma"

async function reassignActiveBookingsAndDetach(input: {
  barberId: string
  barbershopId: string
  ownerId: string
  memberUserId: string
}) {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      await db.$transaction(
        async (tx) => {
          const membership = await tx.barber.findFirst({
            where: {
              id: input.barberId,
              userId: input.memberUserId,
              barbershopId: input.barbershopId,
              barbershop: { ownerId: input.ownerId },
            },
            select: { id: true },
          })

          if (!membership) {
            throw new Error("O barbeiro não faz mais parte desta barbearia")
          }

          const ownerBarber = await tx.barber.findFirst({
            where: {
              userId: input.ownerId,
              barbershopId: input.barbershopId,
            },
            select: { id: true },
          })

          if (!ownerBarber) {
            throw new Error(
              "O perfil de barbeiro do dono não está vinculado à barbearia",
            )
          }

          await tx.booking.updateMany({
            where: {
              barberId: membership.id,
              barbershopId: input.barbershopId,
              status: "EM_ANDAMENTO",
            },
            data: { barberId: ownerBarber.id },
          })

          const detached = await tx.barber.updateMany({
            where: {
              id: membership.id,
              userId: input.memberUserId,
              barbershopId: input.barbershopId,
            },
            data: { barbershopId: null },
          })

          if (detached.count !== 1) {
            throw new Error("Não foi possível desvincular o barbeiro")
          }
        },
        { isolationLevel: "Serializable" },
      )
      return
    } catch (error) {
      const code = (error as { code?: string }).code
      if (code === "P2034" && attempt === 0) continue
      throw error
    }
  }
}

export async function leaveBarbershop() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Não autenticado")

  const barber = await db.barber.findUnique({
    where: { userId: session.user.id },
    select: {
      id: true,
      barbershopId: true,
      barbershop: { select: { ownerId: true } },
    },
  })

  if (!barber?.barbershopId) {
    throw new Error("Você não está vinculado a uma barbearia")
  }

  if (barber.barbershop?.ownerId === session.user.id) {
    throw new Error("O dono não pode sair da própria barbearia")
  }

  if (!barber.barbershop?.ownerId) {
    throw new Error("Não foi possível identificar o dono da barbearia")
  }

  await reassignActiveBookingsAndDetach({
    barberId: barber.id,
    barbershopId: barber.barbershopId,
    ownerId: barber.barbershop.ownerId,
    memberUserId: session.user.id,
  })

  revalidatePath("/minha-barbearia")
  revalidatePath("/portifolio")
}

export async function removeBarberFromBarbershop(barberId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Não autenticado")

  const barber = await db.barber.findFirst({
    where: {
      id: barberId,
      barbershop: { ownerId: session.user.id },
    },
    select: { id: true, userId: true, barbershopId: true },
  })

  if (!barber?.barbershopId) {
    throw new Error("Barbeiro não encontrado nesta barbearia")
  }

  if (barber.userId === session.user.id) {
    throw new Error("O dono não pode remover a si mesmo")
  }

  await reassignActiveBookingsAndDetach({
    barberId: barber.id,
    barbershopId: barber.barbershopId,
    ownerId: session.user.id,
    memberUserId: barber.userId,
  })

  revalidatePath("/dashboard/barbeiros")
}
