import { db } from "@/app/_lib/prisma"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth"

export async function getService(id: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return null

  const service = await db.barbeshopService.findFirst({
    where: {
      id,
      barbershop: { ownerId: session.user.id },
    },
  })

  return service
}
