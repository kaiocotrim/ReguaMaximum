"use client"

import { useState, useTransition } from "react"
import { BellRing, ChevronRight, Star } from "lucide-react"
import { toast } from "sonner"
import { submitBookingReview } from "@/app/_actions/submitBookingReview"
import { submitBarbershopReview } from "@/app/_actions/submitBarbershopReview"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog"

export interface PendingReview {
  id: string
  service: string
  barber: string
  barbershop: string
  date: string
  barberReviewed: boolean
  barbershopReviewed: boolean
}

export function PendingBookingReviews({
  initialReviews,
}: {
  initialReviews: PendingReview[]
}) {
  const [reviews, setReviews] = useState(initialReviews)
  const [ratings, setRatings] = useState<Record<string, number | null>>({})
  const [comments, setComments] = useState<Record<string, string>>({})
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  if (reviews.length === 0) return null
  const review = reviews[0]
  const target = review.barberReviewed ? "barbershop" : "barber"
  const ratingKey = `${review.id}:${target}`

  const submit = (bookingId: string) => {
    const rating = ratings[ratingKey]
    if (rating === null || rating === undefined) {
      toast.error("Selecione uma nota entre 0 e 5.")
      return
    }

    startTransition(async () => {
      const result =
        target === "barber"
          ? await submitBookingReview({
              bookingId,
              rating,
              comment: comments[ratingKey] ?? "",
            })
          : await submitBarbershopReview({
              bookingId,
              rating,
              comment: comments[ratingKey] ?? "",
            })

      if (result.success) {
        if (target === "barber") {
          setReviews((current) =>
            current.map((item) =>
              item.id === bookingId ? { ...item, barberReviewed: true } : item,
            ),
          )
          toast.success("Agora avalie a barbearia.")
        } else {
          setReviews((current) => {
            const remaining = current.filter((item) => item.id !== bookingId)
            if (remaining.length === 0) setOpen(false)
            return remaining
          })
          toast.success("Avaliações enviadas. Obrigado!")
        }
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group flex w-full cursor-pointer items-center gap-3 rounded-xl border border-border bg-card p-3 text-left shadow-sm transition-colors hover:border-[#C3F32C]/60 hover:bg-accent/40"
      >
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-400/15 text-amber-500">
          <BellRing className="h-5 w-5" />
          <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-card bg-[#C3F32C]" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">
            {reviews.length === 1
              ? "Você tem um atendimento para avaliar"
              : `Você tem ${reviews.length} atendimentos para avaliar`}
          </p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {target === "barber"
              ? `${review.service} com ${review.barber}`
              : `Conte como foi sua experiência na ${review.barbershop}`}
          </p>
        </div>
        <span className="hidden items-center gap-1 text-xs font-semibold text-[#8eaf1d] sm:flex">
          Avaliar agora
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md rounded-2xl border-border bg-card p-0">
          <DialogHeader className="border-b border-border px-6 py-5 text-left">
            <DialogTitle className="text-lg">
              {target === "barber"
                ? "Como foi seu atendimento?"
                : "Como foi sua experiência na barbearia?"}
            </DialogTitle>
            <DialogDescription>
              Sua avaliação ajuda a melhorar a experiência de outros clientes.
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-5">
            <div className="rounded-xl bg-muted/50 p-3">
              <p className="text-sm font-semibold">
                {target === "barber" ? review.service : review.barbershop}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {target === "barber"
                  ? `${review.barber} · ${review.barbershop}`
                  : `Atendimento realizado por ${review.barber}`}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {new Date(review.date).toLocaleDateString("pt-BR")}
              </p>
            </div>

            <p className="mt-6 text-center text-sm font-medium">Escolha uma nota</p>
            <div className="mt-3 flex items-center justify-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() =>
                    setRatings((value) => ({ ...value, [ratingKey]: star }))
                  }
                  aria-label={`${star} estrela${star === 1 ? "" : "s"}`}
                  className="cursor-pointer rounded-lg p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-9 w-9 ${
                      star <= (ratings[ratingKey] ?? 0)
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground/25"
                    }`}
                  />
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setRatings((value) => ({ ...value, [ratingKey]: 0 }))}
              aria-label="Selecionar nota zero"
              className={`mx-auto mt-2 block cursor-pointer rounded-full px-3 py-1 text-xs transition-colors ${
                ratings[ratingKey] === 0
                  ? "bg-muted font-semibold text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {ratings[ratingKey] === undefined ||
              ratings[ratingKey] === null
                ? "Dar nota 0"
                : ratings[ratingKey] === 0
                  ? "Nota 0 selecionada"
                  : `${ratings[ratingKey]} de 5 estrelas`}
            </button>

            <textarea
              value={comments[ratingKey] ?? ""}
              onChange={(event) =>
                setComments((value) => ({
                  ...value,
                  [ratingKey]: event.target.value,
                }))
              }
              maxLength={500}
              rows={3}
              placeholder="Quer deixar um comentário? (opcional)"
              className="mt-5 w-full resize-none rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-[#C3F32C]"
            />

            <button
              type="button"
              onClick={() => submit(review.id)}
              disabled={
                isPending ||
                ratings[ratingKey] === null ||
                ratings[ratingKey] === undefined
              }
              className="mt-4 h-11 w-full cursor-pointer rounded-xl bg-[#C3F32C] text-sm font-semibold text-black transition-colors hover:bg-[#b3e023] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isPending
                ? "Enviando..."
                : target === "barber"
                  ? "Avaliar barbeiro"
                  : "Avaliar barbearia"}
            </button>

            {reviews.length > 1 && (
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Depois desta, restará
                {reviews.length - 1 === 1
                  ? " 1 avaliação pendente."
                  : ` ${reviews.length - 1} avaliações pendentes.`}
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
