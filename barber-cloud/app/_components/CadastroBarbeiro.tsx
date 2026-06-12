
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import { Textarea } from "@/app/_components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";

import { User, Upload, ArrowRight } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card"



const CadastroBarbeiro = () => {
  return (
    <div className="flex min-h-screen flex-col items-center bg-[#121212] px-4 py-16">
      <div className="mb-10 max-w-md text-center">
        <h2 className="text-2xl leading-relaxed font-medium">
          Vamos cadastrar o seu perfil para que você faça parte da{" "}
          <span className="shine-text">família Régua Máxima.</span>
        </h2>
      </div>

      <Card className="w-full max-w-[600px] rounded-2xl border border-white/10 bg-[#1A1A1A]">
        <CardHeader>
          <CardTitle className="text-base font-medium">
            Foto de perfil
          </CardTitle>
          <CardDescription className="text-sm text-white/50">
            Essa imagem aparecerá no seu perfil público e na agenda dos
            clientes.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Upload de foto */}
          <div className="flex items-center gap-4">
            <div className="flex h-18 w-18 items-center justify-center rounded-full border border-white/10 bg-white/5">
              <User className="h-7 w-7 text-white/40" />
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Upload className="h-4 w-4" />
                Enviar foto
              </Button>
              <span className="text-xs text-white/40">PNG ou JPG, até 5MB</span>
            </div>
          </div>

          <div className="space-y-4 border-t border-white/10 pt-6">
            <div className="space-y-2">
              <Label className="text-white/60">Nome completo</Label>
              <Input placeholder="Ex: João Silva" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-white/60">Especialidade</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="classico">Corte clássico</SelectItem>
                    <SelectItem value="barba">Barba</SelectItem>
                    <SelectItem value="degrade">Degradê</SelectItem>
                    <SelectItem value="visagismo">Visagismo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-white/60">Anos de experiência</Label>
                <Input type="number" placeholder="Ex: 5" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white/60">Bio curta</Label>
              <Textarea
                rows={3}
                placeholder="Conte um pouco sobre seu estilo e experiência..."
                className="resize-none"
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="justify-end gap-3 border-t border-white/10 pt-5">
          <Button variant="ghost">Voltar</Button>
          <Button className="gap-2">
            Continuar
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default CadastroBarbeiro
