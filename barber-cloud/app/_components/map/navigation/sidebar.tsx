"use client";

import { motion, DragControls, AnimatePresence } from "framer-motion";
import { ArrowLeft, Car, Footprints, TrainFront, Star, X, MapPin, ChevronUp } from "lucide-react";
import { Barbearia } from "@/utils/barbeariasData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const ESTADOS_BR = [
  "Todos","SP","RJ","MG","ES","PR","SC","RS",
  "MS","MT","GO","DF","BA","PE","CE","RN","PB",
  "AL","SE","MA","PI","AM","PA","AC","RR","RO","AP",
];

const TAGS = ["Abertas", "Mais Próximas", "Premium"];

const ETA_ITEMS = [
  { icon: Car,        label: "Carro", key: "car"     },
  { icon: TrainFront, label: "Metrô", key: "transit" },
  { icon: Footprints, label: "A pé",  key: "walk"    },
] as const;

const AVALIACOES = [
  { label: "Cortesia", key: "atendimento" },
  { label: "Ambiente", key: "ambiente"    },
  { label: "Higiene",  key: "higiene"     },
] as const;

interface SidebarProps {
  isExpanded: boolean;
  setIsExpanded: (v: boolean) => void;
  dragControls: DragControls;
  filiaisFiltradas: Barbearia[];
  filtroTag: string | null;
  setFiltroTag: (v: string | null) => void;
  filtroEstado: string;
  setFiltroEstado: (v: string) => void;
  rotaAtivaId: string | null;
  filialAtiva: string | null;
  routeEtas: { car: number; walk: number; transit: number } | null;
  handleSelecionarUnidade: (b: Barbearia) => void;
  limparRota: () => void;
}

export default function Sidebar({
  isExpanded, setIsExpanded, dragControls,
  filiaisFiltradas, filtroTag, setFiltroTag,
  filtroEstado, setFiltroEstado,
  rotaAtivaId, filialAtiva, routeEtas,
  handleSelecionarUnidade, limparRota,
}: SidebarProps) {

  const mediaAvaliacao = filiaisFiltradas.length > 0
    ? (filiaisFiltradas.reduce((a, b) => a + b.avaliacao, 0) / filiaisFiltradas.length).toFixed(1)
    : "—";

  return (
    <TooltipProvider delayDuration={300}>
      <motion.aside
        className="map-sidebar flex flex-col bg-[#080808] text-white md:!h-screen md:!top-0 md:!bottom-auto md:!transform-none border-r border-white/[0.05]"
        drag="y"
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.12}
        onDragEnd={(_, { offset, velocity }) => {
          if (offset.y < -15 || velocity.y < -150) setIsExpanded(true);
          else if (offset.y > 15 || velocity.y > 150) setIsExpanded(false);
        }}
        animate={{ height: isExpanded ? "88vh" : "30vh" }}
        transition={{ type: "spring", damping: 28, stiffness: 320 }}
      >

        {/* ── Drag zone ── */}
        <div
          className="flex-shrink-0 cursor-grab active:cursor-grabbing"
          onPointerDown={(e) => dragControls.start(e)}
          style={{ touchAction: "none" }}
        >
          {/* Pill */}
          <div
            className="md:hidden flex justify-center pt-3.5 pb-2"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="w-9 h-[3px] rounded-full bg-white/10" />
          </div>

          {/* Header */}
          <div className="px-6 pt-3 pb-4">

            {/* Back — desktop only */}
            <button
              onClick={() => window.history.back()}
              className="hidden md:flex items-center gap-1.5 text-white/30 hover:text-white/60 text-[12px] mb-6 transition-colors group w-fit"
            >
              <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
              Voltar
            </button>

            {/* Title row */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-lime-400/60 mb-1.5">
                  Rede de atendimento
                </p>
                <h1 className="text-[20px] font-semibold tracking-[-0.03em] text-white/90 leading-none">
                  Filiais
                </h1>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 bg-white/[0.03] border border-white/[0.06] rounded-2xl px-4 py-3">
                <div className="text-center">
                  <div className="text-[16px] font-semibold text-lime-400 leading-none tabular-nums">
                    {filiaisFiltradas.length}
                  </div>
                  <div className="text-[9px] uppercase tracking-widest text-white/25 mt-1">
                    unidades
                  </div>
                </div>
                <Separator orientation="vertical" className="h-6 bg-white/[0.07]" />
                <div className="text-center">
                  <div className="text-[16px] font-semibold text-lime-400 leading-none flex items-center gap-0.5 tabular-nums">
                    <Star className="h-3 w-3 fill-current shrink-0" />
                    {mediaAvaliacao}
                  </div>
                  <div className="text-[9px] uppercase tracking-widest text-white/25 mt-1">
                    média
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="px-6 pb-4 space-y-3">

            {/* Select estado */}
            <div onPointerDown={(e) => e.stopPropagation()}>
              <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                <SelectTrigger className="w-full h-10 bg-white/[0.04] border-white/[0.07] text-white/70 text-[13px] rounded-xl focus:ring-0 focus:border-lime-400/30 transition-colors">
                  <SelectValue placeholder="Todos os estados" />
                </SelectTrigger>
                <SelectContent className="bg-[#111] border-white/10 text-white rounded-xl overflow-hidden">
                  {ESTADOS_BR.map((uf) => (
                    <SelectItem
                      key={uf}
                      value={uf}
                      className="text-[13px] focus:bg-white/10 focus:text-white cursor-pointer rounded-lg"
                    >
                      {uf === "Todos" ? "Todos os estados" : uf}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tags */}
            <div
              className="flex gap-1.5 overflow-x-auto no-scrollbar"
              onPointerDown={(e) => e.stopPropagation()}
            >
              {TAGS.map((tag) => {
                const active = filtroTag === tag;
                return (
                  <Badge
                    key={tag}
                    onClick={() => setFiltroTag(active ? null : tag)}
                    className={`px-3.5 py-1.5 rounded-full text-[11px] font-medium whitespace-nowrap cursor-pointer select-none transition-all duration-200 border ${
                      active
                        ? "bg-lime-400 text-black border-lime-400 hover:bg-lime-300"
                        : "bg-transparent text-white/40 border-white/[0.08] hover:border-white/20 hover:text-white/70 hover:bg-white/[0.04]"
                    }`}
                  >
                    {tag}
                  </Badge>
                );
              })}
            </div>
          </div>

          <Separator className="bg-white/[0.05]" />
        </div>

        {/* ── Lista ── */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">

          {/* Limpar rota */}
          <AnimatePresence>
            {rotaAtivaId && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden mb-1"
              >
                <Button
                  onClick={limparRota}
                  variant="ghost"
                  className="w-full h-9 rounded-xl bg-red-500/[0.06] border border-red-500/[0.12] text-red-400/70 hover:bg-red-500/[0.10] hover:text-red-400 text-[12px] gap-2 transition-all"
                >
                  <X className="h-3.5 w-3.5" />
                  Limpar rota ativa
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {filiaisFiltradas.map((barbearia) => {
            const isRouteActive = rotaAtivaId === barbearia.id;
            const isActive = filialAtiva === barbearia.id;

            return (
              <motion.div
                key={barbearia.id}
                layout
                onClick={() => handleSelecionarUnidade(barbearia)}
                className={`relative rounded-2xl border cursor-pointer overflow-hidden transition-colors duration-200 ${
                  isRouteActive
                    ? "border-lime-400/20 bg-lime-400/[0.03]"
                    : "border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.10]"
                }`}
              >
                {/* Accent line */}
                <AnimatePresence>
                  {isRouteActive && (
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      exit={{ scaleY: 0 }}
                      className="absolute left-0 top-0 w-[2px] h-full bg-lime-400 origin-top rounded-l-2xl"
                    />
                  )}
                </AnimatePresence>

                <div className="p-4">
                  {/* Nome + rating */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className={`font-medium text-[13px] tracking-[-0.01em] leading-snug transition-colors ${
                      isRouteActive ? "text-lime-400" : "text-white/85"
                    }`}>
                      {barbearia.nome}
                    </h3>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1 shrink-0 cursor-default">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span className="text-[12px] text-white/50 tabular-nums">
                            {barbearia.avaliacao.toFixed(1)}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="left" className="bg-[#111] border-white/10 text-white/80 text-[11px]">
                        Avaliação geral
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  {/* Meta row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[11px] text-white/30">
                      <MapPin className="h-3 w-3" />
                      {barbearia.distancia}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-white/30">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        barbearia.statusOcupacao === "lotado"
                          ? "bg-red-400 animate-pulse"
                          : "bg-emerald-400/70"
                      }`} />
                      {barbearia.porcentagemOcupacao}% ocupado
                    </div>
                  </div>

                  {/* Expanded panel */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ type: "spring", damping: 26, stiffness: 300 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t border-white/[0.06] space-y-3">

                          {/* ETAs */}
                          {routeEtas ? (
                            <div className="grid grid-cols-3 gap-1.5">
                              {ETA_ITEMS.map(({ icon: Icon, label, key }) => (
                                <div
                                  key={key}
                                  className="flex flex-col items-center gap-1.5 bg-white/[0.03] border border-white/[0.05] rounded-xl py-3"
                                >
                                  <Icon className="h-3.5 w-3.5 text-white/25" />
                                  <span className="text-[12px] font-semibold text-white/75 tabular-nums">
                                    {Math.ceil(routeEtas[key] / 60)} min
                                  </span>
                                  <span className="text-[9px] text-white/25 uppercase tracking-wider">
                                    {label}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex justify-center py-4">
                              <span className="text-[11px] text-white/25 animate-pulse tracking-wider">
                                Calculando rota…
                              </span>
                            </div>
                          )}

                          {/* Sub-avaliações */}
                          <div className="grid grid-cols-3 rounded-xl bg-white/[0.025] border border-white/[0.05] py-3">
                            {AVALIACOES.map(({ label, key }) => (
                              <div key={key} className="text-center">
                                <div className="text-[13px] font-semibold text-lime-400 tabular-nums">
                                  {barbearia.detalhesAvaliacao[key].toFixed(1)}
                                </div>
                                <div className="text-[9px] uppercase tracking-wider text-white/25 mt-0.5">
                                  {label}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* CTA */}
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              alert(`Abrindo checkout da filial ${barbearia.nome}`);
                            }}
                            className="w-full h-11 rounded-xl bg-lime-400 text-black text-[13px] font-semibold tracking-wide hover:bg-lime-300 active:scale-[0.98] transition-all duration-150 shadow-none"
                          >
                            Agendar nesta unidade
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Expand toggle — mobile */}
        <AnimatePresence>
          {!isExpanded && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExpanded(true)}
              className="md:hidden absolute bottom-4 right-4 h-9 w-9 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white/70 transition-colors"
            >
              <ChevronUp className="h-4 w-4" />
            </motion.button>
          )}
        </AnimatePresence>

      </motion.aside>
    </TooltipProvider>
  );
}