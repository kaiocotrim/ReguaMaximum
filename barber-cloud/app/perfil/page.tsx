"use client"

import { Button } from "@/app/_components/ui/button"
// import ChevronRight from "lucide-react"
import { ChevronRight } from "lucide-react"
import { useState } from "react"
import { set } from "date-fns"
import { error } from "console"
import { Card } from "../_components/ui/card"
import Image from "next/image"
import { User, Store } from "lucide-react"

const Perfil = () => {
  const [erro, setErro] = useState("")
  const [nome, setNome] = useState("")
  const [mostrarPergunta, setmostrarPergunta] = useState(false)
  const [tipoPerfil, setTipoPerfil] = useState("")
  const handleProsseguir = () => {
    if (!nome.trim()) {
      setErro("Digite seu nome para continuar")
      return
    }

    console.log("Prosseguindo")
    setmostrarPergunta(true)
  }
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-[#121212] p-6 md:p-10">
      <div className="w-full max-w-md space-y-8">
        {/* Cabeçalho */}
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#C3F32C] shadow-sm">
            <Image
              src="/logoPretoBrancoFundoOFF.png"
              alt="Logo"
              width={48}
              height={48}
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-[#C3F32C]">
              Crie seu perfil
            </h1>

            <p className="mt-2 text-sm text-white">
              Vamos conhecer você para personalizar sua experiência.
            </p>
          </div>
        </div>

        {/* Campo Nome */}
        {!mostrarPergunta && (
          <div className="space-y-5">
            <input
              id="nome"
              type="text"
              placeholder="Digite seu nome"
              className="h-12 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 text-white transition outline-none focus:border-white"
              value={nome}
              onChange={(e) => {
                setNome(e.target.value)
                setErro("")
              }}
            />
          </div>
        )}

        {erro && <p className="text-sm text-red-500">{erro}</p>}

        {mostrarPergunta && (
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <button
              onClick={() => setTipoPerfil("cliente")}
              className={`flex cursor-pointer flex-col items-center rounded-2xl border p-6 text-center transition-all duration-300 hover:border-[#C3F32C] hover:bg-[#C3F32C]/10 ${
                tipoPerfil === "cliente"
                  ? "border-[#C3F32C] bg-[#C3F32C]/10"
                  : "border-zinc-700 bg-transparent"
              }`}
            >
              <p className="text-lg font-semibold text-white">
                Você é o cliente, <span className="shine-text">{nome} ? </span>
              </p>
              <div className="mt-4">
                <Image
                  src="/Cliente12.png"
                  alt="Cliente"
                  width={180}
                  height={180}
                  className="object-contain"
                />
              </div>
            </button>

            <button
              onClick={() => setTipoPerfil("barbeiro")}
              className={`flex cursor-pointer flex-col items-center rounded-2xl border p-6 text-center transition-all duration-300 hover:border-[#C3F32C] hover:bg-[#C3F32C]/10 ${
                tipoPerfil === "barbeiro"
                  ? "border-[#C3F32C] bg-[#C3F32C]/10"
                  : "border-zinc-700 bg-transparent"
              }`}
            >
              <p className="text-lg font-semibold text-white">
                Você é o barbeiro, <span className="shine-text">{nome} ?</span>
              </p>
              <div className="mt-4">
                <Image
                  src="/dono2.png"
                  alt="Barbeiro"
                  width={180}
                  height={180}
                  className="object-contain"
                />
              </div>
            </button>
          </div>
        )}

        <div className="items-center">
          <Button
            onClick={handleProsseguir}
            className="flex cursor-pointer items-center gap-2 bg-transparent p-4 whitespace-nowrap text-white hover:bg-transparent hover:text-[#254F50]"
          >
            Prosseguir
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Perfil
