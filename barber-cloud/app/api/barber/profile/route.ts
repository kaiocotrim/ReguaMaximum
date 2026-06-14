import { NextResponse } from "next/server";
import { auth } from "@/app/_providers/auth";
import { db } from "@/app/_lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const barber = await db.barber.create({
      data: {
        userId: session.user.id,
        nome: body.nome,
        avatar: body.avatar,
        bio: body.bio,
        cidade: body.cidade,
        especialidades: body.especialidades,
      },
    });

    return NextResponse.json(barber);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erro ao criar perfil" },
      { status: 500 }
    );
  }
}

