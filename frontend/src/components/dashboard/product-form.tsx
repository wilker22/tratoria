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
import { Plus, Upload } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import Image from "next/image"

interface ProductFormProps {
  categories: Category[]
}

export function ProductForm({ categories }: ProductFormProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const categoryItems = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }))
  const [categoryId, setCategoryId]     = useState<string | null>(null)
  const [error, setError]               = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile]       = useState<File | null>(null)
  
  

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

  function handleImageChange(e:React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if(file){
      if(file.size > 5 * 1024 * 1024 ){
        return;
      }
     
      setImageFile(file)
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }

      reader.readAsDataURL(file);
    }
  }

  function clearImage() {
    setImageFile(null);
    setImagePreview(null);
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
           {/** <Select value={categoryId} onValueChange={setCategoryId}>*/} 
              <Select
                items={categoryItems}
                value={categoryId}
                onValueChange={setCategoryId}
              >
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

          <div className="space-y-2">
            <Label className="mb-2" htmlFor="file">
              Imagem
            </Label>
           
           {imagePreview ? (
            <div className="relative w-full h-48 border rounded-lg overflow-hidden">
              <Image
                  src={imagePreview}
                  alt="preview da imagem"
                  fill
                  className="object-cover z-10"
                />

                <Button
                  type="button"
                  variant="destructive"
                  onClick={clearImage}
                  className="absolute top-2 right-2 z-20 bg-brand-primary text-white hover:text-black"
                >
                Excluir
              </Button>
            </div>
           ) : (
            <div className="border-2 border-dashed rounded-md p-8 flex flex-col items-center justify-center">
              <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <Label htmlFor="file">
                Selecione uma imagem...
              </Label>
              <Input
                id="file"
                name="file"
                type="file"
                accept="image/jpeg, image/jpg, image/png"
                onChange={handleImageChange}
                required
                className="hidden"
              >
              </Input>
            </div>

           )}
           
           
           {/** <Input
              id="file"
              name="file"
              type="file"
              accept="image/*"
              required
              className="border-app-border bg-app-background text-white file:text-white"
            /> */}



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
