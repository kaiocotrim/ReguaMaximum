import { db } from "@/app/_lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getServices() {
  

  const session = await getServerSession(authOptions);

  

  if (!session?.user) {
    throw new Error("Usuário não autenticado.");
  }



  const barbershop = await db.barbershop.findFirst({
    where: {
      ownerId: (session.user as any).id,
    },
    include: {
      services: true,
    },
  });



  if (!barbershop) {
    return [];
  }

 
  return barbershop.services;
}