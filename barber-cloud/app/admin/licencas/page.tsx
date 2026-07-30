import Link from "next/link"
import { redirect } from "next/navigation"
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  Clock3,
  KeyRound,
  ShieldCheck,
} from "lucide-react"

import { PlanLicenseStatus } from "@/app/generated/prisma/client"
import { LicenseGeneratorForm } from "@/app/_components/licenses/LicenseGeneratorForm"
import { RevokeLicenseButton } from "@/app/_components/licenses/RevokeLicenseButton"
import {
  getLicenseAdminUser,
} from "@/app/_lib/license-admin"
import {
  getPlanDetails,
  type SubscriptionPlanCode,
} from "@/app/_lib/plan-license-config"
import { db } from "@/app/_lib/prisma"

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "America/Sao_Paulo",
})

function getDisplayStatus(license: {
  status: PlanLicenseStatus
  expiresAt: Date | null
}) {
  if (license.status === PlanLicenseStatus.REVOKED) {
    return {
      label: "Revogada",
      className: "bg-red-500/10 text-red-700 dark:text-red-300",
    }
  }

  if (
    license.status === PlanLicenseStatus.ACTIVE &&
    license.expiresAt &&
    license.expiresAt <= new Date()
  ) {
    return {
      label: "Expirada",
      className: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-300",
    }
  }

  const statuses = {
    AVAILABLE: {
      label: "Disponível",
      className: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
    },
    CLAIMED: {
      label: "Validada",
      className: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
    },
    ACTIVE: {
      label: "Ativa",
      className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    },
  } as const

  return statuses[license.status]
}

export default async function LicenseAdminPage() {
  const admin = await getLicenseAdminUser()
  if (!admin) redirect("/login")

  const licenses = await db.planLicense.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      codePreview: true,
      plan: true,
      durationDays: true,
      status: true,
      customerName: true,
      customerPhone: true,
      claimedAt: true,
      activatedAt: true,
      expiresAt: true,
      createdAt: true,
      claimedBy: {
        select: { name: true, email: true },
      },
      barbershop: {
        select: { name: true },
      },
    },
  })

  const now = new Date()
  const availableCount = licenses.filter(
    (license) => license.status === PlanLicenseStatus.AVAILABLE,
  ).length
  const activeCount = licenses.filter(
    (license) =>
      license.status === PlanLicenseStatus.ACTIVE &&
      Boolean(license.expiresAt && license.expiresAt > now),
  ).length
  const expiringCount = licenses.filter((license) => {
    if (
      license.status !== PlanLicenseStatus.ACTIVE ||
      !license.expiresAt ||
      license.expiresAt <= now
    ) {
      return false
    }

    return license.expiresAt.getTime() <= now.getTime() + 7 * 86_400_000
  }).length

  return (
    <div className="min-h-screen bg-[#f5f7f3] text-foreground dark:bg-zinc-950">
      <main className="mx-auto w-full max-w-7xl px-5 py-8 md:px-8 md:py-12">
        <Link
          href="/admin"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao Admin Master
        </Link>

        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#557500] dark:text-[#C3F32C]">
              Controle de planos
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              Gerador de licenças
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Gere chaves, defina a validade e acompanhe ativações e
              vencimentos.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-[#557500] dark:text-[#C3F32C]" />
            {admin ? "Acesso administrativo" : "Acesso público temporário"}
          </div>
        </div>

        <section className="mb-8 grid gap-3 sm:grid-cols-3">
          {[
            {
              label: "Chaves disponíveis",
              value: availableCount,
              icon: KeyRound,
            },
            {
              label: "Licenças ativas",
              value: activeCount,
              icon: CheckCircle2,
            },
            {
              label: "Vencem em 7 dias",
              value: expiringCount,
              icon: CalendarClock,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm"
            >
              <item.icon className="h-5 w-5 text-[#557500] dark:text-[#C3F32C]" />
              <p className="mt-5 text-3xl font-bold">{item.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </section>

        <LicenseGeneratorForm />

        <section className="mt-8 overflow-hidden rounded-3xl border border-border/70 bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-border px-5 py-5 md:px-7">
            <div>
              <h2 className="font-bold">Histórico de licenças</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Exibindo as 100 chaves mais recentes.
              </p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted">
              <Clock3 className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {licenses.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <KeyRound className="mx-auto h-9 w-9 text-muted-foreground/40" />
              <p className="mt-4 font-semibold">Nenhuma chave gerada</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Use o formulário acima para criar a primeira licença.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1040px] text-left text-sm">
                <thead className="bg-muted/55 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Chave</th>
                    <th className="px-5 py-3 font-semibold">Plano</th>
                    <th className="px-5 py-3 font-semibold">Dias</th>
                    <th className="px-5 py-3 font-semibold">Cliente</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">Ativação</th>
                    <th className="px-5 py-3 font-semibold">Expiração</th>
                    <th className="px-5 py-3 font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {licenses.map((license) => {
                    const status = getDisplayStatus(license)
                    const plan = getPlanDetails(
                      license.plan as SubscriptionPlanCode,
                    )

                    return (
                      <tr key={license.id} className="hover:bg-muted/25">
                        <td className="px-5 py-4">
                          <code className="whitespace-nowrap font-mono text-xs font-semibold">
                            {license.codePreview}
                          </code>
                        </td>
                        <td className="px-5 py-4 font-semibold">
                          {plan.label}
                        </td>
                        <td className="px-5 py-4">{license.durationDays}</td>
                        <td className="px-5 py-4">
                          <p className="max-w-44 truncate font-medium">
                            {license.customerName ??
                              license.claimedBy?.name ??
                              "Não informado"}
                          </p>
                          <p className="max-w-44 truncate text-xs text-muted-foreground">
                            {license.customerPhone ??
                              license.claimedBy?.email ??
                              license.barbershop?.name ??
                              "—"}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}
                          >
                            {status.label}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">
                          {license.activatedAt
                            ? dateFormatter.format(license.activatedAt)
                            : license.claimedAt
                              ? dateFormatter.format(license.claimedAt)
                              : "—"}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">
                          {license.expiresAt
                            ? dateFormatter.format(license.expiresAt)
                            : "—"}
                        </td>
                        <td className="px-5 py-4">
                          {license.status !== PlanLicenseStatus.REVOKED ? (
                            <RevokeLicenseButton licenseId={license.id} />
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              Sem ações
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
