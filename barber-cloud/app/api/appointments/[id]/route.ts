import { db } from "@/app/_lib/prisma"
import { NextResponse } from "next/server"

// Manipulador de requisição DELETE

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await db.Booking.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(
      { message: "Agendamento cancelado com sucesso." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao cancelar o agendamento." },
      { status: 500 }
    );
  }
}