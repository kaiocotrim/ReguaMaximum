import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import Header from "@/app/_components/header"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/app/_lib/prisma"
import { BarberPortfolioManager } from "@/app/_components/BarberPortfolioManager"

export default async function PortfolioPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect("/login")

  const barber = await db.barber.findUnique({
    where: { userId: session.user.id },
    include: {
      user: { select: { name: true, image: true } },
      portfolioPhotos: {
        orderBy: [{ position: "asc" }, { createdAt: "asc" }],
      },
    },
  })

  if (!barber) redirect("/perfil")

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-6xl p-5 md:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Meu portfólio</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Apresente seu trabalho e suas especialidades aos clientes.
          </p>
        </div>
        <BarberPortfolioManager
          barber={{
            id: barber.id,
            name: barber.nome ?? barber.user.name ?? "Barbeiro",
            bio: barber.bio ?? "",
            city: barber.cidade ?? "",
            specialties: barber.especialidades,
            photos: barber.portfolioPhotos,
            avatar: barber.avatar ?? barber.user.image,
          }}
        />
      </main>
    </div>
  )
}
