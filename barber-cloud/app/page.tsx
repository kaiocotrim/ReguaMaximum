import Image from "next/image";
import { Button } from "@/app/_components/ui/button";
import { text } from "stream/consumers";



export default function Home() {
  return (
    <div>
      <h1>Welcome to BarberCloud</h1>
            <Button>Get Started</Button>
    </div>
  );
}
