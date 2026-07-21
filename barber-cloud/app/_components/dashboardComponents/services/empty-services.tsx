import Link from "next/link";
import { Plus, Scissors } from "lucide-react";

export function EmptyServices() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/40 py-20">

      <div className="rounded-full bg-[#C3F32C]/10 p-5">
        <Scissors className="h-10 w-10 text-[#C3F32C]" />
      </div>

      <h2 className="mt-6 text-2xl font-semibold text-white">
        Nenhum serviço cadastrado
      </h2>

      <p className="mt-2 max-w-md text-center text-zinc-400">
        Cadastre o primeiro serviço da sua barbearia para que seus clientes
        possam realizar agendamentos.
      </p>

      <Link
        href="/dashboard/servicos/novo"
        className="mt-8 flex items-center gap-2 rounded-xl bg-[#C3F32C] px-5 py-3 font-semibold text-black transition hover:opacity-90"
      >
        <Plus size={18} />
        Cadastrar primeiro serviço
      </Link>
    </div>
  );
}