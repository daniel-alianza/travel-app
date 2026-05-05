import { z } from "zod"

export const asignacionTarjetaSchema = z.object({
  nombreTarjeta: z.string().optional(),
  digitosTarjeta: z
    .string()
    .min(1, "Ingresa el número completo de la tarjeta")
    .refine((valor) => {
      const soloDigitos = valor.replace(/\D/g, "")
      return soloDigitos.length >= 13 && soloDigitos.length <= 19
    }, "Debes escribir toda la tarjeta: entre 13 y 19 dígitos (sin omitir dígitos)"),
  tipoTarjetaGasolina: z.string().optional(),
  tipoAsignacionGasolina: z.string().optional(),
  grupoTarjetaGasolina: z.string().optional(),
  estadoTarjetaGasolina: z.string().optional(),
  empresaTarjeta: z.string().min(1, "Selecciona la empresa"),
})

export type AsignacionTarjetaFormValues = z.infer<typeof asignacionTarjetaSchema>
