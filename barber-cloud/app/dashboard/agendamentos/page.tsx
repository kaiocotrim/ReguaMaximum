import { Suspense } from "react";
import Agendados from "@/app/_components/dashboardComponents/agendamentos/total/Agendados"

const AgendamentosPage = () => {
    return ( 
        <div>
            <Suspense fallback={<div>Loading...</div>}>
            
            <h1>Agendamentos</h1>
            <Agendados></Agendados>

            </Suspense>
        </div>
     );
}
 
export default AgendamentosPage;