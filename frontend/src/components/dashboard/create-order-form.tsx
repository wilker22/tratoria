"use client"

import { FormEvent, useMemo, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { createAndSendOrderAction } from "@/actions/orders_"
import { useRouter } from "next/navigation"
import { Product } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"

interface CreateOrderFormProps {
  products: Product[]
}

interface CartItem {
  product: Product
  amount: number
}

export function CreateOrderForm({ products }: CreateOrderFormProps) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [productId, setProductId] = useState<string | null>(null)
  const [amount, setAmount] = useState(1)
  const [items, setItems] = useState<CartItem[]>([])
  const router = useRouter()

  const productItems = products.map((product) => ({
    value: product.id,
    label: product.name,
  }))

  const selectedProduct = products.find((product) => product.id === productId)
  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.amount * item.product.price, 0),
    [items]
  )

  function resetForm() {
    setError("")
    setProductId(null)
    setAmount(1)
    setItems([])
  }

  function handleAddItem() {
    setError("")

    if (!selectedProduct) {
      setError("Selecione um produto.")
      return
    }

    if (!Number.isInteger(amount) || amount <= 0) {
      setError("Informe uma quantidade válida.")
      return
    }

    setItems((current) => {
      const existing = current.find((item) => item.product.id === selectedProduct.id)

      if (existing) {
        return current.map((item) =>
          item.product.id === selectedProduct.id
            ? { ...item, amount: item.amount + amount }
            : item
        )
      }

      return [...current, { product: selectedProduct, amount }]
    })

    setProductId(null)
    setAmount(1)
  }

  function handleRemoveItem(productIdToRemove: string) {
    setItems((current) => current.filter((item) => item.product.id !== productIdToRemove))
  }

  async function handleSendOrder(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")

    const formData = new FormData(e.currentTarget)
    const table = Number(formData.get("table"))
    const name = String(formData.get("name") ?? "").trim()

    if (items.length === 0) {
      setError("Adicione pelo menos um produto ao pedido.")
      return
    }

    setIsSubmitting(true)

    const result = await createAndSendOrderAction({
      table,
      name,
      items: items.map((item) => ({
        product_id: item.product.id,
        amount: item.amount,
      })),
    })

    setIsSubmitting(false)

    if (result.success) {
      setOpen(false)
      resetForm()
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
        if (!nextOpen) {
          resetForm()
        }
      }}
    >
      <DialogTrigger
        render={
          <Button className="bg-brand-primary hover:bg-brand-primary">
            <Plus className="mr-2 h-5 w-5" />
            Novo Pedido
          </Button>
        }
      />

      <DialogContent className="bg-app-card p-6 font-mono text-white sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Abrir pedido</DialogTitle>
          <DialogDescription>
            Informe a mesa, adicione os produtos e envie para a cozinha.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSendOrder}>
          <div>
            <Label className="mb-2" htmlFor="table">
              Mesa
            </Label>
            <Input
              id="table"
              name="table"
              type="number"
              min={1}
              step={1}
              required
              placeholder="5"
              className="border-app-border bg-app-background text-white"
            />
          </div>

          <div>
            <Label className="mb-2" htmlFor="name">
              Nome do cliente (opcional)
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="João"
              className="border-app-border bg-app-background text-white"
            />
          </div>

          <div className="space-y-3 rounded-lg border border-app-border p-3">
            <p className="text-sm font-medium">Itens do pedido</p>

            <div>
              <Label className="mb-2">Produto</Label>
              <Select
                items={productItems}
                value={productId}
                onValueChange={setProductId}
              >
                <SelectTrigger className="w-full border-app-border bg-app-background text-white">
                  <SelectValue placeholder="Selecione um produto" />
                </SelectTrigger>
                <SelectContent className="bg-app-card text-white border-app-border">
                  {products.map((product) => (
                    <SelectItem
                      key={product.id}
                      value={product.id}
                      className="hover:bg-transparent cursor-pointer"
                    >
                      {product.name} · {formatCurrency(product.price)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedProduct && (
              <p className="text-xs text-gray-300">
                Valor unitário: {formatCurrency(selectedProduct.price)}
              </p>
            )}

            <div>
              <Label className="mb-2" htmlFor="amount">
                Quantidade
              </Label>
              <Input
                id="amount"
                type="number"
                min={1}
                step={1}
                value={amount}
                onChange={(event) => setAmount(Number(event.target.value))}
                className="border-app-border bg-app-background text-white"
              />
            </div>

            <Button
              type="button"
              variant="outline"
              disabled={products.length === 0}
              onClick={handleAddItem}
              className="w-full border-app-border bg-app-background text-white hover:bg-app-background"
            >
              Adicionar item
            </Button>

            {items.length === 0 ? (
              <p className="text-sm text-gray-300">Nenhum produto adicionado.</p>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center justify-between gap-3 border-b border-app-border pb-3"
                  >
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-xs text-gray-300">
                        {item.amount}x {formatCurrency(item.product.price)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm">
                        {formatCurrency(item.amount * item.product.price)}
                      </p>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon-sm"
                        onClick={() => handleRemoveItem(item.product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <span className="font-semibold">Total</span>
              <span className="font-semibold">{formatCurrency(total)}</span>
            </div>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-primary text-white hover:bg-brand-primary"
          >
            {isSubmitting ? "Enviando..." : "Enviar para a cozinha"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
