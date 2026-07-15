"use client"

import { useState, useEffect, useRef } from "react"

interface ResultadoBusca {
  id: string
  nome: string
  user: {
    email: string
  }
}

export default function SearchEmail() {
  const [query, setQuery] = useState("")
  const [resultados, setResultados] = useState<ResultadoBusca[]>([])
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [selecionado, setSelecionado] = useState<ResultadoBusca | null>(null)
  const [ignorarProximaBusca, setIgnorarProximaBusca] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Se a mudança de query veio de uma seleção (clique), pula a busca
    if (ignorarProximaBusca) {
      setIgnorarProximaBusca(false)
      return
    }

    if (!query.trim()) {
      setResultados([])
      return
    }

    setCarregando(true)
    setErro(null)

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/searchBarber?q=${encodeURIComponent(query)}`,
        )
        if (!res.ok) throw new Error("Erro ao buscar dados")

        const data: ResultadoBusca[] = await res.json()
        setResultados(data)
      } catch {
        setErro("Não foi possível buscar os resultados.")
        setResultados([])
      } finally {
        setCarregando(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    function handleClickFora(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setResultados([])
      }
    }
    document.addEventListener("mousedown", handleClickFora)
    return () => document.removeEventListener("mousedown", handleClickFora)
  }, [])

  const handleSelect = (item: ResultadoBusca) => {
    setIgnorarProximaBusca(true) // evita nova busca desnecessária
    setSelecionado(item)
    setQuery(item.user.email)
    setResultados([])
  }

  const handleChangeInput = (value: string) => {
    setQuery(value)
    if (selecionado) setSelecionado(null) // invalida seleção se o usuário editar o texto
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-sm">
      <div className="relative">
        <svg
          className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#C3F32C]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35m0 0a7.5 7.5 0 10-10.6 0 7.5 7.5 0 0010.6 0z"
          />
        </svg>

        <input
          value={query}
          onChange={(e) => handleChangeInput(e.target.value)}
          placeholder="Buscar por e-mail..."
          className="w-full rounded-lg border  bg-background py-2.5 pr-9 pl-9 text-sm text-gray-50 transition outline-none placeholder:text-gray-500 focus:border-[#C3F32C] focus:ring-1 focus:ring-gray-900"
        />

        {carregando && (
          <div className="absolute top-1/2 right-3 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
          </div>
        )}

        {!carregando && selecionado && (
          <svg
            className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-[#C3F32C]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </div>

      {erro && <p className="mt-1.5 text-xs text-red-500">{erro}</p>}

      {resultados.length > 0 && (
        <ul className="absolute z-10 mt-1.5 w-full overflow-hidden rounded-lg border border-gray-200 bg-black shadow-lg">
          {resultados.map((item) => {
            const isSelecionado = selecionado?.id === item.id

            return (
              <li
                key={item.id}
                onClick={() => handleSelect(item)}
                className={`flex cursor-pointer items-center justify-between px-4 py-2.5 text-sm transition hover:bg-gray-50 ${
                  isSelecionado ? "bg-green-50" : ""
                }`}
              >
                <div>
                  <p className="font-medium text-gray-900">{item.nome}</p>
                  <p className="text-xs text-gray-500">{item.user.email}</p>
                </div>

                {isSelecionado && (
                  <svg
                    className="h-4 w-4 shrink-0 text-[#C3F32C]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </li>
            )
          })}
        </ul>
      )}

      {!carregando &&
        query.trim() &&
        resultados.length === 0 &&
        !erro &&
        !selecionado && (
          <div className="absolute z-10 mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-400 shadow-lg">
            Nenhum resultado encontrado.
          </div>
        )}
    </div>
  )
}
