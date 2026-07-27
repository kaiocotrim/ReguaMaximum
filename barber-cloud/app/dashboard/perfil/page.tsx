import Image from "next/image"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { Images, MapPin, MessageSquareText, Star, Store } from "lucide-react"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/app/_lib/prisma"
import { Card } from "@/app/_components/ui/card"
import { BarbershopGalleryManager } from "@/app/_components/dashboardComponents/BarbershopGalleryManager"

export default async function PerfilBarber({
  searchParams,
}: {
  searchParams: Promise<{ aba?: string }>
}) {
  const { aba } = await searchParams
  const activeTab = aba === "fotos" ? "fotos" : "avaliacoes"
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect("/login")

  const barbershop = await db.barbershop.findFirst({
    where: { ownerId: session.user.id },
    include: {
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
      photos: { orderBy: [{ position: "asc" }, { createdAt: "asc" }] },
    },
  })

  if (!barbershop) redirect("/criar-barbearia")

  const reviewCount = barbershop.reviews.length
  const average =
    reviewCount > 0
      ? barbershop.reviews.reduce(
          (total, review) => total + review.rating,
          0,
        ) / reviewCount
      : 0

  const ratingDistribution = [5, 4, 3, 2, 1, 0].map((rating) => ({
    rating,
    count: barbershop.reviews.filter((review) => review.rating === rating).length,
  }))

  return (
    <div className="py-5">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Perfil da barbearia</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Informações públicas e avaliações recebidas.
        </p>
      </div>

      <Card className="overflow-hidden border-border p-0">
        <div className="relative h-36 bg-muted md:h-44">
          {barbershop.capaUrl ? (
            <Image
              src={barbershop.capaUrl}
              alt={`Capa da ${barbershop.name}`}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Store className="h-12 w-12 text-muted-foreground/30" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
          <div className="relative -mt-14 h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-4 border-card bg-muted">
            <Image
              src={barbershop.imageUrl}
              alt={barbershop.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-xl font-semibold">{barbershop.name}</h2>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />
              {barbershop.address}
            </p>
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
        </div>
      </Card>

      <div className="mt-5 grid grid-cols-2 rounded-xl border border-border bg-muted/40 p-1">
        <Link
          href="/dashboard/perfil"
          className={`flex h-10 items-center justify-center gap-2 rounded-lg text-sm font-semibold ${
            activeTab === "avaliacoes"
              ? "bg-[#C3F32C] text-black"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Star className="h-4 w-4" />
          Avaliações
        </Link>
        <Link
          href="/dashboard/perfil?aba=fotos"
          className={`flex h-10 items-center justify-center gap-2 rounded-lg text-sm font-semibold ${
            activeTab === "fotos"
              ? "bg-[#C3F32C] text-black"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Images className="h-4 w-4" />
          Fotos do carrossel
        </Link>
      </div>

      {activeTab === "fotos" ? (
        <div className="mt-5">
          <BarbershopGalleryManager
            barbershopId={barbershop.id}
            photos={barbershop.photos}
          />
        </div>
      ) : (
      <div className="mt-5 grid gap-5 lg:grid-cols-[340px_1fr]">
        <Card className="h-fit border-border p-5">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-semibold">Resumo das notas</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Distribuição das avaliações recebidas
              </p>
            </div>
            <span className="text-2xl font-bold">
              {reviewCount > 0 ? average.toFixed(1) : "—"}
            </span>
          </div>
          <div className="mt-6 space-y-3.5">
            {ratingDistribution.map((item) => {
              const percentage =
                reviewCount > 0 ? (item.count / reviewCount) * 100 : 0

              return (
                <div
                  key={item.rating}
                  className="grid grid-cols-[42px_1fr_42px] items-center gap-2.5"
                >
                  <span className="flex items-center gap-1 text-xs font-semibold">
                    {item.rating}
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  </span>
                  <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full min-w-0 rounded-full bg-amber-400 transition-[width]"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-right text-xs tabular-nums text-muted-foreground">
                    {Math.round(percentage)}%
                  </span>
                </div>
              )
            })}
          </div>
        </Card>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">Avaliações recebidas</h2>
            <span className="text-xs text-muted-foreground">
              Mais recentes primeiro
            </span>
          </div>

          {reviewCount === 0 ? (
            <Card className="border-dashed border-border px-6 py-14 text-center">
              <MessageSquareText className="mx-auto h-9 w-9 text-muted-foreground/40" />
              <p className="mt-3 text-sm font-medium">
                Ainda não existem avaliações para esta barbearia.
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {barbershop.reviews.map((review) => (
                <Card key={review.id} className="border-border p-4">
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
                    <time className="text-xs text-muted-foreground">
                      {review.createdAt.toLocaleDateString("pt-BR")}
                    </time>
                  </div>
                  {review.comment && (
                    <p className="mt-3 text-sm leading-relaxed text-foreground/80">
                      {review.comment}
                    </p>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      )}
    </div>
  )
}
