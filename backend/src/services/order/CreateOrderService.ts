import prismaClient from "../../prisma";

interface CreateOrderProps {
  table: number;
  name: string;
}

class CreateOrderService {
  async execute({ table, name }: CreateOrderProps) {
    try {
      const order = await prismaClient.order.create({
        data: {
          table,
          name: name ?? "",
        },
        select: {
          id: true,
          table: true,
          name: true,
          status: true,
          draft: true,
          createdAt: true,
        },
      });

      return order;
    } catch (err) {
      throw new Error("Falha ao criar pedido!");
    }
  }
}

export { CreateOrderService };
