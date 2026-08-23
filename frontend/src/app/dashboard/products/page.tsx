import { ProductForm } from "@/components/dashboard/product-form";
import { DeleteProductButton } from "@/components/dashboard/delete-product-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Category, Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Package } from "lucide-react";

export default async function Products() {
    const token = await getToken();
    const [products, categories] = await Promise.all([
        apiClient<Product[]>("/products?disabled=false", {
            token: token!,
        }),
        apiClient<Category[]>("/category", {
            token: token!,
        }),
    ]);

    return (
        <div className="space-y-4 sm:space-y-6 font-mono">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">Produtos</h1>
                    <p className="text-xs sm:text-base mt-1">
                        Cadastre e gerencie os produtos do cardápio
                    </p>
                </div>

                <ProductForm categories={categories} />
            </div>

            {products.length === 0 ? (
                <Card className="bg-app-card border-app-border text-white">
                    <CardContent className="flex flex-col items-center justify-center gap-2 py-10">
                        <Package className="h-8 w-8 text-gray-400" />
                        <p className="text-sm text-gray-300">
                            Nenhum produto cadastrado.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((product) => (
                        <Card
                            key={product.id}
                            className="bg-app-card border-app-border transition-shadow hover:shadow-md text-white overflow-hidden"
                        >
                            <img
                                src={product.banner}
                                alt={product.name}
                                className="h-40 w-full object-cover"
                            />
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                                    <Package className="w-5 h-5 shrink-0" />
                                    <span>{product.name}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <p className="text-sm text-gray-200 line-clamp-2">
                                    {product.description}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {product.category.name}
                                </p>
                                <p className="font-semibold text-brand-primary">
                                    {formatCurrency(product.price)}
                                </p>
                                <DeleteProductButton productId={product.id} />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
