import { KeyRound, UserCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ProfilePerfilSeguridadSectionProps = {
  onCambiarContrasena: () => void
}

export function ProfilePerfilSeguridadSection({
  onCambiarContrasena,
}: ProfilePerfilSeguridadSectionProps) {
  return (
    <section
      className={cn(
        "group rounded-2xl border border-border/60 bg-card/70 p-6 shadow-md backdrop-blur-sm transition-all duration-500",
        "hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/10"
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 shadow-sm transition-transform duration-300 hover:rotate-3">
            <UserCircle2 className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              Seguridad de la cuenta
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Actualiza tu contraseña de acceso de forma periódica.
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="secondary"
          className={cn(
            "group h-11 w-full shrink-0 cursor-pointer rounded-2xl px-6 shadow-md transition-all duration-300 sm:w-auto",
            "hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-lg",
            "active:translate-y-0 active:scale-[0.99]"
          )}
          onClick={onCambiarContrasena}
        >
          <KeyRound className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
          Cambiar contraseña
        </Button>
      </div>
    </section>
  )
}
