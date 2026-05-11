import Image from "next/image";
import { Button } from "@/app/_components/ui/button";
import { text } from "stream/consumers";
import Header from "./_components/header";  
import { Input } from "./_components/ui/input";
import { AwardIcon, Search, SearchIcon } from "lucide-react";
import { Card, CardContent } from "./_components/ui/card";
import { Badge } from "./_components/ui/badge";
import { Avatar, AvatarGroupCount, AvatarImage } from "./_components/ui/avatar";
import { db } from "./_lib/prisma";




export default async function Home() {


     
  return (
    <div>
      <Header />

      <div className="px-6 py-6 space-y-6">
        {/* Saudação */}
        <div className="space-y-1">
          <h2 className="text-xl font-bold">Olá, Kaio! 💈</h2>
          <p className="text-sm text-gray-500">Segunda-feira, 12 de junho</p>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-2">
          <Input placeholder="Pesquisar..." className="h-10" />
          <Button
            size="icon"
            variant="outline"
            className="!bg-blue-800 h-10 w-10 shrink-0"
          >
            <SearchIcon className="text-white" />
          </Button>
        </div>

        {/* Banner Image */}
        <div className="relative w-full h-[150px] rounded-xl overflow-hidden">
          <Image
            src="/Banner-01.png"
            alt="Banner-barberCloud"
            fill
            className="object-cover"
          />
        </div>

        {/* Agendamentos */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase text-gray-400">
            Agendamentos
          </h2>

          <Card>
            <CardContent className="flex justify-between p-0">
              {/* DIV esquerda */}
              <div className="flex flex-col gap-2 py-5 pl-5">
                <Badge variant="outline" className="bg-blue-800 w-fit">
                  Confirmado
                </Badge>
                <h3 className="font-semibold">Corte de cabelo</h3>
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage
                      src="https://utfs.io/f/c97a2dc9-cf62-468b-a851-bfd2bdde775f-16p.png"
                      alt="Avatar do cliente"
                    />
                  </Avatar>
                  <p className="text-sm">Las Vegas Barbearia</p>
                </div>
              </div>

              {/* DIV direita */}
              <div className="flex flex-col items-center justify-center px-5 border-l-2 border-solid">
                <p className="text-sm">Maio</p>
                <p className="text-2xl">12</p>
                <p className="text-sm">16:00</p>
              </div>
            </CardContent>
          </Card>
           <h2 className="text-xs font-bold uppercase text-gray-400">
            Agendamentos
          </h2>

        </div>
      </div>
    </div>
  );
}
