import BarbershopItem from "../_components/barbershop-item"
import { db } from "../_lib/prisma"
import Header from "../_components/header"
import SearchBar from "../_components/SearchBar"

type BarbershopsPageProps = {
  searchParams: Promise<{
    search?: string
  }>
}

const BarbershopsPage = async ({ searchParams }: BarbershopsPageProps) => {
  const { search } = await searchParams

  const barbershops = await db.barbershop.findMany({
    where: {
      name: {
        contains: search || "",
        mode: "insensitive",
      },
    },
  })

  return (
    <div>
      <Header />

      <div className="pl-5 pr-5 pt-5">
        <SearchBar />
      </div>

      <div className="px-2">
        <h2 className="pt-5 pl-5 text-xs font-bold text-[#C3F32C] uppercase">
          Resultados para &quot;{search}&quot;
        </h2>
        <div className="grid grid-cols-2 gap-5 p-5">
          {barbershops.map((barbershop) => (
            <BarbershopItem key={barbershop.id} barbershop={barbershop} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default BarbershopsPage
