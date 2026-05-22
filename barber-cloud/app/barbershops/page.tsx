import BarbershopItem from "../_components/barbershop-item"
import { db } from "../_lib/prisma"
import Header from "../_components/header"

type BarbershopsPageProps = {
  searchParams: Promise<{
    search?: string
  }>
}

const BarbershopsPage = async ({
  searchParams,
}: BarbershopsPageProps) => {

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
      <h2 className="text-xs font-bold text-[#C3F32C] pl-5 pt-5 uppercase">
        Resultados para &quot;{search}&quot;
      </h2>

      <div className="grid grid-cols-2 gap-5 p-5">
        {barbershops.map((barbershop) => (
          <BarbershopItem
            key={barbershop.id}
            barbershop={barbershop}
          />
        ))}
      </div>
    </div>
  )
}

export default BarbershopsPage