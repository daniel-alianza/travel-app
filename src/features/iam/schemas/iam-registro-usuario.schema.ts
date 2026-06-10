import { z } from "zod"

export const iamRegistroUsuarioSchema = z
  .object({
    nombre: z.string().trim().min(1, "Ingresa el nombre completo."),
    correoElectronico: z
      .string()
      .trim()
      .min(1, "Ingresa el correo electrónico.")
      .email("Correo electrónico no válido."),
    contrasena: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres."),
    contrasenaConfirmacion: z
      .string()
      .min(1, "Confirma la contraseña."),
    empresaId: z.string().min(1, "Selecciona una empresa."),
    areaId: z.string().min(1, "Selecciona un área."),
    sucursalId: z.string().min(1, "Selecciona una sucursal."),
    rol: z.string().min(1, "Selecciona un rol."),
  })
  .refine((valores) => valores.contrasena === valores.contrasenaConfirmacion, {
    message: "La confirmación no coincide con la contraseña.",
    path: ["contrasenaConfirmacion"],
  })

export type IamRegistroUsuarioFormValues = z.infer<
  typeof iamRegistroUsuarioSchema
>
