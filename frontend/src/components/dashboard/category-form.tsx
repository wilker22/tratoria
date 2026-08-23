"use client"

import { useState, FormEvent } from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { createCategoryAction } from "@/actions/categories"
import { useRouter } from "next/navigation"

export function CategoryForm() {
  const [open, setOpen] = useState(false)
  const router = useRouter();

  async function handleCreateCategory(
    e: React.SubmitEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget)

    const result = await createCategoryAction(formData)

    if(result.success){
      setOpen(false);
      router.refresh();
      return;
    }else{
      console.log(result.error);
    }

  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="bg-brand-primary hover:bg-brand-primary">
            <Plus className="mr-2 h-5 w-5" />
            Nova Categoria
          </Button>
        }
      />

      <DialogContent className="bg-app-card p-6 font-mono text-white">
        <DialogHeader>
          <DialogTitle>
            Cadastro de Categoria
          </DialogTitle>

          <DialogDescription>
            Cadastrando categoria ...
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={handleCreateCategory}
        >
          <div>
            <Label
              className="mb-2"
              htmlFor="name"
            >
              Nome
            </Label>

            <Input
              id="name"
              name="name"
              required
              placeholder="nome da categoria"
              className="border-app-border bg-app-background text-white"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-brand-primary text-white hover:bg-brand-primary"
          >
            Cadastrar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}