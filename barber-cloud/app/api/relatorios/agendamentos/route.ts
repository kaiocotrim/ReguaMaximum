import { db } from "@/app/_lib/prisma"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import {
  bookingOrderBy,
  bookingSortOptions,
  bookingWhere,
  type BookingFilters,
  type BookingSort,
} from "@/app/_lib/booking-filters"
import type { BookingStatus } from "@/app/generated/prisma/client"
import ExcelJS from "exceljs"
import { getServerSession } from "next-auth"

export const runtime = "nodejs"

function validDate(value: string | null) {
  return value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : undefined
}

function validPrice(value: string | null) {
  if (!value?.trim()) return undefined
  const parsed = Number(value.replace(",", "."))
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined
}

function formatPhone(phone: string | null) {
  if (!phone) return ""
  let digits = phone.replace(/\D/g, "")
  if ((digits.length === 12 || digits.length === 13) && digits.startsWith("55")) {
    digits = digits.slice(2)
  }
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  }
  return phone
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return Response.json({ error: "Não autorizado." }, { status: 401 })
  }

  const params = new URL(request.url).searchParams
  const rawStatus = params.get("status")
  const status = ["EM_ANDAMENTO", "CONCLUIDO", "CANCELADO"].includes(
    rawStatus ?? "",
  )
    ? (rawStatus as BookingStatus)
    : undefined
  const rawSort = params.get("ordem")
  const sort: BookingSort = bookingSortOptions.includes(rawSort as BookingSort)
    ? (rawSort as BookingSort)
    : "recentes"
  const filters: BookingFilters = {
    barberIds: params.getAll("barbeiros"),
    serviceIds: params.getAll("servicos"),
    status,
    startDate: validDate(params.get("inicio")),
    endDate: validDate(params.get("fim")),
    minPrice: validPrice(params.get("precoMin")),
    maxPrice: validPrice(params.get("precoMax")),
    sort,
  }

  const bookings = await db.booking.findMany({
    where: bookingWhere(session.user.id, filters),
    include: {
      user: true,
      barber: { include: { user: true } },
      service: true,
      barbershop: true,
    },
    orderBy: bookingOrderBy(filters.sort),
  })

  const workbook = new ExcelJS.Workbook()
  workbook.creator = "Régua Máxima"
  workbook.created = new Date()
  workbook.modified = new Date()
  workbook.calcProperties.fullCalcOnLoad = true

  const sheet = workbook.addWorksheet("Agendamentos", {
    views: [{ state: "frozen", ySplit: 1 }],
    pageSetup: {
      orientation: "landscape",
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
    },
  })
  sheet.properties.defaultRowHeight = 20
  sheet.columns = [
    { header: "Código", key: "code", width: 12 },
    { header: "Data", key: "date", width: 13 },
    { header: "Hora", key: "time", width: 10 },
    { header: "Cliente", key: "client", width: 26 },
    { header: "Telefone", key: "phone", width: 18 },
    { header: "Serviço", key: "service", width: 24 },
    { header: "Barbeiro", key: "barber", width: 22 },
    { header: "Valor", key: "price", width: 15 },
    { header: "Status", key: "status", width: 17 },
    { header: "Barbearia", key: "barbershop", width: 24 },
    { header: "Criado em", key: "createdAt", width: 20 },
    { header: "Cancelado em", key: "cancelledAt", width: 20 },
  ]

  const statusLabels = {
    EM_ANDAMENTO: "Em andamento",
    CONCLUIDO: "Concluído",
    CANCELADO: "Cancelado",
  }

  bookings.forEach((booking) => {
    sheet.addRow({
      code: booking.id.slice(0, 8).toUpperCase(),
      date: booking.date,
      time: booking.date,
      client: booking.user.name ?? "Cliente",
      phone: formatPhone(booking.user.telefone),
      service: booking.service.name,
      barber: booking.barber.nome ?? booking.barber.user.name ?? "Barbeiro",
      price: Number(booking.service.price),
      status: statusLabels[booking.status],
      barbershop: booking.barbershop.name,
      createdAt: booking.createdAt,
      cancelledAt: booking.cancelledAt ?? null,
    })
  })

  const header = sheet.getRow(1)
  header.height = 30
  header.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 }
  header.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF20251F" },
  }
  header.alignment = { vertical: "middle", horizontal: "center" }
  header.eachCell((cell) => {
    cell.border = {
      bottom: { style: "medium", color: { argb: "FFC3F32C" } },
    }
  })

  const firstDataRow = 2
  const lastDataRow = bookings.length + 1
  for (let rowNumber = firstDataRow; rowNumber <= lastDataRow; rowNumber++) {
    const row = sheet.getRow(rowNumber)
    row.alignment = { vertical: "middle" }
    if (rowNumber % 2 === 0) {
      row.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFF7F9F4" },
      }
    }
    row.eachCell((cell) => {
      cell.border = {
        bottom: { style: "thin", color: { argb: "FFE2E8DB" } },
      }
    })
  }

  sheet.getColumn("date").numFmt = "dd/mm/yyyy"
  sheet.getColumn("time").numFmt = "hh:mm"
  sheet.getColumn("price").numFmt = '"R$" #,##0.00'
  sheet.getColumn("createdAt").numFmt = "dd/mm/yyyy hh:mm"
  sheet.getColumn("cancelledAt").numFmt = "dd/mm/yyyy hh:mm"
  sheet.getColumn("date").alignment = { horizontal: "center" }
  sheet.getColumn("time").alignment = { horizontal: "center" }
  sheet.getColumn("price").alignment = { horizontal: "right" }
  sheet.getColumn("status").alignment = { horizontal: "center" }
  sheet.autoFilter = { from: "A1", to: "L1" }

  const totalRowNumber = lastDataRow + 1
  const totalRow = sheet.getRow(totalRowNumber)
  totalRow.getCell("A").value = "TOTAIS"
  totalRow.getCell("D").value =
    `${bookings.length} ${bookings.length === 1 ? "agendamento" : "agendamentos"}`
  totalRow.getCell("H").value =
    bookings.length > 0
      ? {
          formula: `SUM(H${firstDataRow}:H${lastDataRow})`,
          result: bookings.reduce(
            (total, booking) => total + Number(booking.service.price),
            0,
          ),
        }
      : 0
  totalRow.getCell("H").numFmt = '"R$" #,##0.00'
  totalRow.height = 28
  totalRow.font = { bold: true, color: { argb: "FF111827" } }
  totalRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFE8F5BD" },
  }
  totalRow.eachCell({ includeEmpty: true }, (cell) => {
    cell.border = {
      top: { style: "medium", color: { argb: "FF9FCA1C" } },
    }
  })

  const minimumWidths: Record<string, number> = {
    code: 10,
    date: 12,
    time: 8,
    client: 18,
    phone: 16,
    service: 18,
    barber: 18,
    price: 13,
    status: 15,
    barbershop: 18,
    createdAt: 18,
    cancelledAt: 18,
  }
  sheet.columns.forEach((column) => {
    let contentWidth = String(column.header ?? "").length
    column.eachCell({ includeEmpty: false }, (cell) => {
      const value = cell.value
      const length =
        value instanceof Date
          ? 18
          : typeof value === "object"
            ? 14
            : String(value ?? "").length
      contentWidth = Math.max(contentWidth, length)
    })
    const key = String(column.key ?? "")
    column.width = Math.min(
      Math.max(contentWidth + 2, minimumWidths[key] ?? 10),
      32,
    )
  })

  const buffer = await workbook.xlsx.writeBuffer()
  const period =
    filters.startDate || filters.endDate
      ? `${filters.startDate ?? "inicio"}-${filters.endDate ?? "hoje"}`
      : "todos"

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="agendamentos-${period}.xlsx"`,
      "Cache-Control": "no-store",
    },
  })
}
