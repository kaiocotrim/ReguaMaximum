import Link from "next/link"
import { redirect } from "next/navigation"
import {
  ArrowRight,
  Building2,
  CalendarClock,
  CheckCircle2,
  KeyRound,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react"

import {
  PlanLicenseStatus,
  SubscriptionPlan,
} from "@/app/generated/prisma/client"
import { ThemeToggle } from "@/app/_components/ui/theme-toggle"
import { getLicenseAdminUser } from "@/app/_lib/license-admin"
import {
  getPlanDetails,
  type SubscriptionPlanCode,
} from "@/app/_lib/plan-license-config"
import { db } from "@/app/_lib/prisma"

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
})

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeZone: "America/Sao_Paulo",
})

export default async function MasterAdminPage() {
  const admin = await getLicenseAdminUser()
  if (!admin) redirect("/login")

  const now = new Date()
  const inSevenDays = new Date(now.getTime() + 7 * 86_400_000)

  const [barbershops, activeLicenses, expiringCount, totalUsers] =
    await Promise.all([
      db.barbershop.findMany({
        orderBy: { createdAt: "desc" },
        take: 200,
        select: {
          id: true,
          name: true,
          cidade: true,
          createdAt: true,
          owner: {
            select: {
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              barbers: true,
              bookings: true,
            },
          },
          licenses: {
            where: {
              status: PlanLicenseStatus.ACTIVE,
              expiresAt: { gt: now },
            },
            orderBy: { expiresAt: "desc" },
            take: 1,
            select: {
              plan: true,
              expiresAt: true,
            },
          },
        },
      }),
      db.planLicense.findMany({
        where: {
          status: PlanLicenseStatus.ACTIVE,
          expiresAt: { gt: now },
        },
        select: { plan: true },
      }),
      db.planLicense.count({
        where: {
          status: PlanLicenseStatus.ACTIVE,
          expiresAt: { gt: now, lte: inSevenDays },
        },
      }),
      db.user.count(),
    ])

  const revenueByPlan = activeLicenses.reduce<Record<SubscriptionPlan, number>>(
    (totals, license) => {
      totals[license.plan] += 1
      return totals
    },
    {
      BASIC: 0,
      PRO: 0,
      PREMIUM: 0,
    },
  )

  const monthlyRevenue = Object.entries(revenueByPlan).reduce(
    (total, [plan, quantity]) =>
      total +
      getPlanDetails(plan as SubscriptionPlanCode).monthlyPrice * quantity,
    0,
  )

  const metrics = [
    {
      label: "Barbearias",
      value: barbershops.length,
      helper: "cadastradas na plataforma",
      icon: Building2,
    },
    {
      label: "Planos ativos",
      value: activeLicenses.length,
      helper: `${expiringCount} vencem em até 7 dias`,
      icon: CheckCircle2,
    },
    {
      label: "Receita mensal",
      value: currencyFormatter.format(monthlyRevenue),
      helper: "estimativa dos planos ativos",
      icon: TrendingUp,
    },
    {
      label: "Usuários",
      value: totalUsers,
      helper: "contas cadastradas",
      icon: Users,
    },
  ]

  return (
    <div className="min-h-screen bg-[#f5f7f3] text-foreground dark:bg-zinc-950">
      <header className="border-b border-border/70 bg-card/90">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C3F32C] text-[#111111]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold">Admin Master</p>
              <p className="text-xs text-muted-foreground">
                {admin.name ?? admin.email}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden text-sm font-medium text-muted-foreground transition hover:text-foreground sm:block"
            >
              Ver plataforma
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-5 py-8 md:px-8 md:py-12">
        <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#557500] dark:text-[#C3F32C]">
              Visão geral
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              Controle da plataforma
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Acompanhe barbearias, planos, vencimentos e a receita recorrente
              estimada em um só lugar.
            </p>
          </div>
          <Link
            href="/admin/licencas"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#C3F32C] px-5 text-sm font-bold text-[#111111] transition hover:bg-[#b8e82a]"
          >
            <KeyRound className="h-4 w-4" />
            Gerenciar licenças
          </Link>
        </section>

        <section className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <article
              key={metric.label}
              className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm"
            >
              <metric.icon className="h-5 w-5 text-[#557500] dark:text-[#C3F32C]" />
              <p className="mt-5 text-3xl font-bold">{metric.value}</p>
              <p className="mt-1 text-sm font-semibold">{metric.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {metric.helper}
              </p>
            </article>
          ))}
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-[1fr_1.7fr]">
          <article className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold">Planos ativos</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Distribuição e receita mensal.
                </p>
              </div>
              <TrendingUp className="h-5 w-5 text-[#557500] dark:text-[#C3F32C]" />
            </div>
            <div className="mt-6 space-y-3">
              {Object.entries(revenueByPlan).map(([planCode, quantity]) => {
                const plan = getPlanDetails(
                  planCode as SubscriptionPlanCode,
                )
                return (
                  <div
                    key={planCode}
                    className="flex items-center justify-between rounded-2xl bg-muted/60 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-bold">{plan.label}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {currencyFormatter.format(plan.monthlyPrice)}/mês
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{quantity}</p>
                      <p className="text-xs text-muted-foreground">
                        {currencyFormatter.format(
                          quantity * plan.monthlyPrice,
                        )}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </article>

          <article className="overflow-hidden rounded-3xl border border-border/70 bg-card shadow-sm">
            <div className="flex items-center justify-between border-b border-border px-5 py-5 md:px-6">
              <div>
                <h2 className="font-bold">Barbearias</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Últimos cadastros e situação do plano.
                </p>
              </div>
              <Building2 className="h-5 w-5 text-[#557500] dark:text-[#C3F32C]" />
            </div>

            {barbershops.length === 0 ? (
              <div className="px-6 py-16 text-center text-sm text-muted-foreground">
                Nenhuma barbearia cadastrada.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="bg-muted/55 text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="px-5 py-3 font-semibold">Barbearia</th>
                      <th className="px-5 py-3 font-semibold">Responsável</th>
                      <th className="px-5 py-3 font-semibold">Equipe</th>
                      <th className="px-5 py-3 font-semibold">Plano</th>
                      <th className="px-5 py-3 font-semibold">Validade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {barbershops.map((barbershop) => {
                      const activeLicense = barbershop.licenses[0]
                      const plan = activeLicense
                        ? getPlanDetails(
                            activeLicense.plan as SubscriptionPlanCode,
                          )
                        : null

                      return (
                        <tr key={barbershop.id} className="hover:bg-muted/25">
                          <td className="px-5 py-4">
                            <p className="max-w-44 truncate font-bold">
                              {barbershop.name}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {barbershop.cidade ?? "Cidade não informada"} ·{" "}
                              {barbershop._count.bookings} agendamentos
                            </p>
                          </td>
                          <td className="px-5 py-4">
                            <p className="max-w-44 truncate font-medium">
                              {barbershop.owner.name ?? "Sem nome"}
                            </p>
                            <p className="mt-1 max-w-44 truncate text-xs text-muted-foreground">
                              {barbershop.owner.email ?? "Sem e-mail"}
                            </p>
                          </td>
                          <td className="px-5 py-4">
                            {barbershop._count.barbers} barbeiro(s)
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={
                                plan
                                  ? "inline-flex rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300"
                                  : "inline-flex rounded-full bg-zinc-500/10 px-2.5 py-1 text-xs font-semibold text-zinc-600 dark:text-zinc-300"
                              }
                            >
                              {plan?.label ?? "Sem plano ativo"}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">
                            {activeLicense?.expiresAt ? (
                              <span className="inline-flex items-center gap-1.5">
                                <CalendarClock className="h-3.5 w-3.5" />
                                {dateFormatter.format(activeLicense.expiresAt)}
                              </span>
                            ) : (
                              "—"
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <Link
              href="/admin/licencas"
              className="flex items-center justify-between border-t border-border px-5 py-4 text-sm font-bold transition hover:bg-muted/40"
            >
              Abrir gerenciador de licenças
              <ArrowRight className="h-4 w-4" />
            </Link>
          </article>
        </section>
      </main>
    </div>
  )
}
