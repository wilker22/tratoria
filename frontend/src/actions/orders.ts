"use server";

import { apiClient } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Order } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function finishOrderAction(orderId: string) {
    try {
        const token = await getToken();

        if (!token) {
            return { success: false, error: "token não fornecido!" };
        }

        await apiClient<Order>("/order/finish", {
            method: "PUT",
            body: JSON.stringify({ order_id: orderId }),
            token,
        });

        revalidatePath("/dashboard");

        return { success: true, error: "" };
    } catch (error) {
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }

        return { success: false, error: "Erro ao finalizar pedido!" };
    }
}
