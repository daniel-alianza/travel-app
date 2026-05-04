import { z } from "zod"

export const expenseFacturaComprobacionSchema = z.object({
  categoriaViatico: z.string().trim().min(1, "Selecciona el tipo de gasto."),
  comentario: z
    .string()
    .trim()
    .min(
      10,
      "Obligatorio: indica de qué es el gasto (alimentos, hospedaje, servicios, etc.)."
    ),
})

export type ExpenseFacturaComprobacionFormValues = z.infer<
  typeof expenseFacturaComprobacionSchema
>
