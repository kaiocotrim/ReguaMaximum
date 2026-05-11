import Image from "next/image";
import { Button } from "@/app/_components/ui/button";
import { text } from "stream/consumers";
import Header from "./_components/header";  
import { Input } from "./_components/ui/input";
import { Search, SearchIcon } from "lucide-react";
import { Card, CardContent } from "./_components/ui/card";
import { Badge } from "./_components/ui/badge";
import { Avatar, AvatarGroupCount, AvatarImage } from "./_components/ui/avatar";




export default function Home() {
  return (
    <div>
      <Header />
      <div className="p-6">
        <h2 className="text-xl font-bold">Olá, Kaio!</h2>
        <p>Segunda-feira, 12 de junho</p>

        {/* Search Bar */}
        <div className="flex items-center gap-2 mt-6">
          <Input placeholder="Pesquisar..." className="h-10" />
       <Button size="icon" variant="outline" className="!bg-blue-800 h-10 w-10">
  <SearchIcon />
</Button>
        </div>
        
        {/* Banner Image */}
        <div className="relative w-full mt-6 h-[150px] rounded-xl">
          <Image src="/Banner-01.png" alt="Banner-barberCloud" fill className="object-cover" />
        </div>
      </div>


      {/* Agendamento section */}
      <Card className="mt-6">
        <CardContent className="flex justify-between p-0 ">
        {/* DIV esquerda  */}
        <div className="flex flex-col gap-2 py-5 pl-5 ">
          <Badge variant="outline" className="bg-blue-800">Confirmado</Badge>
          <h3>Corte de cabelo</h3>
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6">
              <AvatarImage src="https://utfs.io/f/c97a2dc9-cf62-468b-a851-bfd2bdde775f-16p.png" alt="Avatar do cliente" />
            </Avatar>
            <p className="text-sm">Las Vegas Barbearia</p>
          </div>
        </div>
        {/* DIV direita  */}
        <div className="flex flex-col items-center justify-center px-4 border-l-2 border-solid px-5">
        <p className="text-sm">Maio</p>
        <p className="text-2xl">12</p>
        <p className="text-sm">16:00</p>
        </div>
        </CardContent>
      </Card>
    </div>
  );
}
