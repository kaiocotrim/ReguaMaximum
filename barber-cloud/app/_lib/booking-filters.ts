import { BookingStatus, Prisma } from "@/app/generated/prisma/client"

export const bookingSortOptions = [
  "recentes",
  "antigos",
  "maior-preco",
  "menor-preco",
] as const

export type BookingSort = (typeof bookingSortOptions)[number]

export interface BookingFilters {
  barberIds: string[]
  serviceIds: string[]
  status?: BookingStatus
  startDate?: string
  endDate?: string
  minPrice?: number
  maxPrice?: number
  sort: BookingSort
}

export function bookingWhere(
  ownerId: string,
  filters: BookingFilters,
): Prisma.BookingWhereInput {
  const priceFilter: Prisma.DecimalFilter = {}
  if (filters.minPrice !== undefined) priceFilter.gte = filters.minPrice
  if (filters.maxPrice !== undefined) priceFilter.lte = filters.maxPrice

  return {
    barbershop: { ownerId },
    ...(filters.barberIds.length
      ? { barberId: { in: filters.barberIds } }
      : {}),
    ...(filters.serviceIds.length
      ? { serviceId: { in: filters.serviceIds } }
      : {}),
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.startDate || filters.endDate
      ? {
          date: {
            ...(filters.startDate
              ? {
                  gte: new Date(
                    `${filters.startDate}T00:00:00-03:00`,
                  ),
                }
              : {}),
            ...(filters.endDate
              ? {
                  lte: new Date(
                    `${filters.endDate}T23:59:59.999-03:00`,
                  ),
                }
              : {}),
          },
        }
      : {}),
    ...(Object.keys(priceFilter).length
      ? { service: { price: priceFilter } }
      : {}),
  }
}

export function bookingOrderBy(
  sort: BookingSort,
): Prisma.BookingOrderByWithRelationInput {
  if (sort === "antigos") return { date: "asc" }
  if (sort === "maior-preco") return { service: { price: "desc" } }
  if (sort === "menor-preco") return { service: { price: "asc" } }
  return { date: "desc" }
}
