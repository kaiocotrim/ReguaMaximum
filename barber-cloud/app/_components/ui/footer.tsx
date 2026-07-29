import Image from "next/image"
import Link from "next/link"
import {
  CalendarDays,
  CircleHelp,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Store,
} from "lucide-react"

const clientLinks = [
  { label: "Encontrar barbearias", href: "/barbershops" },
  { label: "Meus agendamentos", href: "/appointments" },
  { label: "Barbearias favoritas", href: "/favorites" },
  { label: "Perfil e configurações", href: "/configuracoes" },
]

const professionalLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Agenda", href: "/dashboard/agendamentos" },
  { label: "Serviços", href: "/dashboard/servicos" },
  { label: "Planos", href: "/planos" },
]

const supportWhatsapp =
  "https://wa.me/5511932075075?text=Olá!%20Preciso%20de%20ajuda%20com%20a%20Régua%20Máxima."

const linkClass =
  "w-fit text-sm text-[#44504a] transition-colors hover:text-[#6d8d08] dark:text-white/65 dark:hover:text-[#C3F32C]"

const Footer = () => {
  return (
    <footer className="relative overflow-hidden border-t border-black/10 bg-[#f3f5f1] text-[#18201c] dark:border-white/5 dark:bg-[#0e100f] dark:text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-[#C3F32C]/5 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-7xl px-5 pb-7 pt-12 sm:px-8 lg:px-10 lg:pt-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.15fr_0.8fr_0.8fr_1.05fr] lg:gap-14">
          <div>
            <Link
              href="/"
              aria-label="Ir para o início"
              className="flex h-28 w-44 items-center justify-center rounded-xl bg-white p-5 shadow-sm transition-transform duration-300 hover:-translate-y-1"
            >
              <Image
                src="/LogoMComBorder3.png"
                alt="Régua Máxima"
                width={150}
                height={82}
                className="h-auto w-full object-contain"
              />
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-7 text-[#53605a] dark:text-white/65">
              Agendamentos, gestão e visibilidade para conectar clientes,
              barbeiros e barbearias em um só lugar.
            </p>

            <div className="mt-6 flex gap-3">
              <a
                href={supportWhatsapp}
                target="_blank"
                rel="noreferrer"
                aria-label="Falar com a Régua Máxima"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-black/[0.06] text-[#53605a] transition-all hover:-translate-y-0.5 hover:bg-[#C3F32C] hover:text-[#0e100f] dark:bg-white/[0.07] dark:text-white/60"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <Link
                href="/ajuda"
                aria-label="Abrir a Central de Ajuda"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-black/[0.06] text-[#53605a] transition-all hover:-translate-y-0.5 hover:bg-[#C3F32C] hover:text-[#0e100f] dark:bg-white/[0.07] dark:text-white/60"
              >
                <CircleHelp className="h-4 w-4" />
              </Link>
              <Link
                href="/barbershops"
                aria-label="Conhecer as barbearias"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-black/[0.06] text-[#53605a] transition-all hover:-translate-y-0.5 hover:bg-[#C3F32C] hover:text-[#0e100f] dark:bg-white/[0.07] dark:text-white/60"
              >
                <Store className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#6d8d08] dark:text-[#C3F32C]">
              Para clientes
            </h2>
            <nav className="mt-5 flex flex-col gap-3" aria-label="Links para clientes">
              {clientLinks.map((link) => (
                <Link key={link.href} href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#6d8d08] dark:text-[#C3F32C]">
              Para profissionais
            </h2>
            <nav
              className="mt-5 flex flex-col gap-3"
              aria-label="Links para profissionais"
            >
              {professionalLinks.map((link) => (
                <Link key={link.href} href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#6d8d08] dark:text-[#C3F32C]">
              Contato e suporte
            </h2>
            <div className="mt-5 space-y-4 text-sm text-[#44504a] dark:text-white/70">
              <a
                href="mailto:equipe@cotrimdev.com.br"
                className="flex items-start gap-2.5 transition-colors hover:text-[#6d8d08] dark:hover:text-[#C3F32C]"
              >
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#6d8d08] dark:text-[#C3F32C]" />
                equipe@cotrimdev.com.br
              </a>
              <a
                href={supportWhatsapp}
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-2.5 transition-colors hover:text-[#6d8d08] dark:hover:text-[#C3F32C]"
              >
                <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-[#6d8d08] dark:text-[#C3F32C]" />
                Atendimento pelo WhatsApp
              </a>
              <p className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#6d8d08] dark:text-[#C3F32C]" />
                Atendimento online em todo o Brasil
              </p>
              <Link
                href="/ajuda"
                className="flex items-start gap-2.5 transition-colors hover:text-[#6d8d08] dark:hover:text-[#C3F32C]"
              >
                <CircleHelp className="mt-0.5 h-4 w-4 shrink-0 text-[#6d8d08] dark:text-[#C3F32C]" />
                Central de Ajuda
              </Link>
              <p className="flex items-start gap-2.5 text-[#66726c] dark:text-white/50">
                <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-[#6d8d08] dark:text-[#C3F32C]" />
                Respostas durante o horário comercial
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-black/10 pt-6 text-xs text-[#66726c] dark:border-white/10 dark:text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Régua Máxima. Todos os direitos reservados.</p>
          <p>Feito para fortalecer barbearias e profissionais.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
