import { LoginForm } from "@/app/_components/login-form"
import { ThemeToggle } from "@/app/_components/ui/theme-toggle"

export default function Page() {
  return (
    <div className="relative flex min-h-svh w-full items-center justify-center bg-background p-6 text-foreground md:p-10">
      <div className="absolute right-6 top-6 flex items-center gap-3 rounded-full border border-border bg-card px-3 py-2 shadow-sm">
        <span className="text-xs font-medium text-muted-foreground">Tema</span>
        <ThemeToggle />
      </div>
      <LoginForm />
    </div>
  )
}
