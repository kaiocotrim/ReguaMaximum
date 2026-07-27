"use server"

import { db } from "@/app/_lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { revalidatePath } from "next/cache"

export async function createService(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("Usuário não autenticado.")
  }

  const barbershop = await db.barbershop.findFirst({
    where: {
      ownerId: session.user.id,
    },
  })

  if (!barbershop) {
    throw new Error("Barbearia não encontrada.")
  }

  const imageUrl = String(formData.get("imageUrl") ?? "").trim()
  if (!imageUrl.startsWith("https://")) {
    throw new Error("Imagem inválida.")
  }

  await db.barbeshopService.create({
    data: {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: Number(formData.get("price")),
      duration: Number(formData.get("duration")),
      imageUrl,
      barbershopId: barbershop.id,
    },
  })

  revalidatePath("/dashboard/servicos")
}
