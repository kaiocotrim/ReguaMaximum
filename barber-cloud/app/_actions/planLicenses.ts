"use server"

import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

import {
  PlanLicenseStatus,
  SubscriptionPlan,
  UserRole,
} from "@/app/generated/prisma/client"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import type {
  ActivateLicenseState,
  GenerateLicenseState,
} from "@/app/_lib/plan-license-action-state"
import {
  getLicenseAdminUser,
  isPublicLicenseGeneratorEnabled,
} from "@/app/_lib/license-admin"
import {
  getPlanDetails,
  isSubscriptionPlanCode,
} from "@/app/_lib/plan-license-config"
import {
  addDays,
  createLicensePreview,
  generatePlanLicenseCode,
  hashPlanLicenseCode,
  isValidPlanLicenseCode,
  normalizeBrazilianWhatsApp,
  normalizePlanLicenseCode,
} from "@/app/_lib/plan-license"
import { db } from "@/app/_lib/prisma"
import {
  consumeRateLimit,
  getClientIp,
} from "@/app/_lib/server-rate-limit"

function readOptionalText(
  formData: FormData,
  field: string,
  maxLength: number,
) {
  const value = formData.get(field)
  if (typeof value !== "string") return null

  const normalized = value.trim()
  return normalized ? normalized.slice(0, maxLength) : null
}

async function createUniqueLicenseCode(plan: SubscriptionPlan) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = generatePlanLicenseCode(plan)
    const codeHash = hashPlanLicenseCode(code)
    const existing = await db.planLicense.findUnique({
      where: { codeHash },
      select: { id: true },
    })

    if (!existing) return { code, codeHash }
  }

  throw new Error("Não foi possível gerar uma chave única.")
}

export async function generatePlanLicense(
  _previousState: GenerateLicenseState,
  formData: FormData,
): Promise<GenerateLicenseState> {
  const admin = await getLicenseAdminUser()

  if (!admin && !isPublicLicenseGeneratorEnabled()) {
    return {
      status: "error",
      message: "Você não possui permissão para gerar licenças.",
    }
  }

  if (!admin) {
    const requestHeaders = await headers()
    const rateLimit = consumeRateLimit({
      namespace: "public-license-generator",
      identifier: getClientIp(requestHeaders),
      limit: 20,
      windowMs: 60 * 60 * 1000,
    })

    if (!rateLimit.allowed) {
      return {
        status: "error",
        message:
          "Limite temporário de geração atingido. Aguarde antes de tentar novamente.",
      }
    }
  }

  const rawPlan = formData.get("plan")
  const rawDurationDays = formData.get("durationDays")
  const durationDays = Number(rawDurationDays)

  if (!isSubscriptionPlanCode(rawPlan)) {
    return { status: "error", message: "Selecione um plano válido." }
  }

  if (
    !Number.isInteger(durationDays) ||
    durationDays < 1 ||
    durationDays > 3650
  ) {
    return {
      status: "error",
      message: "A duração deve estar entre 1 e 3650 dias.",
    }
  }

  const customerName = readOptionalText(formData, "customerName", 100)
  const customerPhone = readOptionalText(formData, "customerPhone", 30)
  const notes = readOptionalText(formData, "notes", 500)
  const { code, codeHash } = await createUniqueLicenseCode(rawPlan)

  await db.planLicense.create({
    data: {
      codeHash,
      codePreview: createLicensePreview(code),
      plan: rawPlan,
      durationDays,
      customerName,
      customerPhone,
      notes,
      createdById: admin?.id ?? null,
    },
  })

  const phone = customerPhone
    ? normalizeBrazilianWhatsApp(customerPhone)
    : null
  const appUrl = (process.env.NEXTAUTH_URL ?? "http://localhost:3000").replace(
    /\/$/,
    "",
  )
  const plan = getPlanDetails(rawPlan)
  const message = [
    customerName ? `Olá, ${customerName}!` : "Olá!",
    "",
    "Sua chave de liberação da Régua Máxima foi gerada.",
    `Plano: ${plan.label}`,
    `Validade: ${durationDays} dias`,
    `Chave: ${code}`,
    "",
    `Para ativar, acesse: ${appUrl}/minha-barbearia`,
  ].join("\n")

  revalidatePath("/dashboard/licencas")

  return {
    status: "success",
    message:
      "Chave criada. Por segurança, copie agora: ela não será exibida novamente.",
    generatedKey: code,
    whatsappUrl: phone
      ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
      : null,
  }
}

export async function revokePlanLicense(formData: FormData) {
  const admin = await getLicenseAdminUser()
  if (!admin) throw new Error("Acesso negado.")

  const id = formData.get("licenseId")
  if (typeof id !== "string" || !/^[a-zA-Z0-9-]{20,40}$/.test(id)) {
    throw new Error("Licença inválida.")
  }

  await db.planLicense.updateMany({
    where: {
      id,
      status: { not: PlanLicenseStatus.REVOKED },
    },
    data: {
      status: PlanLicenseStatus.REVOKED,
      revokedAt: new Date(),
    },
  })

  revalidatePath("/dashboard/licencas")
}

export async function activatePlanLicense(
  _previousState: ActivateLicenseState,
  formData: FormData,
): Promise<ActivateLicenseState> {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return { status: "error", message: "Entre na sua conta para continuar." }
  }

  const rateLimit = consumeRateLimit({
    namespace: "activate-plan-license",
    identifier: session.user.id,
    limit: 10,
    windowMs: 15 * 60 * 1000,
  })

  if (!rateLimit.allowed) {
    return {
      status: "error",
      message: "Muitas tentativas. Aguarde alguns minutos e tente novamente.",
    }
  }

  const code = normalizePlanLicenseCode(formData.get("licenseKey"))

  if (!isValidPlanLicenseCode(code)) {
    return {
      status: "error",
      message: "Chave inválida ou indisponível.",
    }
  }

  const result = await db.$transaction(async (transaction) => {
    const [user, barber, ownedBarbershop, license] = await Promise.all([
      transaction.user.findUnique({
        where: { id: session.user.id },
        select: { role: true },
      }),
      transaction.barber.findUnique({
        where: { userId: session.user.id },
        select: { id: true, barbershopId: true },
      }),
      transaction.barbershop.findFirst({
        where: { ownerId: session.user.id },
        select: { id: true },
      }),
      transaction.planLicense.findUnique({
        where: { codeHash: hashPlanLicenseCode(code) },
        select: {
          id: true,
          status: true,
          durationDays: true,
        },
      }),
    ])

    if (user?.role !== UserRole.BARBER || !barber) {
      return {
        ok: false as const,
        message: "Apenas perfis de barbeiro podem ativar uma licença.",
      }
    }

    if (!ownedBarbershop && barber.barbershopId) {
      return {
        ok: false as const,
        message:
          "Você já faz parte de uma barbearia. Saia da equipe antes de criar a sua.",
      }
    }

    if (!license || license.status !== PlanLicenseStatus.AVAILABLE) {
      return {
        ok: false as const,
        message: "Chave inválida ou indisponível.",
      }
    }

    const now = new Date()

    if (ownedBarbershop) {
      const currentLicense = await transaction.planLicense.findFirst({
        where: {
          barbershopId: ownedBarbershop.id,
          status: PlanLicenseStatus.ACTIVE,
          expiresAt: { gt: now },
        },
        orderBy: { expiresAt: "desc" },
        select: { expiresAt: true },
      })
      const startsAt = currentLicense?.expiresAt ?? now
      const updated = await transaction.planLicense.updateMany({
        where: {
          id: license.id,
          status: PlanLicenseStatus.AVAILABLE,
        },
        data: {
          status: PlanLicenseStatus.ACTIVE,
          claimedById: session.user.id,
          barbershopId: ownedBarbershop.id,
          claimedAt: now,
          activatedAt: now,
          expiresAt: addDays(startsAt, license.durationDays),
        },
      })

      return updated.count === 1
        ? { ok: true as const, destination: "/dashboard" }
        : { ok: false as const, message: "Chave inválida ou indisponível." }
    }

    const existingClaim = await transaction.planLicense.findFirst({
      where: {
        claimedById: session.user.id,
        status: PlanLicenseStatus.CLAIMED,
        barbershopId: null,
      },
      select: { id: true },
    })

    if (existingClaim) {
      return {
        ok: false as const,
        message:
          "Você já possui uma chave validada. Continue a criação da barbearia.",
      }
    }

    const updated = await transaction.planLicense.updateMany({
      where: {
        id: license.id,
        status: PlanLicenseStatus.AVAILABLE,
      },
      data: {
        status: PlanLicenseStatus.CLAIMED,
        claimedById: session.user.id,
        claimedAt: now,
      },
    })

    return updated.count === 1
      ? { ok: true as const, destination: "/BarbieCreation" }
      : { ok: false as const, message: "Chave inválida ou indisponível." }
  })

  if (!result.ok) {
    return { status: "error", message: result.message }
  }

  redirect(result.destination)
}
