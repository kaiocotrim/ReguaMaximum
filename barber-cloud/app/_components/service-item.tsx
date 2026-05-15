import {BarbeshopService} from "@prisma/client";   
import Image from "next/image";
import { Button } from "./ui/button";

interface ServiceItemProps {
  service: BarbeshopService;
}

const ServiceItem = ({ service }: ServiceItemProps) => {
    return (
        <div className="flex items-center gap-3 p-3 border rounded-lg mb-3">
            {/* Exibir imagem do serviço */}
            <div className="relative max-h-[110px] max-w-[110px] min-h-[110px] min-w-[110px] rounded-lg overflow-hidden">
                <Image src={service.imageUrl} alt={service.name} fill className="object-cover" />
            </div>
            {/* Direita do item: nome e preço */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-[#C3F32C]">{service.name}</h3>
                <p className="text-sm text-gray-500">{service.description}</p>
                {/* Exibir preço do serviço */}
                <div className="flex items-center justify-between">
                    <p className="text-xl font-bold">R$ {service.price.toFixed(2)}</p>
                    <Button size="sm" variant="outline" className="ml-auto">Agendar</Button>
                </div>
            </div>
        </div>
     );
}
 
export default ServiceItem;