import Link from "next/link"
import { CalendarDays, LayoutGrid } from "lucide-react"

export function BookingViewToggle({
  agendaHref,
  cardsHref,
  view,
}: {
  agendaHref: string
  cardsHref: string
  view: "cards" | "agenda"
}) {
  const baseClass =
    "inline-flex h-10 items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors"
  const activeClass = "bg-[#C3F32C] text-black"
  const inactiveClass = "text-muted-foreground hover:bg-accent hover:text-foreground"

  return (
    <div
      className="grid grid-cols-2 rounded-xl border border-border bg-muted/40 p-1"
      aria-label="Modo de visualização"
    >
      <Link
        href={cardsHref}
        className={`${baseClass} ${view === "cards" ? activeClass : inactiveClass}`}
      >
        <LayoutGrid className="h-4 w-4" />
        Atual
      </Link>
      <Link
        href={agendaHref}
        className={`${baseClass} ${view === "agenda" ? activeClass : inactiveClass}`}
      >
        <CalendarDays className="h-4 w-4" />
        Visualização em Agenda
      </Link>
    </div>
  )
}
