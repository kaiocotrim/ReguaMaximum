"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import {
  CalendarPlus,
  Heart,
  RefreshCw,
  Repeat2,
  Share2,
} from "lucide-react"
import { toast } from "sonner"

import { toggleFavoriteBarber } from "@/app/_actions/favoriteBarber"
import { Button } from "@/app/_components/ui/button"

function googleDate(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z")
}

export function BookingClientActions({
  barberId,
  barbershopId,
  serviceId,
  barbershopName,
  serviceName,
  address,
  date,
  duration,
  initiallyFavorited,
  isPast,
  bookingId,
}: {
  barberId: string
  barbershopId: string
  serviceId: string
  barbershopName: string
  serviceName: string
  address: string
  date: string
  duration: number
  initiallyFavorited: boolean
  isPast: boolean
  bookingId: string
}) {
  const [pending, startTransition] = useTransition()
  const [favorited, setFavorited] = useState(initiallyFavorited)
  const start = new Date(date)
  const end = new Date(start.getTime() + duration * 60_000)
  const calendarUrl = new URL("https://calendar.google.com/calendar/render")
  calendarUrl.searchParams.set("action", "TEMPLATE")
  calendarUrl.searchParams.set("text", `${serviceName} · ${barbershopName}`)
  calendarUrl.searchParams.set(
    "dates",
    `${googleDate(start)}/${googleDate(end)}`,
  )
  calendarUrl.searchParams.set("location", address)
  calendarUrl.searchParams.set(
    "details",
    `Agendamento de ${serviceName} na ${barbershopName}.`,
  )

  const share = async () => {
    const text = `Meu agendamento de ${serviceName} na ${barbershopName} está marcado para ${start.toLocaleString("pt-BR")}.`
    try {
      if (navigator.share) {
        await navigator.share({ title: "Agendamento confirmado", text })
      } else {
        await navigator.clipboard.writeText(text)
        toast.success("Confirmação copiada.")
      }
    } catch {
      // O usuário pode fechar o compartilhamento nativo.
    }
  }

  const favorite = () => {
    startTransition(async () => {
      try {
        const result = await toggleFavoriteBarber(barberId)
        setFavorited(result.favorited)
        toast.success(
          result.favorited
            ? "Profissional salvo nos favoritos."
            : "Profissional removido dos favoritos.",
        )
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Não foi possível salvar.")
      }
    })
  }

  return (
    <div className="grid w-full grid-cols-2 gap-2">
      <Button type="button" variant="outline" onClick={favorite} disabled={pending}>
        <Heart className={favorited ? "fill-current" : ""} />
        {favorited ? "Favorito" : "Favoritar"}
      </Button>
      <Button asChild variant="outline">
        <a href={calendarUrl.toString()} target="_blank" rel="noreferrer">
          <CalendarPlus />
          Calendário
        </a>
      </Button>
      <Button type="button" variant="outline" onClick={share}>
        <Share2 />
        Compartilhar
      </Button>
      <Button asChild variant="outline">
        <Link href={`/barbershops/${barbershopId}?service=${serviceId}`}>
          <Repeat2 />
          Repetir
        </Link>
      </Button>
      {!isPast && (
        <Button asChild variant="outline" className="col-span-2">
          <Link
            href={`/barbershops/${barbershopId}?service=${serviceId}&reschedule=${bookingId}`}
          >
            <RefreshCw />
            Reagendar sem perder o horário atual
          </Link>
        </Button>
      )}
    </div>
  )
}
