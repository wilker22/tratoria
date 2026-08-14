import { z } from "zod";

export const createOrderSchema = z.object({
  body: z.object({
    table: z
      .number({ message: "O número da mesa deve ser um número inteiro" })
      .int({ message: "O número da mesa deve ser um número inteiro" })
      .positive({ message: "O número da mesa deve ser maior que zero" }),
    name: z
      .string({ message: "O nome do cliente deve ser um texto" }).optional(),
      
  }),
});

export const addItemSchema = z.object({
  body: z.object({
    order_id: z.string({message: "Order deve ser uma string"}).min(1, "O order_id é obrigatório"),
    amount: z.number().int("Quantidade deve ser número inteiro").positive("quantidade deve ser número positivo"),
    product_id: z.string({message: "Produto deve ser uma string"}).min(1, "O product_id é obrigatório"),
  }),
});

export const removeItemSchema = z.object({
  query: z.object({
    item_id: z.string({ message: "Item ID deve ser uma string!"}).min(1, "O item ID é obrigatório!"),
  }),
});

export const detailOrderSchema = z.object({
  query: z.object({
    order_id: z.string({ message: "Orde ID deve ser uma string"}).min(1, "Order ID é obrigatório"),
  }),
});

export const sendOrderSchema = z.object({
  body: z.object({
    order_id: z.string({ message: "ID do pedido precisa ser uma string" }),
    name: z.string({ message: "O nome precisa ser um texto" }),
  }),
});

export const finishOrderSchema = z.object({
  body: z.object({
    order_id: z.string({ message: "ID do pedido precisa ser uma string" }),
    
  }),
});

