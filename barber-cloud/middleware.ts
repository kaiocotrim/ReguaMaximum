import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const { pathname } = req.nextUrl

  // 🚫 PROTEÇÃO BARBER (NOVO)
  if (pathname.startsWith("/barber") && token?.role !== "BARBER") {
    return NextResponse.redirect(new URL("/", req.url))
  }

  // 🚫 Não logado tentando acessar /perfil → login
  if (pathname.startsWith("/perfil") && !token) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // 🚫 Já tem perfil → manda pra home
  if (pathname.startsWith("/perfil") && token) {
    const profileResponse = await fetch(
      new URL("/api/user/profile-check", req.url)
    )
    const profileData = await profileResponse.json()

    if (profileData.hasProfile) {
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/perfil/:path*", "/perfil", "/barber/:path*"],
}