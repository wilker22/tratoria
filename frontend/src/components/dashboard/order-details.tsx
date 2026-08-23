"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Order } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"
import { finishOrderAction } from "@/actions/orders"
import { useRouter } from "next/navigation"

interface OrderDetailsProps {
  order: Order
}

export function OrderDetails({ order }: OrderDetailsProps) {
  const [open, setOpen] = useState(false)
  const [isFinishing, setIsFinishing] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const total = order.items.reduce(
    (sum, item) => sum + item.amount * item.product.price,
    0
  )

  async function handleFinishOrder() {
    setError("")
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="w-full bg-brand-primary hover:bg-brand-primary">
            Ver detalhes
          </Button>
        }
      />

      <DialogContent className="bg-app-card p-6 font-mono text-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Mesa {order.table}</DialogTitle>
          <DialogDescription>
            {order.name ? `Cliente: ${order.name}` : "Pedido enviado para a cozinha"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
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
                <p className="text-sm">
                  {formatCurrency(item.amount * item.product.price)}
                </p>
              </div>
            ))
          )}

          <div className="flex items-center justify-between pt-2">
            <span className="font-semibold">Total</span>
            <span className="font-semibold">{formatCurrency(total)}</span>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <Button
            type="button"
            disabled={isFinishing}
            onClick={handleFinishOrder}
            className="w-full bg-brand-primary text-white hover:bg-brand-primary"
          >
            {isFinishing ? "Finalizando..." : "Concluir pedido"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
