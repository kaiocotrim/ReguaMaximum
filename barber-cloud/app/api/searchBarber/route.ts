import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"

import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/app/_lib/prisma"
import { consumeRateLimit } from "@/app/_lib/server-rate-limit"

export type BarberInviteAvailability =
  | "AVAILABLE"
  | "ALREADY_MEMBER"
  | "OTHER_BARBERSHOP"
  | "INVITE_PENDING"

function jsonNoStore(body: unknown, init?: { status?: number }) {
  const response = NextResponse.json(body, init)
  response.headers.set("Cache-Control", "no-store")
  return response
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return jsonNoStore({ error: "Não autenticado" }, { status: 401 })
  }

  const rateLimit = consumeRateLimit({
    namespace: "barber-search",
    identifier: session.user.id,
    limit: 30,
    windowMs: 60 * 1000,
  })

  if (!rateLimit.allowed) {
    const response = jsonNoStore(
      { error: "Muitas buscas. Aguarde um momento e tente novamente." },
      { status: 429 },
    )
    response.headers.set("Retry-After", String(rateLimit.retryAfterSeconds))
    return response
  }

  const query = req.nextUrl.searchParams.get("q")?.trim() ?? ""
  if (query.length < 3) return jsonNoStore([])
  if (query.length > 254) {
    return jsonNoStore({ error: "Busca inválida" }, { status: 400 })
  }

  const ownerBarbershop = await db.barbershop.findFirst({
    where: { ownerId: session.user.id },
    select: { id: true },
  })

  if (!ownerBarbershop) {
    return jsonNoStore(
      { error: "Barbearia não encontrada" },
      { status: 403 },
    )
  }

  const barbers = await db.barber.findMany({
    where: {
      user: {
        email: {
          contains: query,
          mode: "insensitive",
        },
      },
    },
    select: {
      id: true,
      userId: true,
      nome: true,
      barbershop: {
        select: {
          id: true,
          name: true,
        },
      },
      user: {
        select: {
          name: true,
          email: true,
          invitesReceived: {
            where: {
              barbershopId: ownerBarbershop.id,
              status: "PENDING",
              expiresAt: { gt: new Date() },
            },
            select: { id: true },
            take: 1,
          },
        },
      },
    },
    take: 10,
  })

  return jsonNoStore(
    barbers.map((barber) => {
      let availability: BarberInviteAvailability = "AVAILABLE"

      if (barber.barbershop?.id === ownerBarbershop.id) {
        availability = "ALREADY_MEMBER"
      } else if (barber.barbershop) {
        availability = "OTHER_BARBERSHOP"
      } else if (barber.user.invitesReceived.length > 0) {
        availability = "INVITE_PENDING"
      }

      return {
        id: barber.id,
        userId: barber.userId,
        nome: barber.nome ?? barber.user.name ?? "Barbeiro",
        user: { email: barber.user.email ?? "" },
        availability,
        currentBarbershopName: barber.barbershop?.name ?? null,
      }
    }),
  )
}
