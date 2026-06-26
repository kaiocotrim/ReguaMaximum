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
    <div className="p-6 bg-black min-h-screen">

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Agendamentos</h1>
          <p className="text-neutral-400 text-sm mt-0.5">Clique em um horário para agendar</p>
        </div>
        <button
          onClick={() => setModalAberto(true)}
          className="flex items-center gap-2 bg-[#C3F32C] hover:bg-[#C3F32C] text-black text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={16} />
          Novo agendamento
        </button>
      </div>

      {/* ── Legenda barbeiros ── */}
      <div className="flex gap-4 mb-4">
        {barbeiros.map((b) => (
          <div key={b.nome} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: b.cor }} />
            <span className="text-xs text-neutral-400">{b.nome}</span>
          </div>
        ))}
      </div>

      {/* ── Calendário ── */}
      <div className="fc-barbearia rounded-xl border border-neutral-800 p-4">
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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-bold text-lg">Novo Agendamento</h2>
              <button onClick={() => setModalAberto(false)} className="text-neutral-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-neutral-400 mb-1 block">Nome do cliente</label>
                <input
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#C3F32C]"
                  placeholder="Ex: João Silva"
                  value={form.cliente}
                  onChange={(e) => setForm((f) => ({ ...f, cliente: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-xs text-neutral-400 mb-1 block">Telefone</label>
                <input
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#C3F32C]"
                  placeholder="(11) 99999-0000"
                  value={form.telefone}
                  onChange={(e) => setForm((f) => ({ ...f, telefone: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-neutral-400 mb-1 block">Barbeiro</label>
                  <select
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#C3F32C]"
                    value={form.barbeiro}
                    onChange={(e) => setForm((f) => ({ ...f, barbeiro: e.target.value }))}
                  >
                    {barbeiros.map((b) => <option key={b.nome}>{b.nome}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-neutral-400 mb-1 block">Serviço</label>
                  <select
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#C3F32C]"
                    value={form.servico}
                    onChange={(e) => setForm((f) => ({ ...f, servico: e.target.value }))}
                  >
                    {servicos.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-neutral-400 mb-1 block">Data</label>
                  <input
                    type="date"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#C3F32C]"
                    value={form.data}
                    onChange={(e) => setForm((f) => ({ ...f, data: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 mb-1 block">Horário</label>
                  <input
                    type="time"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#C3F32C]"
                    value={form.hora}
                    onChange={(e) => setForm((f) => ({ ...f, hora: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-neutral-400 mb-1 block">Duração</label>
                <select
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#C3F32C]"
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

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setModalAberto(false)}
                className="flex-1 border border-neutral-700 text-neutral-300 rounded-lg py-2.5 text-sm hover:bg-neutral-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={salvarAgendamento}
                className="flex-1 bg-[#C3F32C] hover:bg-[#C3F32C] text-black font-semibold rounded-lg py-2.5 text-sm transition-colors"
              >
                Agendar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Detalhe do agendamento ── */}
      {detalheAberto && eventoSelecionado && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-bold text-lg">Agendamento</h2>
              <button onClick={() => setDetalheAberto(false)} className="text-neutral-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* Status */}
            {(() => {
              const s = statusConfig[eventoSelecionado.extendedProps.status]
              return (
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${s.bg} mb-5`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                  <span className={`text-xs font-medium ${s.text}`}>{s.label}</span>
                </div>
              )
            })()}

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <User size={14} className="text-neutral-500 shrink-0" />
                <div>
                  <p className="text-neutral-400 text-xs">Cliente</p>
                  <p className="text-white font-medium">{eventoSelecionado.extendedProps.cliente}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone size={14} className="text-neutral-500 shrink-0" />
                <div>
                  <p className="text-neutral-400 text-xs">Telefone</p>
                  <p className="text-white">{eventoSelecionado.extendedProps.telefone || "—"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Scissors size={14} className="text-neutral-500 shrink-0" />
                <div>
                  <p className="text-neutral-400 text-xs">Barbeiro · Serviço</p>
                  <p className="text-white">{eventoSelecionado.extendedProps.barbeiro} · {eventoSelecionado.extendedProps.servico}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock size={14} className="text-neutral-500 shrink-0" />
                <div>
                  <p className="text-neutral-400 text-xs">Horário</p>
                  <p className="text-white">
                    {new Date(eventoSelecionado.start).toLocaleString("pt-BR", {
                      day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit"
                    })}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => removerAgendamento(eventoSelecionado.id)}
              className="w-full mt-6 border border-red-800 text-red-400 hover:bg-red-900/20 rounded-lg py-2.5 text-sm transition-colors"
            >
              Cancelar agendamento
            </button>
          </div>
        </div>
      )}
    </div>
  )
}