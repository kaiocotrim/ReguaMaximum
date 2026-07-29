import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/app/_lib/prisma";
import { NextResponse } from "next/server";
import { normalizeAllowedImageUrl } from "@/app/_lib/image-url";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const avatar = normalizeAllowedImageUrl(body.avatar)
    if (!avatar) {
      return NextResponse.json({ error: "Foto obrigatória." }, { status: 400 })
    }

    const client = await db.$transaction(async (tx) => {
      const client = await tx.client.create({
        data: {
          userId: session.user.id,
          nome: body.nome,
          avatar,
          cidade: body.cidade,
        },
      });

      await tx.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          role: "CLIENT",
          telefone: body.telefone,
          image: avatar,
        },
      });

      return client;
    });

    return NextResponse.json(client);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erro ao criar perfil" },
      { status: 500 }
    );
  }
}
