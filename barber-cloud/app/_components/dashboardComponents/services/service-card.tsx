import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";

interface ServiceCardProps {
  service: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    price: string | number;
  };
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 transition-all hover:border-[#C3F32C]">
      <div className="relative h-48 w-full">
        <Image
          src={service.imageUrl}
          alt={service.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="space-y-3 p-5">
        <div>
          <h2 className="text-lg font-semibold text-white">
            {service.name}
          </h2>

          <p className="mt-1 line-clamp-2 text-sm text-zinc-400">
            {service.description}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-[#C3F32C]">
            R$ {Number(service.price).toFixed(2)}
          </span>

          <div className="flex gap-2">
            <button className="rounded-lg bg-zinc-800 p-2 transition hover:bg-zinc-700">
              <Pencil size={18} />
            </button>

            <button className="rounded-lg bg-red-500/20 p-2 text-red-500 transition hover:bg-red-500/30">
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}