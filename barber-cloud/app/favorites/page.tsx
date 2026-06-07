import Header from "../_components/header"
import BarbershopItem from "../_components/barbershop-item"
import { db } from "../_lib/prisma"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card"
import { Heart } from "lucide-react"

const FavoritesPage = async () => {
  const favorites = await db.favoriteBarbershop.findMany({
    include: {
      barbershop: true,
    },
  })

  return (
    <div>
      <Header />

      <div className="m-5">
        <div className="rounded-xl border border-border/40 bg-card px-7 py-6">
          {/* Badge */}
          <div className="mb-4 flex items-center gap-1.5 text-[11px] text-red-500 font-medium uppercase tracking-widest text-muted-foreground">
            <Heart className="h-3 w-3 text-red-500 fill-[#FF0000]" />
            favoritos
          </div>

          {/* Título e descrição */}
          <h1 className="mb-1 text-[18px] font-medium leading-snug">
            Barbearias que você curte
          </h1>
          <p className="mb-6 text-[13px] text-muted-foreground">
            Seus estabelecimentos salvos em um só lugar.
          </p>

          {/* Rodapé */}
          <div className="flex items-center justify-between border-t border-border/30 pt-4">
            <span className="text-[13px] text-muted-foreground">
              <strong className="font-medium text-foreground">
                {favorites.length}
              </strong>{" "}
              {favorites.length === 1 ? "barbearia salva" : "barbearias salvas"}
            </span>
          </div>
        </div>
      </div>

      {favorites.length === 0 ? (
        <p className="px-5 text-sm text-muted-foreground">
          Você ainda não salvou nenhuma barbearia.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-5 p-5">
          {favorites.map((favorite) => (
            <BarbershopItem
              key={favorite.barbershop.id}
              barbershop={favorite.barbershop}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default FavoritesPage