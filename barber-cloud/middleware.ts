import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const { pathname } = req.nextUrl

  // Não logado tentando acessar /perfil → manda pro login
  if (pathname.startsWith("/perfil") && !token) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // Já logado E já tem perfil tentando acessar /perfil → manda pro início
  // (isso evita o usuário voltar pro /perfil depois de já ter cadastrado
  if (pathname.startsWith("/perfil") && token) {
    const profileResponse = await fetch(new URL("/api/user/profile-check", req.url))
    const profileData = await profileResponse.json()

    if (profileData.hasProfile) {
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/perfil/:path*", "/perfil"],
}