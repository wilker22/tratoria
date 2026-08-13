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
