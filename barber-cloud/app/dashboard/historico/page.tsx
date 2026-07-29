import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { History } from "lucide-react"

import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/app/_lib/prisma"
import { Card } from "@/app/_components/ui/card"

const actionLabels: Record<string, string> = {
  BARBER_SETTINGS_UPDATED: "Configurações do funcionário atualizadas",
  BOOKING_CANCELLED: "Agendamento cancelado",
  BOOKING_RESCHEDULED: "Agendamento reagendado",
  BARBERSHOP_IMAGES_UPDATED: "Fotos principais atualizadas",
}

export default async function AuditHistoryPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect("/login")

  const logs = await db.auditLog.findMany({
    where: { barbershop: { ownerId: session.user.id } },
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      action: true,
      entityType: true,
      createdAt: true,
      actor: { select: { name: true, email: true } },
    },
  })

  return (
    <div className="space-y-6 leading-normal">
      <div>
        <p className="text-sm font-medium text-[#71910d] dark:text-[#C3F32C]">
          Segurança e controle
        </p>
        <h1 className="mt-1 text-2xl font-bold">Histórico de alterações</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Confira as ações administrativas mais recentes.
        </p>
      </div>

      <Card className="overflow-hidden rounded-2xl p-0">
        {logs.length > 0 ? (
          <div className="divide-y">
            {logs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 p-4 sm:p-5">
                <div className="rounded-xl bg-muted p-2">
                  <History className="size-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">
                    {actionLabels[log.action] ?? log.action}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Por {log.actor.name ?? log.actor.email ?? "Usuário"} ·{" "}
                    {log.entityType}
                  </p>
                </div>
                <time className="shrink-0 text-xs text-muted-foreground">
                  {log.createdAt.toLocaleString("pt-BR")}
                </time>
              </div>
            ))}
          </div>
        ) : (
          <p className="p-10 text-center text-sm text-muted-foreground">
            Nenhuma alteração registrada ainda.
          </p>
        )}
      </Card>
    </div>
  )
}
