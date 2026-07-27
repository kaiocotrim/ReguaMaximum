"use client"

import { useState, type ReactNode } from "react"
import { MessageSquareText, Scissors, Star } from "lucide-react"

interface BarbershopReviewItem {
  id: string
  rating: number
  comment: string | null
  clientName: string
  createdAt: string
}

export function BarbershopContentTabs({
  services,
  reviews,
  average,
}: {
  services: ReactNode
  reviews: BarbershopReviewItem[]
  average: number
}) {
  const [tab, setTab] = useState<"services" | "reviews">("services")

  return (
    <section id="servicos" className="scroll-mt-6 px-6 pt-8">
      <div className="mb-5 grid grid-cols-2 rounded-xl border border-border bg-muted/40 p-1">
        <button
          type="button"
          onClick={() => setTab("services")}
          className={`flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-colors ${
            tab === "services"
              ? "bg-[#C3F32C] text-black shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Scissors className="h-4 w-4" />
          Serviços
        </button>
        <button
          type="button"
          onClick={() => setTab("reviews")}
          className={`flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-colors ${
            tab === "reviews"
              ? "bg-[#C3F32C] text-black shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <MessageSquareText className="h-4 w-4" />
          Avaliações
        </button>
      </div>

      {tab === "services" ? (
        services
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Média geral
              </p>
              <div className="mt-1 flex items-center gap-2">
                <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
                <span className="text-2xl font-bold">
                  {reviews.length > 0 ? average.toFixed(1) : "—"}
                </span>
                <span className="text-sm text-muted-foreground">de 5</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{reviews.length}</p>
              <p className="text-xs text-muted-foreground">
                {reviews.length === 1 ? "avaliação recebida" : "avaliações recebidas"}
              </p>
            </div>
          </div>

          {reviews.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
              <MessageSquareText className="mx-auto h-9 w-9 text-muted-foreground/50" />
              <p className="mt-3 text-sm font-medium">
                Ainda não existem avaliações para esta barbearia.
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                As avaliações aparecerão aqui após atendimentos concluídos.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map((review) => (
                <article
                  key={review.id}
                  className="rounded-2xl border border-border bg-card p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold">{review.clientName}</p>
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
                      dateTime={review.createdAt}
                      className="shrink-0 text-xs text-muted-foreground"
                    >
                      {new Date(review.createdAt).toLocaleDateString("pt-BR")}
                    </time>
                  </div>
                  {review.comment && (
                    <p className="mt-3 text-sm leading-relaxed text-foreground/80">
                      {review.comment}
                    </p>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  )
}
