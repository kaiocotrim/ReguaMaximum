import Header from "../_components/header"
import BarbershopItem from "../_components/barbershop-item"
import { db } from "../_lib/prisma"

const FavoritesPage = async () => {
  const favorites = await db.favoriteBarbershop.findMany({
    include: {
      barbershop: true,
    },
  })

  return (
    <div>
      <Header />

      <h1 className="mt-10 text-center font-bold text-white">
        Barbearias que Você Curte
      </h1>

      <div className="grid grid-cols-2 gap-5 p-5">
        {favorites.map((favorite) => (
          <BarbershopItem
            key={favorite.barbershop.id}
            barbershop={favorite.barbershop}
          />
        ))}
      </div>
    </div>
  )
}

export default FavoritesPage