import { MenuIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";

const Header = () => {
    return (  
        <Card className="rounded-none bg-black opacity-100 ">
            <CardContent className="flex flex-row items-center justify-between">
                <Image src="/logoNuvem.png" alt="BarberCloud Logo" width={70} height={50} />
                     <Button size="icon" variant="outline" className=" h-10 w-10 shrink-0">
                <MenuIcon />
            </Button>
            </CardContent>
        </Card>
    );
}
 
export default Header;