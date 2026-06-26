"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
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
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="bg-black border-r border-neutral-800">
      <SidebarHeader className="px-4 py-10 border-b border-neutral-800">
        <div className="flex items-center gap-3 leading-normal">
          <div className="w-8 h-8 rounded-lg bg-lime-400 flex items-center justify-center shrink-0">
            <Scissors size={16} className="text-black" />
          </div>
          <span className="font-semibold text-sm text-white">
            Minha Barbearia
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-black">
        <SidebarGroup>
          <SidebarGroupLabel className="text-lime-400 font-bold tracking-widest text-[10px]">
            Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className={
                      pathname === item.url
                        ? "bg-lime-400 text-black font-semibold hover:bg-lime-300 hover:text-black"
                        : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
                    }
                  >
                    <Link href={item.url} className="leading-normal tracking-normal">
                      <item.icon size={16} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="bg-neutral-800" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-lime-400 font-bold tracking-widest text-[10px]">
            Financeiro
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {financeiroItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className={
                      pathname === item.url
                        ? "bg-lime-400 text-black font-semibold hover:bg-lime-300 hover:text-black"
                        : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
                    }
                  >
                    <Link href={item.url} className="leading-normal tracking-normal">
                      <item.icon size={16} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="bg-neutral-800" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-lime-400 font-bold tracking-widest text-[10px]">
            Configurações
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {configItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className={
                      pathname === item.url
                        ? "bg-lime-400 text-black font-semibold hover:bg-lime-300 hover:text-black"
                        : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
                    }
                  >
                    <Link href={item.url} className="leading-normal tracking-normal">
                      <item.icon size={16} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-neutral-800 bg-black">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="leading-normal hover:bg-neutral-900"
            >
              <div className="w-8 h-8 rounded-full bg-neutral-900 border border-lime-400 flex items-center justify-center text-xs font-semibold text-lime-400 shrink-0">
                GM
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-semibold text-white">Gerente</span>
                <span className="text-xs text-neutral-500">Admin</span>
              </div>
              <MoreVertical size={16} className="ml-auto text-neutral-600" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}