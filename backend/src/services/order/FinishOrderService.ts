import prismaClient from "../../prisma";

interface FinishOrderProps{
    order_id: string;
    
};


class FinishOrderService {
    async execute({order_id}: FinishOrderProps){
        try{
            //verifica se a order existe
            const order = prismaClient.order.findFirst({
                where:{
                    id: order_id,
                },
            })

            if(!order){
                throw new Error("Order não encontrada!")
            }

            //atualiza a propriedade "status" para true
            const updateOrder = prismaClient.order.update({
                where:{
                    id: order_id,
                },
                data:{
                    status: true,
                },
                select:{
                    id: true,
                    name: true,
                    table: true,
                    draft: true,
                    status: true,
                    createdAt: true,
                },

            });

            return updateOrder;

        }catch(err){
            console.log(err);
            throw new Error("Falha ao atualiar o status!");
        }
    }
}

export { FinishOrderService };