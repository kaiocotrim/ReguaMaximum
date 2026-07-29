import { getServerSession } from "next-auth"
import {
  Banknote,
  CalendarCheck,
  CircleX,
  ReceiptText,
  Star,
  UserRoundCheck,
} from "lucide-react"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/app/_lib/prisma"
import { Card } from "@/app/_components/ui/card"

const money = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

export default async function RelatoriosPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return null

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const previousStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)

  const [payments, bookings, reviews] = await Promise.all([
    db.payment.findMany({
      where: {
        paidAt: { gte: previousStart },
        booking: { barbershop: { ownerId: session.user.id } },
      },
      select: {
        amount: true,
        method: true,
        paidAt: true,
        booking: {
          select: {
            barber: { select: { nome: true, user: { select: { name: true } } } },
            service: { select: { name: true } },
          },
        },
      },
    }),
    db.booking.findMany({
      where: {
        barbershop: { ownerId: session.user.id },
        date: { gte: previousStart },
      },
      select: { status: true, attendance: true, date: true },
    }),
    db.review.findMany({
      where: {
        booking: { barbershop: { ownerId: session.user.id } },
      },
      select: { rating: true },
    }),
  ])

  const currentPayments = payments.filter((payment) => payment.paidAt >= monthStart)
  const previousPayments = payments.filter((payment) => payment.paidAt < monthStart)
  const revenue = currentPayments.reduce(
    (total, payment) => total + Number(payment.amount),
    0,
  )
  const previousRevenue = previousPayments.reduce(
    (total, payment) => total + Number(payment.amount),
    0,
  )
  const currentBookings = bookings.filter((booking) => booking.date >= monthStart)
  const completed = currentBookings.filter(
    (booking) => booking.status === "CONCLUIDO",
  ).length
  const cancelled = currentBookings.filter(
    (booking) => booking.status === "CANCELADO",
  ).length
  const noShows = currentBookings.filter(
    (booking) => booking.attendance === "FALTOU",
  ).length
  const ticket = currentPayments.length > 0 ? revenue / currentPayments.length : 0
  const averageReview =
    reviews.length > 0
      ? reviews.reduce((total, review) => total + review.rating, 0) / reviews.length
      : 0

  const barberRevenue = new Map<string, number>()
  const serviceRevenue = new Map<string, { total: number; count: number }>()
  const methodRevenue = new Map<string, number>()
  currentPayments.forEach((payment) => {
    const barber =
      payment.booking.barber.nome ??
      payment.booking.barber.user.name ??
      "Barbeiro"
    barberRevenue.set(
      barber,
      (barberRevenue.get(barber) ?? 0) + Number(payment.amount),
    )
    const service = payment.booking.service.name
    const serviceCurrent = serviceRevenue.get(service) ?? { total: 0, count: 0 }
    serviceRevenue.set(service, {
      total: serviceCurrent.total + Number(payment.amount),
      count: serviceCurrent.count + 1,
    })
    methodRevenue.set(
      payment.method,
      (methodRevenue.get(payment.method) ?? 0) + Number(payment.amount),
    )
  })

  const topBarbers = [...barberRevenue.entries()].sort((a, b) => b[1] - a[1])
  const topServices = [...serviceRevenue.entries()].sort(
    (a, b) => b[1].count - a[1].count,
  )
  const paymentMethods = [...methodRevenue.entries()].sort((a, b) => b[1] - a[1])

  return (
    <div className="py-5">
      <div>
        <h1 className="text-2xl font-semibold">Relatórios</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Desempenho real de {now.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}.
        </p>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Metric title="Faturamento" value={money(revenue)} subtitle={`Mês anterior: ${money(previousRevenue)}`} icon={Banknote} />
        <Metric title="Ticket médio" value={money(ticket)} subtitle={`${currentPayments.length} pagamentos`} icon={ReceiptText} />
        <Metric title="Concluídos" value={String(completed)} subtitle={`${currentBookings.length} agendamentos no mês`} icon={CalendarCheck} />
        <Metric title="Cancelamentos" value={String(cancelled)} subtitle={`${percentage(cancelled, currentBookings.length)} do total`} icon={CircleX} danger />
        <Metric title="Faltas" value={String(noShows)} subtitle={`${percentage(noShows, currentBookings.length)} do total`} icon={UserRoundCheck} danger />
        <Metric title="Avaliação média" value={reviews.length ? averageReview.toFixed(1) : "—"} subtitle={`${reviews.length} avaliações`} icon={Star} />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <Ranking title="Faturamento por barbeiro" empty="Nenhum pagamento neste mês">
          {topBarbers.map(([name, total], index) => (
            <RankRow key={name} position={index + 1} label={name} value={money(total)} />
          ))}
        </Ranking>
        <Ranking title="Serviços mais vendidos" empty="Nenhum serviço vendido neste mês">
          {topServices.map(([name, data], index) => (
            <RankRow key={name} position={index + 1} label={name} value={`${data.count} · ${money(data.total)}`} />
          ))}
        </Ranking>
        <Ranking title="Formas de pagamento" empty="Nenhum pagamento neste mês">
          {paymentMethods.map(([method, total], index) => (
            <RankRow key={method} position={index + 1} label={methodLabel(method)} value={money(total)} />
          ))}
        </Ranking>
      </div>
    </div>
  )
}

function percentage(value: number, total: number) {
  return total > 0 ? `${Math.round((value / total) * 100)}%` : "0%"
}

function methodLabel(method: string) {
  return {
    DINHEIRO: "Dinheiro",
    PIX: "Pix",
    CARTAO_CREDITO: "Cartão de crédito",
    CARTAO_DEBITO: "Cartão de débito",
    OUTRO: "Outro",
  }[method] ?? method
}

function Metric({
  title,
  value,
  subtitle,
  icon: Icon,
  danger = false,
}: {
  title: string
  value: string
  subtitle: string
  icon: typeof Banknote
  danger?: boolean
}) {
  return (
    <Card className="border-border p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{title}</p>
        <Icon className={`h-5 w-5 ${danger ? "text-red-500" : "text-[#9fca18]"}`} />
      </div>
      <p className="mt-3 text-2xl font-bold">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
    </Card>
  )
}

function Ranking({
  title,
  empty,
  children,
}: {
  title: string
  empty: string
  children: React.ReactNode
}) {
  const hasChildren = Array.isArray(children) ? children.length > 0 : Boolean(children)
  return (
    <Card className="h-fit border-border p-0">
      <h2 className="border-b border-border p-5 font-semibold">{title}</h2>
      {hasChildren ? (
        <div className="divide-y divide-border">{children}</div>
      ) : (
        <p className="p-8 text-center text-sm text-muted-foreground">{empty}</p>
      )}
    </Card>
  )
}

function RankRow({
  position,
  label,
  value,
}: {
  position: number
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3 px-5 py-4">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-semibold">
        {position}
      </span>
      <span className="min-w-0 flex-1 truncate text-sm font-medium">{label}</span>
      <span className="text-sm text-muted-foreground">{value}</span>
    </div>
  )
}
