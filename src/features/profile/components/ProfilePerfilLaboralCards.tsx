import { Building2, MapPin, Network, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { PerfilLaboralVista } from "@/features/profile/interfaces/perfil-laboral-vista.interface"
import { cn } from "@/lib/utils"

type ProfilePerfilLaboralCardsProps = {
  perfil: PerfilLaboralVista
  jefeDirectoActual: string
  etiquetaBotonJefeDirecto: string
  onSolicitarCambioJefe: () => void
}

export function ProfilePerfilLaboralCards({
  perfil,
  jefeDirectoActual,
  etiquetaBotonJefeDirecto,
  onSolicitarCambioJefe,
}: ProfilePerfilLaboralCardsProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2">
      <article
        className={cn(
          "group rounded-2xl border border-border/60 bg-card/70 p-5 shadow-md backdrop-blur-sm transition-all duration-300",
          "hover:-translate-y-1 hover:cursor-default hover:shadow-xl hover:shadow-primary/10"
        )}
      >
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <Network className="h-4 w-4 text-primary transition-transform duration-300 group-hover:rotate-6" />
          Área
        </div>
        <p className="text-base font-medium text-foreground">{perfil.area}</p>
      </article>

      <article
        className={cn(
          "group rounded-2xl border border-border/60 bg-card/70 p-5 shadow-md backdrop-blur-sm transition-all duration-300",
          "hover:-translate-y-1 hover:cursor-default hover:shadow-xl hover:shadow-primary/10"
        )}
      >
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <Building2 className="h-4 w-4 text-primary transition-transform duration-300 group-hover:-rotate-6" />
          Departamento
        </div>
        <p className="text-base font-medium text-foreground">
          {perfil.departamento}
        </p>
      </article>

      {perfil.sucursal !== null && perfil.sucursal.trim() !== "" ? (
        <article
          className={cn(
            "group rounded-2xl border border-border/60 bg-card/70 p-5 shadow-md backdrop-blur-sm transition-all duration-300 sm:col-span-2",
            "hover:-translate-y-1 hover:cursor-default hover:shadow-xl hover:shadow-primary/10"
          )}
        >
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary transition-transform duration-300 group-hover:-translate-y-0.5" />
            Sucursal
          </div>
          <p className="text-base font-medium text-foreground">
            {perfil.sucursal}
          </p>
        </article>
      ) : null}

      <article
        className={cn(
          "group rounded-2xl border border-border/60 bg-card/70 p-5 shadow-md backdrop-blur-sm transition-all duration-300 sm:col-span-2",
          "hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10"
        )}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <div className="min-w-0 flex-1">
            <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <Users className="h-4 w-4 shrink-0 text-primary transition-transform duration-300 group-hover:scale-110" />
              <span>Jefe directo / a quien reportas</span>
            </div>
            <p className="text-base font-medium text-foreground">
              {jefeDirectoActual}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={onSolicitarCambioJefe}
            className={cn(
              "h-10 w-full shrink-0 cursor-pointer rounded-2xl px-4 text-sm font-medium shadow-sm transition-all duration-300 sm:mt-7 sm:h-9 sm:w-auto sm:self-start",
              "hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5 hover:shadow-md",
              "active:translate-y-0"
            )}
          >
            {etiquetaBotonJefeDirecto}
          </Button>
        </div>
      </article>
    </section>
  )
}
