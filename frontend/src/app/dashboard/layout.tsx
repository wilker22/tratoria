import { requiredAdmin } from "@/lib/auth"

export default async function DashboardLayout({
    children
}: {
    children: React.ReactNode
}){

    const user = await requiredAdmin();

    return(
        
        <div>
            
            {children}
        </div>
    )
}