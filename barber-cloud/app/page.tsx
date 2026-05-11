import Image from "next/image";
import { Button } from "@/app/_components/ui/button";
import { text } from "stream/consumers";
import Header from "./_components/header";  
import { Input } from "./_components/ui/input";
import { Search, SearchIcon } from "lucide-react";




export default function Home() {
  return (
    <div>
      <Header />
      <div className="p-6">
        <h2 className="text-xl font-bold">Olá, Kaio!</h2>
        <p>Segunda-feira, 12 de junho</p>


        <div className="flex items-center gap-2 mt-6">
          <Input placeholder="Pesquisar..." className="h-10" />
          <Button size="icon" variant="outline" className="h-10 w-10">
            <SearchIcon />
          </Button>
        </div>
        
        <div className="relative w-full mt-6 h-[150px] rounded-xl">
          <Image src="/Banner-01.png" alt="Banner-barberCloud" fill className="object-cover" />
        </div>
      </div>
      
    </div>
  );
}
