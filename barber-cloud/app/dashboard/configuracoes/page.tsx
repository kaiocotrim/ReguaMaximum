import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import {
  CalendarClock,
  CheckCircle2,
  Clock3,
  Store,
  Settings2,
  ShieldCheck,
} from "lucide-react"

import { BarbershopAvailabilitySettings } from "@/app/_components/dashboardComponents/BarbershopAvailabilitySettings"
import { BarbershopDetailsForm } from "@/app/_components/dashboardComponents/BarbershopDetailsForm"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/_components/ui/card"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PlanLicenseStatus } from "@/app/generated/prisma/client"
import {
  getPlanDetails,
  type SubscriptionPlanCode,
} from "@/app/_lib/plan-license-config"
import { db } from "@/app/_lib/prisma"

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "long",
  timeZone: "America/Sao_Paulo",
})

function formatRemainingTime(expiresAt: Date, now: Date) {
  const remainingMs = Math.max(0, expiresAt.getTime() - now.getTime())
  const totalHours = Math.ceil(remainingMs / 3_600_000)
  const days = Math.floor(totalHours / 24)
  const hours = totalHours % 24

  if (days === 0) {
    return `${hours} ${hours === 1 ? "hora" : "horas"}`
  }

  if (hours === 0) {
    return `${days} ${days === 1 ? "dia" : "dias"}`
  }

  return `${days} ${days === 1 ? "dia" : "dias"} e ${hours} ${
    hours === 1 ? "hora" : "horas"
  }`
}

export default async function ConfiguracoesPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect("/login")

  const now = new Date()
  const barbershop = await db.barbershop.findFirst({
    where: { ownerId: session.user.id },
    select: {
      id: true,
      name: true,
      address: true,
      phones: true,
      description: true,
      cidade: true,
      instagram: true,
      horarioAbertura: true,
      horarioFechamento: true,
      acceptsBookings: true,
      licenses: {
        select: {
          plan: true,
          status: true,
          activatedAt: true,
          expiresAt: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  })

  if (!barbershop) redirect("/minha-barbearia")

  const activeLicense = barbershop.licenses.find(
    (license) =>
      license.status === PlanLicenseStatus.ACTIVE &&
      Boolean(license.expiresAt && license.expiresAt > now),
  )
  const isLegacyBarbershop = barbershop.licenses.length === 0
  const plan = activeLicense
    ? getPlanDetails(activeLicense.plan as SubscriptionPlanCode)
    : null
  const remainingTime = activeLicense?.expiresAt
    ? formatRemainingTime(activeLicense.expiresAt, now)
    : null

  return (
    <div className="mx-auto w-full max-w-5xl py-5 sm:py-8">
      <div className="mb-7">
        <div className="flex items-center gap-2 text-[#71910d] dark:text-[#C3F32C]">
          <Settings2 className="h-4 w-4" />
          <p className="text-xs font-bold uppercase tracking-[0.18em]">
            Controle da barbearia
          </p>
        </div>
        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Configurações
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Atualize os dados públicos, controle os agendamentos e acompanhe sua licença.
        </p>
      </div>

      <Card className="mb-5 rounded-3xl border-border/60 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#C3F32C]/20 text-[#557500] dark:text-[#C3F32C]">
            <Store className="h-5 w-5" />
          </div>
          <CardTitle className="mt-3 text-xl">
            Informações da barbearia
          </CardTitle>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Estes dados aparecem para os clientes no perfil público da sua
            barbearia.
          </p>
        </CardHeader>
        <CardContent>
          <BarbershopDetailsForm barbershop={barbershop} />
        </CardContent>
      </Card>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <Card className="rounded-3xl border-border/60 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#C3F32C]/20 text-[#557500] dark:text-[#C3F32C]">
              <CalendarClock className="h-5 w-5" />
            </div>
            <CardTitle className="mt-3 text-xl">
              Disponibilidade para agendamentos
            </CardTitle>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Pause novas marcações quando a barbearia estiver fechada, em
              férias ou temporariamente indisponível.
            </p>
          </CardHeader>
          <CardContent>
            <BarbershopAvailabilitySettings
              initialEnabled={barbershop.acceptsBookings}
            />
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-border/60 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#C3F32C]/20 text-[#557500] dark:text-[#C3F32C]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <CardTitle className="mt-3 text-xl">Sua licença</CardTitle>
            <p className="text-sm text-muted-foreground">
              Informações do acesso da {barbershop.name}.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-border bg-muted/35 p-4">
              <p className="text-xs font-medium text-muted-foreground">
                Plano atual
              </p>
              <div className="mt-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <p className="text-lg font-bold">
                  {plan?.label ?? (isLegacyBarbershop ? "Legado" : "Indisponível")}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-muted/35 p-4">
              <p className="text-xs font-medium text-muted-foreground">
                Tempo restante
              </p>
              <div className="mt-2 flex items-center gap-2">
                <Clock3 className="h-5 w-5 text-[#71910d] dark:text-[#C3F32C]" />
                <p className="text-lg font-bold">
                  {remainingTime ??
                    (isLegacyBarbershop ? "Sem vencimento" : "Licença expirada")}
                </p>
              </div>
              {activeLicense?.expiresAt && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Válida até {dateFormatter.format(activeLicense.expiresAt)}.
                </p>
              )}
            </div>

            {activeLicense?.activatedAt && (
              <p className="text-xs leading-relaxed text-muted-foreground">
                Licença ativada em{" "}
                {dateFormatter.format(activeLicense.activatedAt)}.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
