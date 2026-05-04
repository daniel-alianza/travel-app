import { Mail, Shield } from "lucide-react"

import type { PerfilLaboralVista } from "@/features/profile/interfaces/perfil-laboral-vista.interface"
import { cn } from "@/lib/utils"

type ProfilePerfilHeroSectionProps = {
  perfil: PerfilLaboralVista
  iniciales: string
}

export function ProfilePerfilHeroSection({
  perfil,
  iniciales,
}: ProfilePerfilHeroSectionProps) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-3xl border border-border/60 bg-card/85 p-6 shadow-2xl shadow-primary/10 backdrop-blur-md transition-all duration-500",
        "hover:shadow-[0_24px_60px_-12px] hover:shadow-primary/15"
      )}
    >
      <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
        <div className="group relative shrink-0">
          <div
            className={cn(
              "relative flex h-28 w-28 items-center justify-center rounded-full bg-linear-to-br from-primary/90 via-primary to-primary/70 text-2xl font-semibold text-primary-foreground shadow-xl",
              "ring-4 ring-primary/20 transition-all duration-500 ease-out",
              "group-hover:rotate-3 group-hover:scale-105 group-hover:shadow-2xl group-hover:ring-primary/35",
              "cursor-default select-none"
            )}
            aria-hidden
          >
            {iniciales}
          </div>
          <div
            className="pointer-events-none absolute inset-0 rounded-full bg-linear-to-tr from-white/25 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            aria-hidden
          />
          <div
            className="absolute -right-1 -bottom-1 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border/70 bg-background/95 shadow-lg transition-all duration-300 hover:rotate-12 hover:scale-110 hover:shadow-xl"
            title="Estado de cuenta"
          >
            <Shield className="h-5 w-5 text-primary" />
          </div>
        </div>

        <div className="min-w-0 flex-1 text-center sm:text-left">
          <h2 className="font-(family-name:--font-heading) text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {perfil.nombreCompleto}
          </h2>
          <p className="mt-2 inline-flex max-w-full items-center justify-center gap-2 text-sm text-muted-foreground sm:justify-start">
            <Mail className="h-4 w-4 shrink-0 text-primary/80" />
            <span className="truncate">{perfil.correoElectronico}</span>
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
            <span className="inline-flex cursor-default items-center rounded-full border border-border/70 bg-secondary/60 px-3 py-1 text-xs font-medium text-secondary-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
              Activo en la plataforma
            </span>
            <span className="inline-flex cursor-default items-center rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-medium text-primary transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
              Colaborador
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
