"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { deleteProductAction } from "@/actions/products"
import { useRouter } from "next/navigation"

interface DeleteProductButtonProps {
  productId: string
}

export function DeleteProductButton({ productId }: DeleteProductButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    const confirmed = window.confirm("Deseja arquivar este produto?")

    if (!confirmed) {
      return
    }

    setIsDeleting(true)
    const result = await deleteProductAction(productId)
    setIsDeleting(false)

    if (result.success) {
      router.refresh()
    }
  }

  return (
    <Button
      type="button"
      variant="destructive"
      size="sm"
      disabled={isDeleting}
      onClick={handleDelete}
      className="w-full"
    >
      <Trash2 className="h-4 w-4" />
      {isDeleting ? "Excluindo..." : "Excluir"}
    </Button>
  )
}
