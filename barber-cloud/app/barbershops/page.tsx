type BarbershopsPageProps = {
  searchParams: Promise<{
    search?: string
  }>
}

const BarbershopsPage = async ({
  searchParams,
}: BarbershopsPageProps) => {

  const params = await searchParams

  return (
    <div>
      <h1>Barbearias</h1>
      <p>Search: {params.search}</p>
    </div>
  )
}

export default BarbershopsPage