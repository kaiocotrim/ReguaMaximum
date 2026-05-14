const BarberName = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params; // ✅ aguarda a Promise

  return <h1>Barber Name {id}</h1>;
};

export default BarberName;