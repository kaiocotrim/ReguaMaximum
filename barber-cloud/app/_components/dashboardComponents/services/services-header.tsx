import Link from "next/link";
import { Plus } from "lucide-react";

interface ServicesHeaderProps {
  total: number;
}

export function ServicesHeader({ total }: ServicesHeaderProps) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Serviços
        </h1>

        <p className="mt-2 text-zinc-400">
          Gerencie os serviços oferecidos pela sua barbearia.
        </p>

        <span className="mt-3 inline-block rounded-full bg-zinc-800 px-3 py-1 text-sm text-zinc-300">
          {total} serviço{total !== 1 && "s"}
        </span>
      </div>

      <Link
        href="/dashboard/servicos/novo"
        className="flex items-center gap-2 rounded-xl bg-[#C3F32C] px-5 py-3 font-semibold text-black transition hover:opacity-90"
      >
        <Plus size={18} />
        Novo Serviço
      </Link>
    </div>
  );
}