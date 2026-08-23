import { cn, getOrderLifecycleStatus } from "@/lib/utils"
import { Order } from "@/lib/types"

const statusStyles = {
  draft: "bg-gray-600 text-white",
  kitchen: "bg-amber-500 text-black",
  finished: "bg-emerald-600 text-white",
}

const statusLabels = {
  draft: "Rascunho",
  kitchen: "Na cozinha",
  finished: "Finalizado",
}

export function OrderStatusBadge({ order }: { order: Pick<Order, "draft" | "status"> }) {
  const status = getOrderLifecycleStatus(order)

  return (
    <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", statusStyles[status])}>
      {statusLabels[status]}
    </span>
  )
}
