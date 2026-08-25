import { apiClient } from "@/lib/api";
import { Order } from "@/lib/types";
import { useEffect, useState } from "react";

interface OrderModalProps{
    orderId: string | null;
    onClose: () => Promise<void>;
    token: string;
}


export default function OrderModal({orderId, token, onClose} : OrderModalProps) {

    const [order, setOrder] = useState<Order | null>(null)
    const [loading, setLoading] = useState(true);
    
      const fetchOrder = async () => {
           if(!orderId) {
            setOrder(null);
            return;
           };

           try{
                setLoading(true);
                const response = apiClient<Order>(`/order/detail?order_id=${orderId}`,
                {
                    method: "GET",
                    token: token,
                });

                console.log(response)//retorno do detalhe da order
                setLoading(false);
           }catch(err){
             setLoading(false)
             console.log(err)
           }
        };
    
        useEffect(() => {
            async function loadOrders(){
                await fetchOrder()
            }
            loadOrders();
        }, [orderId])
    
       
    return (
        <div>
            
        </div>
    )
}