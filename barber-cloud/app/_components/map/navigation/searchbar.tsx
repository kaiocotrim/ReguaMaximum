"use client";

import { Search } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface SearchBarProps {
  busca: string;
  setBusca: (valor: string) => void;
  userProfilePic: string;
}

export default function SearchBar({ busca, setBusca, userProfilePic }: SearchBarProps) {
  return (
    <div className="top-search-wrapper flex items-center gap-3">
      {/* Search field */}
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-white/30 pointer-events-none" />
        <input
          type="text"
          placeholder="Buscar filiais, serviços..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="
            w-full h-11 pl-10 pr-4
            bg-white/[0.06]
            border border-white/[0.08]
            text-white/90 text-[15px] font-light tracking-[-0.01em]
            placeholder:text-white/25
            rounded-2xl
            backdrop-blur-xl
            outline-none
            transition-all duration-200 ease-out
            focus:bg-white/[0.09] focus:border-white/[0.15] focus:ring-0
          "
        />
      </div>

      {/* Avatar */}
      <Avatar className="h-11 w-11 shrink-0 rounded-full ring-1 ring-white/[0.08]">
        <AvatarImage src={userProfilePic} alt="Perfil" className="object-cover" />
        <AvatarFallback className="bg-white/[0.06] text-white/40 text-[13px] font-medium">
          BD
        </AvatarFallback>
      </Avatar>
    </div>
  );
}