"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { SearchIcon } from "lucide-react"
import { useRouter } from "next/navigation"


const SearchBar = () => { 
  const [search, setSearch] = useState("")
  

  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault()
    router.push(`/barbershops?search=${search}`)
  }

  return (
    <form className="flex items-center gap-2">
      <Input
        placeholder="Pesquisar..."
        className="h-10"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Button
        type="submit"
        onClick={handleSubmit}
        size="icon"
        variant="outline"
        className="h-10 w-10 shrink-0 bg-green-6
        00 cursor-pointer"
      >
        <SearchIcon className="text-[#C3F32C]" />
      </Button>
    </form>
  )
}

export default SearchBar
