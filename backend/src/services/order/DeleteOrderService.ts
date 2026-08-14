import prismaClient from "../../prisma";

interface DeleteOrderProps{
    order_id: string;
}


class DeleteOrderService {
    async execute({ order_id }: DeleteOrderProps){
        try{
            //verifica se order existe
            const order = await prismaClient.order.findFirst({
                where:{
                    id: order_id,
                }
            })
            if(!order){
                throw new Error ("Order não encontrada!");
            }

            //deletar order
            const deleteOrder = await prismaClient.order.delete({
                where:{
                    id: order_id,
                }
            });

            return ({message: "Order excluída com sucesso!" });

        }catch(err){
            console.log(err);
            throw new Error("Falha ao remover uma order!");
        }
    }
}

export { DeleteOrderService };