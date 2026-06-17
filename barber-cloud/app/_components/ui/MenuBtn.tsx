"use client"
import { useRouter } from "next/navigation"

import { LoginProviders } from "@/app/_components/LoginProviders"

import Image from "next/image"
import { signIn, signOut, useSession } from "next-auth/react"

// ─── Componentes de UI ───────────────────────────────────────────────────────
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "./sheet"

import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { Button } from "./button"
import { DirectionProvider } from "./direction"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog"

// ─── Ícones ───────────────────────────────────────────────────────────────────
import {
  CalendarCheck2,
  ChevronRight,
  Clock,
  Crown,
  Heart,
  LogInIcon,
  LogOut,
  Menu,
  ScissorsLineDashed,
  Settings,
  CircleUser,
  House,
  Lock,
  User
} from "lucide-react"
import { Direction } from "radix-ui"
import { LoginForm } from "../login-form"
import { Scissors } from "lucide-react"

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface MenuBtnProps {
  className?: string
}

// ─── Itens de navegação do menu lateral ───────────────────────────────────────
const MENU_ITEMS = [
  {
    icon: House,
    label: "Inicio",
    description: "Volte para tela de inicio",
    href: "/",
  },
  {
    icon: Scissors,
    label: "Minha Barbearia",
    description: "Gerencie sua barbearia",
    href: "/barbershop",
    requiresAuth: true,
    onlyBarber: true, // ← flag
  },
  {
    icon: CalendarCheck2,
    label: "Agendamentos",
    description: "Agendamentos e histórico",
    requiresAuth: true,
    href: "/appointments",
  },
  {
    icon: ScissorsLineDashed,
    label: "Serviços",
    description: "Gerencie seus serviços",
    onlyBarber: true, // ← flag
  },

  {
    icon: Heart,
    label: "Favoritos",
    description: "Seus favoritos",
    href: "/favorites",
    requiresAuth: true,
  },

  {
    icon: Settings,
    label: "Configurações",
    description: "Ajustes da conta",
    requiresAuth: true,
  },
]

// ─── Provedores de login disponíveis ──────────────────────────────────────────
const LOGIN_PROVIDERS = [
  { src: "/google-icon.svg", label: "Google" },
  { src: "/facebook-icon.svg", label: "Facebook" },
  { src: "/Apple-icon.svg", label: "Apple" },
  { src: "/GitHub-icon.svg", label: "GitHub" },
]

// ─── Componente principal ─────────────────────────────────────────────────────
const MenuBtn = ({ className }: MenuBtnProps) => {
  const { data } = useSession()
  const router = useRouter()
  const role = data?.user?.role // "BARBER" ou "CLIENT"
  const isLoggedIn = !!data?.user
  //  console.log("sessão completa:", data)
  //  console.log("role:", role)

  // ── Handlers de autenticação ──────────────────────────────────────────────
  const handleLoginWithGoogleClick = () => signIn("google")
  const handleLoginWithGithubClick = () => signIn("github")
  const handleLoginWithFacebookClick = () => signIn("facebook")

  const handleLogoutClick = async () => {
    await signOut({ redirect: false })
    window.location.reload()
  }

  return (
    <Sheet>
      {/* Botão de abertura do menu — ícone de hambúrguer */}
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="secondary"
          className={className ?? "text-white5 cursor-pointer"}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      {/* Painel lateral do menu */}
      <SheetContent className="flex flex-col overflow-y-auto border-l border-white/[0.08] bg-[#111111]/95 px-5 text-white shadow-[-20px_0_60px_rgba(0,0,0,0.65)] backdrop-blur-2xl">
        {/* ── Cabeçalho: perfil do usuário ou CTA de login ─────────────────── */}
        <SheetHeader className="mt-8 space-y-0">
          {/* Card de perfil — só aparece se logado */}
          {data?.user && (
            <div className="flex items-center gap-4 rounded-2xl border border-white/[0.05] bg-[#1f1f1f] p-4">
              <div className="relative flex-shrink-0">
                <Avatar className="h-13 w-13 rounded-2xl">
                  <AvatarImage
                    src={data.user.image ?? ""}
                    alt="avatar"
                    className="rounded-2xl object-cover"
                  />
                  <AvatarFallback className="rounded-2xl bg-[#C3F32C] text-base font-bold text-black">
                    CN
                  </AvatarFallback>
                </Avatar>

                {/* Badge VIP sobre o avatar */}
                <span className="absolute -right-1.5 -bottom-1.5 flex items-center gap-0.5 rounded-full border-2 border-[#161616] bg-[#C3F32C] px-1.5 py-0.5 text-[9px] font-black text-black">
                  {role === "BARBER" ? (
                    <Scissors className="h-2 w-2" />
                  ) : (
                    <User className="h-2 w-2" />
                  )}
                  {role === "BARBER" ? "BAR" : "VIP"}
                </span>
              </div>

              {/* Nome e e-mail do usuário */}
              <div className="min-w-0">
                <SheetTitle className="truncate text-[15px] font-semibold text-white">
                  {data.user.name}
                </SheetTitle>
                <SheetDescription className="truncate text-xs text-[#555]">
                  {data.user.email}
                </SheetDescription>
              </div>
            </div>
          )}

          {/* Card de login — só aparece se deslogado */}
          {!data?.user && (
            <div className="flex items-center justify-between rounded-2xl border border-white/[0.05] bg-[#1f1f1f] px-4 py-3">
              <div className="flex items-center gap-2">
                <CircleUser className="h-5 w-5 text-[#555]" />
                <SheetTitle className="text-sm font-normal text-[#555]">
                  Faça o seu login
                </SheetTitle>
              </div>

              <Button
                onClick={() => router.push("/login")}
                size="sm"
                className="h-8 cursor-pointer rounded-xl bg-[#C3F32C] text-xs font-bold text-black hover:bg-[#d4f542]"
              >
                <LogInIcon className="mr-1.5 h-3.5 w-3.5" />
                <p className="text-[#254F50]">Entrar</p>
              </Button>
            </div>
          )}

          {/* Headline da marca — aparece SEMPRE, logado ou não */}
          <div className="mt-4 rounded-2xl border border-l-[3px] border-white/[0.05] border-l-[#C3F32C] bg-[#1f1f1f] px-5 py-[18px]">
            <p className="text-xl leading-tight font-black tracking-tight text-white">
              {!isLoggedIn
                ? "Venha entrar para o time da "
                : role === "BARBER"
                  ? "Mais um cliente para deixar "
                  : "Vai deixar o cabelo "}
              {!isLoggedIn ? (
                <span className="text-[#C3F32C]">RéguaMáxima.</span>
              ) : (
                <>
                  na <span className="text-[#C3F32C]">régua?</span>
                </>
              )}
            </p>
            <p className="mt-1 text-xs font-medium text-[#444]">
              Régua <span className="text-[#C3F32C]/70">Máxima.</span>
            </p>
          </div>
        </SheetHeader>

        {/* Divisor visual entre cabeçalho e menu de navegação */}
        <div className="mt-6 h-px w-full bg-white/[0.05]" />

        {/* ── Menu de navegação principal ──────────────────────────────────── */}
        <nav className="mt-6">
          {/* Label da seção */}
          <div className="mb-3 flex items-center gap-3 px-1">
            <span className="text-[10px] font-bold tracking-[0.15em] text-[#333] uppercase">
              Menu
            </span>
            <div className="h-px flex-1 bg-white/[0.05]" />
          </div>

          {!data && (
            <div className="mb-4 rounded-2xl border border-white/5 bg-[#1a1a1a] p-4">
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Acesso Completo
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Entre na sua conta para acessar agendamentos e recursos
                    exclusivos.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Lista de itens do menu */}
          <div className="flex flex-col gap-0.5">
            {MENU_ITEMS.filter(
              (item) => !item.onlyBarber || role === "BARBER",
            ).map(({ icon: Icon, label, description, href, requiresAuth }) => {
              const locked = requiresAuth && !isLoggedIn

              return (
                <Button
                  key={label}
                  variant="ghost"
                  onClick={() => !locked && href && router.push(href)}
                  className={`group flex h-auto w-full cursor-pointer items-center justify-between rounded-xl border px-3.5 py-3 transition-all ${
                    locked
                      ? "cursor-default border-white/[0.03] bg-[#161616] "
                      : "border-white/[0.05] bg-[#1a1a1a] hover:border-white/[0.08] hover:bg-[#222]"
                  }`}
                >
                  {/* Ícone + texto do item */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[10px] border ${
                        locked
                          ? "border-white/[0.03] bg-white/[0.03]"
                          : "border-white/[0.05] bg-[#C3F32C]/10"
                      }`}
                    >
                      <Icon
                        className={`h-[17px] w-[17px] ${locked ? "text-[#333]" : "text-[#C3F32C]"}`}
                      />
                    </div>
                    <div className="text-left">
                      <p
                        className={`text-[14px] font-semibold ${locked ? "text-[#333]" : "text-[#eee]"}`}
                      >
                        {label}
                      </p>
                      <p className="text-[11px] text-[#333]">{description}</p>
                    </div>
                  </div>

                  {/* Cadeado se bloqueado, seta se liberado */}
                  {locked ? (
                    <Lock className="h-4 w-4 flex-shrink-0 text-[#333] transition-colors group-hover:text-[#C3F32C]" />
                  ) : (
                    <ChevronRight className="h-4 w-4 flex-shrink-0 text-[#333] transition-all group-hover:translate-x-0.5 group-hover:text-[#C3F32C]" />
                  )}
                </Button>
              )
            })}
          </div>
        </nav>

        {/* ── Rodapé: botão de logout (visível somente quando logado) ─────── */}
        {data?.user && (
          <div className="mt-auto border-t border-white/[0.05] pt-4 pb-6">
            {/* Dialog de confirmação antes de efetuar logout */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full cursor-pointer justify-start gap-3 rounded-xl border border-white/[0.05] hover:border-red-500/20 hover:bg-transparent hover:text-red-500"
                >
                  <LogOut className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium text-red-500">
                    Sair da conta
                  </span>
                </Button>
              </DialogTrigger>

              {/* Modal de confirmação de logout */}
              <DialogContent className="border border-white/[0.05] bg-[#161616] text-white">
                <DialogHeader className="space-y-5">
                  {/* Ícone de aviso */}
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
                    <LogOut className="h-6 w-6 text-red-500" />
                  </div>

                  {/* Título e descrição */}
                  <div className="space-y-1 text-center">
                    <DialogTitle className="text-lg font-bold text-white">
                      Sair da conta?
                    </DialogTitle>
                    <DialogDescription className="text-sm text-[#555]">
                      Sua sessão será encerrada e você precisará entrar
                      novamente.
                    </DialogDescription>
                  </div>

                  {/* Botão de confirmação de saída */}
                  <Button
                    onClick={handleLogoutClick}
                    className="w-full cursor-pointer rounded-xl bg-red-500 font-bold text-white hover:bg-red-600"
                  >
                    Confirmar saída
                  </Button>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

export default MenuBtn
