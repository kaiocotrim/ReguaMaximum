// app/_actions/inviteBarber.ts
"use server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/app/_lib/prisma"

export async function inviteBarber(userId: string, barbershopId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Não autenticado")

  const inviterId = session.user.id

  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7)

  const invite = await db.barbershopInvite.create({
    data: {
      inviteeId: userId,
      barbershopId,
      inviterId,
      expiresAt,
    },
  })

  return invite
}