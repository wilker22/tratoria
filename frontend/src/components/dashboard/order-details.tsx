"use client"

import { FormEvent, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Order, Product } from "@/lib/types"
import { formatCurrency, getOrderLifecycleStatus, getOrderTotal } from "@/lib/utils"
import {
  addOrderItemAction,
  deleteOrderAction,
  finishOrderAction,
  removeOrderItemAction,
  sendOrderAction,
} from "@/actions/orders"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
import { OrderStatusBadge } from "./order-status-badge"

interface OrderDetailsProps {
  order: Order
  products?: Product[]
}

export function OrderDetails({ order, products = [] }: OrderDetailsProps) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState("")
  const [productId, setProductId] = useState<string | null>(null)
  const [customerName, setCustomerName] = useState(order.name ?? "")
  const [isAdding, setIsAdding] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [isFinishing, setIsFinishing] = useState(false)
  const [removingItemId, setRemovingItemId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const status = getOrderLifecycleStatus(order)
  const total = getOrderTotal(order.items)
  const productItems = products.map((product) => ({
    value: product.id,
    label: product.name,
  }))

  const triggerLabel = {
    draft: "Montar pedido",
    kitchen: "Ver detalhes",
    finished: "Ver detalhes",
  }[status]

  function resetFeedback() {
    setError("")
  }

  async function handleAddItem(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    resetFeedback()

    if (!productId) {
      setError("Selecione um produto.")
      return
    }

    const form = e.currentTarget
    setIsAdding(true)

    const formData = new FormData(form)
    formData.set("order_id", order.id)
    formData.set("product_id", productId)

    const result = await addOrderItemAction(formData)

    setIsAdding(false)

    if (result.success) {
      setProductId(null)
      form.reset()
      router.refresh()
      return
    }

    setError(result.error)
  }

  async function handleRemoveItem(itemId: string) {
    resetFeedback()
    setRemovingItemId(itemId)

    const result = await removeOrderItemAction(itemId)

    setRemovingItemId(null)

    if (result.success) {
      router.refresh()
      return
    }

    setError(result.error)
  }

  async function handleSendOrder() {
    resetFeedback()

    if (order.items.length === 0) {
      setError("Adicione pelo menos um item antes de enviar para a cozinha.")
      return
    }

    setIsSending(true)

    const result = await sendOrderAction(
      order.id,
      customerName.trim() || order.name || `Mesa ${order.table}`
    )

    setIsSending(false)

    if (result.success) {
      setOpen(false)
      router.refresh()
      return
    }

    setError(result.error)
  }

  async function handleFinishOrder() {
    resetFeedback()
    setIsFinishing(true)

    const result = await finishOrderAction(order.id)

    setIsFinishing(false)

    if (result.success) {
      setOpen(false)
      router.refresh()
      return
    }

    setError(result.error)
  }

  async function handleDeleteOrder() {
    const confirmed = window.confirm("Deseja cancelar este pedido?")

    if (!confirmed) {
      return
    }

    resetFeedback()
    setIsDeleting(true)

    const result = await deleteOrderAction(order.id)

    setIsDeleting(false)

    if (result.success) {
      setOpen(false)
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
        setProductId(null)
        setCustomerName(order.name ?? "")
      }}
    >
      <DialogTrigger
        render={
          <Button className="w-full bg-brand-primary hover:bg-brand-primary">
            {triggerLabel}
          </Button>
        }
      />

      <DialogContent className="bg-app-card p-6 font-mono text-white sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between gap-3 pr-8">
            <DialogTitle>Mesa {order.table}</DialogTitle>
            <OrderStatusBadge order={order} />
          </div>
          <DialogDescription>
            {order.name ? `Cliente: ${order.name}` : "Pedido da mesa"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {order.items.length === 0 ? (
            <p className="text-sm text-gray-300">Nenhum item neste pedido.</p>
          ) : (
            order.items.map((item) => (
              <div
                key={item.id}
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
                  {status === "draft" && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon-sm"
                      disabled={removingItemId === item.id}
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}

          <div className="flex items-center justify-between pt-1">
            <span className="font-semibold">Total</span>
            <span className="font-semibold">{formatCurrency(total)}</span>
          </div>

          {status === "draft" && (
            <>
              <form className="space-y-3 rounded-lg border border-app-border p-3" onSubmit={handleAddItem}>
                <p className="text-sm font-medium">Adicionar item</p>

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

                <div>
                  <Label className="mb-2" htmlFor={`amount-${order.id}`}>
                    Quantidade
                  </Label>
                  <Input
                    id={`amount-${order.id}`}
                    name="amount"
                    type="number"
                    min={1}
                    step={1}
                    defaultValue={1}
                    required
                    className="border-app-border bg-app-background text-white"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isAdding || products.length === 0}
                  className="w-full bg-brand-primary text-white hover:bg-brand-primary"
                >
                  {isAdding ? "Adicionando..." : "Adicionar item"}
                </Button>
              </form>

              <div>
                <Label className="mb-2" htmlFor={`customer-${order.id}`}>
                  Nome do cliente
                </Label>
                <Input
                  id={`customer-${order.id}`}
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  placeholder="Nome para enviar à cozinha"
                  className="border-app-border bg-app-background text-white"
                />
              </div>

              <Button
                type="button"
                disabled={isSending}
                onClick={handleSendOrder}
                className="w-full bg-brand-primary text-white hover:bg-brand-primary"
              >
                {isSending ? "Enviando..." : "Enviar para a cozinha"}
              </Button>

              <Button
                type="button"
                variant="destructive"
                disabled={isDeleting}
                onClick={handleDeleteOrder}
                className="w-full"
              >
                {isDeleting ? "Cancelando..." : "Cancelar pedido"}
              </Button>
            </>
          )}

          {status === "kitchen" && (
            <Button
              type="button"
              disabled={isFinishing}
              onClick={handleFinishOrder}
              className="w-full bg-brand-primary text-white hover:bg-brand-primary"
            >
              {isFinishing ? "Finalizando..." : "Concluir pedido"}
            </Button>
          )}

          {error && <p className="text-sm text-red-400">{error}</p>}
        </div>
      </DialogContent>
    </Dialog>
  )
}
