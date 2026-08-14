import prismaClient from "../../prisma/index";

interface DetailOrderProps {
  order_id: string;
}

class DetailOrderService {
  async execute({ order_id }: DetailOrderProps) {
    try {
      // Buscar a order com todos os detalhes
      const order = await prismaClient.order.findFirst({
        where: {
          id: order_id,
        },
        select: {
          id: true,
          table: true,
          name: true,
          draft: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          items: {
            select: {
              id: true,
              amount: true,
              createdAt: true,
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  description: true,
                  banner: true,
                },
              },
            },
          },
        },
      });

      if (!order) {
        throw new Error("Ordem não encontrada");
      }

      return order;
    } catch (err) {
      console.log(err);
      throw new Error("Falha ao buscar detalhes da ordem");
    }
  }
}

export { DetailOrderService };
