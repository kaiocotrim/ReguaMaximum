import { getServerSession } from "next-auth"
import Image from "next/image"
import { redirect } from "next/navigation"
import { MapPin, Scissors, Star } from "lucide-react"

import Header from "@/app/_components/header"
import { Card } from "@/app/_components/ui/card"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/app/_lib/prisma"

export default async function MyBarbershopPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect("/login")

  const [ownedBarbershop, barber] = await Promise.all([
    db.barbershop.findFirst({
      where: { ownerId: session.user.id },
      select: { id: true },
    }),
    db.barber.findUnique({
      where: { userId: session.user.id },
      include: {
        barbershop: {
          include: {
            reviews: { select: { rating: true } },
          },
        },
      },
    }),
  ])

  if (ownedBarbershop) redirect("/dashboard")
  if (!barber) redirect("/perfil")

  const barbershop = barber.barbershop
  const reviewCount = barbershop?.reviews.length ?? 0
  const average =
    barbershop && reviewCount > 0
      ? barbershop.reviews.reduce(
          (total, review) => total + review.rating,
          0,
        ) / reviewCount
      : null

  return (
    <div className="min-h-screen bg-[#f5f7f3] dark:bg-zinc-950">
      <Header />
      <main className="mx-auto w-full max-w-5xl px-5 py-8 md:px-8 md:py-12">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#71910d] dark:text-[#C3F32C]">
            Minha equipe
          </p>
          <h1 className="mt-1 text-2xl font-bold md:text-3xl">
            Minha barbearia
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Consulte a barbearia à qual seu perfil profissional está vinculado.
          </p>
        </div>

        {barbershop ? (
          <Card className="overflow-hidden rounded-3xl border-border/60 shadow-sm">
            <div className="relative h-52 w-full md:h-72">
              <Image
                src={barbershop.capaUrl || barbershop.imageUrl}
                alt={barbershop.name}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute right-5 bottom-5 left-5 flex items-end gap-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border-2 border-white bg-card md:h-20 md:w-20">
                  <Image
                    src={barbershop.imageUrl}
                    alt={`Logo da ${barbershop.name}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 text-white">
                  <h2 className="truncate text-xl font-bold md:text-2xl">
                    {barbershop.name}
                  </h2>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-white/80">
                    <MapPin className="h-4 w-4 shrink-0" />
                    <span className="truncate">{barbershop.address}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 md:p-7">
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-xs text-muted-foreground">Avaliação</p>
                  <p className="mt-1 flex items-center gap-1.5 font-bold">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    {average === null ? "Novo" : average.toFixed(1)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Vínculo</p>
                  <p className="mt-1 flex items-center gap-1.5 font-bold">
                    <Scissors className="h-4 w-4 text-[#71910d] dark:text-[#C3F32C]" />
                    Barbeiro
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="flex min-h-64 flex-col items-center justify-center rounded-3xl border-dashed px-6 text-center">
            <Scissors className="h-9 w-9 text-muted-foreground/50" />
            <h2 className="mt-4 font-semibold">
              Você não está em uma barbearia
            </h2>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Quando você aceitar um convite, as informações da barbearia
              aparecerão aqui.
            </p>
          </Card>
        )}
      </main>
    </div>
  )
}
