"use client"

import { SlidersHorizontal, SearchX } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog"
import type { BookingFilters } from "@/app/_lib/booking-filters"

interface FilterOption {
  id: string
  name: string
}

export function AdvancedBookingSearch({
  barbers,
  services,
  filters,
  resultCount,
}: {
  barbers: FilterOption[]
  services: FilterOption[]
  filters: BookingFilters
  resultCount: number
}) {
  const router = useRouter()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex h-10 items-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-medium hover:bg-accent">
          <SlidersHorizontal className="h-4 w-4" />
          Pesquisa Avançada
          <span className="rounded-full bg-[#C3F32C] px-2 py-0.5 text-xs font-semibold text-black">
            {resultCount}
          </span>
        </button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Pesquisa Avançada</DialogTitle>
          <DialogDescription>
            Combine os filtros para refinar os agendamentos. Todos são aplicados
            em conjunto.
          </DialogDescription>
        </DialogHeader>

        <form method="get" className="grid gap-5" id="advanced-booking-filter">
          <div className="grid gap-4 md:grid-cols-2">
            <fieldset className="space-y-2">
              <legend className="text-sm font-semibold">Barbeiros</legend>
              <div className="max-h-36 space-y-1 overflow-y-auto rounded-lg border border-border p-3">
                {barbers.map((barber) => (
                  <label
                    key={barber.id}
                    className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
                  >
                    <input
                      type="checkbox"
                      name="barbeiros"
                      value={barber.id}
                      defaultChecked={filters.barberIds.includes(barber.id)}
                      className="accent-[#C3F32C]"
                    />
                    {barber.name}
                  </label>
                ))}
                {barbers.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Nenhum barbeiro cadastrado.
                  </p>
                )}
              </div>
            </fieldset>

            <fieldset className="space-y-2">
              <legend className="text-sm font-semibold">Serviços</legend>
              <div className="max-h-36 space-y-1 overflow-y-auto rounded-lg border border-border p-3">
                {services.map((service) => (
                  <label
                    key={service.id}
                    className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
                  >
                    <input
                      type="checkbox"
                      name="servicos"
                      value={service.id}
                      defaultChecked={filters.serviceIds.includes(service.id)}
                      className="accent-[#C3F32C]"
                    />
                    {service.name}
                  </label>
                ))}
                {services.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Nenhum serviço cadastrado.
                  </p>
                )}
              </div>
            </fieldset>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-1 text-sm font-medium">
              Status
              <select
                name="status"
                defaultValue={filters.status ?? ""}
                className="h-10 rounded-lg border border-border bg-background px-3 font-normal"
              >
                <option value="">Todos os status</option>
                <option value="EM_ANDAMENTO">Em andamento</option>
                <option value="CONCLUIDO">Concluído</option>
                <option value="CANCELADO">Cancelado</option>
              </select>
            </label>
            <label className="grid gap-1 text-sm font-medium">
              Ordenação
              <select
                name="ordem"
                defaultValue={filters.sort}
                className="h-10 rounded-lg border border-border bg-background px-3 font-normal"
              >
                <option value="recentes">Mais recente</option>
                <option value="antigos">Mais antigo</option>
                <option value="maior-preco">Maior preço</option>
                <option value="menor-preco">Menor preço</option>
              </select>
            </label>
          </div>

          <fieldset className="grid gap-3 rounded-lg border border-border p-3 md:grid-cols-2">
            <legend className="px-1 text-sm font-semibold">Período</legend>
            <label className="grid gap-1 text-xs text-muted-foreground">
              Data inicial
              <input
                type="date"
                name="inicio"
                defaultValue={filters.startDate}
                className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground"
              />
            </label>
            <label className="grid gap-1 text-xs text-muted-foreground">
              Data final
              <input
                type="date"
                name="fim"
                defaultValue={filters.endDate}
                className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground"
              />
            </label>
          </fieldset>

          <fieldset className="grid gap-3 rounded-lg border border-border p-3 md:grid-cols-2">
            <legend className="px-1 text-sm font-semibold">Faixa de preço</legend>
            <label className="grid gap-1 text-xs text-muted-foreground">
              Preço mínimo
              <input
                type="number"
                name="precoMin"
                min="0"
                step="0.01"
                defaultValue={filters.minPrice}
                placeholder="R$ 0,00"
                className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground"
              />
            </label>
            <label className="grid gap-1 text-xs text-muted-foreground">
              Preço máximo
              <input
                type="number"
                name="precoMax"
                min="0"
                step="0.01"
                defaultValue={filters.maxPrice}
                placeholder="Sem limite"
                className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground"
              />
            </label>
          </fieldset>
        </form>

        <div className="rounded-lg bg-muted p-3 text-sm">
          <strong>{resultCount}</strong>{" "}
          {resultCount === 1 ? "resultado encontrado" : "resultados encontrados"}
        </div>

        <DialogFooter>
          <button
            type="button"
            onClick={() => router.push("/dashboard/agendamentos")}
            className="flex h-10 items-center justify-center gap-2 rounded-lg border border-border px-4 text-sm font-medium hover:bg-accent"
          >
            <SearchX className="h-4 w-4" />
            Limpar filtros
          </button>
          <button
            type="submit"
            form="advanced-booking-filter"
            className="h-10 rounded-lg bg-[#C3F32C] px-5 text-sm font-semibold text-black hover:bg-[#b3e023]"
          >
            Aplicar filtros
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
