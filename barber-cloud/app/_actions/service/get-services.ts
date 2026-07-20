import { db } from "@/app/_lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function ServicesPage() {
  const session = await getServerSession(authOptions);

  const barbershop = await db.barbershop.findFirst({
    where: {
      ownerId: (session?.user as any).id,
    },
    include: {
      services: true,
    },
  });

  return (
    <pre>{JSON.stringify(barbershop, null, 2)}</pre>
  );
}