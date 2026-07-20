"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/app/_components/ui/sidebar"

import {
  LayoutDashboard,
  Calendar,
  Users,
  Scissors,
  Wallet,
  BarChart2,
  Store,
  Settings,
  MoreVertical,
  LogOut,
} from "lucide-react"

type AppSidebarProps = {
  user: {
    id: string
    name?: string |null
    email?: string | null
    image?: string | null
  }

  barbershop: {
    id: string
    name: string
    imageUrl: string
    cidade: string | null
    corMarca: string | null
    instagram: string | null
  }
}

const mainItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Agendamentos", url: "/dashboard/agendamentos", icon: Calendar },
  { title: "Serviços", url: "/dashboard/servicos", icon: Users },
  { title: "Barbeiros", url: "/dashboard/barbeiros", icon: Scissors },
]

const financeiroItems = [
  { title: "Caixa", url: "/dashboard/caixa", icon: Wallet },
  { title: "Relatórios", url: "/dashboard/relatorios", icon: BarChart2 },
]

const configItems = [
  { title: "Perfil da Barbearia", url: "/dashboard/perfil", icon: Store },
  { title: "Configurações", url: "/dashboard/configuracoes", icon: Settings },
  { title: "Sair", url: "/", icon: LogOut },
]

function NavItem({
  item,
  isActive,
}: {
  item: {
    title: string
    url: string
    icon: React.ElementType
  }
  isActive: boolean
}) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        className="p-0"
      >
        <Link
          href={item.url}
          className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 ${
            isActive
              ? "bg-white/[0.06] text-white"
              : "text-[#555] hover:bg-white/[0.03] hover:text-[#aaa]"
          }`}
        >
          <div
            className={`h-5 w-0.5 rounded-full ${
              isActive
                ? "bg-[#C3F32C]"
                : "bg-transparent"
            }`}
          />

          <item.icon
            size={17}
            className={
              isActive
                ? "text-[#C3F32C]"
                : "text-[#444] group-hover:text-[#888]"
            }
          />

          <span className="text-[13.5px] font-medium">
            {item.title}
          </span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

function SectionLabel({
  label,
}: {
  label: string
}) {
  return (
    <p className="mb-1 px-3 pt-5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#2e2e2e]">
      {label}
    </p>
  )
}

export function AppSidebar({
  user,
  barbershop,
}: AppSidebarProps) {
  const pathname = usePathname()

  return (
    <Sidebar className="border-r border-white/[0.04] bg-[#0e0e0e]">

      {/* Header */}
      <SidebarHeader className="px-5 py-6">
        <div className="flex items-center gap-3">

          {barbershop.imageUrl ? (
            <img
              src={barbershop.imageUrl}
              alt={barbershop.name}
              className="h-10 w-10 rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#C3F32C]">
              <Scissors
                size={16}
                className="text-black"
              />
            </div>
          )}

          <div className="min-w-0">
            <p className="truncate text-[13px] font-bold text-white">
              {barbershop.name}
            </p>

            <p className="text-[11px] text-[#666]">
              Dashboard
            </p>
          </div>

        </div>
      </SidebarHeader>

      {/* Menu */}
      <SidebarContent className="bg-[#0e0e0e] px-3">

        <SidebarGroup className="p-0">
          <SectionLabel label="Principal" />

          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <NavItem
                  key={item.title}
                  item={item}
                  isActive={pathname === item.url}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="p-0">
          <SectionLabel label="Financeiro" />

          <SidebarGroupContent>
            <SidebarMenu>
              {financeiroItems.map((item) => (
                <NavItem
                  key={item.title}
                  item={item}
                  isActive={pathname === item.url}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="p-0">
          <SectionLabel label="Configurações" />

          <SidebarGroupContent>
            <SidebarMenu>
              {configItems.map((item) => (
                <NavItem
                  key={item.title}
                  item={item}
                  isActive={pathname === item.url}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="bg-[#0e0e0e] px-4 pb-5 pt-3">

        <div className="mb-3 h-px w-full bg-white/[0.04]" />

        <SidebarMenu>
          <SidebarMenuItem>

            <SidebarMenuButton
              size="lg"
              className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-white/[0.04]"
            >

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C3F32C] font-bold text-black">
                {user.name?.charAt(0).toUpperCase() ?? "U"}
              </div>

              <div className="min-w-0 flex-1">

                <p className="truncate text-[13px] font-semibold text-white">
                  {user.name}
                </p>

                <p className="truncate text-[11px] text-[#666]">
                  {user.email}
                </p>

              </div>

              <MoreVertical
                size={15}
                className="text-[#444]"
              />

            </SidebarMenuButton>

          </SidebarMenuItem>
        </SidebarMenu>

      </SidebarFooter>

    </Sidebar>
  )
}