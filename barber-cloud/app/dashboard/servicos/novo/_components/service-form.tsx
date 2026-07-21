"use client";

import Link from "next/link";
import { createService } from "@/app/_actions/service/create-service";

export function ServiceForm() {
  return (
    <form
      action={createService}
      className="mx-auto max-w-2xl space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-8"
    >
      <div>
        <h1 className="text-3xl font-bold text-white">
          Novo Serviço
        </h1>

        <p className="mt-2 text-sm text-zinc-400">
          Cadastre um novo serviço para sua barbearia.
        </p>
      </div>

      {/* Nome */}
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-300">
          Nome do Serviço
        </label>

        <input
          name="name"
          type="text"
          placeholder="Ex: Corte Degradê"
          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-[#C3F32C]"
          required
        />
      </div>

      {/* Descrição */}
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-300">
          Descrição
        </label>

        <textarea
          name="description"
          rows={4}
          placeholder="Descreva o serviço..."
          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-[#C3F32C]"
          required
        />
      </div>

      {/* Preço */}
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-300">
          Preço
        </label>

        <input
          name="price"
          type="number"
          step="0.01"
          min="0"
          placeholder="0,00"
          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-[#C3F32C]"
          required
        />
      </div>

      {/* Botões */}
      <div className="flex justify-end gap-4">
        <Link
          href="/dashboard/servicos"
          className="rounded-xl border border-zinc-700 px-6 py-3 text-white transition hover:bg-zinc-800"
        >
          Cancelar
        </Link>

        <button
          type="submit"
          className="rounded-xl bg-[#C3F32C] px-6 py-3 font-semibold text-black transition hover:opacity-90"
        >
          Salvar Serviço
        </button>
      </div>
    </form>
  );
}