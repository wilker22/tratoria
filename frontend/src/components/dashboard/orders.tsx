
"use client"
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Order } from "@/lib/types";
import { EyeIcon, RefreshCcw, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { formatPrice } from "@/lib/format";

interface OrdersProps{
    token: string;
}

export function Orders({ token } : OrdersProps) {
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState<Order[]>([]);

    const fetchOrders = async () => {
        try{
            const response = await apiClient<Order[]>("/orders?draft=false", {
                method: "GET",
                cache: "no-store",
                token: token,
            });
            setOrders(response);
            setLoading(false);
        }catch(err){
            setLoading(false);
            console.log(err);
        }
    };

    useEffect(() => {
        async function loadOrders(){
            await fetchOrders()
        }
        loadOrders();
    }, [])

    const calculateOrderTotal = (order: Order) => {
        if(!order.items) return 0;
        return order.items.reduce((total, item) => {
            return total + item.product.price * item.amount
        }, 0)
    }

    return (
        <div className="space-y-4 sm:space-y-6 font-mono">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">Pedidos</h1>
                    <p className="text-xs sm:text-base mt-1">
                        Pedidos enviados para a cozinha
                    </p>
                </div>
                <Button className=" bg-brand-primary text-white hover:bg-brand-primary">
                    <RefreshCcw className="w-5 h-5"/>
                </Button>
            </div>

            {loading ? (
                <div>
                    <p>Carregando pedidos...</p>
                </div>
            ) : orders.length === 0 ? (
                <div>
                    <p>Nenhum pedido cadastrado...</p>
                </div>
            ) : (
                <div className="grid gap-4 sm:gri-cols-2 lg:grid-cols-3">
                    {orders.map( order => (
                        <Card 
                            className="bg-app-card border-app-border text-white"
                            key={order.id}>

                            <CardHeader>
                                    <div className="flex items-center justify-between gap-2">
                                            <CardTitle className="text-lg lg:text-xl font-bold">
                                                Mesa {order.table}
                                            </CardTitle>
                                            <Badge variant="secondary" className="text-xs select-none">
                                                preparando...
                                            </Badge>
                                    </div>
                            </CardHeader>


                            <CardContent className="space-y-3 sm:space-y-4 mt-auto">
                                <div>
                                    {order.items && order.items.length > 0 && (
                                        <div className="space-y-1">
                                            {order.items.slice(0, 2).map( item => (
                                                <p key={item.id} className="text-xs sm-text-sm text-gray-300 truncate">
                                                 - {item.amount}x   {item.product.name}
                                                </p>
                                                
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col xl:flex-row items-center justifyy-between pt-4 border-t border-app-border">
                                    <div className="self-start">
                                        <p className="text-sm md:text-base text-gray-400">Total</p>
                                        <p className="text-base font-bold text-brand-primary">{formatPrice(calculateOrderTotal(order))}</p>
                                    </div>
                                    
                                    <Button size="sm" className="bg-brand-primary hover:bg-brand-primary w-full xl:w-auto">
                                        <EyeIcon className="w-5 h-5" />
                                    </Button>
                                </div>
                            </CardContent>

                        </Card>
                    ))}
                </div>
            )}
          </div>
    );
}
