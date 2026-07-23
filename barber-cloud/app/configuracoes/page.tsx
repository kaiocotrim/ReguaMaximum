import Header from "../_components/header"
import { ThemeToggle } from "../_components/ui/theme-toggle"
import { Sun, Moon } from "lucide-react"

export default function TemaPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-foreground">Aparência</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Escolha como o app deve ser exibido.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent">
                <Moon className="h-4 w-4 text-[#C3F32C] dark:block hidden" />
                <Sun className="h-4 w-4 text-[#C3F32C] dark:hidden block" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Tema escuro</p>
                <p className="text-xs text-muted-foreground">
                  Alterna entre claro e escuro
                </p>
              </div>
            </div>

            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  )
}