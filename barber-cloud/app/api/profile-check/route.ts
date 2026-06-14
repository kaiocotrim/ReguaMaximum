import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/app/_lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ hasProfile: false });
    }

    const barber = await db.barber.findUnique({
      where: { userId: session.user.id },
    });

    const client = await db.client.findUnique({
      where: { userId: session.user.id },
    });

    return NextResponse.json({ hasProfile: !!barber || !!client });
  } catch (error) {
    return NextResponse.json({ hasProfile: false });
  }
}