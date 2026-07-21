import { getServices } from "@/app/_actions/service/get-services";

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Serviços</h1>

      <p>Total de serviços: {services.length}</p>

      <pre>{JSON.stringify(services, null, 2)}</pre>
    </div>
  );
}