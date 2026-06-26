import  {DashboardIntro } from "@/app/_components/agenda/dashboard-intro"

export default function Dashboard() {
  return (
    <div className="leading-normal">
      <DashboardIntro></DashboardIntro>
      <h1 className="text-2xl font-semibold mb-2">Dashboard</h1>
      <p className="text-muted-foreground">Bem-vindo ao painel da barbearia.</p>
    </div>
  )
}