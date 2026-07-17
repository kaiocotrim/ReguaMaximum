import { Card, CardContent, CardHeader, CardTitle } from "@/app/_components/ui/card";

const ConfiguracoesPage = () => {
    return (
        <div className="p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Configurações da Barbearia</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Conteúdo das configurações aqui...</p>
                </CardContent>
            </Card>
        </div>
    );
};

export default ConfiguracoesPage;