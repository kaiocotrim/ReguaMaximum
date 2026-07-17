"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/app/_lib/prisma"
import { revalidatePath } from "next/cache"

export async function acceptInvite(inviteId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Não autenticado")

  const invite = await db.barbershopInvite.findUnique({
    where: { id: inviteId },
  })

  if (!invite || invite.inviteeId !== session.user.id) {
    throw new Error("Convite inválido")
  }

  // Cria o vínculo do barbeiro com a barbearia e remove o convite
  await db.$transaction([
    db.barber.updateMany({
      where: { userId: session.user.id },
      data: { barbershopId: invite.barbershopId },
    }),
    db.barbershopInvite.delete({ where: { id: inviteId } }),
  ])

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