import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import Header from "@/app/_components/header"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/app/_lib/prisma"
import { normalizeAllowedImageUrl } from "@/app/_lib/image-url"
import { BarberPortfolioManager } from "@/app/_components/BarberPortfolioManager"
import { BarberMembershipButton } from "@/app/_components/BarberMembershipButton"
import { Card } from "@/app/_components/ui/card"

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
      barbershop: {
        select: { id: true, name: true },
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
            photos: barber.portfolioPhotos.map((photo) => ({
              id: photo.id,
              imageUrl: photo.imageUrl,
            })),
            avatar:
              normalizeAllowedImageUrl(barber.avatar) ??
              normalizeAllowedImageUrl(barber.user.image),
          }}
        />

        {barber.barbershop && (
          <Card className="mt-8 rounded-2xl border-red-500/20 p-5 shadow-sm md:p-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-red-500">
                  Gerenciar vínculo
                </p>
                <h2 className="mt-1 text-lg font-semibold">
                  Sair da {barber.barbershop.name}
                </h2>
                <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                  Ao sair, você deixará de aparecer na equipe e não receberá
                  novos agendamentos desta barbearia. Seu perfil, avaliações,
                  portfólio e histórico serão preservados.
                </p>
              </div>
              <BarberMembershipButton mode="leave" />
            </div>
          </Card>
        )}
      </main>
    </div>
  )
}
