import { Request, Response } from "express";
import { FinishOrderService } from "../../services/order/FinishOrderService";

class FinishOrderController {
    async handle(req: Request, res: Response){
        const { order_id, name } = req.body;
        const sendOrder = new FinishOrderService();
        const order = await sendOrder.execute({order_id: order_id});

        res.json(order);
    }
}

export { FinishOrderController };