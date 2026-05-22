"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { SearchIcon } from "lucide-react"
import { useRouter } from "next/navigation"


const SearchBar = () => {
  const [search, setSearch] = useState("")
  

  const router = useRouter();

  const handleSubmit = () => {
    router.push(`/barbershops?search=${search}`)
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        placeholder="Pesquisar..."
        className="h-10"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Button
        onClick={handleSubmit}
        size="icon"
        variant="outline"
        className="h-10 w-10 shrink-0 bg-green-600"
      >
        <SearchIcon className="text-white" />
      </Button>
    </div>
  )
}

export default SearchBar
