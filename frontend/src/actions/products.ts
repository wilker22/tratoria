"use server";

import { apiClient } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Product } from "@/lib/types";
import { revalidatePath } from "next/cache";


export async function createProductAction(formData: FormData) {
    try {
        const token = await getToken();

        if (!token) {
            return { success: false, error: "token não fornecido!" };
        }

        const name = formData.get("name");
        const price = formData.get("price");
        const description = formData.get("description");
        const category_id = formData.get("category_id");
        const file = formData.get("file");

        if (!name || !price || !description || !category_id || !(file instanceof File) || file.size === 0) {
            return { success: false, error: "Preencha todos os campos e envie uma imagem." };
        }

        const parsedPrice = Number(String(price).replace(",", "."));

        if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
            return { success: false, error: "Informe um preço válido." };
        }

        const payload = new FormData();
        payload.append("name", String(name));
        payload.append("price", String(Math.round(parsedPrice * 100)));
        payload.append("description", String(description));
        payload.append("category_id", String(category_id));
        payload.append("file", file);

        await apiClient<Product>("/product", {
            method: "POST",
            body: payload,
            token,
        });

        revalidatePath("/dashboard/products");

        return { success: true, error: "" };
    } catch (error) {
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }

        return { success: false, error: "Erro ao criar produto!" };
    }
}

export async function deleteProductAction(productId: string) {
    try {
        const token = await getToken();

        if (!token) {
            return { success: false, error: "token não fornecido!" };
        }

        await apiClient<{ message: string }>(`/product?product_id=${productId}`, {
            method: "DELETE",
            token,
        });

        revalidatePath("/dashboard/products");

        return { success: true, error: "" };
    } catch (error) {
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }

        return { success: false, error: "Erro ao excluir produto!" };
    }
}
