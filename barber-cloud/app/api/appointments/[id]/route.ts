import { db } from "@/app/_lib/prisma"
import { NextResponse } from "next/server"

// Manipulador de requisição DELETE
export async function DELETE(
  request: Request,
  context: { params: { id: string } } // Usa-se `context` explicitamente
) {
  const { id } = context.params;  // Resolve `params` corretamente

  try {
    await db.booking.delete({
      where: {
        id,
      },
    })

    return NextResponse.json(
      { message: "Agendamento cancelado com sucesso!" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Erro ao cancelar consulta:", error);
    return NextResponse.json(
      { error: "Erro ao cancelar agendamento" },
      { status: 500 }
    )
  }
}
