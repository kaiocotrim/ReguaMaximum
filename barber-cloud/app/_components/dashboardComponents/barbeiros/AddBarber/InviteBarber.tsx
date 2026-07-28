// "use client"

// import { useState, useEffect, useRef } from "react"

// interface ResultadoBusca {
//   id: string
//   nome: string
//   user: {
//     email: string
//   }
// }

// export default function SearchEmail() {
//   const [query, setQuery] = useState("")
//   const [resultados, setResultados] = useState<ResultadoBusca[]>([])
//   const [carregando, setCarregando] = useState(false)
//   const [erro, setErro] = useState<string | null>(null)
//   const [selecionado, setSelecionado] = useState<ResultadoBusca | null>(null)
//   const [ignorarProximaBusca, setIgnorarProximaBusca] = useState(false)
//   const containerRef = useRef<HTMLDivElement>(null)

//   useEffect(() => {
//     // Se a mudança de query veio de uma seleção (clique), pula a busca
//     if (ignorarProximaBusca) {
//       setIgnorarProximaBusca(false)
//       return
//     }

//     if (!query.trim()) {
//       setResultados([])
//       return
//     }

//     setCarregando(true)
//     setErro(null)

//     const timer = setTimeout(async () => {
//       try {
//         const res = await fetch(
//           `/api/searchBarber?q=${encodeURIComponent(query)}`,
//         )
//         if (!res.ok) throw new Error("Erro ao buscar dados")

//         const data: ResultadoBusca[] = await res.json()
//         setResultados(data)
//       } catch {
//         setErro("Não foi possível buscar os resultados.")
//         setResultados([])
//       } finally {
//         setCarregando(false)
//       }
//     }, 300)

//     return () => clearTimeout(timer)
//   }, [query])

//   useEffect(() => {
//     function handleClickFora(event: MouseEvent) {
//       if (
//         containerRef.current &&
//         !containerRef.current.contains(event.target as Node)
//       ) {
//         setResultados([])
//       }
//     }
//     document.addEventListener("mousedown", handleClickFora)
//     return () => document.removeEventListener("mousedown", handleClickFora)
//   }, [])

//   const handleSelect = (item: ResultadoBusca) => {
//     setIgnorarProximaBusca(true) // evita nova busca desnecessária
//     setSelecionado(item)
//     setQuery(item.user.email)
//     setResultados([])
//   }

//   const handleChangeInput = (value: string) => {
//     setQuery(value)
//     if (selecionado) setSelecionado(null) // invalida seleção se o usuário editar o texto
//   }

//   return (
//     <div ref={containerRef} className="relative w-full max-w-sm">
//       <div className="relative">
//         <svg
//           className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#C3F32C]"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//           strokeWidth={2}
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M21 21l-4.35-4.35m0 0a7.5 7.5 0 10-10.6 0 7.5 7.5 0 0010.6 0z"
//           />
//         </svg>

//         <input
//           value={query}
//           onChange={(e) => handleChangeInput(e.target.value)}
//           placeholder="Buscar por e-mail..."
//           className="w-full rounded-lg border  bg-background py-2.5 pr-9 pl-9 text-sm text-gray-50 transition outline-none placeholder:text-gray-500 focus:border-[#C3F32C] focus:ring-1 focus:ring-gray-900"
//         />

//         {carregando && (
//           <div className="absolute top-1/2 right-3 -translate-y-1/2">
//             <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
//           </div>
//         )}

//         {!carregando && selecionado && (
//           <svg
//             className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-[#C3F32C]"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//             strokeWidth={2.5}
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M5 13l4 4L19 7"
//             />
//           </svg>
//         )}
//       </div>

//       {erro && <p className="mt-1.5 text-xs text-red-500">{erro}</p>}

//       {resultados.length > 0 && (
//         <ul className="absolute z-10 mt-1.5 w-full overflow-hidden rounded-lg border border-gray-200 bg-black shadow-lg">
//           {resultados.map((item) => {
//             const isSelecionado = selecionado?.id === item.id

//             return (
//               <li
//                 key={item.id}
//                 onClick={() => handleSelect(item)}
//                 className={`flex cursor-pointer items-center justify-between px-4 py-2.5 text-sm transition hover:bg-gray-50 ${
//                   isSelecionado ? "bg-green-50" : ""
//                 }`}
//               >
//                 <div>
//                   <p className="font-medium text-gray-900">{item.nome}</p>
//                   <p className="text-xs text-gray-500">{item.user.email}</p>
//                 </div>

//                 {isSelecionado && (
//                   <svg
//                     className="h-4 w-4 shrink-0 text-[#C3F32C]"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                     strokeWidth={2.5}
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M5 13l4 4L19 7"
//                     />
//                   </svg>
//                 )}
//               </li>
//             )
//           })}
//         </ul>
//       )}

//       {!carregando &&
//         query.trim() &&
//         resultados.length === 0 &&
//         !erro &&
//         !selecionado && (
//           <div className="absolute z-10 mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-400 shadow-lg">
//             Nenhum resultado encontrado.
//           </div>
//         )}
//     </div>
//   )
// }


// "use client"

// import { useState, useEffect, useRef } from "react"

// interface ResultadoBusca {
//   id: string // Barber.id
//   userId: string // User.id — use este para criar o convite
//   nome: string
//   user: {
//     email: string
//   }
// }

// interface SearchEmailProps {
//   onSelect: (barber: ResultadoBusca | null) => void
// }

// export default function SearchEmail({ onSelect }: SearchEmailProps) {
//   const [query, setQuery] = useState("")
//   const [resultados, setResultados] = useState<ResultadoBusca[]>([])
//   const [carregando, setCarregando] = useState(false)
//   const [erro, setErro] = useState<string | null>(null)
//   const [selecionado, setSelecionado] = useState<ResultadoBusca | null>(null)
//   const [ignorarProximaBusca, setIgnorarProximaBusca] = useState(false)
//   const containerRef = useRef<HTMLDivElement>(null)

//   useEffect(() => {
//     // Se a mudança de query veio de uma seleção (clique), pula a busca
//     if (ignorarProximaBusca) {
//       setIgnorarProximaBusca(false)
//       return
//     }

//     if (!query.trim()) {
//       setResultados([])
//       return
//     }

//     setCarregando(true)
//     setErro(null)

//     const timer = setTimeout(async () => {
//       try {
//         const res = await fetch(
//           `/api/searchBarber?q=${encodeURIComponent(query)}`,
//         )
//         if (!res.ok) throw new Error("Erro ao buscar dados")

//         const data: ResultadoBusca[] = await res.json()
//         setResultados(data)
//       } catch {
//         setErro("Não foi possível buscar os resultados.")
//         setResultados([])
//       } finally {
//         setCarregando(false)
//       }
//     }, 300)

//     return () => clearTimeout(timer)
//   }, [query])

//   useEffect(() => {
//     function handleClickFora(event: MouseEvent) {
//       if (
//         containerRef.current &&
//         !containerRef.current.contains(event.target as Node)
//       ) {
//         setResultados([])
//       }
//     }
//     document.addEventListener("mousedown", handleClickFora)
//     return () => document.removeEventListener("mousedown", handleClickFora)
//   }, [])

//   const handleSelect = (item: ResultadoBusca) => {
//     setIgnorarProximaBusca(true) // evita nova busca desnecessária
//     setSelecionado(item)
//     setQuery(item.user.email)
//     setResultados([])
//     onSelect(item)
//   }

//   const handleChangeInput = (value: string) => {
//     setQuery(value)
//     if (selecionado) {
//       setSelecionado(null) // invalida seleção se o usuário editar o texto
//       onSelect(null)
//     }
//   }

//   return (
//     <div ref={containerRef} className="relative w-full max-w-sm">
//       <div className="relative">
//         <svg
//           className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#C3F32C]"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//           strokeWidth={2}
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M21 21l-4.35-4.35m0 0a7.5 7.5 0 10-10.6 0 7.5 7.5 0 0010.6 0z"
//           />
//         </svg>

//         <input
//           value={query}
//           onChange={(e) => handleChangeInput(e.target.value)}
//           placeholder="Buscar por e-mail..."
//           className="w-full rounded-lg border border-zinc-800 bg-zinc-950 py-2.5 pr-9 pl-9 text-sm text-gray-50 transition outline-none placeholder:text-zinc-500 focus:border-[#C3F32C] focus:ring-1 focus:ring-[#C3F32C]/30"
//         />

//         {carregando && (
//           <div className="absolute top-1/2 right-3 -translate-y-1/2">
//             <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-700 border-t-[#C3F32C]" />
//           </div>
//         )}

//         {!carregando && selecionado && (
//           <svg
//             className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-[#C3F32C]"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//             strokeWidth={2.5}
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M5 13l4 4L19 7"
//             />
//           </svg>
//         )}
//       </div>

//       {erro && <p className="mt-1.5 text-xs text-red-400">{erro}</p>}

//       {resultados.length > 0 && (
//         <ul className="absolute z-10 mt-1.5 w-full overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 shadow-lg shadow-black/50">
//           {resultados.map((item) => {
//             const isSelecionado = selecionado?.id === item.id

//             return (
//               <li
//                 key={item.id}
//                 onClick={() => handleSelect(item)}
//                 className={`flex cursor-pointer items-center justify-between px-4 py-2.5 text-sm transition hover:bg-zinc-800 ${
//                   isSelecionado ? "bg-zinc-800" : ""
//                 }`}
//               >
//                 <div>
//                   <p className="font-medium text-white">{item.nome}</p>
//                   <p className="text-xs text-zinc-400">{item.user.email}</p>
//                 </div>

//                 {isSelecionado && (
//                   <svg
//                     className="h-4 w-4 shrink-0 text-[#C3F32C]"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                     strokeWidth={2.5}
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M5 13l4 4L19 7"
//                     />
//                   </svg>
//                 )}
//               </li>
//             )
//           })}
//         </ul>
//       )}

//       {!carregando &&
//         query.trim() &&
//         resultados.length === 0 &&
//         !erro &&
//         !selecionado && (
//           <div className="absolute z-10 mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-500 shadow-lg shadow-black/50">
//             Nenhum resultado encontrado.
//           </div>
//         )}
//     </div>
//   )
// }

"use client"

import { useState, useEffect, useRef } from "react"
import { Clock3, Lock, UserCheck } from "lucide-react"

type BarberInviteAvailability =
  | "AVAILABLE"
  | "ALREADY_MEMBER"
  | "OTHER_BARBERSHOP"
  | "INVITE_PENDING"

interface ResultadoBusca {
  id: string // Barber.id
  userId: string // User.id — use este para criar o convite
  nome: string
  user: {
    email: string
  }
  availability: BarberInviteAvailability
  currentBarbershopName: string | null
}

interface SearchEmailProps {
  onSelect: (barber: ResultadoBusca | null) => void
}

export default function SearchEmail({ onSelect }: SearchEmailProps) {
  const [query, setQuery] = useState("")
  const [resultados, setResultados] = useState<ResultadoBusca[]>([])
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [selecionado, setSelecionado] = useState<ResultadoBusca | null>(null)
  const ignorarProximaBuscaRef = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ignorarProximaBuscaRef.current) {
      ignorarProximaBuscaRef.current = false
      return
    }

    if (!query.trim()) {
      return
    }

    // O estado acompanha o ciclo da busca com debounce iniciado por este efeito.
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
    ignorarProximaBuscaRef.current = true
    setSelecionado(item)
    setQuery(item.user.email)
    setResultados([])
    onSelect(item)
  }

  const handleChangeInput = (value: string) => {
    setQuery(value)
    if (!value.trim()) setResultados([])
    if (selecionado) {
      setSelecionado(null)
      onSelect(null)
    }
  }

  return (
    <div ref={containerRef} className="w-full">
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
          className="h-12 w-full rounded-xl border border-border bg-background py-2.5 pr-9 pl-10 text-sm text-foreground transition outline-none placeholder:text-muted-foreground focus:border-[#C3F32C] focus:ring-2 focus:ring-[#C3F32C]/20"
        />

        {carregando && (
          <div className="absolute top-1/2 right-3 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-700 border-t-[#C3F32C]" />
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

      {erro && <p className="mt-1.5 text-xs text-red-400">{erro}</p>}

      {resultados.length > 0 && (
        <ul
          role="listbox"
          className="mt-3 max-h-64 w-full overflow-y-auto rounded-xl border border-border bg-card shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
        >
          {resultados.map((item) => {
            const isSelecionado = selecionado?.id === item.id
            const isAvailable = item.availability === "AVAILABLE"
            const status =
              item.availability === "ALREADY_MEMBER"
                ? "Já faz parte da sua equipe"
                : item.availability === "OTHER_BARBERSHOP"
                  ? `Já faz parte da ${item.currentBarbershopName ?? "outra barbearia"}`
                  : item.availability === "INVITE_PENDING"
                    ? "Convite já enviado"
                    : null

            return (
              <li
                key={item.id}
                role="option"
                onClick={() => isAvailable && handleSelect(item)}
                aria-disabled={!isAvailable}
                aria-selected={isSelecionado}
                className={`flex items-center justify-between gap-3 px-4 py-3 text-sm transition ${
                  isAvailable
                    ? "cursor-pointer hover:bg-muted"
                    : "cursor-not-allowed bg-muted/50 opacity-75"
                } ${isSelecionado ? "bg-muted" : ""}`}
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-foreground">
                    {item.nome}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {item.user.email}
                  </p>
                  {status && (
                    <p
                      className={`mt-1 flex items-center gap-1 text-xs font-medium ${
                        item.availability === "INVITE_PENDING"
                          ? "text-amber-500"
                          : item.availability === "ALREADY_MEMBER"
                            ? "text-[#71910d] dark:text-[#C3F32C]"
                            : "text-red-500"
                      }`}
                    >
                      {item.availability === "INVITE_PENDING" ? (
                        <Clock3 className="h-3 w-3 shrink-0" />
                      ) : item.availability === "ALREADY_MEMBER" ? (
                        <UserCheck className="h-3 w-3 shrink-0" />
                      ) : (
                        <Lock className="h-3 w-3 shrink-0" />
                      )}
                      {status}
                    </p>
                  )}
                  {item.availability === "OTHER_BARBERSHOP" && (
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      Para receber outro convite, o barbeiro precisa sair da
                      equipe atual.
                    </p>
                  )}
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
                {!isAvailable && item.availability !== "INVITE_PENDING" && (
                  <Lock className="h-4 w-4 shrink-0 text-muted-foreground" />
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
          <div className="mt-3 w-full rounded-xl border border-dashed border-border bg-muted/30 px-4 py-4 text-center text-sm text-muted-foreground">
            Nenhum resultado encontrado.
          </div>
        )}
    </div>
  )
}
