import prismaClient from "../../prisma";

interface RemoveItemProps{
    item_id: string;
}

class RemoveItemOrderService {
    async execute({ item_id }: RemoveItemProps){
        try{
            //verficar se o item existe
            const itemExists = prismaClient.item.findFirst({
                where:{
                    id: item_id,
                },
            });

            if(!itemExists){
                throw new Error("Item não encontrado");
            }

            //deletar item
            await prismaClient.item.delete({
                where:{
                    id: item_id,
                },
            });

            return { message: "item removido com sucesso"};

        }catch(err){
            console.log(err)
            throw new Error("Falha ao tentar remover item!")
        }
    }
}

export { RemoveItemOrderService }