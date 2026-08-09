import { Request, Response } from "express";
import { ListCategoryService } from "../../services/category/ListCatgoryService";


class ListCategoryController {
    async handle(req: Request, res:Response ){
        const listCategory = new ListCategoryService();

        const categories = await listCategory.execute();

        res.status(200).json(categories);
    }
}

export { ListCategoryController };