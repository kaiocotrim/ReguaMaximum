import { Card, CardContent, CardHeader, CardTitle } from "@/app/_components/ui/card";

const PerfilBarber = () => {
    return (
        <div className="p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Perfil</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Conteúdo do perfil aqui...</p>
                </CardContent>
            </Card>
        </div>
    );
}

export default PerfilBarber;