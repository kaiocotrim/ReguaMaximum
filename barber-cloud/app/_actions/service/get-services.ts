import { db } from "@/app/_lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getServices() {
  console.log("========== GET SERVICES ==========");

  const session = await getServerSession(authOptions);

  console.log("Session:", session);

  if (!session?.user) {
    throw new Error("Usuário não autenticado.");
  }

  console.log("User ID:", (session.user as any).id);

  const barbershop = await db.barbershop.findFirst({
    where: {
      ownerId: (session.user as any).id,
    },
    include: {
      services: true,
    },
  });

  console.log("Barbershop:", barbershop);

  if (!barbershop) {
    return [];
  }

  console.log("Services:", barbershop.services);

  return barbershop.services;
}