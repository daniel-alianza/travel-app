import { z } from "zod"

export const expenseTicketComprobacionSchema = z.object({
  categoriaViatico: z.string().trim().min(1, "Selecciona el tipo de gasto."),
  motivo: z
    .string()
    .trim()
    .min(1, "Indica el motivo (ej. pago de servicios, consumo en restaurante)."),
  descripcion: z
    .string()
    .trim()
    .min(1, "Describe el concepto del gasto."),
  comentario: z
    .string()
    .trim()
    .min(10, "Obligatorio: indica de qué es el gasto (alimentos, hospedaje, servicios, etc.)."),
})

export type ExpenseTicketComprobacionFormValues = z.infer<
  typeof expenseTicketComprobacionSchema
>
