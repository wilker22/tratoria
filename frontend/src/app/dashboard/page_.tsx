

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Order } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";
import { OrderDetails } from "@/components/dashboard/order-details";

export default async function Dashboard() {
    const token = await getToken();
    const orders = await apiClient<Order[]>("/orders?draft=false", {
        token: token!,
    });

    const kitchenOrders = orders.filter((order) => !order.status);

    return (
        <div className="space-y-4 sm:space-y-6 font-mono">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">Pedidos</h1>
                    <p className="text-xs sm:text-base mt-1">
                        Pedidos enviados para a cozinha
                    </p>
                </div>
            </div>

            {kitchenOrders.length === 0 ? (
                <Card className="bg-app-card border-app-border text-white">
                    <CardContent className="flex flex-col items-center justify-center gap-2 py-10">
                        <ShoppingCart className="h-8 w-8 text-gray-400" />
                        <p className="text-sm text-gray-300">
                            Nenhum pedido na fila da cozinha.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {kitchenOrders.map((order) => {
                        const total = order.items.reduce(
                            (sum, item) => sum + item.amount * item.product.price,
                            0
                        );

                        return (
                            <Card
                                key={order.id}
                                className="bg-app-card border-app-border transition-shadow hover:shadow-md text-white"
                            >
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                                        <ShoppingCart className="w-5 h-5" />
                                        <span>Mesa {order.table}</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <p className="text-sm text-gray-200">
                                        {order.name || "Cliente não informado"}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {order.items.length} {order.items.length === 1 ? "item" : "itens"} · {formatCurrency(total)}
                                    </p>
                                    <OrderDetails order={order} />
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
