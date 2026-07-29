import { NextResponse } from "next/server"

export async function POST() {
  const response = NextResponse.json(
    { error: "Use o fluxo de autenticação da aplicação" },
    { status: 410 },
  )
  response.headers.set("Cache-Control", "no-store")
  return response
}
