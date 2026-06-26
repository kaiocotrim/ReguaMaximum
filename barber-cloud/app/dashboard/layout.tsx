import { SidebarProvider, SidebarTrigger } from "@/app/_components/ui/sidebar"
import { AppSidebar } from "@/app/_components/dashboardComponents/AppSidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div style={{ display: "flex", minHeight: "100vh", width: "100%" }}>
        <AppSidebar />
        <main style={{ flex: 1, padding: "24px", lineHeight: "1.5", letterSpacing: "0" }}>
          <SidebarTrigger />
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}