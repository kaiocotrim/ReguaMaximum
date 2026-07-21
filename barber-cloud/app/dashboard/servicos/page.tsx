import { getServices } from "@/app/_actions/service/get-services"
import {ServiceCard} from "../../_components/dashboardComponents/services/service-card"

export default async function ServicesPage() {
  const services = await getServices()

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Serviços</h1>

      <p>Total de serviços: {services.length}</p>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={{
              id: service.id,
              name: service.name,
              description: service.description,
              imageUrl: service.imageUrl,
              price: service.price.toString(),
            }}
          />
        ))}
      </div>
    </div>
  )
}
