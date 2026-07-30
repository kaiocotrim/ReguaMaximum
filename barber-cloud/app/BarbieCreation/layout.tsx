import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

import { PlanLicenseStatus, UserRole } from "@/app/generated/prisma/client"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/app/_lib/prisma"

export default async function BarbershopCreationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) redirect("/login")

  const [user, barber, ownedBarbershop, claimedLicense] = await Promise.all([
    db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    }),
    db.barber.findUnique({
      where: { userId: session.user.id },
      select: { barbershopId: true },
    }),
    db.barbershop.findFirst({
      where: { ownerId: session.user.id },
      select: { id: true },
    }),
    db.planLicense.findFirst({
      where: {
        claimedById: session.user.id,
        status: PlanLicenseStatus.CLAIMED,
        barbershopId: null,
      },
      select: { id: true },
    }),
  ])

  if (user?.role !== UserRole.BARBER || !barber) redirect("/inicio")
  if (ownedBarbershop) redirect("/dashboard")
  if (barber.barbershopId || !claimedLicense) redirect("/minha-barbearia")

  return children
}
