import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  CalendarDays,
  ChevronLeft,
  MapPin,
  MessageSquareText,
  Scissors,
  Star,
  Store,
  User,
} from "lucide-react"
import Header from "@/app/_components/header"
import { db } from "@/app/_lib/prisma"
import { normalizeAllowedImageUrl } from "@/app/_lib/image-url"

export default async function PublicBarberProfile({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const barber = await db.barber.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, image: true } },
      barbershop: { select: { id: true, name: true } },
      portfolioPhotos: {
        orderBy: [{ position: "asc" }, { createdAt: "asc" }],
      },
      reviews: {
        select: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true,
          user: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  })

  if (!barber) notFound()

  const name = barber.nome ?? barber.user.name ?? "Barbeiro"
  const avatar =
    normalizeAllowedImageUrl(barber.avatar) ??
    normalizeAllowedImageUrl(barber.user.image)
  const reviewCount = barber.reviews.length
  const average =
    reviewCount > 0
      ? barber.reviews.reduce((total, review) => total + review.rating, 0) /
        reviewCount
      : 0

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-5xl p-5 md:p-8">
        {barber.barbershop && (
          <Link
            href={`/barbershops/${barber.barbershop.id}`}
            className="mb-5 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            Voltar para {barber.barbershop.name}
          </Link>
        )}

        <section className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-[#C3F32C] bg-muted">
            {avatar ? (
              <Image src={avatar} alt={name} fill sizes="96px" className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center">
                <User className="h-9 w-9 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-semibold">{name}</h1>
            {barber.barbershop && (
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                <Store className="h-4 w-4" />
                {barber.barbershop.name}
              </p>
            )}
            {barber.cidade && (
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {barber.cidade}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-muted/60 px-4 py-3">
            <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
            <div>
              <p className="text-xl font-bold">
                {reviewCount > 0 ? average.toFixed(1) : "Novo"}
              </p>
              <p className="text-xs text-muted-foreground">
                {reviewCount} avaliaç{reviewCount === 1 ? "ão" : "ões"}
              </p>
            </div>
          </div>
          {barber.barbershop && (
            <Link
              href={`/barbershops/${barber.barbershop.id}#servicos`}
              className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#C3F32C] px-4 text-sm font-semibold text-black transition-colors hover:bg-[#b3e023]"
            >
              <CalendarDays className="h-4 w-4" />
              Agendar
            </Link>
          )}
        </section>

        {barber.bio && (
          <section className="mt-5 rounded-2xl border border-border bg-card p-5">
            <h2 className="font-semibold">Sobre meu trabalho</h2>
            <p className="mt-2 text-sm leading-relaxed text-foreground/80">{barber.bio}</p>
          </section>
        )}

        {barber.especialidades.length > 0 && (
          <section className="mt-5">
            <h2 className="mb-3 font-semibold">Especialidades</h2>
            <div className="flex flex-wrap gap-2">
              {barber.especialidades.map((specialty) => (
                <span key={specialty} className="inline-flex items-center gap-1.5 rounded-full bg-[#C3F32C]/15 px-3 py-1.5 text-sm font-medium">
                  <Scissors className="h-3.5 w-3.5" />
                  {specialty}
                </span>
              ))}
            </div>
          </section>
        )}

        <section className="mt-7">
          <h2 className="mb-3 font-semibold">Meus trabalhos</h2>
          {barber.portfolioPhotos.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">
              Este profissional ainda não adicionou fotos ao portfólio.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {barber.portfolioPhotos.map((photo, index) => (
                <div key={photo.id} className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
                  <Image src={photo.imageUrl} alt={`Trabalho ${index + 1} de ${name}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-8">
          <div className="mb-3 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-semibold">Avaliações dos clientes</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Experiências reais de atendimentos concluídos.
              </p>
            </div>
            <span className="shrink-0 text-sm text-muted-foreground">
              {reviewCount} avaliaç{reviewCount === 1 ? "ão" : "ões"}
            </span>
          </div>

          {reviewCount === 0 ? (
            <div className="rounded-2xl border border-dashed border-border px-6 py-12 text-center">
              <MessageSquareText className="mx-auto h-9 w-9 text-muted-foreground/40" />
              <p className="mt-3 text-sm font-medium">
                Este barbeiro ainda não recebeu avaliações.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {barber.reviews.map((review) => (
                <article
                  key={review.id}
                  className="rounded-2xl border border-border bg-card p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold">
                        {review.user.name ?? "Cliente"}
                      </p>
                      <div className="mt-1 flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-muted-foreground/25"
                            }`}
                          />
                        ))}
                        <span className="ml-1.5 text-xs font-semibold">
                          {review.rating}/5
                        </span>
                      </div>
                    </div>
                    <time
                      dateTime={review.createdAt.toISOString()}
                      className="shrink-0 text-xs text-muted-foreground"
                    >
                      {review.createdAt.toLocaleDateString("pt-BR")}
                    </time>
                  </div>
                  {review.comment ? (
                    <p className="mt-3 text-sm leading-relaxed text-foreground/80">
                      {review.comment}
                    </p>
                  ) : (
                    <p className="mt-3 text-xs italic text-muted-foreground">
                      Avaliação enviada sem comentário.
                    </p>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>

        {barber.barbershop && (
          <div className="mt-8 flex justify-center">
            <Link
              href={`/barbershops/${barber.barbershop.id}#servicos`}
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#C3F32C] px-6 text-sm font-semibold text-black transition-colors hover:bg-[#b3e023]"
            >
              <CalendarDays className="h-4 w-4" />
              Agendar com {name}
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
