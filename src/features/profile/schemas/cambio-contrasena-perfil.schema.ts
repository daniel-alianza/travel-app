import { z } from "zod"

export const cambioContrasenaPerfilSchema = z
  .object({
    contrasenaActual: z.string().min(1, "Ingresa tu contraseña actual."),
    contrasenaNueva: z
      .string()
      .min(8, "La nueva contraseña debe tener al menos 8 caracteres."),
    contrasenaConfirmacion: z.string().min(1, "Confirma la nueva contraseña."),
  })
  .refine((valores) => valores.contrasenaNueva === valores.contrasenaConfirmacion, {
    message: "La confirmación no coincide con la nueva contraseña.",
    path: ["contrasenaConfirmacion"],
  })

export type CambioContrasenaPerfilFormValues = z.infer<
  typeof cambioContrasenaPerfilSchema
>
