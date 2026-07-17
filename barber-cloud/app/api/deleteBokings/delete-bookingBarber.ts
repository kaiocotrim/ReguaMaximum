"use server"

import { db } from "@/app/_lib/prisma"
import { revalidatePath } from "next/cache"

export async function deleteBooking(id: string) {
  await db.booking.delete({
    where: {
      id,
    },
  })

  revalidatePath("/dashboard") // ajuste a rota
}