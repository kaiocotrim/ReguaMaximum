"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
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
  "flex min-h-10 items-center rounded-lg px-2 text-[13px] leading-4 text-[#44504a] transition-colors hover:bg-black/[0.04] hover:text-[#6d8d08] dark:text-white/65 dark:hover:bg-white/[0.05] dark:hover:text-[#C3F32C] lg:min-h-0 lg:w-fit lg:px-0 lg:text-sm lg:leading-normal lg:hover:bg-transparent"

const Footer = () => {
  const pathname = usePathname()

  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    return null
  }

  return (
    <footer className="relative overflow-hidden border-t border-black/10 bg-[#f3f5f1] text-[#18201c] tracking-normal dark:border-white/5 dark:bg-[#0e100f] dark:text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-[#C3F32C]/5 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-6 pt-8 sm:px-8 sm:pt-10 lg:px-10 lg:pb-7 lg:pt-16">
        <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-8 lg:grid-cols-[1.15fr_0.8fr_0.8fr_1.05fr] lg:gap-14">
          <div className="col-span-2 flex flex-col items-center text-center lg:col-span-1 lg:items-start lg:text-left">
            <Link
              href="/"
              aria-label="Ir para o início"
              className="flex h-20 w-36 items-center justify-center rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 transition-transform duration-300 hover:-translate-y-1 sm:h-24 sm:w-40 lg:h-28 lg:w-44 lg:p-5"
            >
              <Image
                src="/LogoMComBorder3.png"
                alt="Régua Máxima"
                width={150}
                height={82}
                className="h-auto w-full object-contain"
              />
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-[#53605a] dark:text-white/65 lg:mt-5 lg:max-w-xs lg:leading-7">
              Agendamentos, gestão e visibilidade para conectar clientes,
              barbeiros e barbearias em um só lugar.
            </p>

            <div className="mt-5 flex gap-3 lg:mt-6">
              <a
                href={supportWhatsapp}
                target="_blank"
                rel="noreferrer"
                aria-label="Falar com a Régua Máxima"
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-black/[0.06] text-[#53605a] transition-all hover:-translate-y-0.5 hover:bg-[#C3F32C] hover:text-[#0e100f] dark:bg-white/[0.07] dark:text-white/60 lg:h-9 lg:w-9 lg:rounded-lg"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <Link
                href="/ajuda"
                aria-label="Abrir a Central de Ajuda"
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-black/[0.06] text-[#53605a] transition-all hover:-translate-y-0.5 hover:bg-[#C3F32C] hover:text-[#0e100f] dark:bg-white/[0.07] dark:text-white/60 lg:h-9 lg:w-9 lg:rounded-lg"
              >
                <CircleHelp className="h-4 w-4" />
              </Link>
              <Link
                href="/barbershops"
                aria-label="Conhecer as barbearias"
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-black/[0.06] text-[#53605a] transition-all hover:-translate-y-0.5 hover:bg-[#C3F32C] hover:text-[#0e100f] dark:bg-white/[0.07] dark:text-white/60 lg:h-9 lg:w-9 lg:rounded-lg"
              >
                <Store className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-black/[0.06] bg-white/55 p-3.5 dark:border-white/[0.06] dark:bg-white/[0.025] lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:dark:bg-transparent">
            <h2 className="text-[11px] font-bold uppercase leading-4 tracking-[0.12em] text-[#6d8d08] dark:text-[#C3F32C] lg:text-xs lg:tracking-[0.2em]">
              Para clientes
            </h2>
            <nav className="mt-3 flex flex-col gap-0.5 lg:mt-5 lg:gap-3" aria-label="Links para clientes">
              {clientLinks.map((link) => (
                <Link key={link.href} href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="rounded-2xl border border-black/[0.06] bg-white/55 p-3.5 dark:border-white/[0.06] dark:bg-white/[0.025] lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:dark:bg-transparent">
            <h2 className="text-[11px] font-bold uppercase leading-4 tracking-[0.12em] text-[#6d8d08] dark:text-[#C3F32C] lg:text-xs lg:tracking-[0.2em]">
              Para profissionais
            </h2>
            <nav
              className="mt-3 flex flex-col gap-0.5 lg:mt-5 lg:gap-3"
              aria-label="Links para profissionais"
            >
              {professionalLinks.map((link) => (
                <Link key={link.href} href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="col-span-2 rounded-2xl border border-black/[0.06] bg-white/55 p-5 dark:border-white/[0.06] dark:bg-white/[0.025] lg:col-span-1 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:dark:bg-transparent">
            <h2 className="text-[11px] font-bold uppercase leading-4 tracking-[0.14em] text-[#6d8d08] dark:text-[#C3F32C] lg:text-xs lg:tracking-[0.2em]">
              Contato e suporte
            </h2>
            <div className="mt-4 grid gap-4 text-sm leading-5 text-[#44504a] dark:text-white/70 sm:grid-cols-2 lg:mt-5 lg:block lg:space-y-4">
              <a
                href="mailto:equipe@cotrimdev.com.br"
                className="flex min-w-0 items-start gap-2.5 transition-colors hover:text-[#6d8d08] dark:hover:text-[#C3F32C]"
              >
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#6d8d08] dark:text-[#C3F32C]" />
                <span className="break-all">equipe@cotrimdev.com.br</span>
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

        <div className="mt-8 flex flex-col items-center gap-2 border-t border-black/10 pt-5 text-center text-[11px] leading-5 text-[#66726c] dark:border-white/10 dark:text-white/45 sm:flex-row sm:justify-between sm:text-left sm:text-xs lg:mt-12 lg:pt-6">
          <p>© 2026 Régua Máxima. Todos os direitos reservados.</p>
          <p>Feito para fortalecer barbearias e profissionais.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
