import { getServerSession } from "next-auth"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import {
  ArrowRight,
  CalendarClock,
  KeyRound,
  MapPin,
  Scissors,
  ShieldCheck,
  Star,
} from "lucide-react"

import { PlanLicenseStatus } from "@/app/generated/prisma/client"
import Header from "@/app/_components/header"
import { LicenseActivationForm } from "@/app/_components/licenses/LicenseActivationForm"
import { Card } from "@/app/_components/ui/card"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import {
  getPlanDetails,
  type SubscriptionPlanCode,
} from "@/app/_lib/plan-license-config"
import { db } from "@/app/_lib/prisma"

export default async function MyBarbershopPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect("/login")

  const now = new Date()
  const [ownedBarbershop, barber, claimedLicense] = await Promise.all([
    db.barbershop.findFirst({
      where: { ownerId: session.user.id },
      include: {
        reviews: { select: { rating: true } },
        licenses: {
          select: {
            id: true,
            plan: true,
            durationDays: true,
            status: true,
            activatedAt: true,
            expiresAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    }),
    db.barber.findUnique({
      where: { userId: session.user.id },
      include: {
        barbershop: {
          include: {
            reviews: { select: { rating: true } },
          },
        },
      },
    }),
    db.planLicense.findFirst({
      where: {
        claimedById: session.user.id,
        status: PlanLicenseStatus.CLAIMED,
        barbershopId: null,
      },
      orderBy: { claimedAt: "desc" },
      select: {
        id: true,
        plan: true,
        durationDays: true,
        claimedAt: true,
      },
    }),
  ])

  if (!barber) redirect("/perfil")

  const barbershop = ownedBarbershop ?? barber.barbershop
  const reviewCount = barbershop?.reviews.length ?? 0
  const average =
    barbershop && reviewCount > 0
      ? barbershop.reviews.reduce(
          (total, review) => total + review.rating,
          0,
        ) / reviewCount
      : null
  const activeLicense = ownedBarbershop?.licenses.find(
    (license) =>
      license.status === PlanLicenseStatus.ACTIVE &&
      Boolean(license.expiresAt && license.expiresAt > now),
  )
  const latestLicense = ownedBarbershop?.licenses[0]
  const isLegacyBarbershop =
    Boolean(ownedBarbershop) && ownedBarbershop?.licenses.length === 0
  const isExpired =
    Boolean(ownedBarbershop) &&
    !isLegacyBarbershop &&
    !activeLicense
  const currentPlan = activeLicense
    ? getPlanDetails(activeLicense.plan as SubscriptionPlanCode)
    : null
  const claimedPlan = claimedLicense
    ? getPlanDetails(claimedLicense.plan as SubscriptionPlanCode)
    : null
  const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeZone: "America/Sao_Paulo",
  })

  return (
    <div className="min-h-screen bg-[#f5f7f3] dark:bg-zinc-950">
      <Header />
      <main className="mx-auto w-full max-w-5xl px-5 py-8 md:px-8 md:py-12">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#71910d] dark:text-[#C3F32C]">
            Minha equipe
          </p>
          <h1 className="mt-1 text-2xl font-bold md:text-3xl">
            Minha barbearia
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gerencie o vínculo da sua barbearia e a liberação do plano.
          </p>
        </div>

        {ownedBarbershop ? (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
            <Card className="overflow-hidden rounded-3xl border-border/60 shadow-sm">
              <div className="relative h-52 w-full md:h-72">
                <Image
                  src={ownedBarbershop.capaUrl || ownedBarbershop.imageUrl}
                  alt={ownedBarbershop.name}
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <div className="absolute right-5 bottom-5 left-5 flex items-end gap-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border-2 border-white bg-card md:h-20 md:w-20">
                    <Image
                      src={ownedBarbershop.imageUrl}
                      alt={`Logo da ${ownedBarbershop.name}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 text-white">
                    <h2 className="truncate text-xl font-bold md:text-2xl">
                      {ownedBarbershop.name}
                    </h2>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-white/80">
                      <MapPin className="h-4 w-4 shrink-0" />
                      <span className="truncate">
                        {ownedBarbershop.address}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 p-5 sm:grid-cols-3 md:p-7">
                <div>
                  <p className="text-xs text-muted-foreground">Avaliação</p>
                  <p className="mt-1 flex items-center gap-1.5 font-bold">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    {average === null ? "Novo" : average.toFixed(1)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Plano</p>
                  <p className="mt-1 flex items-center gap-1.5 font-bold">
                    <ShieldCheck className="h-4 w-4 text-[#71910d] dark:text-[#C3F32C]" />
                    {currentPlan?.label ??
                      (isLegacyBarbershop ? "Legado" : "Sem acesso")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Expiração</p>
                  <p className="mt-1 flex items-center gap-1.5 font-bold">
                    <CalendarClock className="h-4 w-4 text-[#71910d] dark:text-[#C3F32C]" />
                    {activeLicense?.expiresAt
                      ? dateFormatter.format(activeLicense.expiresAt)
                      : isLegacyBarbershop
                        ? "Sem vencimento"
                        : "Expirado"}
                  </p>
                </div>
              </div>

              {!isExpired && (
                <div className="border-t border-border px-5 py-4 md:px-7">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#557500] transition hover:text-[#254F50] dark:text-[#C3F32C]"
                  >
                    Acessar Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </Card>

            <Card className="h-fit rounded-3xl border-border/60 p-5 shadow-sm md:p-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#C3F32C]/20">
                <KeyRound className="h-5 w-5 text-[#557500] dark:text-[#C3F32C]" />
              </div>
              <h2 className="mt-5 text-xl font-bold">
                {isExpired ? "Renove para continuar" : "Adicionar nova chave"}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {isExpired
                  ? "O plano desta barbearia expirou ou foi revogado. Insira uma nova chave para recuperar o acesso."
                  : "Uma nova chave soma os dias ao vencimento atual do seu plano."}
              </p>
              {latestLicense?.status === PlanLicenseStatus.REVOKED && (
                <p className="mt-3 rounded-xl bg-red-500/10 px-3 py-2 text-xs text-red-700 dark:text-red-300">
                  A última licença foi revogada.
                </p>
              )}
              <LicenseActivationForm isRenewal />
            </Card>
          </div>
        ) : claimedLicense && claimedPlan ? (
          <Card className="rounded-3xl border-[#C3F32C]/40 bg-card p-6 shadow-sm md:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C3F32C]/20">
              <ShieldCheck className="h-6 w-6 text-[#557500] dark:text-[#C3F32C]" />
            </div>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-[#557500] dark:text-[#C3F32C]">
              Chave validada
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              Plano {claimedPlan.label} liberado
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Sua licença de {claimedLicense.durationDays} dias está reservada.
              A contagem começa somente quando a criação da barbearia for
              concluída.
            </p>
            <Link
              href="/BarbieCreation"
              className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#C3F32C] px-6 text-sm font-bold text-[#254F50] transition hover:bg-[#b6e42a]"
            >
              Criar minha barbearia
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Card>
        ) : barbershop ? (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <Card className="overflow-hidden rounded-3xl border-border/60 shadow-sm">
            <div className="relative h-52 w-full md:h-72">
              <Image
                src={barbershop.capaUrl || barbershop.imageUrl}
                alt={barbershop.name}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute right-5 bottom-5 left-5 flex items-end gap-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border-2 border-white bg-card md:h-20 md:w-20">
                  <Image
                    src={barbershop.imageUrl}
                    alt={`Logo da ${barbershop.name}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 text-white">
                  <h2 className="truncate text-xl font-bold md:text-2xl">
                    {barbershop.name}
                  </h2>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-white/80">
                    <MapPin className="h-4 w-4 shrink-0" />
                    <span className="truncate">{barbershop.address}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 md:p-7">
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-xs text-muted-foreground">Avaliação</p>
                  <p className="mt-1 flex items-center gap-1.5 font-bold">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    {average === null ? "Novo" : average.toFixed(1)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Vínculo</p>
                  <p className="mt-1 flex items-center gap-1.5 font-bold">
                    <Scissors className="h-4 w-4 text-[#71910d] dark:text-[#C3F32C]" />
                    Barbeiro
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="h-fit rounded-3xl border-[#C3F32C]/30 p-5 shadow-sm md:p-7">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#C3F32C]/20">
              <KeyRound className="h-5 w-5 text-[#557500] dark:text-[#C3F32C]" />
            </div>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-[#557500] dark:text-[#C3F32C]">
              Chave de licença
            </p>
            <h2 className="mt-2 text-xl font-bold">
              Criar minha própria barbearia
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Digite a chave recebida pelo WhatsApp para liberar a criação da
              sua barbearia.
            </p>
            <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-3 text-xs leading-relaxed text-amber-800 dark:text-amber-200">
              Você ainda faz parte da equipe acima. Para utilizar a licença,
              primeiro saia dessa barbearia pelo seu perfil.
            </div>
            <LicenseActivationForm />
          </Card>
          </div>
        ) : (
          <Card className="mx-auto max-w-2xl rounded-3xl border-border/60 p-6 shadow-sm md:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C3F32C]/20">
              <KeyRound className="h-6 w-6 text-[#557500] dark:text-[#C3F32C]" />
            </div>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-[#557500] dark:text-[#C3F32C]">
              Primeiro acesso
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              Libere a criação da sua barbearia
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Digite a chave recebida pelo WhatsApp. Depois da validação, você
              será encaminhado para cadastrar sua barbearia.
            </p>
            <LicenseActivationForm />
          </Card>
        )}
      </main>
    </div>
  )
}
