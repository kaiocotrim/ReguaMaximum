"use client"

import { useState } from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Card } from "@/app/_components/ui/card"

export type DashboardChartPoint = {
  month: string
  bookings: number
  revenue: number
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  })
}

export function DashboardCharts({ data }: { data: DashboardChartPoint[] }) {
  const [view, setView] = useState<"bookings" | "revenue">("bookings")
  const isBookings = view === "bookings"

  return (
    <Card className="gap-0 overflow-hidden rounded-2xl p-0">
      <div className="flex flex-col gap-4 border-b p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h2 className="font-semibold">Desempenho dos últimos 6 meses</h2>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Dados reais dos agendamentos e pagamentos confirmados.
          </p>
        </div>
        <div className="grid grid-cols-2 rounded-xl bg-muted p-1">
          {[
            ["bookings", "Agendamentos"],
            ["revenue", "Faturamento"],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setView(key as "bookings" | "revenue")}
              className={`cursor-pointer rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                view === key
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[280px] w-full px-2 py-5 sm:h-[340px] sm:px-5">
        <ResponsiveContainer width="100%" height="100%">
          {isBookings ? (
            <BarChart accessibilityLayer data={data}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                fontSize={12}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                width={32}
                fontSize={12}
              />
              <Tooltip
                cursor={{ fill: "var(--muted)", opacity: 0.45 }}
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null
                  return (
                    <div className="rounded-xl border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-lg">
                      <p className="text-muted-foreground">{label}</p>
                      <p className="mt-1 font-bold">
                        {Number(payload[0].value)} agendamentos
                      </p>
                    </div>
                  )
                }}
              />
              <Bar
                dataKey="bookings"
                fill="#C3F32C"
                radius={[6, 6, 0, 0]}
                maxBarSize={52}
              />
            </BarChart>
          ) : (
            <AreaChart accessibilityLayer data={data}>
              <defs>
                <linearGradient id="dashboardRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C3F32C" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#C3F32C" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                fontSize={12}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={58}
                fontSize={12}
                tickFormatter={(value) => formatCurrency(Number(value))}
              />
              <Tooltip
                cursor={{ stroke: "var(--border)" }}
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null
                  return (
                    <div className="rounded-xl border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-lg">
                      <p className="text-muted-foreground">{label}</p>
                      <p className="mt-1 font-bold">
                        {formatCurrency(Number(payload[0].value))}
                      </p>
                    </div>
                  )
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#9fc821"
                strokeWidth={2.5}
                fill="url(#dashboardRevenue)"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
