"use server";

import { apiClient } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Order, OrderItem } from "@/lib/types";
import { revalidatePath } from "next/cache";

function revalidateOrders() {
    revalidatePath("/dashboard");
}

export async function createOrderAction(formData: FormData) {
    try {
        const token = await getToken();

        if (!token) {
            return { success: false, error: "token não fornecido!" };
        }

        const table = Number(formData.get("table"));
        const name = String(formData.get("name") ?? "").trim();

        if (!Number.isInteger(table) || table <= 0) {
            return { success: false, error: "Informe um número de mesa válido." };
        }

        await apiClient<Order>("/order", {
            method: "POST",
            body: JSON.stringify({
                table,
                ...(name ? { name } : {}),
            }),
            token,
        });

        revalidateOrders();

        return { success: true, error: "" };
    } catch (error) {
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }

        return { success: false, error: "Erro ao criar pedido!" };
    }
}

export async function createAndSendOrderAction(payload: {
    table: number;
    name: string;
    items: { product_id: string; amount: number }[];
}) {
    const token = await getToken();

    if (!token) {
        return { success: false, error: "token não fornecido!" };
    }

    const table = Number(payload.table);
    const name = payload.name.trim() || `Mesa ${table}`;
    const items = payload.items.filter((item) => item.amount > 0);

    if (!Number.isInteger(table) || table <= 0) {
        return { success: false, error: "Informe um número de mesa válido." };
    }

    if (items.length === 0) {
        return { success: false, error: "Adicione pelo menos um produto ao pedido." };
    }

    let orderId = "";

    try {
        const order = await apiClient<Order>("/order", {
            method: "POST",
            body: JSON.stringify({
                table,
                name,
            }),
            token,
        });

        orderId = order.id;

        for (const item of items) {
            await apiClient<OrderItem>("/order/add", {
                method: "POST",
                body: JSON.stringify({
                    order_id: order.id,
                    product_id: item.product_id,
                    amount: item.amount,
                }),
                token,
            });
        }

        await apiClient<Order>("/order/send", {
            method: "PUT",
            body: JSON.stringify({
                order_id: order.id,
                name,
            }),
            token,
        });

        revalidateOrders();

        return { success: true, error: "" };
    } catch (error) {
        if (orderId) {
            await apiClient<{ message: string }>(`/order?order_id=${orderId}`, {
                method: "DELETE",
                token,
            }).catch(() => undefined);
        }

        if (error instanceof Error) {
            return { success: false, error: error.message };
        }

        return { success: false, error: "Erro ao enviar pedido para a cozinha!" };
    }
}

export async function addOrderItemAction(formData: FormData) {
    try {
        const token = await getToken();

        if (!token) {
            return { success: false, error: "token não fornecido!" };
        }

        const order_id = String(formData.get("order_id") ?? "");
        const product_id = String(formData.get("product_id") ?? "");
        const amount = Number(formData.get("amount"));

        if (!order_id || !product_id || !Number.isInteger(amount) || amount <= 0) {
            return { success: false, error: "Selecione o produto e uma quantidade válida." };
        }

        await apiClient<OrderItem>("/order/add", {
            method: "POST",
            body: JSON.stringify({
                order_id,
                product_id,
                amount,
            }),
            token,
        });

        revalidateOrders();

        return { success: true, error: "" };
    } catch (error) {
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }

        return { success: false, error: "Erro ao adicionar item!" };
    }
}

export async function removeOrderItemAction(itemId: string) {
    try {
        const token = await getToken();

        if (!token) {
            return { success: false, error: "token não fornecido!" };
        }

        await apiClient<{ message: string }>(`/order/remove?item_id=${itemId}`, {
            method: "DELETE",
            token,
        });

        revalidateOrders();

        return { success: true, error: "" };
    } catch (error) {
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }

        return { success: false, error: "Erro ao remover item!" };
    }
}

export async function sendOrderAction(orderId: string, name: string) {
    try {
        const token = await getToken();

        if (!token) {
            return { success: false, error: "token não fornecido!" };
        }

        const customerName = name.trim();

        if (!customerName) {
            return { success: false, error: "Informe o nome do cliente para enviar o pedido." };
        }

        await apiClient<Order>("/order/send", {
            method: "PUT",
            body: JSON.stringify({
                order_id: orderId,
                name: customerName,
            }),
            token,
        });

        revalidateOrders();

        return { success: true, error: "" };
    } catch (error) {
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }

        return { success: false, error: "Erro ao enviar pedido para a cozinha!" };
    }
}

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

        revalidateOrders();

        return { success: true, error: "" };
    } catch (error) {
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }

        return { success: false, error: "Erro ao finalizar pedido!" };
    }
}

export async function deleteOrderAction(orderId: string) {
    try {
        const token = await getToken();

        if (!token) {
            return { success: false, error: "token não fornecido!" };
        }

        await apiClient<{ message: string }>(`/order?order_id=${orderId}`, {
            method: "DELETE",
            token,
        });

        revalidateOrders();

        return { success: true, error: "" };
    } catch (error) {
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }

        return { success: false, error: "Erro ao excluir pedido!" };
    }
}
