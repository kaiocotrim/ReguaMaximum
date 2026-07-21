import { getService } from "@/app/_actions/service/service";
import { ServiceForm } from "@/app/dashboard/servicos/novo/_components/service-form";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditServicePage({ params }: Props) {

  const { id } = await params;

  const service = await getService(id);


  if (!service) {
    return (
      <div>
        Serviço não encontrado.
        
      </div>
    );
  }


  return (
    <ServiceForm service={service} />
  );
}