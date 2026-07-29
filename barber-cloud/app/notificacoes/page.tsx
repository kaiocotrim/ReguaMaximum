import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { Bell, CalendarX2 } from "lucide-react"

import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/app/_lib/prisma"
import Header from "@/app/_components/header"
import { Card } from "@/app/_components/ui/card"

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect("/login")

  const notifications = await db.userNotification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-[#C3F32C]/20 p-2.5 text-[#557500] dark:text-[#C3F32C]">
            <Bell className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Notificações</h1>
            <p className="text-sm text-muted-foreground">
              Avisos importantes sobre seus agendamentos.
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <Card key={notification.id} className="rounded-2xl p-4">
                <div className="flex gap-3">
                  <CalendarX2 className="mt-0.5 size-5 shrink-0 text-amber-500" />
                  <div>
                    <p className="text-sm font-semibold">{notification.title}</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {notification.message}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {notification.createdAt.toLocaleString("pt-BR")}
                    </p>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="rounded-2xl border-dashed p-10 text-center">
              <p className="text-sm font-medium">Nenhuma notificação</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Quando houver uma atualização, ela aparecerá aqui.
              </p>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
