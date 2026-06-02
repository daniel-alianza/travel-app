import { z } from "zod"

export const gasolineRequestFormSchema = z.object({
  empresa: z.string().min(1, "Selecciona la empresa."),
  sucursal: z.string().optional(),
  area: z.string().min(1, "Selecciona el área."),
  tarjeta: z.string().min(1, "Selecciona la tarjeta de gasolina."),
  matricula: z.string().min(1, "Indica la matrícula o placa."),
  kilometraje: z
    .string()
    .min(1, "Indica el kilometraje actual.")
    .refine(
      (valor) => {
        const numero = Number(valor)
        return Number.isFinite(numero) && numero > 0
      },
      { message: "Indica un kilometraje válido." }
    ),
  ruta: z.string().min(1, "Indica la ruta a tomar."),
  montoSolicitado: z
    .string()
    .min(1, "Indica el monto solicitado.")
    .refine(
      (valor) => {
        const numero = Number(valor)
        return Number.isFinite(numero) && numero > 0
      },
      { message: "Indica un monto válido." }
    ),
  distanciaKm: z
    .string()
    .min(1, "Indica la distancia a recorrer.")
    .refine(
      (valor) => {
        const numero = Number(valor)
        return Number.isFinite(numero) && numero > 0
      },
      { message: "Indica una distancia válida." }
    ),
  comentarios: z.string().optional(),
  fotoOdometro: z.string().min(1, "Sube la foto del odómetro."),
})
