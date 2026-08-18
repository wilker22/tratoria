"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useActionState, useEffect } from "react";
import { loginAction, registerAction} from "@/actions/auth";
import { redirect, useRouter } from "next/navigation";

export function LoginForm() {
    const [state, formAction, isPending] = useActionState(loginAction, null);
    const router = useRouter();

    useEffect(() => {
        if(state?.success && state.redirectTo){
            router.replace(state?.redirectTo)
        }
    }, [state, router])


    return(
        <div  className="font-mono">
            <Card className="bg-app-card border border-app-border w-full max-w-md mx-auto">
                <CardHeader>
                    <CardTitle className="text-white text-center text-3xl sm:text-4xl font-bold">
                        WJ<span className="text-brand-primary">Pizza</span> 
                    </CardTitle>
                    
                    <CardDescription>Login</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-4">
                        
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-white">E-mail</Label>
                            <Input type="text" id="email" name="email" required  className="text-white bg-app-card border border-app-border"  placeholder="Digite seu e-mail"></Input>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-white">Senha</Label>
                            <Input type="password" id="password" name="password" required className="text-white bg-app-card border border-app-border"  placeholder="Digite a senha"></Input>
                        </div>

                        <Button type="submit" className="w-full bg-brand-primary text-white hover:bg-brand-primary">
                            { isPending ? "Acessando a conta..." : "Logar"}
                        </Button>
                        <p className="text-center text-sm text-gray-100">
                            Ainda não possui uma conta? <Link href="/register" className="text-brand-primary font-semibold">Criar Conta</Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}