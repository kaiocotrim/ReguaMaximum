import { Card } from "@/app/_components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/_components/ui/avatar";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table";

type StatusBarbeiro = "Cortando cabelo" | "Almoço" | "Pendente";

interface Barbeiro {
  nome: string;
  avatarUrl?: string;
  cortesNoMes: number;
  valorMensal: string;
  status: StatusBarbeiro;
}

const barbeiros: Barbeiro[] = [
  {
    nome: "João Silva",
    avatarUrl: "https://github.com/shadcn.png",
    cortesNoMes: 42,
    valorMensal: "R$ 1.260,00",
    status: "Cortando cabelo",
  },
  {
    nome: "Carlos Souza",
    cortesNoMes: 30,
    valorMensal: "R$ 900,00",
    status: "Almoço",
  },
  {
    nome: "Pedro Lima",
    cortesNoMes: 15,
    valorMensal: "R$ 450,00",
    status: "Pendente",
  },
  {
    nome: "Rafael Costa",
    cortesNoMes: 55,
    valorMensal: "R$ 1.650,00",
    status: "Cortando cabelo",
  },
];

const statusStyles: Record<StatusBarbeiro, string> = {
  "Cortando cabelo": "text-black",
  "Almoço": "bg-orange-100 text-orange-700",
  "Pendente": "bg-gray-100 text-gray-600",
};

const getIniciais = (nome: string) =>
  nome
    .split(" ")
    .map((parte) => parte[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const StatusBadge = ({ status }: { status: StatusBarbeiro }) => {
  const isAtivo = status === "Cortando cabelo";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[status]}`}
      style={isAtivo ? { backgroundColor: "#C3F32C" } : undefined}
    >
      {isAtivo && (
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-black" />
      )}
      {status}
    </span>
  );
};

const AddBarber = () => {
  const totalMensal = barbeiros.reduce((acc, b) => {
    const valorNumerico = Number(
      b.valorMensal.replace(/[^\d,]/g, "").replace(",", "."),
    );
    return acc + valorNumerico;
  }, 0);

  return (
    <Card className="flex flex-col gap-2 rounded-2xl p-6 shadow-sm mt-5 ">
      <h1 className="text-lg font-semibold">Lista de barbeiros</h1>
      <Table>
        <TableCaption>Desempenho dos barbeiros neste mês.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[220px]">Barbeiro</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Cortes no mês</TableHead>
            <TableHead className="text-right">Valor mensal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {barbeiros.map((barbeiro) => (
            <TableRow key={barbeiro.nome}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src={barbeiro.avatarUrl}
                      alt={barbeiro.nome}
                    />
                    <AvatarFallback>
                      {getIniciais(barbeiro.nome)}
                    </AvatarFallback>
                  </Avatar>
                  <span>{barbeiro.nome}</span>
                </div>
              </TableCell>
              <TableCell>
                <StatusBadge status={barbeiro.status} />
              </TableCell>
              <TableCell>{barbeiro.cortesNoMes}</TableCell>
              <TableCell className="text-right">
                {barbeiro.valorMensal}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right text-[#C3F32C]">
              {totalMensal.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </Card>
  );
};

export default AddBarber;