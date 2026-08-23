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
import { Textarea } from "../ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { createProductAction } from "@/actions/products"
import { useRouter } from "next/navigation"
import { Category } from "@/lib/types"

interface ProductFormProps {
  categories: Category[]
}

export function ProductForm({ categories }: ProductFormProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [categoryId, setCategoryId] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  

  async function handleCreateProduct(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")

    if (!categoryId) {
      setError("Selecione uma categoria.")
      return
    }

    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    formData.set("category_id", categoryId)

    const result = await createProductAction(formData)

    setIsSubmitting(false)

    if (result.success) {
      setOpen(false)
      setCategoryId(null)
      router.refresh()
      return
    }

    setError(result.error)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        setError("")
        if (!nextOpen) {
          setCategoryId(null)
        }
      }}
    >
      <DialogTrigger
        render={
          <Button className="bg-brand-primary hover:bg-brand-primary">
            <Plus className="mr-2 h-5 w-5" />
            Novo Produto
          </Button>
        }
      />

      <DialogContent className="bg-app-card p-6 font-mono text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cadastro de Produto</DialogTitle>
          <DialogDescription>Preencha os dados do produto.</DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleCreateProduct}>
          <div>
            <Label className="mb-2" htmlFor="name">
              Nome
            </Label>
            <Input
              id="name"
              name="name"
              required
              placeholder="Pizza Margherita"
              className="border-app-border bg-app-background text-white"
            />
          </div>

          <div>
            <Label className="mb-2" htmlFor="price">
              Preço (R$)
            </Label>
            <Input
              id="price"
              name="price"
              type="number"
              min="0.01"
              step="0.01"
              required
              placeholder="45,00"
              className="border-app-border bg-app-background text-white"
            />
          </div>

          <div>
            <Label className="mb-2">Categoria</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="w-full border-app-border bg-app-background text-white">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent className="bg-app-card text-white border-app-border">
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id} className="hover:bg-transparent cursor-pointer">
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-2" htmlFor="description">
              Descrição
            </Label>
            <Textarea
              id="description"
              name="description"
              required
              placeholder="Molho, mussarela e manjericão"
              className="border-app-border bg-app-background text-white"
            />
          </div>

          <div>
            <Label className="mb-2" htmlFor="file">
              Imagem
            </Label>
            <Input
              id="file"
              name="file"
              type="file"
              accept="image/*"
              required
              className="border-app-border bg-app-background text-white file:text-white"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-primary text-white hover:bg-brand-primary"
          >
            {isSubmitting ? "Cadastrando..." : "Cadastrar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
