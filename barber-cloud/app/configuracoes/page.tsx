import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ChevronRight, CircleHelp, Moon, Sun } from "lucide-react"
import Header from "@/app/_components/header"
import { ThemeToggle } from "@/app/_components/ui/theme-toggle"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/app/_lib/prisma"
import { UserProfileSettings } from "@/app/_components/UserProfileSettings"
import { Button } from "@/app/_components/ui/button"

export default async function ConfiguracoesPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect("/login")

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, telefone: true, image: true },
  })
  if (!user) redirect("/login")

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-2xl space-y-5 px-4 py-10">
        <div>
          <h1 className="text-xl font-bold">Perfil e configurações</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gerencie seus dados pessoais e a aparência do aplicativo.
          </p>
        </div>

        <UserProfileSettings
          initial={{
            userId: user.id,
            name: user.name ?? "",
            phone: user.telefone ?? "",
            image: user.image,
          }}
        />

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent">
                <Moon className="hidden h-4 w-4 text-[#C3F32C] dark:block" />
                <Sun className="h-4 w-4 text-[#C3F32C] dark:hidden" />
              </div>
              <div>
                <p className="text-sm font-semibold">Tema do aplicativo</p>
                <p className="text-xs text-muted-foreground">
                  Alterne entre os temas claro e escuro.
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#C3F32C]/20">
              <CircleHelp className="h-5 w-5 text-[#71910d] dark:text-[#C3F32C]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">Central de ajuda</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Veja o manual completo de agendamentos, serviços, equipe,
                pagamentos, relatórios e configurações.
              </p>
            </div>
            <Button asChild variant="outline" className="h-9 shrink-0">
              <Link href="/ajuda">
                Ver manual
                <ChevronRight />
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
