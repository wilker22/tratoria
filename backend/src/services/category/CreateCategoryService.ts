import prismaClient from "../../prisma";

interface CreateCategpryProps{
     name: string;
}

class CreateCategoryService{
    async execute({ name }: CreateCategpryProps){
        try{
            const category = await prismaClient.category.create({
                data:{
                    name: name,
                },
                select:{
                    id: true,
                    name: true,
                    createdAt: true,
                },
            });

            return category;

        } catch(err){
            throw new Error( "Falha ao criar categoria!");
        }
    }
}

export { CreateCategoryService };