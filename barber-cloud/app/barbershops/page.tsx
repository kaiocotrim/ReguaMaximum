import BarbershopItem from "../_components/barbershop-item"
import { db } from "../_lib/prisma"
import Header from "../_components/header"
import SearchBar from "../_components/SearchBar"

type BarbershopsPageProps = {
  searchParams: Promise<{
    search?: string
    service?: string
  }>
}

const BarbershopsPage = async ({ searchParams }: BarbershopsPageProps) => {
  const { search, service } = await searchParams
  const searchTerm = search?.trim()
  const serviceTerm = service?.trim()

  const barbershops = await db.barbershop.findMany({
    where: {
      AND: [
        searchTerm
          ? {
              name: {
                contains: searchTerm,
                mode: "insensitive",
              },
            }
          : {},
        serviceTerm
          ? {
              services: {
                some: {
                  OR: [
                    {
                      name: {
                        contains: serviceTerm,
                        mode: "insensitive",
                      },
                    },
                    {
                      description: {
                        contains: serviceTerm,
                        mode: "insensitive",
                      },
                    },
                  ],
                },
              },
            }
          : {},
      ],
    },
    include: {
      reviews: { select: { rating: true } },
    },
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <section className="rounded-2xl border border-border/60 bg-card/50 p-4 sm:p-6 lg:rounded-3xl lg:p-8">
          <div className="mb-5 space-y-1 lg:mb-6">
            <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">
              Encontre sua barbearia
            </h1>
            <p className="text-sm text-muted-foreground lg:text-base">
              Pesquise pelo nome ou encontre barbearias pelo serviço desejado.
            </p>
          </div>
          <div className="w-full lg:max-w-3xl">
            <SearchBar />
          </div>
        </section>

        <section className="mt-7 lg:mt-10">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#71910d] dark:text-[#C3F32C]">
                Barbearias
              </p>
              <h2 className="mt-1 text-xl font-bold lg:text-2xl">
                {serviceTerm
                  ? `Barbearias com ${serviceTerm}`
                  : searchTerm
                  ? `Resultados para "${searchTerm}"`
                  : "Todas as barbearias"}
              </h2>
            </div>
            <span className="shrink-0 text-sm text-muted-foreground">
              {barbershops.length}{" "}
              {barbershops.length === 1 ? "resultado" : "resultados"}
            </span>
          </div>

          {barbershops.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
              {barbershops.map((barbershop) => (
                <BarbershopItem
                  key={barbershop.id}
                  barbershop={barbershop}
                />
              ))}
            </div>
          ) : (
            <div className="flex min-h-56 items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 px-6 text-center">
              <div>
                <h3 className="font-semibold">Nenhuma barbearia encontrada</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {serviceTerm
                    ? `Nenhuma barbearia cadastrou o serviço "${serviceTerm}" ainda.`
                    : "Tente pesquisar usando outro nome."}
                </p>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default BarbershopsPage
