// app/(dashboard)/agendamentos/page.tsx
import { Suspense } from "react"
import Agendados from "@/app/_components/dashboardComponents/agendamentos/total/Agendados"
import AgendadosSkeleton from "@/app/_components/dashboardComponents/agendamentos/total/AgendadosSkeleton"

const AgendamentosPage = () => {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <Suspense fallback={<AgendadosSkeleton />}>
        <Agendados />
      </Suspense>
    </div>
  )
}

export default AgendamentosPage