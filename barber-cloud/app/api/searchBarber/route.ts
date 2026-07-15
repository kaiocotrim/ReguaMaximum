import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/_lib/prisma"; // ajuste o caminho do seu client Prisma

export async function GET(req: NextRequest) {
  // 1. Pega o texto pesquisado da URL, ex: /api/search?q=camiseta
  const query = req.nextUrl.searchParams.get("q")?.trim() || "";

  // 2. Se não digitou nada, retorna lista vazia (evita trazer o banco inteiro)
  if (!query) {
    return NextResponse.json([]);
  }

  // 3. Consulta o banco filtrando pelo texto
 
  const barbeiros = await db.barber.findMany({
    where: {
      user: {                        // nome da relação no schema
        email: {
          contains: query,
          mode: "insensitive",
        },
      },
    },
    select: {
      id: true,
      user: {
        select: {
          email: true,
        },
      },
    },
    take: 10,
  });

  return NextResponse.json(barbeiros);
}