"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useActionState } from "react";
import { registerAction} from "@/actions/auth";

export function RegisterForm() {
    const [state, formAction, isPending] = useActionState(registerAction, null);


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
                    <form action={formAction} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-white">Nome</Label>
                            <Input type="text" id="name" name="name" required minLength={3} className="text-white bg-app-card border border-app-border"  placeholder="Digite seu nome"></Input>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-white">E-mail</Label>
                            <Input type="text" id="email" name="email" required  className="text-white bg-app-card border border-app-border"  placeholder="Digite seu e-mail"></Input>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-white">Senha</Label>
                            <Input type="text" id="password" name="password" required className="text-white bg-app-card border border-app-border"  placeholder="Digite a senha"></Input>
                        </div>

                        <Button type="submit" className="w-full bg-brand-primary text-white hover:bg-brand-primary">
                            { isPending ? "Cadastrando nova conta..." : "Criar Conta"}
                        </Button>
                        <p className="text-center text-sm text-gray-100">
                            Já tem uma conta? <Link href="/login" className="text-brand-primary font-semibold">faça o login</Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}