// import { getServerSession } from "next-auth"
// import {DashboardStatsCard} from "@/app/_components/dashboardComponents/agendamentos/total/DashboardStatsCard"
// import { authOptions } from "@/app/api/auth/[...nextauth]/route"
// import { db } from "@/app/_lib/prisma"
// import { redirect } from "next/navigation"
// import { StatsBarber } from "@/app/_components/dashboardComponents/barbeiros/StatsBarber"
// import { Card } from "@/app/_components/ui/card"


// export default async function DashboardPage() {
//   const session = await getServerSession(authOptions)

//   if (!session?.user?.id) {
//     redirect("/planos")
//   }

//   const barbershop = await db.barbershop.findFirst({
//     where: {
//       ownerId: session.user.id,
//     },
//   })

//   if (!barbershop) {
//     console.log("Nenhuma barbearia encontrada para este usuário.")
//     redirect("/planos") // Depois troque para "/criar-barbearia"
//   }

//   return (
//     <div className="leading-normal">
//       <h1 className="mb-2 text-2xl font-semibold">Dashboard</h1>
//       <p className="text-muted-foreground">
//         Bem-vindo ao painel da {barbershop.name}.
//             <DashboardStatsCard />
//             <StatsBarber />
//       </p>
      
    

      
//     </div>
//   )
// }


// import { getServerSession } from "next-auth"
// import { DashboardStatsCard } from "@/app/_components/dashboardComponents/agendamentos/total/DashboardStatsCard"
// import { authOptions } from "@/app/api/auth/[...nextauth]/route"
// import { db } from "@/app/_lib/prisma"
// import { redirect } from "next/navigation"
// import { StatsBarber } from "@/app/_components/dashboardComponents/barbeiros/StatsBarber"

// export default async function DashboardPage() {
//   const session = await getServerSession(authOptions)

//   if (!session?.user?.id) {
//     redirect("/planos")
//   }

//   const barbershop = await db.barbershop.findFirst({
//     where: {
//       ownerId: session.user.id,
//     },
//   })

//   if (!barbershop) {
//     console.log("Nenhuma barbearia encontrada para este usuário.")
//     redirect("/planos") // Depois troque para "/criar-barbearia"
//   }

//   return (
//     <div className="leading-normal">
//       <h1 className="mb-2 text-2xl font-semibold">Dashboard</h1>
//       <p className="text-muted-foreground mb-6">
//         Bem-vindo ao painel da {barbershop.name}.
//       </p>

//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//         <DashboardStatsCard />
//         <StatsBarber />
//       </div>
//     </div>
//   )
// }

import { getServerSession } from "next-auth"
import { DashboardStatsCard } from "@/app/_components/dashboardComponents/agendamentos/total/DashboardStatsCard"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/app/_lib/prisma"
import { redirect } from "next/navigation"
import { StatsBarber } from "@/app/_components/dashboardComponents/barbeiros/StatsBarber"
import { StatsClientes } from "@/app/_components/dashboardComponents/StatsClientes/page"
import  Relatorios  from "@/app/_components/dashboardComponents/relatorios/page"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/planos")
  }

  const barbershop = await db.barbershop.findFirst({
    where: {
      ownerId: session.user.id,
    },
  })

  if (!barbershop) {
    console.log("Nenhuma barbearia encontrada para este usuário.")
    redirect("/planos") // Depois troque para "/criar-barbearia"
  }

  return (
    <div className="leading-normal">
      <h1 className="mb-2 text-2xl font-semibold">Dashboard</h1>
      <p className="text-muted-foreground mb-6">
        Bem-vindo ao painel da {barbershop.name}.
      </p>

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