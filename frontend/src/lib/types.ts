export interface User{
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "STAFF";
    createdAt: string;

}

export interface AuthResponse {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "STAFF";
    token: string;
}

export interface Category{
    id: string,
    name: string,
    createdAt: string,
}

export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    banner: string;
    disabled: boolean;
    category_id: string;
    createdAt: string;
    category: {
        id: string;
        name: string;
    };
}

export interface OrderItem {
    id: string;
    amount: number;
    product: {
        id: string;
        name: string;
        price: number;
        description: string;
        banner: string;
    };
}

export interface Order {
    id: string;
    table: number;
    name: string | null;
    draft: boolean;
    status: boolean;
    createdAt: string;
    items: OrderItem[];
}