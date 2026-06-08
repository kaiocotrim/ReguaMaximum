"use client"

import { cn } from "@/app/_lib/utils"
import { Button } from "@/app/_components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/app/_components/ui/field"
import { LoginProviders } from "@/app/_components/LoginProviders"
import { Input } from "@/app/_components/ui/input"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

type Mode = "login" | "register"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [mode, setMode] = useState<Mode>("login")
  const [showPassword, setShowPassword] = useState(false)
  const [forgotOpen, setForgotOpen] = useState(false)
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  const handleModeSwitch = (next: Mode) => {
    setMode(next)
    setShowPassword(false)
    setForgotOpen(false)
  }

  const handleForgot = () => {
    setForgotOpen((v) => !v)
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
              {mode === "login" ? "Entre na sua conta" : "Crie sua conta"}
            </motion.h1>
          </AnimatePresence>
        </div>

        {/* Providers + divisor (apenas no login) */}
        <AnimatePresence>
          {mode === "login" && (
            <motion.div
              key="providers"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden space-y-8"
            >
              <LoginProviders />

              <div className="relative flex items-center">
                <div className="flex-1 border-t border-zinc-700" />
                <span className="mx-4 text-xs font-medium uppercase tracking-widest text-zinc-500">
                  ou
                </span>
                <div className="flex-1 border-t border-zinc-700" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Formulários */}
        <AnimatePresence mode="wait">

          {/* LOGIN */}
          {mode === "login" && (
            <motion.form
              key="login"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              onSubmit={handleSubmit}
              className="space-y-3"
            >
              <FieldGroup className="space-y-0">

                {/* Campo e-mail */}
                <Field className="space-y-2">
                  <FieldLabel htmlFor="email" className="text-sm font-bold text-white">
                    E-mail ou nome de usuário
                  </FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="E-mail ou nome de usuário"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setShowPassword(true)}
                    className="h-12 rounded-md border border-zinc-600 bg-[#121212] px-4 text-sm text-white placeholder:text-zinc-500 focus-visible:border-white focus-visible:ring-0 focus-visible:ring-offset-0 transition-all"
                  />
                </Field>

                {/* Campo senha + esqueci + info box */}
                <AnimatePresence>
                  {showPassword && (
                    <motion.div
                      key="login-password"
                      initial={{ opacity: 0, height: 0, y: -8 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -8 }}
                      transition={{ duration: 0.28, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <Field className="space-y-2 pt-3">

                        {/* Label + botão esqueci */}
                        <div className="flex items-center justify-between">
                          <FieldLabel htmlFor="password" className="text-sm font-bold text-white">
                            Senha
                          </FieldLabel>
                          <button
                            type="button"
                            onClick={handleForgot}
                            className={cn(
                              "text-xs transition-colors",
                              forgotOpen
                                ? "text-[#C3F32C]"
                                : "text-zinc-400 hover:text-white",
                            )}
                          >
                            Esqueceu a senha?
                          </button>
                        </div>

                        {/* Info box minimalista (substitui o campo de senha) */}
                        <AnimatePresence mode="wait">
                          {forgotOpen ? (

                            /* Estado: recuperação */
                            <motion.div
                              key="forgot-info"
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -4 }}
                              transition={{ duration: 0.25, ease: "easeOut" }}
                              className="border-t border-zinc-800 pt-3"
                            >
                              <div className="flex flex-col gap-1">
                                <p className="flex items-center gap-1.5 text-[13px] font-bold text-white">
                                  <span className="h-1.5 w-1.5 rounded-full bg-[#C3F32C]" />
                                  Recuperação de senha
                                </p>
                                <p className="pl-[18px] text-[12px] leading-relaxed text-zinc-600">
                                  Enviaremos um link para o{" "}
                                  <span className="text-zinc-500 font-medium">e-mail cadastrado</span>.
                                  Verifique também a pasta de spam.
                                </p>
                              </div>
                            </motion.div>

                          ) : (

                            /* Estado: campo de senha normal */
                            <motion.div
                              key="password-input"
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 4 }}
                              transition={{ duration: 0.25, ease: "easeOut" }}
                            >
                              <Input
                                id="password"
                                type="password"
                                placeholder="Senha"
                                required
                                autoComplete="current-password"
                                className="h-12 rounded-md border border-zinc-600 bg-[#121212] px-4 text-sm text-white placeholder:text-zinc-500 focus-visible:border-white focus-visible:ring-0 focus-visible:ring-offset-0"
                              />
                            </motion.div>

                          )}
                        </AnimatePresence>

                      </Field>
                    </motion.div>
                  )}
                </AnimatePresence>

              </FieldGroup>

              <motion.div layout transition={{ duration: 0.25 }}>
                <Button
                  type="submit"
                  className="h-12 w-full rounded-full bg-[#C3F32C] text-sm font-bold text-[#121212] hover:bg-[#d4ff30] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer mt-1"
                >
                  {forgotOpen
                    ? "Enviar link"
                    : showPassword
                    ? "Entrar"
                    : "Continuar"}
                </Button>
              </motion.div>
            </motion.form>
          )}

          {/* REGISTER */}
          {mode === "register" && (
            <motion.form
              key="register"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              onSubmit={handleSubmit}
              className="space-y-3"
            >
              <FieldGroup className="space-y-3">

                <Field className="space-y-2">
                  <FieldLabel htmlFor="reg-email" className="text-sm font-bold text-white">
                    E-mail
                  </FieldLabel>
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="seu@email.com"
                    required
                    autoComplete="email"
                    className="h-12 rounded-md border border-zinc-600 bg-[#121212] px-4 text-sm text-white placeholder:text-zinc-500 focus-visible:border-white focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </Field>

                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.28, delay: 0.05, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <Field className="space-y-2">
                    <FieldLabel htmlFor="reg-password" className="text-sm font-bold text-white">
                      Senha
                    </FieldLabel>
                    <Input
                      id="reg-password"
                      type="password"
                      placeholder="Crie uma senha"
                      required
                      autoComplete="new-password"
                      className="h-12 rounded-md border border-zinc-600 bg-[#121212] px-4 text-sm text-white placeholder:text-zinc-500 focus-visible:border-white focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </Field>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.28, delay: 0.1, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <Field className="space-y-2">
                    <FieldLabel htmlFor="reg-confirm" className="text-sm font-bold text-white">
                      Confirmar senha
                    </FieldLabel>
                    <Input
                      id="reg-confirm"
                      type="password"
                      placeholder="Repita a senha"
                      required
                      autoComplete="new-password"
                      className="h-12 rounded-md border border-zinc-600 bg-[#121212] px-4 text-sm text-white placeholder:text-zinc-500 focus-visible:border-white focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </Field>
                </motion.div>

              </FieldGroup>

              <Button
                type="submit"
                className="h-12 w-full rounded-full bg-[#C3F32C] text-sm font-bold text-[#121212] hover:bg-[#d4ff30] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer mt-1"
              >
                Criar conta
              </Button>
            </motion.form>
          )}

        </AnimatePresence>

        {/* Alternar login / cadastro */}
        <AnimatePresence mode="wait">
          <motion.p
            key={mode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-center text-sm text-zinc-400"
          >
            {mode === "login" ? (
              <>
                Não tem uma conta?{" "}
                <button
                  type="button"
                  onClick={() => handleModeSwitch("register")}
                  className="font-bold text-white underline underline-offset-2 hover:text-[#C3F32C] transition-colors cursor-pointer"
                >
                  Cadastre-se
                </button>
              </>
            ) : (
              <>
                Já tem uma conta?{" "}
                <button
                  type="button"
                  onClick={() => handleModeSwitch("login")}
                  className="font-bold text-white underline underline-offset-2 hover:text-[#C3F32C] transition-colors cursor-pointer"
                >
                  Entrar
                </button>
              </>
            )}
          </motion.p>
        </AnimatePresence>

      </div>
    </div>
  )
}

export default LoginForm