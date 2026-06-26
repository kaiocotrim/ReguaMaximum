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

const mainItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Agendamentos", url: "/dashboard/agendamentos", icon: Calendar },
  { title: "Clientes", url: "/dashboard/clientes", icon: Users },
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
  item: { title: string; url: string; icon: React.ElementType }
  isActive: boolean
}) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} className="p-0">
        <Link
          href={item.url}
          className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 ${
            isActive
              ? "bg-white/[0.06] text-white"
              : "text-[#555] hover:bg-white/[0.03] hover:text-[#aaa]"
          }`}
        >
          {/* Pill lateral no item ativo */}
          <div
            className={`h-5 w-0.5 rounded-full transition-all duration-200 ${
              isActive ? "bg-[#C3F32C]" : "bg-transparent"
            }`}
          />

          {/* Ícone */}
          <item.icon
            size={17}
            className={`shrink-0 transition-colors duration-200 ${
              isActive ? "text-[#C3F32C]" : "text-[#444] group-hover:text-[#888]"
            }`}
          />

          {/* Label */}
          <span className="text-[13.5px] font-medium">{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

function SectionLabel({ label }: { label: string }) {
  return (
    <p className="mb-1 px-3 pt-5 text-[10px] font-bold tracking-[0.18em] text-[#2e2e2e] uppercase">
      {label}
    </p>
  )
}

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="border-r border-white/[0.04] bg-[#0e0e0e]">

      {/* Header */}
      <SidebarHeader className="px-5 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#C3F32C]">
            <Scissors size={14} className="text-black" />
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-bold text-white">
              Minha Barbearia
            </span>
            <span className="text-[11px] text-[#333]">Dashboard</span>
          </div>
        </div>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="bg-[#0e0e0e] px-3">

        <SidebarGroup className="p-0">
          <SectionLabel label="Principal" />
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {mainItems.map((item) => (
                <NavItem key={item.title} item={item} isActive={pathname === item.url} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="p-0">
          <SectionLabel label="Financeiro" />
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {financeiroItems.map((item) => (
                <NavItem key={item.title} item={item} isActive={pathname === item.url} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="p-0">
          <SectionLabel label="Configurações" />
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {configItems.map((item) => (
                <NavItem key={item.title} item={item} isActive={pathname === item.url} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="bg-[#0e0e0e] px-4 pb-5 pt-3">
        <div className="h-px w-full bg-white/[0.04] mb-3" />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-all hover:bg-white/[0.04]"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#C3F32C] text-[12px] font-black text-black">
                GM
              </div>
              <div className="flex min-w-0 flex-col text-left">
                <span className="truncate text-[13px] font-semibold text-white">
                  Gerente
                </span>
                <span className="text-[11px] text-[#333]">Admin</span>
              </div>
              <MoreVertical size={15} className="ml-auto shrink-0 text-[#2e2e2e] transition-colors group-hover:text-[#555]" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

    </Sidebar>
  )
}