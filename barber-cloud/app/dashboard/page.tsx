
import { getServerSession } from "next-auth"
import { DashboardStatsCard } from "@/app/_components/dashboardComponents/agendamentos/total/DashboardStatsCard"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/app/_lib/prisma"
import { redirect } from "next/navigation"
import { StatsBarber } from "@/app/_components/dashboardComponents/barbeiros/StatsBarber"
import { StatsClientes } from "@/app/_components/dashboardComponents/StatsClientes/page"
import Relatorios from "@/app/_components/dashboardComponents/relatorios/page"
import { DashboardIntro } from "@/app/_components/dashboardComponents/DashboardIntro"
import Link from "next/link"
import { MapPin, Pencil, Phone } from "lucide-react"
import { Card } from "@/app/_components/ui/card"
import { Button } from "@/app/_components/ui/button"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/login")
  }

  const barbershop = await db.barbershop.findFirst({
    where: {
      ownerId: session.user.id,
    },
  })

  if (!barbershop) {
    console.log("Nenhuma barbearia encontrada para este usuário.")
    redirect("/minha-barbearia")
  }

  return (
    <div className="leading-normal">
      <DashboardIntro />

      <h1 className="mb-2 text-2xl font-semibold">Dashboard</h1>
      <p className="text-muted-foreground mb-6">
        Bem-vindo ao painel da {barbershop.name}.
      </p>

      <Card className="mb-6 flex flex-col gap-4 border-border p-5 sm:flex-row sm:items-center">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#C3F32C]/20 text-[#557500] dark:text-[#C3F32C]">
          <Pencil className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold">Dados da barbearia</h2>
          <div className="mt-1 flex flex-col gap-1 text-sm text-muted-foreground sm:flex-row sm:gap-4">
            <span className="flex min-w-0 items-center gap-1.5">
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="truncate">{barbershop.address}</span>
            </span>
            {barbershop.phones[0] && (
              <span className="flex items-center gap-1.5">
                <Phone className="h-4 w-4 shrink-0" />
                {barbershop.phones[0]}
              </span>
            )}
          </div>
        </div>
        <Button
          asChild
          className="h-10 bg-[#C3F32C] px-4 font-bold text-black hover:bg-[#afd925]"
        >
          <Link href="/dashboard/configuracoes">
            <Pencil />
            Editar informações
          </Link>
        </Button>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardStatsCard />
        <StatsBarber />
        <StatsClientes />
        <div className="col-span-full">
          <Relatorios />
        </div>
      </div>
    </div>
  )
}
