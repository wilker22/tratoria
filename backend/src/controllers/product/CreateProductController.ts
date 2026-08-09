import { Response, Request } from "express";
import { CreateProductService } from "../../services/product/CreateProductService";


class CreateProductController {
    async handle(req: Request, res: Response){
        const createProduct = new CreateProductService();
        const product = await createProduct.execute();
        res.json(product);

    }
}

export { CreateProductController};