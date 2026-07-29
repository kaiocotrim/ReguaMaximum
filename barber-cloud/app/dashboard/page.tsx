import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
  ArrowRight,
  CalendarCheck,
  CalendarClock,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Scissors,
  TriangleAlert,
  UserRound,
  UsersRound,
  Wallet,
} from "lucide-react"

import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/app/_lib/prisma"
import { Card } from "@/app/_components/ui/card"
import { Button } from "@/app/_components/ui/button"
import { Badge } from "@/app/_components/ui/badge"
import { DashboardIntro } from "@/app/_components/dashboardComponents/DashboardIntro"
import {
  DashboardCharts,
  type DashboardChartPoint,
} from "@/app/_components/dashboardComponents/DashboardCharts"

function currency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}

function time(value: Date) {
  return value.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect("/login")

  const barbershop = await db.barbershop.findFirst({
    where: { ownerId: session.user.id },
    select: { id: true, name: true },
  })
  if (!barbershop) redirect("/minha-barbearia")

  const now = new Date()
  const todayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  )
  const tomorrowStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
  )
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  const weekday = now.getDay()
  const chartStart = new Date(now.getFullYear(), now.getMonth() - 5, 1)

  const [
    todayBookings,
    completedToday,
    overdueBookings,
    completedWithoutPayment,
    monthRevenue,
    upcomingBookings,
    activeStaff,
    chartBookings,
    chartPayments,
  ] = await Promise.all([
    db.booking.count({
      where: {
        barbershopId: barbershop.id,
        status: { not: "CANCELADO" },
        date: { gte: todayStart, lt: tomorrowStart },
      },
    }),
    db.booking.count({
      where: {
        barbershopId: barbershop.id,
        status: "CONCLUIDO",
        date: { gte: todayStart, lt: tomorrowStart },
      },
    }),
    db.booking.count({
      where: {
        barbershopId: barbershop.id,
        status: "EM_ANDAMENTO",
        date: { lt: now },
      },
    }),
    db.booking.count({
      where: {
        barbershopId: barbershop.id,
        status: "CONCLUIDO",
        payment: null,
      },
    }),
    db.payment.aggregate({
      where: {
        booking: { barbershopId: barbershop.id },
        paidAt: { gte: monthStart, lt: nextMonthStart },
      },
      _sum: { amount: true },
    }),
    db.booking.findMany({
      where: {
        barbershopId: barbershop.id,
        status: "EM_ANDAMENTO",
        date: { gte: now },
      },
      orderBy: { date: "asc" },
      take: 5,
      select: {
        id: true,
        date: true,
        user: { select: { name: true } },
        service: { select: { name: true } },
        barber: { select: { nome: true } },
      },
    }),
    db.barber.count({
      where: {
        barbershopId: barbershop.id,
        isActive: true,
        OR: [
          { workSchedules: { none: {} } },
          { workSchedules: { some: { weekday, enabled: true } } },
        ],
      },
    }),
    db.booking.findMany({
      where: {
        barbershopId: barbershop.id,
        status: { not: "CANCELADO" },
        date: { gte: chartStart, lt: nextMonthStart },
      },
      select: { date: true },
    }),
    db.payment.findMany({
      where: {
        booking: { barbershopId: barbershop.id },
        paidAt: { gte: chartStart, lt: nextMonthStart },
      },
      select: { paidAt: true, amount: true },
    }),
  ])

  const pendingCount = overdueBookings + completedWithoutPayment
  const nextBooking = upcomingBookings[0]
  const revenue = Number(monthRevenue._sum.amount ?? 0)
  const chartData: DashboardChartPoint[] = Array.from(
    { length: 6 },
    (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1)
      const year = date.getFullYear()
      const month = date.getMonth()

      return {
        month: date
          .toLocaleDateString("pt-BR", { month: "short" })
          .replace(".", ""),
        bookings: chartBookings.filter(
          (booking) =>
            booking.date.getFullYear() === year &&
            booking.date.getMonth() === month,
        ).length,
        revenue: chartPayments
          .filter(
            (payment) =>
              payment.paidAt.getFullYear() === year &&
              payment.paidAt.getMonth() === month,
          )
          .reduce((total, payment) => total + Number(payment.amount), 0),
      }
    },
  )

  const metrics = [
    {
      label: "Agendamentos hoje",
      value: String(todayBookings),
      detail: `${completedToday} concluído${completedToday === 1 ? "" : "s"}`,
      icon: CalendarCheck,
      href: "/dashboard/agendamentos",
    },
    {
      label: "Faturamento no mês",
      value: currency(revenue),
      detail: "Pagamentos confirmados",
      icon: CircleDollarSign,
      href: "/dashboard/caixa",
    },
    {
      label: "Equipe trabalhando",
      value: String(activeStaff),
      detail: "Funcionários ativos hoje",
      icon: UsersRound,
      href: "/dashboard/barbeiros",
    },
    {
      label: "Pendências",
      value: String(pendingCount),
      detail:
        pendingCount === 0
          ? "Tudo em dia"
          : `${overdueBookings} atrasados · ${completedWithoutPayment} sem pagamento`,
      icon: pendingCount > 0 ? TriangleAlert : CheckCircle2,
      href: "/dashboard/agendamentos",
      attention: pendingCount > 0,
    },
  ]

  return (
    <div className="space-y-6 leading-normal">
      <DashboardIntro />

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-[#71910d] dark:text-[#C3F32C]">
            Visão geral
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            Olá, {session.user.name?.split(" ")[0] ?? "gestor"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Veja o que está acontecendo hoje na {barbershop.name}.
          </p>
        </div>
        <Button asChild className="bg-[#C3F32C] font-bold text-black hover:bg-[#afd925]">
          <Link href="/dashboard/agendamentos">
            Abrir agenda
            <ArrowRight />
          </Link>
        </Button>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Link key={metric.label} href={metric.href} className="group">
            <Card
              className={`h-full gap-3 rounded-2xl p-5 transition-colors group-hover:border-[#9fc821]/60 ${
                metric.attention ? "border-amber-500/35 bg-amber-500/5" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{metric.label}</p>
                <div
                  className={`rounded-xl p-2 ${
                    metric.attention
                      ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                      : "bg-[#C3F32C]/15 text-[#557500] dark:text-[#C3F32C]"
                  }`}
                >
                  <metric.icon className="size-4" />
                </div>
              </div>
              <p className="text-3xl font-bold tracking-tight tabular-nums">
                {metric.value}
              </p>
              <p className="text-xs leading-5 text-muted-foreground">
                {metric.detail}
              </p>
            </Card>
          </Link>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <Card className="rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Próximo atendimento</p>
              <p className="mt-1 text-xs text-muted-foreground">
                O próximo compromisso da equipe
              </p>
            </div>
            <CalendarClock className="size-5 text-[#71910d] dark:text-[#C3F32C]" />
          </div>

          {nextBooking ? (
            <div className="mt-6">
              <p className="text-4xl font-bold tracking-tight">
                {time(nextBooking.date)}
              </p>
              <div className="mt-5 space-y-3 text-sm">
                <p className="flex items-center gap-2">
                  <UserRound className="size-4 text-muted-foreground" />
                  {nextBooking.user.name ?? "Cliente sem nome"}
                </p>
                <p className="flex items-center gap-2">
                  <Scissors className="size-4 text-muted-foreground" />
                  {nextBooking.service.name}
                </p>
                <p className="flex items-center gap-2">
                  <UsersRound className="size-4 text-muted-foreground" />
                  {nextBooking.barber.nome ?? "Profissional"}
                </p>
              </div>
              <Button asChild variant="outline" className="mt-6 w-full">
                <Link href="/dashboard/agendamentos">Ver na agenda</Link>
              </Button>
            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-dashed p-6 text-center">
              <CheckCircle2 className="mx-auto size-6 text-emerald-500" />
              <p className="mt-2 text-sm font-medium">
                Nenhum atendimento futuro
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                A agenda está livre no momento.
              </p>
            </div>
          )}
        </Card>

        <Card className="rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold">Próximos atendimentos</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Os próximos horários confirmados
              </p>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/agendamentos">
                Ver todos
                <ArrowRight />
              </Link>
            </Button>
          </div>

          <div className="mt-4 divide-y">
            {upcomingBookings.length > 0 ? (
              upcomingBookings.map((booking) => (
                <Link
                  key={booking.id}
                  href="/dashboard/agendamentos"
                  className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div className="flex w-14 shrink-0 flex-col items-center rounded-xl bg-muted px-2 py-2">
                    <span className="text-sm font-bold">{time(booking.date)}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {booking.date.toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {booking.user.name ?? "Cliente sem nome"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {booking.service.name} ·{" "}
                      {booking.barber.nome ?? "Profissional"}
                    </p>
                  </div>
                  <Badge variant="outline" className="hidden sm:inline-flex">
                    Agendado
                  </Badge>
                </Link>
              ))
            ) : (
              <p className="py-10 text-center text-sm text-muted-foreground">
                Nenhum atendimento futuro encontrado.
              </p>
            )}
          </div>
        </Card>
      </section>

      <DashboardCharts data={chartData} />

      <section>
        <h2 className="mb-3 text-sm font-semibold">Ações rápidas</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            {
              label: "Gerenciar agenda",
              detail: "Consultar e atualizar horários",
              icon: Clock3,
              href: "/dashboard/agendamentos",
            },
            {
              label: "Registrar movimentação",
              detail: "Adicionar entrada ou saída",
              icon: Wallet,
              href: "/dashboard/caixa",
            },
            {
              label: "Configurar equipe",
              detail: "Cargos, status e jornadas",
              icon: UsersRound,
              href: "/dashboard/barbeiros",
            },
          ].map((action) => (
            <Link key={action.label} href={action.href}>
              <Card className="flex-row items-center gap-3 rounded-2xl p-4 transition-colors hover:border-[#9fc821]/60">
                <div className="rounded-xl bg-[#C3F32C]/15 p-2.5 text-[#557500] dark:text-[#C3F32C]">
                  <action.icon className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{action.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {action.detail}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
