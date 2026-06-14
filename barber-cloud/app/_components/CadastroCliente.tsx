"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/app/_components/ui/input";
import { Button } from "@/app/_components/ui/button";
import {
  ArrowRight,
  ArrowLeft,
  Upload,
  Camera,
  User,
  Check,
  MapPin,
} from "lucide-react";

type StepId = 0 | 1 | 2 | 3;

const TOTAL_STEPS = 4;

const STEP_PCT: Record<number, number> = {
  0: 0,
  1: 33,
  2: 66,
  3: 100,
};

const ACCENT = "#C3F32C";

function ProgressHeader({ step }: { step: number }) {
  const pct = STEP_PCT[step] ?? 100;
  const isSuccess = step === TOTAL_STEPS - 1;

  return (
    <div className="mb-10 w-full max-w-[480px]">
      <div className="mb-3 flex items-center justify-between">
        <motion.span
          key={step}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="text-[11px] uppercase tracking-[0.12em] text-white/20"
        >
          {isSuccess ? "Concluído" : `${step + 1} / ${TOTAL_STEPS - 1}`}
        </motion.span>
        <motion.span
          key={`pct-${pct}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-[11px] font-medium"
          style={{ color: ACCENT }}
        >
          {pct}%
        </motion.span>
      </div>
      <div className="relative h-[1.5px] w-full rounded-full bg-white/[0.06]">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          style={{ background: ACCENT }}
        />
      </div>
    </div>
  );
}

function StepShell({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        <Icon className="mb-4 h-5 w-5" style={{ color: ACCENT }} />
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="mb-1 text-xl font-semibold text-white"
      >
        {title}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="mb-6 text-sm text-white/35"
      >
        {subtitle}
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        {children}
      </motion.div>
    </div>
  );
}

const CadastroCliente = ({ nomeInicial }: { nomeInicial: string }) => {
  const [step, setStep] = useState<StepId>(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [nome, setNome] = useState(nomeInicial);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [cidade, setCidade] = useState("");

  const salvarPerfil = async () => {
    try {
      const response = await fetch("/api/client/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, avatar, cidade }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Erro ao salvar:", error);
        return;
      }

      window.location.href = "/";
    } catch (error) {
      console.error("Erro inesperado:", error);
    }
  };

  const isValid = useCallback(
    (s: number) => {
      if (s === 0) return nome.trim().length >= 2;
      if (s === 1) return avatar !== null;
      if (s === 2) return cidade.trim().length >= 2;
      return true;
    },
    [nome, avatar, cidade]
  );

  const next = () => {
    if (!isValid(step)) return;
    setDir(1);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1) as StepId);
  };

  const back = () => {
    setDir(-1);
    setStep((s) => Math.max(s - 1, 0) as StepId);
  };

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAvatar(URL.createObjectURL(file));
  };

  const isSuccess = step === TOTAL_STEPS - 1;

  const steps: React.ReactNode[] = [
    // 0 — Nome
    <StepShell
      key="nome"
      icon={User}
      title="Como você quer ser chamado?"
      subtitle="Esse nome aparecerá no seu perfil público."
    >
      <Input
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && next()}
        placeholder="Ex: João Silva"
        maxLength={60}
        autoFocus
        className="h-12 border-white/10 bg-white/[0.04] text-base text-white placeholder:text-white/20 focus-visible:ring-0 focus-visible:border-[#C3F32C]"
      />
    </StepShell>,

    // 1 — Foto
    <StepShell
      key="foto"
      icon={Camera}
      title="Adicione uma foto"
      subtitle="Perfis com foto ficam mais completos."
    >
      <div className="flex items-center gap-5">
        <label
          htmlFor="avatar-cliente-input"
          className="group relative flex h-20 w-20 flex-shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-dashed border-white/15 bg-white/[0.03] transition-all hover:border-[#C3F32C]/40"
        >
          {avatar ? (
            <motion.img
              key="avatar-img"
              src={avatar}
              alt="Preview"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="h-full w-full object-cover"
            />
          ) : (
            <User className="h-6 w-6 text-white/20" />
          )}
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 opacity-0 transition-all group-hover:bg-black/60 group-hover:opacity-100">
            <Camera className="h-4 w-4 text-white" />
          </div>
          <input
            id="avatar-cliente-input"
            type="file"
            accept="image/png,image/jpeg"
            className="hidden"
            onChange={handleAvatar}
          />
        </label>
        <div className="flex flex-col gap-2">
          <AnimatePresence>
            {avatar && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-1.5"
              >
                <Check className="h-3.5 w-3.5" style={{ color: ACCENT }} />
                <span className="text-xs" style={{ color: ACCENT }}>Foto adicionada</span>
              </motion.div>
            )}
          </AnimatePresence>
          <label
            htmlFor="avatar-cliente-input"
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/50 transition-all hover:border-white/20 hover:text-white/80"
          >
            <Upload className="h-3.5 w-3.5" />
            {avatar ? "Trocar foto" : "Enviar foto"}
          </label>
          <span className="text-xs text-white/20">PNG ou JPG · até 5 MB</span>
        </div>
      </div>
    </StepShell>,

    // 2 — Cidade
    <StepShell
      key="cidade"
      icon={MapPin}
      title="Onde você está?"
      subtitle="Sua cidade para encontrar barbearias próximas."
    >
      <Input
        value={cidade}
        onChange={(e) => setCidade(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && next()}
        placeholder="Ex: São Paulo, SP"
        className="h-12 border-white/10 bg-white/[0.04] text-base text-white placeholder:text-white/20 focus-visible:ring-0 focus-visible:border-[#C3F32C]"
      />
    </StepShell>,

    // 3 — Sucesso
    <div key="sucesso" className="flex flex-col items-center py-6 text-center">
      <motion.div
        className="mb-8 flex h-16 w-16 items-center justify-center rounded-full border"
        style={{ borderColor: ACCENT }}
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
      >
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.2 }}
        >
          <Check className="h-7 w-7" style={{ color: ACCENT }} strokeWidth={2} />
        </motion.div>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.3 }}
        className="mb-2 text-xl font-semibold text-white"
      >
        Tudo pronto!
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.32, duration: 0.3 }}
        className="mb-8 max-w-[280px] text-sm leading-relaxed text-white/35"
      >
        Seu perfil está ativo. Agora é só encontrar a barbearia ideal e agendar seu corte.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.3 }}
        className="mb-8 w-full rounded-xl border border-white/[0.06] p-4 text-left"
      >
        {[
          { label: "Nome", value: nome },
          { label: "Cidade", value: cidade },
        ].map(({ label, value }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45 + i * 0.07, duration: 0.25 }}
            className="flex items-center justify-between border-b border-white/[0.05] py-2.5 last:border-b-0"
          >
            <span className="text-xs text-white/25">{label}</span>
            <span className="text-xs text-white/60">{value}</span>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65, duration: 0.3 }}
        className="w-full"
      >
        <Button
          onClick={salvarPerfil}
          className="h-11 w-full cursor-pointer rounded-xl text-sm font-semibold text-black hover:opacity-90"
          style={{ background: ACCENT }}
        >
          Acessar o app
        </Button>
      </motion.div>
    </div>,
  ];

  return (
    <div className="flex min-h-screen flex-col items-center bg-[#0F0F0F] px-4 py-12">
      <ProgressHeader step={step} />
      <div className="w-full max-w-[480px] overflow-hidden rounded-2xl border border-white/[0.06] bg-[#1A1A1A]">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            variants={{
              initial: (d: number) => ({ opacity: 0, y: d * 16 }),
              animate: { opacity: 1, y: 0 },
              exit: (d: number) => ({ opacity: 0, y: d * -16 }),
            }}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="px-8 pt-8 pb-6">{steps[step]}</div>
          </motion.div>
        </AnimatePresence>

        {!isSuccess && (
          <div className="flex items-center justify-between border-t border-white/[0.05] px-8 py-4">
            <motion.button
              onClick={back}
              whileTap={{ scale: 0.95 }}
              className={`flex cursor-pointer items-center gap-1.5 text-sm text-white/25 transition-colors hover:text-white/50 ${step === 0 ? "invisible" : ""}`}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Voltar
            </motion.button>
            <motion.button
              onClick={next}
              disabled={!isValid(step)}
              whileTap={isValid(step) ? { scale: 0.96 } : {}}
              whileHover={isValid(step) ? { opacity: 0.9 } : {}}
              className="flex h-9 cursor-pointer items-center gap-2 rounded-lg px-5 text-sm font-semibold text-black transition-opacity disabled:cursor-not-allowed disabled:opacity-20"
              style={{ background: ACCENT }}
            >
              Continuar
              <ArrowRight className="h-3.5 w-3.5" />
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CadastroCliente;