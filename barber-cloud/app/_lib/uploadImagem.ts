"use server"

import { randomUUID } from "node:crypto"
import { getServerSession } from "next-auth"

import { db } from "@/app/_lib/prisma"
import { consumeRateLimit } from "@/app/_lib/server-rate-limit"
import { getSupabaseAdmin } from "@/app/_lib/supabase-admin"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

const MAX_IMAGE_SIZE = 5 * 1024 * 1024

const IMAGE_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const

type ImageMimeType = keyof typeof IMAGE_TYPES

type ImageUploadContext =
  | { purpose: "account-avatar" }
  | { purpose: "barbershop-logo" }
  | { purpose: "barbershop-cover" }
  | { purpose: "service-image"; serviceId?: string }
  | { purpose: "barber-portfolio"; barberId: string }
  | { purpose: "barbershop-gallery"; barbershopId: string }

type UploadTarget = {
  bucket: "logos" | "capas"
  pathPrefix: string
}

function isSafeId(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    value.length <= 128 &&
    /^[a-zA-Z0-9_-]+$/.test(value)
  )
}

function hasBytes(
  bytes: Uint8Array,
  signature: readonly number[],
  offset = 0,
) {
  return signature.every((byte, index) => bytes[offset + index] === byte)
}

async function detectMimeType(file: File): Promise<ImageMimeType | null> {
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer())

  if (hasBytes(bytes, [0xff, 0xd8, 0xff])) return "image/jpeg"
  if (hasBytes(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return "image/png"
  }
  if (
    hasBytes(bytes, [0x52, 0x49, 0x46, 0x46]) &&
    hasBytes(bytes, [0x57, 0x45, 0x42, 0x50], 8)
  ) {
    return "image/webp"
  }

  return null
}

async function requireAccount(userId: string): Promise<UploadTarget> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { id: true },
  })

  if (!user) throw new Error("Usuário não encontrado.")

  return {
    bucket: "logos",
    pathPrefix: `avatars/${user.id}`,
  }
}

async function requireBarberForBrand(
  userId: string,
  purpose: "barbershop-logo" | "barbershop-cover",
): Promise<UploadTarget> {
  const [user, barber] = await Promise.all([
    db.user.findUnique({
      where: { id: userId },
      select: { role: true },
    }),
    db.barber.findUnique({
      where: { userId },
      select: { id: true },
    }),
  ])

  if (user?.role !== "BARBER" || !barber) {
    throw new Error("Apenas barbeiros podem enviar imagens da barbearia.")
  }

  return purpose === "barbershop-logo"
    ? {
        bucket: "logos",
        pathPrefix: `barbearias/${userId}/logo`,
      }
    : {
        bucket: "capas",
        pathPrefix: `barbearias/${userId}/capa`,
      }
}

async function requireOwnedServiceTarget(
  userId: string,
  serviceId?: unknown,
): Promise<UploadTarget> {
  if (serviceId !== undefined && !isSafeId(serviceId)) {
    throw new Error("Serviço inválido.")
  }

  const barbershop = serviceId
    ? await db.barbeshopService.findFirst({
        where: {
          id: serviceId,
          barbershop: { ownerId: userId },
        },
        select: { barbershopId: true },
      })
    : await db.barbershop.findFirst({
        where: { ownerId: userId },
        select: { id: true },
      })

  const barbershopId =
    barbershop && "barbershopId" in barbershop
      ? barbershop.barbershopId
      : barbershop?.id

  if (!barbershopId) {
    throw new Error("Barbearia ou serviço não encontrado.")
  }

  return {
    bucket: "capas",
    pathPrefix: `servicos/${barbershopId}`,
  }
}

async function requireOwnedPortfolioTarget(
  userId: string,
  barberId: unknown,
): Promise<UploadTarget> {
  if (!isSafeId(barberId)) throw new Error("Perfil de barbeiro inválido.")

  const barber = await db.barber.findFirst({
    where: { id: barberId, userId },
    select: {
      id: true,
      _count: { select: { portfolioPhotos: true } },
    },
  })

  if (!barber) throw new Error("Perfil de barbeiro não encontrado.")
  if (barber._count.portfolioPhotos >= 5) {
    throw new Error("O portfólio aceita até 5 fotos.")
  }

  return {
    bucket: "capas",
    pathPrefix: `portfolio/${barber.id}`,
  }
}

async function requireOwnedGalleryTarget(
  userId: string,
  barbershopId: unknown,
): Promise<UploadTarget> {
  if (!isSafeId(barbershopId)) throw new Error("Barbearia inválida.")

  const barbershop = await db.barbershop.findFirst({
    where: { id: barbershopId, ownerId: userId },
    select: {
      id: true,
      _count: { select: { photos: true } },
    },
  })

  if (!barbershop) throw new Error("Barbearia não encontrada.")
  if (barbershop._count.photos >= 10) {
    throw new Error("O carrossel aceita até 10 fotos.")
  }

  return {
    bucket: "capas",
    pathPrefix: `galeria/${barbershop.id}`,
  }
}

async function resolveUploadTarget(
  userId: string,
  context: ImageUploadContext,
): Promise<UploadTarget> {
  if (!context || typeof context !== "object" || !("purpose" in context)) {
    throw new Error("Finalidade de upload inválida.")
  }

  switch (context.purpose) {
    case "account-avatar":
      return requireAccount(userId)
    case "barbershop-logo":
    case "barbershop-cover":
      return requireBarberForBrand(userId, context.purpose)
    case "service-image":
      return requireOwnedServiceTarget(userId, context.serviceId)
    case "barber-portfolio":
      return requireOwnedPortfolioTarget(userId, context.barberId)
    case "barbershop-gallery":
      return requireOwnedGalleryTarget(userId, context.barbershopId)
    default:
      throw new Error("Finalidade de upload inválida.")
  }
}

export async function uploadImagem(
  arquivo: File,
  context: ImageUploadContext,
): Promise<string> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Não autorizado.")

  const rateLimit = consumeRateLimit({
    namespace: "image-upload",
    identifier: session.user.id,
    limit: 30,
    windowMs: 60 * 60 * 1000,
  })
  if (!rateLimit.allowed) {
    throw new Error("Muitos uploads. Aguarde antes de tentar novamente.")
  }

  if (!(arquivo instanceof File) || arquivo.size === 0) {
    throw new Error("Selecione uma imagem válida.")
  }
  if (arquivo.size > MAX_IMAGE_SIZE) {
    throw new Error("A imagem deve ter no máximo 5 MB.")
  }
  if (!(arquivo.type in IMAGE_TYPES)) {
    throw new Error("Use uma imagem JPG, PNG ou WEBP.")
  }

  const detectedMimeType = await detectMimeType(arquivo)
  if (!detectedMimeType || detectedMimeType !== arquivo.type) {
    throw new Error("O conteúdo do arquivo não corresponde a uma imagem válida.")
  }

  const target = await resolveUploadTarget(session.user.id, context)
  const extension = IMAGE_TYPES[detectedMimeType]
  const objectPath = `${target.pathPrefix}/${randomUUID()}.${extension}`
  const supabase = getSupabaseAdmin()

  const { error } = await supabase.storage
    .from(target.bucket)
    .upload(objectPath, arquivo, {
      cacheControl: "31536000",
      contentType: detectedMimeType,
      upsert: false,
    })

  if (error) {
    throw new Error("Não foi possível armazenar a imagem.")
  }

  const { data } = supabase.storage
    .from(target.bucket)
    .getPublicUrl(objectPath)

  if (!data.publicUrl) {
    throw new Error("Não foi possível obter a URL da imagem.")
  }

  return data.publicUrl
}
