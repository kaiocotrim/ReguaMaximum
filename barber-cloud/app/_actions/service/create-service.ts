"use server"

import { db } from "@/app/_lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function createService(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    throw new Error("Usuário não autenticado.")
  }

  const barbershop = await db.barbershop.findFirst({
    where: {
      ownerId: (session.user as any).id,
    },
  })

  if (!barbershop) {
    throw new Error("Barbearia não encontrada.")
  }

  await db.barbeshopService.create({
    data: {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: Number(formData.get("price")),
      duration: Number(formData.get("duration")),
      imageUrl: "",
      barbershopId: barbershop.id,
    },
  })

  revalidatePath("/dashboard/servicos")

  redirect("/dashboard/servicos")
}
