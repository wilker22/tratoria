import { Readable } from "node:stream";
import cloudinary from "../../config/cloudinary";
import prismaClient from "../../prisma";


interface CreateProductServiceProps{
    name: string;
    price: number;
    description: string;
    category_id: string;
    imageBuffer: Buffer;
    imageName: string;
}

class CreateProductService {
    async execute ({ 
        name, price, description, category_id, imageBuffer, imageName}: CreateProductServiceProps) {
        
            const categoryExists = await prismaClient.category.findFirst({
                where:{
                    id: category_id,
                }
            })
            if(!categoryExists){
                throw new Error("Categoria não encontrada!");
            }
            //enviar para o cloudinary
            //salvar a url da imagem e os dados no banco de dados como novo produto
            let bannerUrl = "";

            try{
                const result = await new Promise<any>((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream({
                        folder: "products",
                        resource_type: "image",
                        public_id: `${Date.now()}-${imageName.split(".")[0]}`
                    }, (error, result) => {
                        if(error) reject(error);
                        else resolve(result);
                    })

                    //criar o stream do buffer fazer o pipe para o cloudinary
                    const bufferStream = Readable.from(imageBuffer)
                    bufferStream.pipe(uploadStream)
                }) 
                console.log(result);

            }catch(error){
                console.log(error);
                throw new Error("Erro ao fazer upload da imagem!")
            }


            return "produto"
    }
}

export {CreateProductService};