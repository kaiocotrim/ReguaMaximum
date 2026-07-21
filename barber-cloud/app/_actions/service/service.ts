import { db } from "@/app/_lib/prisma";

export async function getService(id: string) {
  const service = await db.barbeshopService.findUnique({
    where: {
      id,
    },
  });

  return service;
}