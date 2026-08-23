import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Order, OrderItem } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(priceInCents: number) {
  return (priceInCents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}

export type OrderLifecycleStatus = "draft" | "kitchen" | "finished"

export function getOrderLifecycleStatus(order: Pick<Order, "draft" | "status">): OrderLifecycleStatus {
  if (order.status) {
    return "finished"
  }

  if (!order.draft) {
    return "kitchen"
  }

  return "draft"
}

export function getOrderTotal(items: OrderItem[]) {
  return items.reduce((sum, item) => sum + item.amount * item.product.price, 0)
}
