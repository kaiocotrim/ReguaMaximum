import {BarbeshopService} from "@prisma/client";   

interface ServiceItemProps {
  service: BarbeshopService;
}

const ServiceItem = ({ service }: ServiceItemProps) => {
    return ( <h1>{service.name}</h1> );
}
 
export default ServiceItem;