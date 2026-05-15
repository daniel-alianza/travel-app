import { z } from "zod"

export const expenseTicketComprobacionSchema = z.object({
  categoriaViatico: z.string().trim().min(1, "Selecciona el tipo de gasto."),
  motivo: z
    .string()
    .trim()
    .min(
      1,
      "Indica el motivo (ej. pago de servicios, consumo en restaurante)."
    ),
  descripcion: z.string().trim().min(1, "Describe el concepto del gasto."),
  comentario: z
    .string()
    .trim()
    .min(1, "Escribe un comentario describiendo el gasto.")
    .min(
      10,
      "El comentario debe tener al menos 10 caracteres y ser concreto. Ejemplos: «desayuno con el cliente», «hospedaje una noche en Monterrey», «casetas autopista ida y vuelta».",
    ),
})

export type ExpenseTicketComprobacionFormValues = z.infer<
  typeof expenseTicketComprobacionSchema
>
