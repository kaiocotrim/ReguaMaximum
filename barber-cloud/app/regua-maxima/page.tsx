import Header from "@/app/_components/header";
import { ThemeToggle } from "@/app/_components/ui/theme-toggle";
import { ReguaMaximumCard } from "@/app/_components/ReguaMaximumCard";

export default function ReguaMaximaPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-3xl p-6 md:p-10">
        <h1 className="text-3xl font-bold text-center mb-4">
          Tecnologia, criatividade e soluções que fazem sentido.
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          Conheça o projeto Regua Máxima – nosso repositório de código aberto e a demonstração ao vivo.
        </p>
        <ReguaMaximumCard />
        <div className="mt-8 flex justify-center">
          <ThemeToggle />
        </div>
      </main>
    </div>
  );
}
