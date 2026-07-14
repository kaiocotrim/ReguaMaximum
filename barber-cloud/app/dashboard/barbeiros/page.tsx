import AddBarber from "@/app/_components/dashboardComponents/barbeiros/AddBarber/Addbarber"

export function BarbeirosPage() {
    return (
        <div>
            <div className="flex items-center justify-between">
                <h1 className="mb-2 text-2xl font-semibold">Barbeiros</h1>
            </div>
            <p className="text-muted-foreground">
                Gerencie os barbeiros da sua barbearia.
            </p>
    
            <AddBarber  />
            
        </div> 
    )
}

export default BarbeirosPage