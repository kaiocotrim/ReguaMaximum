import { NextRequest, NextResponse } from "next/server"

import { db } from "@/app/_lib/prisma"

const corsHeaders = {
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Origin": "*",
}

function json(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      ...corsHeaders,
      "Cache-Control": "no-store",
    },
  })
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders })
}

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams.get("search")?.trim() ?? ""
  const service = request.nextUrl.searchParams.get("service")?.trim() ?? ""

  if (search.length > 80 || service.length > 80) {
    return json({ error: "Busca inválida." }, 400)
  }

  try {
    const barbershops = await db.barbershop.findMany({
      where: {
        AND: [
          search
            ? {
                OR: [
                  { name: { contains: search, mode: "insensitive" } },
                  { address: { contains: search, mode: "insensitive" } },
                  { cidade: { contains: search, mode: "insensitive" } },
                  {
                    services: {
                      some: {
                        OR: [
                          { name: { contains: search, mode: "insensitive" } },
                          {
                            description: {
                              contains: search,
                              mode: "insensitive",
                            },
                          },
                        ],
                      },
                    },
                  },
                ],
              }
            : {},
          service
            ? {
                services: {
                  some: {
                    name: { contains: service, mode: "insensitive" },
                  },
                },
              }
            : {},
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 30,
      select: {
        id: true,
        name: true,
        address: true,
        cidade: true,
        imageUrl: true,
        capaUrl: true,
        acceptsBookings: true,
        latitude: true,
        longitude: true,
        reviews: { select: { rating: true } },
      },
    })

    return json({
      data: barbershops.map(({ reviews, ...barbershop }) => {
        const reviewCount = reviews.length
        const averageRating = reviewCount
          ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
          : null

        return {
          ...barbershop,
          reviewCount,
          averageRating,
        }
      }),
    })
  } catch (error) {
    console.error("Failed to list barbershops for the mobile app:", error)
    return json({ error: "Não foi possível carregar as barbearias." }, 500)
  }
}
