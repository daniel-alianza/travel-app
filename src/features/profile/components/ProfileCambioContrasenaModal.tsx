import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog } from "radix-ui"
import { KeyRound, Loader2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  cambioContrasenaPerfilSchema,
  type CambioContrasenaPerfilFormValues,
} from "@/features/profile/schemas/cambio-contrasena-perfil.schema"
import { cn } from "@/lib/utils"

type ProfileCambioContrasenaModalProps = {
  abierto: boolean
  onAbiertoChange: (abierto: boolean) => void
  enviando: boolean
  onConfirmar: (valores: CambioContrasenaPerfilFormValues) => Promise<void>
}

export function ProfileCambioContrasenaModal({
  abierto,
  onAbiertoChange,
  enviando,
  onConfirmar,
}: ProfileCambioContrasenaModalProps) {
  const formulario = useForm<CambioContrasenaPerfilFormValues>({
    resolver: zodResolver(cambioContrasenaPerfilSchema),
    defaultValues: {
      contrasenaActual: "",
      contrasenaNueva: "",
      contrasenaConfirmacion: "",
    },
  })

  const { register, handleSubmit, reset, formState } = formulario

  useEffect(() => {
    if (abierto) {
      reset({
        contrasenaActual: "",
        contrasenaNueva: "",
        contrasenaConfirmacion: "",
      })
    }
  }, [abierto, reset])

  return (
    <Dialog.Root
      open={abierto}
      onOpenChange={(siguiente) => {
        if (!enviando) {
          onAbiertoChange(siguiente)
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-background/80 backdrop-blur-md",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
          )}
        />
        <Dialog.Content
          className={cn(
            "fixed top-1/2 left-1/2 z-50 flex max-h-[min(90vh,520px)] w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-3xl border border-border/60 bg-card shadow-2xl duration-200",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
          )}
          onPointerDownOutside={(evento) => {
            if (enviando) {
              evento.preventDefault()
            }
          }}
          onEscapeKeyDown={(evento) => {
            if (enviando) {
              evento.preventDefault()
            }
          }}
        >
          <Dialog.Title className="sr-only">Cambiar contraseña</Dialog.Title>
          <Dialog.Description className="sr-only">
            Introduce tu contraseña actual y la nueva contraseña dos veces.
          </Dialog.Description>
          <div className="flex items-start justify-between gap-3 border-b border-border/50 px-5 py-4 sm:px-6">
            <div className="flex min-w-0 gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                <KeyRound className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Seguridad
                </p>
                <h3 className="font-(family-name:--font-heading) mt-1 text-lg font-semibold tracking-tight text-foreground">
                  Cambiar contraseña
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Usa una contraseña fuerte que no reutilices en otros sitios.
                </p>
              </div>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                disabled={enviando}
                className="group/close flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-2xl border border-transparent text-muted-foreground transition-all duration-300 hover:border-border hover:bg-muted hover:text-foreground hover:shadow-md disabled:pointer-events-none disabled:opacity-40"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5 transition-transform duration-300 group-hover/close:rotate-90" />
              </button>
            </Dialog.Close>
          </div>

          <form
            className="flex min-h-0 flex-1 flex-col"
            onSubmit={handleSubmit(async (valores) => {
              await onConfirmar(valores)
            })}
          >
            <div className="space-y-4 overflow-y-auto px-5 py-5 sm:px-6">
              <div className="space-y-2">
                <Label htmlFor="perfil-contrasena-actual">Contraseña actual</Label>
                <Input
                  id="perfil-contrasena-actual"
                  type="password"
                  autoComplete="current-password"
                  disabled={enviando}
                  className="h-11 rounded-2xl border-border/70 bg-background/80"
                  {...register("contrasenaActual")}
                />
                {formState.errors.contrasenaActual ? (
                  <p className="text-sm text-destructive">
                    {formState.errors.contrasenaActual.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="perfil-contrasena-nueva">Nueva contraseña</Label>
                <Input
                  id="perfil-contrasena-nueva"
                  type="password"
                  autoComplete="new-password"
                  disabled={enviando}
                  className="h-11 rounded-2xl border-border/70 bg-background/80"
                  {...register("contrasenaNueva")}
                />
                {formState.errors.contrasenaNueva ? (
                  <p className="text-sm text-destructive">
                    {formState.errors.contrasenaNueva.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="perfil-contrasena-confirmar">
                  Confirmar nueva contraseña
                </Label>
                <Input
                  id="perfil-contrasena-confirmar"
                  type="password"
                  autoComplete="new-password"
                  disabled={enviando}
                  className="h-11 rounded-2xl border-border/70 bg-background/80"
                  {...register("contrasenaConfirmacion")}
                />
                {formState.errors.contrasenaConfirmacion ? (
                  <p className="text-sm text-destructive">
                    {formState.errors.contrasenaConfirmacion.message}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="flex flex-col gap-2 border-t border-border/50 bg-muted/20 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
              <Dialog.Close asChild>
                <Button
                  type="button"
                  variant="ghost"
                  disabled={enviando}
                  className="h-11 w-full cursor-pointer rounded-2xl sm:w-auto"
                >
                  Cancelar
                </Button>
              </Dialog.Close>
              <Button
                type="submit"
                disabled={enviando}
                className="h-11 w-full cursor-pointer rounded-2xl shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:w-auto"
              >
                {enviando ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando…
                  </>
                ) : (
                  "Guardar contraseña"
                )}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
