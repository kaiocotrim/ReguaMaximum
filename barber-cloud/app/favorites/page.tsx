import Header from "../_components/header"
import BarbershopItem from "../_components/barbershop-item"
import { db } from "../_lib/prisma"
import { Heart, Scissors } from "lucide-react"
import Image from "next/image"
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"    

const FavoritesPage = async () => {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/login")
  }

  const [favorites, favoriteBarbers] = await Promise.all([
    db.favoriteBarbershop.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        barbershop: {
          include: {
            reviews: { select: { rating: true } },
          },
        },
      },
    }),
    db.favoriteBarber.findMany({
      where: { userId: session.user.id },
      include: {
        barber: {
          select: {
            id: true,
            nome: true,
            avatar: true,
            jobTitle: true,
            barbershop: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ])


  return (
    <div className="min-h-screen bg-[#f5f7f3] dark:bg-zinc-950">
      <Header />

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <div className="overflow-hidden rounded-2xl border border-border/50 bg-card px-6 py-6 shadow-sm sm:px-8 lg:rounded-3xl lg:px-12 lg:py-10 lg:shadow-[0_18px_50px_rgba(37,79,80,0.10)]">
          {/* Badge */}

          {/* Texto + imagem */}
          <div className="flex min-h-[150px] items-center justify-between gap-6 lg:min-h-[220px]">
            <div className="max-w-xl flex-1">
              <div className="mb-4 flex items-center gap-1.5 text-[11px] font-bold tracking-[0.18em] text-[#71910d] uppercase dark:text-[#C3F32C] lg:text-xs">
                <Heart className="h-3 w-3 fill-[#C3F32C] text-[#C3F32C]" />
                <span>favoritos</span>
              </div>
              <h1 className="mb-2 text-xl leading-snug font-bold sm:text-2xl lg:text-4xl">
                Barbearias que você curte
              </h1>
              <p className="text-sm text-muted-foreground lg:text-base">
                Seus estabelecimentos salvos em um só lugar.
              </p>
            </div>

            <div className="flex w-[125px] shrink-0 items-center justify-center sm:w-[170px] lg:w-[260px]">
              <Image
                src="/favoritoOK1.png"
                alt="Favoritos"
                width={260}
                height={260}
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Rodapé */}
          <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-4 lg:mt-6 lg:pt-5">
            <span className="text-sm text-muted-foreground">
              <strong className="font-bold text-foreground">
                {favorites.length}
              </strong>{" "}
              {favorites.length === 1 ? "barbearia salva" : "barbearias salvas"}
            </span>
          </div>
        </div>
      {/* {favorites.length === 0 ? (
        <p className="text-muted-foreground px-5 text-sm">
          Você ainda não salvou nenhuma barbearia.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-5 p-5">
          {favorites.map((favorite) => (
            <BarbershopItem
              key={favorite.barbershop.id}
              barbershop={favorite.barbershop}
            />
          ))}
        </div>
      )} */}

      {favorites.length === 0 ? (
        <div className="mt-8 flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-5 py-10 text-center shadow-sm lg:mt-10">
          <Image
            src="/favoritoNot.png"
            alt="Nenhuma barbearia favorita"
            width={220}
            height={220}
            className="mb-4"
          />

          <h2 className="mb-2 text-lg font-medium">Nenhuma favorita ainda</h2>

          <p className="text-muted-foreground max-w-xs text-sm">
            Explore as barbearias e toque no coração para salvar suas favoritas.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:mt-10 lg:grid-cols-4 lg:gap-6">
          {favorites.map((favorite) => (
            <BarbershopItem
              key={favorite.barbershop.id}
              barbershop={favorite.barbershop}
            />
          ))}
        </div>
      )}

      <section className="mt-10">
        <div className="mb-4">
          <p className="text-xs font-bold uppercase tracking-wider text-[#71910d] dark:text-[#C3F32C]">
            Profissionais
          </p>
          <h2 className="mt-1 text-xl font-bold">Seus profissionais favoritos</h2>
        </div>
        {favoriteBarbers.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteBarbers.map(({ barber }) => (
              <a
                key={barber.id}
                href={
                  barber.barbershop
                    ? `/barbershops/${barber.barbershop.id}`
                    : "#"
                }
                className="flex items-center gap-3 rounded-2xl border bg-card p-4 transition-colors hover:border-[#9fc821]/60"
              >
                <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
                  {barber.avatar ? (
                    <Image
                      src={barber.avatar}
                      alt={barber.nome ?? "Profissional"}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  ) : (
                    <Scissors className="size-5 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    {barber.nome ?? "Profissional"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {barber.jobTitle}
                    {barber.barbershop ? ` · ${barber.barbershop.name}` : ""}
                  </p>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">
            Você ainda não salvou nenhum profissional.
          </p>
        )}
      </section>
      </main>
    </div>
  )
}

export default FavoritesPage
