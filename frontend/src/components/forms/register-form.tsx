import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function RegisterForm() {
    return(
        <div  className="font-mono">
            <Card className="bg-app-card border border-app-border w-full max-w-md mx-auto">
                <CardHeader>
                    <CardTitle className="text-white text-center text-3xl sm:text-4xl font-bold">
                        WJ<span className="text-brand-primary">Pizza</span> 
                    </CardTitle>
                    
                    <CardDescription>Registre-se</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action="" className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-white">Nome</Label>
                            <Input type="text" id="name" required minLength={3} className="text-white bg-app-card border border-app-border"  placeholder="Digite seu nome"></Input>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-white">E-mail</Label>
                            <Input type="text" id="email" required  className="text-white bg-app-card border border-app-border"  placeholder="Digite seu e-mail"></Input>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-white">Senha</Label>
                            <Input type="text" id="password" required className="text-white bg-app-card border border-app-border"  placeholder="Digite a senha"></Input>
                        </div>

                        <Button type="submit" className="w-full bg-brand-primary text-white hover:bg-brand-primary">Registrar</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}