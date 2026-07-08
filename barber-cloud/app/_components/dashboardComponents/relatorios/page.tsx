// const relatorios = () => {
//     return (  
//         div className="flex flex-col gap-4">
//             <div className="flex flex-col gap-2">
//                 <h1 className="text-2xl font-semibold">Relatórios</h1>
//             </div>  
//         </div> 
//     );
// }
 
// export default relatorios

"use client"

import { useState } from "react"
import { Card } from "@/app/_components/ui/card"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts"

const CHART_COLOR = "#C3F32C"

// Dados fake — depois é só trocar pelas queries reais do Prisma
const reports = {
  agendamentos: {
    label: "Agendamentos",
    description: "Total de agendamentos nos últimos 6 meses",
    data: [
      { month: "Jan", total: 42 },
      { month: "Fev", total: 58 },
      { month: "Mar", total: 51 },
      { month: "Abr", total: 67 },
      { month: "Mai", total: 73 },
      { month: "Jun", total: 89 },
    ],
  },
  barbeiros: {
    label: "Barbeiros",
    description: "Barbeiros cadastrados nos últimos 6 meses",
    data: [
      { month: "Jan", total: 2 },
      { month: "Fev", total: 2 },
      { month: "Mar", total: 3 },
      { month: "Abr", total: 3 },
      { month: "Mai", total: 4 },
      { month: "Jun", total: 5 },
    ],
  },
  clientes: {
    label: "Clientes",
    description: "Clientes cadastrados nos últimos 6 meses",
    data: [
      { month: "Jan", total: 30 },
      { month: "Fev", total: 45 },
      { month: "Mar", total: 52 },
      { month: "Abr", total: 60 },
      { month: "Mai", total: 78 },
      { month: "Jun", total: 95 },
    ],
  },
} as const

type ReportKey = keyof typeof reports

const Relatorios = () => {
  const [active, setActive] = useState<ReportKey>("agendamentos")
  const current = reports[active]

  return (
    <div className="flex w-full flex-col gap-4">
      <h1 className="text-2xl font-semibold">Relatórios</h1>

      <Card className="flex w-full flex-col gap-4 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold">
              Relatório de {current.label}
            </h2>
            <p className="text-sm text-muted-foreground">
              {current.description}
            </p>
          </div>

          <div className="flex gap-2">
            {(Object.keys(reports) as ReportKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setActive(key)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  active === key
                    ? "border-transparent text-black"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
                style={
                  active === key ? { backgroundColor: CHART_COLOR } : undefined
                }
              >
                {reports[key].label}
              </button>
            ))}
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={current.data}
              margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
            >
              <defs>
                <linearGradient id="fillRelatorio" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLOR} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={CHART_COLOR} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                stroke="currentColor"
                className="text-muted-foreground/10"
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-xs fill-muted-foreground"
              />
              <Tooltip
                cursor={false}
                content={({ active: tooltipActive, payload }) => {
                  if (!tooltipActive || !payload?.length) return null
                  const point = payload[0].payload as {
                    month: string
                    total: number
                  }
                  return (
                    <div className="rounded-lg border bg-background px-3 py-2 text-xs shadow-sm">
                      <p className="font-medium">{point.total}</p>
                      <p className="text-muted-foreground">{point.month}</p>
                    </div>
                  )
                }}
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke={CHART_COLOR}
                strokeWidth={2}
                fill="url(#fillRelatorio)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}

export default Relatorios