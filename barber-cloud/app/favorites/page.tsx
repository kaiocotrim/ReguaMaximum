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

      <Card
        className="relative m-5 overflow-hidden"
        style={{ minHeight: "160px" }}
      >
        {/* Corações decorativos */}
        <Heart
          className="absolute right-[18px] -top-[10px] h-[88px] w-[88px] fill-[#C3F32C] text-[#C3F32C] opacity-[0.18]"
          style={{ animation: "floatA 3.5s ease-in-out infinite" }}
        />
        <Heart
          className="absolute right-[10px] top-[62px] h-9 w-9 fill-[#C3F32C] text-[#C3F32C] opacity-[0.13]"
          style={{ animation: "floatB 2.8s ease-in-out infinite 0.6s" }}
        />
        <Heart
          className="absolute right-[106px] top-[8px] h-5 w-5 fill-[#C3F32C] text-[#C3F32C] opacity-[0.10]"
          style={{ animation: "floatC 4s ease-in-out infinite 1s" }}
        />
        <Heart
          className="absolute right-[60px] top-[90px] h-3.5 w-3.5 fill-[#C3F32C] text-[#C3F32C]"
          style={{ animation: "floatD 3s ease-in-out infinite 0.3s" }}
        />
        <Heart
          className="absolute right-[90px] top-[50px] h-12 w-12 fill-[#C3F32C] text-[#C3F32C] opacity-[0.08]"
          style={{ animation: "shimmer 4s ease-in-out infinite 1.5s" }}
        />

        <CardHeader className="relative z-10 pb-0">
          <div className="mb-2 inline-flex w-fit items-center gap-1 rounded-full border border-[#254F50] bg-[#C3F32C] px-2.5 py-1 text-[11px] text-[#254F50]">
            <Heart className="h-3 w-3 fill-[#254F50]" />
            favoritos
          </div>

          <CardTitle className="text-[17px] font-medium">
            Barbearias que você curte
          </CardTitle>
          <CardDescription className="max-w-[55%]">
            Seus estabelecimentos salvos em um só lugar
          </CardDescription>
        </CardHeader>

        <CardFooter className="relative z-10 mt-4 border-t border-border/20 py-3">
          <span className="text-[13px] text-muted-foreground">
            <strong className="font-medium text-foreground">
              {favorites.length}
            </strong>{" "}
            {favorites.length === 1 ? "barbearia salva" : "barbearias salvas"}
          </span>
        </CardFooter>
      </Card>

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