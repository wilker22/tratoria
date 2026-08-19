import { Sidebar } from "@/components/dashboard/sidebar";
import { requiredAdmin } from "@/lib/auth"

export default async function DashboardLayout({
    children
}: {
    children: React.ReactNode
}){

    const user = await requiredAdmin();

    return(
        
        <div className="flex h-screen overflow-hidden text-white">
           
            {/*SIDEBAR PARA AMBIENTE DESKTOP*/}
            <Sidebar userName={user.name} />
           
           
            {children}
        </div>
    )
}