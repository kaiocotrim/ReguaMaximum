// // import { Card } from "@/app/_components/ui/card"
// // import { db } from "@/app/_lib/prisma"
// // import { getServerSession } from "next-auth"
// // import { authOptions } from "@/app/api/auth/[...nextauth]/route"

// // export async function StatsBarber() {
// //   const session = await getServerSession(authOptions)
// //   const userId = session?.user?.id
// //   console.log(session)

// //   const barbershop = await db.barbershop.findFirst({
// //     where: {
// //       ownerId: userId,
// //     },
// //   })

// //   const totalBarbers = await db.barber.count({
// //     where: {
// //       barbershopId: barbershop.id,
// //     },
// //   })

// //   return (
// //     <Card>
// //       <h2 className="text-lg font-semibold">Total Barbeiros</h2>
// //       <p className="text-2xl font-bold">{totalBarbers}</p>
// //       <div className="mt-2">
// //         <span className="text-muted-foreground text-sm">
// //           Barbers cadastrado no sistema
// //         </span>
// //       </div>
// //     </Card>
// //   )
// // }


// import { Card } from "@/app/_components/ui/card"
// import { Badge } from "@/app/_components/ui/badge"
// import { db } from "@/app/_lib/prisma"
// import { getServerSession } from "next-auth"
// import { authOptions } from "@/app/api/auth/[...nextauth]/route"
// import { TrendingUpIcon, TrendingDownIcon, ScissorsIcon } from "lucide-react"

// export async function StatsBarber() {
//   const session = await getServerSession(authOptions)
//   const userId = session?.user?.id

//   if (!userId) return null

//   const barbershop = await db.barbershop.findFirst({
//     where: { ownerId: userId },
//   })

//   if (!barbershop) return null

//   const totalBarbers = await db.barber.count({
//     where: { barbershopId: barbershop.id },
//   })

//   // TODO: substituir por cálculo real (ex: comparar com mês anterior)
//   const percentChange = 12.5
//   const isPositive = percentChange >= 0
//   const TrendIcon = isPositive ? TrendingUpIcon : TrendingDownIcon

//   return (
//     <Card className="gap-1 p-6 shadow-sm">
//       <div className="flex items-center justify-between">
//         <span className="text-sm text-muted-foreground">Total Barbeiros</span>
//         <Badge
//           variant="outline"
//           className={`gap-1 text-xs font-medium ${
//             isPositive
//               ? "border-emerald-500/30 text-emerald-500"
//               : "border-red-500/30 text-red-500"
//           }`}
//         >
//           <TrendIcon className="h-3 w-3" />
//           {isPositive ? "+" : ""}
//           {percentChange}%
//         </Badge>
//       </div>

//       <p className="text-3xl font-bold tracking-tight tabular-nums">
//         {totalBarbers}
//       </p>

//       <div className="mt-1 flex items-center gap-1 text-sm font-medium">
//         {isPositive ? "Crescendo este mês" : "Em queda este mês"}
//         <TrendIcon className="h-4 w-4" />
//       </div>

//       <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
//         <ScissorsIcon className="h-3.5 w-3.5" />
//         Barbeiros cadastrados no sistema
//       </div>
//     </Card>
//   )
// }


import { Card } from "@/app/_components/ui/card"
import { Badge } from "@/app/_components/ui/badge"
import { db } from "@/app/_lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { TrendingUpIcon, TrendingDownIcon, ScissorsIcon } from "lucide-react"

export async function StatsBarber() {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id

  if (!userId) return null

  const barbershop = await db.barbershop.findFirst({
    where: { ownerId: userId },
  })

  if (!barbershop) return null

  const totalBarbers = await db.barber.count({
    where: { barbershopId: barbershop.id },
  })

  // TODO: substituir por cálculo real (ex: comparar com mês anterior)
  const percentChange = 12.5
  const isPositive = percentChange >= 0
  const TrendIcon = isPositive ? TrendingUpIcon : TrendingDownIcon

  return (
    <Card className="flex flex-col gap-2 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Total Barbeiros
        </span>

        <Badge
          variant="outline"
          className={`gap-1 rounded-full border-transparent text-xs font-medium ${
            isPositive ? "text-black" : "border-red-500/30 text-red-500"
          }`}
          style={isPositive ? { backgroundColor: "#C3F32C" } : undefined}
        >
          <TrendIcon className="h-3 w-3" />
          {isPositive ? "+" : ""}
          {percentChange}%
        </Badge>
      </div>

      <p className="text-4xl font-bold tracking-tight tabular-nums">
        {totalBarbers}
      </p>

      <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
        {isPositive ? "Crescendo este mês" : "Em queda este mês"}
        <TrendIcon className="h-4 w-4" />
      </div>

      <div
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-black"
        style={{ backgroundColor: "#C3F32C" }}
      >
        <ScissorsIcon className="h-3.5 w-3.5" />
        Barbeiros cadastrados no sistema
      </div>
    </Card>
  )
}