import { Suspense } from "react";

const AgendamentosPage = () => {
    return ( 
        <div>
            <Suspense fallback={<div>Loading...</div>}>
            
            <h1>Agendamentos</h1>
            

            </Suspense>
        </div>
     );
}
 
export default AgendamentosPage;