"use client"

import { useEffect, useState } from "react"

export function DashboardIntro({ children }: { children: React.ReactNode }) {
  const [fase, setFase] = useState<"preto" | "texto" | "saindo" | "done">("preto")

  useEffect(() => {
    const t1 = setTimeout(() => setFase("texto"), 600)
    const t2 = setTimeout(() => setFase("saindo"), 2400)
    const t3 = setTimeout(() => setFase("done"), 3800)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  if (fase === "done") return <>{children}</>

  return (
    <>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-700 ${
          fase === "saindo" ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <h1
            className={`text-[26px] font-extrabold leading-snug tracking-tight text-white transition-all duration-700 ${
              fase === "texto" ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            }`}
          >
            Seu negócio.<br />
            <span className="text-[#C3F32C]">Em um só lugar.</span>
          </h1>
          <p
            className={`text-[11px] uppercase tracking-[0.2em] text-[#333] transition-all duration-500 delay-200 ${
              fase === "texto" ? "opacity-100" : "opacity-0"
            }`}
          >

          </p>
        </div>
      </div>

      <div className={`transition-opacity duration-500 ${fase === "done" ? "opacity-100" : "opacity-0"}`}>
        {children}
      </div>
    </>
  )
}