"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { createCategoryAction } from "@/actions/categories";

export function CategoryForm()  {
    
    const [open, setOpen] = useState(false);
    
    return(
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-brand-primary hover:bg-brand-primary">
                    <Plus className="h-5 w-5 mr-2" />
                        Nova Categoria    
                      
                </Button>
            </DialogTrigger>

            <DialogContent className="font-mono p-6 bg-app-card text-white">
                <DialogHeader>
                    <DialogTitle>
                        Cadastro de Categoria
                    </DialogTitle>
                    <DialogDescription>
                        
                    </DialogDescription>
                </DialogHeader>

                <form className="space-y-4" action={createCategoryAction}>
                    <div>
                        <Label className="mb-2" htmlFor="category">Nome</Label>
                        <Input id="name" name="name" required placeholder="nome da categoria" className="border-app-border bg-app-background text-white"></Input>
                    </div>
                    <Button type="submit" className="w-full bg-brand-primary text-white hover:bg-brand-primary">
                        Cadastrar
                    </Button>
                </form>
            </DialogContent>
        </Dialog>

    )   
}