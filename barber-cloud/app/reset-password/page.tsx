"use client"

import { cn } from "@/app/_lib/utils"
import { Button } from "@/app/_components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/app/_components/ui/field"
import { Input } from "@/app/_components/ui/input"
import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

type Mode = "input" | "success"

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [mode, setMode] = useState<Mode>("input")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres")
      return
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem")
      return
    }

    setIsSubmitting(true)

    try {
      // Aqui você faria a chamada para a sua API de redefinição.
      // Geralmente, você também pegaria um "token" da URL para enviar no body.
      /* const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, token: searchParams.get('token') }),
      })
      if (!response.ok) throw new Error("Erro ao redefinir")
      */

      // Simulando o tempo de resposta da API
      await new Promise((resolve) => setTimeout(resolve, 800))

      setMode("success")

    } catch (err) {
      setError("Ocorreu um erro ao redefinir a senha. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRedirect = () => {
    setIsRedirecting(true)
    setTimeout(() => {
      window.location.href = "/login" // Altere para a rota correta do seu login
    }, 600)
  }

  return (
    <div
      className={cn(
        "flex min-h-screen flex-col items-center justify-center bg-[#121212] px-6 py-12",
        className,
      )}
      {...props}
    >
      <div className="w-full max-w-[400px] space-y-8">
        {/* Logo + título */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
            <Image
              src="/logoPretoBranco2.png"
              alt="Logo"
              width={40}
              height={40}
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.h1
              key={mode}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="text-center text-3xl font-bold tracking-tight text-white"
            >
              {mode === "input" ? "Crie uma nova senha" : "Senha redefinida!"}
            </motion.h1>
          </AnimatePresence>
        </div>

        {/* Formulários e Sucesso */}
        <AnimatePresence mode="wait">
          {/* INPUT MODE */}
          {mode === "input" && (
            <motion.form
              key="reset-form"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              onSubmit={handleSubmit}
              className="space-y-3"
            >
              <FieldGroup className="space-y-3">
                <Field className="space-y-2">
                  <FieldLabel
                    htmlFor="new-password"
                    className="text-sm font-bold text-white"
                  >
                    Nova Senha
                  </FieldLabel>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Sua nova senha"
                    required
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 rounded-md border border-zinc-600 bg-[#121212] px-4 text-sm text-white transition-all placeholder:text-zinc-500 focus-visible:border-white focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </Field>

                <Field className="space-y-2">
                  <FieldLabel
                    htmlFor="confirm-password"
                    className="text-sm font-bold text-white"
                  >
                    Confirmar Senha
                  </FieldLabel>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Repita a nova senha"
                    required
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-12 rounded-md border border-zinc-600 bg-[#121212] px-4 text-sm text-white transition-all placeholder:text-zinc-500 focus-visible:border-white focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </Field>
              </FieldGroup>

              <motion.div layout transition={{ duration: 0.25 }}>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-1 h-12 w-full cursor-pointer rounded-full bg-[#C3F32C] text-sm font-bold text-[#121212] transition-all hover:scale-[1.02] hover:bg-[#d4ff30] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
                >
                  {isSubmitting ? "Salvando..." : "Redefinir Senha"}
                </Button>
                {error && (
                  <p className="mt-2 text-center text-xs text-red-500">{error}</p>
                )}
              </motion.div>
            </motion.form>
          )}

          {/* SUCCESS MODE */}
          {mode === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: -16 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="flex flex-col items-center gap-6 py-2 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 220,
                  damping: 16,
                  delay: 0.1,
                }}
              >
                <svg width="88" height="88" viewBox="0 0 88 88" fill="none">
                  <circle
                    cx="44"
                    cy="44"
                    r="32"
                    stroke="#1e1e1e"
                    strokeWidth="3.5"
                  />
                  <motion.circle
                    cx="44"
                    cy="44"
                    r="32"
                    stroke="#C3F32C"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeDasharray="201"
                    initial={{ strokeDashoffset: 201 }}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: 0.75, delay: 0.3, ease: "easeOut" }}
                    style={{ rotate: "-90deg", transformOrigin: "center" }}
                  />
                  <motion.polyline
                    points="28,45 39,56 60,33"
                    stroke="#C3F32C"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    strokeDasharray="65"
                    initial={{ strokeDashoffset: 65 }}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: 0.38, delay: 1.0, ease: "easeOut" }}
                  />
                </svg>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.15, duration: 0.3 }}
                className="space-y-1"
              >
                <h2 className="text-2xl font-bold text-white">Pronto!</h2>
                <p className="text-sm leading-relaxed text-zinc-400">
                  Sua senha foi atualizada com sucesso.
                  <br />
                  Você já pode acessar sua conta.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.3 }}
                className="w-full space-y-3"
              >
                <div className="h-[3px] w-full overflow-hidden rounded-full bg-zinc-800">
                  <motion.div
                    className="h-full rounded-full bg-[#C3F32C]"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3, delay: 1.4, ease: "linear" }}
                    onAnimationComplete={handleRedirect}
                  />
                </div>

                <Button
                  type="button"
                  onClick={handleRedirect}
                  className="h-12 w-full cursor-pointer rounded-full bg-[#C3F32C] text-sm font-bold text-[#121212] transition-all hover:scale-[1.02] hover:bg-[#d4ff30] active:scale-[0.98]"
                >
                  Ir para o login agora
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Overlay fade to black para redirecionamento */}
      <AnimatePresence>
        {isRedirecting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed inset-0 z-50 bg-black"
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default ResetPasswordForm