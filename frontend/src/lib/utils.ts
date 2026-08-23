import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(priceInCents: number) {
  return (priceInCents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}
