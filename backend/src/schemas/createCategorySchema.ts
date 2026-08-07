import { z } from "zod";

export const createCategorySchema = z.object({
     body: z.object({
        name: z
        .string({ message: "Nome da Categoria tem que ser um texto"})
        .min(2, { message: "Nome da Categoria precisa ter ao menos 2  caracteres."}),
     })
})