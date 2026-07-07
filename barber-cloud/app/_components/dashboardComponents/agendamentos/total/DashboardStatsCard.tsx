// import { Card } from "@/app/_components/ui/card"
// import { Badge } from "@/app/_components/ui/badge"
// import { getServerSession } from "next-auth"
// import { authOptions } from "@/app/api/auth/[...nextauth]/route"
// import { db } from "@/app/_lib/prisma"
// import { TrendingUpIcon, TrendingDownIcon, MinusIcon, CalendarCheckIcon } from "lucide-react"

// function getMonthRange(offset: number) {
//   const now = new Date()
//   const start = new Date(now.getFullYear(), now.getMonth() + offset, 1)
//   const end = new Date(now.getFullYear(), now.getMonth() + offset + 1, 1)
//   return { start, end }
// }

// function calculatePercentChange(current: number, previous: number) {
//   if (previous === 0) return current > 0 ? 100 : 0
//   return ((current - previous) / previous) * 100
// }

// export async function DashboardStatsCard() {
//   const session = await getServerSession(authOptions)
//   const userId = session?.user?.id

//   if (!userId) return null

//   const barbershop = await db.barbershop.findFirst({
//     where: { ownerId: userId },
//   })

//   if (!barbershop) return null

//   const currentMonth = getMonthRange(0)
//   const previousMonth = getMonthRange(-1)

//   const [totalBookings, currentMonthBookings, previousMonthBookings] =
//     await Promise.all([
//       db.booking.count({
//         where: { barbershopId: barbershop.id },
//       }),
//       db.booking.count({
//         where: {
//           barbershopId: barbershop.id,
//           date: { gte: currentMonth.start, lt: currentMonth.end },
//         },
//       }),
//       db.booking.count({
//         where: {
//           barbershopId: barbershop.id,
//           date: { gte: previousMonth.start, lt: previousMonth.end },
//         },
//       }),
//     ])

//   const percentChange = calculatePercentChange(
//     currentMonthBookings,
//     previousMonthBookings,
//   )
//   const isPositive = percentChange > 0
//   const isNeutral = percentChange === 0
//   const TrendIcon = isNeutral
//     ? MinusIcon
//     : isPositive
//       ? TrendingUpIcon
//       : TrendingDownIcon

//   return (
//     <Card className="gap-2 rounded-2xl border-emerald-500/20 bg-emerald-500/5 p-6 shadow-sm">
//       <div className="flex items-center justify-between">
//         <span className="text-sm text-muted-foreground">
//           Total de Agendamentos
//         </span>
//         <Badge
//           variant="outline"
//           className={`gap-1 rounded-full text-xs font-medium ${
//             isNeutral
//               ? "border-muted-foreground/30 text-muted-foreground"
//               : isPositive
//                 ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-500"
//                 : "border-red-500/30 text-red-500"
//           }`}
//         >
//           <TrendIcon className="h-3 w-3" />
//           {isPositive && !isNeutral ? "+" : ""}
//           {percentChange.toFixed(1)}%
//         </Badge>
//       </div>

//       <p className="text-4xl font-bold tracking-tight text-emerald-500 tabular-nums">
//         {totalBookings}
//       </p>

//       <div className="flex items-center gap-1 text-sm font-medium">
//         {isNeutral
//           ? "Sem variação este mês"
//           : isPositive
//             ? "Crescendo em relação ao mês passado"
//             : "Em queda em relação ao mês passado"}
//         <TrendIcon className="h-4 w-4" />
//       </div>

//       <div className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-2.5 py-1.5 text-sm text-muted-foreground">
//         <CalendarCheckIcon className="h-3.5 w-3.5 text-emerald-500" />
//         {currentMonthBookings} este mês (era {previousMonthBookings})
//       </div>
//     </Card>
//   )
// }

import { Card } from "@/app/_components/ui/card"
import { Badge } from "@/app/_components/ui/badge"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/app/_lib/prisma"
import { TrendingUpIcon, TrendingDownIcon, MinusIcon, CalendarCheckIcon } from "lucide-react"

function getMonthRange(offset: number) {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth() + offset, 1)
  const end = new Date(now.getFullYear(), now.getMonth() + offset + 1, 1)
  return { start, end }
}

function calculatePercentChange(current: number, previous: number) {
  if (previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}

export async function DashboardStatsCard() {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id

  if (!userId) return null

  const barbershop = await db.barbershop.findFirst({
    where: { ownerId: userId },
  })

  if (!barbershop) return null

  const currentMonth = getMonthRange(0)
  const previousMonth = getMonthRange(-1)

  const [totalBookings, currentMonthBookings, previousMonthBookings] =
    await Promise.all([
      db.booking.count({
        where: { barbershopId: barbershop.id },
      }),
      db.booking.count({
        where: {
          barbershopId: barbershop.id,
          date: { gte: currentMonth.start, lt: currentMonth.end },
        },
      }),
      db.booking.count({
        where: {
          barbershopId: barbershop.id,
          date: { gte: previousMonth.start, lt: previousMonth.end },
        },
      }),
    ])

  const percentChange = calculatePercentChange(
    currentMonthBookings,
    previousMonthBookings,
  )
  const isPositive = percentChange > 0
  const isNeutral = percentChange === 0
  const TrendIcon = isNeutral
    ? MinusIcon
    : isPositive
      ? TrendingUpIcon
      : TrendingDownIcon

  return (
    <Card className="gap-2 rounded-2xl border-emerald-500/20 bg-emerald-500/5 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Total de Agendamentos
        </span>
        <Badge
          variant="outline"
          className={`gap-1 rounded-full text-xs font-medium ${
            isNeutral
              ? "border-muted-foreground/30 text-muted-foreground"
              : isPositive
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-500"
                : "border-red-500/30 text-red-500"
          }`}
        >
          <TrendIcon className="h-3 w-3" />
          {isPositive && !isNeutral ? "+" : ""}
          {percentChange.toFixed(1)}%
        </Badge>
      </div>

      <p className="text-4xl font-bold tracking-tight text-emerald-500 tabular-nums">
        {totalBookings}
      </p>

      <div className="flex items-center gap-1 text-sm font-medium">
        {isNeutral
          ? "Sem variação este mês"
          : isPositive
            ? "Crescendo em relação ao mês passado"
            : "Em queda em relação ao mês passado"}
        <TrendIcon className="h-4 w-4" />
      </div>

      <div className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-2.5 py-1.5 text-sm text-muted-foreground">
        <CalendarCheckIcon className="h-3.5 w-3.5 text-emerald-500" />
        {currentMonthBookings} este mês (era {previousMonthBookings})
      </div>
    </Card>
  )
}