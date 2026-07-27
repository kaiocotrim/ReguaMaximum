import { Suspense } from "react"
import { FileSpreadsheet } from "lucide-react"
import { getServerSession } from "next-auth"
import Agendados from "@/app/_components/dashboardComponents/agendamentos/total/Agendados"
import AgendadosSkeleton from "@/app/_components/dashboardComponents/agendamentos/total/AgendadosSkeleton"
import { AdvancedBookingSearch } from "@/app/_components/dashboardComponents/agendamentos/AdvancedBookingSearch"
import { BookingAgendaView } from "@/app/_components/dashboardComponents/agendamentos/BookingAgendaView"
import { BookingViewToggle } from "@/app/_components/dashboardComponents/agendamentos/BookingViewToggle"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/app/_lib/prisma"
import {
  bookingSortOptions,
  bookingWhere,
  type BookingFilters,
  type BookingSort,
} from "@/app/_lib/booking-filters"
import type { BookingStatus } from "@/app/generated/prisma/client"

type SearchValue = string | string[] | undefined

function values(value: SearchValue) {
  return value ? (Array.isArray(value) ? value : [value]) : []
}

function validDate(value?: string) {
  return value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : undefined
}

function validPrice(value?: string) {
  if (!value?.trim()) return undefined
  const parsed = Number(value.replace(",", "."))
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined
}

export default async function AgendamentosPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, SearchValue>>
}) {
  const params = await searchParams
  const view = params.visualizacao === "agenda" ? "agenda" : "cards"
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return null

  const [barbers, services] = await Promise.all([
    db.barber.findMany({
      where: { barbershop: { ownerId: session.user.id } },
      select: { id: true, nome: true, user: { select: { name: true } } },
      orderBy: { nome: "asc" },
    }),
    db.barbeshopService.findMany({
      where: { barbershop: { ownerId: session.user.id } },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ])

  const allowedBarbers = new Set(barbers.map((barber) => barber.id))
  const allowedServices = new Set(services.map((service) => service.id))
  const rawStatus = typeof params.status === "string" ? params.status : undefined
  const status = ["EM_ANDAMENTO", "CONCLUIDO", "CANCELADO"].includes(
    rawStatus ?? "",
  )
    ? (rawStatus as BookingStatus)
    : undefined
  const rawSort = typeof params.ordem === "string" ? params.ordem : undefined
  const sort: BookingSort = bookingSortOptions.includes(rawSort as BookingSort)
    ? (rawSort as BookingSort)
    : "recentes"
  const filters: BookingFilters = {
    barberIds: values(params.barbeiros).filter((id) =>
      allowedBarbers.has(id),
    ),
    serviceIds: values(params.servicos).filter((id) =>
      allowedServices.has(id),
    ),
    status,
    startDate: validDate(
      typeof params.inicio === "string" ? params.inicio : undefined,
    ),
    endDate: validDate(
      typeof params.fim === "string" ? params.fim : undefined,
    ),
    minPrice: validPrice(
      typeof params.precoMin === "string" ? params.precoMin : undefined,
    ),
    maxPrice: validPrice(
      typeof params.precoMax === "string" ? params.precoMax : undefined,
    ),
    sort,
  }

  const resultCount = await db.booking.count({
    where: bookingWhere(session.user.id, filters),
  })
  const exportParams = new URLSearchParams()
  filters.barberIds.forEach((id) => exportParams.append("barbeiros", id))
  filters.serviceIds.forEach((id) => exportParams.append("servicos", id))
  if (filters.status) exportParams.set("status", filters.status)
  if (filters.startDate) exportParams.set("inicio", filters.startDate)
  if (filters.endDate) exportParams.set("fim", filters.endDate)
  if (filters.minPrice !== undefined)
    exportParams.set("precoMin", String(filters.minPrice))
  if (filters.maxPrice !== undefined)
    exportParams.set("precoMax", String(filters.maxPrice))
  exportParams.set("ordem", filters.sort)
  const cardsParams = new URLSearchParams(exportParams)
  const agendaParams = new URLSearchParams(exportParams)
  agendaParams.set("visualizacao", "agenda")

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Agendamentos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Combine barbeiro, serviço, status, período e faixa de preço.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <BookingViewToggle
            view={view}
            cardsHref={`/dashboard/agendamentos?${cardsParams.toString()}`}
            agendaHref={`/dashboard/agendamentos?${agendaParams.toString()}`}
          />
          <div className="flex flex-col gap-2 sm:flex-row">
          <AdvancedBookingSearch
            barbers={barbers.map((barber) => ({
              id: barber.id,
              name: barber.nome ?? barber.user.name ?? "Barbeiro sem nome",
            }))}
            services={services}
            filters={filters}
            resultCount={resultCount}
            view={view}
          />
          <a
            href={`/api/relatorios/agendamentos?${exportParams.toString()}`}
            className="flex h-10 items-center justify-center gap-2 rounded-lg bg-[#C3F32C] px-4 text-sm font-semibold text-black hover:bg-[#b3e023]"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Baixar Excel filtrado
          </a>
          </div>
        </div>
      </div>

      <Suspense
        key={exportParams.toString()}
        fallback={<AgendadosSkeleton />}
      >
        {view === "agenda" ? (
          <BookingAgendaView filters={filters} />
        ) : (
          <Agendados filters={filters} />
        )}
      </Suspense>
    </div>
  )
}
