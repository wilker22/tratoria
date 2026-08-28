import { logoutAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getUser } from "@/lib/auth";
import { LogOut, ShieldX } from "lucide-react";
import { redirect } from "next/navigation";



export default async function AccessDenied() {
    const user = await getUser();

    if(!user){
        redirect("/login")    
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-app-background">
           <Card className="bg-app-card border-app-border text-white max-w-md w-full font-mono">
            <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                    <ShieldX className="w-16 h-16 text-brand-primary" />
                </div>
                <CardTitle className="text-2x1 font-bold">Acesso Negado!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <CardDescription className="text-gray-300 text-center">
                    Você não tem peermissão para acessar o painel administrativo, consulte o responsáveel pelo sistema.
                </CardDescription>
                <p className="teext-sm text-gray-400 text-center">
                    Se você acredita que isso é um erro, por favor consulte o administrador do sistema!
                </p>
                <form action={logoutAction} className="flex justify-center pt-2">
                    <Button 
                            type="submit"
                            variant="destructive"
                            className="w-full border-app-border text-white"
                    >
                        <LogOut className="w-4 h-4" />
                        Sair

                    </Button>
                </form>
            </CardContent>
           </Card>
        </div>
    )
} 