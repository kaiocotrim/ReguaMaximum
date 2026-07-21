"use server"

import { db } from "@/app/_lib/prisma"
import { revalidatePath } from "next/cache"

export async function deleteService(id: string) {
  if (!id) {
    throw new Error("ID do serviço não informado.")
  }

  const service = await db.barbeshopService.findUnique({
    where: { id },
    select: { barbershopId: true },
  })

  if (!service) {
    throw new Error("Serviço não encontrado.")
  }

  const totalServices = await db.barbeshopService.count({
    where: { barbershopId: service.barbershopId },
  })

  if (totalServices <= 1) {
    return {
      success: false as const,
      message:
        "Você precisa manter pelo menos 1 serviço cadastrado. Cadastre outro antes de excluir este.",
    }
  }

  const bookingsCount = await db.booking.count({
    where: { serviceId: id },
  })

  if (bookingsCount > 0) {
    return {
      success: false as const,
      message: `Este serviço não pode ser excluído porque possui ${bookingsCount} agendamento${
        bookingsCount !== 1 ? "s" : ""
      } vinculado${bookingsCount !== 1 ? "s" : ""}. Cancele ou conclua os agendamentos antes de excluir.`,
    }
  }

  try {
    await db.barbeshopService.delete({
      where: { id },
    })
  } catch (error: unknown) {
    const isForeignKeyError =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "P2003"

    if (isForeignKeyError) {
      return {
        success: false as const,
        message:
          "Este serviço não pode ser excluído pois está vinculado a outros registros.",
      }
    }
    throw error
  }

  revalidatePath("/dashboard/servicos")

  return { success: true as const }
}