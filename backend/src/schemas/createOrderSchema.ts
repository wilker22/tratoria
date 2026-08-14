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
  })
})
