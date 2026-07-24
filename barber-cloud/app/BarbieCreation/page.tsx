// import Header from "../_components/header"
// import { Label } from "@/app/_components/ui/label"
// import { Switch } from "@/app/_components/ui/switch"
// import { Input } from "@/app/_components/ui/input"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/app/_components/ui/select"
// import {
//   ChevronRight,
//   User,
//   Bell,
//   Palette,
//   Shield,
//   Trash2,
// } from "lucide-react"

// function SectionCard({
//   icon: Icon,
//   title,
//   children,
// }: {
//   icon: React.ElementType
//   title: string
//   children: React.ReactNode
// }) {
//   return (
//     <div className="bg-[#161616] border border-white/5 rounded-2xl p-5">
//       <div className="flex items-center gap-2 mb-4">
//         <Icon className="w-4 h-4 text-[#C3F32C]" />
//         <h2 className="text-white font-bold text-sm tracking-wide uppercase">
//           {title}
//         </h2>
//       </div>
//       <div className="space-y-4">{children}</div>
//     </div>
//   )
// }

// function ToggleRow({
//   id,
//   label,
//   description,
//   defaultChecked,
// }: {
//   id: string
//   label: string
//   description: string
//   defaultChecked?: boolean
// }) {
//   return (
//     <div className="flex items-center justify-between gap-4 py-1">
//       <div className="space-y-0.5">
//         <Label htmlFor={id} className="text-white text-sm font-semibold">
//           {label}
//         </Label>
//         <p className="text-xs text-gray-400">{description}</p>
//       </div>
//       <Switch
//         id={id}
//         defaultChecked={defaultChecked}
//         className="data-[state=checked]:bg-[#C3F32C]"
//       />
//     </div>
//   )
// }

// export default function ConfiguracoesPage() {
//   return (
//     <div className="min-h-screen bg-black">
//       <Header />

//       <div className="max-w-2xl mx-auto px-4 py-6">
//         <div className="mb-6">
//           <h1 className="text-white text-2xl font-extrabold tracking-tight">
//             Configurações
//           </h1>
//           <p className="text-gray-400 text-sm mt-1">
//             Gerencie sua conta e preferências do app.
//           </p>
//         </div>

//         <div className="space-y-4">
//           {/* Perfil */}
//           <SectionCard icon={User} title="Perfil">
//             <div className="space-y-2">
//               <Label htmlFor="nome" className="text-gray-300 text-xs">
//                 Nome
//               </Label>
//               <Input
//                 id="nome"
//                 placeholder="Seu nome"
//                 className="bg-[#0d0d0d] border-white/10 text-white placeholder:text-gray-500 rounded-xl h-11 focus-visible:ring-[#C3F32C]"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="email" className="text-gray-300 text-xs">
//                 E-mail
//               </Label>
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder="seu@email.com"
//                 className="bg-[#0d0d0d] border-white/10 text-white placeholder:text-gray-500 rounded-xl h-11 focus-visible:ring-[#C3F32C]"
//               />
//             </div>
//           </SectionCard>

//           {/* Notificações */}
//           <SectionCard icon={Bell} title="Notificações">
//             <ToggleRow
//               id="email-notif"
//               label="Notificações por e-mail"
//               description="Receba atualizações importantes por e-mail."
//               defaultChecked
//             />
//             <div className="h-px bg-white/5" />
//             <ToggleRow
//               id="push-notif"
//               label="Notificações push"
//               description="Receba alertas em tempo real no navegador."
//               defaultChecked
//             />
//             <div className="h-px bg-white/5" />
//             <ToggleRow
//               id="marketing-notif"
//               label="Novidades e promoções"
//               description="Fique por dentro de novos recursos e ofertas."
//             />
//           </SectionCard>

//           {/* Preferências */}
//           <SectionCard icon={Palette} title="Preferências">
//             <ToggleRow
//               id="tema"
//               label="Tema escuro"
//               description="Ativa o modo escuro em toda a aplicação."
//               defaultChecked
//             />
//             <div className="h-px bg-white/5" />
//             <div className="space-y-2">
//               <Label htmlFor="idioma" className="text-gray-300 text-xs">
//                 Idioma
//               </Label>
//               <Select defaultValue="pt-br">
//                 <SelectTrigger
//                   id="idioma"
//                   className="w-full bg-[#0d0d0d] border-white/10 text-white rounded-xl h-11"
//                 >
//                   <SelectValue placeholder="Selecione o idioma" />
//                 </SelectTrigger>
//                 <SelectContent className="bg-[#161616] border-white/10 text-white">
//                   <SelectItem value="pt-br">Português (Brasil)</SelectItem>
//                   <SelectItem value="en">Inglês</SelectItem>
//                   <SelectItem value="es">Espanhol</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </SectionCard>

//           {/* Segurança */}
//           <SectionCard icon={Shield} title="Segurança">
//             <ToggleRow
//               id="2fa"
//               label="Autenticação em duas etapas"
//               description="Adiciona uma camada extra de segurança ao login."
//             />
//             <div className="h-px bg-white/5" />
//             <button className="w-full flex items-center justify-between text-left py-1">
//               <span className="text-white text-sm font-semibold">
//                 Alterar senha
//               </span>
//               <ChevronRight className="w-4 h-4 text-gray-500" />
//             </button>
//           </SectionCard>

//           {/* Zona de perigo */}
//           <div className="bg-[#161616] border border-red-500/20 rounded-2xl p-5">
//             <div className="flex items-center gap-2 mb-4">
//               <Trash2 className="w-4 h-4 text-red-500" />
//               <h2 className="text-red-500 font-bold text-sm tracking-wide uppercase">
//                 Zona de perigo
//               </h2>
//             </div>
//             <p className="text-xs text-gray-400 mb-4">
//               Essa ação é irreversível e apaga todos os seus dados.
//             </p>
//             <button className="w-full bg-red-500/10 border border-red-500/30 text-red-400 font-bold text-sm rounded-xl py-3 hover:bg-red-500/20 transition-colors">
//               Excluir conta
//             </button>
//           </div>
//         </div>

//         <button className="w-full bg-[#C3F32C] text-black font-extrabold text-sm rounded-xl py-3.5 mt-6 hover:brightness-95 transition-all">
//           Salvar alterações
//         </button>
//       </div>
//     </div>
//   )
// }

"use client"

import { createBarbershop } from "@/app/_actions/createBarbershop"
import { useState, useRef, useEffect } from "react"
import {
  ChevronRight,
  ChevronLeft,
  Scissors,
  Upload,
  AtSign,
  Clock,
  Palette,
  Phone,
  MapPin,
  Building2,
  Check,
  FileText,
  Loader2,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { uploadImagem } from "@/app/_lib/uploadImagem"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

const STEPS = [
  { id: 0, label: "Identidade", obrigatorio: true },
  { id: 1, label: "Endereço",   obrigatorio: true },
  { id: 2, label: "Descrição",  obrigatorio: false },
  { id: 3, label: "Visual",     obrigatorio: true },
  { id: 4, label: "Redes",      obrigatorio: false },
]

const TAGS_OPCOES = [
  "✂️ Corte clássico",
  "🪒 Barba",
  "🏆 Ambiente premium",
  "📱 Agendamento online",
  "🚗 Estacionamento",
  "📶 Wifi grátis",
  "👦 Atende crianças",
  "🍺 Bebidas inclusas",
]

// ─── Componente principal ────────────────────────────────────────────────────

const BarbieCreation = () => {
  const [step, setStep]                             = useState(0)
  const [direcao, setDirecao]                       = useState(1)

  // Step 0 — Identidade
  const [nomeBarbearia, setNomeBarbearia]           = useState("")
  const [telefone, setTelefone]                     = useState("")
  const [cidade, setCidade]                         = useState("")

  // Step 1 — Endereço
  const [endereco, setEndereco]                     = useState("")

  // Step 2 — Descrição
  const [descricao, setDescricao]                   = useState("")
  const [tagsSelecionadas, setTagsSelecionadas]     = useState<string[]>([])

  // Step 3 — Visual
  const [logoPreview, setLogoPreview]               = useState<string | null>(null)
  const [capaPreview, setCapaPreview]               = useState<string | null>(null)
  const [logoFile, setLogoFile]                     = useState<File | null>(null)
  const [capaFile, setCapaFile]                     = useState<File | null>(null)

  // Step 4 — Redes
  const [instagram, setInstagram]                   = useState("")
  const [horarioAbertura, setHorarioAbertura]       = useState("09:00")
  const [horarioFechamento, setHorarioFechamento]   = useState("19:00")
  const [corMarca, setCorMarca]                     = useState("#C3F32C")

  const [erro, setErro] = useState("")
  const [salvando, setSalvando] = useState(false)

  const logoRef = useRef<HTMLInputElement>(null)
  const capaRef = useRef<HTMLInputElement>(null)

  // ─── Helpers ────────────────────────────────────────────────────────────────

  const formatarTelefone = (valor: string) => {
    const n = valor.replace(/\D/g, "")
    if (n.length <= 10)
      return n.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3").replace(/-$/, "")
    return n.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3").replace(/-$/, "")
  }

  const handleUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    tipo: "logo" | "capa"
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    tipo === "logo"
      ? setLogoFile(file)
      : setCapaFile(file)

    const reader = new FileReader()
    reader.onload = (ev) => {
      tipo === "logo"
        ? setLogoPreview(ev.target?.result as string)
        : setCapaPreview(ev.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const toggleTag = (tag: string) => {
    setTagsSelecionadas((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  // ─── Validação ──────────────────────────────────────────────────────────────

  const validarStep = () => {
    if (step === 0) {
      if (!nomeBarbearia.trim()) { setErro("Digite o nome da barbearia."); return false }
      if (!telefone.trim())      { setErro("Digite o telefone."); return false }
      if (!cidade.trim())        { setErro("Digite a cidade."); return false }
    }
    if (step === 1) {
      if (!endereco.trim()) { setErro("Digite o endereço."); return false }
    }
    if (step === 3) {
      if (!logoFile) { setErro("Envie a logo da barbearia."); return false }
    }
    setErro("")
    return true
  }

  const avancar = async () => {
    if (!validarStep()) return

    if (step < STEPS.length - 1) {
      setDirecao(1)
      setStep((s) => s + 1)
      return
    }

    // Último step — "Salvar perfil"
    try {
      setSalvando(true)

      // logoFile sempre existe aqui, pois é validado no step 3
      const logoUrl = await uploadImagem(logoFile as File, "logos", `logo-${Date.now()}.png`)

      // capaFile é opcional, então só faz upload se existir
      const capaUrl = capaFile
        ? await uploadImagem(capaFile, "capas", `capa-${Date.now()}.png`)
        : null

      const dadosBarbearia = {
        nome: nomeBarbearia,
        telefone,
        cidade,
        endereco,
        descricao,
        tags: tagsSelecionadas,
        logo_url: logoUrl,
        capa_url: capaUrl,
        instagram,
        horario_abertura: horarioAbertura,
        horario_fechamento: horarioFechamento,
        cor_marca: corMarca,
      }

      await createBarbershop(dadosBarbearia)

    } catch (err) {
      console.error(err)
      setErro("Não foi possível salvar o perfil. Tente novamente.")
    } finally {
      setSalvando(false)
    }
  }

  const voltar = () => {
    setErro("")
    setDirecao(-1)
    setStep((s) => s - 1)
  }

  // ─── Animações ──────────────────────────────────────────────────────────────

  const variants = {
    enter:  (d: number) => ({ opacity: 0, x: d > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit:   (d: number) => ({ opacity: 0, x: d > 0 ? -60 : 60 }),
  }

  // ─── Classes ────────────────────────────────────────────────────────────────

  const inputClass =
    "flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2.5 focus-within:border-[#C3F32C] transition-colors"

  // ─── Render ─────────────────────────────────────────────────────────────────

  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return
    if (session?.user?.role !== "BARBER") {
      router.push("/")
    }
  }, [session, status, router])

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-[#121212] p-6">
      <div className="w-full max-w-md space-y-6">

        {/* ── Header ── */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#C3F32C]">
            <Scissors className="h-7 w-7 text-[#0a0a0a]" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-[#C3F32C]">Perfil da barbearia</h1>
            <p className="mt-1 text-sm text-zinc-500">Preencha as informações da sua barbearia.</p>
          </div>
        </div>

        {/* ── Stepper ── */}
        <div className="flex items-center justify-between px-1">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-medium transition-all duration-300 ${
                    i < step
                      ? "border-[#C3F32C] bg-[#C3F32C] text-[#0a0a0a]"
                      : i === step
                      ? "border-[#C3F32C] bg-transparent text-[#C3F32C]"
                      : "border-zinc-700 bg-transparent text-zinc-600"
                  }`}
                >
                  {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </div>
                <span
                  className={`text-[10px] transition-colors duration-300 ${
                    i === step ? "text-[#C3F32C]" : i < step ? "text-zinc-400" : "text-zinc-700"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`mb-4 h-px flex-1 mx-2 transition-colors duration-500 ${
                    i < step ? "bg-[#C3F32C]/40" : "bg-zinc-800"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* ── Conteúdo animado ── */}
        <div className="overflow-hidden">
          <AnimatePresence mode="wait" custom={direcao}>
            <motion.div
              key={step}
              custom={direcao}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="space-y-4"
            >

              {/* STEP 0 — Identidade */}
              {step === 0 && (
                <div className="space-y-4">
                  <p className="text-[11px] uppercase tracking-widest text-zinc-600">
                    Identidade{" "}
                    <span className="ml-1 rounded bg-[#C3F32C]/10 px-2 py-0.5 text-[10px] text-[#C3F32C]">
                      obrigatório
                    </span>
                  </p>

                  <div className="space-y-1">
                    <label className="text-xs text-zinc-500">
                      Nome da barbearia <span className="text-[#C3F32C]">*</span>
                    </label>
                    <div className={inputClass}>
                      <Building2 className="h-4 w-4 shrink-0 text-zinc-600" />
                      <input
                        type="text"
                        placeholder="Ex: Barbearia do João"
                        value={nomeBarbearia}
                        onChange={(e) => { setNomeBarbearia(e.target.value); setErro("") }}
                        className="w-full bg-transparent text-sm text-white placeholder-zinc-600 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs text-zinc-500">
                        Telefone <span className="text-[#C3F32C]">*</span>
                      </label>
                      <div className={inputClass}>
                        <Phone className="h-4 w-4 shrink-0 text-zinc-600" />
                        <input
                          type="tel"
                          placeholder="(11) 99999-9999"
                          value={telefone}
                          maxLength={15}
                          onChange={(e) => { setTelefone(formatarTelefone(e.target.value)); setErro("") }}
                          className="w-full bg-transparent text-sm text-white placeholder-zinc-600 outline-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-zinc-500">
                        Cidade <span className="text-[#C3F32C]">*</span>
                      </label>
                      <div className={inputClass}>
                        <MapPin className="h-4 w-4 shrink-0 text-zinc-600" />
                        <input
                          type="text"
                          placeholder="São Paulo"
                          value={cidade}
                          onChange={(e) => { setCidade(e.target.value); setErro("") }}
                          className="w-full bg-transparent text-sm text-white placeholder-zinc-600 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 1 — Endereço */}
              {step === 1 && (
                <div className="space-y-4">
                  <p className="text-[11px] uppercase tracking-widest text-zinc-600">
                    Endereço{" "}
                    <span className="ml-1 rounded bg-[#C3F32C]/10 px-2 py-0.5 text-[10px] text-[#C3F32C]">
                      obrigatório
                    </span>
                  </p>
                  <div className="space-y-1">
                    <label className="text-xs text-zinc-500">
                      Endereço completo <span className="text-[#C3F32C]">*</span>
                    </label>
                    <div className={inputClass}>
                      <MapPin className="h-4 w-4 shrink-0 text-zinc-600" />
                      <input
                        type="text"
                        placeholder="Digite o endereço completo"
                        value={endereco}
                        onChange={(e) => { setEndereco(e.target.value); setErro("") }}
                        className="w-full bg-transparent text-sm text-white placeholder-zinc-600 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2 — Descrição */}
              {step === 2 && (
                <div className="space-y-4">
                  <p className="text-[11px] uppercase tracking-widest text-zinc-600">
                    Descrição{" "}
                    <span className="ml-1 rounded bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-500">
                      opcional
                    </span>
                  </p>

                  {/* Textarea */}
                  <div className="space-y-1">
                    <label className="flex items-center gap-1.5 text-xs text-zinc-500">
                      <FileText className="h-3.5 w-3.5" />
                      Conte um pouco sobre sua barbearia
                    </label>
                    <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2.5 focus-within:border-[#C3F32C] transition-colors">
                      <textarea
                        rows={5}
                        maxLength={300}
                        placeholder="Ex: Especializada em cortes clássicos e modernos, atendemos há mais de 10 anos com um ambiente aconchegante e profissionais experientes..."
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        className="w-full resize-none bg-transparent text-sm text-white placeholder-zinc-600 outline-none leading-relaxed"
                      />
                    </div>
                    <p
                      className={`text-right text-[11px] transition-colors ${
                        descricao.length > 250 ? "text-orange-400" : "text-zinc-600"
                      }`}
                    >
                      {descricao.length} / 300
                    </p>
                  </div>

                  {/* Tags de diferenciais */}
                  <div className="space-y-2">
                    <p className="text-[11px] text-zinc-600">
                      Destaque os diferenciais{" "}
                      <span className="text-zinc-700">(opcional)</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {TAGS_OPCOES.map((tag) => {
                        const ativa = tagsSelecionadas.includes(tag)
                        return (
                          <button
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            className={`rounded-full border px-3 py-1.5 text-[11px] transition-all duration-200 ${
                              ativa
                                ? "border-[#C3F32C] bg-[#C3F32C]/10 text-[#C3F32C]"
                                : "border-zinc-800 bg-zinc-900 text-zinc-500 hover:border-[#C3F32C]/40 hover:text-zinc-300"
                            }`}
                          >
                            {tag}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3 — Visual */}
              {step === 3 && (
                <div className="space-y-4">
                  <p className="text-[11px] uppercase tracking-widest text-zinc-600">
                    Visual{" "}
                    <span className="ml-1 rounded bg-[#C3F32C]/10 px-2 py-0.5 text-[10px] text-[#C3F32C]">
                      obrigatório
                    </span>
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs text-zinc-500">
                        Logo <span className="text-[#C3F32C]">*</span>
                      </label>
                      <button
                        onClick={() => logoRef.current?.click()}
                        className="flex w-full flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-zinc-800 bg-zinc-900 py-6 transition-colors hover:border-[#C3F32C]/50"
                      >
                        {logoPreview ? (
                          <img src={logoPreview} alt="Logo" className="h-14 w-14 rounded-lg object-cover" />
                        ) : (
                          <>
                            <Upload className="h-5 w-5 text-zinc-600" />
                            <span className="text-xs text-zinc-600">Enviar logo</span>
                            <span className="text-[10px] text-zinc-700">PNG ou JPG</span>
                          </>
                        )}
                      </button>
                      <input
                        ref={logoRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleUpload(e, "logo")}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-zinc-500">Foto de capa</label>
                      <button
                        onClick={() => capaRef.current?.click()}
                        className="flex w-full flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-zinc-800 bg-zinc-900 py-6 transition-colors hover:border-[#C3F32C]/50"
                      >
                        {capaPreview ? (
                          <img src={capaPreview} alt="Capa" className="h-14 w-14 rounded-lg object-cover" />
                        ) : (
                          <>
                            <Upload className="h-5 w-5 text-zinc-600" />
                            <span className="text-xs text-zinc-600">Enviar banner</span>
                            <span className="text-[10px] text-zinc-700">PNG ou JPG</span>
                          </>
                        )}
                      </button>
                      <input
                        ref={capaRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleUpload(e, "capa")}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4 — Redes */}
              {step === 4 && (
                <div className="space-y-4">
                  <p className="text-[11px] uppercase tracking-widest text-zinc-600">
                    Redes e horário{" "}
                    <span className="ml-1 rounded bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-500">
                      opcional
                    </span>
                  </p>

                  <div className="space-y-1">
                    <label className="text-xs text-zinc-500">Instagram</label>
                    <div className="flex items-center overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 focus-within:border-[#C3F32C] transition-colors">
                      <div className="flex items-center gap-1.5 border-r border-zinc-800 px-3 py-2.5">
                        <AtSign className="h-4 w-4 text-zinc-600" />
                        <span className="text-sm text-zinc-600">@</span>
                      </div>
                      <input
                        type="text"
                        placeholder="suabarbearia"
                        value={instagram}
                        onChange={(e) => setInstagram(e.target.value)}
                        className="flex-1 bg-transparent px-3 py-2.5 text-sm text-white placeholder-zinc-600 outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="flex items-center gap-1.5 text-xs text-zinc-500">
                      <Clock className="h-3.5 w-3.5" /> Horário de funcionamento
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-0.5">
                        <input
                          type="time"
                          value={horarioAbertura}
                          onChange={(e) => setHorarioAbertura(e.target.value)}
                          className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-300 outline-none focus:border-[#C3F32C] transition-colors"
                        />
                        <p className="text-center text-[10px] text-zinc-700">Abertura</p>
                      </div>
                      <div className="space-y-0.5">
                        <input
                          type="time"
                          value={horarioFechamento}
                          onChange={(e) => setHorarioFechamento(e.target.value)}
                          className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-300 outline-none focus:border-[#C3F32C] transition-colors"
                        />
                        <p className="text-center text-[10px] text-zinc-700">Fechamento</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="flex items-center gap-1.5 text-xs text-zinc-500">
                      <Palette className="h-3.5 w-3.5" /> Cor da marca
                    </label>
                    <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2.5">
                      <input
                        type="color"
                        value={corMarca}
                        onChange={(e) => setCorMarca(e.target.value)}
                        className="h-7 w-7 cursor-pointer rounded-lg border-0 bg-transparent p-0"
                      />
                      <span className="text-sm text-zinc-400">{corMarca.toUpperCase()}</span>
                      <span className="ml-auto text-xs text-zinc-600">Cor principal da marca</span>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Erro ── */}
        <AnimatePresence>
          {erro && (
            <motion.p
              className="text-sm text-red-500"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              {erro}
            </motion.p>
          )}
        </AnimatePresence>

        {/* ── Navegação ── */}
        <div className="flex items-center justify-between pt-1">
          <AnimatePresence mode="popLayout">
            {step > 0 && (
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onClick={voltar}
                className="flex cursor-pointer items-center gap-1.5 bg-transparent text-sm text-white opacity-50 transition-opacity hover:opacity-100"
              >
                <ChevronLeft className="h-4 w-4" />
                Voltar
              </motion.button>
            )}
          </AnimatePresence>

          <motion.button
            onClick={avancar}
            disabled={salvando}
            className="ml-auto flex cursor-pointer items-center gap-2 rounded-xl bg-[#C3F32C] px-6 py-2.5 text-sm font-medium text-[#0a0a0a] transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60"
            whileTap={{ scale: 0.97 }}
          >
            {salvando ? "Salvando..." : step === STEPS.length - 1 ? "Salvar perfil" : "Prosseguir"}
            {!salvando && <ChevronRight className="h-4 w-4" />}
          </motion.button>
        </div>

      </div>
    </div>
  )
}

export default BarbieCreation