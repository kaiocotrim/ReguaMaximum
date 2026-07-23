import Header from "../_components/header"
import { Label } from "@/app/_components/ui/label"
import { Switch } from "@/app/_components/ui/switch"
import { Input } from "@/app/_components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select"
import {
  ChevronRight,
  User,
  Bell,
  Palette,
  Shield,
  Trash2,
} from "lucide-react"

function SectionCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-[#161616] border border-white/5 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-4 h-4 text-[#C3F32C]" />
        <h2 className="text-white font-bold text-sm tracking-wide uppercase">
          {title}
        </h2>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

function ToggleRow({
  id,
  label,
  description,
  defaultChecked,
}: {
  id: string
  label: string
  description: string
  defaultChecked?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-1">
      <div className="space-y-0.5">
        <Label htmlFor={id} className="text-white text-sm font-semibold">
          {label}
        </Label>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
      <Switch
        id={id}
        defaultChecked={defaultChecked}
        className="data-[state=checked]:bg-[#C3F32C]"
      />
    </div>
  )
}

export default function ConfiguracoesPage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-white text-2xl font-extrabold tracking-tight">
            Configurações
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Gerencie sua conta e preferências do app.
          </p>
        </div>

        <div className="space-y-4">
          {/* Perfil */}
          <SectionCard icon={User} title="Perfil">
            <div className="space-y-2">
              <Label htmlFor="nome" className="text-gray-300 text-xs">
                Nome
              </Label>
              <Input
                id="nome"
                placeholder="Seu nome"
                className="bg-[#0d0d0d] border-white/10 text-white placeholder:text-gray-500 rounded-xl h-11 focus-visible:ring-[#C3F32C]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300 text-xs">
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                className="bg-[#0d0d0d] border-white/10 text-white placeholder:text-gray-500 rounded-xl h-11 focus-visible:ring-[#C3F32C]"
              />
            </div>
          </SectionCard>

          {/* Notificações */}
          <SectionCard icon={Bell} title="Notificações">
            <ToggleRow
              id="email-notif"
              label="Notificações por e-mail"
              description="Receba atualizações importantes por e-mail."
              defaultChecked
            />
            <div className="h-px bg-white/5" />
            <ToggleRow
              id="push-notif"
              label="Notificações push"
              description="Receba alertas em tempo real no navegador."
              defaultChecked
            />
            <div className="h-px bg-white/5" />
            <ToggleRow
              id="marketing-notif"
              label="Novidades e promoções"
              description="Fique por dentro de novos recursos e ofertas."
            />
          </SectionCard>

          {/* Preferências */}
          <SectionCard icon={Palette} title="Preferências">
            <ToggleRow
              id="tema"
              label="Tema escuro"
              description="Ativa o modo escuro em toda a aplicação."
              defaultChecked
            />
            <div className="h-px bg-white/5" />
            <div className="space-y-2">
              <Label htmlFor="idioma" className="text-gray-300 text-xs">
                Idioma
              </Label>
              <Select defaultValue="pt-br">
                <SelectTrigger
                  id="idioma"
                  className="w-full bg-[#0d0d0d] border-white/10 text-white rounded-xl h-11"
                >
                  <SelectValue placeholder="Selecione o idioma" />
                </SelectTrigger>
                <SelectContent className="bg-[#161616] border-white/10 text-white">
                  <SelectItem value="pt-br">Português (Brasil)</SelectItem>
                  <SelectItem value="en">Inglês</SelectItem>
                  <SelectItem value="es">Espanhol</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </SectionCard>

          {/* Segurança */}
          <SectionCard icon={Shield} title="Segurança">
            <ToggleRow
              id="2fa"
              label="Autenticação em duas etapas"
              description="Adiciona uma camada extra de segurança ao login."
            />
            <div className="h-px bg-white/5" />
            <button className="w-full flex items-center justify-between text-left py-1">
              <span className="text-white text-sm font-semibold">
                Alterar senha
              </span>
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </button>
          </SectionCard>

          {/* Zona de perigo */}
          <div className="bg-[#161616] border border-red-500/20 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Trash2 className="w-4 h-4 text-red-500" />
              <h2 className="text-red-500 font-bold text-sm tracking-wide uppercase">
                Zona de perigo
              </h2>
            </div>
            <p className="text-xs text-gray-400 mb-4">
              Essa ação é irreversível e apaga todos os seus dados.
            </p>
            <button className="w-full bg-red-500/10 border border-red-500/30 text-red-400 font-bold text-sm rounded-xl py-3 hover:bg-red-500/20 transition-colors">
              Excluir conta
            </button>
          </div>
        </div>

        <button className="w-full bg-[#C3F32C] text-black font-extrabold text-sm rounded-xl py-3.5 mt-6 hover:brightness-95 transition-all">
          Salvar alterações
        </button>
      </div>
    </div>
  )
}