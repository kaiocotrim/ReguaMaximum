import Link from "next/link";
import { Button } from "@/app/_components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/app/_components/ui/card";

export function ReguaMaximumCard() {
  return (
    <Card className="border border-border/20 bg-card/80 backdrop-blur-xl shadow-lg">
      <CardHeader className="flex items-center justify-center">
        <CardTitle className="text-2xl font-bold text-center text-foreground">
          Regua Máxima
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4 text-center">
        <p className="text-muted-foreground max-w-md">
          Plataforma de gerenciamento de barbearias com foco em tecnologia, criatividade e soluções que fazem sentido.
        </p>
        <img
          src="/regua-maxima-preview.png"
          alt="Regua Máxima preview"
          className="w-full max-w-sm rounded-lg shadow-md"
        />
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link href="https://github.com/kaiocotrim/ReguaMaximum" target="_blank" rel="noopener noreferrer">
          <Button variant="outline" className="w-full sm:w-auto">
            Ver no GitHub
          </Button>
        </Link>
        <Link href="https://reguamaxima.cotrimdev.com.br/" target="_blank" rel="noopener noreferrer">
          <Button className="w-full sm:w-auto">
            Demo ao vivo
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
