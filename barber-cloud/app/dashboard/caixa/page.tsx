import { getServerSession } from "next-auth"
import { ArrowDownCircle, ArrowUpCircle, Banknote, Wallet } from "lucide-react"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/app/_lib/prisma"
import { Card } from "@/app/_components/ui/card"
import { CashMovementForm } from "@/app/_components/dashboardComponents/CashMovementForm"

const money = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

const methodLabel = {
  DINHEIRO: "Dinheiro",
  PIX: "Pix",
  CARTAO_CREDITO: "Crédito",
  CARTAO_DEBITO: "Débito",
  OUTRO: "Outro",
} as const

export default async function CaixaPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return null

  const start = new Date()
  start.setHours(0, 0, 0, 0)
  const end = new Date(start)
  end.setDate(end.getDate() + 1)

  const [payments, movements] = await Promise.all([
    db.payment.findMany({
      where: {
        paidAt: { gte: start, lt: end },
        booking: { barbershop: { ownerId: session.user.id } },
      },
      select: {
        id: true,
        amount: true,
        method: true,
        paidAt: true,
        booking: {
          select: {
            user: { select: { name: true } },
            service: { select: { name: true } },
          },
        },
      },
      orderBy: { paidAt: "desc" },
    }),
    db.cashMovement.findMany({
      where: {
        barbershop: { ownerId: session.user.id },
        occurredAt: { gte: start, lt: end },
      },
      orderBy: { occurredAt: "desc" },
    }),
  ])

  const serviceIncome = payments.reduce(
    (total, payment) => total + Number(payment.amount),
    0,
  )
  const manualIncome = movements
    .filter((movement) => movement.type === "ENTRADA")
    .reduce((total, movement) => total + Number(movement.amount), 0)
  const expenses = movements
    .filter((movement) => movement.type === "SAIDA")
    .reduce((total, movement) => total + Number(movement.amount), 0)
  const balance = serviceIncome + manualIncome - expenses

  const transactions = [
    ...payments.map((payment) => ({
      id: payment.id,
      date: payment.paidAt,
      description: `${payment.booking.service.name} · ${payment.booking.user.name ?? "Cliente"}`,
      method: methodLabel[payment.method],
      type: "ENTRADA" as const,
      amount: Number(payment.amount),
    })),
    ...movements.map((movement) => ({
      id: movement.id,
      date: movement.occurredAt,
      description: movement.description,
      method: movement.method ? methodLabel[movement.method] : "—",
      type: movement.type,
      amount: Number(movement.amount),
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime())

  return (
    <div className="py-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Caixa</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Movimentações de hoje, {new Date().toLocaleDateString("pt-BR")}.
          </p>
        </div>
        <CashMovementForm />
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Summary title="Saldo do dia" value={balance} icon={Wallet} />
        <Summary title="Atendimentos" value={serviceIncome} icon={Banknote} />
        <Summary title="Outras entradas" value={manualIncome} icon={ArrowUpCircle} />
        <Summary title="Saídas" value={expenses} icon={ArrowDownCircle} danger />
      </div>

      <Card className="mt-5 overflow-hidden border-border p-0">
        <div className="border-b border-border p-5">
          <h2 className="font-semibold">Movimentações do dia</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Pagamentos e lançamentos manuais em ordem recente.
          </p>
        </div>
        {transactions.length === 0 ? (
          <p className="px-5 py-14 text-center text-sm text-muted-foreground">
            Nenhuma movimentação registrada hoje.
          </p>
        ) : (
          <div className="divide-y divide-border">
            {transactions.map((transaction) => (
              <div key={`${transaction.type}-${transaction.id}`} className="flex items-center gap-3 px-5 py-4">
                {transaction.type === "ENTRADA" ? (
                  <ArrowUpCircle className="h-5 w-5 shrink-0 text-emerald-500" />
                ) : (
                  <ArrowDownCircle className="h-5 w-5 shrink-0 text-red-500" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{transaction.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {transaction.date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })} · {transaction.method}
                  </p>
                </div>
                <span className={`text-sm font-semibold ${transaction.type === "SAIDA" ? "text-red-500" : "text-emerald-500"}`}>
                  {transaction.type === "SAIDA" ? "− " : "+ "}
                  {money(transaction.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

function Summary({
  title,
  value,
  icon: Icon,
  danger = false,
}: {
  title: string
  value: number
  icon: typeof Wallet
  danger?: boolean
}) {
  return (
    <Card className="border-border p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{title}</p>
        <Icon className={`h-5 w-5 ${danger ? "text-red-500" : "text-[#9fca18]"}`} />
      </div>
      <p className={`mt-3 text-2xl font-bold ${danger ? "text-red-500" : ""}`}>
        {money(value)}
      </p>
    </Card>
  )
}
