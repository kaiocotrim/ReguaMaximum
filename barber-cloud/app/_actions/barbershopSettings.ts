"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"

import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/app/_lib/prisma"
import { assertAllowedImageUrl } from "@/app/_lib/image-url"

export type BarbershopDetailsFormState = {
  success: boolean
  message: string
}

const getText = (formData: FormData, field: string) =>
  String(formData.get(field) ?? "").trim()

export async function updateBarbershopDetails(
  _previousState: BarbershopDetailsFormState,
  formData: FormData,
): Promise<BarbershopDetailsFormState> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return { success: false, message: "Não autorizado." }
  }

  const name = getText(formData, "name")
  const address = getText(formData, "address")
  const cidade = getText(formData, "cidade")
  const description = getText(formData, "description")
  const instagram = getText(formData, "instagram")
  const horarioAbertura = getText(formData, "horarioAbertura")
  const horarioFechamento = getText(formData, "horarioFechamento")
  const phones = getText(formData, "phones")
    .split(/[\n,;]/)
    .map((phone) => phone.trim())
    .filter(Boolean)

  if (name.length < 2 || name.length > 100) {
    return {
      success: false,
      message: "Informe um nome entre 2 e 100 caracteres.",
    }
  }

  if (address.length < 5 || address.length > 240) {
    return {
      success: false,
      message: "Informe um endereço válido de até 240 caracteres.",
    }
  }

  if (phones.length === 0 || phones.length > 3) {
    return {
      success: false,
      message: "Informe de 1 a 3 números de contato.",
    }
  }

  if (phones.some((phone) => phone.length < 8 || phone.length > 25)) {
    return {
      success: false,
      message: "Confira os números de contato informados.",
    }
  }

  if (
    cidade.length > 100 ||
    description.length > 1000 ||
    instagram.length > 100
  ) {
    return {
      success: false,
      message: "Um ou mais campos ultrapassaram o limite permitido.",
    }
  }

  const result = await db.barbershop.updateMany({
    where: { ownerId: session.user.id },
    data: {
      name,
      address,
      phones,
      cidade: cidade || null,
      description,
      instagram: instagram || null,
      horarioAbertura: horarioAbertura || null,
      horarioFechamento: horarioFechamento || null,
    },
  })

  if (result.count !== 1) {
    return {
      success: false,
      message: "Barbearia não encontrada ou acesso não permitido.",
    }
  }

  const barbershop = await db.barbershop.findFirst({
    where: { ownerId: session.user.id },
    select: { id: true },
  })

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/perfil")
  revalidatePath("/dashboard/configuracoes")
  revalidatePath("/")
  revalidatePath("/barbershops")
  if (barbershop) {
    revalidatePath(`/barbershops/${barbershop.id}`)
  }

  return { success: true, message: "Informações atualizadas com sucesso." }
}

export async function updateBarbershopBookingAvailability(enabled: boolean) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return { success: false as const, error: "Não autorizado." }
  }

  if (typeof enabled !== "boolean") {
    return { success: false as const, error: "Estado inválido." }
  }

  const result = await db.barbershop.updateMany({
    where: { ownerId: session.user.id },
    data: { acceptsBookings: enabled },
  })

  if (result.count !== 1) {
    return {
      success: false as const,
      error: "Barbearia não encontrada ou acesso não permitido.",
    }
  }

  const barbershop = await db.barbershop.findFirst({
    where: { ownerId: session.user.id },
    select: { id: true },
  })

  revalidatePath("/dashboard/configuracoes")
  revalidatePath("/")
  revalidatePath("/barbershops")
  if (barbershop) {
    revalidatePath(`/barbershops/${barbershop.id}`)
  }

  return { success: true as const, enabled }
}

function validateBrandImageUrl(value: string, label: string) {
  const candidate = value.trim()
  if (/^\/[a-zA-Z0-9/_-]+\.(?:png|jpe?g|webp)$/i.test(candidate)) {
    return candidate
  }
  return assertAllowedImageUrl(candidate, `A URL da ${label} não é permitida.`)
}

export async function updateBarbershopBrandImages(input: {
  imageUrl: string
  coverUrl: string
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return { success: false as const, error: "Não autorizado." }
  }

  let imageUrl: string
  let coverUrl: string | null
  try {
    imageUrl = validateBrandImageUrl(input.imageUrl, "foto de perfil")
    coverUrl = input.coverUrl.trim()
      ? validateBrandImageUrl(input.coverUrl, "foto de capa")
      : null
  } catch (error) {
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Imagem inválida.",
    }
  }

  const barbershop = await db.barbershop.findFirst({
    where: { ownerId: session.user.id },
    select: { id: true },
  })
  if (!barbershop) {
    return { success: false as const, error: "Barbearia não encontrada." }
  }

  await db.$transaction([
    db.barbershop.update({
      where: { id: barbershop.id },
      data: { imageUrl, capaUrl: coverUrl },
    }),
    db.auditLog.create({
      data: {
        barbershopId: barbershop.id,
        actorId: session.user.id,
        action: "BARBERSHOP_IMAGES_UPDATED",
        entityType: "Barbershop",
        entityId: barbershop.id,
      },
    }),
  ])

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/perfil")
  revalidatePath("/")
  revalidatePath("/barbershops")
  revalidatePath(`/barbershops/${barbershop.id}`)

  return { success: true as const }
}
