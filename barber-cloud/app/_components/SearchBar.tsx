import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { SearchIcon } from "lucide-react"


const SearchBar = () => {
  return (
    <div className="flex items-center gap-2">
      <Input placeholder="Pesquisar..." className="h-10" />
      <Button
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

