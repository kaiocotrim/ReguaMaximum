import { getServices } from "@/app/_actions/service/get-services"
import { ServiceCard } from "../../_components/dashboardComponents/services/service-card"
import { ServicesHeader } from "../../_components/dashboardComponents/services/services-header"
import { EmptyServices } from "../../_components/dashboardComponents/services/empty-services"

export default async function ServicesPage() {
  const services = await getServices()

  return (
    <div className="space-y-8 p-6">
      <ServicesHeader />

      {services.length === 0 ? (
        <EmptyServices />
      ) : (
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
      )}
    </div>
  )
}