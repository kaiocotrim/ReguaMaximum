import { Card } from "@/app/_components/ui/card"
import { db } from "@/app/_lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { UsersIcon } from "lucide-react"

export async function StatsClientes() {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id



  return (
    <Card className="flex flex-col gap-2 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Clientes</span>
      </div>

      <p className="text-4xl font-bold tracking-tight tabular-nums">
        0
      </p>
      <p className="text-sm text-muted-foreground">
        Monitore seus clientes cadastrados.
      </p>
      <div className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-black" style={{ backgroundColor: "#C3F32C" }}>
        <UsersIcon className="h-3.5 w-3.5" />
        Total de clientes cadastrados
      </div>
    </Card>
  )
}