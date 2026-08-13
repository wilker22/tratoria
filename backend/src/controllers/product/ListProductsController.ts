import { Request, Response } from "express";
import { ListProductService } from "../../services/product/LIstProductService";

class ListProductsController {
    async handle(req: Request, res: Response){
        const disabled = req.query.disabled as string | undefined;
        const listProducts = new ListProductService();
        const products = await listProducts.execute({
            disabled: disabled ?? false,
        });

        res.status(200).json(products);
    }
}

export { ListProductsController};

