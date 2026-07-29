"use server";

import { db } from "@/app/_lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { assertAllowedImageUrl } from "@/app/_lib/image-url";

export async function updateService(
  id: string,
  formData: FormData
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Não autorizado.")

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = Number(formData.get("price"));
  const duration = Number(formData.get("duration"));
  const imageUrl = assertAllowedImageUrl(
    formData.get("imageUrl"),
    "Imagem inválida.",
  )


  const result = await db.barbeshopService.updateMany({
    where: {
      id,
      barbershop: { ownerId: session.user.id },
    },

    data: {
      name,
      description,
      price,
      duration,
      imageUrl,
    },
  });

  if (result.count === 0) throw new Error("Serviço não encontrado.")

  revalidatePath("/dashboard/servicos");
}
