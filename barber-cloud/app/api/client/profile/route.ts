import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/app/_lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await req.json();

    const client = await db.client.create({
      data: {
        userId: session.user.id,
        nome: body.nome,
        avatar: body.avatar,
        cidade: body.cidade,
      },
    });

    return NextResponse.json(client);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao criar perfil" }, { status: 500 });
  }
}