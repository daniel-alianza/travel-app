import { z } from "zod"

export const expenseFacturaComprobacionSchema = z.object({
  categoriaViatico: z.string().trim().min(1, "Selecciona el tipo de gasto."),
  comentario: z
    .string()
    .trim()
    .min(1, "Escribe un comentario describiendo el gasto.")
    .min(
      10,
      "El comentario debe tener al menos 10 caracteres y ser concreto. Ejemplos: «desayuno con el cliente», «hospedaje una noche en Monterrey», «gasolina ruta CDMX–Querétaro».",
    ),
})

export type ExpenseFacturaComprobacionFormValues = z.infer<
  typeof expenseFacturaComprobacionSchema
>
