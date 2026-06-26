// app/dashboard/agendamentos/page.tsx
"use client"

import { useState } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { X, Plus, Clock, User, Scissors, Phone } from "lucide-react"

// ─── Tipos ────────────────────────────────────────────────
interface Agendamento {
  id: string
  title: string
  start: string
  end: string
  color: string
  extendedProps: {
    cliente: string
    barbeiro: string
    servico: string
    telefone: string
    status: "confirmado" | "pendente" | "concluido"
  }
}

// ─── Dados dos barbeiros (cada um tem uma cor) ─────────────
const barbeiros = [
  { nome: "Carlos",  cor: "#a3e635" }, // lime
  { nome: "Rafael",  cor: "#38bdf8" }, // sky
  { nome: "Diego",   cor: "#f97316" }, // orange
]

const servicos = ["Corte", "Barba", "Corte + Barba", "Degradê", "Hidratação"]

// ─── Agendamentos de exemplo ───────────────────────────────
const hoje = new Date().toISOString().split("T")[0]

const agendamentosIniciais: Agendamento[] = [
  {
    id: "1",
    title: "João Silva — Corte",
    start: `${hoje}T09:00:00`,
    end: `${hoje}T09:45:00`,
    color: "#a3e635",
    extendedProps: { cliente: "João Silva", barbeiro: "Carlos", servico: "Corte", telefone: "(11) 99999-0001", status: "confirmado" },
  },
  {
    id: "2",
    title: "Pedro Alves — Barba",
    start: `${hoje}T10:00:00`,
    end: `${hoje}T10:30:00`,
    color: "#38bdf8",
    extendedProps: { cliente: "Pedro Alves", barbeiro: "Rafael", servico: "Barba", telefone: "(11) 99999-0002", status: "pendente" },
  },
  {
    id: "3",
    title: "Lucas Lima — Corte + Barba",
    start: `${hoje}T11:00:00`,
    end: `${hoje}T12:00:00`,
    color: "#f97316",
    extendedProps: { cliente: "Lucas Lima", barbeiro: "Diego", servico: "Corte + Barba", telefone: "(11) 99999-0003", status: "confirmado" },
  },
  {
    id: "4",
    title: "Marcos Costa — Degradê",
    start: `${hoje}T14:00:00`,
    end: `${hoje}T14:45:00`,
    color: "#a3e635",
    extendedProps: { cliente: "Marcos Costa", barbeiro: "Carlos", servico: "Degradê", telefone: "(11) 99999-0004", status: "confirmado" },
  },
]

const statusConfig = {
  confirmado: { label: "Confirmado", bg: "bg-lime-400/10", text: "text-lime-400", dot: "bg--[#C3F32C]" },
  pendente:   { label: "Pendente",   bg: "bg-yellow-400/10", text: "text-yellow-400", dot: "bg-yellow-400" },
  concluido:  { label: "Concluído",  bg: "bg-neutral-700",   text: "text-neutral-300", dot: "bg-neutral-400" },
}

// ─── Componente principal ──────────────────────────────────
export default function AgendamentosPage() {
  const [eventos, setEventos] = useState<Agendamento[]>(agendamentosIniciais)
  const [modalAberto, setModalAberto] = useState(false)
  const [detalheAberto, setDetalheAberto] = useState(false)
  const [eventoSelecionado, setEventoSelecionado] = useState<Agendamento | null>(null)
  const [dataClicada, setDataClicada] = useState("")

  const [form, setForm] = useState({
    cliente: "",
    telefone: "",
    barbeiro: barbeiros[0].nome,
    servico: servicos[0],
    data: "",
    hora: "09:00",
    duracao: "45",
  })

  // Abre modal ao clicar numa data/horário vazio
  function handleDateClick(info: { dateStr: string }) {
    const [data, hora] = info.dateStr.includes("T")
      ? info.dateStr.split("T")
      : [info.dateStr, "09:00"]
    setForm((f) => ({ ...f, data, hora: hora.slice(0, 5) }))
    setDataClicada(info.dateStr)
    setModalAberto(true)
  }

  // Abre detalhe ao clicar num evento
  function handleEventClick(info: { event: { id: string } }) {
    const ev = eventos.find((e) => e.id === info.event.id)
    if (ev) {
      setEventoSelecionado(ev)
      setDetalheAberto(true)
    }
  }

  // Salva novo agendamento
  function salvarAgendamento() {
    if (!form.cliente || !form.data) return
    const barbeiro = barbeiros.find((b) => b.nome === form.barbeiro)!
    const startStr = `${form.data}T${form.hora}:00`
    const endDate = new Date(`${form.data}T${form.hora}:00`)
    endDate.setMinutes(endDate.getMinutes() + parseInt(form.duracao))
    const endStr = endDate.toISOString().slice(0, 19)

    const novo: Agendamento = {
      id: String(Date.now()),
      title: `${form.cliente} — ${form.servico}`,
      start: startStr,
      end: endStr,
      color: barbeiro.cor,
      extendedProps: {
        cliente: form.cliente,
        barbeiro: form.barbeiro,
        servico: form.servico,
        telefone: form.telefone,
        status: "pendente",
      },
    }
    setEventos((ev) => [...ev, novo])
    setModalAberto(false)
    setForm({ cliente: "", telefone: "", barbeiro: barbeiros[0].nome, servico: servicos[0], data: "", hora: "09:00", duracao: "45" })
  }

  // Remove agendamento
  function removerAgendamento(id: string) {
    setEventos((ev) => ev.filter((e) => e.id !== id))
    setDetalheAberto(false)
  }

return (
    <div className="min-h-screen bg-[#0e0e0e] p-8">

      {/* ── Header ── */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Agendamentos</h1>
          <p className="mt-0.5 text-sm text-[#444]">Clique em um horário para agendar</p>
        </div>
        <button
          onClick={() => setModalAberto(true)}
          className="flex items-center gap-2 rounded-xl bg-[#C3F32C] px-4 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
        >
          <Plus size={15} />
          Novo agendamento
        </button>
      </div>

      {/* ── Legenda barbeiros ── */}
      <div className="mb-6 flex gap-5">
        {barbeiros.map((b) => (
          <div key={b.nome} className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: b.cor }} />
            <span className="text-xs text-[#444]">{b.nome}</span>
          </div>
        ))}
      </div>

      {/* ── Calendário ── */}
      <div className="fc-barbearia rounded-2xl bg-[#0e0e0e] p-1">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          locale="pt-br"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          slotMinTime="08:00:00"
          slotMaxTime="20:00:00"
          slotDuration="00:30:00"
          allDaySlot={false}
          events={eventos}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          height="auto"
          nowIndicator
          buttonText={{ today: "Hoje", month: "Mês", week: "Semana", day: "Dia" }}
        />
      </div>

      {/* ── Modal: Novo agendamento ── */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/[0.06] bg-[#111] p-6">

            {/* Cabeçalho */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-base font-bold text-white">Novo Agendamento</h2>
              <button
                onClick={() => setModalAberto(false)}
                className="text-[#444] transition-colors hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Nome */}
              <div>
                <label className="mb-1.5 block text-[11px] font-medium tracking-wide text-[#444] uppercase">
                  Cliente
                </label>
                <input
                  className="w-full rounded-xl bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder-[#333] outline-none transition-colors focus:bg-white/[0.06] focus:ring-1 focus:ring-[#C3F32C]/30"
                  placeholder="Ex: João Silva"
                  value={form.cliente}
                  onChange={(e) => setForm((f) => ({ ...f, cliente: e.target.value }))}
                />
              </div>

              {/* Telefone */}
              <div>
                <label className="mb-1.5 block text-[11px] font-medium tracking-wide text-[#444] uppercase">
                  Telefone
                </label>
                <input
                  className="w-full rounded-xl bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder-[#333] outline-none transition-colors focus:bg-white/[0.06] focus:ring-1 focus:ring-[#C3F32C]/30"
                  placeholder="(11) 99999-0000"
                  value={form.telefone}
                  onChange={(e) => setForm((f) => ({ ...f, telefone: e.target.value }))}
                />
              </div>

              {/* Barbeiro + Serviço */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-[11px] font-medium tracking-wide text-[#444] uppercase">
                    Barbeiro
                  </label>
                  <select
                    className="w-full rounded-xl bg-white/[0.04] px-3.5 py-2.5 text-sm text-white outline-none transition-colors focus:bg-white/[0.06] focus:ring-1 focus:ring-[#C3F32C]/30"
                    value={form.barbeiro}
                    onChange={(e) => setForm((f) => ({ ...f, barbeiro: e.target.value }))}
                  >
                    {barbeiros.map((b) => <option key={b.nome}>{b.nome}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-medium tracking-wide text-[#444] uppercase">
                    Serviço
                  </label>
                  <select
                    className="w-full rounded-xl bg-white/[0.04] px-3.5 py-2.5 text-sm text-white outline-none transition-colors focus:bg-white/[0.06] focus:ring-1 focus:ring-[#C3F32C]/30"
                    value={form.servico}
                    onChange={(e) => setForm((f) => ({ ...f, servico: e.target.value }))}
                  >
                    {servicos.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Data + Horário */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-[11px] font-medium tracking-wide text-[#444] uppercase">
                    Data
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-xl bg-white/[0.04] px-3.5 py-2.5 text-sm text-white outline-none transition-colors focus:bg-white/[0.06] focus:ring-1 focus:ring-[#C3F32C]/30"
                    value={form.data}
                    onChange={(e) => setForm((f) => ({ ...f, data: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-medium tracking-wide text-[#444] uppercase">
                    Horário
                  </label>
                  <input
                    type="time"
                    className="w-full rounded-xl bg-white/[0.04] px-3.5 py-2.5 text-sm text-white outline-none transition-colors focus:bg-white/[0.06] focus:ring-1 focus:ring-[#C3F32C]/30"
                    value={form.hora}
                    onChange={(e) => setForm((f) => ({ ...f, hora: e.target.value }))}
                  />
                </div>
              </div>

              {/* Duração */}
              <div>
                <label className="mb-1.5 block text-[11px] font-medium tracking-wide text-[#444] uppercase">
                  Duração
                </label>
                <select
                  className="w-full rounded-xl bg-white/[0.04] px-3.5 py-2.5 text-sm text-white outline-none transition-colors focus:bg-white/[0.06] focus:ring-1 focus:ring-[#C3F32C]/30"
                  value={form.duracao}
                  onChange={(e) => setForm((f) => ({ ...f, duracao: e.target.value }))}
                >
                  <option value="30">30 minutos</option>
                  <option value="45">45 minutos</option>
                  <option value="60">1 hora</option>
                  <option value="90">1h30</option>
                </select>
              </div>
            </div>

            {/* Ações */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setModalAberto(false)}
                className="flex-1 rounded-xl py-2.5 text-sm text-[#555] transition-colors hover:bg-white/[0.04] hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={salvarAgendamento}
                className="flex-1 rounded-xl bg-[#C3F32C] py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
              >
                Agendar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Detalhe do agendamento ── */}
      {detalheAberto && eventoSelecionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-white/[0.06] bg-[#111] p-6">

            {/* Cabeçalho */}
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base font-bold text-white">Agendamento</h2>
              <button
                onClick={() => setDetalheAberto(false)}
                className="text-[#444] transition-colors hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Status */}
            {(() => {
              const s = statusConfig[eventoSelecionado.extendedProps.status]
              return (
                <div className={`mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1 ${s.bg}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                  <span className={`text-xs font-medium ${s.text}`}>{s.label}</span>
                </div>
              )
            })()}

            {/* Detalhes */}
            <div className="space-y-4">
              {[
                { icon: User, label: "Cliente", value: eventoSelecionado.extendedProps.cliente },
                { icon: Phone, label: "Telefone", value: eventoSelecionado.extendedProps.telefone || "—" },
                {
                  icon: Scissors,
                  label: "Barbeiro · Serviço",
                  value: `${eventoSelecionado.extendedProps.barbeiro} · ${eventoSelecionado.extendedProps.servico}`,
                },
                {
                  icon: Clock,
                  label: "Horário",
                  value: new Date(eventoSelecionado.start).toLocaleString("pt-BR", {
                    day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit",
                  }),
                },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <Icon size={14} className="mt-0.5 shrink-0 text-[#333]" />
                  <div>
                    <p className="text-[11px] text-[#444]">{label}</p>
                    <p className="text-sm font-medium text-white">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Cancelar */}
            <button
              onClick={() => removerAgendamento(eventoSelecionado.id)}
              className="mt-6 w-full rounded-xl py-2.5 text-sm text-red-500/60 transition-colors hover:bg-red-500/5 hover:text-red-400"
            >
              Cancelar agendamento
            </button>
          </div>
        </div>
      )}
    </div>
  )
}