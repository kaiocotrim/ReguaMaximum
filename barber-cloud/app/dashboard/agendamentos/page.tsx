// app/(dashboard)/agendamentos/page.tsx  (ajuste o caminho conforme sua estrutura real)
import { Suspense } from "react"
import Agendados from "@/app/_components/dashboardComponents/agendamentos/total/Agendados"
import AgendadosSkeleton from "@/app/_components/dashboardComponents/agendamentos/total/AgendadosSkeleton"

const AgendamentosPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-black to-zinc-950 p-4 md:p-8">
      <Suspense fallback={<AgendadosSkeleton />}>
        <Agendados />
      </Suspense>
    </div>
  )
}

export default AgendamentosPage