"use client"
import { cn } from "@/lib/utils";
import { Package, ShoppingCart, Tags } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps{
    userName: string;
}

const menuItems = [
    {
        title: "Pedidos",
        href: "/dashboard",
        icon: ShoppingCart
    },
    
    {
        title: "Produtos",
        href: "/dashboard/products",
        icon: Package
    },

    {
        title: "Categorias",
        href: "/dashboard/categories",
        icon: Tags
    },
]


export function Sidebar({ userName }: SidebarProps) {

    const pathName = usePathname();

    return(
        <aside className="hidden lg:flex flex-col h-screen w-64 border-r border-app-border bg-app-sidebar font-mono">
            {/** HEADER DA SIDEBAR */}
            <div className="border-b border-app-border p-6">
                <h2 className="text-x1 font-bold text-white">
                    WJ<span className="text-brand-primary">Pizzaria</span>
                </h2>
                <p className="text-sm text-gray-300">Olá {userName}, seja benvindo!</p>
            </div>    

            {/** MENU */}
            <nav className="flex-1 p-4 space-y-4">
                {menuItems.map( menu => {
                    
                    const Icon = menu.icon;
                    const isActive = pathName === menu.href

                    return(
                        <Link 
                            href={menu.href} 
                            key={menu.title} 
                            className={cn(
                                "flex items-center gap-3  px-3 py-2 text-sm rounded-md font-medium transition-colors duration-300",
                                isActive ? "bg-brand-primary text-white" : "hover:bg-gray-600"
                            )}
                        >
                            
                            <Icon className="w-5 h-5" />
                            
                            {menu.title}
                        </Link>
                    )
                })}
            </nav>

        </aside>
    );
}