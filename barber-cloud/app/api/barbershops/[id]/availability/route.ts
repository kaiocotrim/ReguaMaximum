import { NextRequest, NextResponse } from "next/server"

import {
  getAvailableBarberIdsForDate,
  getAvailableTimesForBarber,
} from "@/app/_lib/create-booking"
import {
  consumeRateLimit,
  getClientIp,
} from "@/app/_lib/server-rate-limit"

const corsHeaders = {
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Origin": "*",
}

function json(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { ...corsHeaders, "Cache-Control": "no-store" },
  })
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders })
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id: barbershopId } = await context.params
  const serviceId = request.nextUrl.searchParams.get("serviceId")?.trim() ?? ""
  const barberId = request.nextUrl.searchParams.get("barberId")?.trim() ?? ""
  const date = request.nextUrl.searchParams.get("date")?.trim() ?? ""

  if (
    !barbershopId ||
    !serviceId ||
    barbershopId.length > 80 ||
    serviceId.length > 80 ||
    barberId.length > 80 ||
    !/^\d{4}-\d{2}-\d{2}$/.test(date)
  ) {
    return json({ error: "Parâmetros de disponibilidade inválidos." }, 400)
  }

  const rateLimit = consumeRateLimit({
    namespace: "public-mobile-availability",
    identifier: getClientIp(request.headers),
    limit: 90,
    windowMs: 60 * 1000,
  })

  if (!rateLimit.allowed) {
    const response = json(
      { error: "Muitas consultas. Aguarde um momento e tente novamente." },
      429,
    )
    response.headers.set("Retry-After", String(rateLimit.retryAfterSeconds))
    return response
  }

  if (barberId) {
    const result = await getAvailableTimesForBarber({
      barbershopId,
      serviceId,
      barberId,
      date,
    })

    return result.success
      ? json({ data: { times: result.times } })
      : json({ error: result.error, data: { times: [] } }, 400)
  }

  const result = await getAvailableBarberIdsForDate({
    barbershopId,
    serviceId,
    date,
  })

  return result.success
    ? json({
        data: {
          barberIds: result.barberIds,
          firstTimes: result.firstTimes,
        },
      })
    : json(
        {
          error: result.error,
          data: { barberIds: [], firstTimes: {} },
        },
        400,
      )
}
