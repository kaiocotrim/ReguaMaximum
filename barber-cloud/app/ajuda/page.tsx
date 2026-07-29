import Link from "next/link"
import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  Clock3,
  ImageIcon,
  KeyRound,
  Scissors,
  Settings2,
  Store,
  UserRound,
  UsersRound,
  Wallet,
} from "lucide-react"

import Header from "@/app/_components/header"
import { Button } from "@/app/_components/ui/button"
import { Card } from "@/app/_components/ui/card"

const modules = [
  {
    icon: CalendarDays,
    title: "Agendamentos",
    description:
      "Acompanhe a agenda, pesquise horários e visualize os atendimentos por dia ou calendário.",
    steps: [
      "Novos agendamentos feitos pelos clientes aparecem automaticamente no painel.",
      "Abra um agendamento para conferir cliente, serviço, barbeiro, data e observações.",
      "Ao finalizar o atendimento, marque-o como concluído e registre a forma de pagamento.",
      "Use cancelar quando o horário não acontecer e registre falta quando o cliente não comparecer.",
    ],
  },
  {
    icon: Scissors,
    title: "Serviços",
    description:
      "Cadastre tudo o que a barbearia oferece e mantenha preços e duração atualizados.",
    steps: [
      "Acesse Serviços e clique em Novo serviço.",
      "Informe nome, descrição, preço, duração e imagem.",
      "Use Editar serviço sempre que precisar mudar alguma informação.",
      "A duração cadastrada ajuda o sistema a organizar os horários disponíveis.",
    ],
  },
  {
    icon: UsersRound,
    title: "Barbeiros e equipe",
    description:
      "Organize os profissionais que atendem na barbearia e seus vínculos com a agenda.",
    steps: [
      "Acesse Barbeiros para visualizar a equipe atual.",
      "Convide profissionais cadastrados para entrarem na sua barbearia.",
      "Depois que o convite for aceito, o profissional poderá aparecer nas opções de agendamento.",
      "Cada barbeiro possui agenda, avaliações e portfólio próprios.",
    ],
  },
  {
    icon: Wallet,
    title: "Caixa e pagamentos",
    description:
      "Registre entradas, saídas e pagamentos para acompanhar o movimento financeiro.",
    steps: [
      "Pagamentos informados ao concluir atendimentos entram no controle financeiro.",
      "No Caixa, registre outras entradas ou saídas com descrição, valor e forma de pagamento.",
      "Confira a data e o tipo de cada movimentação antes de salvar.",
      "Mantenha o caixa atualizado para que os relatórios representem a operação real.",
    ],
  },
  {
    icon: BarChart3,
    title: "Dashboard e relatórios",
    description:
      "Veja rapidamente o desempenho da barbearia e acompanhe os principais indicadores.",
    steps: [
      "O Dashboard mostra resumos de agendamentos, profissionais e clientes.",
      "Em Relatórios, consulte resultados e tendências do período.",
      "Use os filtros disponíveis para analisar informações específicas.",
      "Os números dependem dos atendimentos e pagamentos registrados corretamente.",
    ],
  },
  {
    icon: Store,
    title: "Perfil público da barbearia",
    description:
      "Controle as informações que os clientes veem antes de fazer um agendamento.",
    steps: [
      "Em Perfil da Barbearia, acompanhe avaliações e gerencie as fotos do carrossel.",
      "Em Configurações, altere nome, endereço, contatos, Instagram, descrição e horários.",
      "Mantenha fotos e dados atualizados para transmitir confiança aos clientes.",
      "As alterações salvas são refletidas no perfil público da barbearia.",
    ],
  },
]

const clientJourney = [
  "O cliente cria uma conta ou entra no sistema.",
  "Pesquisa e abre o perfil de uma barbearia.",
  "Escolhe o serviço, o barbeiro, a data e o horário disponível.",
  "Confirma o agendamento e acompanha seus horários na área de agendamentos.",
  "Depois do atendimento concluído, pode avaliar o barbeiro e a barbearia.",
]

export default function AjudaPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <section className="overflow-hidden rounded-3xl border border-border bg-card">
          <div className="bg-[radial-gradient(circle_at_top_right,rgba(195,243,44,0.22),transparent_38%)]">
            <div className="px-6 py-10 sm:px-10 sm:py-14">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C3F32C] text-black">
                <CircleHelp className="h-6 w-6" />
              </div>
              <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-[#71910d] dark:text-[#C3F32C]">
                Central de ajuda
              </p>
              <h1 className="mt-2 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
                Aprenda a usar todo o sistema da sua barbearia
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
                Este guia explica o caminho completo, desde o agendamento feito
                pelo cliente até a conclusão do atendimento, o recebimento e a
                análise dos resultados.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button
                  asChild
                  className="h-10 bg-[#C3F32C] px-4 font-bold text-black hover:bg-[#afd925]"
                >
                  <Link href="/dashboard">
                    Abrir Dashboard
                    <ChevronRight />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-10 px-4">
                  <Link href="/configuracoes">
                    <Settings2 />
                    Minhas configurações
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#71910d] dark:text-[#C3F32C]">
              Visão geral
            </p>
            <h2 className="mt-2 text-2xl font-bold">Como o sistema funciona</h2>
          </div>

          <div className="grid gap-3 md:grid-cols-5">
            {[
              [UserRound, "1. Cliente", "Escolhe o atendimento"],
              [CalendarDays, "2. Agenda", "Reserva data e horário"],
              [Scissors, "3. Serviço", "Barbeiro realiza o atendimento"],
              [ClipboardCheck, "4. Conclusão", "Pagamento é registrado"],
              [BarChart3, "5. Resultado", "Dados entram nos relatórios"],
            ].map(([Icon, title, text]) => {
              const StepIcon = Icon as typeof UserRound
              return (
                <Card key={String(title)} className="border-border p-4">
                  <StepIcon className="h-5 w-5 text-[#71910d] dark:text-[#C3F32C]" />
                  <h3 className="mt-3 text-sm font-bold">{String(title)}</h3>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {String(text)}
                  </p>
                </Card>
              )
            })}
          </div>
        </section>

        <section className="mt-12">
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#71910d] dark:text-[#C3F32C]">
              Manual por área
            </p>
            <h2 className="mt-2 text-2xl font-bold">Recursos do Dashboard</h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {modules.map((module) => (
              <Card key={module.title} className="border-border p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#C3F32C]/20 text-[#557500] dark:text-[#C3F32C]">
                    <module.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{module.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {module.description}
                    </p>
                  </div>
                </div>
                <ol className="mt-5 space-y-3">
                  {module.steps.map((step, index) => (
                    <li key={step} className="flex gap-3 text-sm leading-6">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold">
                        {index + 1}
                      </span>
                      <span className="text-foreground/85">{step}</span>
                    </li>
                  ))}
                </ol>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-12 grid gap-5 lg:grid-cols-2">
          <Card className="border-border p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <Clock3 className="h-5 w-5 text-[#71910d] dark:text-[#C3F32C]" />
              <h2 className="text-xl font-bold">Jornada do cliente</h2>
            </div>
            <ol className="mt-5 space-y-4">
              {clientJourney.map((step, index) => (
                <li key={step} className="flex gap-3 text-sm leading-6">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span>
                    <strong>Passo {index + 1}:</strong> {step}
                  </span>
                </li>
              ))}
            </ol>
          </Card>

          <Card className="border-border p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <KeyRound className="h-5 w-5 text-[#71910d] dark:text-[#C3F32C]" />
              <h2 className="text-xl font-bold">Configurações e licença</h2>
            </div>
            <div className="mt-5 space-y-4 text-sm leading-6 text-foreground/85">
              <p>
                Em <strong>Configurações do Dashboard</strong>, você pode
                atualizar os dados públicos da barbearia e pausar ou liberar
                novos agendamentos sem cancelar os horários existentes.
              </p>
              <p>
                A mesma área mostra o plano ativo e o tempo restante da licença.
                Quando houver uma nova licença, faça a ativação pela área
                indicada no sistema.
              </p>
              <p>
                Em <strong>Perfil e configurações</strong>, altere seus dados
                pessoais, foto, telefone e tema claro ou escuro.
              </p>
              <p className="flex items-start gap-2 rounded-xl bg-muted/60 p-3">
                <ImageIcon className="mt-0.5 h-4 w-4 shrink-0" />
                Dados pessoais pertencem ao usuário. Fotos, endereço, horários e
                contatos da barbearia pertencem ao perfil público do negócio.
              </p>
            </div>
          </Card>
        </section>
      </main>
    </div>
  )
}
