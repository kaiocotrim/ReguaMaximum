import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        {
          error: "Informe o e-mail e a senha.",
        },
        {
          status: 400,
        }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        {
          error: "E-mail ou senha inválidos.",
        },
        {
          status: 401,
        }
      );
    }

    const passwordIsValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordIsValid) {
      return NextResponse.json(
        {
          error: "E-mail ou senha inválidos.",
        },
        {
          status: 401,
        }
      );
    }

    const secret = process.env.MOBILE_JWT_SECRET;

    if (!secret) {
      throw new Error("MOBILE_JWT_SECRET não configurado.");
    }

    const token = await new SignJWT({
      email: user.email,
      role: user.role,
      name: user.name,
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
        role: user.role,
        image: user.image,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Erro interno.",
      },
      {
        status: 500,
      }
    );
  }
}