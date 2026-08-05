import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { NextResponse } from "next/server";

import { db } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = String(body.email ?? "")
      .trim()
      .toLowerCase();

    const password = String(body.password ?? "");

    if (!email || !password) {
      return NextResponse.json(
        {
          error: "Informe o e-mail e a senha.",
        },
        {
          status: 400,
        },
      );
    }

    const user = await db.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        password: true,
      },
    });

    if (!user?.password) {
      return NextResponse.json(
        {
          error: "E-mail ou senha inválidos.",
        },
        {
          status: 401,
        },
      );
    }

    const passwordIsValid = await bcrypt.compare(
      password,
      user.password,
    );

    if (!passwordIsValid) {
      return NextResponse.json(
        {
          error: "E-mail ou senha inválidos.",
        },
        {
          status: 401,
        },
      );
    }

    const secret = process.env.MOBILE_JWT_SECRET;

    if (!secret) {
      console.error("MOBILE_JWT_SECRET não configurado.");

      return NextResponse.json(
        {
          error: "Erro interno de autenticação.",
        },
        {
          status: 500,
        },
      );
    }

    const token = await new SignJWT({
      name: user.name,
      email: user.email,
      role: user.role,
    })
      .setProtectedHeader({
        alg: "HS256",
      })
      .setSubject(user.id)
      .setIssuedAt()
      .setExpirationTime("30d")
      .sign(new TextEncoder().encode(secret));

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Erro no login celular:", error);

    return NextResponse.json(
      {
        error: "Não foi possível realizar o login.",
      },
      {
        status: 500,
      },
    );
  }
}