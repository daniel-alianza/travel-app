import { z } from "zod"

import { EMPRESAS_TARJETA } from "../data/card-assignment-empresas"

const EMPRESAS_TARJETA_TUPLE = EMPRESAS_TARJETA as unknown as [
  string,
  ...string[],
]

export const asignacionTarjetaSchema = z.object({
  digitosTarjeta: z
    .string()
    .min(1, "Ingresa el número completo de la tarjeta")
    .refine((valor) => {
      const soloDigitos = valor.replace(/\D/g, "")
      return soloDigitos.length >= 13 && soloDigitos.length <= 19
    }, "Debes escribir toda la tarjeta: entre 13 y 19 dígitos (sin omitir dígitos)"),
  empresaTarjeta: z.enum(EMPRESAS_TARJETA_TUPLE, {
    message: "Selecciona la empresa",
  }),
})

export type AsignacionTarjetaFormValues = z.infer<typeof asignacionTarjetaSchema>
