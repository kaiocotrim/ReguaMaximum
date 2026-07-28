"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/app/_lib/prisma"
import { revalidatePath } from "next/cache"

export async function acceptInvite(inviteId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Não autenticado")

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      await db.$transaction(
        async (tx) => {
          const invite = await tx.barbershopInvite.findUnique({
            where: { id: inviteId },
            select: {
              id: true,
              barbershopId: true,
              inviteeId: true,
              status: true,
              expiresAt: true,
            },
          })

          if (!invite || invite.inviteeId !== session.user.id) {
            throw new Error("Convite inválido")
          }

          const now = new Date()
          if (invite.status !== "PENDING" || invite.expiresAt <= now) {
            throw new Error("Este convite não está mais disponível")
          }

          const barber = await tx.barber.findUnique({
            where: { userId: session.user.id },
            select: { barbershopId: true },
          })

          if (!barber) {
            throw new Error("Perfil de barbeiro não encontrado")
          }

          if (barber.barbershopId) {
            throw new Error(
              "Você já faz parte de uma barbearia. Saia da equipe atual antes de aceitar outro convite.",
            )
          }

          const linked = await tx.barber.updateMany({
            where: {
              userId: session.user.id,
              barbershopId: null,
            },
            data: { barbershopId: invite.barbershopId },
          })

          if (linked.count !== 1) {
            throw new Error(
              "Você já faz parte de uma barbearia. Saia da equipe atual antes de aceitar outro convite.",
            )
          }

          const consumed = await tx.barbershopInvite.deleteMany({
            where: {
              id: invite.id,
              inviteeId: session.user.id,
              status: "PENDING",
              expiresAt: { gt: now },
            },
          })

          if (consumed.count !== 1) {
            throw new Error("Este convite não está mais disponível")
          }
        },
        { isolationLevel: "Serializable" },
      )
      break
    } catch (error) {
      const code = (error as { code?: string }).code
      if (code === "P2034" && attempt === 0) continue
      throw error
    }
  }

  revalidatePath("/dashboard/inbox")
}

export async function rejectInvite(inviteId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Não autenticado")

  const invite = await db.barbershopInvite.findUnique({
    where: { id: inviteId },
  })

  if (!invite || invite.inviteeId !== session.user.id) {
    throw new Error("Convite inválido")
  }

  await db.barbershopInvite.delete({ where: { id: inviteId } })

  revalidatePath("/dashboard/inbox")
}
